import { PROFILE_IDENTITY } from '../../data/portfolioData';
import { useLibraryStore } from '../state/useLibraryStore';

const MOOD_TITLES: Record<'twilight' | 'night' | 'day', string> = {
  twilight: 'Ambiance : Platine (cliquer pour Nuit)',
  night: 'Ambiance : Nuit Carbone (cliquer pour Jour)',
  day: 'Ambiance : Blanc Jour (cliquer pour Platine)',
};

export function LibraryHeaderBar() {
  const walkToRoom = useLibraryStore((s) => s.walkToRoom);
  const atmosphereMood = useLibraryStore((s) => s.atmosphereMood);
  const cycleAtmosphereMood = useLibraryStore((s) => s.cycleAtmosphereMood);
  const dossierOpen = useLibraryStore((s) => s.dossierOpen);
  const openDossier = useLibraryStore((s) => s.openDossier);
  const closeDossier = useLibraryStore((s) => s.closeDossier);
  const reducedMotion = useLibraryStore((s) => s.reducedMotion);
  const toggleManualReducedMotion = useLibraryStore(
    (s) => s.toggleManualReducedMotion
  );

  return (
    <header className="pure-topbar" role="banner">
      {/* Top-Left: Only "Loïc AKANDA" */}
      <button
        type="button"
        className="pure-topbar__brand"
        onClick={() => {
          closeDossier();
          walkToRoom(0);
        }}
        aria-label="Loïc AKANDA — Revenir à l’entrée (01)"
      >
        <span className="pure-topbar__monogram" aria-hidden="true">
          LA
        </span>
        <span className="pure-topbar__name">{PROFILE_IDENTITY.fullName}</span>
      </button>

      {/* Top-Right: Ultra-compact icons + "CV" */}
      <div className="pure-topbar__actions">
        <button
          type="button"
          className="pure-topbar__icon-btn"
          onClick={cycleAtmosphereMood}
          aria-label={MOOD_TITLES[atmosphereMood]}
          title={MOOD_TITLES[atmosphereMood]}
        >
          ◐
        </button>

        <button
          type="button"
          className="pure-topbar__icon-btn"
          onClick={toggleManualReducedMotion}
          aria-pressed={reducedMotion}
          aria-label={
            reducedMotion ? 'Mouvement : réduit' : 'Mouvement : fluide'
          }
          title={
            reducedMotion ? 'Mouvement réduit activé' : 'Mouvement fluide activé'
          }
        >
          {reducedMotion ? '◌' : '◎'}
        </button>

        <button
          type="button"
          className="pure-topbar__icon-btn"
          onClick={() =>
            dossierOpen ? closeDossier() : openDossier('projects')
          }
          aria-expanded={dossierOpen}
          aria-label={dossierOpen ? 'Retour vue 3D' : 'Mode Lecture'}
          title={dossierOpen ? 'Retour vue 3D' : 'Mode Lecture (Catalogue)'}
        >
          {dossierOpen ? '✕' : '≡'}
        </button>

        <a
          href={PROFILE_IDENTITY.cvUrl}
          download={PROFILE_IDENTITY.cvDownloadName}
          className="pure-topbar__cv"
          aria-label="Télécharger le CV PDF de Loïc AKANDA"
        >
          CV
        </a>
      </div>
    </header>
  );
}
