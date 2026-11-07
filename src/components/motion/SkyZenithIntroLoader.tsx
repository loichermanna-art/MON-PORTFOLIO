import { useEffect, useState } from 'react';
import { PROFILE_IDENTITY } from '../../data/portfolioData';

interface SkyZenithIntroLoaderProps {
  reducedMotion: boolean;
  onComplete?: () => void;
}

/**
 * Rideau d'ouverture stratosphérique « Sky Zenith » (000 -> 100) :
 * - Palette claire aérienne (#F8FAFC -> #E2E9F2), encre exécutive #202A36 et filet solaire #D97706
 * - Compteur tabulaire fluide 000 -> 100 avec levée de rideau soyeuse vers le zénith
 * - Désactivé automatiquement si prefers-reduced-motion est actif
 */
export function SkyZenithIntroLoader({
  reducedMotion,
  onComplete,
}: SkyZenithIntroLoaderProps) {
  const [progress, setProgress] = useState<number>(() => (reducedMotion ? 100 : 0));
  const [done, setDone] = useState<boolean>(() => reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(100);
      setDone(true);
      onComplete?.();
      return;
    }

    let rafId = 0;
    let finishTimer = 0;
    const start = performance.now();
    const duration = 1120;

    const tick = (now: number) => {
      const t = Math.max(0, Math.min(1, (now - start) / duration));
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const nextVal = Math.round(eased * 100);
      setProgress(nextVal);

      if (t < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        finishTimer = window.setTimeout(() => {
          setDone(true);
          onComplete?.();
        }, 140);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(finishTimer);
    };
  }, [reducedMotion, onComplete]);

  const handleSkip = () => {
    setProgress(100);
    setDone(true);
    onComplete?.();
  };

  return (
    <div
      className="zenith-intro-curtain"
      data-done={done ? 'true' : 'false'}
      aria-hidden="true"
    >
      <div className="zenith-intro-curtain__top">
        <span className="zenith-intro-curtain__brand">
          <span>Loïc AKANDA</span>
          <span style={{ color: 'var(--amber-500)' }}>.</span>
        </span>

        <button
          type="button"
          className="zenith-intro-curtain__skip"
          tabIndex={done ? -1 : 0}
          onClick={handleSkip}
        >
          Passer ↗
        </button>
      </div>

      <div className="zenith-intro-curtain__bottom">
        <div className="zenith-intro-curtain__meta">
          <div>
            <span className="zenith-intro-curtain__kicker">
              ALTITUDE STRATOSPHÉRIQUE · INP-HB
            </span>
            <p className="zenith-intro-curtain__sig">
              {PROFILE_IDENTITY.signaturePrefix}{' '}
              <span style={{ color: 'var(--amber-700)', fontWeight: 600 }}>
                {PROFILE_IDENTITY.signatureHighlight}
              </span>
            </p>
          </div>

          <span className="zenith-intro-curtain__counter tabular">
            {String(progress).padStart(3, '0')}
          </span>
        </div>

        <div className="zenith-intro-curtain__bar-track">
          <div
            className="zenith-intro-curtain__bar-fill"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      </div>
    </div>
  );
}
