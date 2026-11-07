import { useEffect, useState } from 'react';
import { SELECTED_PROJECTS, type ProjectCaseStudy } from '../data/portfolioData';
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
 * SCÈNE 04 — PROJETS / ÉTUDES DE CAS
 * Galerie spatiale de 4 Pavillons Monumentaux alternés (SassySkin, AE-ECS, LAURA HOUSE, GYM OS SPORT).
 * Intègre de vraies captures et visuels issus des projets réels, avec ouverture d'une étude de cas complète en 12 points.
 */
export function ProjectsSceneSection({
  onSelectProject,
}: ProjectsSceneSectionProps) {
  const [focusedIdx, setFocusedIdx] = useState<number>(motionStore.focusedProjectIndex);
  const [visualIndices, setVisualIndices] = useState<Record<string, number>>({});
  const { ref, inView } = useSectionReveal<HTMLDivElement>();

  useEffect(() => {
    return subscribeFocusedProject((idx) => setFocusedIdx(idx));
  }, []);

  const setProjectVisual = (projectId: string, vIdx: number) => {
    setVisualIndices((prev) => ({ ...prev, [projectId]: vIdx }));
  };

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="scene-band"
    >
      <div
        ref={ref}
        data-inview={inView ? 'true' : 'false'}
        className="scene-inner reveal-block editorial-interactive"
      >
        <span className="section-kicker">04 · Réalisations &amp; Études de cas</span>
        <h2 id="projects-heading" className="section-heading">
          Quatre réalisations concrètes, conçues et déployées en ligne.
        </h2>
        <p className="section-lead">
          Chaque projet occupe son propre espace de présentation : contexte réel,
          problématique adressée, fonctionnalités vérifiées sur les applications en ligne et
          accès direct aux démonstrations.
        </p>

        <div
          className="projects-pavilions-corridor"
          role="list"
          aria-label="Galerie des quatre réalisations"
        >
          {SELECTED_PROJECTS.map((project, idx) => {
            const isActive = focusedIdx === idx;
            const currentVisualIdx = visualIndices[project.id] ?? 0;
            const currentVisual =
              project.visuals[currentVisualIdx] ?? project.visuals[0];
            const isRight = project.alignment === 'right';

            return (
              <article
                key={project.id}
                role="listitem"
                aria-label={`Pavillon projet ${project.name}`}
                data-active={isActive ? 'true' : 'false'}
                className={`project-pavilion ${isRight ? 'project-pavilion--right' : ''}`}
                onMouseEnter={() => setFocusedProjectIndex(idx)}
                onMouseLeave={() => setFocusedProjectIndex(-1)}
              >
                {/* Écran architectural portant les visuels authentiques du projet */}
                <div className="project-pavilion__screen">
                  <div
                    className="architectural-viewport"
                    onClick={() => onSelectProject(project)}
                  >
                    <img
                      src={currentVisual.src}
                      alt={currentVisual.alt}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="architectural-viewport__bar">
                      <span>{project.pavilionCode}</span>
                      <span>{currentVisual.sourceLabel}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.6rem',
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', color: 'var(--ice-300)' }}>
                      {currentVisual.caption}
                    </span>

                    {project.visuals.length > 1 && (
                      <div
                        className="pavilion-thumbs"
                        aria-label={`Vues réelles de ${project.name}`}
                      >
                        {project.visuals.map((v, vIdx) => (
                          <button
                            key={v.src}
                            type="button"
                            className="pavilion-thumb-btn"
                            aria-pressed={currentVisualIdx === vIdx}
                            onClick={() => setProjectVisual(project.id, vIdx)}
                          >
                            Vue 0{vIdx + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Séquence éditoriale structurée */}
                <div className="project-pavilion__narrative">
                  <div
                    className="tabular"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--azure-400)',
                      letterSpacing: '0.12em',
                      marginBottom: '0.35rem',
                    }}
                  >
                    PROJET {project.index} / 04 · {project.category.toUpperCase()}
                  </div>

                  <h3 style={{ fontSize: 'var(--step-2)', marginBottom: '0.55rem' }}>
                    {project.name}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.96rem',
                      fontWeight: 500,
                      color: 'var(--white)',
                      marginBottom: '0.85rem',
                    }}
                  >
                    {project.oneLinePitch}
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gap: '0.65rem',
                      marginBottom: '1rem',
                      paddingLeft: '0.85rem',
                      borderLeft: '2px solid rgba(118, 169, 232, 0.35)',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          color: 'var(--azure-400)',
                          display: 'block',
                        }}
                      >
                        BESOIN ADRESSÉ
                      </span>
                      <p style={{ fontSize: '0.87rem', color: 'var(--slate-700)' }}>
                        {project.problem}
                      </p>
                    </div>

                    <div>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          color: 'var(--azure-400)',
                          display: 'block',
                        }}
                      >
                        MA CONTRIBUTION
                      </span>
                      <p style={{ fontSize: '0.87rem', color: 'var(--ice-100)' }}>
                        {project.personalContribution}
                      </p>
                    </div>
                  </div>

                  {project.operationalNote && (
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--ice-300)',
                        padding: '0.6rem 0.8rem',
                        background: 'rgba(7, 20, 38, 0.65)',
                        border: '1px solid rgba(118, 169, 232, 0.24)',
                        borderRadius: '0.35rem',
                        marginBottom: '0.95rem',
                      }}
                    >
                      {project.operationalNote}
                    </p>
                  )}

                  <div className="tech-tag-list" style={{ marginBottom: '1.15rem' }}>
                    {project.technologies.map((tech) => (
                      <span
                        key={tech.label}
                        className={
                          tech.status === 'vérifié' ? 'tech-tag' : 'placeholder-tag'
                        }
                      >
                        {tech.label}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn-primary"
                      aria-label={`Ouvrir l'étude de cas complète de ${project.name}`}
                      onClick={() => onSelectProject(project)}
                    >
                      <span>Étude de cas complète (12 points)</span>
                      <span aria-hidden="true">→</span>
                    </button>

                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      <span>Voir {project.liveUrlLabel}</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
