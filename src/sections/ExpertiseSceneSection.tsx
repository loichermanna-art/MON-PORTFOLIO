import { useEffect, useState } from 'react';
import { EXPERTISE_DOMAINS } from '../data/portfolioData';
import {
  motionStore,
  selectExpertiseDomain,
  setFocusedExpertisePole,
  subscribeSelectedExpertise,
} from '../motion/motionStore';
import { useSectionReveal } from '../motion/useSectionReveal';

/**
 * SCÈNE 03 — COMPÉTENCES & EXPERTISE
 * 5 domaines architecturaux reliés aux 5 monolithes 3D, séparant explicitement :
 * 1. Connaissances académiques
 * 2. Compétences pratiques
 * 3. Outils réellement utilisés (avec contexte et niveau réel, sans jauge %)
 * 4. Domaines d'intérêt et d'approfondissement
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

  const handleSelectDomain = (idx: number) => {
    setSelectedIndex(idx);
    selectExpertiseDomain(idx);
    setFocusedExpertisePole(idx);
  };

  const activeDomain = EXPERTISE_DOMAINS[selectedIndex] ?? EXPERTISE_DOMAINS[0];

  return (
    <section
      id="expertise"
      aria-labelledby="expertise-heading"
      className="scene-band"
    >
      <div
        ref={ref}
        data-inview={inView ? 'true' : 'false'}
        className="scene-inner reveal-block editorial-interactive"
      >
        <span className="section-kicker">03 · Compétences &amp; Outils</span>
        <h2 id="expertise-heading" className="section-heading">
          Ce que j’étudie, ce que je pratique et ce que j’approfondis.
        </h2>
        <p className="section-lead" style={{ marginBottom: '2rem' }}>
          Cinq pôles distinguant clairement les acquis académiques de l’INP-HB, la pratique
          en stage et sur projets, les logiciels effectivement utilisés et mes axes de
          progression professionnelle — sans aucun pourcentage arbitraire.
        </p>

        <div className="expertise-monolith-layout">
          <div
            className="monolith-selector-list"
            role="tablist"
            aria-label="Les cinq domaines de compétences"
          >
            {EXPERTISE_DOMAINS.map((domain, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <button
                  key={domain.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className="monolith-selector-btn"
                  onClick={() => handleSelectDomain(idx)}
                  onMouseEnter={() => setFocusedExpertisePole(idx)}
                  onMouseLeave={() => setFocusedExpertisePole(-1)}
                >
                  <div>
                    <span
                      className="tabular"
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        color: isSelected ? 'var(--azure-400)' : 'var(--ice-300)',
                        marginBottom: '0.2rem',
                      }}
                    >
                      MONOLITHE {domain.index} · {domain.steleCode}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: 'var(--white)',
                      }}
                    >
                      {domain.title}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--ice-300)' }}>
                      {domain.shortSubtitle}
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.9rem',
                      color: isSelected ? 'var(--azure-400)' : 'var(--ice-300)',
                    }}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className="arch-stele"
            role="tabpanel"
            aria-label={`Détails du domaine ${activeDomain.title}`}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--azure-400)',
                marginBottom: '0.35rem',
              }}
            >
              DOMAINE {activeDomain.index} / 05 · {activeDomain.steleCode}
            </div>

            <h3 style={{ fontSize: '1.45rem', marginBottom: '0.5rem' }}>
              {activeDomain.title}
            </h3>

            <p style={{ color: 'var(--slate-700)', fontSize: '0.93rem' }}>
              {activeDomain.summary}
            </p>

            <div className="expertise-four-registers">
              <div className="register-panel">
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: 'var(--azure-400)',
                    marginBottom: '0.4rem',
                  }}
                >
                  01 · CONNAISSANCES ACADÉMIQUES
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '1.05rem',
                    fontSize: '0.85rem',
                    color: 'var(--ice-100)',
                    display: 'grid',
                    gap: '0.28rem',
                  }}
                >
                  {activeDomain.academicKnowledge.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="register-panel">
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: 'var(--azure-400)',
                    marginBottom: '0.4rem',
                  }}
                >
                  02 · COMPÉTENCES PRATIQUES
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '1.05rem',
                    fontSize: '0.85rem',
                    color: 'var(--ice-100)',
                    display: 'grid',
                    gap: '0.28rem',
                  }}
                >
                  {activeDomain.practicalSkills.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="register-panel">
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: 'var(--azure-400)',
                    marginBottom: '0.4rem',
                  }}
                >
                  03 · OUTILS RÉELLEMENT UTILISÉS
                </div>
                <div style={{ display: 'grid', gap: '0.42rem' }}>
                  {activeDomain.toolsUsed.map((tool) => (
                    <div key={tool.name}>
                      <div
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: 'var(--white)',
                        }}
                      >
                        {tool.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--ice-300)' }}>
                        {tool.usageLevel}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="register-panel">
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: 'var(--azure-400)',
                    marginBottom: '0.4rem',
                  }}
                >
                  04 · DOMAINES D’INTÉRÊT
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '1.05rem',
                    fontSize: '0.85rem',
                    color: 'var(--slate-700)',
                    display: 'grid',
                    gap: '0.28rem',
                  }}
                >
                  {activeDomain.areasOfInterest.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
