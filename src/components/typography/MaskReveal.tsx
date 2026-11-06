import { useEffect, useRef, useState, type ReactNode } from 'react';

interface MaskRevealProps {
  children: ReactNode;
  delayMs?: number;
  immediatelyVisible?: boolean;
}

/**
 * Révélation typographique par masque vertical (Emil Kowalski & UCE kinetic-typography) :
 * - Utilise uniquement transform + opacity (compositing GPU).
 * - Respecte automatiquement prefers-reduced-motion via CSS.
 * - S'observe via IntersectionObserver sans écouteur scroll bloquant.
 */
export function MaskReveal({
  children,
  delayMs = 0,
  immediatelyVisible = false,
}: MaskRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState<boolean>(immediatelyVisible);

  useEffect(() => {
    if (immediatelyVisible) {
      setRevealed(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -6% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [immediatelyVisible]);

  return (
    <div ref={ref} className="mask-line">
      <div
        className="mask-line__inner"
        data-hidden={revealed ? 'false' : 'true'}
        style={delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
