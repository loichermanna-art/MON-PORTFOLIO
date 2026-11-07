import { MaskReveal } from '../components/typography/MaskReveal';
import { PROFILE_IDENTITY } from '../data/portfolioData';

const ABOUT_PILLARS = [
  'Finance & Comptabilité',
  'Audit & Analyse',
  'Développement Web',
  'Produits Numériques',
] as const;

/**
 * Scène 02 — À propos
 * Fidèle au Panneau 02 : titre épuré à gauche, bouton pilule « Explorer mes compétences → »,
 * canyon cantilever blanc au centre et liste « + Finance / + Audit... » à droite.
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
              <span className="spatial-overline">À propos</span>
            </MaskReveal>

            <MaskReveal delayMs={70}>
              <h2 id="about-heading" className="spatial-heading">
                Une vision à la croisée de la finance et du digital.
              </h2>
            </MaskReveal>

            <MaskReveal delayMs={140}>
              <p className="spatial-lead">{PROFILE_IDENTITY.aboutIntro}</p>
            </MaskReveal>

            <MaskReveal delayMs={180}>
              <p className="spatial-lead" style={{ marginTop: '-0.85rem' }}>
                {PROFILE_IDENTITY.aboutBridge}
              </p>
            </MaskReveal>

            <MaskReveal delayMs={220}>
              <a href="#expertise" className="pill-cta">
                <span>Explorer mes compétences</span>
                <span aria-hidden="true">→</span>
              </a>
            </MaskReveal>
          </div>

          <aside className="about-pillars-right" aria-label="Axes de double compétence">
            {ABOUT_PILLARS.map((pillar) => (
              <div key={pillar} className="about-pillar-row">
                <span
                  aria-hidden="true"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}
                >
                  +
                </span>
                <span>{pillar}</span>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
