import { create } from 'zustand';
import type { ProjectCaseStudy } from '../../data/portfolioData';

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
 * High-frequency 60Hz motion state read directly inside R3F `useFrame`
 * without triggering React component re-renders (`perf-never-set-state-in-useframe`).
 */
export const libraryMotionState = {
  /** Target progress [0..1] driven by ScrollTrigger or explicit portal CTA */
  targetProgress: 0,
  /** Smoothed progress [0..1] integrated in useFrame */
  currentProgress: 0,
  /** Normalized pointer [-1..+1] for subtle architectural head-turn parallax */
  pointerX: 0,
  pointerY: 0,
  /** Pause GPU work when browser tab is hidden */
  isTabHidden: false,
};

interface LibraryUIState {
  portalPhase: PortalPhase;
  doorHovered: boolean;
  sceneReady: boolean;
  dossierOpen: boolean;
  dossierTab: DossierTab;
  selectedProjectId: ProjectCaseStudy['id'] | null;
  selectedCollectionId: string;
  reducedMotion: boolean;
  manualReducedMotion: boolean | null;
  deviceTier: DeviceTier;

  setPortalPhase: (phase: PortalPhase) => void;
  setDoorHovered: (hovered: boolean) => void;
  setSceneReady: (ready: boolean) => void;
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
  portalPhase: 'vestibule',
  doorHovered: false,
  sceneReady: false,
  dossierOpen: false,
  dossierTab: 'overview',
  selectedProjectId: null,
  selectedCollectionId: 'finance',
  reducedMotion: false,
  manualReducedMotion: null,
  deviceTier: detectDeviceTier(),

  setPortalPhase: (phase) => {
    if (get().portalPhase !== phase) {
      set({ portalPhase: phase });
    }
  },
  setDoorHovered: (hovered) => {
    if (get().doorHovered !== hovered) {
      set({ doorHovered: hovered });
    }
  },
  setSceneReady: (ready) => {
    if (get().sceneReady !== ready) {
      set({ sceneReady: ready });
    }
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
    if (get().deviceTier !== tier) {
      set({ deviceTier: tier });
    }
  },
}));
