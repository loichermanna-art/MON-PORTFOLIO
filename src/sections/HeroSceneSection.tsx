import { PROFILE_IDENTITY } from '../data/portfolioData';
import { MaskReveal } from '../components/typography/MaskReveal';

/**
 * SCÈNE 01 — INTRODUCTION / HERO (« Le Péristyle de Lumière »)
 * Composition asymétrique franche à gauche (colonnes 1 à 7) laissant respirer à droite
 * la perspective 3D du Péristyle et du Portique d'Équilibre.
 */
export function HeroSceneSection() {
  return (
    <section
      id="hero"
      className="scene-section scene-section--hero"
      aria-labelledby="hero-heading"
    >
      <div className="arch-container arch-grid">
        <div className="scene-panel--hero">
          <MaskReveal immediatelyVisible>
            <div className="scene-index-line tabular">
              <span className="scene-index-line__rule" aria-hidden="true" />
              <span>SCÈNE 01 — LE PÉRISTYLE · INP-HB, CÔTE D’IVOIRE</span>
            </div>
          </MaskReveal>

          <MaskReveal immediatelyVisible delayMs={70}>
            <h1 id="hero-heading" className="hero-title">
              {PROFILE_IDENTITY.fullName}
            </h1>
          </MaskReveal>

          <MaskReveal immediatelyVisible delayMs={140}>
            <p className="hero-subtitle">{PROFILE_IDENTITY.valueProposition}</p>
          </MaskReveal>

          <MaskReveal immediatelyVisible delayMs={210}>
            <p className="hero-lead">
              Élève-ingénieur en troisième année de <strong>finance à l’INP-HB</strong> (Côte
              d’Ivoire). J’articule une formation exigeante en{' '}
              <strong>finance, comptabilité, audit et analyse</strong> avec la{' '}
              <strong>conception et le développement de produits numériques</strong> pensés pour
              résoudre des besoins concrets.
            </p>
          </MaskReveal>

          <MaskReveal immediatelyVisible delayMs={280}>
            <div className="hero-actions">
              <a href="#projects" className="btn-primary">
                Découvrir les réalisations
              </a>
              <a href="#contact" className="btn-secondary">
                Prendre contact
              </a>
            </div>
          </MaskReveal>

          <MaskReveal immediatelyVisible delayMs={340}>
            <div className="hero-pillars" aria-label="Piliers du profil">
              <div>
                <div className="hero-pillar__label tabular">01 · CURSUS</div>
                <div className="hero-pillar__value">3e année Cycle Ingénieur Finance — INP-HB</div>
              </div>
              <div>
                <div className="hero-pillar__label tabular">02 · SOCLE ANALYTIQUE</div>
                <div className="hero-pillar__value">Finance, Comptabilité, Audit &amp; Analyse</div>
              </div>
              <div>
                <div className="hero-pillar__label tabular">03 · EXÉCUTION DIGITALE</div>
                <div className="hero-pillar__value">LAURA HOUSE · SassySkin · EtuCo</div>
              </div>
            </div>
          </MaskReveal>

          <div className="scroll-cue" aria-hidden="true">
            <span className="scroll-cue__track">
              <span className="scroll-cue__thumb" />
            </span>
            <span>Défiler pour traverser l’édifice</span>
          </div>
        </div>
      </div>
    </section>
  );
}
