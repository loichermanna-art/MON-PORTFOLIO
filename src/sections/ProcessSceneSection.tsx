import { useState } from 'react';
import { MaskReveal } from '../components/typography/MaskReveal';
import { PROCESS_STEPS } from '../data/portfolioData';
import { motionStore } from '../motion/motionStore';

/**
 * Scène 05 — MA DÉMARCHE (Les 6 étapes exactes : Comprendre, Analyser, Concevoir, Développer, Tester, Améliorer)
 */
export function ProcessSceneSection() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const currentStep = PROCESS_STEPS[selectedIdx] ?? PROCESS_STEPS[0];

  const handleSelectStep = (idx: number) => {
    setSelectedIdx(idx);
    motionStore.activeProcessStep = idx;
  };

  return (
    <section
      id="process"
      className="scene-section"
      data-scene-index="4"
      aria-labelledby="process-heading"
    >
      <div className="arch-container">
        <div className="arch-grid" style={{ alignItems: 'center' }}>
          <div className="spatial-left">
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
                padding: '1.1rem 1.3rem',
                marginBottom: '1.65rem',
                background: 'rgba(16, 39, 71, 0.66)',
                borderLeft: '2px solid var(--azure-400)',
                maxWidth: '42ch',
              }}
            >
              <div
                className="tabular"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--azure-400)',
                  marginBottom: '0.3rem',
                }}
              >
                ÉTAPE {currentStep.step} / 06 · {currentStep.title.toUpperCase()}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--ice-100)', lineHeight: 1.58 }}>
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
    </section>
  );
}
