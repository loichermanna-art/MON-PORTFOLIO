interface DesignMockupsGalleryProps {
  onBackToExperience: () => void;
}

const MOCKUP_PLATES = [
  {
    num: '01',
    title: 'Accueil Spatial — Arche Parabolique & Sphère Chrome',
    viewport: '1440 × 900 · HUD Rail Gauche',
    architecture: 'Arche courbe blanche en porte-à-faux, terrasse miroir ardoise et sphère chrome en lévitation.',
    typography: 'Plus Jakarta Sans Light (« Loïc ») + Bold Uppercase (« AKANDA ») sans aucune boîte, orbe « Scroll ↓ ».',
  },
  {
    num: '02',
    title: 'À propos — Canyon Cantilever & Monolithe Chrome',
    viewport: '1440 × 900 · Asymétrie 5 / 4 / 3',
    architecture: 'Blocs blancs imbriqués en surplomb (réf. TRES BON.jfif) et cadre vertical en acier brossé.',
    typography: 'Narration INP-HB 3e année à gauche, pilule « Explorer mes compétences → » et index + Finance / + Audit à droite.',
  },
  {
    num: '03',
    title: 'Expertise — Matrice Cubique Cristal, Marbre & Obsidienne',
    viewport: '1440 × 900 · 4 Pôles sans %',
    architecture: 'Cluster suspendu de 14 cubes (verre cristallin, marbre pur, obsidienne) en rotation lente.',
    typography: 'Liste interactive épurée à droite avec pastilles circulaires numérotées (01 à 04).',
  },
  {
    num: '04',
    title: 'Projets — 3 Écrans Flottants en Perspective',
    viewport: '1440 × 900 · Tiroir Étude de Cas',
    architecture: 'Trois pilastres chrome verticaux encadrant 3 dalles UI inclinées dans l’espace.',
    typography: 'LAURA HOUSE (Obsidienne), SassySkin (Rose poudré) et EtuCo (Glace) ouvrant le tiroir modal accessible.',
  },
  {
    num: '05',
    title: 'Ma démarche — Anneau Orbital Cristallin (6 Étapes)',
    viewport: '1440 × 900 · Capsules Flottantes',
    architecture: 'Anneau en cristal et joints chrome en orbite autour d’une sphère centrale réfléchissante.',
    typography: '6 capsules blanches flottantes (« 1. Comprendre » → « 6. Tester & améliorer ») reliées au panneau descriptif.',
  },
  {
    num: '06',
    title: 'Restons connectés — Escalier d’Horizon & Soleil Doré',
    viewport: '1440 × 900 · Transition Crépusculaire',
    architecture: '7 marches monumentales sombres s’élevant entre deux monolithes vers la sphère miroir et le halo doré.',
    typography: 'Typographie blanche #F8FAFC sur brume ardoise #1B222E (AAA 15.26:1), pilule « Me contacter → ».',
  },
] as const;

/**
 * Planches d'architecture mises à jour pour la nouvelle base « Horizon Monolithique ».
 */
export function DesignMockupsGallery({ onBackToExperience }: DesignMockupsGalleryProps) {
  return (
    <section
      aria-labelledby="mockups-gallery-heading"
      style={{ paddingBlock: '6rem 5rem', background: 'var(--bg)' }}
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
            <span className="spatial-overline" style={{ display: 'block' }}>
              Planches de Référence · Base « Horizon Monolithique »
            </span>
            <h1 id="mockups-gallery-heading" className="spatial-heading" style={{ marginBottom: '0.5rem' }}>
              Les 6 Scènes Architecturales &amp; Spatiales
            </h1>
            <p className="spatial-lead" style={{ marginBottom: 0 }}>
               Synthèse des 12 visuels de référence : marbre blanc lumineux, métal spéculaire, verre
              cristallin, interface HUD sans boîtes et horizon crépusculaire doré.
            </p>
          </div>

          <button type="button" className="btn-primary" onClick={onBackToExperience}>
            Retour à l’expérience 3D →
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 24rem), 1fr))',
            gap: '1.5rem',
          }}
        >
          {MOCKUP_PLATES.map((plate, index) => {
            const isDusk = index === 5;
            return (
              <article
                key={plate.num}
                id={`mockup-${plate.num}`}
                style={{
                  background: isDusk ? 'var(--dusk-bg)' : 'var(--surface)',
                  color: isDusk ? 'var(--dusk-ink)' : 'var(--ink)',
                  border: '1px solid var(--line-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div>
                  <div
                    className="tabular"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      opacity: 0.72,
                      marginBottom: '0.85rem',
                    }}
                  >
                    <span>PLANCHE {plate.num} / 06</span>
                    <span>{plate.viewport}</span>
                  </div>

                  <h2 style={{ fontSize: '1.22rem', marginBottom: '0.75rem' }}>{plate.title}</h2>
                  <p style={{ fontSize: '0.88rem', opacity: 0.82, marginBottom: '0.65rem' }}>
                    <strong>Volume 3D :</strong> {plate.architecture}
                  </p>
                  <p style={{ fontSize: '0.88rem', opacity: 0.82 }}>
                    <strong>Composition UI :</strong> {plate.typography}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
