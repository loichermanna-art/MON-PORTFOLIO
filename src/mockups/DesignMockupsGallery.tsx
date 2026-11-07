import { PROFILE_IDENTITY } from '../data/portfolioData';

const MOCKUP_FRAMES = [
  {
    code: '01 / HERO — TWILIGHT ZENITH',
    image: '/scenes/dusk-01-zenith.jpg',
    altitude: '11 000 m · Zénith Crépusculaire',
    title: 'Accueil immersif au-dessus des nuages crépusculaires',
    caption:
      'Typographie bicolore « Loïc AKANDA » (#7E93B0 + #F8FAFC), « Finance. Innovation. Impact. » et duo de pilules exécutives sur verre fumé.',
  },
  {
    code: '02 / À PROPOS — STRATUS VELOURS',
    image: '/scenes/dusk-02-stratus.jpg',
    altitude: 'Horizon Bleu Profond',
    title: 'Parcours INP-HB & principes directeurs',
    caption:
      'Illumination progressive mot-par-mot liée au scroll et stèle interactive des 3 principes en verre fumé translucide.',
  },
  {
    code: '03 / EXPERTISE — COURANTS COBALT',
    image: '/scenes/dusk-04-cobalt.jpg',
    altitude: 'Couches Stratosphériques',
    title: 'Les 4 pôles de compétences structurés',
    caption:
      'Rangées pilules interactives dépliables sans aucun pourcentage fictif de maîtrise, traversées de nuages volumétriques 3D.',
  },
  {
    code: '04 / PROJETS — PERSPECTIVE 3D',
    image: '/scenes/dusk-05-orbit.jpg',
    altitude: 'Corridor Orbital',
    title: 'Laura Bio Event, Sassy Cosmetics & ETUCO',
    caption:
      'Triptyque de vitrines HD en perspective avec curseur magnétique et tiroir de fiche technique détaillée.',
  },
  {
    code: '05 / MÉTHODE — ORBITE FONDUE',
    image: '/scenes/dusk-03-horizon.jpg',
    altitude: 'Lueur d’Horizon Ambrée',
    title: 'Cycle méthodologique en 5 étapes',
    caption:
      'Halo orbital ton-sur-ton fondu dans la brume crépusculaire reliant Comprendre, Structurer, Concevoir, Déployer et Mesurer.',
  },
  {
    code: '06 / CONTACT — CRÉPUSCULE FINAL',
    image: '/scenes/dusk-06-afterglow.jpg',
    altitude: 'Horizon Calme',
    title: 'Clôture exécutive & canaux vérifiés',
    caption:
      'Invitation directe vers GitHub (@loichermanna-art) et placeholders explicites honnêtes sans aucun éblouissement.',
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
        background: 'var(--sky-50)',
        color: 'var(--slate-900)',
        padding: '3rem clamp(1.25rem, 4vw, 4rem) 5rem',
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
          <span className="section-kicker">Planche de Direction Artistique · Twilight Zenith 3D</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 500,
              marginBottom: '0.55rem',
            }}
          >
            {PROFILE_IDENTITY.fullName} — Les 6 Séquences Crépusculaires
          </h1>
          <p className="section-lead" style={{ maxWidth: '48rem' }}>
            Vue d’ensemble des 6 stations 3D du portfolio exécutif de Loïc AKANDA,
            alliant mer de nuages stratosphérique basse luminance, verre fumé #080F1C et anneaux orbitaux fondus dans la brume.
          </p>
        </div>

        {onBackToExperience ? (
          <button type="button" className="pill-cta" onClick={onBackToExperience}>
            <span>Retour au portfolio interactif</span>
            <span aria-hidden="true">→</span>
          </button>
        ) : (
          <a href="/" className="pill-cta">
            <span>Retour au portfolio interactif</span>
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
          gap: '1.5rem',
        }}
      >
        {MOCKUP_FRAMES.map((frame) => (
          <article
            key={frame.code}
            className="glass-card-subtle"
            style={{
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div
              style={{
                position: 'relative',
                borderRadius: '0.95rem',
                overflow: 'hidden',
                aspectRatio: '16 / 10',
                background: 'var(--sky-200)',
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
                  top: '0.75rem',
                  left: '0.75rem',
                  padding: '0.28rem 0.7rem',
                  borderRadius: '999px',
                  background: 'rgba(8, 15, 28, 0.82)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(195, 207, 224, 0.18)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.66rem',
                  fontWeight: 600,
                  color: 'var(--slate-900)',
                }}
              >
                {frame.altitude}
              </span>
            </div>

            <div style={{ paddingInline: '0.35rem', paddingBottom: '0.35rem' }}>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: 'var(--amber-700)',
                  marginBottom: '0.35rem',
                }}
              >
                {frame.code}
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  marginBottom: '0.45rem',
                }}
              >
                {frame.title}
              </h2>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.58, color: 'var(--slate-700)' }}>
                {frame.caption}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
