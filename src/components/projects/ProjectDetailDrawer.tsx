import { useEffect, useRef } from 'react';
import type { ProjectCaseStudy } from '../../data/portfolioData';

interface ProjectDetailDrawerProps {
  project: ProjectCaseStudy | null;
  onClose: () => void;
}

/** Spécimen architectural SVG haute précision illustrant la structure réelle de chaque projet */
function ProjectArchitecturalSpecimen({
  type,
}: {
  type: ProjectCaseStudy['uiPreviewType'];
}) {
  if (type === 'ticketing-qr') {
    return (
      <svg
        viewBox="0 0 560 220"
        width="100%"
        height="auto"
        role="img"
        aria-label="Schéma d’architecture LAURA HOUSE : module de réservation et carte-billet QR haute définition"
        style={{ display: 'block', marginBottom: '0.85rem' }}
      >
        <rect width="560" height="220" fill="#F5F2EB" stroke="#141413" strokeOpacity="0.16" />
        {/* Volet gauche : Réservation & Attribution */}
        <rect x="18" y="18" width="290" height="184" fill="#FCFBF8" stroke="#141413" strokeOpacity="0.18" />
        <rect x="18" y="18" width="290" height="6" fill="#183B56" />
        <text x="34" y="46" fill="#6E502F" fontFamily="monospace" fontSize="10">
          01 · MODULE RÉSERVATION WEB
        </text>
        <text x="34" y="70" fill="#141413" fontFamily="Georgia, serif" fontSize="18">
          LAURA HOUSE — Accès
        </text>
        <rect x="34" y="86" width="258" height="26" fill="#F5F2EB" stroke="#141413" strokeOpacity="0.14" />
        <text x="44" y="103" fill="#57534E" fontFamily="monospace" fontSize="9.5">
          Participant · Nom complet vérifié
        </text>
        <rect x="34" y="120" width="170" height="26" fill="#F5F2EB" stroke="#141413" strokeOpacity="0.14" />
        <text x="44" y="137" fill="#57534E" fontFamily="monospace" fontSize="9.5">
          Catégorie &amp; Place attribuée
        </text>
        <rect x="212" y="120" width="80" height="26" fill="#EAE5DA" />
        <text x="225" y="137" fill="#141413" fontFamily="monospace" fontSize="9.5">
          STATUT OK
        </text>
        <rect x="34" y="158" width="156" height="28" fill="#183B56" />
        <text x="50" y="176" fill="#FCFBF8" fontFamily="sans-serif" fontSize="10" fontWeight="600">
          Générer billet PNG HD
        </text>

        {/* Volet droit : Carte-billet QR exportée */}
        <rect x="328" y="18" width="214" height="184" fill="#FCFBF8" stroke="#6E502F" strokeWidth="1.5" />
        <line
          x1="328"
          y1="146"
          x2="542"
          y2="146"
          stroke="#6E502F"
          strokeDasharray="5 4"
          strokeOpacity="0.6"
        />
        <rect x="392" y="34" width="86" height="86" fill="#F5F2EB" stroke="#141413" strokeWidth="1.5" />
        <rect x="400" y="42" width="20" height="20" fill="none" stroke="#141413" strokeWidth="2" />
        <rect x="450" y="42" width="20" height="20" fill="none" stroke="#141413" strokeWidth="2" />
        <rect x="400" y="92" width="20" height="20" fill="none" stroke="#141413" strokeWidth="2" />
        <rect x="427" y="69" width="16" height="16" fill="#183B56" />
        <text x="435" y="136" textAnchor="middle" fill="#6E502F" fontFamily="monospace" fontSize="9">
          QR INTACT · EXPORT PNG
        </text>
        <text x="435" y="170" textAnchor="middle" fill="#141413" fontFamily="Georgia, serif" fontSize="13">
          BILLET INDIVIDUEL
        </text>
        <text x="435" y="187" textAnchor="middle" fill="#57534E" fontFamily="monospace" fontSize="8.5">
          CONTRÔLE D’ENTRÉE FIABLE
        </text>
      </svg>
    );
  }

  if (type === 'skincare-commerce') {
    return (
      <svg
        viewBox="0 0 560 220"
        width="100%"
        height="auto"
        role="img"
        aria-label="Schéma d’interface SassySkin : vitrine desktop et adaptation mobile responsive"
        style={{ display: 'block', marginBottom: '0.85rem' }}
      >
        <rect width="560" height="220" fill="#F5F2EB" stroke="#141413" strokeOpacity="0.16" />
        {/* Cadre Desktop */}
        <rect x="18" y="18" width="368" height="184" fill="#FCFBF8" stroke="#141413" strokeOpacity="0.18" />
        <line x1="18" y1="44" x2="386" y2="44" stroke="#141413" strokeOpacity="0.12" />
        <text x="34" y="35" fill="#141413" fontFamily="Georgia, serif" fontSize="12">
          SassySkin
        </text>
        <text x="275" y="35" fill="#6E502F" fontFamily="monospace" fontSize="9">
          SOINS · GAMMES · CONTACT
        </text>
        <rect x="34" y="58" width="152" height="126" fill="#EAE5DA" />
        <rect x="92" y="88" width="36" height="72" fill="#FCFBF8" stroke="#6E502F" />
        <rect x="101" y="74" width="18" height="14" fill="#423325" />
        <text x="202" y="78" fill="#141413" fontFamily="Georgia, serif" fontSize="17">
          Soins ciblés &amp;
        </text>
        <text x="202" y="98" fill="#141413" fontFamily="Georgia, serif" fontSize="17">
          clarté produit
        </text>
        <rect x="202" y="114" width="164" height="30" fill="#F5F2EB" />
        <text x="212" y="133" fill="#57534E" fontFamily="sans-serif" fontSize="9.5">
          Présentation structurée des gammes
        </text>
        <rect x="202" y="156" width="124" height="28" fill="#183B56" />
        <text x="220" y="174" fill="#FCFBF8" fontFamily="sans-serif" fontSize="10" fontWeight="600">
          Découvrir la gamme
        </text>

        {/* Cadre Mobile 390px */}
        <rect x="406" y="18" width="136" height="184" rx="4" fill="#FCFBF8" stroke="#6E502F" strokeWidth="1.5" />
        <text x="474" y="36" textAnchor="middle" fill="#6E502F" fontFamily="monospace" fontSize="8.5">
          MOBILE FIRST
        </text>
        <rect x="420" y="46" width="108" height="68" fill="#EAE5DA" />
        <rect x="420" y="124" width="108" height="28" fill="#F5F2EB" />
        <rect x="420" y="162" width="108" height="26" fill="#183B56" />
        <text x="474" y="179" textAnchor="middle" fill="#FCFBF8" fontFamily="sans-serif" fontSize="9.5">
          Commander
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 560 220"
      width="100%"
      height="auto"
      role="img"
      aria-label="Schéma fonctionnel EtuCo : environnement numérique du Club Études-Conseils"
      style={{ display: 'block', marginBottom: '0.85rem' }}
    >
      <rect width="560" height="220" fill="#F5F2EB" stroke="#141413" strokeOpacity="0.16" />
      <rect x="18" y="18" width="132" height="184" fill="#FCFBF8" stroke="#141413" strokeOpacity="0.18" />
      <rect x="18" y="18" width="132" height="6" fill="#183B56" />
      <text x="32" y="46" fill="#141413" fontFamily="Georgia, serif" fontSize="15">
        EtuCo
      </text>
      <text x="32" y="64" fill="#6E502F" fontFamily="monospace" fontSize="8.5">
        ÉTUDES-CONSEILS
      </text>
      {[86, 114, 142, 170].map((y, idx) => (
        <rect
          key={y}
          x="32"
          y={y}
          width="104"
          height="18"
          fill={idx === 0 ? '#EAE5DA' : '#F5F2EB'}
        />
      ))}

      {/* Espace central modulaire */}
      {[0, 1].map((col) =>
        [0, 1].map((row) => {
          const x = 168 + col * 190;
          const y = 18 + row * 96;
          return (
            <g key={`${col}-${row}`}>
              <rect
                x={x}
                y={y}
                width="174"
                height="88"
                fill="#FCFBF8"
                stroke="#141413"
                strokeOpacity="0.16"
              />
              <rect x={x} y={y} width="174" height="4" fill={col === 0 ? '#183B56' : '#6E502F'} />
              <rect x={x + 16} y={y + 20} width="96" height="8" fill="#141413" fillOpacity="0.75" />
              <rect x={x + 16} y={y + 38} width="138" height="6" fill="#57534E" fillOpacity="0.45" />
              <rect x={x + 16} y={y + 52} width="114" height="6" fill="#57534E" fillOpacity="0.35" />
            </g>
          );
        })
      )}
    </svg>
  );
}

export function ProjectDetailDrawer({ project, onClose }: ProjectDetailDrawerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Piège de focus clavier (Tab / Shift+Tab) strictement conforme WCAG 2.2
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="drawer-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
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
            gap: 'var(--space-4)',
            paddingBottom: 'var(--space-4)',
            marginBottom: 'var(--space-5)',
            borderBottom: '1px solid var(--line-subtle)',
          }}
        >
          <span
            className="tabular"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.76rem',
              color: 'var(--accent-bronze)',
              letterSpacing: '0.05em',
            }}
          >
            ÉTUDE DE CAS DÉTAILLÉE · PROJET {project.index}
          </span>
          <button
            ref={closeBtnRef}
            type="button"
            className="btn-secondary"
            style={{ minHeight: '2.35rem', padding: '0.35rem 0.9rem', fontSize: '0.84rem' }}
            onClick={onClose}
          >
            Fermer (Échap)
          </button>
        </div>

        <h2
          id="drawer-project-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--step-3)',
            lineHeight: 1.04,
            marginBottom: '0.4rem',
          }}
        >
          {project.name}
        </h2>
        <p style={{ color: 'var(--accent)', fontWeight: 500, marginBottom: 'var(--space-5)' }}>
          {project.category}
        </p>

        {/* Spécimen architectural d'interface (SVG vectoriel dédié + synthèse) */}
        <div
          style={{
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
            background: 'var(--bg)',
            border: '1px solid var(--line-strong)',
            borderLeft: '3px solid var(--accent)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--accent-bronze)',
              marginBottom: '0.6rem',
            }}
          >
            APERÇU STRUCTUREL DU DISPOSITIF
          </div>

          <ProjectArchitecturalSpecimen type={project.uiPreviewType} />

          <p style={{ fontSize: '0.88rem', color: 'var(--ink-muted)' }}>{project.tagline}</p>
        </div>

        <div style={{ display: 'grid', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--accent-bronze)',
                textTransform: 'uppercase',
                marginBottom: '0.35rem',
              }}
            >
              01 · Contexte &amp; Problème initial
            </h3>
            <p style={{ color: 'var(--ink)', marginBottom: '0.5rem' }}>{project.context}</p>
            <p style={{ color: 'var(--ink-muted)', fontSize: '0.95rem' }}>{project.problem}</p>
          </div>

          <div>
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--accent-bronze)',
                textTransform: 'uppercase',
                marginBottom: '0.35rem',
              }}
            >
              02 · Objectif &amp; Solution construite
            </h3>
            <p style={{ color: 'var(--ink)', marginBottom: '0.5rem' }}>{project.objective}</p>
            <p style={{ color: 'var(--ink-muted)', fontSize: '0.95rem' }}>{project.solution}</p>
          </div>

          <div>
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--accent-bronze)',
                textTransform: 'uppercase',
                marginBottom: '0.45rem',
              }}
            >
              03 · Points clés de réalisation
            </h3>
            <ul
              style={{
                margin: 0,
                paddingLeft: '1.15rem',
                display: 'grid',
                gap: '0.4rem',
                color: 'var(--ink)',
                fontSize: '0.94rem',
              }}
            >
              {project.architectureHighlights.map((hl) => (
                <li key={hl}>{hl}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--accent-bronze)',
                textTransform: 'uppercase',
                marginBottom: '0.35rem',
              }}
            >
              04 · Rôle réel &amp; Périmètre
            </h3>
            <p style={{ color: 'var(--ink)', marginBottom: '0.35rem' }}>{project.role}</p>
            {project.roleNote && <span className="placeholder-tag">{project.roleNote}</span>}
          </div>

          <div>
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--accent-bronze)',
                textTransform: 'uppercase',
                marginBottom: '0.45rem',
              }}
            >
              05 · Technologies &amp; État de vérification
            </h3>
            <div className="tech-tag-list" style={{ marginBottom: 0 }}>
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
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--line-subtle)',
          }}
        >
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Ouvrir {project.liveUrlLabel ?? project.name} ↗
            </a>
          ) : (
            <span className="placeholder-tag">
              [Lien de démonstration public EtuCo : À CONFIRMER]
            </span>
          )}

          <button type="button" className="btn-secondary" onClick={onClose}>
            Revenir à la Salle des Monolithes
          </button>
        </div>
      </div>
    </div>
  );
}
