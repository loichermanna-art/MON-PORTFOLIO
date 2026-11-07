import { MaskReveal } from '../components/typography/MaskReveal';
import { PROFILE_IDENTITY } from '../data/portfolioData';

/**
 * Scène 02 — À PROPOS (Fondation Midnight Blue alignée sur les cadres 3D)
 */
export function AboutSceneSection() {
  return (
    <section
      id="about"
      className="scene-section"
      data-scene-index="1"
      aria-labelledby="about-heading"
    >
      <div className="arch-container">
        <div className="arch-grid" style={{ alignItems: 'center' }}>
          <div className="spatial-left">
            <MaskReveal>
              <span className="spatial-overline">02 · À propos</span>
            </MaskReveal>

            <MaskReveal delayMs={70}>
              <h2 id="about-heading" className="spatial-heading">
                {PROFILE_IDENTITY.aboutHeading}
              </h2>
            </MaskReveal>

            <MaskReveal delayMs={140}>
              <p className="spatial-lead">{PROFILE_IDENTITY.aboutIntro}</p>
            </MaskReveal>

            <MaskReveal delayMs={190}>
              <p className="spatial-lead" style={{ marginTop: '-0.75rem' }}>
                {PROFILE_IDENTITY.aboutBridge}
              </p>
            </MaskReveal>

            <MaskReveal delayMs={240}>
              <a href="#expertise" className="pill-cta">
                <span>Explorer mes compétences</span>
                <span className="pill-cta__arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </MaskReveal>
          </div>

          <aside className="arch-monolith-panel" aria-label="Repères académiques et principes">
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.18em',
                color: 'var(--azure-400)',
                marginBottom: '1rem',
              }}
            >
              FORMATION &amp; VISION · {PROFILE_IDENTITY.institution}
            </div>

            <div style={{ display: 'grid', gap: '1.1rem' }}>
              {PROFILE_IDENTITY.workPhilosophy.map((item) => (
                <div
                  key={item.index}
                  style={{
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--line-subtle)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.75rem',
                      marginBottom: '0.25rem',
                    }}
                  >
                    <span
                      className="tabular"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'var(--azure-400)',
                      }}
                    >
                      {item.index}
                    </span>
                    <strong style={{ color: 'var(--white)', fontSize: '0.98rem' }}>
                      {item.title}
                    </strong>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--ice-300)', lineHeight: 1.55 }}>
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
