import { useState } from 'react';
import { SELECTED_PROJECTS, type ProjectCaseStudy } from '../data/portfolioData';
import { setFocusedProjectIndex } from '../motion/motionStore';
import { MaskReveal } from '../components/typography/MaskReveal';
import { ProjectDetailDrawer } from '../components/projects/ProjectDetailDrawer';

/**
 * SCÈNE 04 — SELECTED PROJECTS (« La Salle des Monolithes d'Exposition »)
 * 3 stations muséales alternées (Gauche -> Droite -> Gauche) en vis-à-vis direct avec les
 * 3 stèles d'exposition 3D (LAURA HOUSE, SassySkin, EtuCo).
 */
export function ProjectsSceneSection() {
  const [drawerProject, setDrawerProject] = useState<ProjectCaseStudy | null>(null);

  const openCaseStudy = (project: ProjectCaseStudy, idx: 0 | 1 | 2) => {
    setFocusedProjectIndex(idx);
    setDrawerProject(project);
  };

  const closeCaseStudy = () => {
    setDrawerProject(null);
    setFocusedProjectIndex(-1);
  };

  return (
    <section
      id="projects"
      className="scene-section scene-section--projects"
      aria-labelledby="projects-heading"
    >
      <div className="arch-container">
        <div className="arch-grid">
          <div className="projects-intro">
            <MaskReveal>
              <div className="scene-index-line tabular">
                <span className="scene-index-line__rule" aria-hidden="true" />
                <span>SCÈNE 04 — LA SALLE DES MONOLITHES · RÉALISATIONS SÉLECTIONNÉES</span>
              </div>
            </MaskReveal>
            <MaskReveal delayMs={70}>
              <h2 id="projects-heading" className="section-display-title">
                Transformer des besoins concrets en plateformes opérationnelles.
              </h2>
            </MaskReveal>
            <p style={{ color: 'var(--ink-muted)', fontSize: '0.96rem' }}>
              Trois réalisations documentées illustrant la conception fonctionnelle, la structuration
              d’interfaces claires et la livraison d’outils numériques utiles.
            </p>
          </div>
        </div>

        {SELECTED_PROJECTS.map((project, rawIdx) => {
          const steleIndex = rawIdx as 0 | 1 | 2;
          const cardAlignClass =
            project.alignment === 'left'
              ? 'project-station__card--left'
              : 'project-station__card--right';

          return (
            <div key={project.id} className="arch-grid project-station">
              <article
                className={`scene-panel ${cardAlignClass}`}
                onMouseEnter={() => setFocusedProjectIndex(steleIndex)}
                onMouseLeave={() => {
                  if (!drawerProject) setFocusedProjectIndex(-1);
                }}
              >
                <div className="project-meta-row tabular">
                  <span>PROJET {project.index} / 03</span>
                  <span>{project.steleLabel}</span>
                </div>

                <h3 className="project-title">{project.name}</h3>
                <div className="project-category">{project.category}</div>
                <p style={{ color: 'var(--ink-muted)', fontSize: '0.95rem' }}>{project.tagline}</p>

                <dl className="project-dl">
                  <div className="project-dl__row">
                    <dt className="project-dl__term">Problème</dt>
                    <dd className="project-dl__desc" style={{ margin: 0 }}>
                      {project.problem}
                    </dd>
                  </div>
                  <div className="project-dl__row">
                    <dt className="project-dl__term">Solution</dt>
                    <dd className="project-dl__desc" style={{ margin: 0 }}>
                      {project.solution}
                    </dd>
                  </div>
                  <div className="project-dl__row">
                    <dt className="project-dl__term">Mon rôle</dt>
                    <dd className="project-dl__desc" style={{ margin: 0 }}>
                      <div>{project.role}</div>
                      {project.roleNote && (
                        <div style={{ marginTop: '0.3rem' }}>
                          <span className="placeholder-tag">{project.roleNote}</span>
                        </div>
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="tech-tag-list" aria-label={`Technologies de ${project.name}`}>
                  {project.technologies.map((tech) =>
                    tech.status === 'vérifié' ? (
                      <span key={tech.label} className="tech-tag">
                        {tech.label}
                      </span>
                    ) : (
                      <span key={tech.label} className="placeholder-tag">
                        {tech.label}
                      </span>
                    )
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => openCaseStudy(project, steleIndex)}
                  >
                    Inspecter l’étude de cas
                  </button>

                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      Voir le site ({project.liveUrlLabel}) ↗
                    </a>
                  ) : (
                    <span className="placeholder-tag">
                      [Démonstration EtuCo : À CONFIRMER]
                    </span>
                  )}
                </div>
              </article>
            </div>
          );
        })}
      </div>

      <ProjectDetailDrawer project={drawerProject} onClose={closeCaseStudy} />
    </section>
  );
}
