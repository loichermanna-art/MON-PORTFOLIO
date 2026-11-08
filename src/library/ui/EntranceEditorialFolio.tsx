import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { PROFILE_IDENTITY } from '../../data/portfolioData';
import { useLibraryStore } from '../state/useLibraryStore';

gsap.registerPlugin(useGSAP);

interface EntranceEditorialFolioProps {
  onTogglePortal: () => void;
}

export function EntranceEditorialFolio({
  onTogglePortal,
}: EntranceEditorialFolioProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const portalPhase = useLibraryStore((s) => s.portalPhase);
  const doorHovered = useLibraryStore((s) => s.doorHovered);
  const reducedMotion = useLibraryStore((s) => s.reducedMotion);
  const openDossier = useLibraryStore((s) => s.openDossier);

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set('.lib-reveal-line', { yPercent: 0, opacity: 1 });
        return;
      }

      gsap.fromTo(
        '.lib-reveal-line',
        { yPercent: 42, opacity: 0.01 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.075,
          ease: 'power3.out',
        }
      );
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  const isInsideThreshold = portalPhase === 'threshold';

  return (
    <section
      ref={containerRef}
      className={`lib-entrance-hud ${
        isInsideThreshold ? 'lib-entrance-hud--threshold' : ''
      }`}
      aria-labelledby="library-entrance-heading"
    >
      {/* Left Architectural Cartel — Leaves the central 4.6 m portal & nave vista completely clear */}
      <div className="lib-folio-card">
        <div className="lib-mask">
          <p className="lib-reveal-line lib-folio-card__kicker">
            <span>ESPACE 01 / 06 — L’ENTRÉE · IDENTITÉ</span>
            <span className="lib-folio-card__dot" aria-hidden="true" />
            <span>INP-HB · CÔTE D’IVOIRE</span>
          </p>
        </div>

        <h1 id="library-entrance-heading" className="lib-folio-card__title">
          <span className="lib-mask">
            <span className="lib-reveal-line">{PROFILE_IDENTITY.fullName}</span>
          </span>
        </h1>

        <div className="lib-mask">
          <p className="lib-reveal-line lib-folio-card__positioning">
            {PROFILE_IDENTITY.positioning}
          </p>
        </div>

        <div className="lib-mask">
          <p className="lib-reveal-line lib-folio-card__summary">
            {isInsideThreshold
              ? 'Seuil franchi : vous faites face à la galerie voûtée des Archives, à la Grande Nef à double hauteur garnie d’ouvrages et à l’escalier menant à la mezzanine des Méthodes et au Belvédère.'
              : PROFILE_IDENTITY.heroSummary}
          </p>
        </div>

        <div className="lib-mask">
          <div className="lib-reveal-line lib-folio-card__actions">
            <button
              type="button"
              className="lib-btn lib-btn--primary"
              onClick={onTogglePortal}
            >
              <span>
                {isInsideThreshold
                  ? 'Revenir devant le portail'
                  : 'Entrer dans la bibliothèque'}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                {isInsideThreshold ? (
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                ) : (
                  <path d="M5 12h14M13 5l7 7-7 7" />
                )}
              </svg>
            </button>

            <a
              href={PROFILE_IDENTITY.cvUrl}
              download={PROFILE_IDENTITY.cvDownloadName}
              className="lib-btn lib-btn--secondary"
            >
              <span>Télécharger le CV</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" />
              </svg>
            </a>

            <button
              type="button"
              className="lib-btn lib-btn--ghost"
              onClick={() => openDossier('projects')}
            >
              Consulter les 4 projets
            </button>
          </div>
        </div>
      </div>

      {/* Subtle right-side spatial & interaction cue */}
      <aside className="lib-spatial-plaque" aria-live="polite">
        <div className="lib-spatial-plaque__status">
          <span className="lib-spatial-plaque__indicator" aria-hidden="true" />
          <span>
            {doorHovered
              ? isInsideThreshold
                ? 'Portail sélectionné — Cliquez pour refermer les vantaux'
                : 'Portail en noyer sélectionné — Cliquez pour ouvrir les portes'
              : portalPhase === 'vestibule'
                ? 'Vestibule d’entrée · Faites défiler ou cliquez sur les portes'
                : portalPhase === 'opening'
                  ? 'Ouverture des vantaux en noyer & bronze…'
                  : 'Seuil de la Grande Nef · Perspective architecturale continue'}
          </span>
        </div>
        <div className="lib-spatial-plaque__coords">
          <span>SÉQUENCE 01 · PORTAIL MONUMENTAL (4,60 M)</span>
        </div>
      </aside>
    </section>
  );
}
