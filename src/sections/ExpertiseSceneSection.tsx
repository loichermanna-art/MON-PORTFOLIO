import { useState } from 'react';
import { MaskReveal } from '../components/typography/MaskReveal';
import { EXPERTISE_POLES } from '../data/portfolioData';
import { setFocusedExpertisePole } from '../motion/motionStore';

interface CleanExpertiseCard {
  id: string;
  num: string;
  poleIndex: 0 | 1;
  title: string;
  summary: string;
  tags: string[];
}

const CLEAN_EXPERTISE_CARDS: CleanExpertiseCard[] = [
  {
    id: 'finance-compta',
    num: '01',
    poleIndex: 0,
    title: 'Finance & Comptabilité',
    summary: EXPERTISE_POLES[0].domains[0].description,
    tags: ['Équilibres financiers', 'États de synthèse', 'Cycle ingénieur INP-HB'],
  },
  {
    id: 'audit-analyse',
    num: '02',
    poleIndex: 0,
    title: 'Audit & Analyse financière',
    summary: EXPERTISE_POLES[0].domains[2].description,
    tags: ['Vérification méthodique', 'Diagnostic d’activité', 'Traçabilité'],
  },
  {
    id: 'conception-web',
    num: '03',
    poleIndex: 1,
    title: 'Conception & Développement Web',
    summary: EXPERTISE_POLES[1].domains[1].description,
    tags: ['React & TypeScript', 'Architecture produit', 'Responsive'],
  },
  {
    id: 'gestion-projets',
    num: '04',
    poleIndex: 1,
    title: 'Gestion & Réalisation de Projets',
    summary: EXPERTISE_POLES[1].domains[2].description,
    tags: ['Cadrage métier', 'Structuration par jalons', 'Livrables vérifiables'],
  },
];

/**
 * Scène 03 — Expertise & Compétences
 * Fidèle au Panneau 03 : narration épurée à gauche, matrice cubique cristal/obsidienne au centre,
 * et liste interactive de 4 pôles avec pastilles circulaires à droite (0 % jauge factice).
 */
export function ExpertiseSceneSection() {
  const [activeId, setActiveId] = useState<string>(CLEAN_EXPERTISE_CARDS[0].id);

  return (
    <section
      id="expertise"
      className="scene-section"
      data-scene-index="2"
      aria-labelledby="expertise-heading"
    >
      <div className="arch-container">
        <div className="arch-grid" style={{ alignItems: 'center' }}>
          <div className="spatial-left">
            <MaskReveal>
              <span className="spatial-overline">Expertise</span>
            </MaskReveal>

            <MaskReveal delayMs={70}>
              <h2 id="expertise-heading" className="spatial-heading">
                Des compétences complémentaires pour aller plus loin.
              </h2>
            </MaskReveal>

            <MaskReveal delayMs={140}>
              <p className="spatial-lead">
                Une articulation méthodique entre diagnostic financier, contrôle de cohérence et
                développement d’outils numériques fonctionnels — présentée avec justesse.
              </p>
            </MaskReveal>

            <MaskReveal delayMs={210}>
              <a href="#projects" className="pill-cta">
                <span>Voir tous les projets</span>
                <span aria-hidden="true">→</span>
              </a>
            </MaskReveal>
          </div>

          <div
            className="expertise-list-right"
            role="list"
            aria-label="Domaines de compétences"
            onMouseLeave={() => setFocusedExpertisePole(-1)}
          >
            {CLEAN_EXPERTISE_CARDS.map((card) => {
              const isOpen = activeId === card.id;
              return (
                <div key={card.id} role="listitem">
                  <button
                    type="button"
                    className="expertise-item-clean"
                    data-active={isOpen ? 'true' : 'false'}
                    aria-expanded={isOpen}
                    onMouseEnter={() => setFocusedExpertisePole(card.poleIndex)}
                    onClick={() => {
                      setActiveId(card.id);
                      setFocusedExpertisePole(card.poleIndex);
                    }}
                  >
                    <span className="expertise-icon-circle tabular" aria-hidden="true">
                      {card.num}
                    </span>

                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                        }}
                      >
                        <strong style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--ink)' }}>
                          {card.title}
                        </strong>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.68rem',
                            color: 'var(--ink-muted)',
                          }}
                        >
                          {isOpen ? '−' : '+'}
                        </span>
                      </div>

                      {isOpen && (
                        <div style={{ marginTop: '0.55rem' }}>
                          <p
                            style={{
                              fontSize: '0.86rem',
                              color: 'var(--ink-muted)',
                              lineHeight: 1.55,
                              marginBottom: '0.55rem',
                            }}
                          >
                            {card.summary}
                          </p>
                          <div className="tech-tag-list">
                            {card.tags.map((tag) => (
                              <span key={tag} className="tech-tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
