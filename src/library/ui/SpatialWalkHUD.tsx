import { useEffect } from 'react';
import { PROFILE_IDENTITY } from '../../data/portfolioData';
import {
  ROOMS_3D,
  WORLD_STATIONS_3D,
  getStationById,
  getStationsForRoom,
  type WorldStation3D,
} from '../data/worldStations';
import { useLibraryStore } from '../state/useLibraryStore';

function getSlideMeta(
  station: WorldStation3D,
  slideIndex: number
): {
  labels: [string, string, string];
  digest: string;
  pills?: readonly string[];
} {
  if (station.kind === 'identity') {
    const labels: [string, string, string] = ['Profil', 'Vision', 'Atouts'];
    if (slideIndex === 0) {
      return {
        labels,
        digest: PROFILE_IDENTITY.about.personalPresentation,
        pills: ['Audit & Contrôle', 'Analyse Financière', 'Outils Digitaux'],
      };
    }
    if (slideIndex === 1) {
      return {
        labels,
        digest: PROFILE_IDENTITY.about.professionalOrientationText,
      };
    }
    return {
      labels,
      digest: PROFILE_IDENTITY.about.personalBridge,
      pills: PROFILE_IDENTITY.about.qualities,
    };
  }

  if (station.kind === 'milestone' && station.milestone) {
    const m = station.milestone;
    const labels: [string, string, string] = ['Jalon', 'Missions', 'Outils'];
    if (slideIndex === 0) {
      return {
        labels,
        digest: m.summary,
        pills: [m.period, m.organization],
      };
    }
    if (slideIndex === 1) {
      const items = station.internship ? station.internship.missions : m.details;
      return {
        labels,
        digest: items.slice(0, 2).join(' · '),
        pills: station.internship?.toolsUsed,
      };
    }
    return {
      labels,
      digest: station.internship
        ? `${station.internship.role} (${station.internship.duration}) — ${station.internship.missions.join(' · ')}`
        : m.details.join(' · '),
      pills: station.internship?.toolsUsed ?? m.toolsOrContext,
    };
  }

  if (station.kind === 'skill' && station.skill) {
    const sk = station.skill;
    const labels: [string, string, string] = ['Domaine', 'Socle', 'Pratique'];
    if (slideIndex === 0) {
      return {
        labels,
        digest: sk.summary,
        pills: sk.toolsContext,
      };
    }
    if (slideIndex === 1) {
      return {
        labels,
        digest: sk.academicFoundations.slice(0, 3).join(' · '),
      };
    }
    return {
      labels,
      digest: sk.practicalExperience.slice(0, 2).join(' · '),
      pills: sk.toolsContext,
    };
  }

  if (station.kind === 'project' && station.project) {
    const p = station.project;
    const labels: [string, string, string] = ['Visuel', 'Analyse', 'Stack'];
    if (slideIndex === 0) {
      return {
        labels,
        digest: p.oneLinePitch,
      };
    }
    if (slideIndex === 1) {
      return {
        labels,
        digest: p.operationalNote
          ? `${p.personalContribution} — ${p.operationalNote}`
          : p.personalContribution,
      };
    }
    return {
      labels,
      digest: p.verifiedFeatures.slice(0, 2).join(' · '),
      pills: p.technologies.map((t) => t.label),
    };
  }

  if (station.kind === 'method' && station.methodStep) {
    const ms = station.methodStep;
    const labels: [string, string, string] = ['Étape', 'Actions', 'Cas réel'];
    if (slideIndex === 0) {
      return {
        labels,
        digest: ms.objective,
      };
    }
    if (slideIndex === 1) {
      return {
        labels,
        digest: ms.actions.join(' · '),
      };
    }
    return {
      labels,
      digest: `${ms.realExample.projectOrContext} : ${ms.realExample.illustration}`,
    };
  }

  // Contact
  const labels: [string, string, string] = ['Direct', 'Réseaux', 'Domaines'];
  if (slideIndex === 0) {
    return {
      labels,
      digest: `${PROFILE_IDENTITY.contacts.email} · ${PROFILE_IDENTITY.contacts.phonePrimary} / ${PROFILE_IDENTITY.contacts.phoneSecondary}`,
    };
  }
  if (slideIndex === 1) {
    return {
      labels,
      digest: `${PROFILE_IDENTITY.contacts.linkedinLabel} · github.com/loichermanna-art · INP-HB`,
    };
  }
  return {
    labels,
    digest: PROFILE_IDENTITY.contacts.lead,
    pills: ['Audit & Contrôle', 'Analyse Financière', 'Comptabilité', 'Digital'],
  };
}

export function SpatialWalkHUD() {
  const activeRoomIndex = useLibraryStore((s) => s.activeRoomIndex);
  const inspectedStationId = useLibraryStore((s) => s.inspectedStationId);
  const stationSlideIndex = useLibraryStore((s) => s.stationSlideIndex);
  const hoveredStationLabel = useLibraryStore((s) => s.hoveredStationLabel);
  const guidedTourPlaying = useLibraryStore((s) => s.guidedTourPlaying);
  const toggleGuidedTour = useLibraryStore((s) => s.toggleGuidedTour);
  const dossierOpen = useLibraryStore((s) => s.dossierOpen);
  const projectVisualIndex = useLibraryStore((s) => s.projectVisualIndex);

  const walkToRoom = useLibraryStore((s) => s.walkToRoom);
  const inspectStation = useLibraryStore((s) => s.inspectStation);
  const setStationSlideIndex = useLibraryStore((s) => s.setStationSlideIndex);
  const cycleProjectVisual = useLibraryStore((s) => s.cycleProjectVisual);

  // Guided Auto-Tour stepping cleanly across the 24 3D tableaux
  useEffect(() => {
    if (!guidedTourPlaying || dossierOpen) return;
    const interval = window.setInterval(() => {
      const st = useLibraryStore.getState();
      if (!st.guidedTourPlaying) return;
      const curIdx = st.inspectedStationId
        ? WORLD_STATIONS_3D.findIndex((s) => s.id === st.inspectedStationId)
        : -1;
      if (curIdx >= WORLD_STATIONS_3D.length - 1) {
        st.stopGuidedTour();
        return;
      }
      const nextStation = WORLD_STATIONS_3D[curIdx + 1];
      if (nextStation) {
        st.inspectStation(nextStation.id);
      }
    }, 6200);
    return () => window.clearInterval(interval);
  }, [guidedTourPlaying, dossierOpen]);

  // Keyboard shortcuts while focusing a 3D tableau (1/2/3 to switch slides, Escape to step back)
  useEffect(() => {
    if (!inspectedStationId || dossierOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1') setStationSlideIndex(0);
      else if (e.key === '2') setStationSlideIndex(1);
      else if (e.key === '3') setStationSlideIndex(2);
      else if (e.key === 'Escape') inspectStation(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [inspectedStationId, dossierOpen, setStationSlideIndex, inspectStation]);

  const roomStations = getStationsForRoom(activeRoomIndex);
  const station = getStationById(inspectedStationId);

  const currentStationGlobalIdx = station
    ? WORLD_STATIONS_3D.findIndex((s) => s.id === station.id)
    : -1;

  const stepStation = (dir: -1 | 1) => {
    if (currentStationGlobalIdx < 0) {
      const first = roomStations[0] ?? WORLD_STATIONS_3D[0];
      if (first) inspectStation(first.id);
      return;
    }
    const nextIdx =
      (currentStationGlobalIdx + dir + WORLD_STATIONS_3D.length) %
      WORLD_STATIONS_3D.length;
    inspectStation(WORLD_STATIONS_3D[nextIdx].id);
  };

  if (dossierOpen) return null;

  const slideMeta = station ? getSlideMeta(station, stationSlideIndex) : null;
  const activeProj = station?.project ?? null;
  const activeProjVisualIdx = activeProj
    ? (projectVisualIndex[activeProj.id] ?? 0) % activeProj.visuals.length
    : 0;
  const activeProjVisual = activeProj
    ? activeProj.visuals[activeProjVisualIdx]
    : null;

  return (
    <div className="pure-hud" aria-live="polite">
      {/* Screen-reader main landmark heading */}
      <h1 id="walk-hero-title" className="sr-only">
        {PROFILE_IDENTITY.fullName}
      </h1>

      {/* Subtle single-word pill ONLY while hovering a 3D tableau */}
      {hoveredStationLabel && !station && (
        <div className="pure-hud__hover-chip" role="status">
          <span className="pure-hud__hover-dot" aria-hidden="true" />
          <span>{hoveredStationLabel}</span>
        </div>
      )}

      {/* Ultra-Light Floating Bottom Focus Bar (Camera faces the 3D Tableau directly) */}
      {station && slideMeta && (
        <aside
          role="region"
          className="pure-focus-bar"
          aria-label={`Inspection 3D : ${station.title}`}
        >
          <div className="pure-focus-bar__top">
            <div className="pure-focus-bar__title-group">
              <button
                type="button"
                className="pure-focus-bar__arrow"
                onClick={() => stepStation(-1)}
                aria-label="Tableau précédent"
                title="Tableau précédent"
              >
                ←
              </button>
              <button
                type="button"
                className="pure-focus-bar__arrow"
                onClick={() => stepStation(1)}
                aria-label="Tableau suivant"
                title="Tableau suivant"
              >
                →
              </button>
              <span className="pure-focus-bar__code">{station.code}</span>
              <h2 className="pure-focus-bar__title">{station.title}</h2>
            </div>

            <div className="pure-focus-bar__slides" role="tablist" aria-label="Vues du tableau">
              {slideMeta.labels.map((lbl, idx) => {
                const isSelected = stationSlideIndex === idx;
                return (
                  <button
                    key={lbl}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`pure-focus-bar__slide-btn ${isSelected ? 'is-active' : ''}`}
                    onClick={() => setStationSlideIndex(idx)}
                  >
                    0{idx + 1} · {lbl}
                  </button>
                );
              })}

              <button
                type="button"
                className="pure-focus-bar__close"
                onClick={() => inspectStation(null)}
                aria-label="Fermer et continuer la marche"
                title="Reculer (Échap)"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="pure-focus-bar__bottom">
            <p className="pure-focus-bar__digest">{slideMeta.digest}</p>

            {/* Accessible semantic visual reference for Project screens */}
            {activeProj && activeProjVisual && (
              <img
                src={activeProjVisual.src}
                alt={activeProjVisual.alt}
                className="sr-only"
              />
            )}

            <div className="pure-focus-bar__pills">
              {slideMeta.pills?.slice(0, 4).map((p) => (
                <span key={p} className="pure-focus-bar__pill">
                  {p}
                </span>
              ))}

              {activeProj && activeProj.visuals.length > 1 && (
                <button
                  type="button"
                  className="pure-focus-bar__action-btn"
                  onClick={() =>
                    cycleProjectVisual(
                      activeProj.id,
                      activeProj.visuals.length,
                      1
                    )
                  }
                  aria-label="Changer le visuel sur le tableau"
                >
                  Visuel {activeProjVisualIdx + 1}/{activeProj.visuals.length} ↻
                </button>
              )}

              {activeProj && (
                <a
                  href={activeProj.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pure-focus-bar__action-btn pure-focus-bar__action-btn--primary"
                >
                  Ouvrir {activeProj.name} ↗
                </a>
              )}

              {activeProj?.repoUrl && (
                <a
                  href={activeProj.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pure-focus-bar__action-btn"
                >
                  GitHub ↗
                </a>
              )}

              {station.kind === 'contact' && (
                <>
                  <a
                    href={`mailto:${PROFILE_IDENTITY.contacts.email}`}
                    className="pure-focus-bar__action-btn pure-focus-bar__action-btn--primary"
                  >
                    Email ↗
                  </a>
                  <a
                    href={PROFILE_IDENTITY.contacts.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pure-focus-bar__action-btn"
                  >
                    LinkedIn ↗
                  </a>
                  <a
                    href="https://github.com/loichermanna-art"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pure-focus-bar__action-btn"
                  >
                    GitHub ↗
                  </a>
                </>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* Bottom-Center Discreet 6-Number Capsule (01..06 + Play/Pause Auto-Tour) */}
      <nav
        className="pure-capsule"
        aria-label="Navigation spatiale dans les six salles du parcours 3D"
      >
        {ROOMS_3D.map((r) => {
          const isCurrent = activeRoomIndex === r.index;
          return (
            <button
              key={r.slug}
              type="button"
              className={`pure-capsule__dot ${isCurrent ? 'is-active' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={`${r.code} ${r.title}`}
              title={`${r.code} · ${r.title}`}
              onClick={() => walkToRoom(r.index)}
            >
              {r.code}
            </button>
          );
        })}

        <span className="pure-capsule__sep" aria-hidden="true" />

        <button
          type="button"
          className={`pure-capsule__tour ${guidedTourPlaying ? 'is-playing' : ''}`}
          onClick={toggleGuidedTour}
          aria-pressed={guidedTourPlaying}
          aria-label={
            guidedTourPlaying
              ? 'Mettre en pause la visite guidée'
              : 'Visite guidée automatique'
          }
          title={guidedTourPlaying ? 'Pause visite' : 'Visite guidée'}
        >
          {guidedTourPlaying ? '⏸' : '▶'}
        </button>
      </nav>
    </div>
  );
}
