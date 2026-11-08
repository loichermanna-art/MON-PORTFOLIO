import {
  LIBRARY_SPACES,
  PROFILE_IDENTITY,
} from '../../data/portfolioData';
import {
  useLibraryStore,
  type DossierTab,
} from '../state/useLibraryStore';

const SPACE_TO_TAB: Record<string, DossierTab> = {
  entree: 'overview',
  archives: 'archives',
  rayonnages: 'collections',
  'collection-privee': 'projects',
  'salle-des-methodes': 'methods',
  belvedere: 'contact',
};

interface LibraryHeaderBarProps {
  onFocusEntrance: () => void;
}

export function LibraryHeaderBar({ onFocusEntrance }: LibraryHeaderBarProps) {
  const dossierOpen = useLibraryStore((s) => s.dossierOpen);
  const dossierTab = useLibraryStore((s) => s.dossierTab);
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
            onFocusEntrance();
          }}
          aria-label="Revenir devant l’entrée de la bibliothèque — Loïc AKANDA"
        >
          <span className="lib-header__monogram" aria-hidden="true">
            LA
          </span>
          <span className="lib-header__brand-copy">
            <span className="lib-header__brand-name">
              {PROFILE_IDENTITY.fullName}
            </span>
            <span className="lib-header__brand-sub">THE INFINITE LIBRARY</span>
          </span>
        </button>
      </div>

      <nav
        className="lib-header__spaces"
        aria-label="Plan des six espaces de la bibliothèque"
      >
        {LIBRARY_SPACES.map((space) => {
          const mappedTab = SPACE_TO_TAB[space.slug] ?? 'overview';
          const isCurrent =
            space.index === 0
              ? !dossierOpen
              : dossierOpen && dossierTab === mappedTab;

          return (
            <button
              key={space.slug}
              type="button"
              className={`lib-header__space-btn ${
                isCurrent ? 'is-active' : ''
              } ${!space.prototypeReady ? 'is-catalogue-preview' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
              onClick={() => {
                if (space.index === 0) {
                  closeDossier();
                  onFocusEntrance();
                } else {
                  openDossier(mappedTab);
                }
              }}
              title={
                space.index === 0
                  ? `${space.code} · ${space.title} (Séquence 3D active)`
                  : `${space.code} · ${space.title} — Consulter l’aperçu éditorial vérifié`
              }
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
        >
          {dossierOpen ? 'Fermer le catalogue' : 'Catalogue & Projets'}
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
