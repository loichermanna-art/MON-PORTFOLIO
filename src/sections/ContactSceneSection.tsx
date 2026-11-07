import { useState } from 'react';
import { PROFILE_IDENTITY } from '../data/portfolioData';
import { setActiveContactChannel } from '../motion/motionStore';
import { useSectionReveal } from '../motion/useSectionReveal';

/**
 * SCÈNE 06 — CONTACT (Le Belvédère de l'Horizon Ouvert)
 * Coordonnées professionnelles réelles vérifiées :
 * - Courriel : loichermanna@gmail.com
 * - LinkedIn : linkedin.com/in/loic-akanda-assi
 * - GitHub : github.com/loichermanna-art
 * - Téléchargement direct du CV PDF officiel
 * - Localisation : Côte d'Ivoire · INP-HB
 */
export function ContactSceneSection() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { ref, inView } = useSectionReveal<HTMLDivElement>();

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(PROFILE_IDENTITY.contacts.email);
        setCopiedEmail(true);
        window.setTimeout(() => setCopiedEmail(false), 2400);
      }
    } catch {
      setCopiedEmail(false);
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scene-band"
    >
      <div
        ref={ref}
        data-inview={inView ? 'true' : 'false'}
        className="scene-inner reveal-block editorial-interactive"
      >
        <span className="section-kicker">06 · Contact professionnel</span>
        <h2 id="contact-heading" className="section-heading">
          {PROFILE_IDENTITY.contacts.heading}
        </h2>
        <p className="section-lead">{PROFILE_IDENTITY.contacts.lead}</p>

        <div className="contact-belvedere-grid">
          {/* 1. Courriel professionnel */}
          <div
            className="contact-terminal-card"
            onMouseEnter={() => setActiveContactChannel(0)}
            onMouseLeave={() => setActiveContactChannel(-1)}
          >
            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--azure-400)',
                  letterSpacing: '0.14em',
                  marginBottom: '0.35rem',
                }}
              >
                01 · COURRIEL DIRECT
              </span>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.16rem',
                  fontWeight: 600,
                  color: 'var(--white)',
                  wordBreak: 'break-all',
                }}
              >
                {PROFILE_IDENTITY.contacts.email}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ice-300)', marginTop: '0.25rem' }}>
                Téléphone : {PROFILE_IDENTITY.contacts.phonePrimary} / {PROFILE_IDENTITY.contacts.phoneSecondary}
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              <a
                href={`mailto:${PROFILE_IDENTITY.contacts.email}`}
                className="btn-primary"
              >
                Envoyer un courriel →
              </a>
              <button
                type="button"
                className="btn-ghost"
                onClick={handleCopyEmail}
              >
                {copiedEmail ? 'Adresse copiée ✓' : 'Copier l’adresse'}
              </button>
            </div>
          </div>

          {/* 2. LinkedIn */}
          <div
            className="contact-terminal-card"
            onMouseEnter={() => setActiveContactChannel(1)}
            onMouseLeave={() => setActiveContactChannel(-1)}
          >
            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--azure-400)',
                  letterSpacing: '0.14em',
                  marginBottom: '0.35rem',
                }}
              >
                02 · RÉSEAU PROFESSIONNEL LINKEDIN
              </span>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.16rem',
                  fontWeight: 600,
                  color: 'var(--white)',
                }}
              >
                {PROFILE_IDENTITY.contacts.linkedinLabel}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ice-300)', marginTop: '0.25rem' }}>
                Parcours académique INP-HB, stages &amp; actualités
              </div>
            </div>

            <div>
              <a
                href={PROFILE_IDENTITY.contacts.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Ouvrir le profil LinkedIn ↗
              </a>
            </div>
          </div>

          {/* 3. GitHub */}
          <div
            className="contact-terminal-card"
            onMouseEnter={() => setActiveContactChannel(2)}
            onMouseLeave={() => setActiveContactChannel(-1)}
          >
            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--azure-400)',
                  letterSpacing: '0.14em',
                  marginBottom: '0.35rem',
                }}
              >
                03 · DÉPÔTS &amp; PROJETS GITHUB
              </span>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.16rem',
                  fontWeight: 600,
                  color: 'var(--white)',
                }}
              >
                {PROFILE_IDENTITY.contacts.githubHandle}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ice-300)', marginTop: '0.25rem' }}>
                Code source des applications web conçues et déployées
              </div>
            </div>

            <div>
              <a
                href={PROFILE_IDENTITY.contacts.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Explorer le profil GitHub ↗
              </a>
            </div>
          </div>

          {/* 4. Téléchargement du CV & Localisation */}
          <div
            className="contact-terminal-card"
            onMouseEnter={() => setActiveContactChannel(3)}
            onMouseLeave={() => setActiveContactChannel(-1)}
          >
            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--azure-400)',
                  letterSpacing: '0.14em',
                  marginBottom: '0.35rem',
                }}
              >
                04 · CURRICULUM VITAE &amp; LOCALISATION
              </span>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.16rem',
                  fontWeight: 600,
                  color: 'var(--white)',
                }}
              >
                {PROFILE_IDENTITY.fullCivilName} — CV Officiel
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ice-300)', marginTop: '0.25rem' }}>
                {PROFILE_IDENTITY.contacts.location}
              </div>
            </div>

            <div>
              <a
                href={PROFILE_IDENTITY.cvUrl}
                download={PROFILE_IDENTITY.cvDownloadName}
                className="btn-primary"
              >
                Télécharger le CV (PDF) ↓
              </a>
            </div>
          </div>
        </div>

        <footer
          style={{
            marginTop: '2rem',
            paddingTop: '1.15rem',
            borderTop: '1px solid var(--line-hairline)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.73rem',
            color: 'var(--ice-300)',
          }}
        >
          <span>© 2026 {PROFILE_IDENTITY.fullName} · Audit, Finance &amp; Solutions Numériques</span>
          <span>{PROFILE_IDENTITY.contacts.location}</span>
        </footer>
      </div>
    </section>
  );
}
