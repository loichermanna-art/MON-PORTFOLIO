import { useState } from 'react';
import { MaskReveal } from '../components/typography/MaskReveal';
import { PROCESS_STEPS } from '../data/portfolioData';

/**
 * Scène 05 — Ma démarche (6 Étapes)
 * Fidèle au Panneau 05 : narration structurée à gauche et 6 capsules blanches flottantes
 * en orbite devant l'anneau cristallin & la sphère chrome à droite.
 */
export function ProcessSceneSection() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const currentStep = PROCESS_STEPS[selectedIdx] ?? PROCESS_STEPS[0];

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
              <span className="spatial-overline">Ma démarche</span>
            </MaskReveal>

            <MaskReveal delayMs={70}>
              <h2 id="process-heading" className="spatial-heading">
                Une approche structurée pour des solutions durables.
              </h2>
            </MaskReveal>

            <MaskReveal delayMs={140}>
              <p className="spatial-lead">
                De la compréhension du besoin jusqu’aux tests d’usage, chaque étape garantit la
                cohérence fonctionnelle et la clarté du livrable final.
              </p>
            </MaskReveal>

            <div
              aria-live="polite"
              style={{
                padding: '1rem 1.2rem',
                marginBottom: '1.6rem',
                background: 'rgba(255, 255, 255, 0.72)',
                borderLeft: '2px solid var(--ink)',
                maxWidth: '40ch',
              }}
            >
              <div
                className="tabular"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--ink-muted)',
                  marginBottom: '0.25rem',
                }}
              >
                ÉTAPE {currentStep.step} / 06 — {currentStep.title.toUpperCase()}
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--ink)', lineHeight: 1.55 }}>
                {currentStep.summary}
              </p>
            </div>

            <MaskReveal delayMs={210}>
              <a href="#contact" className="pill-cta">
                <span>Restons connectés</span>
                <span aria-hidden="true">→</span>
              </a>
            </MaskReveal>
          </div>

          <div
            className="orbital-steps-stage"
            role="tablist"
            aria-label="Les 6 étapes de la démarche"
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
                  onClick={() => setSelectedIdx(idx)}
                  onMouseEnter={() => setSelectedIdx(idx)}
                >
                  {idx + 1}. {step.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
