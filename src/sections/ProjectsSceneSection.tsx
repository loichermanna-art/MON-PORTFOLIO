import { useEffect, useState } from 'react';
import { SELECTED_PROJECTS, type ProjectCaseStudy } from '../data/portfolioData';
import {
  motionStore,
  setFocusedProjectIndex,
  subscribeFocusedProject,
} from '../motion/motionStore';
import { useSectionReveal } from '../motion/useSectionReveal';

interface ProjectsSceneSectionProps {
  onSelectProject: (project: ProjectCaseStudy) => void;
}

function VitrineArtwork({ projectId }: { projectId: ProjectCaseStudy['id'] }) {
  if (projectId === 'laura-house') {
    return (
      <div
        className="project-vitrine-preview"
        style={{
          background:
            'radial-gradient(circle at 86% 20%, rgba(245, 158, 11, 0.28), transparent 52%), linear-gradient(145deg, #202A36 0%, #141C25 100%)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.64rem',
              letterSpacing: '0.14em',
              color: '#CBD5E1',
            }}
          >
            BILLETTERIE QR · HD
          </span>
          <span
            style={{
              width: '1.35rem',
              height: '1.35rem',
              border: '1px solid rgba(255,255,255,0.48)',
              borderRadius: '3px',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '2px',
              padding: '3px',
            }}
            aria-hidden="true"
          >
            <span style={{ background: '#FFF' }} />
            <span style={{ background: 'rgba(255,255,255,0.35)' }} />
            <span style={{ background: 'rgba(255,255,255,0.35)' }} />
            <span style={{ background: '#F59E0B' }} />
          </span>
        </div>
        <div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.08rem',
              fontWeight: 600,
              letterSpacing: '0.02em',
              color: '#FFFFFF',
            }}
          >
            LAURA HOUSE
          </span>
        </div>
      </div>
    );
  }

  if (projectId === 'sassyskin') {
    return (
      <div
        className="project-vitrine-preview"
        style={{
          background: 'linear-gradient(145deg, #F8FAFC 0%, #E2E8F0 100%)',
          color: '#202A36',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.64rem',
              letterSpacing: '0.14em',
              color: '#475569',
            }}
          >
            SKINCARE · E-COMMERCE
          </span>
          <span
            aria-hidden="true"
            style={{
              width: '1.2rem',
              height: '1.2rem',
              borderRadius: '50%',
              border: '1.5px solid #D97706',
            }}
          />
        </div>
        <div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.08rem',
              fontWeight: 600,
              color: '#202A36',
            }}
          >
            SassySkin
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="project-vitrine-preview"
      style={{
        background:
          'radial-gradient(circle at 82% 80%, rgba(245, 158, 11, 0.22), transparent 58%), linear-gradient(145deg, #273444 0%, #18212C 100%)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.64rem',
            letterSpacing: '0.14em',
            color: '#CBD5E1',
          }}
        >
          ÉTUDES-CONSEILS
        </span>
        <span
          aria-hidden="true"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: '#FDE68A',
          }}
        >
          INP-HB
        </span>
      </div>
      <div>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.08rem',
            fontWeight: 600,
            color: '#FFFFFF',
          }}
        >
          EtuCo
        </span>
      </div>
    </div>
  );
}

/**
 * SCÈNE 04 — PROJETS (« Sky Zenith » : 3 vitrines cristallines au-dessus des nuages)
 */
export function ProjectsSceneSection({ onSelectProject }: ProjectsSceneSectionProps) {
  const [focusedIdx, setFocusedIdx] = useState<-1 | 0 | 1 | 2>(
    motionStore.focusedProjectIndex
  );
  const { ref, inView } = useSectionReveal<HTMLDivElement>();

  useEffect(() => {
    return subscribeFocusedProject((idx) => setFocusedIdx(idx));
  }, []);

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
        <div className="chiaroscuro-split">
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
              return (
                <article
                  key={project.id}
                  role="listitem"
                  aria-label={`Vitrine projet ${project.name}`}
                  data-active={isActive ? 'true' : 'false'}
                  className="project-vitrine-card"
                  onMouseEnter={() => setFocusedProjectIndex(projIdx)}
                  onMouseLeave={() => setFocusedProjectIndex(-1)}
                >
                  <div>
                    <VitrineArtwork projectId={project.id} />

                    <div
                      className="tabular"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        color: 'var(--slate-600)',
                        marginBottom: '0.35rem',
                      }}
                    >
                      {project.index} / 03
                    </div>

                    <h3
                      style={{
                        fontSize: '1.18rem',
                        fontWeight: 600,
                        color: 'var(--slate-900)',
                        marginBottom: '0.45rem',
                      }}
                    >
                      {project.name}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.85rem',
                        lineHeight: 1.56,
                        color: 'var(--slate-700)',
                        marginBottom: '0.95rem',
                      }}
                    >
                      {project.tagline}
                    </p>
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
