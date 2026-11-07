import { resolveSceneIndexFromProgress } from './motionConfig';

/**
 * motionStore.ts — Store mutable partagé entre le DOM et le monde Three.js (0 re-render à 60 Hz).
 * Assure le couplage spatial bidirectionnel entre le premier plan éditorial et l'architecture 3D
 * sur l'intégralité des 6 scènes (01 Hero -> 06 Contact).
 */

export interface MotionState {
  scrollProgress: number;
  rawScrollProgress: number;
  scrollVelocity: number;
  activeScene: number;
  /** Scène 01 : Axe survolé sur la baie vitrée 3D du Hero (-1 = aucun, 0..3 = AUDIT..INNOVATION) */
  heroSteleHoverIndex: -1 | 0 | 1 | 2 | 3;
  /** Scène 02 : Pilier « À propos » sélectionné (0 = Rigueur, 1 = Architecture, 2 = Impact) */
  selectedAboutPillar: 0 | 1 | 2;
  /** Scène 02 : Travée claire-voie 3D survolée (-1 | 0 | 1 | 2) */
  hoveredAboutPillar: -1 | 0 | 1 | 2;
  /** Scène 03 : Domaine d'expertise sélectionné (0..3) partagé entre le Hero et la Cour 3D */
  selectedExpertiseIndex: number;
  /** Scène 03 : Monolithe d'expertise survolé (-1 | 0 | 1 | 2 | 3) */
  focusedExpertisePole: -1 | 0 | 1 | 2 | 3;
  /** Scène 04 : Chevalet muséal de projet survolé ou inspecté (-1 | 0 | 1 | 2) */
  focusedProjectIndex: -1 | 0 | 1 | 2;
  /** Scène 05 : Portique séquentiel actif (0..5 = Comprendre..Améliorer) */
  activeProcessStep: number;
  /** Scène 06 : Borne du belvédère Contact survolée (-1 | 0 = E-mail | 1 = LinkedIn | 2 = GitHub) */
  activeContactChannel: -1 | 0 | 1 | 2;
  /** Scène 06 : Borne du belvédère Contact ouverte (-1 = fermée, 0..2 = canal actif) */
  selectedContactChannel: -1 | 0 | 1 | 2;
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
type AboutPillarListener = (selected: 0 | 1 | 2, hovered: -1 | 0 | 1 | 2) => void;
type FocusedProjectListener = (projectIndex: -1 | 0 | 1 | 2) => void;
type ContactChannelListener = (
  selected: -1 | 0 | 1 | 2,
  hovered: -1 | 0 | 1 | 2
) => void;

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

  // Synchronisation automatique des 6 portiques lorsque le visiteur traverse la Scène 05 (0.74..0.90)
  if (clamped >= 0.72 && clamped <= 0.91) {
    const processRatio = (clamped - 0.73) / 0.165;
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

export function selectAboutPillar(pillarIndex: 0 | 1 | 2): void {
  if (motionStore.selectedAboutPillar === pillarIndex) return;
  motionStore.selectedAboutPillar = pillarIndex;
  aboutPillarListeners.forEach((fn) => fn(pillarIndex, motionStore.hoveredAboutPillar));
}

export function setHoveredAboutPillar(pillarIndex: -1 | 0 | 1 | 2): void {
  if (motionStore.hoveredAboutPillar === pillarIndex) return;
  motionStore.hoveredAboutPillar = pillarIndex;
  aboutPillarListeners.forEach((fn) => fn(motionStore.selectedAboutPillar, pillarIndex));
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
  if (motionStore.focusedProjectIndex === index) return;
  motionStore.focusedProjectIndex = index;
  focusedProjectListeners.forEach((fn) => fn(index));
}

export function setActiveProcessStep(step: number): void {
  const clamped = Math.max(0, Math.min(5, Math.round(step)));
  if (motionStore.activeProcessStep === clamped) return;
  motionStore.activeProcessStep = clamped;
  processListeners.forEach((fn) => fn(clamped));
}

export function setActiveContactChannel(channel: -1 | 0 | 1 | 2): void {
  if (motionStore.activeContactChannel === channel) return;
  motionStore.activeContactChannel = channel;
  contactChannelListeners.forEach((fn) =>
    fn(motionStore.selectedContactChannel, channel)
  );
}

export function selectContactChannel(channel: -1 | 0 | 1 | 2): void {
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
