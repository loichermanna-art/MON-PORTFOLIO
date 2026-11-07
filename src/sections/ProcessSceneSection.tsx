import { useEffect, useState } from 'react';
import { PROCESS_STEPS } from '../data/portfolioData';
import {
  motionStore,
  setActiveProcessStep,
  subscribeActiveProcessStep,
} from '../motion/motionStore';
import { useSectionReveal } from '../motion/useSectionReveal';

/**
 * Coordonnées orbitales elliptiques épousant l'anneau de cristal incliné de scene-05-process.jpg
 * (fidèles à la maquette 05 de Loïc Akanda : 1. Comprendre -> 6. Améliorer).
 */
const ORBIT_POSITIONS: ReadonlyArray<{ left: string; top: string }> = [
  { left: '46%', top: '12%' }, // 1. Comprendre
  { left: '80%', top: '26%' }, // 2. Analyser
  { left: '82%', top: '62%' }, // 3. Concevoir
  { left: '52%', top: '86%' }, // 4. Développer
  { left: '19%', top: '72%' }, // 5. Tester
  { left: '17%', top: '36%' }, // 6. Améliorer
];

export function ProcessSceneSection() {
  const [selectedStep, setSelectedStep] = useState<number>(motionStore.activeProcessStep);
  const { ref, inView } = useSectionReveal<HTMLDivElement>();

  useEffect(() => {
    return subscribeActiveProcessStep((idx) => setSelectedStep(idx));
  }, []);

  const handleSelectStep = (idx: number) => {
    setSelectedStep(idx);
    setActiveProcessStep(idx);
  };

  const activeItem = PROCESS_STEPS[selectedStep] ?? PROCESS_STEPS[0];

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="scene-band scene-band--tall"
    >
      <div
        ref={ref}
        data-inview={inView ? 'true' : 'false'}
        className="scene-inner reveal-block"
      >
        <div className="chiaroscuro-split">
          <div className="editorial-monolith-copy editorial-interactive">
            <span className="section-kicker">Ma démarche</span>

            <h2 id="process-heading" className="section-heading">
              Une approche structurée pour des solutions durables.
            </h2>

            <div className="glass-card-subtle" style={{ marginBottom: '1.6rem' }}>
              <div
                className="tabular"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--silver-400)',
                  letterSpacing: '0.14em',
                  marginBottom: '0.4rem',
                }}
              >
                ÉTAPE {activeItem.step} / 06
              </div>
              <h3
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 600,
                  color: 'var(--white)',
                  marginBottom: '0.5rem',
                }}
              >
                {activeItem.title}
              </h3>
              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--silver-300)',
                  marginBottom: '0.85rem',
                }}
              >
                {activeItem.summary}
              </p>
              <span className="tech-tag">Livrable : {activeItem.deliverable}</span>
            </div>

            <a href="#contact" className="pill-cta">
              <span>Échanger sur un projet</span>
              <span className="pill-cta__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>

          {/* Anneau orbital interactif de 6 pilules (Maquette 05) */}
          <div
            className="process-orbit-container editorial-interactive"
            role="tablist"
            aria-label="Les six étapes de la démarche"
          >
            <div className="process-orbit-guide" aria-hidden="true" />
            {PROCESS_STEPS.map((item, idx) => {
              const isCurrent = selectedStep === idx;
              const pos = ORBIT_POSITIONS[idx];
              return (
                <button
                  key={item.step}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  className="process-orbit-pill tabular"
                  style={{ left: pos.left, top: pos.top }}
                  onClick={() => handleSelectStep(idx)}
                  onMouseEnter={() => handleSelectStep(idx)}
                >
                  <span style={{ opacity: 0.68 }}>{idx + 1}.</span>
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
