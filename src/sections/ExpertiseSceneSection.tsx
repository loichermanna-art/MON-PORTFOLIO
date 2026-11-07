import { useEffect, useState } from 'react';
import { EXPERTISE_DOMAINS } from '../data/portfolioData';
import {
  motionStore,
  selectExpertiseDomain,
  setFocusedExpertisePole,
  subscribeSelectedExpertise,
} from '../motion/motionStore';
import { useSectionReveal } from '../motion/useSectionReveal';

function DomainIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M4 19h16M7 15V9m5 6V5m5 10v-4" strokeLinecap="round" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" strokeLinecap="round" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="m8 8-4 4 4 4m8-8 4 4-4 4m-5 2 2-12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
    </svg>
  );
}

/**
 * SCÈNE 03 — EXPERTISE (Maquette 03 : 4 rangées vitrées à icônes circulaires, 0 % jauge factice)
 */
export function ExpertiseSceneSection() {
  const [selectedIndex, setSelectedIndex] = useState<number>(
    motionStore.selectedExpertiseIndex
  );
  const { ref, inView } = useSectionReveal<HTMLDivElement>();

  useEffect(() => {
    return subscribeSelectedExpertise((idx) => {
      if (idx >= 0 && idx < EXPERTISE_DOMAINS.length) {
        setSelectedIndex(idx);
      }
    });
  }, []);

  const handleSelectDomain = (idx: 0 | 1 | 2 | 3) => {
    setSelectedIndex(idx);
    selectExpertiseDomain(idx);
    setFocusedExpertisePole(idx);
  };

  return (
    <section
      id="expertise"
      aria-labelledby="expertise-heading"
      className="scene-band scene-band--tall"
    >
      <div
        ref={ref}
        data-inview={inView ? 'true' : 'false'}
        className="scene-inner reveal-block"
      >
        <div className="chiaroscuro-split">
          <div className="editorial-monolith-copy editorial-interactive">
            <span className="section-kicker">Expertise</span>

            <h2 id="expertise-heading" className="section-heading">
              Des compétences complémentaires pour aller plus loin.
            </h2>

            <p className="section-lead" style={{ marginBottom: '1.85rem' }}>
              Quatre piliers articulant le socle académique d’élève-ingénieur en finance à
              l’INP-HB et la conception concrète d’applications numériques — présentés avec
              sobriété, sans jauges arbitraires.
            </p>

            <a href="#projects" className="pill-cta">
              <span>Voir les réalisations</span>
              <span className="pill-cta__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>

          <div className="expertise-pill-stack editorial-interactive">
            {EXPERTISE_DOMAINS.map((domain, idx) => {
              const poleIdx = idx as 0 | 1 | 2 | 3;
              const isExpanded = selectedIndex === poleIdx;
              return (
                <article
                  key={domain.id}
                  className="expertise-pill-card"
                  data-expanded={isExpanded ? 'true' : 'false'}
                  onMouseEnter={() => setFocusedExpertisePole(poleIdx)}
                  onMouseLeave={() => setFocusedExpertisePole(-1)}
                >
                  <button
                    type="button"
                    className="expertise-pill-trigger"
                    aria-expanded={isExpanded}
                    onClick={() => handleSelectDomain(poleIdx)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.95rem' }}>
                      <span className="expertise-icon-disc">
                        <DomainIcon index={poleIdx} />
                      </span>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--white)' }}>
                          {domain.title}
                        </h3>
                        <span style={{ fontSize: '0.82rem', color: 'var(--silver-300)' }}>
                          {domain.shortSubtitle}
                        </span>
                      </div>
                    </div>

                    <span
                      aria-hidden="true"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.95rem',
                        color: 'var(--silver-200)',
                      }}
                    >
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div
                      style={{
                        padding: '0.9rem 1.25rem 1.2rem 4.75rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '0.88rem',
                          color: 'var(--silver-200)',
                          marginBottom: '0.7rem',
                        }}
                      >
                        {domain.summary}
                      </p>
                      <ul
                        style={{
                          margin: '0 0 0.75rem',
                          paddingLeft: '1rem',
                          fontSize: '0.84rem',
                          color: 'var(--silver-300)',
                          display: 'grid',
                          gap: '0.22rem',
                        }}
                      >
                        {domain.capabilities.map((cap) => (
                          <li key={cap}>{cap}</li>
                        ))}
                      </ul>
                      <span className="tech-tag">{domain.academicOrProjectBasis}</span>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
