import { MaskReveal } from '../components/typography/MaskReveal';
import { SELECTED_PROJECTS, type ProjectCaseStudy } from '../data/portfolioData';
import { setFocusedProjectIndex } from '../motion/motionStore';

interface ProjectsSceneSectionProps {
  onSelectProject: (project: ProjectCaseStudy) => void;
}

/**
 * Scène 04 — PROJETS (Galerie architecturale liée aux stèles 3D, 0 fausse capture d'écran)
 */
export function ProjectsSceneSection({ onSelectProject }: ProjectsSceneSectionProps) {
  const firstProject = SELECTED_PROJECTS[0];

  return (
    <section
      id="projects"
      className="scene-section"
      data-scene-index="3"
      aria-labelledby="projects-heading"
    >
      <div className="arch-container">
        <div className="arch-grid" style={{ alignItems: 'center' }}>
          <div className="spatial-left">
            <MaskReveal>
              <span className="spatial-overline">04 · Projets</span>
            </MaskReveal>

            <MaskReveal delayMs={70}>
              <h2 id="projects-heading" className="spatial-heading">
                Des idées qui prennent vie.
              </h2>
            </MaskReveal>

            <MaskReveal delayMs={140}>
              <p className="spatial-lead">
                Trois réalisations authentiques illustrant la conception fonctionnelle, la rigueur
                d’exécution et le déploiement d’outils concrets.
              </p>
            </MaskReveal>

            <MaskReveal delayMs={210}>
              <button
                type="button"
                className="pill-cta"
                onClick={() => onSelectProject(firstProject)}
              >
                <span>Ouvrir {firstProject.name}</span>
                <span className="pill-cta__arrow" aria-hidden="true">
                  →
                </span>
              </button>
            </MaskReveal>
          </div>

          <div
            className="floating-projects-deck"
            role="list"
            aria-label="Galerie des trois projets"
            onMouseLeave={() => setFocusedProjectIndex(-1)}
          >
            {SELECTED_PROJECTS.map((project, idx) => (
              <button
                key={project.id}
                type="button"
                role="listitem"
                className="floating-project-tile"
                onMouseEnter={() => setFocusedProjectIndex(idx as 0 | 1 | 2)}
                onFocus={() => setFocusedProjectIndex(idx as 0 | 1 | 2)}
                onClick={() => onSelectProject(project)}
                aria-label={`Ouvrir la présentation détaillée de ${project.name}`}
              >
                <div className="tile-preview-window">
                  <div
                    className="tabular"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      color: 'var(--azure-400)',
                    }}
                  >
                    <span>{project.steleLabel}</span>
                    <span>{project.index}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--ice-300)', lineHeight: 1.45 }}>
                    {project.role}
                  </div>
                </div>

                <div style={{ marginTop: '1.1rem' }}>
                  <h3 style={{ fontSize: '1.22rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    {project.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.83rem',
                      lineHeight: 1.5,
                      color: 'var(--ice-300)',
                      marginBottom: '0.95rem',
                    }}
                  >
                    {project.category}
                  </p>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--azure-400)',
                    }}
                  >
                    <span>Découvrir le projet</span>
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
