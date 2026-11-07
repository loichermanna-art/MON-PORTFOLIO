import { PROFILE_IDENTITY } from '../data/portfolioData';

const MOCKUP_FRAMES = [
  {
    code: '01 / IDENTITÉ — OCULUS ARCHITECTURAL',
    image: '/scenes/dusk-01-zenith.jpg',
    altitude: 'Midnight Blue #071426',
    title: 'Introduction : Loïc AKANDA — Finance, Audit & Solutions numériques',
    caption:
      'Révélation par lignes masquées, positionnement en 3e année du cycle ingénieur en Finance à l’INP-HB, accès direct aux 4 réalisations et au CV PDF officiel.',
  },
  {
    code: '02 / PARCOURS — AXE TEMPOREL SPATIAL',
    image: '/scenes/dusk-02-stratus.jpg',
    altitude: '6 Stèles Chronologiques',
    title: 'Parcours académique INP-HB & stages vérifiés (Drone Groupe CI, IACG)',
    caption:
      'Progression spatiale du Bac G2 jusqu’à la 3e année ECS et la présidence du Club Études-Conseils, accompagnée des deux dossiers de stage complets.',
  },
  {
    code: '03 / COMPÉTENCES — LES 5 MONOLITHES',
    image: '/scenes/dusk-04-cobalt.jpg',
    altitude: '4 Registres sans %',
    title: 'Finance, Audit, Logiciels, Développement & Conduite de projets',
    caption:
      'Cinq structures architecturales distinguant connaissances académiques, pratique réelle, outils utilisés (Excel, Sage 100, React, TypeScript) et domaines d’intérêt.',
  },
  {
    code: '04 / RÉALISATIONS — 4 PAVILLONS PROJETS',
    image: '/scenes/dusk-05-orbit.jpg',
    altitude: 'Études de cas en 12 points',
    title: 'SassySkin, AE-ECS, LAURA HOUSE & GYM OS SPORT',
    caption:
      'Quatre pavillons monumentaux intégrant les visuels réels des applications déployées et une étude de cas complète en 12 rubriques vérifiées.',
  },
  {
    code: '05 / MÉTHODE — LES 6 PORTIQUES',
    image: '/scenes/dusk-03-horizon.jpg',
    altitude: 'Progression Séquentielle',
    title: 'Comprendre, Analyser, Concevoir, Réaliser, Tester, Améliorer',
    caption:
      'Six portiques architecturaux détaillant objectifs, actions, décisions, livrables et exemples concrets issus des stages et projets réels.',
  },
  {
    code: '06 / CONTACT — LE BELVÉDÈRE OUVERT',
    image: '/scenes/dusk-06-afterglow.jpg',
    altitude: 'Horizon Lumineux #76A9E8',
    title: 'Coordonnées directes vérifiées & téléchargement du CV',
    caption:
      'Accès immédiat au courriel professionnel (loichermanna@gmail.com), à LinkedIn, à GitHub et au CV PDF officiel.',
  },
] as const;

interface DesignMockupsGalleryProps {
  onBackToExperience?: () => void;
}

export function DesignMockupsGallery({ onBackToExperience }: DesignMockupsGalleryProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--midnight-950)',
        color: 'var(--ice-100)',
        padding: '6.5rem clamp(1.25rem, 4vw, 4rem) 5rem',
      }}
    >
      <header
        style={{
          maxWidth: '82rem',
          margin: '0 auto 3rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '1.5rem',
          paddingBottom: '1.75rem',
          borderBottom: '1px solid var(--line-hairline)',
        }}
      >
        <div>
          <span className="section-kicker">Architecture Narrative &amp; Spatiale · Midnight Blue</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3.1rem)',
              fontWeight: 600,
              marginBottom: '0.55rem',
            }}
          >
            {PROFILE_IDENTITY.fullName} — Les 6 Séquences Architecturales
          </h1>
          <p className="section-lead" style={{ maxWidth: '52rem' }}>
            Vue synthétique de la progression narrative reliant identité, parcours à l’INP-HB,
            stages vérifiés, compétences structurées, études de cas réelles et prise de contact.
          </p>
        </div>

        {onBackToExperience ? (
          <button type="button" className="pill-cta" onClick={onBackToExperience}>
            <span>Retour à l’expérience immersive</span>
            <span aria-hidden="true">→</span>
          </button>
        ) : (
          <a href="/" className="pill-cta">
            <span>Retour à l’expérience immersive</span>
            <span aria-hidden="true">→</span>
          </a>
        )}
      </header>

      <div
        style={{
          maxWidth: '82rem',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(22rem, 1fr))',
          gap: '1.35rem',
        }}
      >
        {MOCKUP_FRAMES.map((frame) => (
          <article
            key={frame.code}
            className="arch-stele"
            style={{
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div
              style={{
                position: 'relative',
                borderRadius: '0.4rem',
                overflow: 'hidden',
                aspectRatio: '16 / 10',
                background: 'var(--midnight-900)',
                border: '1px solid rgba(118, 169, 232, 0.25)',
              }}
            >
              <img
                src={frame.image}
                alt={frame.title}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '0.65rem',
                  left: '0.65rem',
                  padding: '0.26rem 0.65rem',
                  borderRadius: '0.3rem',
                  background: 'rgba(7, 20, 38, 0.86)',
                  border: '1px solid rgba(118, 169, 232, 0.35)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.66rem',
                  fontWeight: 600,
                  color: 'var(--ice-100)',
                }}
              >
                {frame.altitude}
              </span>
            </div>

            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: 'var(--azure-400)',
                  marginBottom: '0.35rem',
                }}
              >
                {frame.code}
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  marginBottom: '0.45rem',
                }}
              >
                {frame.title}
              </h2>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.58, color: 'var(--slate-700)' }}>
                {frame.caption}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
