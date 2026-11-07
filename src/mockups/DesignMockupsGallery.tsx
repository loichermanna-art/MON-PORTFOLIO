import type { DesignMockupsGalleryProps } from './types';

const MOCKUP_PLATES = [
  {
    num: '01',
    image: '/scenes/scene-01-hero.jpg',
    title: 'HERO — L’Oculus Monumental à Contre-Jour',
    viewport: 'Clair-Obscur · Parallaxe WebGL',
    architecture:
      'Paroi monolithique d’obsidienne à gauche, grand oculus de béton clair baigné de lumière blanche et reflets sur pierre humide.',
    typography:
      '« PORTFOLIO 2026 », « Loïc AKANDA », « Finance. Innovation. Impact. » et index minimaliste des 4 axes.',
  },
  {
    num: '02',
    image: '/scenes/scene-02-about.jpg',
    title: 'À PROPOS — Portiques de Béton Blanc & Stèle de Verre',
    viewport: 'INP-HB · Double Compétence',
    architecture:
      'Nef calme à contre-jour scandée de cadres en porte-à-faux, miroir d’eau calme et stèle de verre fumé.',
    typography:
      'Formation en 3e année du cycle ingénieur en finance à l’INP-HB et trois principes directeurs.',
  },
  {
    num: '03',
    image: '/scenes/scene-03-expertise.jpg',
    title: 'EXPERTISE — Constellation Suspendue sous Verrière',
    viewport: '4 Domaines · 0 % Jauge Factice',
    architecture:
      'Cubes de cristal dépoli et de pierre suspendus sous une verrière zénithale projetant ses caustiques au sol.',
    typography:
      'Finance et comptabilité · Audit et analyse · Développement numérique · Gestion de projets.',
  },
  {
    num: '04',
    image: '/scenes/scene-04-projects.jpg',
    title: 'PROJETS — Les Arches Paraboliques sur Miroir d’Eau',
    viewport: 'LAURA HOUSE · SassySkin · EtuCo',
    architecture:
      'Succession monumentale d’arches blanches se reflétant dans une nappe d’eau noire immobile.',
    typography:
      'Trois vitrines en perspective 3D, schémas fonctionnels authentiques et fiches détaillées.',
  },
  {
    num: '05',
    image: '/scenes/scene-05-process.jpg',
    title: 'MA DÉMARCHE — L’Anneau de Cristal & Titane',
    viewport: '1. Comprendre → 6. Améliorer',
    architecture:
      'Anneau sculptural incliné en lévitation au-dessus d’un emmarchement rétroéclairé.',
    typography:
      'Six pilules orbitales interactives : Comprendre · Analyser · Concevoir · Développer · Tester · Améliorer.',
  },
  {
    num: '06',
    image: '/scenes/scene-06-contact.jpg',
    title: 'CONTACT — Le Portail sur l’Horizon & Sphère Miroir',
    viewport: 'Ouverture Finale · Contact Direct',
    architecture:
      'Degrés de basalte s’élevant vers un grand cadre blanc ouvert sur l’eau calme et l’horizon.',
    typography:
      '« Ensemble, créons les solutions de demain. » — GitHub, LinkedIn et coordonnées directes.',
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
        background: 'var(--obsidian-950)',
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
            <span className="eyebrow-architectural">Direction Artistique · Monumental Chiaroscuro</span>
            <h1 id="mockups-gallery-heading" className="section-heading" style={{ marginBottom: '0.5rem' }}>
              Planches Architecturales des 6 Chambres
            </h1>
            <p className="section-lead" style={{ maxWidth: '44rem' }}>
              Vue d’ensemble des six espaces photoréalistes animés en profondeur WebGL temps réel,
              associant paroi d’ombre éditoriale et architecture monumentale à contre-jour.
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
                  color: 'var(--silver-400)',
                }}
              >
                <span>CHAMBRE {plate.num} / 06</span>
                <span>{plate.viewport}</span>
              </div>

              <h2 style={{ fontSize: '1.12rem', color: 'var(--white)' }}>{plate.title}</h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--silver-300)' }}>
                <strong style={{ color: 'var(--white)' }}>Architecture :</strong> {plate.architecture}
              </p>
              <p style={{ fontSize: '0.86rem', color: 'var(--silver-300)' }}>
                <strong style={{ color: 'var(--white)' }}>Édition :</strong> {plate.typography}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
