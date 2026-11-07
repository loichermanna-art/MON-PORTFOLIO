import { MaskReveal } from '../components/typography/MaskReveal';
import { PROFILE_IDENTITY } from '../data/portfolioData';

/**
 * Scène 01 — Accueil Spatial « Loïc / AKANDA »
 * Fidèle au Panneau 01 : typographie sans cadre flottant sur le vide lumineux gauche,
 * orbe circulaire « Scroll ↓ », et arche monumentale + sphère chrome sur le tiers droit.
 */
export function HeroSceneSection() {
  return (
    <section
      id="hero"
      className="scene-section"
      data-scene-index="0"
      aria-labelledby="hero-heading"
    >
      <div className="arch-container">
        <div className="arch-grid">
          <div className="spatial-left">
            <MaskReveal delayMs={40} immediatelyVisible>
              <h1 id="hero-heading" className="hero-name">
                <span className="hero-name__first">Loïc </span>
                <span className="hero-name__last">AKANDA</span>
              </h1>
            </MaskReveal>

            <MaskReveal delayMs={120} immediatelyVisible>
              <p className="hero-tagline">Finance. Analyse. Produits numériques.</p>
            </MaskReveal>

            <MaskReveal delayMs={190} immediatelyVisible>
              <p className="spatial-lead">
                <strong>{PROFILE_IDENTITY.academicTitle}</strong> —{' '}
                <strong>{PROFILE_IDENTITY.institution}</strong>. Allier la rigueur de l’audit et de
                la comptabilité à la conception d’applications web utiles.
              </p>
            </MaskReveal>

            <MaskReveal delayMs={250} immediatelyVisible>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <a
                  href="#about"
                  className="scroll-orb"
                  aria-label="Faire défiler vers la section À propos"
                >
                  <span>Scroll</span>
                  <span aria-hidden="true">↓</span>
                </a>

                <a href="#projects" className="pill-cta">
                  <span>Voir les réalisations</span>
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </MaskReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
