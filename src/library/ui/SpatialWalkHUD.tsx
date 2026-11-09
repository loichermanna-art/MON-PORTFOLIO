import { useEffect, useRef, useState } from 'react';
import { PROFILE_IDENTITY } from '../../data/portfolioData';
import {
  ROOMS_3D,
  WORLD_STATIONS_3D,
  getStationById,
  getStationsForRoom,
} from '../data/worldStations';
import { libraryMotionState, useLibraryStore } from '../state/useLibraryStore';

/**
 * Live 60Hz Architectural Temple Minimap (Zero React re-renders during movement)
 */
function TempleMinimap({
  activeRoomIndex,
  inspectedStationId,
  onSelectRoom,
  onSelectStation,
}: {
  activeRoomIndex: number;
  inspectedStationId: string | null;
  onSelectRoom: (idx: number) => void;
  onSelectStation: (id: string) => void;
}) {
  const playerGroupRef = useRef<SVGGElement>(null);

  const toSvgX = (wx: number) => 42 + (wx / 8.2) * 32;
  const toSvgY = (wz: number) => 8 + ((14 - wz) / 124) * 160;

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (playerGroupRef.current && !libraryMotionState.isTabHidden) {
        const sx = toSvgX(libraryMotionState.camX);
        const sy = toSvgY(libraryMotionState.camZ);
        const deg = (-libraryMotionState.yaw * 180) / Math.PI;
        playerGroupRef.current.setAttribute(
          'transform',
          `translate(${sx.toFixed(1)} ${sy.toFixed(1)}) rotate(${deg.toFixed(1)})`
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const roomBands = [
    { idx: 0, z0: 14.0, z1: -1.2, w: 46, label: '01' },
    { idx: 1, z0: -1.2, z1: -25.0, w: 44, label: '02' },
    { idx: 2, z0: -25.0, z1: -50.0, w: 62, label: '03' },
    { idx: 3, z0: -50.0, z1: -80.0, w: 66, label: '04' },
    { idx: 4, z0: -80.0, z1: -96.0, w: 56, label: '05' },
    { idx: 5, z0: -96.0, z1: -109.5, w: 60, label: '06' },
  ];

  return (
    <div
      className="walk-hud__minimap"
      role="region"
      aria-label="Plan architectural du Temple 3D"
    >
      <div className="walk-hud__minimap-head">
        <span>PLAN DU TEMPLE</span>
        <span>6 SALLES</span>
      </div>
      <svg
        viewBox="0 0 84 176"
        className="walk-hud__minimap-svg"
        aria-hidden="true"
      >
        <line
          x1="42"
          y1="10"
          x2="42"
          y2="168"
          stroke="rgba(212, 178, 119, 0.28)"
          strokeWidth="1"
          strokeDasharray="2 2"
        />

        {roomBands.map((b) => {
          const yTop = toSvgY(b.z0);
          const yBot = toSvgY(b.z1);
          const h = Math.max(8, yBot - yTop - 1.4);
          const isCurrent = activeRoomIndex === b.idx;
          return (
            <g
              key={`map-room-${b.idx}`}
              onClick={() => onSelectRoom(b.idx)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={42 - b.w * 0.5}
                y={yTop}
                width={b.w}
                height={h}
                rx="2.5"
                fill={
                  isCurrent
                    ? 'rgba(23, 68, 119, 0.58)'
                    : 'rgba(16, 39, 71, 0.34)'
                }
                stroke={
                  isCurrent
                    ? 'rgba(118, 169, 232, 0.9)'
                    : 'rgba(212, 178, 119, 0.32)'
                }
                strokeWidth={isCurrent ? '1.2' : '0.7'}
              />
              <text
                x={42 - b.w * 0.5 + 4}
                y={yTop + 8.5}
                fill={isCurrent ? '#FFFFFF' : '#9ab4d4'}
                fontSize="6.2"
                fontFamily="monospace"
              >
                {b.label}
              </text>
            </g>
          );
        })}

        {WORLD_STATIONS_3D.map((st) => {
          const cx = toSvgX(st.position[0]);
          const cy = toSvgY(st.position[2]);
          const isSel = inspectedStationId === st.id;
          return (
            <circle
              key={`map-st-${st.id}`}
              cx={cx}
              cy={cy}
              r={isSel ? 2.9 : st.kind === 'project' ? 2.3 : 1.75}
              fill={
                isSel
                  ? '#76A9E8'
                  : st.kind === 'project'
                    ? '#f0cf92'
                    : '#d4b277'
              }
              stroke="#071426"
              strokeWidth="0.6"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectStation(st.id);
              }}
            />
          );
        })}

        <g ref={playerGroupRef} transform="translate(42 12)">
          <path
            d="M 0 0 L -9 -16 A 18 18 0 0 1 9 -16 Z"
            fill="rgba(118, 169, 232, 0.28)"
          />
          <circle
            cx="0"
            cy="0"
            r="3.2"
            fill="#FFFFFF"
            stroke="#174477"
            strokeWidth="1.2"
          />
        </g>
      </svg>
    </div>
  );
}

export function SpatialWalkHUD() {
  const activeRoomIndex = useLibraryStore((s) => s.activeRoomIndex);
  const inspectedStationId = useLibraryStore((s) => s.inspectedStationId);
  const hoveredStationLabel = useLibraryStore((s) => s.hoveredStationLabel);
  const hasStartedWalking = useLibraryStore((s) => s.hasStartedWalking);
  const guidedTourPlaying = useLibraryStore((s) => s.guidedTourPlaying);
  const toggleGuidedTour = useLibraryStore((s) => s.toggleGuidedTour);
  const dossierOpen = useLibraryStore((s) => s.dossierOpen);
  const projectVisualIndex = useLibraryStore((s) => s.projectVisualIndex);

  const walkToRoom = useLibraryStore((s) => s.walkToRoom);
  const inspectStation = useLibraryStore((s) => s.inspectStation);
  const cycleProjectVisual = useLibraryStore((s) => s.cycleProjectVisual);

  const [chapterBannerRoomIdx, setChapterBannerRoomIdx] = useState<
    number | null
  >(null);
  const prevRoomRef = useRef(activeRoomIndex);

  // Cinematic Sanctuary Arrival Banner when crossing into a new Sanctuary Hall
  useEffect(() => {
    if (prevRoomRef.current !== activeRoomIndex) {
      prevRoomRef.current = activeRoomIndex;
      if (hasStartedWalking) {
        setChapterBannerRoomIdx(activeRoomIndex);
        const timer = window.setTimeout(() => {
          setChapterBannerRoomIdx(null);
        }, 2800);
        return () => window.clearTimeout(timer);
      }
    }
  }, [activeRoomIndex, hasStartedWalking]);

  // Curated Guided Auto-Tour stepping smoothly across the 24 Temple Stations
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

  const currentRoom = ROOMS_3D[activeRoomIndex] ?? ROOMS_3D[0];
  const bannerRoom =
    chapterBannerRoomIdx !== null ? ROOMS_3D[chapterBannerRoomIdx] : null;
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

  const stopVirtualWalk = () => {
    libraryMotionState.virtualMoveForward = 0;
    libraryMotionState.virtualTurn = 0;
  };

  if (dossierOpen) return null;

  return (
    <div className="walk-hud-overlay" aria-live="polite">
      {/* 1. Floating 3D Raycast Hover Tooltip */}
      {hoveredStationLabel && (
        <div className="walk-hud__hover-pill" role="status">
          <span className="walk-hud__hover-dot" aria-hidden="true" />
          <span>{hoveredStationLabel}</span>
          <span className="walk-hud__hover-cta">Cliquer pour s’approcher</span>
        </div>
      )}

      {/* 2. Cinematic Sanctuary Arrival Banner */}
      {bannerRoom && !station && !hoveredStationLabel && (
        <div className="walk-hud__chapter-banner" aria-hidden="true">
          <span className="walk-hud__chapter-kicker">
            SANCTUAIRE {bannerRoom.code} · {bannerRoom.architecturalZone}
          </span>
          <strong className="walk-hud__chapter-name">{bannerRoom.title}</strong>
          <span className="walk-hud__chapter-sub">{bannerRoom.subtitle}</span>
        </div>
      )}

      {/* 3. Live 60Hz Interactive Temple Minimap (tucks away when side inspector opens) */}
      {!station && (
        <TempleMinimap
          activeRoomIndex={activeRoomIndex}
          inspectedStationId={inspectedStationId}
          onSelectRoom={walkToRoom}
          onSelectStation={inspectStation}
        />
      )}

      {/* 4. Welcome Card at Spawn (tucks cleanly once visitor starts walking) */}
      {!hasStartedWalking && !station ? (
        <section
          className="walk-hud__welcome-card"
          aria-labelledby="walk-hero-title"
        >
          <p className="walk-hud__eyebrow">
            MÉTROPOLE FINANCIÈRE &amp; SKYLINE 360° · CÔTE D’IVOIRE · INP-HB
          </p>
          <h1 id="walk-hero-title" className="walk-hud__title">
            {PROFILE_IDENTITY.fullName}
          </h1>
          <p className="walk-hud__subtitle">{PROFILE_IDENTITY.positioning}</p>
          <p className="walk-hud__lead">
            Explorez librement la <strong>Tour-Sanctuaire &amp; la Métropole 3D à 360°</strong>{' '}
            (clavier <code>ZQSD</code> / flèches, glisser pour regarder les
            gratte-ciel et ponts illuminés, clic au sol ou molette) ou lancez la{' '}
            <strong>Visite guidée</strong>.
          </p>

          <div className="walk-hud__welcome-actions">
            <button
              type="button"
              className="lib-btn lib-btn--primary"
              onClick={() => walkToRoom(1)}
            >
              Commencer le parcours 3D →
            </button>
            <button
              type="button"
              className="lib-btn lib-btn--secondary"
              onClick={toggleGuidedTour}
            >
              ▶ Visite guidée
            </button>
            <button
              type="button"
              className="lib-btn lib-btn--secondary"
              onClick={() => walkToRoom(3)}
            >
              Voir les 4 projets en 3D
            </button>
            <a
              href={PROFILE_IDENTITY.cvUrl}
              download={PROFILE_IDENTITY.cvDownloadName}
              className="lib-btn lib-btn--ghost"
            >
              Télécharger le CV (PDF)
            </a>
          </div>
        </section>
      ) : (
        /* Accessible compact room badge when walking */
        <div className="walk-hud__room-badge">
          <h1 className="sr-only">{PROFILE_IDENTITY.fullName}</h1>
          <span className="walk-hud__room-badge-code">
            SANCTUAIRE {currentRoom.code}/06
          </span>
          <span className="walk-hud__room-badge-title">
            {currentRoom.title}
          </span>
          <span className="walk-hud__room-badge-sub">
            {currentRoom.subtitle}
          </span>
        </div>
      )}

      {/* 5. Side-Docked Spatial Inspector when approaching any of the 24 3D Stations */}
      {station && (
        <aside
          role="region"
          className="walk-hud__inspector"
          data-scrollable-panel="true"
          aria-label={`Inspection 3D : ${station.title}`}
        >
          <div className="walk-hud__inspector-topbar">
            <div className="walk-hud__inspector-step-nav">
              <button
                type="button"
                className="walk-hud__mini-btn"
                onClick={() => stepStation(-1)}
                title="Marcher vers la station 3D précédente"
              >
                ← Précédent
              </button>
              <span className="walk-hud__inspector-counter">
                {currentStationGlobalIdx + 1} / {WORLD_STATIONS_3D.length}
              </span>
              <button
                type="button"
                className="walk-hud__mini-btn"
                onClick={() => stepStation(1)}
                title="Marcher vers la station 3D suivante"
              >
                Suivant →
              </button>
            </div>

            <button
              type="button"
              className="walk-hud__close-btn"
              onClick={() => inspectStation(null)}
            >
              ✕ Continuer la marche
            </button>
          </div>

          <div className="walk-hud__inspector-body">
            <p className="walk-hud__inspector-code">
              {station.code} · {station.badge}
            </p>
            <h2 className="walk-hud__inspector-title">{station.title}</h2>
            <p className="walk-hud__inspector-sub">{station.subtitle}</p>

            {/* A. IDENTITY STATION */}
            {station.kind === 'identity' && (
              <div className="walk-hud__inspector-stack">
                <p>{PROFILE_IDENTITY.about.personalPresentation}</p>
                <p>{PROFILE_IDENTITY.about.personalBridge}</p>
                <div className="walk-hud__info-box">
                  <h3>{PROFILE_IDENTITY.about.professionalOrientationTitle}</h3>
                  <p>{PROFILE_IDENTITY.about.professionalOrientationText}</p>
                </div>
                <div className="walk-hud__tags">
                  {PROFILE_IDENTITY.about.qualities.map((q) => (
                    <span key={q} className="walk-hud__tag">
                      {q}
                    </span>
                  ))}
                </div>
                <div className="walk-hud__inspector-actions">
                  <a
                    href={PROFILE_IDENTITY.cvUrl}
                    download={PROFILE_IDENTITY.cvDownloadName}
                    className="lib-btn lib-btn--primary"
                  >
                    Télécharger le CV officiel (PDF)
                  </a>
                  <button
                    type="button"
                    className="lib-btn lib-btn--secondary"
                    onClick={() => walkToRoom(1)}
                  >
                    Avancer vers Salle 02 →
                  </button>
                </div>
              </div>
            )}

            {/* B. TIMELINE MILESTONE + INTERNSHIP STATION */}
            {station.kind === 'milestone' && station.milestone && (
              <div className="walk-hud__inspector-stack">
                <p>{station.milestone.summary}</p>
                <ul className="walk-hud__list">
                  {station.milestone.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>

                {station.internship && (
                  <div className="walk-hud__info-box">
                    <h3>
                      Détail du stage ({station.internship.duration}) —{' '}
                      {station.internship.role}
                    </h3>
                    <ul className="walk-hud__list">
                      {station.internship.missions.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                    <p className="walk-hud__tools-line">
                      <strong>Outils utilisés :</strong>{' '}
                      {station.internship.toolsUsed.join(' · ')}
                    </p>
                  </div>
                )}

                {station.milestone.toolsOrContext && (
                  <div className="walk-hud__tags">
                    {station.milestone.toolsOrContext.map((t) => (
                      <span key={t} className="walk-hud__tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* C. SKILL COLLECTION STATION */}
            {station.kind === 'skill' && station.skill && (
              <div className="walk-hud__inspector-stack">
                <p>{station.skill.summary}</p>
                <div className="walk-hud__info-box">
                  <h3>Socle académique (INP-HB)</h3>
                  <ul className="walk-hud__list">
                    {station.skill.academicFoundations.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div className="walk-hud__info-box">
                  <h3>Mise en pratique réelle</h3>
                  <ul className="walk-hud__list">
                    {station.skill.practicalExperience.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="walk-hud__tags">
                  {station.skill.toolsContext.map((tool) => (
                    <span key={tool} className="walk-hud__tag">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* D. PROJECT EXHIBITION STATION */}
            {station.kind === 'project' && station.project && (
              <div className="walk-hud__inspector-stack">
                {(() => {
                  const proj = station.project;
                  const vIdx =
                    (projectVisualIndex[proj.id] ?? 0) % proj.visuals.length;
                  const activeVisual = proj.visuals[vIdx];
                  return (
                    <>
                      <figure className="walk-hud__project-figure">
                        <img
                          src={activeVisual.src}
                          alt={activeVisual.alt}
                          loading="lazy"
                        />
                        <figcaption>{activeVisual.caption}</figcaption>
                        {proj.visuals.length > 1 && (
                          <div className="walk-hud__visual-switcher">
                            <button
                              type="button"
                              className="walk-hud__mini-btn"
                              onClick={() =>
                                cycleProjectVisual(
                                  proj.id,
                                  proj.visuals.length,
                                  -1
                                )
                              }
                            >
                              ◀ Vue préc. (écran 3D 2K)
                            </button>
                            <span>
                              {vIdx + 1} / {proj.visuals.length}
                            </span>
                            <button
                              type="button"
                              className="walk-hud__mini-btn"
                              onClick={() =>
                                cycleProjectVisual(
                                  proj.id,
                                  proj.visuals.length,
                                  1
                                )
                              }
                            >
                              Vue suiv. ▶
                            </button>
                          </div>
                        )}
                      </figure>

                      <p>{proj.oneLinePitch}</p>

                      <div className="walk-hud__info-box">
                        <h3>Contexte &amp; Problématique</h3>
                        <p>{proj.context}</p>
                        <p>{proj.problem}</p>
                      </div>

                      <div className="walk-hud__info-box">
                        <h3>Contribution &amp; Fonctionnalités vérifiées</h3>
                        <p>{proj.personalContribution}</p>
                        <ul className="walk-hud__list">
                          {proj.verifiedFeatures.map((f) => (
                            <li key={f}>{f}</li>
                          ))}
                        </ul>
                      </div>

                      {proj.operationalNote && (
                        <div className="walk-hud__note-box">
                          <strong>Fonctionnement réel vérifié :</strong>{' '}
                          {proj.operationalNote}
                        </div>
                      )}

                      <div className="walk-hud__tags">
                        {proj.technologies.map((t) => (
                          <span key={t.label} className="walk-hud__tag">
                            {t.label}
                          </span>
                        ))}
                      </div>

                      <div className="walk-hud__inspector-actions">
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lib-btn lib-btn--primary"
                        >
                          Ouvrir {proj.name} en direct ↗
                        </a>
                        {proj.repoUrl && (
                          <a
                            href={proj.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lib-btn lib-btn--ghost"
                          >
                            Code GitHub ↗
                          </a>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* E. STRATEGY & METHOD STEP STATION */}
            {station.kind === 'method' && station.methodStep && (
              <div className="walk-hud__inspector-stack">
                <p>{station.methodStep.objective}</p>
                <div className="walk-hud__info-box">
                  <h3>Actions &amp; Décisions</h3>
                  <ul className="walk-hud__list">
                    {station.methodStep.actions.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div className="walk-hud__note-box">
                  <strong>
                    Application réelle ({station.methodStep.realExample.projectOrContext}) :
                  </strong>{' '}
                  {station.methodStep.realExample.illustration}
                </div>
              </div>
            )}

            {/* F. BELVEDERE CONTACT STATION */}
            {station.kind === 'contact' && (
              <div className="walk-hud__inspector-stack">
                <p>{PROFILE_IDENTITY.contacts.lead}</p>
                <div className="walk-hud__info-box">
                  <h3>Coordonnées directes vérifiées</h3>
                  <ul className="walk-hud__list">
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

                <div className="walk-hud__inspector-actions">
                  <a
                    href={`mailto:${PROFILE_IDENTITY.contacts.email}`}
                    className="lib-btn lib-btn--primary"
                  >
                    Envoyer un email
                  </a>
                  <a
                    href={PROFILE_IDENTITY.cvUrl}
                    download={PROFILE_IDENTITY.cvDownloadName}
                    className="lib-btn lib-btn--secondary"
                  >
                    Télécharger le CV (PDF)
                  </a>
                  <button
                    type="button"
                    className="lib-btn lib-btn--ghost"
                    onClick={() => walkToRoom(0)}
                  >
                    Revenir à l’Entrée (Salle 01)
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* 6. Bottom Guided Tour + Contextual Room Station Ribbon + Free-Walk Control Dock */}
      <div
        className="walk-hud__bottom-dock"
        role="region"
        aria-label="Contrôles de déplacement 3D et progression par salle"
      >
        {/* Contextual Sanctuary Station Ribbon (Chronological Timeline in Salle 02, Skills in Salle 03, Projects in Salle 04, Steps in Salle 05) */}
        {roomStations.length > 1 && (
          <div
            className="walk-hud__station-strip"
            aria-label={`Stations de la salle ${currentRoom.title}`}
          >
            {roomStations.map((st, idx) => {
              const isSel = inspectedStationId === st.id;
              const chipLabel = st.milestone
                ? `${idx + 1}. ${st.milestone.period}`
                : st.project
                  ? st.project.name
                  : st.methodStep
                    ? `${st.methodStep.step}. ${st.methodStep.title}`
                    : st.title;
              return (
                <button
                  key={st.id}
                  type="button"
                  className={`walk-hud__station-chip ${isSel ? 'is-selected' : ''}`}
                  onClick={() => inspectStation(st.id)}
                  title={`${st.badge} — ${st.title}`}
                >
                  <span className="walk-hud__station-dot" aria-hidden="true" />
                  <span>{chipLabel}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="walk-hud__tour-bar">
          <button
            type="button"
            className="walk-hud__step-btn"
            disabled={activeRoomIndex <= 0}
            onClick={() => walkToRoom(Math.max(0, activeRoomIndex - 1))}
          >
            ← Salle préc.
          </button>

          <div
            className="walk-hud__room-dots"
            role="group"
            aria-label="Accès direct aux 6 salles"
          >
            {ROOMS_3D.map((r) => (
              <button
                key={r.slug}
                type="button"
                className={`walk-hud__room-pill ${
                  activeRoomIndex === r.index ? 'is-active' : ''
                }`}
                onClick={() => walkToRoom(r.index)}
                title={`${r.code} · ${r.title}`}
              >
                <span>{r.code}</span>
                <span className="walk-hud__room-pill-name">{r.title}</span>
              </button>
            ))}
          </div>

          {roomStations.length > 0 && (
            <button
              type="button"
              className="walk-hud__inspect-room-btn"
              onClick={() => inspectStation(roomStations[0].id)}
            >
              Inspecter ({roomStations.length})
            </button>
          )}

          <button
            type="button"
            className="walk-hud__step-btn walk-hud__step-btn--next"
            disabled={activeRoomIndex >= ROOMS_3D.length - 1}
            onClick={() =>
              walkToRoom(Math.min(ROOMS_3D.length - 1, activeRoomIndex + 1))
            }
          >
            Salle suiv. →
          </button>
        </div>

        {/* Tactile Walk Pad + Key Legend */}
        <div className="walk-hud__controls-strip">
          <div
            className="walk-hud__dpad"
            role="group"
            aria-label="Commandes de marche 3D"
          >
            <button
              type="button"
              className="walk-hud__pad-btn"
              aria-label="Tourner à gauche"
              onPointerDown={() => {
                useLibraryStore.getState().stopGuidedTour();
                libraryMotionState.virtualTurn = 1;
              }}
              onPointerUp={stopVirtualWalk}
              onPointerLeave={stopVirtualWalk}
              onPointerCancel={stopVirtualWalk}
            >
              ↺
            </button>
            <button
              type="button"
              className="walk-hud__pad-btn walk-hud__pad-btn--fwd"
              aria-label="Avancer dans l’espace 3D"
              onPointerDown={() => {
                useLibraryStore.getState().stopGuidedTour();
                libraryMotionState.virtualMoveForward = 1;
              }}
              onPointerUp={stopVirtualWalk}
              onPointerLeave={stopVirtualWalk}
              onPointerCancel={stopVirtualWalk}
            >
              ▲ Avancer
            </button>
            <button
              type="button"
              className="walk-hud__pad-btn"
              aria-label="Reculer"
              onPointerDown={() => {
                useLibraryStore.getState().stopGuidedTour();
                libraryMotionState.virtualMoveForward = -1;
              }}
              onPointerUp={stopVirtualWalk}
              onPointerLeave={stopVirtualWalk}
              onPointerCancel={stopVirtualWalk}
            >
              ▼
            </button>
            <button
              type="button"
              className="walk-hud__pad-btn"
              aria-label="Tourner à droite"
              onPointerDown={() => {
                useLibraryStore.getState().stopGuidedTour();
                libraryMotionState.virtualTurn = -1;
              }}
              onPointerUp={stopVirtualWalk}
              onPointerLeave={stopVirtualWalk}
              onPointerCancel={stopVirtualWalk}
            >
              ↻
            </button>
          </div>

          <p className="walk-hud__legend">
            <span>
              <strong>ZQSD / Flèches</strong> marcher
            </span>
            <span>·</span>
            <span>
              <strong>Glisser</strong> regarder 360°
            </span>
            <span>·</span>
            <span>
              <strong>Clic au marbre / Molette</strong> avancer
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
