import { useEffect, useState } from 'react';
import { PROCESS_STEPS } from '../data/portfolioData';
import { motionStore, subscribeActiveProcessStep } from '../motion/motionStore';
import { MaskReveal } from '../components/typography/MaskReveal';

/**
 * SCÈNE 05 — PROCESS / APPROACH (« La Passerelle Séquentielle »)
 * Méthode rigoureuse en 6 étapes synchronisée avec le verrouillage mécanique
 * des 6 dalles de la passerelle 3D en arrière-plan.
 */
export function ProcessSceneSection() {
  const [lockedUpTo, setLockedUpTo] = useState<number>(motionStore.activeProcessStep);

  useEffect(() => {
    return subscribeActiveProcessStep((step) => setLockedUpTo(step));
  }, []);

  return (
    <section id="process" className="scene-section" aria-labelledby="process-heading">
      <div className="arch-container arch-grid">
        <div className="process-wrapper">
          <MaskReveal>
            <div className="scene-index-line tabular">
              <span className="scene-index-line__rule" aria-hidden="true" />
              <span>SCÈNE 05 — LA PASSERELLE SÉQUENTIELLE · MÉTHODE EN 6 ÉTAPES</span>
            </div>
          </MaskReveal>

          <MaskReveal delayMs={70}>
            <h2 id="process-heading" className="section-display-title">
              Une démarche structurée, de l’identification du problème à l’amélioration continue.
            </h2>
          </MaskReveal>

          <p style={{ color: 'var(--ink-muted)', fontSize: '0.96rem' }}>
            À l’image des six travées de la passerelle qui s’alignent au défilement, chaque projet
            suit une progression logique où aucune étape n’est court-circuitée.
          </p>

          <div className="process-grid" role="list" aria-label="Les 6 étapes de la méthode">
            {PROCESS_STEPS.map((item, idx) => {
              const isLocked = idx <= lockedUpTo;
              return (
                <article
                  key={item.step}
                  role="listitem"
                  className="process-step-card"
                  data-locked={isLocked ? 'true' : 'false'}
                >
                  <div className="process-step-card__num tabular">
                    <span>PALIER {item.step} / 06</span>
                    <span className="process-step-card__status">
                      {isLocked ? '● Aligné' : '○ Séquentiel'}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.55rem',
                      lineHeight: 1.12,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--ink-muted)',
                      marginBottom: 'var(--space-4)',
                    }}
                  >
                    {item.summary}
                  </p>

                  <div
                    style={{
                      paddingTop: '0.65rem',
                      borderTop: '1px solid var(--line-subtle)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.73rem',
                      color: 'var(--ink)',
                    }}
                  >
                    Livrable : {item.deliverable}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
