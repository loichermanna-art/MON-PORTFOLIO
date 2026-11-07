import { useEffect, useState } from 'react';
import { PROCESS_STEPS } from '../data/portfolioData';
import {
  motionStore,
  setActiveProcessStep,
  subscribeActiveProcessStep,
} from '../motion/motionStore';
import { useSectionReveal } from '../motion/useSectionReveal';

/**
 * SCÈNE 05 — MÉTHODE DE TRAVAIL
 * Progression architecturale en 6 portiques (Comprendre -> Améliorer).
 * Chaque étape présente : Objectif, Actions réalisées, Décisions prises, Livrable associé et Exemple réel.
 */
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
      className="scene-band"
    >
      <div
        ref={ref}
        data-inview={inView ? 'true' : 'false'}
        className="scene-inner reveal-block editorial-interactive"
      >
        <span className="section-kicker">05 · Méthode de travail</span>
        <h2 id="process-heading" className="section-heading">
          Six étapes logiques, du diagnostic initial jusqu’à l’amélioration continue.
        </h2>
        <p className="section-lead">
          Qu’il s’agisse d’un tableau de bord financier ou d’une application web, j’applique
          un cheminement progressif où chaque étape éclaire la suivante.
        </p>

        {/* Sélecteur des 6 portiques séquentiels */}
        <div
          className="process-porticos-bar"
          role="tablist"
          aria-label="Les six étapes de la méthode de travail"
        >
          {PROCESS_STEPS.map((item, idx) => {
            const isCurrent = selectedStep === idx;
            const isPassed = idx < selectedStep;
            return (
              <button
                key={item.step}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                data-passed={isPassed ? 'true' : 'false'}
                className="portico-step-btn tabular"
                onClick={() => handleSelectStep(idx)}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: isCurrent ? 'var(--azure-400)' : 'var(--ice-300)',
                    marginBottom: '0.22rem',
                  }}
                >
                  PORTIQUE {item.step}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.96rem',
                    fontWeight: 600,
                  }}
                >
                  {idx + 1}. {item.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Panneau détaillé de l'étape active */}
        <div
          className="process-detail-grid"
          role="tabpanel"
          aria-label={`Étape ${activeItem.step} — ${activeItem.title}`}
        >
          <div className="arch-stele">
            <div
              className="tabular"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--azure-400)',
                letterSpacing: '0.12em',
                marginBottom: '0.35rem',
              }}
            >
              ÉTAPE {activeItem.step} / 06 · OBJECTIF &amp; EXÉCUTION
            </div>

            <h3 style={{ fontSize: '1.45rem', marginBottom: '0.55rem' }}>
              {activeItem.title}
            </h3>

            <p style={{ color: 'var(--white)', fontSize: '0.95rem', marginBottom: '1rem' }}>
              {activeItem.objective}
            </p>

            <div style={{ marginBottom: '0.9rem' }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--azure-400)',
                  marginBottom: '0.3rem',
                }}
              >
                ACTIONS RÉALISÉES
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '1.1rem',
                  fontSize: '0.88rem',
                  color: 'var(--ice-100)',
                  display: 'grid',
                  gap: '0.28rem',
                }}
              >
                {activeItem.actions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>

            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--azure-400)',
                  marginBottom: '0.3rem',
                }}
              >
                DÉCISIONS PRISES
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '1.1rem',
                  fontSize: '0.88rem',
                  color: 'var(--slate-700)',
                  display: 'grid',
                  gap: '0.28rem',
                }}
              >
                {activeItem.decisions.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="arch-stele" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.15rem' }}>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--azure-400)',
                  marginBottom: '0.35rem',
                }}
              >
                LIVRABLE ASSOCIÉ
              </div>
              <div style={{ marginBottom: '1.15rem' }}>
                <span className="tech-tag">{activeItem.deliverable}</span>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--azure-400)',
                  marginBottom: '0.35rem',
                }}
              >
                EXEMPLE CONCRET ({activeItem.realExample.projectOrContext})
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--ice-100)', lineHeight: 1.62 }}>
                {activeItem.realExample.illustration}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', paddingTop: '0.9rem', borderTop: '1px solid var(--line-hairline)' }}>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => handleSelectStep((selectedStep + 5) % 6)}
              >
                ← Étape précédente
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => handleSelectStep((selectedStep + 1) % 6)}
              >
                Étape suivante →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
