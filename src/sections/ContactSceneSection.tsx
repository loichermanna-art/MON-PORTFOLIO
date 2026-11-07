import { useEffect, useRef, useState } from 'react';
import { MaskReveal } from '../components/typography/MaskReveal';
import { PROFILE_IDENTITY } from '../data/portfolioData';
import {
  motionStore,
  selectContactChannel,
  setActiveContactChannel,
  subscribeContactChannel,
} from '../motion/motionStore';
import { useSectionDepthMotion } from '../motion/useSectionDepthMotion';

/**
 * Scène 06 — CONTACT (Belvédère ouvert sur l'horizon & 3 pupitres vitrés interactifs en 3D) :
 * - Dégage entièrement le centre et la droite pour révéler l'ouverture du pavillon sur la mer calme
 *   et la voûte céleste d'heure bleue.
 * - Synchronise en temps réel les 3 bornes du belvédère 3D (E-mail, LinkedIn, GitHub) avec le rail.
 */
export function ContactSceneSection() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLElement>(null);
  const [selectedChannel, setSelectedChannel] = useState<-1 | 0 | 1 | 2>(
    motionStore.selectedContactChannel
  );
  const [hoveredChannel, setHoveredChannel] = useState<-1 | 0 | 1 | 2>(
    motionStore.activeContactChannel
  );
  const [copiedGithub, setCopiedGithub] = useState<boolean>(false);

  useEffect(() => {
    return subscribeContactChannel((sel, hov) => {
      setSelectedChannel(sel);
      setHoveredChannel(hov);
    });
  }, []);

  useSectionDepthMotion(5, leftRef, rightRef);

  const contactSheetOpen = selectedChannel !== -1;
  const highlightedChannel: 0 | 1 | 2 =
    hoveredChannel !== -1 ? hoveredChannel : selectedChannel !== -1 ? selectedChannel : 2;

  const handleToggleSheet = () => {
    selectContactChannel(contactSheetOpen ? -1 : 2);
  };

  const handleCopyGithub = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE_IDENTITY.contacts.githubUrl);
      setCopiedGithub(true);
      window.setTimeout(() => setCopiedGithub(false), 2400);
    } catch {
      setCopiedGithub(false);
    }
  };

  const channels = [
    {
      idx: 0 as const,
      code: '01',
      label: 'E-mail',
      value: PROFILE_IDENTITY.contacts.email,
      isLink: false,
    },
    {
      idx: 1 as const,
      code: '02',
      label: 'LinkedIn',
      value: PROFILE_IDENTITY.contacts.linkedin,
      isLink: false,
    },
    {
      idx: 2 as const,
      code: '03',
      label: 'GitHub',
      value: PROFILE_IDENTITY.contacts.githubHandle,
      href: PROFILE_IDENTITY.contacts.githubUrl,
      isLink: true,
    },
  ];

  return (
    <section
      id="contact"
      className="scene-section scene-section--horizon"
      data-scene-index="5"
      aria-labelledby="contact-heading"
    >
      <div />

      <div className="arch-container" style={{ marginBlock: 'auto' }}>
        <div className="arch-grid" style={{ alignItems: 'end' }}>
          <div ref={leftRef} className="spatial-left">
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
                  onClick={handleToggleSheet}
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
                  onMouseEnter={() => setActiveContactChannel(2)}
                  onMouseLeave={() => setActiveContactChannel(-1)}
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
                  marginTop: '1.35rem',
                  padding: '1.2rem 1.35rem',
                  background: 'rgba(8, 21, 39, 0.84)',
                  border: '1px solid var(--line-medium)',
                  width: '100%',
                  maxWidth: '33rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.8rem',
                  }}
                >
                  <strong style={{ fontSize: '0.9rem', color: 'var(--white)' }}>
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

                <div style={{ display: 'grid', gap: '0.6rem', fontSize: '0.84rem' }}>
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
                    <span style={{ color: 'var(--ice-100)', fontFamily: 'var(--font-mono)', fontSize: '0.73rem' }}>
                      {PROFILE_IDENTITY.contacts.email}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <span style={{ color: 'var(--ice-300)' }}>LinkedIn</span>
                    <span style={{ color: 'var(--ice-100)', fontFamily: 'var(--font-mono)', fontSize: '0.73rem' }}>
                      {PROFILE_IDENTITY.contacts.linkedin}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside
            ref={rightRef}
            className="spatial-dock-right"
            aria-label="Bornes interactives du belvédère 3D"
            onMouseLeave={() => setActiveContactChannel(-1)}
          >
            <div className="spatial-dock-header">
              <span className="spatial-dock-kicker">BELVÉDÈRE 3D · HORIZON OUVERT</span>
              <span className="spatial-dock-status tabular">
                SEUIL 0{highlightedChannel + 1} / 03
              </span>
            </div>

            <div className="spatial-pill-strip">
              {channels.map((ch) => {
                const isActive = highlightedChannel === ch.idx;
                return (
                  <button
                    key={ch.code}
                    type="button"
                    className="spatial-tab-chip tabular"
                    data-active={isActive ? 'true' : 'false'}
                    onMouseEnter={() => setActiveContactChannel(ch.idx)}
                    onFocus={() => setActiveContactChannel(ch.idx)}
                    onBlur={() => setActiveContactChannel(-1)}
                    onClick={() => selectContactChannel(ch.idx)}
                  >
                    <span className="spatial-tab-chip__num">{ch.code}</span>
                    <span>{ch.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="spatial-dock-readout" aria-live="polite">
              <strong className="spatial-dock-readout__title">
                {channels[highlightedChannel].label} · {PROFILE_IDENTITY.contacts.location}
              </strong>
              <p className="spatial-dock-readout__desc">
                {channels[highlightedChannel].isLink ? (
                  <a
                    href={channels[highlightedChannel].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--azure-400)', textDecoration: 'none' }}
                  >
                    {channels[highlightedChannel].value} ↗
                  </a>
                ) : (
                  channels[highlightedChannel].value
                )}
              </p>
            </div>
          </aside>
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
