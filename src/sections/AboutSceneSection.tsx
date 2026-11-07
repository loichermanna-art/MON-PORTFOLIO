import { useEffect, useMemo, useRef, useState } from 'react';
import { PROFILE_IDENTITY } from '../data/portfolioData';
import {
  motionStore,
  selectAboutPillar,
  setHoveredAboutPillar,
  subscribeAboutPillar,
} from '../motion/motionStore';
import { useSectionReveal } from '../motion/useSectionReveal';

interface AboutSceneSectionProps {
  reducedMotion?: boolean;
}

/**
 * SCÈNE 02 — À PROPOS (« Sky Zenith » : Terrasse vitrée panoramique au-dessus des nuages)
 * Illumination progressive mot-par-mot liée au scroll + stèle interactive des 3 principes.
 */
export function AboutSceneSection({ reducedMotion = false }: AboutSceneSectionProps) {
  const [activePillar, setActivePillar] = useState<0 | 1 | 2>(motionStore.selectedAboutPillar);
  const [litRatio, setLitRatio] = useState<number>(0.35);
  const scrubRef = useRef<HTMLParagraphElement | null>(null);
  const { ref, inView } = useSectionReveal<HTMLDivElement>();

  useEffect(() => {
    return subscribeAboutPillar((selected) => {
      setActivePillar(selected);
    });
  }, []);

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;
    const onScroll = () => {
      const el = scrubRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const start = vh * 0.88;
      const end = vh * 0.28;
      const raw = (start - rect.top) / Math.max(1, start - end);
      setLitRatio(Math.max(0.18, Math.min(1, raw)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reducedMotion]);

  const introWords = useMemo(() => PROFILE_IDENTITY.aboutIntro.split(' '), []);
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
            <span className="section-kicker">02 · À propos</span>

            <h2 id="about-heading" className="section-heading">
              {PROFILE_IDENTITY.aboutHeading}
            </h2>

            <p
              ref={scrubRef}
              className="section-lead"
              style={{ marginBottom: '1rem', fontWeight: 500 }}
            >
              {introWords.map((word, idx) => {
                const threshold = idx / introWords.length;
                const isLit = reducedMotion || litRatio >= threshold;
                return (
                  <span
                    key={`${word}-${idx}`}
                    className="zenith-scrub-word"
                    style={{
                      color: isLit ? 'var(--slate-900)' : '#94A3B8',
                    }}
                  >
                    {word}
                    {idx < introWords.length - 1 ? ' ' : ''}
                  </span>
                );
              })}
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
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--slate-600)',
                marginBottom: '0.75rem',
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
                        fontWeight: isActive ? 600 : 500,
                      }}
                    >
                      <span style={{ opacity: 0.7 }}>+</span>
                      <span>{item.title}</span>
                    </span>
                    <span
                      className="tabular"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        opacity: isActive ? 0.95 : 0.6,
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
                paddingTop: '1rem',
                borderTop: '1px solid var(--line-hairline)',
                fontSize: '0.92rem',
                lineHeight: 1.62,
                color: 'var(--slate-700)',
              }}
            >
              {currentPhilosophy.detail}
            </p>

            <div className="about-metrics-strip">
              <div className="about-metric-chip">
                <div
                  className="tabular"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--slate-900)' }}
                >
                  INP-HB
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--slate-600)' }}>
                  3e année Finance
                </div>
              </div>

              <div className="about-metric-chip">
                <div
                  className="tabular"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--slate-900)' }}
                >
                  04 Pôles
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--slate-600)' }}>
                  Finance &amp; Digital
                </div>
              </div>

              <div className="about-metric-chip">
                <div
                  className="tabular"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--amber-700)' }}
                >
                  03 Projets
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--slate-600)' }}>
                  Conçus &amp; réels
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
