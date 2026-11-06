import { useEffect, useRef, useState } from 'react';
import { NAV_SCENES } from '../../data/portfolioData';
import { motionStore, subscribeActiveScene } from '../../motion/motionStore';

/**
 * Règle longitudinale d'arpentage architectural (affichée sur écrans larges >= 1280px).
 * Renforce physiquement la perception d'un édifice unique continu de +14m à -90m
 * sans aucun re-render React par frame (mise à jour directe par références DOM).
 */
export function ElevationMeter() {
  const [activeScene, setActiveScene] = useState<number>(motionStore.activeScene);
  const meterTextRef = useRef<HTMLSpanElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return subscribeActiveScene((idx) => setActiveScene(idx));
  }, []);

  useEffect(() => {
    let rafId = 0;
    const updateReadout = () => {
      if (!motionStore.isTabHidden) {
        const p = motionStore.scrollProgress;
        // Cote longitudinale le long de l'axe Z : +14m (Péristyle) -> -90m (Belvédère)
        const zMeters = Math.round(14 - p * 104);
        const formatted = zMeters > 0 ? `+${zMeters}m` : `${zMeters}m`;
        if (meterTextRef.current && meterTextRef.current.textContent !== formatted) {
          meterTextRef.current.textContent = formatted;
        }
        if (thumbRef.current) {
          thumbRef.current.style.transform = `translate3d(0, ${(p * 136).toFixed(1)}px, 0)`;
        }
      }
      rafId = window.requestAnimationFrame(updateReadout);
    };
    rafId = window.requestAnimationFrame(updateReadout);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  return (
    <aside className="elevation-meter" aria-label="Repère longitudinal dans l’édifice">
      <span ref={meterTextRef} className="elevation-meter__coord tabular">
        +14m
      </span>

      <div className="elevation-meter__rail" role="list">
        <span ref={thumbRef} className="elevation-meter__cursor" aria-hidden="true" />
        {NAV_SCENES.map((scene) => (
          <a
            key={scene.id}
            href={`#${scene.id}`}
            role="listitem"
            className="elevation-meter__tick tabular"
            data-active={activeScene === scene.index ? 'true' : 'false'}
            title={`${scene.num} · ${scene.label} (${scene.zone})`}
            aria-label={`Aller à la scène ${scene.num} : ${scene.label}`}
          >
            <span>{scene.num}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
