import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { CANONICAL_SCENE_BANDS } from './motionConfig';
import {
  motionStore,
  setReducedMotionPreference,
  setScrollProgress,
} from './motionStore';

gsap.registerPlugin(ScrollTrigger);

interface SectionScrollAnchor {
  scrollY: number;
  canonicalProgress: number;
}

/**
 * Mesure la position réelle des 6 <section> HTML afin de construire une fonction
 * d'interpolation linéaire par morceaux (scrollY -> canonicalProgress [0..1]).
 * Résultat : que l'écran fasse 1440px ou 390px de large, la caméra 3D arrive toujours
 * exactement face à la salle architecturale correspondant à la section visible.
 */
function measureSectionAnchors(): SectionScrollAnchor[] {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return [
      { scrollY: 0, canonicalProgress: 0 },
      { scrollY: 1, canonicalProgress: 1 },
    ];
  }

  const maxScroll = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const anchors: SectionScrollAnchor[] = [{ scrollY: 0, canonicalProgress: 0 }];

  for (let i = 1; i < CANONICAL_SCENE_BANDS.length; i++) {
    const band = CANONICAL_SCENE_BANDS[i];
    const el = document.getElementById(band.sectionId);
    if (el) {
      const rect = el.getBoundingClientRect();
      // Point d'entrée éditorial lorsque le haut de section franchit ~28% de la hauteur d'écran
      const targetY = Math.max(
        0,
        Math.min(maxScroll, rect.top + window.scrollY - window.innerHeight * 0.28)
      );
      const prevY = anchors[anchors.length - 1].scrollY;
      anchors.push({
        scrollY: Math.max(prevY + 1, targetY),
        canonicalProgress: band.start,
      });
    }
  }

  const lastY = anchors[anchors.length - 1].scrollY;
  anchors.push({
    scrollY: Math.max(lastY + 1, maxScroll),
    canonicalProgress: 1.0,
  });

  return anchors;
}

function mapScrollYToCanonical(scrollY: number, anchors: SectionScrollAnchor[]): number {
  if (anchors.length < 2) return 0;
  if (scrollY <= anchors[0].scrollY) return anchors[0].canonicalProgress;
  const last = anchors[anchors.length - 1];
  if (scrollY >= last.scrollY) return last.canonicalProgress;

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (scrollY >= a.scrollY && scrollY <= b.scrollY) {
      const span = Math.max(1, b.scrollY - a.scrollY);
      const localT = (scrollY - a.scrollY) / span;
      return a.canonicalProgress + localT * (b.canonicalProgress - a.canonicalProgress);
    }
  }
  return 0;
}

export function useScrollOrchestrator(
  enabled: boolean,
  manualReducedMotion: boolean | null
): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyReduced = () => {
      const isReduced =
        manualReducedMotion !== null ? manualReducedMotion : mediaReduced.matches;
      setReducedMotionPreference(isReduced);
    };
    applyReduced();
    mediaReduced.addEventListener('change', applyReduced);

    return () => {
      mediaReduced.removeEventListener('change', applyReduced);
    };
  }, [manualReducedMotion]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isMobileViewport = window.innerWidth < 768;
    const shouldUseLenis = finePointer && !isMobileViewport && !motionStore.reducedMotion;

    let lenis: Lenis | null = null;
    let rafCallback: ((time: number) => void) | null = null;
    let anchors = measureSectionAnchors();

    if (shouldUseLenis) {
      lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        wheelMultiplier: 0.95,
      });
      lenis.on('scroll', ScrollTrigger.update);
      rafCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(rafCallback);
      gsap.ticker.lagSmoothing(0);
    }

    const refreshAnchors = () => {
      anchors = measureSectionAnchors();
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const raw = window.scrollY / maxScroll;
      const canonical = mapScrollYToCanonical(window.scrollY, anchors);
      setScrollProgress(canonical, 0, raw);
    };

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onRefresh: refreshAnchors,
      onUpdate: (self) => {
        const currentY = window.scrollY;
        const canonical = mapScrollYToCanonical(currentY, anchors);
        setScrollProgress(canonical, self.getVelocity() / 2400, self.progress);
      },
    });

    // Mesure initiale après mise en page des polices locales
    const initTimer = window.setTimeout(() => {
      refreshAnchors();
      ScrollTrigger.refresh();
    }, 80);

    const handleResize = () => {
      refreshAnchors();
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!finePointer || motionStore.reducedMotion) return;
      motionStore.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      motionStore.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const handleVisibility = () => {
      motionStore.isTabHidden = document.hidden;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.clearTimeout(initTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      trigger.kill();
      if (rafCallback) {
        gsap.ticker.remove(rafCallback);
      }
      lenis?.destroy();
    };
  }, [enabled, manualReducedMotion]);
}
