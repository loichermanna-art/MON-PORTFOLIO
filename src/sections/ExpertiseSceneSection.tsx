import { EXPERTISE_POLES } from '../data/portfolioData';
import { setFocusedExpertisePole } from '../motion/motionStore';
import { MaskReveal } from '../components/typography/MaskReveal';

/**
 * SCÈNE 03 — EXPERTISE (« La Cour des Deux Piliers »)
 * Mise en scène éditoriale en diptyque symétrique (cols 1–5 et cols 8–12), laissant l'axe
 * central (cols 6–7) ouvert sur la perspective 3D de la Cour.
 * RÈGLE STRICTE : aucun niveau en pourcentage artificiel.
 */
export function ExpertiseSceneSection() {
  const [poleFinance, poleDigital] = EXPERTISE_POLES;

  return (
    <section id="expertise" className="scene-section" aria-labelledby="expertise-heading">
      <div className="arch-container arch-grid">
        <div className="expertise-header">
          <MaskReveal>
            <div
              className="scene-index-line tabular"
              style={{ justifyContent: 'center', marginBottom: '0.6rem' }}
            >
              <span>SCÈNE 03 — LA COUR DES DEUX PILIERS · DOMAINES DE COMPÉTENCE</span>
            </div>
          </MaskReveal>
          <MaskReveal delayMs={70}>
            <h2
              id="expertise-heading"
              className="section-display-title"
              style={{ marginBottom: '0.65rem' }}
            >
              Deux champs de compétence complémentaires, une même discipline de rigueur.
            </h2>
          </MaskReveal>
          <p style={{ marginInline: 'auto', fontSize: '0.96rem', color: 'var(--ink-muted)' }}>
            L’analyse financière structure la compréhension des flux et des risques ; l’ingénierie
            produit transforme cette compréhension en outils concrets.
          </p>
        </div>

        {/* Aile Gauche — Pôle I : Finance, Comptabilité, Audit & Analyse */}
        <article
          className="scene-panel expertise-wing--left"
          onMouseEnter={() => setFocusedExpertisePole(0)}
          onMouseLeave={() => setFocusedExpertisePole(-1)}
          onFocus={() => setFocusedExpertisePole(0)}
          onBlur={() => setFocusedExpertisePole(-1)}
        >
          <div className="scene-index-line tabular" style={{ marginBottom: '0.5rem' }}>
            <span className="scene-index-line__rule" aria-hidden="true" />
            <span>{poleFinance.poleIndex} · PIERRE D’ALBÂTRE</span>
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--step-2)',
              lineHeight: 1.1,
              marginBottom: '0.5rem',
            }}
          >
            {poleFinance.poleTitle}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>
            {poleFinance.poleSubtitle}
          </p>

          <div className="expertise-domain-list">
            {poleFinance.domains.map((domain) => (
              <div key={domain.code} className="expertise-domain">
                <div className="expertise-domain__head">
                  <h4 className="expertise-domain__title">{domain.name}</h4>
                  <span className="expertise-domain__code tabular">{domain.code}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>
                  {domain.description}
                </p>
              </div>
            ))}
          </div>
        </article>

        {/* Aile Droite — Pôle II : Conception Numérique, Développement & Projets */}
        <article
          className="scene-panel expertise-wing--right"
          onMouseEnter={() => setFocusedExpertisePole(1)}
          onMouseLeave={() => setFocusedExpertisePole(-1)}
          onFocus={() => setFocusedExpertisePole(1)}
          onBlur={() => setFocusedExpertisePole(-1)}
        >
          <div className="scene-index-line tabular" style={{ marginBottom: '0.5rem' }}>
            <span className="scene-index-line__rule" aria-hidden="true" />
            <span>{poleDigital.poleIndex} · BRONZE PATINÉ</span>
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--step-2)',
              lineHeight: 1.1,
              marginBottom: '0.5rem',
            }}
          >
            {poleDigital.poleTitle}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>
            {poleDigital.poleSubtitle}
          </p>

          <div className="expertise-domain-list">
            {poleDigital.domains.map((domain) => (
              <div key={domain.code} className="expertise-domain">
                <div className="expertise-domain__head">
                  <h4 className="expertise-domain__title">{domain.name}</h4>
                  <span className="expertise-domain__code tabular">{domain.code}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>
                  {domain.description}
                </p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
