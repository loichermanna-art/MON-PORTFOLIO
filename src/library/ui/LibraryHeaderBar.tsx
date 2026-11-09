import {
  LIBRARY_SPACES,
  PROFILE_IDENTITY,
} from '../../data/portfolioData';
import { useLibraryStore } from '../state/useLibraryStore';

export function LibraryHeaderBar() {
  const activeRoomIndex = useLibraryStore((s) => s.activeRoomIndex);
  const walkToRoom = useLibraryStore((s) => s.walkToRoom);
  const dossierOpen = useLibraryStore((s) => s.dossierOpen);
  const openDossier = useLibraryStore((s) => s.openDossier);
  const closeDossier = useLibraryStore((s) => s.closeDossier);
  const reducedMotion = useLibraryStore((s) => s.reducedMotion);
  const toggleManualReducedMotion = useLibraryStore(
    (s) => s.toggleManualReducedMotion
  );

  return (
    <header className="lib-header" role="banner">
      <div className="lib-header__brand">
        <button
          type="button"
          className="lib-header__monogram-btn"
          onClick={() => {
            closeDossier();
            walkToRoom(0);
          }}
          aria-label="Revenir à l’entrée du parcours 3D — Loïc AKANDA"
        >
          <span className="lib-header__monogram" aria-hidden="true">
            LA
          </span>
          <span className="lib-header__brand-copy">
            <span className="lib-header__brand-name">
              {PROFILE_IDENTITY.fullName}
            </span>
            <span className="lib-header__brand-sub">PARCOURS 3D · INP-HB</span>
          </span>
        </button>
      </div>

      <nav
        className="lib-header__spaces"
        aria-label="Navigation spatiale dans les six salles du parcours 3D"
      >
        {LIBRARY_SPACES.map((space) => {
          const isCurrent = !dossierOpen && activeRoomIndex === space.index;

          return (
            <button
              key={space.slug}
              type="button"
              className={`lib-header__space-btn ${isCurrent ? 'is-active' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
              onClick={() => walkToRoom(space.index)}
              title={`Se déplacer en 3D vers ${space.code} · ${space.title} (${space.subtitle})`}
            >
              <span className="lib-header__space-code">{space.code}</span>
              <span className="lib-header__space-title">{space.title}</span>
            </button>
          );
        })}
      </nav>

      <div className="lib-header__actions">
        <button
          type="button"
          className="lib-header__utility-btn"
          onClick={toggleManualReducedMotion}
          aria-pressed={reducedMotion}
          title="Activer ou désactiver le mode mouvement réduit"
        >
          {reducedMotion ? 'Mouvement : réduit' : 'Mouvement : fluide'}
        </button>

        <button
          type="button"
          className="lib-header__utility-btn lib-header__utility-btn--catalogue"
          onClick={() =>
            dossierOpen ? closeDossier() : openDossier('projects')
          }
          aria-expanded={dossierOpen}
          title="Mode lecture accessible (Catalogue texte complet)"
        >
          {dossierOpen ? 'Retour vue 3D' : 'Mode Lecture'}
        </button>

        <a
          href={PROFILE_IDENTITY.cvUrl}
          download={PROFILE_IDENTITY.cvDownloadName}
          className="lib-header__cv-link"
        >
          CV PDF
        </a>
      </div>
    </header>
  );
}
