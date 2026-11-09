import { create } from 'zustand';
import type { ProjectCaseStudy } from '../../data/portfolioData';
import {
  ROOMS_3D,
  clampWalkablePosition,
  computeAnglesToTarget,
  getEyeHeightAtZ,
  getStationById,
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
  camZ: 8.2,
  yaw: 0,
  pitch: 0,

  // Smooth auto-glide target (floor click, room jump, or station approach)
  glideActive: false,
  glideTargetX: 0,
  glideTargetZ: 8.2,
  glideTargetYaw: 0,
  glideTargetPitch: 0,
  glideLockGaze: false,

  // On-screen touch / virtual D-pad inputs (-1, 0, +1)
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

function shortestYawTarget(currentYaw: number, desiredYaw: number): number {
  const twoPi = Math.PI * 2;
  const delta =
    ((((desiredYaw - currentYaw) % twoPi) + twoPi + Math.PI) % twoPi) - Math.PI;
  return currentYaw + delta;
}

interface LibraryUIState {
  portalPhase: PortalPhase;
  doorHovered: boolean;
  sceneReady: boolean;

  // 3D Spatial Navigation State
  activeRoomIndex: number;
  inspectedStationId: string | null;
  hoveredStationLabel: string | null;
  hasStartedWalking: boolean;
  projectVisualIndex: Record<string, number>;

  // Accessible Text Catalogue Fallback Modal
  dossierOpen: boolean;
  dossierTab: DossierTab;
  selectedProjectId: ProjectCaseStudy['id'] | null;
  selectedCollectionId: string;

  // Preferences & Device
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

  /** Physically walk/glide in 3D to one of the 6 rooms (0..5) */
  walkToRoom: (roomIndex: number) => void;
  /** Physically walk/glide to a clicked 3D point on the floor */
  walkToFloorPoint: (x: number, z: number) => void;
  /** Physically approach a 3D station and open its side Spatial Inspector */
  inspectStation: (stationId: string | null) => void;
  /** Cycle screenshot visual on a 3D project screen */
  cycleProjectVisual: (projectId: string, total: number, dir?: 1 | -1) => void;

  // Accessible Catalogue Modal actions
  openDossier: (tab?: DossierTab, projectId?: ProjectCaseStudy['id'] | null) => void;
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
  hoveredStationLabel: null,
  hasStartedWalking: false,
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

  walkToRoom: (roomIndex) => {
    const clamped = Math.max(0, Math.min(ROOMS_3D.length - 1, roomIndex));
    const room = ROOMS_3D[clamped];
    const [tx, ty, tz] = room.entryPosition;
    const angles = computeAnglesToTarget([tx, ty, tz], room.entryLookAt);

    if (get().reducedMotion) {
      libraryMotionState.camX = tx;
      libraryMotionState.camZ = tz;
      libraryMotionState.camY = getEyeHeightAtZ(tz);
      libraryMotionState.yaw = angles.yaw;
      libraryMotionState.pitch = angles.pitch;
      libraryMotionState.glideActive = false;
    } else {
      libraryMotionState.glideTargetX = tx;
      libraryMotionState.glideTargetZ = tz;
      libraryMotionState.glideTargetYaw = shortestYawTarget(
        libraryMotionState.yaw,
        angles.yaw
      );
      libraryMotionState.glideTargetPitch = angles.pitch;
      libraryMotionState.glideLockGaze = true;
      libraryMotionState.glideActive = true;
    }

    set({
      activeRoomIndex: clamped,
      inspectedStationId: null,
      dossierOpen: false,
      hasStartedWalking: clamped > 0 ? true : get().hasStartedWalking,
    });

    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, '', room.hash);
    }
  },

  walkToFloorPoint: (rawX, rawZ) => {
    const { x, z } = clampWalkablePosition(rawX, rawZ);
    const eyeY = getEyeHeightAtZ(z);
    const dx = x - libraryMotionState.camX;
    const dz = z - libraryMotionState.camZ;
    const dist = Math.hypot(dx, dz);

    let desiredYaw = libraryMotionState.yaw;
    if (dist > 0.35) {
      desiredYaw = shortestYawTarget(
        libraryMotionState.yaw,
        Math.atan2(-dx, -dz)
      );
    }

    if (get().reducedMotion) {
      libraryMotionState.camX = x;
      libraryMotionState.camZ = z;
      libraryMotionState.camY = eyeY;
      libraryMotionState.yaw = desiredYaw;
      libraryMotionState.pitch = 0;
      libraryMotionState.glideActive = false;
    } else {
      libraryMotionState.glideTargetX = x;
      libraryMotionState.glideTargetZ = z;
      libraryMotionState.glideTargetYaw = desiredYaw;
      libraryMotionState.glideTargetPitch = 0;
      libraryMotionState.glideLockGaze = dist > 0.35;
      libraryMotionState.glideActive = true;
    }

    set({
      inspectedStationId: null,
      hasStartedWalking: true,
    });
  },

  inspectStation: (stationId) => {
    if (!stationId) {
      set({ inspectedStationId: null });
      return;
    }
    const station = getStationById(stationId);
    if (!station) return;

    const [sx, sy, sz] = station.standPosition;
    const angles = computeAnglesToTarget([sx, sy, sz], station.lookAt);

    if (get().reducedMotion) {
      libraryMotionState.camX = sx;
      libraryMotionState.camZ = sz;
      libraryMotionState.camY = getEyeHeightAtZ(sz);
      libraryMotionState.yaw = angles.yaw;
      libraryMotionState.pitch = angles.pitch;
      libraryMotionState.glideActive = false;
    } else {
      libraryMotionState.glideTargetX = sx;
      libraryMotionState.glideTargetZ = sz;
      libraryMotionState.glideTargetYaw = shortestYawTarget(
        libraryMotionState.yaw,
        angles.yaw
      );
      libraryMotionState.glideTargetPitch = angles.pitch;
      libraryMotionState.glideLockGaze = true;
      libraryMotionState.glideActive = true;
    }

    set({
      inspectedStationId: station.id,
      activeRoomIndex: station.roomIndex,
      hasStartedWalking: true,
      selectedProjectId: station.project?.id ?? get().selectedProjectId,
      selectedCollectionId: station.skill?.id ?? get().selectedCollectionId,
    });
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
  setSelectedCollectionId: (collectionId) => set({ selectedCollectionId: collectionId }),

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
