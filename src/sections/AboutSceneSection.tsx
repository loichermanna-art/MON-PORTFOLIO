import { PROFILE_IDENTITY } from '../data/portfolioData';
import { MaskReveal } from '../components/typography/MaskReveal';

/**
 * SCÈNE 02 — ABOUT / IDENTITÉ & PARCOURS (« La Galerie à Claire-Voie »)
 * Inversion spatiale : l'enfilade 3D des brise-soleil verticaux occupe la gauche (cols 1–6)
 * tandis que le récit académique et la philosophie de travail s'installent à droite (cols 7–12).
 */
export function AboutSceneSection() {
  return (
    <section id="about" className="scene-section" aria-labelledby="about-heading">
      <div className="arch-container arch-grid">
        <div className="scene-panel scene-panel--right">
          <MaskReveal>
            <div className="scene-index-line tabular">
              <span className="scene-index-line__rule" aria-hidden="true" />
              <span>SCÈNE 02 — LA GALERIE À CLAIRE-VOIE · IDENTITÉ &amp; PARCOURS</span>
            </div>
          </MaskReveal>

          <MaskReveal delayMs={70}>
            <h2 id="about-heading" className="section-display-title">
              Une double lecture des organisations : par la structure des chiffres et par
              l’architecture des outils.
            </h2>
          </MaskReveal>

          <MaskReveal delayMs={140}>
            <p style={{ color: 'var(--ink)', marginBottom: 'var(--space-4)' }}>
              {PROFILE_IDENTITY.aboutIntro}
            </p>
            <p style={{ color: 'var(--ink-muted)', fontSize: '0.96rem' }}>
              {PROFILE_IDENTITY.aboutBridge}
            </p>
          </MaskReveal>

          <MaskReveal delayMs={200}>
            <div className="academic-ledger" aria-label="Repères académiques">
              <div>
                <div className="academic-ledger__label">Établissement</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {PROFILE_IDENTITY.institution}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--ink-muted)' }}>
                  Cycle Ingénieur — 3e année (Finance)
                </div>
              </div>
              <div>
                <div className="academic-ledger__label">Spécialisation &amp; Filière</div>
                <span className="placeholder-tag">
                  {PROFILE_IDENTITY.institutionDetailPlaceholder}
                </span>
              </div>
              <div style={{ gridColumn: '1 / -1', paddingTop: '0.35rem', borderTop: '1px solid var(--line-subtle)' }}>
                <div className="academic-ledger__label">Intérêts professionnels</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>
                  {PROFILE_IDENTITY.professionalInterests}
                </div>
              </div>
            </div>
          </MaskReveal>

          <MaskReveal delayMs={260}>
            <div className="philosophy-list" aria-label="Philosophie de travail">
              {PROFILE_IDENTITY.workPhilosophy.map((item) => (
                <div key={item.index} className="philosophy-item">
                  <span
                    className="tabular"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: 'var(--accent-bronze)',
                    }}
                  >
                    {item.index}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.98rem',
                        fontWeight: 600,
                        marginBottom: '0.2rem',
                      }}
                    >
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--ink-muted)' }}>
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </MaskReveal>
        </div>
      </div>
    </section>
  );
}
