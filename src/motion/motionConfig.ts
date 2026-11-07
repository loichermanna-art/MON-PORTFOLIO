/**
 * motionConfig.ts — Constantes normatives de progression spatiale et d'amortissement.
 * Le corridor architectural 3D continu (z = +5.5 -> -44.0) est découpé en 6 séquences narratives [0..1].
 * L'orchestrateur projette la position réelle de chaque <section> HTML sur ces plages,
 * garantissant l'alignement exact Contenu <-> Caméra <-> Structures 3D sur desktop et mobile.
 */

export interface SceneScrollBand {
  index: number;
  sectionId: string;
  start: number;
  end: number;
}

export const CANONICAL_SCENE_BANDS: readonly SceneScrollBand[] = [
  { index: 0, sectionId: 'hero', start: 0.0, end: 0.14 },
  { index: 1, sectionId: 'about', start: 0.14, end: 0.32 },
  { index: 2, sectionId: 'expertise', start: 0.32, end: 0.48 },
  { index: 3, sectionId: 'projects', start: 0.48, end: 0.76 },
  { index: 4, sectionId: 'process', start: 0.76, end: 0.91 },
  { index: 5, sectionId: 'contact', start: 0.91, end: 1.0 },
] as const;

export const MOTION_DAMPING = {
  cameraRail: 4.8,
  cameraReduced: 9.0,
  pointerParallax: 3.6,
  structureActuation: 5.0,
} as const;

/** Détermine l'index de scène (0..5) à partir de la progression architecturale canonique [0..1] */
export function resolveSceneIndexFromProgress(progress: number): number {
  const p = Math.max(0, Math.min(1, progress));
  for (let i = CANONICAL_SCENE_BANDS.length - 1; i >= 0; i--) {
    const band = CANONICAL_SCENE_BANDS[i];
    const threshold = i === 0 ? 0 : band.start - 0.015;
    if (p >= threshold) {
      return band.index;
    }
  }
  return 0;
}
