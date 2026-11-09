import { useEffect, useRef, useState } from 'react';
import {
  LIBRARY_COLLECTIONS,
  LIBRARY_SPACES,
  PROCESS_STEPS,
  PROFESSIONAL_INTERNSHIPS,
  PROFILE_IDENTITY,
  SELECTED_PROJECTS,
  SPATIAL_TIMELINE_MILESTONES,
} from '../../data/portfolioData';
import {
  useLibraryStore,
  type DossierTab,
} from '../state/useLibraryStore';

const TABS: Array<{ id: DossierTab; code: string; label: string }> = [
  { id: 'overview', code: '01', label: 'Architecture & Identité' },
  { id: 'archives', code: '02', label: 'Les Archives (Parcours)' },
  { id: 'collections', code: '03', label: 'Les Rayonnages (6 Compétences)' },
  { id: 'projects', code: '04', label: 'La Collection Privée (4 Projets)' },
  { id: 'methods', code: '05', label: 'La Salle des Méthodes' },
  { id: 'contact', code: '06', label: 'Le Belvédère (Contact)' },
];

export function LibraryDossierModal() {
  const dossierOpen = useLibraryStore((s) => s.dossierOpen);
  const dossierTab = useLibraryStore((s) => s.dossierTab);
  const selectedProjectId = useLibraryStore((s) => s.selectedProjectId);
  const selectedCollectionId = useLibraryStore((s) => s.selectedCollectionId);
  const closeDossier = useLibraryStore((s) => s.closeDossier);
  const setDossierTab = useLibraryStore((s) => s.setDossierTab);
  const setSelectedProjectId = useLibraryStore((s) => s.setSelectedProjectId);
  const setSelectedCollectionId = useLibraryStore(
    (s) => s.setSelectedCollectionId
  );

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [visualIndices, setVisualIndices] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!dossierOpen) return;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDossier();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dossierOpen, closeDossier]);

  if (!dossierOpen) return null;

  const activeCollection =
    LIBRARY_COLLECTIONS.find((c) => c.id === selectedCollectionId) ??
    LIBRARY_COLLECTIONS[0];

  const activeProject =
    SELECTED_PROJECTS.find((p) => p.id === selectedProjectId) ??
    SELECTED_PROJECTS[0];

  const currentImgIdx = visualIndices[activeProject.id] ?? 0;
  const activeVisual =
    activeProject.visuals[currentImgIdx] ?? activeProject.visuals[0];

  return (
    <div
      className="lib-dossier-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lib-dossier-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDossier();
      }}
    >
      <div className="lib-dossier">
        {/* Top Modal Header */}
        <div className="lib-dossier__top">
          <div>
            <p className="lib-dossier__eyebrow">
              CATALOGUE GÉNÉRAL DE LA BIBLIOTHÈQUE · DONNÉES VÉRIFIÉES
            </p>
            <h2 id="lib-dossier-title" className="lib-dossier__heading">
              {PROFILE_IDENTITY.fullName} — Dossier Éditorial & Études de Cas
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="lib-dossier__close"
            onClick={closeDossier}
          >
            <span>Retourner à la vue 3D</span>
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Navigation Tabs across the 6 Spaces */}
        <div className="lib-dossier__tabs" role="tablist">
          {TABS.map((t) => {
            const active = dossierTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`lib-dossier__tab ${active ? 'is-active' : ''}`}
                onClick={() => setDossierTab(t.id)}
              >
                <span className="lib-dossier__tab-code">{t.code}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Area */}
        <div className="lib-dossier__body">
          {/* TAB 01: OVERVIEW & ARCHITECTURAL PLAN */}
          {dossierTab === 'overview' && (
            <div className="lib-dossier__section">
              <div className="lib-dossier__grid-two">
                <div className="lib-dossier__panel">
                  <p className="lib-dossier__code">01 · IDENTITÉ & CAP</p>
                  <h3>{PROFILE_IDENTITY.about.heading}</h3>
                  <p>{PROFILE_IDENTITY.about.personalPresentation}</p>
                  <p>{PROFILE_IDENTITY.about.personalBridge}</p>
                  <p className="lib-dossier__muted">
                    {PROFILE_IDENTITY.about.professionalOrientationText}
                  </p>
                  <div className="lib-dossier__chips">
                    {PROFILE_IDENTITY.about.qualities.map((q) => (
                      <span key={q} className="lib-chip">
                        {q}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lib-dossier__panel">
                  <p className="lib-dossier__code">
                    PLAN ARCHITECTURAL — THE INFINITE LIBRARY
                  </p>
                  <h3>Un seul édifice continu en six espaces reliés</h3>
                  <ul className="lib-space-plan-list">
                    {LIBRARY_SPACES.map((sp) => (
                      <li key={sp.slug} className="lib-space-plan-item">
                        <span className="lib-space-plan-item__code">
                          {sp.code}
                        </span>
                        <div>
                          <strong>
                            {sp.title} — {sp.subtitle}
                          </strong>
                          <p>{sp.architecturalZone}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 02: ARCHIVES (PARCOURS & STAGES) */}
          {dossierTab === 'archives' && (
            <div className="lib-dossier__section">
              <div className="lib-dossier__grid-two">
                <div>
                  <p className="lib-dossier__code">
                    CHRONOLOGIE VÉRIFIÉE (2020 — PRÉSENT)
                  </p>
                  <div className="lib-timeline-list">
                    {SPATIAL_TIMELINE_MILESTONES.map((m) => (
                      <article key={m.id} className="lib-dossier__panel">
                        <div className="lib-dossier__meta-row">
                          <span className="lib-dossier__code">{m.period}</span>
                          <span className="lib-chip">{m.category}</span>
                        </div>
                        <h3>{m.title}</h3>
                        <p className="lib-dossier__org">{m.organization}</p>
                        <p>{m.summary}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="lib-dossier__code">
                    DOSSIERS DE STAGES EN CABINET & ENTREPRISE
                  </p>
                  <div className="lib-timeline-list">
                    {PROFESSIONAL_INTERNSHIPS.map((intern) => (
                      <article key={intern.id} className="lib-dossier__panel">
                        <div className="lib-dossier__meta-row">
                          <span className="lib-dossier__code">
                            {intern.period} ({intern.duration})
                          </span>
                        </div>
                        <h3>
                          {intern.organization} — {intern.role}
                        </h3>
                        <p className="lib-dossier__org">
                          {intern.organizationType}
                        </p>
                        <ul className="lib-bullet-list">
                          {intern.missions.map((ms) => (
                            <li key={ms}>{ms}</li>
                          ))}
                        </ul>
                        <div className="lib-dossier__chips">
                          {intern.toolsUsed.map((tool) => (
                            <span key={tool} className="lib-chip">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 03: RAYONNAGES (6 SKILL COLLECTIONS) */}
          {dossierTab === 'collections' && (
            <div className="lib-dossier__section">
              <div className="lib-collections-layout">
                <div
                  className="lib-collections-spine-nav"
                  role="listbox"
                  aria-label="Six collections de compétences"
                >
                  {LIBRARY_COLLECTIONS.map((col) => {
                    const selected = col.id === activeCollection.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        className={`lib-spine-btn ${
                          selected ? 'is-selected' : ''
                        }`}
                        onClick={() => setSelectedCollectionId(col.id)}
                      >
                        <span className="lib-spine-btn__call">
                          {col.callNumber}
                        </span>
                        <span className="lib-spine-btn__title">
                          {col.title}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <article className="lib-dossier__panel lib-collection-detail">
                  <p className="lib-dossier__code">
                    {activeCollection.callNumber}
                  </p>
                  <h3>{activeCollection.title}</h3>
                  <p>{activeCollection.summary}</p>

                  <div className="lib-dossier__grid-two">
                    <div>
                      <h4>Socle académique (INP-HB)</h4>
                      <ul className="lib-bullet-list">
                        {activeCollection.academicFoundations.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Mise en pratique réelle</h4>
                      <ul className="lib-bullet-list">
                        {activeCollection.practicalExperience.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <h4>Outils & environnement effectivement pratiqués</h4>
                  <div className="lib-dossier__chips">
                    {activeCollection.toolsContext.map((t) => (
                      <span key={t} className="lib-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          )}

          {/* TAB 04: LA COLLECTION PRIVÉE (4 REAL CASE STUDIES) */}
          {dossierTab === 'projects' && (
            <div className="lib-dossier__section">
              <div className="lib-project-selector">
                {SELECTED_PROJECTS.map((proj) => {
                  const selected = proj.id === activeProject.id;
                  return (
                    <button
                      key={proj.id}
                      type="button"
                      className={`lib-project-pill ${
                        selected ? 'is-selected' : ''
                      }`}
                      onClick={() => setSelectedProjectId(proj.id)}
                    >
                      <span className="lib-project-pill__idx">
                        {proj.index}
                      </span>
                      <span>{proj.name}</span>
                    </button>
                  );
                })}
              </div>

              <article className="lib-dossier__panel lib-case-study">
                <div className="lib-case-study__header">
                  <div>
                    <p className="lib-dossier__code">{activeProject.category}</p>
                    <h3>{activeProject.name}</h3>
                    <p className="lib-case-study__pitch">
                      {activeProject.oneLinePitch}
                    </p>
                  </div>
                  <div className="lib-case-study__links">
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lib-btn lib-btn--primary"
                    >
                      <span>Ouvrir le projet en ligne</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>

                {/* Authentic Visual Gallery */}
                {activeVisual && (
                  <div className="lib-case-study__gallery">
                    <div className="lib-case-study__frame">
                      <img
                        src={activeVisual.src}
                        alt={activeVisual.alt}
                        width={1200}
                        height={675}
                        loading="lazy"
                      />
                    </div>
                    <div className="lib-case-study__gallery-bar">
                      <p className="lib-case-study__caption">
                        <strong>{activeVisual.sourceLabel} :</strong>{' '}
                        {activeVisual.caption}
                      </p>
                      {activeProject.visuals.length > 1 && (
                        <div className="lib-case-study__thumbs">
                          {activeProject.visuals.map((v, i) => (
                            <button
                              key={v.src}
                              type="button"
                              className={`lib-thumb-btn ${
                                i === currentImgIdx ? 'is-active' : ''
                              }`}
                              onClick={() =>
                                setVisualIndices((prev) => ({
                                  ...prev,
                                  [activeProject.id]: i,
                                }))
                              }
                            >
                              Vue {i + 1}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeProject.operationalNote && (
                  <div className="lib-operational-note">
                    <strong>Fonctionnement réel vérifié :</strong>{' '}
                    {activeProject.operationalNote}
                  </div>
                )}

                <div className="lib-dossier__grid-two">
                  <div>
                    <h4>Contexte & Problème</h4>
                    <p>{activeProject.context}</p>
                    <p>{activeProject.problem}</p>

                    <h4>Objectif & Rôle réel</h4>
                    <p>{activeProject.objective}</p>
                    <p>{activeProject.personalContribution}</p>
                  </div>

                  <div>
                    <h4>Solution & Fonctionnalités développées</h4>
                    <p>{activeProject.solution}</p>
                    <ul className="lib-bullet-list">
                      {activeProject.verifiedFeatures.map((feat) => (
                        <li key={feat}>{feat}</li>
                      ))}
                    </ul>

                    <h4>Technologies & État actuel</h4>
                    <div className="lib-dossier__chips">
                      {activeProject.technologies.map((tech) => (
                        <span key={tech.label} className="lib-chip">
                          {tech.label}
                        </span>
                      ))}
                    </div>
                    <p className="lib-dossier__muted">
                      {activeProject.currentState}
                    </p>
                  </div>
                </div>
              </article>
            </div>
          )}

          {/* TAB 05: SALLE DES MÉTHODES (6 STEPS) */}
          {dossierTab === 'methods' && (
            <div className="lib-dossier__section">
              <div className="lib-methods-grid">
                {PROCESS_STEPS.map((st) => (
                  <article key={st.step} className="lib-dossier__panel">
                    <p className="lib-dossier__code">ÉTAPE {st.step}</p>
                    <h3>{st.title}</h3>
                    <p>{st.objective}</p>
                    <p className="lib-dossier__muted">
                      <strong>Livrable :</strong> {st.deliverable}
                    </p>
                    <div className="lib-method-example">
                      <strong>Cas réel ({st.realExample.projectOrContext}) :</strong>{' '}
                      {st.realExample.illustration}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* TAB 06: BELVÉDÈRE (CONTACT) */}
          {dossierTab === 'contact' && (
            <div className="lib-dossier__section">
              <div className="lib-dossier__grid-two">
                <div className="lib-dossier__panel">
                  <p className="lib-dossier__code">06 · LE BELVÉDÈRE · CONTACT</p>
                  <h3>{PROFILE_IDENTITY.contacts.heading}</h3>
                  <p>{PROFILE_IDENTITY.contacts.lead}</p>

                  <dl className="lib-contact-dl">
                    <div>
                      <dt>Email direct</dt>
                      <dd>
                        <a href={`mailto:${PROFILE_IDENTITY.contacts.email}`}>
                          {PROFILE_IDENTITY.contacts.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt>LinkedIn</dt>
                      <dd>
                        <a
                          href={PROFILE_IDENTITY.contacts.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {PROFILE_IDENTITY.contacts.linkedinLabel}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt>GitHub</dt>
                      <dd>
                        <a
                          href={PROFILE_IDENTITY.contacts.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {PROFILE_IDENTITY.contacts.githubHandle}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt>Téléphone</dt>
                      <dd>
                        {PROFILE_IDENTITY.contacts.phonePrimary} ·{' '}
                        {PROFILE_IDENTITY.contacts.phoneSecondary}
                      </dd>
                    </div>
                    <div>
                      <dt>Localisation</dt>
                      <dd>{PROFILE_IDENTITY.contacts.location}</dd>
                    </div>
                  </dl>
                </div>

                <div className="lib-dossier__panel lib-dossier__panel--cv">
                  <p className="lib-dossier__code">COLLABORATIONS & ÉCHANGES</p>
                  <h3>{PROFILE_IDENTITY.fullName} — Finance & Solutions Digitales</h3>
                  <p>{PROFILE_IDENTITY.contacts.lead}</p>
                  <div className="lib-folio-card__actions">
                    <a
                      href={`mailto:${PROFILE_IDENTITY.contacts.email}`}
                      className="lib-btn lib-btn--primary"
                    >
                      <span>Écrire un message</span>
                    </a>
                    <a
                      href={PROFILE_IDENTITY.contacts.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lib-btn lib-btn--secondary"
                    >
                      <span>LinkedIn ↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
