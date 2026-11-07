import { useEffect, type RefObject } from 'react';
import { CANONICAL_SCENE_BANDS } from './motionConfig';
import { motionStore } from './motionStore';

/**
 * Couplage spatial GPU (60 Hz, 0 re-render React) synchronisant la profondeur perspective
 * du premier plan éditorial et de son rail d'interaction avec le travelling de la caméra 3D.
 */
export function useSectionDepthMotion(
  sceneIndex: number,
  primaryRef: RefObject<HTMLElement | null>,
  secondaryRef?: RefObject<HTMLElement | null>
): void {
  useEffect(() => {
    let rafId = 0;
    const band = CANONICAL_SCENE_BANDS[sceneIndex] ?? CANONICAL_SCENE_BANDS[0];
    const center = (band.start + band.end) * 0.5;
    const halfSpan = Math.max(0.06, (band.end - band.start) * 0.5);

    const sync = () => {
      if (!motionStore.isTabHidden) {
        const primaryEl = primaryRef.current;
        const secondaryEl = secondaryRef?.current ?? null;

        if (motionStore.reducedMotion) {
          if (primaryEl) {
            primaryEl.style.transform = 'none';
            primaryEl.style.opacity = '1';
          }
          if (secondaryEl) {
            secondaryEl.style.transform = 'none';
            secondaryEl.style.opacity = '1';
          }
        } else {
          const p = motionStore.scrollProgress;
          // Distance normalisée [-1..+1] par rapport au point focal architectural de la travée
          const rel =
            sceneIndex === 0
              ? Math.max(0, Math.min(1.4, p / Math.max(0.01, band.end)))
              : (p - center) / halfSpan;

          const clampedRel = Math.max(-1.35, Math.min(1.35, rel));
          const absDist = Math.abs(clampedRel);

          // Glissement perspectif subtil accompagnant l'avancée de la caméra le long du mur béton
          const shiftY = sceneIndex === 0 ? -clampedRel * 28 : -clampedRel * 18;
          const scale = 1 - Math.min(0.035, absDist * 0.022);
          const opacity = Math.max(0.32, 1 - Math.max(0, absDist - 0.55) * 0.62);

          if (primaryEl) {
            primaryEl.style.transform = `translate3d(0, ${shiftY.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
            primaryEl.style.opacity = opacity.toFixed(3);
          }

          if (secondaryEl) {
            const secShiftY = sceneIndex === 0 ? -clampedRel * 18 : -clampedRel * 11;
            const secScale = 1 - Math.min(0.025, absDist * 0.015);
            secondaryEl.style.transform = `translate3d(0, ${secShiftY.toFixed(1)}px, 0) scale(${secScale.toFixed(4)})`;
            secondaryEl.style.opacity = Math.max(0.38, opacity).toFixed(3);
          }
        }
      }
      rafId = window.requestAnimationFrame(sync);
    };

    rafId = window.requestAnimationFrame(sync);
    return () => window.cancelAnimationFrame(rafId);
  }, [sceneIndex, primaryRef, secondaryRef]);
}
