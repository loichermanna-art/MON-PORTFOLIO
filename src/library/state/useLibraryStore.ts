import { create } from 'zustand';
import type { ProjectCaseStudy } from '../../data/portfolioData';
import {
  ROOMS_3D,
  WORLD_STATIONS_3D,
  clampWalkablePosition,
  computeAnglesToTarget,
  getEyeHeightAtZ,
  getStationById,
  getStationsForRoom,
} from '../data/worldStations';

export type PortalPhase = 'vestibule' | 'opening' | 'threshold';
export type DossierTab =
  | 'overview'
  | 'archives'
  | 'collections'
  | 'projects'
  | 'methods'
  | 'contact';
export type DeviceTier = 'desktop' | 'tablet' | 'mobile';

/**
 * High-frequency 60Hz spatial state mutated & read inside R3F `useFrame`
 * without triggering React re-renders (`r3f-best-practices`).
 */
export const libraryMotionState = {
  // Current 3D visitor eye coordinates & gaze (YXZ Euler)
  camX: 0,
  camY: 1.66,
  camZ: 11.2,
  yaw: 0,
  pitch: 0.025,

  // Inertial look targets for silky-smooth drag-to-look
  lookTargetYaw: 0,
  lookTargetPitch: 0.025,

  // Smooth momentum scroll velocity along the gallery spine (m/s)
  scrollVelZ: 0,

  // Parametric S-Curve Cinema Dolly Glide (zero jerk, zero slow tail, zero doorway clipping)
  glideActive: false,
  glideElapsed: 0,
  glideDuration: 0.72,
  glideStartX: 0,
  glideStartZ: 11.2,
  glideMidX: 0,
  glideTargetX: 0,
  glideTargetZ: 11.2,
  glideStartYaw: 0,
  glideStartPitch: 0.025,
  glideTargetYaw: 0,
  glideTargetPitch: 0.025,
  glideLockGaze: false,

  // Disambiguate drag-to-look from click-to-walk / click-tableau
  lastDragEndMs: -Infinity,

  // On-screen touch / virtual inputs (-1, 0, +1)
  virtualMoveForward: 0,
  virtualMoveStrafe: 0,
  virtualTurn: 0,

  // Monumental entrance double-door swing [0..1]
  doorOpenProgress: 0,
  // Normalized progress [0..1] across entire building depth (z=+8.2 -> z=-103)
  currentProgress: 0,
  targetProgress: 0,

  // Subtle cursor parallax [-1..+1]
  pointerX: 0,
  pointerY: 0,
  isTabHidden: false,
};

export function shortestYawTarget(currentYaw: number, desiredYaw: number): number {
  const twoPi = Math.PI * 2;
  const delta =
    ((((desiredYaw - currentYaw) % twoPi) + twoPi + Math.PI) % twoPi) - Math.PI;
  return currentYaw + delta;
}

function launchSmoothGlide(opts: {
  targetX: number;
  targetZ: number;
  targetYaw: number;
  targetPitch: number;
  lockGaze: boolean;
  reducedMotion: boolean;
}) {
  const { targetX, targetZ, targetYaw, targetPitch, lockGaze, reducedMotion } =
    opts;
  const resolvedYaw = shortestYawTarget(libraryMotionState.yaw, targetYaw);

  if (reducedMotion) {
    libraryMotionState.camX = targetX;
    libraryMotionState.camZ = targetZ;
    libraryMotionState.camY = getEyeHeightAtZ(targetZ);
    if (lockGaze) {
      libraryMotionState.yaw = resolvedYaw;
      libraryMotionState.pitch = targetPitch;
    }
    libraryMotionState.lookTargetYaw = libraryMotionState.yaw;
    libraryMotionState.lookTargetPitch = libraryMotionState.pitch;
    libraryMotionState.glideTargetX = targetX;
    libraryMotionState.glideTargetZ = targetZ;
    libraryMotionState.glideTargetYaw = resolvedYaw;
    libraryMotionState.glideTargetPitch = targetPitch;
    libraryMotionState.scrollVelZ = 0;
    libraryMotionState.glideActive = false;
    return;
  }

  const dist = Math.hypot(
    targetX - libraryMotionState.camX,
    targetZ - libraryMotionState.camZ
  );
  const angDelta = Math.hypot(
    resolvedYaw - libraryMotionState.yaw,
    targetPitch - libraryMotionState.pitch
  );

  // Adaptive duration: snappy 0.52s for nearby clicks, silky 0.85s–1.18s for cross-room flights
  const duration = Math.min(
    4.5,
    Math.max(0.5, 0.4 + dist / 22 + angDelta * 0.12)
  );

  // Route long cross-room flights gently through central corridor (x=0) so portals never clip
  const crossesCorridor = Math.abs(targetZ - libraryMotionState.camZ) > 7.5;
  const midX = crossesCorridor
    ? 0
    : (libraryMotionState.camX + targetX) * 0.5;

  libraryMotionState.glideStartX = libraryMotionState.camX;
  libraryMotionState.glideStartZ = libraryMotionState.camZ;
  libraryMotionState.glideMidX = midX;
  libraryMotionState.glideTargetX = targetX;
  libraryMotionState.glideTargetZ = targetZ;

  libraryMotionState.glideStartYaw = libraryMotionState.yaw;
  libraryMotionState.glideStartPitch = libraryMotionState.pitch;
  libraryMotionState.glideTargetYaw = resolvedYaw;
  libraryMotionState.glideTargetPitch = targetPitch;
  libraryMotionState.lookTargetYaw = resolvedYaw;
  libraryMotionState.lookTargetPitch = targetPitch;

  libraryMotionState.glideElapsed = 0;
  libraryMotionState.glideDuration = duration;
  libraryMotionState.glideLockGaze = lockGaze;
  libraryMotionState.scrollVelZ = 0;
  libraryMotionState.glideActive = true;
}

interface LibraryUIState {
  portalPhase: PortalPhase;
  doorHovered: boolean;
  sceneReady: boolean;

  // 3D Spatial Navigation State
  activeRoomIndex: number;
  inspectedStationId: string | null;
  stationSlideIndex: number;
  hoveredStationLabel: string | null;
  hasStartedWalking: boolean;
  guidedTourPlaying: boolean;
  projectVisualIndex: Record<string, number>;

  // Accessible Text Catalogue Fallback Modal
  dossierOpen: boolean;
  dossierTab: DossierTab;
  selectedProjectId: ProjectCaseStudy['id'] | null;
  selectedCollectionId: string;

  // Preferences & Device
  atmosphereMood: 'twilight' | 'night' | 'day';
  reducedMotion: boolean;
  manualReducedMotion: boolean | null;
  deviceTier: DeviceTier;

  // Actions
  setPortalPhase: (phase: PortalPhase) => void;
  setDoorHovered: (hovered: boolean) => void;
  setSceneReady: (ready: boolean) => void;
  setActiveRoomIndex: (roomIndex: number) => void;
  markStartedWalking: () => void;
  setHoveredStationLabel: (label: string | null) => void;
  toggleGuidedTour: () => void;
  stopGuidedTour: () => void;
  cycleAtmosphereMood: () => void;

  /** Physically walk/glide in 3D to one of the 6 rooms (0..5) */
  walkToRoom: (roomIndex: number) => void;
  /** Physically walk/glide to a clicked 3D point on the floor */
  walkToFloorPoint: (x: number, z: number) => void;
  /** Physically approach a 3D station and align camera squarely in front of it */
  inspectStation: (stationId: string | null) => void;
  /** Effortlessly step to the next (+1) or previous (-1) 3D tableau in sequence */
  stepStation: (dir: 1 | -1) => void;
  /** Switch active slide (0..2) directly on the inspected 3D tableau */
  setStationSlideIndex: (slideIndex: number) => void;
  stepStationSlide: (dir: 1 | -1) => void;
  /** Cycle screenshot visual on a 3D project screen */
  cycleProjectVisual: (projectId: string, total: number, dir?: 1 | -1) => void;

  // Accessible Catalogue Modal actions
  openDossier: (
    tab?: DossierTab,
    projectId?: ProjectCaseStudy['id'] | null
  ) => void;
  closeDossier: () => void;
  setDossierTab: (tab: DossierTab) => void;
  setSelectedProjectId: (projectId: ProjectCaseStudy['id'] | null) => void;
  setSelectedCollectionId: (collectionId: string) => void;

  setSystemReducedMotion: (matches: boolean) => void;
  toggleManualReducedMotion: () => void;
  setDeviceTier: (tier: DeviceTier) => void;
}

export function detectDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1100) return 'tablet';
  return 'desktop';
}

export const useLibraryStore = create<LibraryUIState>((set, get) => ({
  portalPhase: 'opening',
  doorHovered: false,
  sceneReady: false,

  activeRoomIndex: 0,
  inspectedStationId: null,
  stationSlideIndex: 0,
  hoveredStationLabel: null,
  hasStartedWalking: false,
  guidedTourPlaying: false,
  projectVisualIndex: {
    sassyskin: 0,
    'ae-ecs': 0,
    'laura-house': 0,
    'gym-os-sport': 0,
  },

  dossierOpen: false,
  dossierTab: 'overview',
  selectedProjectId: null,
  selectedCollectionId: 'finance',

  atmosphereMood: 'twilight',
  reducedMotion: false,
  manualReducedMotion: null,
  deviceTier: detectDeviceTier(),

  setPortalPhase: (phase) => {
    if (get().portalPhase !== phase) set({ portalPhase: phase });
  },
  setDoorHovered: (hovered) => {
    if (get().doorHovered !== hovered) set({ doorHovered: hovered });
  },
  setSceneReady: (ready) => {
    if (get().sceneReady !== ready) set({ sceneReady: ready });
  },
  setActiveRoomIndex: (roomIndex) => {
    const clamped = Math.max(0, Math.min(ROOMS_3D.length - 1, roomIndex));
    if (get().activeRoomIndex !== clamped) {
      set({ activeRoomIndex: clamped });
      if (typeof window !== 'undefined' && window.history?.replaceState) {
        const hash = ROOMS_3D[clamped]?.hash;
        if (hash && window.location.hash !== hash) {
          window.history.replaceState(null, '', hash);
        }
      }
    }
  },
  markStartedWalking: () => {
    if (!get().hasStartedWalking) {
      set({ hasStartedWalking: true });
    }
  },
  setHoveredStationLabel: (label) => {
    if (get().hoveredStationLabel !== label) {
      set({ hoveredStationLabel: label });
    }
  },
  toggleGuidedTour: () => {
    const next = !get().guidedTourPlaying;
    set({ guidedTourPlaying: next, hasStartedWalking: true });
    if (next && !get().inspectedStationId) {
      get().inspectStation('station-identity');
    }
  },
  stopGuidedTour: () => {
    if (get().guidedTourPlaying) {
      set({ guidedTourPlaying: false });
    }
  },
  cycleAtmosphereMood: () => {
    const order: Array<'twilight' | 'night' | 'day'> = [
      'twilight',
      'night',
      'day',
    ];
    const next =
      order[(order.indexOf(get().atmosphereMood) + 1) % order.length];
    set({ atmosphereMood: next });
  },

  walkToRoom: (roomIndex) => {
    get().stopGuidedTour();
    const clamped = Math.max(0, Math.min(ROOMS_3D.length - 1, roomIndex));
    const room = ROOMS_3D[clamped];
    const [tx, ty, tz] = room.entryPosition;
    const angles = computeAnglesToTarget([tx, ty, tz], room.entryLookAt);

    launchSmoothGlide({
      targetX: tx,
      targetZ: tz,
      targetYaw: angles.yaw,
      targetPitch: angles.pitch,
      lockGaze: true,
      reducedMotion: get().reducedMotion,
    });

    set({
      activeRoomIndex: clamped,
      inspectedStationId: null,
      stationSlideIndex: 0,
      dossierOpen: false,
      hasStartedWalking: true,
    });

    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, '', room.hash);
    }
  },

  walkToFloorPoint: (rawX, rawZ) => {
    // Ignore accidental floor click right after drag-to-look
    if (
      typeof performance !== 'undefined' &&
      performance.now() - libraryMotionState.lastDragEndMs < 140
    ) {
      return;
    }

    get().stopGuidedTour();
    const { x, z } = clampWalkablePosition(rawX, rawZ);
    const dx = x - libraryMotionState.camX;
    const dz = z - libraryMotionState.camZ;
    const dist = Math.hypot(dx, dz);

    const desiredYaw =
      dist > 0.35 ? Math.atan2(-dx, -dz) : libraryMotionState.yaw;

    launchSmoothGlide({
      targetX: x,
      targetZ: z,
      targetYaw: desiredYaw,
      targetPitch: 0.015,
      lockGaze: dist > 0.35,
      reducedMotion: get().reducedMotion,
    });

    set({
      inspectedStationId: null,
      stationSlideIndex: 0,
      hasStartedWalking: true,
    });
  },

  inspectStation: (stationId) => {
    if (!stationId) {
      if (libraryMotionState.glideActive) {
        libraryMotionState.glideActive = false;
        libraryMotionState.lookTargetYaw = libraryMotionState.yaw;
        libraryMotionState.lookTargetPitch = libraryMotionState.pitch;
      }
      get().stopGuidedTour();
      set({ inspectedStationId: null, stationSlideIndex: 0 });
      return;
    }
    const station = getStationById(stationId);
    if (!station) return;

    const [sx, sy, sz] = station.standPosition;
    const angles = computeAnglesToTarget([sx, sy, sz], station.lookAt);

    launchSmoothGlide({
      targetX: sx,
      targetZ: sz,
      targetYaw: angles.yaw,
      targetPitch: angles.pitch,
      lockGaze: true,
      reducedMotion: get().reducedMotion,
    });

    set({
      inspectedStationId: station.id,
      stationSlideIndex: 0,
      activeRoomIndex: station.roomIndex,
      hasStartedWalking: true,
      selectedProjectId: station.project?.id ?? get().selectedProjectId,
      selectedCollectionId: station.skill?.id ?? get().selectedCollectionId,
    });
  },

  stepStation: (dir) => {
    get().stopGuidedTour();
    const currentId = get().inspectedStationId;
    if (!currentId) {
      // Pick the first tableau in the current room (or nearest ahead)
      const roomList = getStationsForRoom(get().activeRoomIndex);
      const target =
        dir === 1
          ? (roomList[0] ?? WORLD_STATIONS_3D[0])
          : (roomList[roomList.length - 1] ??
            WORLD_STATIONS_3D[WORLD_STATIONS_3D.length - 1]);
      if (target) {
        get().inspectStation(target.id);
      }
      return;
    }

    const idx = WORLD_STATIONS_3D.findIndex((s) => s.id === currentId);
    const nextIdx =
      (idx + dir + WORLD_STATIONS_3D.length) % WORLD_STATIONS_3D.length;
    get().inspectStation(WORLD_STATIONS_3D[nextIdx].id);
  },

  setStationSlideIndex: (slideIndex) => {
    const clamped = ((slideIndex % 3) + 3) % 3;
    if (get().stationSlideIndex !== clamped) {
      set({ stationSlideIndex: clamped });
    }
  },

  stepStationSlide: (dir) => {
    const next = (((get().stationSlideIndex + dir) % 3) + 3) % 3;
    set({ stationSlideIndex: next });
  },

  cycleProjectVisual: (projectId, total, dir = 1) => {
    if (total <= 1) return;
    const current = get().projectVisualIndex[projectId] ?? 0;
    const next = (current + dir + total) % total;
    set({
      projectVisualIndex: {
        ...get().projectVisualIndex,
        [projectId]: next,
      },
    });
  },

  openDossier: (tab = 'overview', projectId = null) =>
    set({
      dossierOpen: true,
      dossierTab: tab,
      selectedProjectId: projectId ?? get().selectedProjectId,
    }),
  closeDossier: () => set({ dossierOpen: false }),
  setDossierTab: (tab) => set({ dossierTab: tab }),
  setSelectedProjectId: (projectId) => set({ selectedProjectId: projectId }),
  setSelectedCollectionId: (collectionId) =>
    set({ selectedCollectionId: collectionId }),

  setSystemReducedMotion: (matches) => {
    const manual = get().manualReducedMotion;
    set({ reducedMotion: manual !== null ? manual : matches });
  },
  toggleManualReducedMotion: () => {
    const next = !get().reducedMotion;
    set({ manualReducedMotion: next, reducedMotion: next });
  },
  setDeviceTier: (tier) => {
    if (get().deviceTier !== tier) set({ deviceTier: tier });
  },
}));
