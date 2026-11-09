import { useEffect } from 'react';
import { PROFILE_IDENTITY } from '../../data/portfolioData';
import {
  ROOMS_3D,
  WORLD_STATIONS_3D,
  getStationById,
  getStationsForRoom,
} from '../data/worldStations';
import { useLibraryStore } from '../state/useLibraryStore';

export function SpatialWalkHUD() {
  const activeRoomIndex = useLibraryStore((s) => s.activeRoomIndex);
  const inspectedStationId = useLibraryStore((s) => s.inspectedStationId);
  const hoveredStationLabel = useLibraryStore((s) => s.hoveredStationLabel);
  const guidedTourPlaying = useLibraryStore((s) => s.guidedTourPlaying);
  const toggleGuidedTour = useLibraryStore((s) => s.toggleGuidedTour);
  const dossierOpen = useLibraryStore((s) => s.dossierOpen);
  const projectVisualIndex = useLibraryStore((s) => s.projectVisualIndex);

  const walkToRoom = useLibraryStore((s) => s.walkToRoom);
  const inspectStation = useLibraryStore((s) => s.inspectStation);
  const cycleProjectVisual = useLibraryStore((s) => s.cycleProjectVisual);

  // Guided Auto-Tour stepping cleanly across the 24 3D stations when toggled
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

  return (
    <div className="pure-hud" aria-live="polite">
      {/* Screen-reader main landmark heading (zero visual clutter) */}
      <h1 id="walk-hero-title" className="sr-only">
        {PROFILE_IDENTITY.fullName}
      </h1>

      {/* Subtle single-word pill ONLY while hovering a 3D object */}
      {hoveredStationLabel && !station && (
        <div className="pure-hud__hover-chip" role="status">
          <span className="pure-hud__hover-dot" aria-hidden="true" />
          <span>{hoveredStationLabel}</span>
        </div>
      )}

      {/* Slide-over Monochrome Carbon & White Card ONLY when a 3D element is clicked */}
      {station && (
        <aside
          role="region"
          className="pure-inspector"
          data-scrollable-panel="true"
          aria-label={`Inspection 3D : ${station.title}`}
        >
          <div className="pure-inspector__header">
            <div className="pure-inspector__nav">
              <button
                type="button"
                className="pure-inspector__arrow"
                onClick={() => stepStation(-1)}
                aria-label="Station 3D précédente"
                title="Station précédente"
              >
                ←
              </button>
              <span className="pure-inspector__count">
                {currentStationGlobalIdx + 1} / {WORLD_STATIONS_3D.length}
              </span>
              <button
                type="button"
                className="pure-inspector__arrow"
                onClick={() => stepStation(1)}
                aria-label="Station 3D suivante"
                title="Station suivante"
              >
                →
              </button>
            </div>

            <button
              type="button"
              className="pure-inspector__close"
              onClick={() => inspectStation(null)}
              aria-label="Fermer et continuer la marche"
            >
              ✕
            </button>
          </div>

          <div className="pure-inspector__body">
            <p className="pure-inspector__meta">
              {station.code} · {station.badge}
            </p>
            <h2 className="pure-inspector__title">{station.title}</h2>
            <p className="pure-inspector__subtitle">{station.subtitle}</p>

            {/* A. IDENTITY */}
            {station.kind === 'identity' && (
              <div className="pure-inspector__stack">
                <p>{PROFILE_IDENTITY.about.personalPresentation}</p>
                <p>{PROFILE_IDENTITY.about.personalBridge}</p>
                <div className="pure-inspector__card">
                  <h3>{PROFILE_IDENTITY.about.professionalOrientationTitle}</h3>
                  <p>{PROFILE_IDENTITY.about.professionalOrientationText}</p>
                </div>
                <div className="pure-inspector__tags">
                  {PROFILE_IDENTITY.about.qualities.map((q) => (
                    <span key={q} className="pure-inspector__tag">
                      {q}
                    </span>
                  ))}
                </div>
                <div className="pure-inspector__actions">
                  <a
                    href={PROFILE_IDENTITY.cvUrl}
                    download={PROFILE_IDENTITY.cvDownloadName}
                    className="pure-btn pure-btn--primary"
                  >
                    Télécharger le CV (PDF)
                  </a>
                  <button
                    type="button"
                    className="pure-btn pure-btn--secondary"
                    onClick={() => walkToRoom(1)}
                  >
                    Continuer →
                  </button>
                </div>
              </div>
            )}

            {/* B. MILESTONE + INTERNSHIP */}
            {station.kind === 'milestone' && station.milestone && (
              <div className="pure-inspector__stack">
                <p>{station.milestone.summary}</p>
                <ul className="pure-inspector__list">
                  {station.milestone.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>

                {station.internship && (
                  <div className="pure-inspector__card">
                    <h3>
                      {station.internship.role} ({station.internship.duration})
                    </h3>
                    <ul className="pure-inspector__list">
                      {station.internship.missions.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                    <p className="pure-inspector__tools">
                      <strong>Outils :</strong>{' '}
                      {station.internship.toolsUsed.join(' · ')}
                    </p>
                  </div>
                )}

                {station.milestone.toolsOrContext && (
                  <div className="pure-inspector__tags">
                    {station.milestone.toolsOrContext.map((t) => (
                      <span key={t} className="pure-inspector__tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* C. SKILL */}
            {station.kind === 'skill' && station.skill && (
              <div className="pure-inspector__stack">
                <p>{station.skill.summary}</p>
                <div className="pure-inspector__card">
                  <h3>Socle académique (INP-HB)</h3>
                  <ul className="pure-inspector__list">
                    {station.skill.academicFoundations.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div className="pure-inspector__card">
                  <h3>Mise en pratique</h3>
                  <ul className="pure-inspector__list">
                    {station.skill.practicalExperience.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="pure-inspector__tags">
                  {station.skill.toolsContext.map((tool) => (
                    <span key={tool} className="pure-inspector__tag">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* D. PROJECT */}
            {station.kind === 'project' && station.project && (
              <div className="pure-inspector__stack">
                {(() => {
                  const proj = station.project;
                  const vIdx =
                    (projectVisualIndex[proj.id] ?? 0) % proj.visuals.length;
                  const activeVisual = proj.visuals[vIdx];
                  return (
                    <>
                      <figure className="pure-inspector__figure">
                        <img
                          src={activeVisual.src}
                          alt={activeVisual.alt}
                          loading="lazy"
                        />
                        <figcaption>{activeVisual.caption}</figcaption>
                        {proj.visuals.length > 1 && (
                          <div className="pure-inspector__switcher">
                            <button
                              type="button"
                              className="pure-inspector__arrow"
                              onClick={() =>
                                cycleProjectVisual(
                                  proj.id,
                                  proj.visuals.length,
                                  -1
                                )
                              }
                              aria-label="Vue précédente"
                            >
                              ←
                            </button>
                            <span>
                              {vIdx + 1} / {proj.visuals.length}
                            </span>
                            <button
                              type="button"
                              className="pure-inspector__arrow"
                              onClick={() =>
                                cycleProjectVisual(
                                  proj.id,
                                  proj.visuals.length,
                                  1
                                )
                              }
                              aria-label="Vue suivante"
                            >
                              →
                            </button>
                          </div>
                        )}
                      </figure>

                      <p>{proj.oneLinePitch}</p>

                      <div className="pure-inspector__card">
                        <h3>Contexte &amp; Problématique</h3>
                        <p>{proj.context}</p>
                        <p>{proj.problem}</p>
                      </div>

                      <div className="pure-inspector__card">
                        <h3>Contribution &amp; Fonctionnalités</h3>
                        <p>{proj.personalContribution}</p>
                        <ul className="pure-inspector__list">
                          {proj.verifiedFeatures.map((f) => (
                            <li key={f}>{f}</li>
                          ))}
                        </ul>
                      </div>

                      {proj.operationalNote && (
                        <div className="pure-inspector__note">
                          <strong>Fonctionnement réel :</strong>{' '}
                          {proj.operationalNote}
                        </div>
                      )}

                      <div className="pure-inspector__tags">
                        {proj.technologies.map((t) => (
                          <span key={t.label} className="pure-inspector__tag">
                            {t.label}
                          </span>
                        ))}
                      </div>

                      <div className="pure-inspector__actions">
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pure-btn pure-btn--primary"
                        >
                          Ouvrir {proj.name} ↗
                        </a>
                        {proj.repoUrl && (
                          <a
                            href={proj.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pure-btn pure-btn--secondary"
                          >
                            GitHub ↗
                          </a>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* E. METHOD STEP */}
            {station.kind === 'method' && station.methodStep && (
              <div className="pure-inspector__stack">
                <p>{station.methodStep.objective}</p>
                <div className="pure-inspector__card">
                  <h3>Actions &amp; Décisions</h3>
                  <ul className="pure-inspector__list">
                    {station.methodStep.actions.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div className="pure-inspector__note">
                  <strong>
                    Application ({station.methodStep.realExample.projectOrContext}) :
                  </strong>{' '}
                  {station.methodStep.realExample.illustration}
                </div>
              </div>
            )}

            {/* F. CONTACT */}
            {station.kind === 'contact' && (
              <div className="pure-inspector__stack">
                <p>{PROFILE_IDENTITY.contacts.lead}</p>
                <div className="pure-inspector__card">
                  <h3>Coordonnées directes</h3>
                  <ul className="pure-inspector__list">
                    <li>
                      <strong>Email :</strong>{' '}
                      <a href={`mailto:${PROFILE_IDENTITY.contacts.email}`}>
                        {PROFILE_IDENTITY.contacts.email}
                      </a>
                    </li>
                    <li>
                      <strong>Téléphone :</strong>{' '}
                      <a href="tel:+2250501604473">
                        {PROFILE_IDENTITY.contacts.phonePrimary}
                      </a>{' '}
                      / {PROFILE_IDENTITY.contacts.phoneSecondary}
                    </li>
                    <li>
                      <strong>LinkedIn :</strong>{' '}
                      <a
                        href={PROFILE_IDENTITY.contacts.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {PROFILE_IDENTITY.contacts.linkedinLabel} ↗
                      </a>
                    </li>
                    <li>
                      <strong>GitHub :</strong>{' '}
                      <a
                        href="https://github.com/loichermanna-art"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        github.com/loichermanna-art ↗
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="pure-inspector__actions">
                  <a
                    href={`mailto:${PROFILE_IDENTITY.contacts.email}`}
                    className="pure-btn pure-btn--primary"
                  >
                    Envoyer un email
                  </a>
                  <a
                    href={PROFILE_IDENTITY.cvUrl}
                    download={PROFILE_IDENTITY.cvDownloadName}
                    className="pure-btn pure-btn--secondary"
                  >
                    Télécharger le CV
                  </a>
                </div>
              </div>
            )}
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
