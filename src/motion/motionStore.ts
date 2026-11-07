import { resolveSceneIndexFromProgress } from './motionConfig';

/**
 * motionStore.ts — Store mutable partagé entre le DOM et le monde Three.js (0 re-render à 60 Hz).
 * Assure le couplage bidirectionnel entre la narration éditoriale, les interactions UI,
 * la caméra cinématographique et les structures architecturales 3D des 6 scènes.
 */

export interface MotionState {
  scrollProgress: number;
  rawScrollProgress: number;
  scrollVelocity: number;
  activeScene: number;
  /** Scène 01 : Lame architecturale Hero survolée (-1 | 0..3) */
  heroSteleHoverIndex: -1 | 0 | 1 | 2 | 3;
  /** Scène 02 : Jalon actif de la ligne temporelle spatiale (0..5) */
  selectedAboutPillar: number;
  hoveredAboutPillar: number;
  /** Scène 03 : Domaine d'expertise sélectionné parmi les 5 monolithes (0..4) */
  selectedExpertiseIndex: number;
  focusedExpertisePole: number;
  /** Scène 04 : Pavillon projet actif ou survolé (-1 | 0..3) */
  focusedProjectIndex: number;
  /** Scène 04 : Indique si une étude de cas complète est ouverte (cadrage 3D dédié) */
  caseStudyOpenIndex: number;
  /** Scène 05 : Portique méthodologique actif (0..5 = Comprendre..Améliorer) */
  activeProcessStep: number;
  /** Scène 06 : Canal du belvédère Contact survolé (-1 | 0..3) */
  activeContactChannel: number;
  selectedContactChannel: number;
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
type AboutPillarListener = (selected: number, hovered: number) => void;
type FocusedProjectListener = (projectIndex: number) => void;
type ContactChannelListener = (selected: number, hovered: number) => void;

export const motionStore: MotionState = {
  scrollProgress: 0,
  rawScrollProgress: 0,
  scrollVelocity: 0,
  activeScene: 0,
  heroSteleHoverIndex: -1,
  selectedAboutPillar: 0,
  hoveredAboutPillar: -1,
  selectedExpertiseIndex: 0,
  focusedExpertisePole: -1,
  focusedProjectIndex: -1,
  caseStudyOpenIndex: -1,
  activeProcessStep: 0,
  activeContactChannel: -1,
  selectedContactChannel: -1,
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
const aboutPillarListeners = new Set<AboutPillarListener>();
const focusedProjectListeners = new Set<FocusedProjectListener>();
const contactChannelListeners = new Set<ContactChannelListener>();

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

  // Synchronisation automatique des 6 portiques lorsque le visiteur traverse la Scène 05 (0.76..0.91)
  if (clamped >= 0.75 && clamped <= 0.915) {
    const processRatio = (clamped - 0.76) / 0.145;
    const nextStep = Math.max(0, Math.min(5, Math.floor(processRatio * 6)));
    if (nextStep !== motionStore.activeProcessStep) {
      motionStore.activeProcessStep = nextStep;
      processListeners.forEach((fn) => fn(nextStep));
    }
  }
}

export function setHeroSteleHoverIndex(index: -1 | 0 | 1 | 2 | 3): void {
  if (motionStore.heroSteleHoverIndex === index) return;
  motionStore.heroSteleHoverIndex = index;
  heroSteleListeners.forEach((fn) => fn(index));
}

export function selectAboutPillar(pillarIndex: number): void {
  const clamped = Math.max(0, Math.min(5, Math.round(pillarIndex)));
  if (motionStore.selectedAboutPillar === clamped) return;
  motionStore.selectedAboutPillar = clamped;
  aboutPillarListeners.forEach((fn) => fn(clamped, motionStore.hoveredAboutPillar));
}

export function setHoveredAboutPillar(pillarIndex: number): void {
  if (motionStore.hoveredAboutPillar === pillarIndex) return;
  motionStore.hoveredAboutPillar = pillarIndex;
  aboutPillarListeners.forEach((fn) => fn(motionStore.selectedAboutPillar, pillarIndex));
}

export function selectExpertiseDomain(domainIndex: number): void {
  const clamped = Math.max(0, Math.min(4, Math.round(domainIndex)));
  motionStore.selectedExpertiseIndex = clamped;
  expertiseListeners.forEach((fn) => fn(clamped));
}

export function setFocusedExpertisePole(pole: number): void {
  motionStore.focusedExpertisePole = pole;
}

export function setFocusedProjectIndex(index: number): void {
  if (motionStore.focusedProjectIndex === index) return;
  motionStore.focusedProjectIndex = index;
  focusedProjectListeners.forEach((fn) => fn(index));
}

export function setCaseStudyOpenIndex(index: number): void {
  motionStore.caseStudyOpenIndex = index;
}

export function setActiveProcessStep(step: number): void {
  const clamped = Math.max(0, Math.min(5, Math.round(step)));
  if (motionStore.activeProcessStep === clamped) return;
  motionStore.activeProcessStep = clamped;
  processListeners.forEach((fn) => fn(clamped));
}

export function setActiveContactChannel(channel: number): void {
  if (motionStore.activeContactChannel === channel) return;
  motionStore.activeContactChannel = channel;
  contactChannelListeners.forEach((fn) =>
    fn(motionStore.selectedContactChannel, channel)
  );
}

export function selectContactChannel(channel: number): void {
  if (motionStore.selectedContactChannel === channel) return;
  motionStore.selectedContactChannel = channel;
  contactChannelListeners.forEach((fn) =>
    fn(channel, motionStore.activeContactChannel)
  );
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

export function subscribeAboutPillar(listener: AboutPillarListener): () => void {
  aboutPillarListeners.add(listener);
  return () => {
    aboutPillarListeners.delete(listener);
  };
}

export function subscribeFocusedProject(listener: FocusedProjectListener): () => void {
  focusedProjectListeners.add(listener);
  return () => {
    focusedProjectListeners.delete(listener);
  };
}

export function subscribeContactChannel(listener: ContactChannelListener): () => void {
  contactChannelListeners.add(listener);
  return () => {
    contactChannelListeners.delete(listener);
  };
}
