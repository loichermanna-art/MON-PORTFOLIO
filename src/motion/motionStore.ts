import { resolveSceneIndexFromProgress } from './motionConfig';

/**
 * motionStore.ts — Store mutable hors-cycle React (Emil Kowalski animation-performance)
 * Garantit ZÉRO setState par frame pendant le scroll, le mouvement souris ou la boucle 3D.
 */

export interface MotionState {
  /** Progression architecturale normalisée [0..1] alignée sur les 6 sections DOM */
  scrollProgress: number;
  /** Progression brute globale de la page [0..1] */
  rawScrollProgress: number;
  /** Vélocité normalisée du scroll */
  scrollVelocity: number;
  /** Index de scène active (0 = Hero .. 5 = Contact) */
  activeScene: number;
  /** Étape active de la méthode Process (0..5) */
  activeProcessStep: number;
  /** Pôle d'expertise survolé/focalisé (-1 = aucun, 0 = Finance/Audit, 1 = Produits/Web) */
  focusedExpertisePole: -1 | 0 | 1;
  /** Projet survolé ou ouvert en tiroir (-1 = aucun, 0 = LAURA HOUSE, 1 = SassySkin, 2 = EtuCo) */
  focusedProjectIndex: -1 | 0 | 1 | 2;
  /** Coordonnées pointeur normalisées [-1..+1] (0 sur tactile / reduced-motion) */
  pointerX: number;
  pointerY: number;
  /** Préférence mouvement réduit (OS ou bascule manuelle utilisateur) */
  reducedMotion: boolean;
  /** Indique si l'onglet navigateur est masqué */
  isTabHidden: boolean;
}

type SceneListener = (activeScene: number) => void;
type ProcessStepListener = (step: number) => void;
type ReducedMotionListener = (reduced: boolean) => void;

export const motionStore: MotionState = {
  scrollProgress: 0,
  rawScrollProgress: 0,
  scrollVelocity: 0,
  activeScene: 0,
  activeProcessStep: 0,
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

  // Progression fine dans la Scène 05 Process [0.74 .. 0.90] -> étapes 0..5
  const processRatio = (clamped - 0.72) / 0.17;
  const nextStep = Math.max(0, Math.min(5, Math.floor(processRatio * 6)));
  if (nextStep !== motionStore.activeProcessStep) {
    motionStore.activeProcessStep = nextStep;
    processListeners.forEach((fn) => fn(nextStep));
  }
}

export function setFocusedExpertisePole(pole: -1 | 0 | 1): void {
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
