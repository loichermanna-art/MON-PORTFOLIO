import { resolveSceneIndexFromProgress } from './motionConfig';

/**
 * motionStore.ts — Store mutable partagé entre le DOM et le monde Three.js (0 re-render à 60 Hz).
 * Assure le couplage temps réel entre le premier plan éditorial et l'architecture 3D.
 */

export interface MotionState {
  scrollProgress: number;
  rawScrollProgress: number;
  scrollVelocity: number;
  activeScene: number;
  activeProcessStep: number;
  /** Index d'axe survolé sur la stèle de verre 3D du Hero (-1 = aucun, 0..3 = AUDIT..INNOVATION) */
  heroSteleHoverIndex: -1 | 0 | 1 | 2 | 3;
  /** Domaine d'expertise sélectionné (0..3) partagé entre la stèle 3D et la section Expertise */
  selectedExpertiseIndex: number;
  /** Pôle d'expertise survolé (-1 | 0 | 1 | 2 | 3) */
  focusedExpertisePole: -1 | 0 | 1 | 2 | 3;
  /** Projet focalisé ou inspecté (-1 | 0 | 1 | 2) */
  focusedProjectIndex: -1 | 0 | 1 | 2;
  pointerX: number;
  pointerY: number;
  reducedMotion: boolean;
  isTabHidden: boolean;
}

type SceneListener = (activeScene: number) => void;
type ProcessStepListener = (step: number) => void;
type ReducedMotionListener = (reduced: boolean) => void;
type ExpertiseSelectionListener = (domainIndex: number) => void;
type HeroSteleListener = (hoverIndex: -1 | 0 | 1 | 2 | 3) => void;

export const motionStore: MotionState = {
  scrollProgress: 0,
  rawScrollProgress: 0,
  scrollVelocity: 0,
  activeScene: 0,
  activeProcessStep: 0,
  heroSteleHoverIndex: -1,
  selectedExpertiseIndex: 0,
  focusedExpertisePole: -1,
  focusedProjectIndex: -1,
  pointerX: 0,
  pointerY: 0,
  reducedMotion: false,
  isTabHidden: false,
};

const sceneListeners = new Set<SceneListener>();
const processListeners = new Set<ProcessStepListener>();
const reducedListeners = new Set<ReducedMotionListener>();
const expertiseListeners = new Set<ExpertiseSelectionListener>();
const heroSteleListeners = new Set<HeroSteleListener>();

export function setScrollProgress(
  architecturalProgress: number,
  velocity = 0,
  rawProgress = architecturalProgress
): void {
  const clamped = Math.max(0, Math.min(1, architecturalProgress));
  motionStore.scrollProgress = clamped;
  motionStore.rawScrollProgress = Math.max(0, Math.min(1, rawProgress));
  motionStore.scrollVelocity = velocity;

  const nextScene = resolveSceneIndexFromProgress(clamped);
  if (nextScene !== motionStore.activeScene) {
    motionStore.activeScene = nextScene;
    sceneListeners.forEach((fn) => fn(nextScene));
  }

  const processRatio = (clamped - 0.72) / 0.17;
  const nextStep = Math.max(0, Math.min(5, Math.floor(processRatio * 6)));
  if (nextStep !== motionStore.activeProcessStep) {
    motionStore.activeProcessStep = nextStep;
    processListeners.forEach((fn) => fn(nextStep));
  }
}

export function setHeroSteleHoverIndex(index: -1 | 0 | 1 | 2 | 3): void {
  if (motionStore.heroSteleHoverIndex === index) return;
  motionStore.heroSteleHoverIndex = index;
  heroSteleListeners.forEach((fn) => fn(index));
}

export function selectExpertiseDomain(domainIndex: number): void {
  const clamped = Math.max(0, Math.min(3, domainIndex));
  motionStore.selectedExpertiseIndex = clamped;
  expertiseListeners.forEach((fn) => fn(clamped));
}

export function setFocusedExpertisePole(pole: -1 | 0 | 1 | 2 | 3): void {
  motionStore.focusedExpertisePole = pole;
}

export function setFocusedProjectIndex(index: -1 | 0 | 1 | 2): void {
  motionStore.focusedProjectIndex = index;
}

export function setReducedMotionPreference(reduced: boolean): void {
  if (motionStore.reducedMotion === reduced) return;
  motionStore.reducedMotion = reduced;
  if (reduced) {
    motionStore.pointerX = 0;
    motionStore.pointerY = 0;
  }
  reducedListeners.forEach((fn) => fn(reduced));
}

export function subscribeActiveScene(listener: SceneListener): () => void {
  sceneListeners.add(listener);
  return () => {
    sceneListeners.delete(listener);
  };
}

export function subscribeActiveProcessStep(listener: ProcessStepListener): () => void {
  processListeners.add(listener);
  return () => {
    processListeners.delete(listener);
  };
}

export function subscribeReducedMotion(listener: ReducedMotionListener): () => void {
  reducedListeners.add(listener);
  return () => {
    reducedListeners.delete(listener);
  };
}

export function subscribeSelectedExpertise(listener: ExpertiseSelectionListener): () => void {
  expertiseListeners.add(listener);
  return () => {
    expertiseListeners.delete(listener);
  };
}

export function subscribeHeroSteleHover(listener: HeroSteleListener): () => void {
  heroSteleListeners.add(listener);
  return () => {
    heroSteleListeners.delete(listener);
  };
}
