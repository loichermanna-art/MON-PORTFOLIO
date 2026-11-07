import { useEffect, useRef } from 'react';
import type { ProjectCaseStudy } from '../../data/portfolioData';
import { ProjectArchitectureDiagram } from './ProjectArchitectureDiagram';

interface ProjectDetailDrawerProps {
  project: ProjectCaseStudy | null;
  onClose: () => void;
}

export function ProjectDetailDrawer({ project, onClose }: ProjectDetailDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="drawer-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-project-title"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--line-subtle)',
            marginBottom: '1.75rem',
          }}
        >
          <span
            className="tabular"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              fontWeight: 600,
              color: 'var(--amber-700)',
              letterSpacing: '0.08em',
            }}
          >
            {project.steleLabel}
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            className="pill-cta"
            onClick={onClose}
            aria-label="Fermer la fiche projet"
            style={{ minHeight: '2.4rem', padding: '0.4rem 1.05rem', fontSize: '0.82rem' }}
          >
            Fermer
          </button>
        </div>

        <h2
          id="drawer-project-title"
          style={{ fontSize: 'var(--step-3)', color: 'var(--slate-900)', marginBottom: '0.65rem' }}
        >
          {project.name}
        </h2>

        <p style={{ color: 'var(--slate-700)', marginBottom: '1.5rem' }}>{project.context}</p>

        <div style={{ marginBottom: '1.75rem' }}>
          <ProjectArchitectureDiagram projectId={project.id} />
        </div>

        <div
          style={{
            display: 'grid',
            gap: '1.25rem',
            paddingBlock: '1.35rem',
            borderTop: '1px solid var(--line-subtle)',
            borderBottom: '1px solid var(--line-subtle)',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '0.3rem' }}>
              Problématique adressée
            </h3>
            <p style={{ color: 'var(--slate-700)', fontSize: '0.92rem' }}>{project.problem}</p>
          </div>

          <div>
            <h3 style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '0.3rem' }}>
              Architecture &amp; solution conçue
            </h3>
            <p style={{ color: 'var(--slate-700)', fontSize: '0.92rem' }}>{project.solution}</p>
          </div>

          <div>
            <h3 style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '0.4rem' }}>
              Rôle &amp; livrables vérifiés
            </h3>
            <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '0.45rem' }}>
              {project.role}
            </p>
            {project.roleNote && (
              <p
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--slate-600)',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '0.45rem',
                }}
              >
                {project.roleNote}
              </p>
            )}
            <ul
              style={{
                margin: 0,
                paddingLeft: '1.15rem',
                color: 'var(--slate-700)',
                fontSize: '0.9rem',
                display: 'grid',
                gap: '0.3rem',
              }}
            >
              {project.architectureHighlights.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ marginBottom: '1.75rem' }}>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--slate-600)',
              marginBottom: '0.55rem',
              letterSpacing: '0.08em',
            }}
          >
            TECHNOLOGIES CONFIRMÉES
          </span>
          <div className="tech-tag-list">
            {project.technologies.map((tech) => (
              <span
                key={tech.label}
                className={tech.status === 'vérifié' ? 'tech-tag' : 'placeholder-tag'}
              >
                {tech.label}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Ouvrir {project.liveUrlLabel ?? 'l’application'} ↗
            </a>
          )}
          {project.urlStatus === 'à confirmer' && (
            <span className="placeholder-tag">Lien public à renseigner</span>
          )}
        </div>
      </div>
    </div>
  );
}
