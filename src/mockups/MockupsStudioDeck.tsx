import { useState } from 'react';
import {
  EXPERTISE_POLES,
  PROCESS_STEPS,
  PROFILE_IDENTITY,
  SCENE_MOCKUPS,
  SELECTED_PROJECTS,
} from '../data/portfolioData';
import './mockups.css';

interface MockupsStudioDeckProps {
  onBackToPrototype: () => void;
}

/** Fond géométral 3D spécifique à chaque zone de l'édifice pour visualiser la relation 3D / HTML */
function ArchitecturalBackdropSVG({ sceneId }: { sceneId: string }) {
  return (
    <svg
      className="mockup-3d-layer"
      viewBox="0 0 1440 720"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`stone-${sceneId}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FCFBF8" />
          <stop offset="55%" stopColor="#F5F2EB" />
          <stop offset="100%" stopColor="#E6E0D3" />
        </linearGradient>
        <linearGradient id={`sunbeam-${sceneId}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.68" />
          <stop offset="100%" stopColor="#EAE5DA" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="1440" height="720" fill={`url(#stone-${sceneId})`} />
      {/* Dallage perspectif commun */}
      <line x1="0" y1="590" x2="1440" y2="590" stroke="#141413" strokeOpacity="0.14" />
      <line x1="720" y1="310" x2="180" y2="720" stroke="#6E502F" strokeOpacity="0.22" />
      <line x1="720" y1="310" x2="1260" y2="720" stroke="#6E502F" strokeOpacity="0.22" />

      {sceneId === 'hero' && (
        <g>
          {/* Faisceau matinal oblique + Portique d'Équilibre à droite (cols 7-12) */}
          <polygon points="820,0 1320,0 1060,720 640,720" fill={`url(#sunbeam-${sceneId})`} />
          <rect x="860" y="92" width="380" height="498" fill="#EFEAE0" stroke="#141413" strokeOpacity="0.22" />
          <rect x="920" y="148" width="260" height="442" fill="#F7F4ED" stroke="#6E502F" strokeWidth="2" />
          <rect x="975" y="185" width="52" height="390" fill="#423325" fillOpacity="0.86" />
          <rect x="1073" y="185" width="52" height="390" fill="#423325" fillOpacity="0.86" />
          <line x1="940" y1="245" x2="1160" y2="245" stroke="#9E7C4E" strokeWidth="3" />
          <line x1="1050" y1="148" x2="1050" y2="380" stroke="#9E7C4E" strokeWidth="1.5" />
          <polygon points="1050,375 1060,392 1050,409 1040,392" fill="#6E502F" />
        </g>
      )}

      {sceneId === 'about' && (
        <g>
          {/* 11 Brise-soleil verticaux sur l'aile gauche (cols 1-6) */}
          {Array.from({ length: 9 }).map((_, idx) => {
            const x = 95 + idx * 62;
            return (
              <g key={idx}>
                <rect
                  x={x}
                  y={85 + idx * 8}
                  width="26"
                  height={495 - idx * 14}
                  fill="#EAE4D7"
                  stroke="#6E502F"
                  strokeOpacity="0.4"
                />
                <polygon
                  points={`${x + 26},${580 - idx * 6} ${x + 150},720 ${x + 95},720 ${x},580`}
                  fill="#FFFDF9"
                  fillOpacity="0.55"
                />
              </g>
            );
          })}
        </g>
      )}

      {sceneId === 'expertise' && (
        <g>
          {/* Cour symétrique des Deux Piliers : Strates pierre à gauche / Cadres bronze à droite */}
          <rect x="650" y="130" width="140" height="460" fill="none" stroke="#6E502F" strokeOpacity="0.45" />
          {[0, 1, 2, 3].map((s) => (
            <rect
              key={s}
              x="160"
              y={180 + s * 88}
              width="380"
              height="56"
              fill="#EAE4D7"
              stroke="#141413"
              strokeOpacity="0.18"
            />
          ))}
          {[0, 1, 2].map((f) => (
            <rect
              key={f}
              x={900 + f * 22}
              y={170 + f * 26}
              width="340"
              height="340"
              fill="none"
              stroke="#423325"
              strokeWidth="2"
              strokeOpacity="0.45"
            />
          ))}
        </g>
      )}

      {sceneId === 'projects' && (
        <g>
          {/* Salle des 3 Monolithes muséaux */}
          {[240, 720, 1200].map((cx, idx) => (
            <rect
              key={idx}
              x={cx - 140}
              y="95"
              width="280"
              height="495"
              fill="#EAE4D7"
              stroke="#6E502F"
              strokeOpacity="0.35"
            />
          ))}
        </g>
      )}

      {sceneId === 'process' && (
        <g>
          {/* Passerelle séquentielle de 6 dalles en porte-à-faux */}
          {[0, 1, 2, 3, 4, 5].map((step) => (
            <rect
              key={step}
              x={110 + step * 205}
              y={470 - step * 28}
              width="185"
              height="28"
              fill="#E5DFD2"
              stroke="#423325"
              strokeWidth="1.5"
            />
          ))}
        </g>
      )}

      {sceneId === 'contact' && (
        <g>
          {/* Belvédère ouvert : ligne d'horizon calme et garde-corps bronze */}
          <line x1="120" y1="440" x2="1320" y2="440" stroke="#423325" strokeWidth="2" />
          <circle cx="720" cy="250" r="145" fill="#FCFBF8" stroke="#6E502F" strokeOpacity="0.25" />
        </g>
      )}
    </svg>
  );
}

export function MockupsStudioDeck({ onBackToPrototype }: MockupsStudioDeckProps) {
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showGridAndZ, setShowGridAndZ] = useState<boolean>(true);

  return (
    <div className="mockups-page">
      <div className="arch-container">
        {/* En-tête de la planche Phase 4 */}
        <div className="mockups-toolbar">
          <div>
            <div className="scene-index-line tabular" style={{ marginBottom: '0.35rem' }}>
              <span className="scene-index-line__rule" aria-hidden="true" />
              <span>PHASE 4 — MAQUETTES ARCHITECTURALES &amp; ÉDITORIALES DÉTAILLÉES (01 → 06)</span>
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--step-3)',
                lineHeight: 1.08,
              }}
            >
              L’Atrium de Haute Précision — Planche complète avant généralisation Phase 7
            </h1>
          </div>

          <div className="mockups-toolbar__controls">
            <button
              type="button"
              className="mockup-toggle"
              aria-pressed={viewportMode === 'desktop'}
              onClick={() => setViewportMode('desktop')}
            >
              Desktop 1440px
            </button>
            <button
              type="button"
              className="mockup-toggle"
              aria-pressed={viewportMode === 'mobile'}
              onClick={() => setViewportMode('mobile')}
            >
              Mobile 390px
            </button>
            <button
              type="button"
              className="mockup-toggle"
              aria-pressed={showGridAndZ}
              onClick={() => setShowGridAndZ((v) => !v)}
            >
              {showGridAndZ ? 'Grille & Plans Z : ON' : 'Grille & Plans Z : OFF'}
            </button>
            <button type="button" className="btn-primary" onClick={onBackToPrototype}>
              Retour à l’expérience 3D complète
            </button>
          </div>
        </div>

        {/* Rendu séquentiel des 6 Maquettes détaillées */}
        {SCENE_MOCKUPS.map((spec) => (
          <article
            key={spec.id}
            id={`mockup-${spec.number}`}
            className="mockup-sheet"
            aria-labelledby={`mockup-title-${spec.number}`}
          >
            <div className="mockup-sheet__meta">
              <h2
                id={`mockup-title-${spec.number}`}
                className="tabular"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--step-2)' }}
              >
                Scène {spec.number} — {spec.codeName}
              </h2>
              <span
                className="tabular"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--step-m1)', color: 'var(--accent-bronze)' }}
              >
                {spec.architecturalSpace} · Alignement : {spec.alignment.toUpperCase()}
              </span>
            </div>

            <div
              className={`mockup-viewport ${
                viewportMode === 'mobile' ? 'mockup-viewport--mobile' : ''
              }`}
            >
              {/* Plan Z-3 & Z-2 : Scène 3D */}
              <ArchitecturalBackdropSVG sceneId={spec.id} />

              {/* Calque optionnel d'inspection Grille + Profondeur Z */}
              {showGridAndZ && (
                <>
                  <div className="mockup-grid-overlay" aria-hidden="true">
                    {Array.from({ length: viewportMode === 'mobile' ? 4 : 12 }).map((_, c) => (
                      <div key={c} className="mockup-grid-col" />
                    ))}
                  </div>
                  <div className="mockup-z-tag mockup-z-tag--3d">
                    PLAN Z-2 / Z-3 (3D) : {spec.depthLayers.z2Midground3D}
                  </div>
                  <div className="mockup-z-tag mockup-z-tag--html">
                    PLAN Z-1 (HTML) : {spec.depthLayers.z1ForegroundHTML}
                  </div>
                </>
              )}

              {/* Plan Z-1 : Composition HTML réelle propre à chacune des 6 scènes */}
              <div className="mockup-html-layer">
                {spec.id === 'hero' && (
                  <div className="mockup-card-editorial" style={{ gridColumn: '1 / span 7' }}>
                    <div className="scene-index-line tabular">
                      <span className="scene-index-line__rule" />
                      <span>01 · INTRODUCTION — INP-HB, CÔTE D’IVOIRE</span>
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: viewportMode === 'mobile' ? '2.5rem' : '4.1rem',
                        lineHeight: 0.96,
                        marginBottom: '0.75rem',
                      }}
                    >
                      {PROFILE_IDENTITY.fullName}
                    </div>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontStyle: 'italic',
                        fontSize: '1.35rem',
                        marginBottom: '0.85rem',
                      }}
                    >
                      {PROFILE_IDENTITY.valueProposition}
                    </p>
                    <p style={{ fontSize: '0.95rem', color: 'var(--ink-muted)', marginBottom: '1.25rem' }}>
                      {PROFILE_IDENTITY.heroSummary}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <span className="btn-primary">Découvrir les projets sélectionnés</span>
                      <span className="btn-secondary">Prendre contact</span>
                    </div>
                  </div>
                )}

                {spec.id === 'about' && (
                  <div className="mockup-card-editorial" style={{ gridColumn: '7 / span 6' }}>
                    <div className="scene-index-line tabular">
                      <span className="scene-index-line__rule" />
                      <span>02 · IDENTITÉ &amp; PARCOURS ACADÉMIQUE</span>
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2rem',
                        lineHeight: 1.1,
                        marginBottom: '0.75rem',
                      }}
                    >
                      Élève-ingénieur en finance à l’INP-HB, orienté vers l’impact concret.
                    </h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--ink-muted)', marginBottom: '1rem' }}>
                      {PROFILE_IDENTITY.aboutIntro}
                    </p>
                    <div style={{ display: 'grid', gap: '0.6rem', marginBottom: '0.85rem' }}>
                      {PROFILE_IDENTITY.workPhilosophy.map((p) => (
                        <div key={p.index} style={{ fontSize: '0.88rem' }}>
                          <strong className="tabular" style={{ color: 'var(--accent-bronze)' }}>
                            {p.index}.{' '}
                          </strong>
                          <strong>{p.title} — </strong>
                          <span style={{ color: 'var(--ink-muted)' }}>{p.detail}</span>
                        </div>
                      ))}
                    </div>
                    <span className="placeholder-tag">
                      {PROFILE_IDENTITY.institutionDetailPlaceholder}
                    </span>
                  </div>
                )}

                {spec.id === 'expertise' && (
                  <>
                    <div className="mockup-card-editorial" style={{ gridColumn: '1 / span 5' }}>
                      <div className="scene-index-line tabular">
                        <span>{EXPERTISE_POLES[0].poleIndex}</span>
                      </div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.7rem',
                          marginBottom: '0.85rem',
                        }}
                      >
                        {EXPERTISE_POLES[0].poleTitle}
                      </h3>
                      <div style={{ display: 'grid', gap: '0.65rem' }}>
                        {EXPERTISE_POLES[0].domains.map((d) => (
                          <div key={d.name}>
                            <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{d.name}</div>
                            <div style={{ fontSize: '0.84rem', color: 'var(--ink-muted)' }}>
                              {d.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mockup-card-editorial" style={{ gridColumn: '8 / span 5' }}>
                      <div className="scene-index-line tabular">
                        <span>{EXPERTISE_POLES[1].poleIndex}</span>
                      </div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.7rem',
                          marginBottom: '0.85rem',
                        }}
                      >
                        {EXPERTISE_POLES[1].poleTitle}
                      </h3>
                      <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {EXPERTISE_POLES[1].domains.map((d) => (
                          <div key={d.name}>
                            <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{d.name}</div>
                            <div style={{ fontSize: '0.84rem', color: 'var(--ink-muted)' }}>
                              {d.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {spec.id === 'projects' && (
                  <div className="project-monolith-grid">
                    {SELECTED_PROJECTS.map((project) => (
                      <div key={project.id} className="project-monolith-card">
                        <div
                          className="tabular"
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            color: 'var(--accent-bronze)',
                          }}
                        >
                          <span>STÈLE {project.index}</span>
                          <span>{project.category}</span>
                        </div>

                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem' }}>
                          {project.name}
                        </h3>

                        {/* Aperçu d'interface intégré au monolithe */}
                        <div className="project-ui-frame">
                          {project.uiPreviewType === 'ticketing-qr' && (
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                                BILLET QR CERTIFIÉ · RÉSERVATION
                              </div>
                              <div style={{ color: 'var(--ink-muted)' }}>
                                Attribution place · Export carte PNG HD intacte
                              </div>
                            </div>
                          )}
                          {project.uiPreviewType === 'skincare-commerce' && (
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                                VITRINE COMMERCIALE SKINCARE
                              </div>
                              <div style={{ color: 'var(--ink-muted)' }}>
                                Présentation soins · Parcours d’achat mobile &amp; web
                              </div>
                            </div>
                          )}
                          {project.uiPreviewType === 'club-platform' && (
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                                ESPACE CLUB ÉTUDES-CONSEILS
                              </div>
                              <div style={{ color: 'var(--ink-muted)' }}>
                                Structuration activités, projets &amp; initiatives
                              </div>
                            </div>
                          )}
                        </div>

                        <p style={{ fontSize: '0.86rem', color: 'var(--ink-muted)' }}>
                          <strong style={{ color: 'var(--ink)' }}>Problème : </strong>
                          {project.problem}
                        </p>
                        <p style={{ fontSize: '0.86rem', color: 'var(--ink-muted)' }}>
                          <strong style={{ color: 'var(--ink)' }}>Solution : </strong>
                          {project.solution}
                        </p>
                        <div style={{ fontSize: '0.82rem' }}>
                          <strong>Rôle : </strong>
                          {project.role}{' '}
                          {project.roleNote && (
                            <span className="placeholder-tag">{project.roleNote}</span>
                          )}
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: 'auto' }}>
                          {project.technologies.map((tech) => (
                            <span
                              key={tech.label}
                              className={tech.status === 'à confirmer' ? 'placeholder-tag' : ''}
                              style={
                                tech.status === 'vérifié'
                                  ? {
                                      fontFamily: 'var(--font-mono)',
                                      fontSize: '0.72rem',
                                      padding: '0.15rem 0.45rem',
                                      border: '1px solid var(--line-subtle)',
                                      background: 'var(--bg)',
                                    }
                                  : undefined
                              }
                            >
                              {tech.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {spec.id === 'process' && (
                  <div className="mockup-card-editorial" style={{ gridColumn: '1 / -1' }}>
                    <div className="scene-index-line tabular">
                      <span className="scene-index-line__rule" />
                      <span>05 · MÉTHODE SÉQUENTIELLE EN 6 PALIERS</span>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          viewportMode === 'mobile' ? '1fr' : 'repeat(3, minmax(0, 1fr))',
                        gap: '1rem',
                      }}
                    >
                      {PROCESS_STEPS.map((s) => (
                        <div
                          key={s.step}
                          style={{
                            padding: '0.9rem',
                            background: 'var(--bg)',
                            borderTop: '2px solid var(--accent)',
                          }}
                        >
                          <div
                            className="tabular"
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.75rem',
                              color: 'var(--accent-bronze)',
                            }}
                          >
                            ÉTAPE {s.step}
                          </div>
                          <div style={{ fontWeight: 600, margin: '0.2rem 0' }}>{s.title}</div>
                          <p style={{ fontSize: '0.84rem', color: 'var(--ink-muted)' }}>
                            {s.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {spec.id === 'contact' && (
                  <div
                    className="mockup-card-editorial"
                    style={{
                      gridColumn: '3 / span 8',
                      textAlign: 'center',
                      borderLeft: '1px solid var(--line-subtle)',
                      borderTop: '2px solid var(--accent)',
                    }}
                  >
                    <div className="scene-index-line tabular" style={{ justifyContent: 'center' }}>
                      <span>06 · LE BELVÉDÈRE — CONTACT DIRECT</span>
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2.35rem',
                        lineHeight: 1.06,
                        marginBottom: '0.75rem',
                      }}
                    >
                      Échangeons autour d’une opportunité en finance, d’un projet ou d’un produit
                      numérique.
                    </h3>
                    <p
                      style={{
                        marginInline: 'auto',
                        fontSize: '0.95rem',
                        color: 'var(--ink-muted)',
                        marginBottom: '1.25rem',
                      }}
                    >
                      Stages, collaborations exigeantes ou initiatives alliant rigueur d’analyse et
                      réalisation concrète.
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '0.75rem',
                      }}
                    >
                      <span className="placeholder-tag">E-mail : {PROFILE_IDENTITY.contacts.email}</span>
                      <span className="placeholder-tag">
                        LinkedIn : {PROFILE_IDENTITY.contacts.linkedin}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.78rem',
                          padding: '0.2rem 0.55rem',
                          border: '1px solid var(--line-strong)',
                        }}
                      >
                        GitHub : github.com/loichermanna-art (Vérifié)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fiche technique Storyboard + Caméra sous la maquette */}
            <div className="mockup-specs-bar">
              <div>
                <div className="mockup-specs-bar__title">Caméra Desktop &amp; Optique</div>
                <div className="tabular">
                  Pos {spec.cameraDesktop.pos} · Cible {spec.cameraDesktop.target} ·{' '}
                  {spec.cameraDesktop.fov}
                </div>
              </div>
              <div>
                <div className="mockup-specs-bar__title">Adaptation Mobile (390px)</div>
                <div>{spec.cameraMobile.adaptation}</div>
              </div>
              <div>
                <div className="mockup-specs-bar__title">Mouvement Autonome (Idle)</div>
                <div>{spec.autonomousMotion}</div>
              </div>
              <div>
                <div className="mockup-specs-bar__title">Chorégraphie Scroll</div>
                <div>{spec.scrollChoreography}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
