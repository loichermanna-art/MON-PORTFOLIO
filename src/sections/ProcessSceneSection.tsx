import { useEffect, useRef, useState } from 'react';
import { MaskReveal } from '../components/typography/MaskReveal';
import { PROCESS_STEPS } from '../data/portfolioData';
import {
  motionStore,
  setActiveProcessStep,
  subscribeActiveProcessStep,
} from '../motion/motionStore';
import { useSectionDepthMotion } from '../motion/useSectionDepthMotion';

/**
 * Scène 05 — MA DÉMARCHE (Synchronisation temps réel scroll + clic 3D + onglets sur les 6 portiques)
 */
export function ProcessSceneSection() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [selectedIdx, setSelectedIdx] = useState<number>(motionStore.activeProcessStep);
  const currentStep = PROCESS_STEPS[selectedIdx] ?? PROCESS_STEPS[0];

  useEffect(() => {
    return subscribeActiveProcessStep((step) => setSelectedIdx(step));
  }, []);

  useSectionDepthMotion(4, leftRef, rightRef);

  const handleSelectStep = (idx: number) => {
    setSelectedIdx(idx);
    setActiveProcessStep(idx);
  };

  return (
    <section
      id="process"
      className="scene-section"
      data-scene-index="4"
      aria-labelledby="process-heading"
    >
      <div className="arch-container">
        <div className="arch-grid" style={{ alignItems: 'end' }}>
          <div ref={leftRef} className="spatial-left">
            <MaskReveal>
              <span className="spatial-overline">05 · Ma démarche</span>
            </MaskReveal>

            <MaskReveal delayMs={70}>
              <h2 id="process-heading" className="spatial-heading">
                Une approche structurée pour des solutions durables.
              </h2>
            </MaskReveal>

            <div
              aria-live="polite"
              style={{
                padding: '1rem 1.2rem',
                marginBottom: '1.45rem',
                background: 'rgba(10, 25, 46, 0.72)',
                borderLeft: '2px solid var(--azure-400)',
                maxWidth: '42ch',
              }}
            >
              <div
                className="tabular"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--azure-400)',
                  marginBottom: '0.28rem',
                }}
              >
                PORTIQUE 3D {currentStep.step} / 06 · {currentStep.title.toUpperCase()}
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--ice-100)', lineHeight: 1.55 }}>
                {currentStep.summary}
              </p>
            </div>

            <MaskReveal delayMs={180}>
              <a href="#contact" className="pill-cta">
                <span>Échanger sur un projet</span>
                <span className="pill-cta__arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </MaskReveal>
          </div>

          <div ref={rightRef} className="orbital-steps-wrapper">
            <div className="spatial-dock-header">
              <span className="spatial-dock-kicker">PERSPECTIVE DES 6 PORTIQUES 3D</span>
              <span className="spatial-dock-status tabular">
                LIVRABLE · {currentStep.deliverable.toUpperCase()}
              </span>
            </div>
            <div
              className="orbital-steps-stage"
              role="tablist"
              aria-label="Les six étapes de la démarche"
            >
              {PROCESS_STEPS.map((step, idx) => {
                const isActive = idx === selectedIdx;
                return (
                  <button
                    key={step.step}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className="orbital-pill tabular"
                    data-active={isActive ? 'true' : 'false'}
                    onClick={() => handleSelectStep(idx)}
                    onMouseEnter={() => handleSelectStep(idx)}
                  >
                    <span style={{ color: 'var(--azure-400)', marginRight: '0.45rem' }}>
                      {idx + 1}.
                    </span>
                    {step.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
