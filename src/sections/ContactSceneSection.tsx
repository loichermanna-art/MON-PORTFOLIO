import { useEffect, useState } from 'react';
import { PROFILE_IDENTITY } from '../data/portfolioData';
import {
  motionStore,
  selectContactChannel,
  setActiveContactChannel,
  subscribeContactChannel,
} from '../motion/motionStore';
import { useSectionReveal } from '../motion/useSectionReveal';

/**
 * SCÈNE 06 — CONTACT (Maquette 06 : Degrés monumentaux, portail sur l'horizon & sphère miroir)
 */
export function ContactSceneSection() {
  const [copiedGithub, setCopiedGithub] = useState(false);
  const [showChannels, setShowChannels] = useState<boolean>(
    () => motionStore.selectedContactChannel >= 0
  );
  const { ref, inView } = useSectionReveal<HTMLDivElement>();

  useEffect(() => {
    return subscribeContactChannel((selected) => {
      setShowChannels(selected >= 0);
    });
  }, []);

  const handleCopyGithub = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(PROFILE_IDENTITY.contacts.githubUrl);
        setCopiedGithub(true);
        window.setTimeout(() => setCopiedGithub(false), 2400);
      }
    } catch {
      setCopiedGithub(false);
    }
  };

  const toggleChannels = () => {
    const next = !showChannels;
    setShowChannels(next);
    selectContactChannel(next ? 0 : -1);
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
        className="scene-inner reveal-block"
      >
        <div className="chiaroscuro-split">
          <div className="editorial-monolith-copy editorial-interactive">
            <span className="section-kicker">Restons connectés</span>

            <h2 id="contact-heading" className="section-heading">
              {PROFILE_IDENTITY.contacts.heading}
            </h2>

            <p className="section-lead" style={{ marginBottom: '2rem' }}>
              {PROFILE_IDENTITY.contacts.lead}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
              <button
                type="button"
                className="pill-cta"
                aria-expanded={showChannels}
                onClick={toggleChannels}
                onMouseEnter={() => setActiveContactChannel(0)}
                onMouseLeave={() => setActiveContactChannel(-1)}
              >
                <span>
                  {showChannels ? 'Masquer les coordonnées' : 'Afficher les coordonnées'}
                </span>
                <span className="pill-cta__arrow" aria-hidden="true">
                  →
                </span>
              </button>

              <a
                href={PROFILE_IDENTITY.contacts.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                onMouseEnter={() => setActiveContactChannel(0)}
                onMouseLeave={() => setActiveContactChannel(-1)}
              >
                GitHub ↗
              </a>
            </div>
          </div>

          <div
            className="editorial-interactive"
            style={{ justifySelf: 'end', width: 'min(100%, 28rem)' }}
          >
            {showChannels && (
              <div className="glass-card-subtle" style={{ display: 'grid', gap: '1.1rem' }}>
                <div
                  style={{
                    paddingBottom: '0.95rem',
                    borderBottom: '1px solid var(--line-hairline)',
                  }}
                  onMouseEnter={() => setActiveContactChannel(0)}
                  onMouseLeave={() => setActiveContactChannel(-1)}
                >
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.14em',
                      color: 'var(--silver-400)',
                      marginBottom: '0.3rem',
                    }}
                  >
                    GITHUB VÉRIFIÉ
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.65rem',
                    }}
                  >
                    <a
                      href={PROFILE_IDENTITY.contacts.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontWeight: 600, fontSize: '0.96rem', color: 'var(--white)' }}
                    >
                      {PROFILE_IDENTITY.contacts.githubHandle} ↗
                    </a>
                    <button
                      type="button"
                      className="btn-ghost"
                      style={{
                        minHeight: '2.05rem',
                        padding: '0.22rem 0.8rem',
                        fontSize: '0.76rem',
                      }}
                      onClick={handleCopyGithub}
                    >
                      {copiedGithub ? 'Lien copié ✓' : 'Copier'}
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    paddingBottom: '0.95rem',
                    borderBottom: '1px solid var(--line-hairline)',
                  }}
                  onMouseEnter={() => setActiveContactChannel(1)}
                  onMouseLeave={() => setActiveContactChannel(-1)}
                >
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.14em',
                      color: 'var(--silver-400)',
                      marginBottom: '0.3rem',
                    }}
                  >
                    LINKEDIN PROFESSIONNEL
                  </span>
                  <span className="placeholder-tag">{PROFILE_IDENTITY.contacts.linkedin}</span>
                </div>

                <div
                  onMouseEnter={() => setActiveContactChannel(2)}
                  onMouseLeave={() => setActiveContactChannel(-1)}
                >
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.14em',
                      color: 'var(--silver-400)',
                      marginBottom: '0.3rem',
                    }}
                  >
                    COURRIEL DIRECT
                  </span>
                  <span className="placeholder-tag">{PROFILE_IDENTITY.contacts.email}</span>
                </div>
              </div>
            )}

            <footer
              style={{
                marginTop: '1.25rem',
                paddingInline: '0.35rem',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--silver-300)',
              }}
            >
              <span>© 2026 Loïc AKANDA · {PROFILE_IDENTITY.signatureCanonical}</span>
              <span>{PROFILE_IDENTITY.contacts.location}</span>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
