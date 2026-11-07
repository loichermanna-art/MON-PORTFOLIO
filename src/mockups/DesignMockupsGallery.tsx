import type { DesignMockupsGalleryProps } from './types';

const MOCKUP_PLATES = [
  {
    num: '01',
    image: '/scenes/sky-01-hero.jpg',
    title: 'HERO — Zénith Stratosphérique & Skyline Financière',
    viewport: 'Sky Zenith · Nuages Vivants WebGL',
    architecture:
      'Vue aérienne haute altitude au-dessus d’une mer de cumulus ensoleillés et de tours de verre ardoise captant un reflet solaire ambre.',
    typography:
      'Typographie bicolore « Loïc AKANDA » (#525E6E + #202A36), « Finance. Innovation. Impact. » et duo de pilules exécutives.',
  },
  {
    num: '02',
    image: '/scenes/sky-02-about.jpg',
    title: 'À PROPOS — Terrasse Panoramique au Sommet',
    viewport: 'INP-HB · Double Compétence',
    architecture:
      'Belvédère vitré à meneaux d’acier brossé surplombant l’océan de nuages blancs sous un ciel clair.',
    typography:
      'Formation en 3e année du cycle ingénieur en finance à l’INP-HB et trois principes directeurs.',
  },
  {
    num: '03',
    image: '/scenes/sky-03-expertise.jpg',
    title: 'EXPERTISE — Façade de Verre & Précision Structurelle',
    viewport: '4 Domaines · 0 % Jauge Factice',
    architecture:
      'Mur-rideau de verre anthracite et d’acier reflétant les nuages et un rayon doré en haute altitude.',
    typography:
      'Finance et comptabilité · Audit et analyse · Développement numérique · Gestion de projets.',
  },
  {
    num: '04',
    image: '/scenes/sky-04-projects.jpg',
    title: 'PROJETS — Miroir d’Eau Infini en Altitude',
    viewport: 'LAURA HOUSE · SassySkin · EtuCo',
    architecture:
      'Bassin miroir minimaliste en porte-à-faux au-dessus des nuages reflétant le ciel pur.',
    typography:
      'Trois vitrines projets en verre dépoli plein jour, schémas fonctionnels et fiches détaillées.',
  },
  {
    num: '05',
    image: '/scenes/sky-05-process.jpg',
    title: 'MA DÉMARCHE — Horizon Stratosphérique & Orbite',
    viewport: '1. Comprendre → 6. Améliorer',
    architecture:
      'Horizon aérien rectilinéaire calme au-dessus des cumulus blancs couplé au compas orbital 3D.',
    typography:
      'Six pilules orbitales interactives : Comprendre · Analyser · Concevoir · Développer · Tester · Améliorer.',
  },
  {
    num: '06',
    image: '/scenes/sky-06-contact.jpg',
    title: 'CONTACT — Lumière Dorée sur la Mer de Nuages',
    viewport: 'Ouverture Finale · Contact Direct',
    architecture:
      'Fin de journée dorée au-dessus des nuages nacrés avec tours élancées à l’horizon.',
    typography:
      '« Ensemble, créons les solutions de demain. » — GitHub vérifié, LinkedIn et coordonnées directes.',
  },
] as const;

export function DesignMockupsGallery({ onBackToExperience }: DesignMockupsGalleryProps) {
  return (
    <section
      aria-labelledby="mockups-gallery-heading"
      className="editorial-interactive"
      style={{
        padding: '6.5rem var(--gutter) 5rem calc(var(--rail-width) + var(--gutter))',
        minHeight: '100vh',
        background: 'var(--sky-50)',
      }}
    >
      <div className="scene-inner">
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
            <span className="eyebrow-architectural">Direction Artistique · Sky Zenith</span>
            <h1 id="mockups-gallery-heading" className="section-heading" style={{ marginBottom: '0.5rem' }}>
              Planches Aériennes des 6 Séquences
            </h1>
            <p className="section-lead" style={{ maxWidth: '44rem' }}>
              Vue d’ensemble des six horizons photographiques haute altitude animés en WebGL temps réel,
              alliant ciel stratosphérique clair, ardoise exécutive #202A36 et reflets solaires ambrés.
            </p>
          </div>

          <button type="button" className="pill-cta" onClick={onBackToExperience}>
            <span>Retour à l’expérience immersive</span>
            <span className="pill-cta__arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 24rem), 1fr))',
            gap: '1.5rem',
          }}
        >
          {MOCKUP_PLATES.map((plate) => (
            <article
              key={plate.num}
              id={`mockup-${plate.num}`}
              className="glass-card-subtle"
              style={{
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem',
              }}
            >
              <img
                src={plate.image}
                alt={plate.title}
                loading="lazy"
                style={{
                  width: '100%',
                  aspectRatio: '16 / 9',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  border: '1px solid var(--line-hairline)',
                }}
              />

              <div
                className="tabular"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'var(--slate-600)',
                }}
              >
                <span>ALTITUDE {plate.num} / 06</span>
                <span>{plate.viewport}</span>
              </div>

              <h2 style={{ fontSize: '1.12rem', color: 'var(--slate-900)' }}>{plate.title}</h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--slate-700)' }}>
                <strong style={{ color: 'var(--slate-900)' }}>Horizon :</strong> {plate.architecture}
              </p>
              <p style={{ fontSize: '0.86rem', color: 'var(--slate-700)' }}>
                <strong style={{ color: 'var(--slate-900)' }}>Édition :</strong> {plate.typography}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
