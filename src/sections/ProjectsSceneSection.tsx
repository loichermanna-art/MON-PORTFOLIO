import { useEffect, useRef, useState } from 'react';
import { MaskReveal } from '../components/typography/MaskReveal';
import { SELECTED_PROJECTS, type ProjectCaseStudy } from '../data/portfolioData';
import {
  motionStore,
  setFocusedProjectIndex,
  subscribeFocusedProject,
} from '../motion/motionStore';
import { useSectionDepthMotion } from '../motion/useSectionDepthMotion';

interface ProjectsSceneSectionProps {
  onSelectProject: (project: ProjectCaseStudy) => void;
}

/**
 * Scène 04 — PROJETS (Galerie muséale bidirectionnelle : chevalets 3D <-> rail d'exposition) :
 * - Hauteur maîtrisée du rail bas-droit pour ne jamais masquer les 3 chevalets 3D éclairés
 *   dans la perspective de la galerie.
 * - Survoler ou cliquer un chevalet directement en 3D met en surbrillance sa fiche ici et ouvre l'étude.
 */
export function ProjectsSceneSection({ onSelectProject }: ProjectsSceneSectionProps) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [focusedIdx, setFocusedIdx] = useState<-1 | 0 | 1 | 2>(motionStore.focusedProjectIndex);
  const firstProject = SELECTED_PROJECTS[0];

  useEffect(() => {
    return subscribeFocusedProject((idx) => setFocusedIdx(idx));
  }, []);

  useSectionDepthMotion(3, leftRef, rightRef);

  return (
    <section
      id="projects"
      className="scene-section"
      data-scene-index="3"
      aria-labelledby="projects-heading"
    >
      <div className="arch-container">
        <div className="arch-grid" style={{ alignItems: 'end' }}>
          <div ref={leftRef} className="spatial-left">
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
                Trois réalisations authentiques exposées dans la nef — cliquez sur un chevalet 3D
                ou sur son cartel ci-contre pour inspecter son architecture.
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
            ref={rightRef}
            className="floating-projects-deck"
            role="list"
            aria-label="Galerie des trois projets"
            onMouseLeave={() => setFocusedProjectIndex(-1)}
          >
            {SELECTED_PROJECTS.map((project, idx) => {
              const typedIdx = idx as 0 | 1 | 2;
              const isFocused = focusedIdx === typedIdx;
              return (
                <button
                  key={project.id}
                  type="button"
                  role="listitem"
                  className="floating-project-tile"
                  data-active={isFocused ? 'true' : 'false'}
                  onMouseEnter={() => setFocusedProjectIndex(typedIdx)}
                  onFocus={() => setFocusedProjectIndex(typedIdx)}
                  onBlur={() => setFocusedProjectIndex(-1)}
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
                        fontSize: '0.64rem',
                        color: 'var(--azure-400)',
                      }}
                    >
                      <span>{project.steleLabel}</span>
                      <span>{project.index}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 600, marginBottom: '0.28rem' }}>
                      {project.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.78rem',
                        lineHeight: 1.45,
                        color: 'var(--ice-300)',
                        marginBottom: '0.7rem',
                      }}
                    >
                      {project.category}
                    </p>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        color: 'var(--azure-400)',
                      }}
                    >
                      <span>Découvrir le projet</span>
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
