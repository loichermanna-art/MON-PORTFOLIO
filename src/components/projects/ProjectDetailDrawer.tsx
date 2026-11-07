import { useEffect, useRef, useState } from 'react';
import { SELECTED_PROJECTS, type ProjectCaseStudy } from '../../data/portfolioData';
import { setCaseStudyOpenIndex } from '../../motion/motionStore';
import { ProjectArchitectureDiagram } from './ProjectArchitectureDiagram';

interface ProjectDetailDrawerProps {
  project: ProjectCaseStudy | null;
  onClose: () => void;
}

/**
 * Expérience dédiée d'étude de cas complète suivant strictement la structure en 12 points :
 * 1. Nom · 2. Catégorie · 3. Phrase · 4. Contexte · 5. Problématique · 6. Objectif ·
 * 7. Contribution personnelle · 8. Solution conçue · 9. Fonctionnalités réellement développées ·
 * 10. Technologies · 11. État actuel · 12. Démonstration & galerie de visuels réels.
 */
export function ProjectDetailDrawer({ project, onClose }: ProjectDetailDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [activeVisualIdx, setActiveVisualIdx] = useState<number>(0);

  useEffect(() => {
    setActiveVisualIdx(0);
    if (!project) {
      setCaseStudyOpenIndex(-1);
      return;
    }

    const pIdx = SELECTED_PROJECTS.findIndex((p) => p.id === project.id);
    setCaseStudyOpenIndex(pIdx);

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
      setCaseStudyOpenIndex(-1);
      previousFocusRef.current?.focus?.();
    };
  }, [project, onClose]);

  if (!project) return null;

  const activeVisual = project.visuals[activeVisualIdx] ?? project.visuals[0];

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
        {/* En-tête */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--line-hairline)',
            marginBottom: '1.35rem',
          }}
        >
          <div>
            <span
              className="tabular"
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--azure-400)',
                letterSpacing: '0.1em',
              }}
            >
              ÉTUDE DE CAS {project.index} / 04 · {project.category}
            </span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="btn-secondary"
            onClick={onClose}
            aria-label="Fermer la fiche projet"
            style={{ minHeight: '2.35rem', padding: '0.35rem 1rem', fontSize: '0.82rem' }}
          >
            Fermer ✕
          </button>
        </div>

        {/* 1, 2 & 3 : Nom, Catégorie, Présentation en une phrase */}
        <h2
          id="drawer-project-title"
          style={{ fontSize: 'var(--step-3)', marginBottom: '0.5rem' }}
        >
          {project.name}
        </h2>
        <p
          style={{
            fontSize: '1.02rem',
            fontWeight: 500,
            color: 'var(--white)',
            marginBottom: '1.25rem',
          }}
        >
          {project.oneLinePitch}
        </p>

        {/* Galerie de visuels réels du projet */}
        <div className="drawer-hero-banner">
          <img src={activeVisual.src} alt={activeVisual.alt} />
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '1.5rem',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: 'var(--ice-300)' }}>
            {activeVisual.caption} ({activeVisual.sourceLabel})
          </span>
          {project.visuals.length > 1 && (
            <div className="pavilion-thumbs">
              {project.visuals.map((v, idx) => (
                <button
                  key={v.src}
                  type="button"
                  className="pavilion-thumb-btn"
                  aria-pressed={activeVisualIdx === idx}
                  onClick={() => setActiveVisualIdx(idx)}
                >
                  Visuel réel 0{idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Schéma fonctionnel vérifié */}
        <div style={{ marginBottom: '1.5rem' }}>
          <ProjectArchitectureDiagram projectId={project.id} />
        </div>

        {/* Grille des points 4, 5, 6, 7 & 8 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
            gap: '0.95rem',
            marginBottom: '1.35rem',
          }}
        >
          <div className="register-panel">
            <h3 style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--azure-400)', marginBottom: '0.35rem' }}>
              04 · CONTEXTE
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--slate-700)' }}>{project.context}</p>
          </div>

          <div className="register-panel">
            <h3 style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--azure-400)', marginBottom: '0.35rem' }}>
              05 · PROBLÉMATIQUE OU BESOIN
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--slate-700)' }}>{project.problem}</p>
          </div>

          <div className="register-panel">
            <h3 style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--azure-400)', marginBottom: '0.35rem' }}>
              06 · OBJECTIF
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--slate-700)' }}>{project.objective}</p>
          </div>

          <div className="register-panel">
            <h3 style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--azure-400)', marginBottom: '0.35rem' }}>
              07 · MA CONTRIBUTION PERSONNELLE
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--ice-100)' }}>
              {project.personalContribution}
            </p>
          </div>
        </div>

        {/* 8 & 9 : Solution conçue & Fonctionnalités réellement développées */}
        <div className="register-panel" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--azure-400)', marginBottom: '0.35rem' }}>
            08 · SOLUTION CONÇUE
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--ice-100)', marginBottom: '0.9rem' }}>
            {project.solution}
          </p>

          <h3 style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--azure-400)', marginBottom: '0.4rem' }}>
            09 · FONCTIONNALITÉS RÉELLEMENT DÉVELOPPÉES &amp; VÉRIFIÉES
          </h3>
          <ul
            style={{
              margin: 0,
              paddingLeft: '1.15rem',
              color: 'var(--ice-100)',
              fontSize: '0.88rem',
              display: 'grid',
              gap: '0.32rem',
            }}
          >
            {project.verifiedFeatures.map((feat) => (
              <li key={feat}>{feat}</li>
            ))}
          </ul>

          {project.operationalNote && (
            <p
              style={{
                marginTop: '0.85rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--line-hairline)',
                fontSize: '0.83rem',
                color: 'var(--azure-400)',
              }}
            >
              {project.operationalNote}
            </p>
          )}
        </div>

        {/* 10 & 11 : Technologies utilisées & État actuel */}
        <div className="register-panel" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--azure-400)', marginBottom: '0.45rem' }}>
            10 · TECHNOLOGIES UTILISÉES
          </h3>
          <div className="tech-tag-list" style={{ marginBottom: '0.95rem' }}>
            {project.technologies.map((tech) => (
              <span
                key={tech.label}
                className={tech.status === 'vérifié' ? 'tech-tag' : 'placeholder-tag'}
              >
                {tech.label}
              </span>
            ))}
          </div>

          <h3 style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--azure-400)', marginBottom: '0.3rem' }}>
            11 · RÉSULTAT &amp; ÉTAT ACTUEL
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate-700)' }}>
            {project.currentState}
          </p>
        </div>

        {/* 12 : Démonstration du projet */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <span>12 · Ouvrir la démonstration ({project.liveUrlLabel})</span>
            <span aria-hidden="true">↗</span>
          </a>

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <span>Code source ({project.repoLabel})</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
