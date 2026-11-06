import { useState } from 'react';
import { PROFILE_IDENTITY } from '../data/portfolioData';
import { MaskReveal } from '../components/typography/MaskReveal';

interface ContactSceneSectionProps {
  onOpenMockups: () => void;
}

/**
 * SCÈNE 06 — CONTACT (« Le Belvédère Ouvert »)
 * Composition centrée-structurée apaisée (colonnes 3 à 10) face à l'horizon dégagé du Belvédère.
 */
export function ContactSceneSection({ onOpenMockups }: ContactSceneSectionProps) {
  const [copiedGithub, setCopiedGithub] = useState<boolean>(false);

  const handleCopyGithub = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(PROFILE_IDENTITY.contacts.githubUrl);
        setCopiedGithub(true);
        window.setTimeout(() => setCopiedGithub(false), 2200);
      }
    } catch {
      setCopiedGithub(false);
    }
  };

  return (
    <section
      id="contact"
      className="scene-section scene-section--contact"
      aria-labelledby="contact-heading"
    >
      <div className="arch-container arch-grid" style={{ marginBlock: 'auto' }}>
        <div className="contact-pavilion">
          <MaskReveal>
            <div className="scene-index-line tabular" style={{ justifyContent: 'center' }}>
              <span>SCÈNE 06 — LE BELVÉDÈRE · PRISE DE CONTACT</span>
            </div>
          </MaskReveal>

          <MaskReveal delayMs={70}>
            <h2 id="contact-heading" className="section-display-title">
              Disponible pour échanger autour d’une opportunité en finance, en audit ou d’un projet
              numérique exigeant.
            </h2>
          </MaskReveal>

          <MaskReveal delayMs={140}>
            <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--step-0)' }}>
              Que vous représentiez un cabinet, une entreprise, une institution financière ou une
              équipe porteuse d’un besoin numérique concret, je serai ravi d’échanger avec vous de
              manière directe et structurée.
            </p>
          </MaskReveal>

          <div className="contact-channels" aria-label="Coordonnées de contact">
            <div className="contact-channel-card">
              <div>
                <div className="contact-channel-card__label">01 · Courriel direct</div>
                <div style={{ marginTop: '0.45rem' }}>
                  <span className="placeholder-tag">{PROFILE_IDENTITY.contacts.email}</span>
                </div>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                Adresse professionnelle à confirmer avant publication finale.
              </span>
            </div>

            <div className="contact-channel-card">
              <div>
                <div className="contact-channel-card__label">02 · Réseau professionnel</div>
                <div style={{ marginTop: '0.45rem' }}>
                  <span className="placeholder-tag">{PROFILE_IDENTITY.contacts.linkedin}</span>
                </div>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                Profil LinkedIn vérifié à renseigner par Loïc AKANDA.
              </span>
            </div>

            <div className="contact-channel-card">
              <div>
                <div className="contact-channel-card__label">03 · Dépôts &amp; Code (Vérifié)</div>
                <div className="contact-channel-card__value" style={{ marginTop: '0.45rem' }}>
                  {PROFILE_IDENTITY.contacts.githubHandle}
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <a
                  href={PROFILE_IDENTITY.contacts.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ minHeight: '2.35rem', padding: '0.4rem 0.85rem', fontSize: '0.84rem' }}
                >
                  Ouvrir GitHub ↗
                </a>
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ minHeight: '2.35rem', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                  onClick={handleCopyGithub}
                >
                  {copiedGithub ? 'Lien copié' : 'Copier l’URL'}
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 'var(--space-4)',
            }}
          >
            <a href="#hero" className="btn-secondary">
              ↑ Remonter au Péristyle (Scène 01)
            </a>
          </div>
        </div>
      </div>

      <footer className="arch-colophon" role="contentinfo">
        <div>
          <strong>Loïc AKANDA</strong> · Élève-ingénieur en Finance — INP-HB, Côte d’Ivoire
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
          <span>Direction artistique : L’Atrium de Haute Précision</span>
          <button
            type="button"
            className="btn-ghost"
            style={{ minHeight: '2rem', padding: '0.25rem 0.65rem', fontSize: '0.74rem' }}
            onClick={onOpenMockups}
          >
            Consulter les planches maquettes (Phase 4)
          </button>
        </div>
      </footer>
    </section>
  );
}
