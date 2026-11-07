import { useState } from 'react';
import { MaskReveal } from '../components/typography/MaskReveal';
import { PROFILE_IDENTITY } from '../data/portfolioData';

/**
 * Scène 06 — Restons connectés (Horizon Crépusculaire Doré)
 * Fidèle au Panneau 06 : atmosphère ardoise & soleil couchant doré, typographie blanche
 * aérienne, pilule « Me contacter → » et canaux vérifiés.
 */
export function ContactSceneSection() {
  const [contactSheetOpen, setContactSheetOpen] = useState<boolean>(false);
  const [copiedGithub, setCopiedGithub] = useState<boolean>(false);

  const handleCopyGithub = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE_IDENTITY.contacts.githubUrl);
      setCopiedGithub(true);
      window.setTimeout(() => setCopiedGithub(false), 2400);
    } catch {
      setCopiedGithub(false);
    }
  };

  return (
    <section
      id="contact"
      className="scene-section scene-section--dusk"
      data-scene-index="5"
      aria-labelledby="contact-heading"
    >
      <div />

      <div className="arch-container" style={{ marginBlock: 'auto' }}>
        <div className="arch-grid">
          <div className="spatial-left">
            <MaskReveal>
              <span className="spatial-overline">Restons connectés</span>
            </MaskReveal>

            <MaskReveal delayMs={70}>
              <h2
                id="contact-heading"
                className="spatial-heading"
                style={{ color: 'var(--dusk-ink)' }}
              >
                Ensemble, créons des solutions utiles et exigeantes.
              </h2>
            </MaskReveal>

            <MaskReveal delayMs={140}>
              <p className="spatial-lead">
                Disponible pour échanger autour d’opportunités académiques, de stages en finance,
                audit ou analyse financière, et de projets de conception web.
              </p>
            </MaskReveal>

            <MaskReveal delayMs={210}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
                <button
                  type="button"
                  className="pill-cta pill-cta--light"
                  aria-expanded={contactSheetOpen}
                  onClick={() => setContactSheetOpen((v) => !v)}
                >
                  <span>Me contacter</span>
                  <span aria-hidden="true">→</span>
                </button>

                <a
                  href={PROFILE_IDENTITY.contacts.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-cta pill-cta--light"
                >
                  <span>{PROFILE_IDENTITY.contacts.githubHandle}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </MaskReveal>

            {contactSheetOpen && (
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1.25rem 1.4rem',
                  background: 'rgba(15, 18, 24, 0.78)',
                  border: '1px solid rgba(248, 250, 252, 0.22)',
                  borderRadius: 'var(--radius-lg)',
                  width: '100%',
                  maxWidth: '32rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.85rem',
                  }}
                >
                  <strong style={{ fontSize: '0.92rem', color: '#ffffff' }}>
                    Coordonnées directes
                  </strong>
                  <button
                    type="button"
                    onClick={handleCopyGithub}
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '0.3rem 0.75rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    {copiedGithub ? 'Lien GitHub copié' : 'Copier GitHub'}
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '0.6rem', fontSize: '0.84rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <span style={{ color: 'var(--dusk-muted)' }}>GitHub vérifié</span>
                    <a
                      href={PROFILE_IDENTITY.contacts.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#ffffff' }}
                    >
                      {PROFILE_IDENTITY.contacts.githubHandle}
                    </a>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <span style={{ color: 'var(--dusk-muted)' }}>Email direct</span>
                    <span style={{ color: 'var(--dusk-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      {PROFILE_IDENTITY.contacts.email}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <span style={{ color: 'var(--dusk-muted)' }}>LinkedIn</span>
                    <span style={{ color: 'var(--dusk-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      {PROFILE_IDENTITY.contacts.linkedin}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="dusk-colophon" role="contentinfo">
        <span>
          <strong>{PROFILE_IDENTITY.fullName}</strong> — {PROFILE_IDENTITY.academicTitle} ·{' '}
          {PROFILE_IDENTITY.institution}
        </span>
        <a
          href="#hero"
          style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 500 }}
        >
          Haut de page ↑
        </a>
      </footer>
    </section>
  );
}
