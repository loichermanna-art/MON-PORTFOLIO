import { useEffect, useState } from 'react';
import { SELECTED_PROJECTS, type ProjectCaseStudy } from '../data/portfolioData';
import { PROJECT_VISUALS } from '../data/projectVisuals';
import {
  motionStore,
  setFocusedProjectIndex,
  subscribeFocusedProject,
} from '../motion/motionStore';
import { useSectionReveal } from '../motion/useSectionReveal';

interface ProjectsSceneSectionProps {
  reducedMotion?: boolean;
  onSelectProject: (project: ProjectCaseStudy) => void;
}

/**
 * SCÈNE 04 — PROJETS (« Sky Zenith » : 3 vitrines photographiques HD au-dessus des nuages)
 * Inclinaison 3D subtile au pointeur, zoom cinématographique 1.0 -> 1.07 et curseur magnétique.
 */
export function ProjectsSceneSection({
  reducedMotion = false,
  onSelectProject,
}: ProjectsSceneSectionProps) {
  const [focusedIdx, setFocusedIdx] = useState<-1 | 0 | 1 | 2>(
    motionStore.focusedProjectIndex
  );
  const [cardTilt, setCardTilt] = useState<{ idx: number; rx: number; ry: number }>({
    idx: -1,
    rx: 0,
    ry: 0,
  });
  const { ref, inView } = useSectionReveal<HTMLDivElement>();

  useEffect(() => {
    return subscribeFocusedProject((idx) => setFocusedIdx(idx));
  }, []);

  const handlePointerMove = (
    idx: number,
    e: React.PointerEvent<HTMLElement>
  ) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setCardTilt({ idx, rx: -ny * 6.5, ry: nx * 7.5 });
  };

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="scene-band scene-band--tall"
    >
      <div
        ref={ref}
        data-inview={inView ? 'true' : 'false'}
        className="scene-inner reveal-block"
      >
        <div className="chiaroscuro-split chiaroscuro-split--projects">
          <div className="editorial-monolith-copy editorial-interactive">
            <span className="section-kicker">04 · Projets</span>

            <h2 id="projects-heading" className="section-heading">
              Des idées qui prennent vie.
            </h2>

            <p className="section-lead" style={{ marginBottom: '1.85rem' }}>
              Trois réalisations conçues pour répondre à des besoins réels de billetterie
              numérique, de commerce en ligne et de structuration associative — présentées
              avec leurs architectures et statuts exacts.
            </p>

            <button
              type="button"
              className="pill-cta"
              onClick={() => onSelectProject(SELECTED_PROJECTS[0])}
            >
              <span>Explorer LAURA HOUSE</span>
              <span className="pill-cta__arrow" aria-hidden="true">
                →
              </span>
            </button>
          </div>

          <div
            className="projects-perspective-stage editorial-interactive"
            role="list"
            aria-label="Sélection des trois projets"
          >
            {SELECTED_PROJECTS.map((project, idx) => {
              const projIdx = idx as 0 | 1 | 2;
              const isActive = focusedIdx === projIdx;
              const visual = PROJECT_VISUALS[project.id];
              const isTilted = !reducedMotion && cardTilt.idx === idx;

              return (
                <article
                  key={project.id}
                  role="listitem"
                  aria-label={`Vitrine projet ${project.name}`}
                  data-active={isActive ? 'true' : 'false'}
                  className="project-vitrine-card"
                  style={
                    isTilted
                      ? {
                          transform: `translateY(-6px) rotateX(${cardTilt.rx.toFixed(2)}deg) rotateY(${cardTilt.ry.toFixed(2)}deg)`,
                        }
                      : undefined
                  }
                  onMouseEnter={() => setFocusedProjectIndex(projIdx)}
                  onMouseLeave={() => {
                    setFocusedProjectIndex(-1);
                    setCardTilt({ idx: -1, rx: 0, ry: 0 });
                  }}
                  onPointerMove={(e) => handlePointerMove(idx, e)}
                >
                  <div>
                    <div
                      className="project-vitrine-media"
                      onClick={() => onSelectProject(project)}
                    >
                      <img
                        src={visual.imageSrc}
                        alt={visual.imageAlt}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="project-vitrine-media__overlay">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.4rem' }}>
                          <span className="project-vitrine-chip">
                            {visual.badgeLabel}
                          </span>
                          {visual.isLive && (
                            <span
                              className="project-vitrine-chip"
                              style={{ paddingInline: '0.52rem' }}
                            >
                              <span className="project-vitrine-live-dot" />
                              <span>LIVE</span>
                            </span>
                          )}
                        </div>

                        <div
                          className="tabular"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            color: '#F8FAFC',
                            letterSpacing: '0.1em',
                          }}
                        >
                          {project.index} / 03
                        </div>
                      </div>
                    </div>

                    <h3
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        color: 'var(--slate-900)',
                        marginBottom: '0.42rem',
                      }}
                    >
                      {project.name}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.85rem',
                        lineHeight: 1.56,
                        color: 'var(--slate-700)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {project.tagline}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.35rem',
                        marginBottom: '0.9rem',
                      }}
                    >
                      {project.technologies.slice(0, 2).map((tech) => (
                        <span
                          key={tech.label}
                          className="tech-tag"
                          style={{ fontSize: '0.65rem', padding: '0.2rem 0.58rem' }}
                        >
                          {tech.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '0.55rem' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      aria-label={`Ouvrir la présentation détaillée de ${project.name}`}
                      style={{ width: '100%', fontSize: '0.82rem', minHeight: '2.45rem' }}
                      onClick={() => onSelectProject(project)}
                    >
                      <span>Étude détaillée</span>
                      <span aria-hidden="true">→</span>
                    </button>

                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost"
                        style={{ width: '100%', fontSize: '0.78rem', minHeight: '2.25rem' }}
                      >
                        {project.liveUrlLabel} ↗
                      </a>
                    ) : (
                      <span
                        className="placeholder-tag"
                        style={{ justifyContent: 'center', paddingBlock: '0.42rem' }}
                      >
                        Lien public à confirmer
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
