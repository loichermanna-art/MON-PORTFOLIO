import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  detectDeviceTier,
  libraryMotionState,
  useLibraryStore,
} from '../state/useLibraryStore';

gsap.registerPlugin(ScrollTrigger);

/**
 * Single-owner motion orchestrator for Espace 01 — L'Entrée:
 * - Maps native scroll along `#library-scroll-runway` [0..1] into `libraryMotionState.targetProgress`.
 * - Synchronizes direct 3D door clicks & primary CTA buttons with window scroll via GSAP tweening
 *   so scroll position and 3D door/camera state never diverge.
 */
export function useEntranceChoreography(runwayRef: React.RefObject<HTMLDivElement | null>) {
  const setSystemReducedMotion = useLibraryStore((s) => s.setSystemReducedMotion);
  const setDeviceTier = useLibraryStore((s) => s.setDeviceTier);
  const reducedMotion = useLibraryStore((s) => s.reducedMotion);
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotionPref = () => setSystemReducedMotion(mediaQuery.matches);
    syncMotionPref();
    mediaQuery.addEventListener('change', syncMotionPref);

    const handleResize = () => {
      setDeviceTier(detectDeviceTier());
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const handlePointerMove = (e: PointerEvent) => {
      if (!finePointer || useLibraryStore.getState().reducedMotion) return;
      libraryMotionState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      libraryMotionState.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const handleVisibility = () => {
      libraryMotionState.isTabHidden = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      mediaQuery.removeEventListener('change', syncMotionPref);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [setSystemReducedMotion, setDeviceTier]);

  useEffect(() => {
    const runwayEl = runwayRef.current;
    if (!runwayEl || typeof window === 'undefined') return;

    const trigger = ScrollTrigger.create({
      trigger: runwayEl,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        libraryMotionState.targetProgress = self.progress;
      },
    });

    // Sync initial position
    libraryMotionState.targetProgress = trigger.progress;

    return () => {
      scrollTweenRef.current?.kill();
      trigger.kill();
    };
  }, [runwayRef]);

  const animateToProgress = useCallback(
    (targetNormalized: number) => {
      if (typeof window === 'undefined') return;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const clamped = Math.max(0, Math.min(1, targetNormalized));
      const destinationY = clamped * maxScroll;

      scrollTweenRef.current?.kill();

      if (reducedMotion) {
        libraryMotionState.targetProgress = clamped;
        libraryMotionState.currentProgress = clamped;
        window.scrollTo({ top: destinationY, behavior: 'auto' });
        return;
      }

      const proxy = { y: window.scrollY };
      scrollTweenRef.current = gsap.to(proxy, {
        y: destinationY,
        duration: 1.55,
        ease: 'power3.inOut',
        overwrite: 'auto',
        onUpdate: () => {
          window.scrollTo(0, proxy.y);
        },
      });
    },
    [reducedMotion]
  );

  const togglePortal = useCallback(() => {
    const isAlreadyInside = libraryMotionState.targetProgress > 0.62;
    animateToProgress(isAlreadyInside ? 0 : 1);
  }, [animateToProgress]);

  return {
    animateToProgress,
    togglePortal,
  };
}
