import { useEffect, useState } from 'react';
import { PROFILE_IDENTITY } from '../data/portfolioData';
import {
  motionStore,
  selectAboutPillar,
  setHoveredAboutPillar,
  subscribeAboutPillar,
} from '../motion/motionStore';
import { useSectionReveal } from '../motion/useSectionReveal';

/**
 * SCÈNE 02 — À PROPOS (Maquette 02 + Portiques blancs & stèle de verre fumé)
 */
export function AboutSceneSection() {
  const [activePillar, setActivePillar] = useState<0 | 1 | 2>(motionStore.selectedAboutPillar);
  const { ref, inView } = useSectionReveal<HTMLDivElement>();

  useEffect(() => {
    return subscribeAboutPillar((selected) => {
      setActivePillar(selected);
    });
  }, []);

  const currentPhilosophy = PROFILE_IDENTITY.workPhilosophy[activePillar];

  return (
    <section id="about" aria-labelledby="about-heading" className="scene-band">
      <div
        ref={ref}
        data-inview={inView ? 'true' : 'false'}
        className="scene-inner reveal-block"
      >
        <div className="chiaroscuro-split">
          <div className="editorial-monolith-copy editorial-interactive">
            <span className="section-kicker">À propos</span>

            <h2 id="about-heading" className="section-heading">
              {PROFILE_IDENTITY.aboutHeading}
            </h2>

            <p className="section-lead" style={{ marginBottom: '1rem' }}>
              {PROFILE_IDENTITY.aboutIntro}
            </p>

            <p className="section-lead" style={{ marginBottom: '1.85rem' }}>
              {PROFILE_IDENTITY.aboutBridge}
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.85rem',
              }}
            >
              <a href="#expertise" className="pill-cta">
                <span>Explorer mes compétences</span>
                <span className="pill-cta__arrow" aria-hidden="true">
                  →
                </span>
              </a>

              <span className="tech-tag">{PROFILE_IDENTITY.institution}</span>
            </div>
          </div>

          <div
            className="about-stele-panel editorial-interactive"
            aria-label="Principes directeurs"
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--silver-400)',
                marginBottom: '0.65rem',
              }}
            >
              {PROFILE_IDENTITY.academicTitle}
            </span>

            <div>
              {PROFILE_IDENTITY.workPhilosophy.map((item, idx) => {
                const pillarIdx = idx as 0 | 1 | 2;
                const isActive = activePillar === pillarIdx;
                return (
                  <button
                    key={item.index}
                    type="button"
                    className="about-plus-item"
                    data-active={isActive ? 'true' : 'false'}
                    aria-pressed={isActive}
                    onClick={() => {
                      selectAboutPillar(pillarIdx);
                      setHoveredAboutPillar(pillarIdx);
                    }}
                    onMouseEnter={() => setHoveredAboutPillar(pillarIdx)}
                    onMouseLeave={() => setHoveredAboutPillar(-1)}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'baseline',
                        gap: '0.75rem',
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.04rem',
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      <span style={{ opacity: 0.6 }}>+</span>
                      <span>{item.title}</span>
                    </span>
                    <span
                      className="tabular"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        opacity: isActive ? 0.95 : 0.45,
                      }}
                    >
                      {item.index}
                    </span>
                  </button>
                );
              })}
            </div>

            <p
              style={{
                marginTop: '1.15rem',
                fontSize: '0.9rem',
                lineHeight: 1.62,
                color: 'var(--silver-200)',
              }}
            >
              {currentPhilosophy.detail}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
