import { useEffect, useMemo, useRef, useState } from 'react';
import {
  PROFESSIONAL_INTERNSHIPS,
  PROFILE_IDENTITY,
  SPATIAL_TIMELINE_MILESTONES,
} from '../data/portfolioData';
import {
  motionStore,
  selectAboutPillar,
  setHoveredAboutPillar,
  subscribeAboutPillar,
} from '../motion/motionStore';
import { useSectionReveal } from '../motion/useSectionReveal';

interface AboutSceneSectionProps {
  reducedMotion?: boolean;
}

/**
 * SCÈNE 02 — PROFIL & PARCOURS
 * Organisée en 4 parties complémentaires :
 * A. Présentation personnelle
 * B. Parcours académique & ligne temporelle spatiale reliée aux 6 stèles 3D
 * C. Expériences professionnelles (Drone Groupe CI — 3 mois & IACG — 2 mois)
 * D. Orientation professionnelle (Audit financier, Analyse financière, Comptabilité & Conseil)
 */
export function AboutSceneSection({ reducedMotion = false }: AboutSceneSectionProps) {
  const [selectedMilestoneIdx, setSelectedMilestoneIdx] = useState<number>(
    motionStore.selectedAboutPillar
  );
  const [litRatio, setLitRatio] = useState<number>(0.4);
  const scrubRef = useRef<HTMLParagraphElement | null>(null);
  const { ref, inView } = useSectionReveal<HTMLDivElement>();

  useEffect(() => {
    return subscribeAboutPillar((selected) => {
      setSelectedMilestoneIdx(selected);
    });
  }, []);

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;
    const onScroll = () => {
      const el = scrubRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const start = vh * 0.88;
      const end = vh * 0.3;
      const raw = (start - rect.top) / Math.max(1, start - end);
      setLitRatio(Math.max(0.25, Math.min(1, raw)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reducedMotion]);

  const introWords = useMemo(
    () => PROFILE_IDENTITY.about.personalPresentation.split(' '),
    []
  );
  const activeMilestone =
    SPATIAL_TIMELINE_MILESTONES[selectedMilestoneIdx] ?? SPATIAL_TIMELINE_MILESTONES[0];

  return (
    <section id="about" aria-labelledby="about-heading" className="scene-band">
      <div
        ref={ref}
        data-inview={inView ? 'true' : 'false'}
        className="scene-inner reveal-block editorial-interactive"
      >
        <span className="section-kicker">02 · Profil &amp; Parcours</span>
        <h2 id="about-heading" className="section-heading">
          {PROFILE_IDENTITY.about.heading}
        </h2>

        {/* PARTIES A & D : Présentation personnelle + Orientation professionnelle */}
        <div className="parcours-intro-band">
          <div>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.14em',
                color: 'var(--azure-400)',
                marginBottom: '0.5rem',
              }}
            >
              A · PRÉSENTATION PERSONNELLE
            </span>
            <p
              ref={scrubRef}
              className="section-lead"
              style={{ marginBottom: '0.95rem', fontWeight: 500 }}
            >
              {introWords.map((word, idx) => {
                const threshold = idx / introWords.length;
                const isLit = reducedMotion || litRatio >= threshold;
                return (
                  <span
                    key={`${word}-${idx}`}
                    className="zenith-scrub-word"
                    style={{
                      color: isLit ? 'var(--white)' : 'rgba(169, 188, 214, 0.45)',
                    }}
                  >
                    {word}
                    {idx < introWords.length - 1 ? ' ' : ''}
                  </span>
                );
              })}
            </p>
            <p className="section-lead">{PROFILE_IDENTITY.about.personalBridge}</p>
          </div>

          <div className="arch-stele">
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.14em',
                color: 'var(--azure-400)',
                marginBottom: '0.45rem',
              }}
            >
              D · ORIENTATION PROFESSIONNELLE
            </span>
            <h3 style={{ fontSize: '1.12rem', marginBottom: '0.55rem' }}>
              {PROFILE_IDENTITY.about.professionalOrientationTitle}
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--slate-700)',
                marginBottom: '0.95rem',
              }}
            >
              {PROFILE_IDENTITY.about.professionalOrientationText}
            </p>
            <div className="tech-tag-list">
              {PROFILE_IDENTITY.languages.map((lang) => (
                <span key={lang.language} className="tech-tag">
                  {lang.language} : {lang.level}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* PARTIE B : Ligne temporelle spatiale (Parcours académique, stages & responsabilité associative) */}
        <div>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.14em',
              color: 'var(--azure-400)',
              marginBottom: '0.75rem',
            }}
          >
            B · PARCOURS CHRONOLOGIQUE SPATIAL (2020 → AUJOURD’HUI) — SÉLECTIONNER UNE ÉTAPE
          </span>

          <div
            className="spatial-timeline-rail"
            role="tablist"
            aria-label="Étapes chronologiques du parcours académique et professionnel"
          >
            {SPATIAL_TIMELINE_MILESTONES.map((milestone, idx) => {
              const isSelected = idx === selectedMilestoneIdx;
              return (
                <button
                  key={milestone.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className="timeline-node-btn tabular"
                  onClick={() => selectAboutPillar(idx)}
                  onMouseEnter={() => setHoveredAboutPillar(idx)}
                  onMouseLeave={() => setHoveredAboutPillar(-1)}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      color: isSelected ? 'var(--azure-400)' : 'var(--ice-300)',
                      marginBottom: '0.28rem',
                    }}
                  >
                    {milestone.order} · {milestone.period}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      lineHeight: 1.25,
                    }}
                  >
                    {milestone.title}
                  </div>
                </button>
              );
            })}
          </div>

          <div
            className="arch-stele"
            role="tabpanel"
            aria-label={`Détail de l'étape ${activeMilestone.title}`}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: '0.75rem',
                marginBottom: '0.55rem',
              }}
            >
              <span
                className="tabular"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  color: 'var(--azure-400)',
                  fontWeight: 600,
                }}
              >
                ÉTAPE {activeMilestone.order} / 06 · {activeMilestone.category.toUpperCase()} · {activeMilestone.period}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  color: 'var(--ice-300)',
                }}
              >
                {activeMilestone.organization}
              </span>
            </div>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
              {activeMilestone.title}
            </h3>

            <p style={{ color: 'var(--slate-700)', marginBottom: '0.85rem', maxWidth: '68ch' }}>
              {activeMilestone.summary}
            </p>

            <ul
              style={{
                margin: '0 0 0.85rem',
                paddingLeft: '1.15rem',
                color: 'var(--ice-100)',
                fontSize: '0.9rem',
                display: 'grid',
                gap: '0.3rem',
              }}
            >
              {activeMilestone.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>

            {activeMilestone.toolsOrContext && (
              <div className="tech-tag-list">
                {activeMilestone.toolsOrContext.map((tag) => (
                  <span key={tag} className="tech-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PARTIE C : Expériences professionnelles détaillées (6 champs vérifiés par stage) */}
        <div style={{ marginTop: '2.25rem' }}>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.14em',
              color: 'var(--azure-400)',
              marginBottom: '0.75rem',
            }}
          >
            C · EXPÉRIENCES EN CABINET ET EN ENTREPRISE (STAGES VÉRIFIÉS)
          </span>

          <div className="internships-dual-grid">
            {PROFESSIONAL_INTERNSHIPS.map((exp, idx) => (
              <article
                key={exp.id}
                className="arch-stele"
                onMouseEnter={() => setHoveredAboutPillar(idx === 0 ? 3 : 2)}
                onMouseLeave={() => setHoveredAboutPillar(-1)}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: '0.5rem',
                    marginBottom: '0.4rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--azure-400)',
                      fontWeight: 600,
                    }}
                  >
                    {exp.period} · {exp.duration}
                  </span>
                  <span className="tech-tag">{exp.role}</span>
                </div>

                <h3 style={{ fontSize: '1.22rem', marginBottom: '0.2rem' }}>
                  {exp.organization}
                </h3>
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--ice-300)',
                    marginBottom: '0.9rem',
                  }}
                >
                  {exp.organizationType}
                </p>

                <div style={{ marginBottom: '0.85rem' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      color: 'var(--azure-400)',
                      marginBottom: '0.3rem',
                    }}
                  >
                    MISSIONS RÉALISÉES
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '1.1rem',
                      fontSize: '0.88rem',
                      color: 'var(--ice-100)',
                      display: 'grid',
                      gap: '0.25rem',
                    }}
                  >
                    {exp.missions.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: '0.85rem' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      color: 'var(--azure-400)',
                      marginBottom: '0.3rem',
                    }}
                  >
                    APPRENTISSAGES CLÉS
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '1.1rem',
                      fontSize: '0.86rem',
                      color: 'var(--slate-700)',
                      display: 'grid',
                      gap: '0.22rem',
                    }}
                  >
                    {exp.learnings.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </div>

                <div className="tech-tag-list">
                  {exp.toolsUsed.map((tool) => (
                    <span key={tool} className="tech-tag">
                      {tool}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
