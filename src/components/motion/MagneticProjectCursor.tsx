import { useEffect, useRef } from 'react';

interface MagneticProjectCursorProps {
  active: boolean;
  label?: string;
  reducedMotion: boolean;
}

/**
 * Pastille curseur magnétique à amortissement ressort sur les vitrines Projets :
 * Suit le pointeur avec fluidité (style Lumora adapté à l'ardoise exécutive Sky Zenith #202A36).
 */
export function MagneticProjectCursor({
  active,
  label = 'Découvrir l’étude ↗',
  reducedMotion,
}: MagneticProjectCursorProps) {
  const pillRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef({ tx: -200, ty: -200, cx: -200, cy: -200, initialized: false });

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;
    if (window.matchMedia?.('(pointer: coarse)').matches) return;

    let rafId = 0;

    const onPointerMove = (e: PointerEvent) => {
      const p = posRef.current;
      p.tx = e.clientX + 18;
      p.ty = e.clientY + 18;
      if (!p.initialized) {
        p.cx = p.tx;
        p.cy = p.ty;
        p.initialized = true;
      }
    };

    const animate = () => {
      const p = posRef.current;
      p.cx += (p.tx - p.cx) * 0.22;
      p.cy += (p.ty - p.cy) * 0.22;
      if (pillRef.current) {
        pillRef.current.style.transform = `translate3d(${p.cx.toFixed(1)}px, ${p.cy.toFixed(1)}px, 0) scale(${active ? 1 : 0.86})`;
      }
      rafId = window.requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.cancelAnimationFrame(rafId);
    };
  }, [active, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={pillRef}
      className="zenith-cursor-pill"
      data-visible={active ? 'true' : 'false'}
      aria-hidden="true"
    >
      <span className="zenith-cursor-pill__dot" />
      <span>{label}</span>
    </div>
  );
}
