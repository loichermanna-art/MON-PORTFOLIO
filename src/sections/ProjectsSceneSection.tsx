import { MaskReveal } from '../components/typography/MaskReveal';
import { SELECTED_PROJECTS, type ProjectCaseStudy } from '../data/portfolioData';
import { setFocusedProjectIndex } from '../motion/motionStore';

interface ProjectsSceneSectionProps {
  onSelectProject: (project: ProjectCaseStudy) => void;
}

const TILE_THEMES: Record<string, 'obsidian' | 'rose' | 'ice'> = {
  'laura-house': 'obsidian',
  sassyskin: 'rose',
  etuco: 'ice',
};

/**
 * Scène 04 — Projets Sélectionnés
 * Fidèle au Panneau 04 : titre minimaliste à gauche et 3 panneaux flottants inclinés
 * en perspective à droite (LAURA HOUSE sombre, SassySkin poudré, EtuCo clair).
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
              <span className="spatial-overline">Projets</span>
            </MaskReveal>

            <MaskReveal delayMs={70}>
              <h2 id="projects-heading" className="spatial-heading">
                Des idées qui prennent vie.
              </h2>
            </MaskReveal>

            <MaskReveal delayMs={140}>
              <p className="spatial-lead">
                Trois réalisations concrètes illustrant ma capacité à analyser un besoin réel,
                structurer une expérience lisible et déployer une application fonctionnelle.
              </p>
            </MaskReveal>

            <MaskReveal delayMs={210}>
              <button
                type="button"
                className="pill-cta"
                onClick={() => onSelectProject(firstProject)}
              >
                <span>Étudier {firstProject.name}</span>
                <span aria-hidden="true">→</span>
              </button>
            </MaskReveal>
          </div>

          <div
            className="floating-projects-deck"
            role="list"
            aria-label="Projets vérifiés"
            onMouseLeave={() => setFocusedProjectIndex(-1)}
          >
            {SELECTED_PROJECTS.map((project, idx) => {
              const theme = TILE_THEMES[project.id] ?? 'ice';
              const isDark = theme === 'obsidian';

              return (
                <button
                  key={project.id}
                  type="button"
                  role="listitem"
                  className={`floating-project-tile floating-project-tile--${theme}`}
                  onMouseEnter={() => setFocusedProjectIndex(idx as 0 | 1 | 2)}
                  onFocus={() => setFocusedProjectIndex(idx as 0 | 1 | 2)}
                  onClick={() => onSelectProject(project)}
                  aria-label={`Ouvrir l’étude de cas ${project.name}`}
                >
                  <div className="tile-preview-window" aria-hidden="true">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.68rem',
                        fontFamily: 'var(--font-mono)',
                        opacity: 0.78,
                      }}
                    >
                      <span>{project.index}</span>
                      <span>{project.liveUrl ? 'WEB APP' : 'CLUB APP'}</span>
                    </div>

                    {project.id === 'laura-house' && (
                      <div style={{ display: 'grid', gap: '0.35rem' }}>
                        <div
                          style={{
                            height: '6px',
                            width: '58%',
                            borderRadius: '99px',
                            background: 'rgba(255,255,255,0.75)',
                          }}
                        />
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                          }}
                        >
                          <span style={{ fontSize: '0.68rem', opacity: 0.72 }}>
                            Ticket PNG · QR
                          </span>
                          <span
                            style={{
                              width: '28px',
                              height: '28px',
                              border: '1.5px solid rgba(255,255,255,0.65)',
                              borderRadius: '4px',
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {project.id === 'sassyskin' && (
                      <div style={{ display: 'grid', gap: '0.3rem' }}>
                        <span
                          style={{
                            fontSize: '1.05rem',
                            fontWeight: 600,
                            letterSpacing: '-0.02em',
                          }}
                        >
                          SassySkin
                        </span>
                        <span style={{ fontSize: '0.68rem', opacity: 0.7 }}>
                          Vitrine e-commerce · Mobile
                        </span>
                      </div>
                    )}

                    {project.id === 'etuco' && (
                      <div style={{ display: 'grid', gap: '0.35rem' }}>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <span
                            style={{
                              flex: 1,
                              height: '22px',
                              borderRadius: '5px',
                              background: '#ffffff',
                            }}
                          />
                          <span
                            style={{
                              flex: 1,
                              height: '22px',
                              borderRadius: '5px',
                              background: '#ffffff',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.68rem', opacity: 0.72 }}>
                          Espace Club Études-Conseils
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '1rem' }}>
                    <h3
                      style={{
                        fontSize: '1.18rem',
                        fontWeight: 600,
                        marginBottom: '0.25rem',
                        color: isDark ? '#ffffff' : '#11141c',
                      }}
                    >
                      {project.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        lineHeight: 1.45,
                        color: isDark ? 'rgba(248,250,252,0.74)' : 'rgba(17,20,28,0.72)',
                        marginBottom: '0.85rem',
                      }}
                    >
                      {project.category}
                    </p>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}
                    >
                      <span>Étude de cas</span>
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
