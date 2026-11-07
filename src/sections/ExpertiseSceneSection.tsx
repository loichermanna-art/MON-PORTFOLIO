import { useEffect, useRef, useState } from 'react';
import { MaskReveal } from '../components/typography/MaskReveal';
import { EXPERTISE_DOMAINS } from '../data/portfolioData';
import {
  motionStore,
  selectExpertiseDomain,
  setFocusedExpertisePole,
  subscribeSelectedExpertise,
} from '../motion/motionStore';
import { useSectionDepthMotion } from '../motion/useSectionDepthMotion';

/**
 * Scène 03 — EXPERTISE (Synchronisée bidirectionnellement avec les 4 monolithes 3D et le Hero)
 */
export function ExpertiseSceneSection() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [selectedIdx, setSelectedIdx] = useState<number>(motionStore.selectedExpertiseIndex);

  useEffect(() => {
    return subscribeSelectedExpertise((idx) => setSelectedIdx(idx));
  }, []);

  useSectionDepthMotion(2, leftRef, rightRef);

  return (
    <section
      id="expertise"
      className="scene-section"
      data-scene-index="2"
      aria-labelledby="expertise-heading"
    >
      <div className="arch-container">
        <div className="arch-grid" style={{ alignItems: 'end' }}>
          <div ref={leftRef} className="spatial-left">
            <MaskReveal>
              <span className="spatial-overline">03 · Expertise</span>
            </MaskReveal>

            <MaskReveal delayMs={70}>
              <h2 id="expertise-heading" className="spatial-heading">
                Des compétences complémentaires pour aller plus loin.
              </h2>
            </MaskReveal>

            <MaskReveal delayMs={140}>
              <p className="spatial-lead">
                Quatre domaines articulés avec justesse entre rigueur financière et exécution
                numérique, sans exagération ni jauges chiffrées arbitraires.
              </p>
            </MaskReveal>

            <MaskReveal delayMs={210}>
              <a href="#projects" className="pill-cta">
                <span>Découvrir les réalisations</span>
                <span className="pill-cta__arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </MaskReveal>
          </div>

          <div
            ref={rightRef}
            className="expertise-list-right"
            role="list"
            aria-label="Quatre domaines d'expertise sélectionnables"
            onMouseLeave={() => setFocusedExpertisePole(-1)}
          >
            <div className="spatial-dock-header" style={{ paddingInline: '0.25rem' }}>
              <span className="spatial-dock-kicker">COUR DES 4 STÈLES 3D · CLIQUABLES</span>
              <span className="spatial-dock-status tabular">0{selectedIdx + 1} / 04</span>
            </div>

            {EXPERTISE_DOMAINS.map((domain, idx) => {
              const isOpen = selectedIdx === idx;
              const poleIdx = idx as 0 | 1 | 2 | 3;

              return (
                <div key={domain.id} role="listitem">
                  <button
                    type="button"
                    className="expertise-item-clean"
                    data-active={isOpen ? 'true' : 'false'}
                    aria-expanded={isOpen}
                    onMouseEnter={() => setFocusedExpertisePole(poleIdx)}
                    onFocus={() => setFocusedExpertisePole(poleIdx)}
                    onClick={() => {
                      selectExpertiseDomain(idx);
                      setFocusedExpertisePole(poleIdx);
                    }}
                  >
                    <span className="expertise-icon-circle tabular" aria-hidden="true">
                      {domain.index}
                    </span>

                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                        }}
                      >
                        <strong style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--white)' }}>
                          {domain.title}
                        </strong>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.66rem',
                            color: 'var(--azure-400)',
                          }}
                        >
                          {domain.steleCode}
                        </span>
                      </div>

                      {isOpen && (
                        <div style={{ marginTop: '0.55rem' }}>
                          <p
                            style={{
                              fontSize: '0.84rem',
                              color: 'var(--ice-300)',
                              lineHeight: 1.52,
                              marginBottom: '0.55rem',
                            }}
                          >
                            {domain.summary}
                          </p>
                          <div className="tech-tag-list">
                            {domain.capabilities.map((cap) => (
                              <span key={cap} className="tech-tag">
                                {cap}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
