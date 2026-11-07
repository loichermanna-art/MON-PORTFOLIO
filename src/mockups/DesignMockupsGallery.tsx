import type { DesignMockupsGalleryProps } from './types';

const MOCKUP_PLATES = [
  {
    num: '01',
    title: 'HERO — Oculus Monumental & Stèle Diégétique (Validé Phase 3)',
    viewport: 'Midnight Blue #071426 · Sol Miroir Temps Réel',
    architecture:
      'Portique béton en porte-à-faux, oculus circulaire lumineux (#76A9E8/#FFFFFF), silhouette d’échelle et stèle de verre interactive 3D.',
    typography:
      '« PORTFOLIO 2026 », « Loïc AKANDA », « Finance. Innovation. Impact. », couplés spatialement à l’avancée caméra.',
  },
  {
    num: '02',
    title: 'À PROPOS — Cadres Géométriques & Parcours INP-HB',
    viewport: 'Béton Coffré & Lumière Rasante',
    architecture: 'Succession de cadres architecturaux en béton sombre et lames de verre structurel.',
    typography: 'Formation 3e année cycle ingénieur en finance à l’INP-HB et 3 principes de travail.',
  },
  {
    num: '03',
    title: 'EXPERTISE — Quatre Stèles Monolithiques Sélectionnables',
    viewport: '4 Domaines · 0 % Jauge Factice',
    architecture: 'Quatre colonnes en béton et verre s’élevant dynamiquement selon le domaine actif.',
    typography: 'Finance et comptabilité · Audit et analyse · Développement numérique · Gestion de projets.',
  },
  {
    num: '04',
    title: 'PROJETS — Galerie Architecturale Immersive',
    viewport: 'LAURA HOUSE · SassySkin · EtuCo',
    architecture: 'Trois stèles muséales intégrées dans l’espace vers lesquelles la caméra oriente le regard.',
    typography: 'Schémas d’architecture réels, rôles vérifiés et ouverture détaillée fluide.',
  },
  {
    num: '05',
    title: 'MA DÉMARCHE — Anneau Séquentiel à 6 Étapes',
    viewport: '1. Comprendre -> 6. Améliorer',
    architecture: 'Anneau segmenté en verre et acier articulé autour d’un noyau spéculaire.',
    typography: 'Sélection interactive : Comprendre · Analyser · Concevoir · Développer · Tester · Améliorer.',
  },
  {
    num: '06',
    title: 'CONTACT — Belvédère Ouvert sur l’Horizon Lumineux',
    viewport: 'Ouverture Finale Azur & Blanc',
    architecture: 'Emmarchements monumentaux ouvrant sur une clarté atmosphérique apaisée.',
    typography: '« Ensemble, créons les solutions de demain. » — GitHub, LinkedIn et E-mail.',
  },
] as const;

export function DesignMockupsGallery({ onBackToExperience }: DesignMockupsGalleryProps) {
  return (
    <section
      aria-labelledby="mockups-gallery-heading"
      style={{ paddingBlock: '6rem 5rem', minHeight: '100vh' }}
    >
      <div className="arch-container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '1.5rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid var(--line-subtle)',
            marginBottom: '2.5rem',
          }}
        >
          <div>
            <span className="spatial-overline">Direction Artistique · Midnight Blue</span>
            <h1 id="mockups-gallery-heading" className="spatial-heading" style={{ marginBottom: '0.5rem' }}>
              Architecture Spatiale des 6 Scènes
            </h1>
            <p className="spatial-lead" style={{ marginBottom: 0 }}>
              Synthèse de l’intégration entre le premier plan éditorial et l’environnement
              tridimensionnel issue de <code>REFERENCE_HERO_PORTFOLIO.png</code>.
            </p>
          </div>

          <button type="button" className="pill-cta" onClick={onBackToExperience}>
            <span>Retour à l’expérience 3D</span>
            <span className="pill-cta__arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 24rem), 1fr))',
            gap: '1.35rem',
          }}
        >
          {MOCKUP_PLATES.map((plate) => (
            <article
              key={plate.num}
              id={`mockup-${plate.num}`}
              style={{
                background: 'rgba(16, 39, 71, 0.68)',
                border: '1px solid var(--line-medium)',
                padding: '1.55rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              <div
                className="tabular"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--azure-400)',
                }}
              >
                <span>SECTION {plate.num} / 06</span>
                <span>{plate.viewport}</span>
              </div>

              <h2 style={{ fontSize: '1.15rem', color: 'var(--white)' }}>{plate.title}</h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--ice-300)' }}>
                <strong style={{ color: 'var(--ice-100)' }}>Espace 3D :</strong> {plate.architecture}
              </p>
              <p style={{ fontSize: '0.86rem', color: 'var(--ice-300)' }}>
                <strong style={{ color: 'var(--ice-100)' }}>Premier plan :</strong> {plate.typography}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
