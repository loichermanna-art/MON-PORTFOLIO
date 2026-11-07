import { useState } from 'react';
import { MaskReveal } from '../components/typography/MaskReveal';
import { PROFILE_IDENTITY } from '../data/portfolioData';

/**
 * Scène 06 — CONTACT (Architecture ouverte sur un horizon lumineux)
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
      className="scene-section scene-section--horizon"
      data-scene-index="5"
      aria-labelledby="contact-heading"
    >
      <div />

      <div className="arch-container" style={{ marginBlock: 'auto' }}>
        <div className="arch-grid">
          <div className="spatial-left">
            <MaskReveal>
              <span className="spatial-overline">06 · Contact</span>
            </MaskReveal>

            <MaskReveal delayMs={70}>
              <h2 id="contact-heading" className="spatial-heading">
                {PROFILE_IDENTITY.contacts.heading}
              </h2>
            </MaskReveal>

            <MaskReveal delayMs={140}>
              <p className="spatial-lead">{PROFILE_IDENTITY.contacts.lead}</p>
            </MaskReveal>

            <MaskReveal delayMs={210}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
                <button
                  type="button"
                  className="pill-cta"
                  aria-expanded={contactSheetOpen}
                  onClick={() => setContactSheetOpen((v) => !v)}
                >
                  <span>Afficher les coordonnées</span>
                  <span className="pill-cta__arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>

                <a
                  href={PROFILE_IDENTITY.contacts.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-cta"
                >
                  <span>{PROFILE_IDENTITY.contacts.githubHandle}</span>
                  <span className="pill-cta__arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </div>
            </MaskReveal>

            {contactSheetOpen && (
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1.35rem 1.5rem',
                  background: 'rgba(10, 26, 49, 0.88)',
                  border: '1px solid var(--line-medium)',
                  width: '100%',
                  maxWidth: '34rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.9rem',
                  }}
                >
                  <strong style={{ fontSize: '0.92rem', color: 'var(--white)' }}>
                    Canaux professionnels
                  </strong>
                  <button
                    type="button"
                    onClick={handleCopyGithub}
                    className="hero-stele-chip"
                  >
                    {copiedGithub ? 'URL GitHub copiée' : 'Copier GitHub'}
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '0.65rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <span style={{ color: 'var(--ice-300)' }}>GitHub</span>
                    <a
                      href={PROFILE_IDENTITY.contacts.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--azure-400)' }}
                    >
                      {PROFILE_IDENTITY.contacts.githubHandle}
                    </a>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <span style={{ color: 'var(--ice-300)' }}>E-mail</span>
                    <span style={{ color: 'var(--ice-100)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      {PROFILE_IDENTITY.contacts.email}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <span style={{ color: 'var(--ice-300)' }}>LinkedIn</span>
                    <span style={{ color: 'var(--ice-100)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
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
          <strong style={{ color: 'var(--white)' }}>{PROFILE_IDENTITY.fullName}</strong> —{' '}
          {PROFILE_IDENTITY.academicTitle} · {PROFILE_IDENTITY.institution}
        </span>
        <a
          href="#hero"
          style={{ color: 'var(--azure-400)', textDecoration: 'none', fontWeight: 500 }}
        >
          Retour en haut ↑
        </a>
      </footer>
    </section>
  );
}
