import { useCallback, useEffect, useRef, useState } from 'react';
import { ProjectArchitectureDiagram } from '../../components/projects/ProjectArchitectureDiagram';
import {
  EXPERTISE_DOMAINS,
  PROCESS_STEPS,
  PROFILE_IDENTITY,
  SELECTED_PROJECTS,
  type ProjectCaseStudy,
} from '../../data/portfolioData';
import { glideSound } from './soundEngine';

interface GlidePanelTheme {
  num: string;
  swatchName: string;
  editionLabel: string;
  wordmark: string;
  bg: string;
  fg: string;
  muted: string;
  accent: string;
  ctaBg: string;
  ctaFg: string;
  swatchHex: string;
  image: string;
  imageAlt: string;
}

const GLIDE_PANELS: readonly GlidePanelTheme[] = [
  {
    num: '01',
    swatchName: 'Noir',
    editionLabel: 'Édition Or Minuit · Identité',
    wordmark: 'AKANDA',
    bg: '#0B0C10',
    fg: '#F5F6F8',
    muted: '#B5BAC4',
    accent: '#D4AF37',
    ctaBg: '#D4AF37',
    ctaFg: '#0B0C10',
    swatchHex: '#1F222B',
    image: '/glide/glide-01-noir.jpg',
    imageAlt: 'Gyroscope sculptural noir mat et or champagne symbolisant la précision',
  },
  {
    num: '02',
    swatchName: 'Frost',
    editionLabel: 'Édition Argent Polaire · À propos',
    wordmark: 'VISION',
    bg: '#EAEFF4',
    fg: '#141922',
    muted: '#485262',
    accent: '#2B3B52',
    ctaBg: '#141922',
    ctaFg: '#FFFFFF',
    swatchHex: '#DCE4EC',
    image: '/glide/glide-02-frost.jpg',
    imageAlt: 'Anneau en aluminium brossé polaire et cristal optique givré',
  },
  {
    num: '03',
    swatchName: 'Moss',
    editionLabel: 'Édition Forêt & Bronze · Expertise',
    wordmark: 'RIGUEUR',
    bg: '#0C2117',
    fg: '#F2F6F3',
    muted: '#B5C7BD',
    accent: '#CE9460',
    ctaBg: '#CE9460',
    ctaFg: '#0C2117',
    swatchHex: '#1B4332',
    image: '/glide/glide-03-moss.jpg',
    imageAlt: 'Instrument d’équilibre en aluminium émeraude et bronze brossé',
  },
  {
    num: '04',
    swatchName: 'Cobalt',
    editionLabel: 'Édition Saphir & Ambre · LAURA HOUSE',
    wordmark: 'ARCHITECTURE',
    bg: '#09111E',
    fg: '#F4F7FB',
    muted: '#B2C0D4',
    accent: '#F59E0B',
    ctaBg: '#F59E0B',
    ctaFg: '#09111E',
    swatchHex: '#1D3557',
    image: '/glide/glide-04-cobalt.jpg',
    imageAlt: 'Cadre en titane bleu cobalt et lentille optique ambrée lumineuse',
  },
  {
    num: '05',
    swatchName: 'Pearl',
    editionLabel: 'Édition Perle & Champagne · SassySkin & EtuCo',
    wordmark: 'SOLUTIONS',
    bg: '#EFECE6',
    fg: '#1D1815',
    muted: '#574E47',
    accent: '#8C583A',
    ctaBg: '#1D1815',
    ctaFg: '#FFFFFF',
    swatchHex: '#E6DFD5',
    image: '/glide/glide-05-pearl.jpg',
    imageAlt: 'Sphères en céramique albâtre et aluminium champagne rosé en lévitation',
  },
  {
    num: '06',
    swatchName: 'Copper',
    editionLabel: 'Édition Obsidienne & Cuivre · Démarche & Contact',
    wordmark: 'IMPACT',
    bg: '#140F0B',
    fg: '#F7F3EE',
    muted: '#C6B9AC',
    accent: '#DE7E44',
    ctaBg: '#DE7E44',
    ctaFg: '#140F0B',
    swatchHex: '#B85D2B',
    image: '/glide/glide-06-copper.jpg',
    imageAlt: 'Sculpture annulaire en carbone mat et cuivre poli chaleureux',
  },
];

export function GlideApp() {
  const [panelIdx, setPanelIdx] = useState<number>(0);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });

  // États interactifs internes aux panneaux
  const [domainIdx, setDomainIdx] = useState<number>(0);
  const [pearlProjIdx, setPearlProjIdx] = useState<number>(0); // 0 -> SassySkin, 1 -> EtuCo
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [modalProject, setModalProject] = useState<ProjectCaseStudy | null>(null);
  const [copiedGithub, setCopiedGithub] = useState<boolean>(false);

  const wheelLockRef = useRef<number>(0);
  const touchStartY = useRef<number | null>(null);

  const theme = GLIDE_PANELS[panelIdx];
  const lauraProject = SELECTED_PROJECTS[0];
  const pearlProjects = [SELECTED_PROJECTS[1], SELECTED_PROJECTS[2]];
  const activePearlProject = pearlProjects[pearlProjIdx] ?? SELECTED_PROJECTS[1];
  const activeDomain = EXPERTISE_DOMAINS[domainIdx] ?? EXPERTISE_DOMAINS[0];
  const activeStep = PROCESS_STEPS[stepIdx] ?? PROCESS_STEPS[0];

  // Préchargement silencieux des sculptures studio
  useEffect(() => {
    GLIDE_PANELS.forEach((p) => {
      const img = new Image();
      img.src = p.image;
    });
  }, []);

  const goToPanel = useCallback(
    (target: number) => {
      const clamped = (target + GLIDE_PANELS.length) % GLIDE_PANELS.length;
      if (clamped === panelIdx) return;
      setPanelIdx(clamped);
      if (soundOn) {
        glideSound.playGlide(clamped);
      }
    },
    [panelIdx, soundOn]
  );

  // Navigation molette douce (Desktop) + Clavier
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (modalProject || window.innerWidth <= 900) return;
      if (Math.abs(e.deltaY) < 26) return;
      const now = performance.now();
      if (now - wheelLockRef.current < 820) return;
      wheelLockRef.current = now;
      if (e.deltaY > 0) {
        goToPanel(panelIdx + 1);
      } else {
        goToPanel(panelIdx - 1);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (modalProject) {
        if (e.key === 'Escape') setModalProject(null);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goToPanel(panelIdx + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goToPanel(panelIdx - 1);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, [goToPanel, modalProject, panelIdx]);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    glideSound.enabled = next;
    if (next) {
      glideSound.playGlide(panelIdx);
    }
  };

  const handlePointerTilt = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -ny * 12, ry: nx * 14 });
  };

  const handleCopyGithub = async () => {
    if (soundOn) glideSound.playTick();
    try {
      await navigator.clipboard?.writeText(PROFILE_IDENTITY.contacts.githubUrl);
      setCopiedGithub(true);
      window.setTimeout(() => setCopiedGithub(false), 2200);
    } catch {
      setCopiedGithub(false);
    }
  };

  return (
    <div
      className="glide-stage"
      style={{ backgroundColor: theme.bg, color: theme.fg }}
      onPointerMove={handlePointerTilt}
      onTouchStart={(e) => {
        touchStartY.current = e.touches[0]?.clientY ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartY.current === null || window.innerWidth <= 900) return;
        const dy = touchStartY.current - (e.changedTouches[0]?.clientY ?? touchStartY.current);
        touchStartY.current = null;
        if (Math.abs(dy) > 55) {
          goToPanel(dy > 0 ? panelIdx + 1 : panelIdx - 1);
        }
      }}
    >
      {/* Halo ambiant chromatique */}
      <div
        className="glide-ambient-glow"
        style={{ backgroundColor: theme.accent }}
        aria-hidden="true"
      />

      {/* Typographie géante cinétique façon MappleMappleMapple */}
      <div className="glide-giant-marquee" aria-hidden="true">
        <div className="glide-giant-marquee__track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={`${theme.wordmark}-${i}`} className="glide-giant-marquee__word">
              {theme.wordmark}
            </span>
          ))}
        </div>
      </div>

      {/* BARRE SUPÉRIEURE : Marque, Sélecteur Chromatique 01..06 & Bouton Son */}
      <header className="glide-topbar" role="banner">
        <button
          type="button"
          onClick={() => goToPanel(0)}
          className="glide-brand"
          style={{ background: 'transparent', border: 0, color: 'inherit', padding: 0 }}
        >
          <span>Loïc AKANDA</span>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: theme.accent,
            }}
          />
        </button>

        <div className="glide-swatches" role="tablist" aria-label="Sélection des chapitres chromatiques">
          {GLIDE_PANELS.map((p, idx) => (
            <button
              key={p.num}
              type="button"
              role="tab"
              aria-selected={idx === panelIdx}
              className="glide-swatch-btn glide-tabular"
              onClick={() => goToPanel(idx)}
            >
              <span
                className="glide-swatch-dot"
                style={{ backgroundColor: p.swatchHex }}
              />
              <span>
                {p.num} {p.swatchName}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="glide-sound-pill"
          aria-pressed={soundOn}
          onClick={toggleSound}
        >
          <span className="glide-eq" data-active={soundOn ? 'true' : 'false'} aria-hidden="true">
            <span style={{ height: '6px' }} />
            <span style={{ height: '11px' }} />
            <span style={{ height: '8px' }} />
          </span>
          <span>{soundOn ? 'Son Actif' : 'Son Coupé'}</span>
        </button>
      </header>

      {/* CORPS CENTRAL EN GLIDE */}
      <main className="glide-panel-grid" id="main">
        {/* COLONNE GAUCHE : Titre & Narration du chapitre */}
        <div key={`left-${theme.num}`} className="glide-slide-anim">
          <div className="glide-num-badge glide-tabular">
            {theme.num} / 06 — {theme.swatchName.toUpperCase()}
          </div>
          <div className="glide-subtitle" style={{ color: theme.accent }}>
            {theme.editionLabel}
          </div>

          {panelIdx === 0 && (
            <>
              <h1 className="glide-title">Loïc AKANDA</h1>
              <p style={{ fontSize: '1.05rem', color: theme.muted, maxWidth: '30ch', marginBottom: '1.35rem' }}>
                {PROFILE_IDENTITY.heroRole}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="glide-cta-btn"
                  style={{ backgroundColor: theme.ctaBg, color: theme.ctaFg }}
                  onClick={() => goToPanel(3)}
                >
                  <span>Explorer les projets</span>
                  <span aria-hidden="true">→</span>
                </button>
                <button
                  type="button"
                  className="glide-sub-pill"
                  onClick={() => goToPanel(5)}
                >
                  Me contacter
                </button>
              </div>
            </>
          )}

          {panelIdx === 1 && (
            <>
              <h1 className="glide-title">Double culture Finance &amp; Tech.</h1>
              <p style={{ fontSize: '0.98rem', color: theme.muted, maxWidth: '34ch' }}>
                {PROFILE_IDENTITY.aboutIntro}
              </p>
            </>
          )}

          {panelIdx === 2 && (
            <>
              <h1 className="glide-title">{activeDomain.title}</h1>
              <p style={{ fontSize: '0.96rem', color: theme.muted, maxWidth: '34ch', marginBottom: '1.1rem' }}>
                {activeDomain.summary}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {EXPERTISE_DOMAINS.map((d, i) => (
                  <button
                    key={d.id}
                    type="button"
                    className="glide-sub-pill"
                    style={
                      i === domainIdx
                        ? { backgroundColor: theme.ctaBg, color: theme.ctaFg, borderColor: theme.ctaBg }
                        : undefined
                    }
                    onClick={() => {
                      if (soundOn) glideSound.playTick();
                      setDomainIdx(i);
                    }}
                  >
                    {d.index} · {d.title.split('&')[0]?.trim()}
                  </button>
                ))}
              </div>
            </>
          )}

          {panelIdx === 3 && (
            <>
              <h1 className="glide-title">{lauraProject.name}</h1>
              <p style={{ fontSize: '0.96rem', color: theme.muted, maxWidth: '34ch', marginBottom: '1.25rem' }}>
                {lauraProject.tagline}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem' }}>
                <a
                  href={lauraProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glide-cta-btn"
                  style={{ backgroundColor: theme.ctaBg, color: theme.ctaFg }}
                >
                  <span>{lauraProject.liveUrlLabel}</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <button
                  type="button"
                  className="glide-sub-pill"
                  onClick={() => {
                    if (soundOn) glideSound.playTick();
                    setModalProject(lauraProject);
                  }}
                >
                  Schéma d’architecture
                </button>
              </div>
            </>
          )}

          {panelIdx === 4 && (
            <>
              <h1 className="glide-title">{activePearlProject.name}</h1>
              <p style={{ fontSize: '0.96rem', color: theme.muted, maxWidth: '34ch', marginBottom: '1.1rem' }}>
                {activePearlProject.tagline}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {pearlProjects.map((proj, i) => (
                  <button
                    key={proj.id}
                    type="button"
                    className="glide-sub-pill"
                    style={
                      i === pearlProjIdx
                        ? { backgroundColor: theme.ctaBg, color: theme.ctaFg, borderColor: theme.ctaBg }
                        : undefined
                    }
                    onClick={() => {
                      if (soundOn) glideSound.playTick();
                      setPearlProjIdx(i);
                    }}
                  >
                    0{i + 2} · {proj.name}
                  </button>
                ))}
                <button
                  type="button"
                  className="glide-sub-pill"
                  onClick={() => {
                    if (soundOn) glideSound.playTick();
                    setModalProject(activePearlProject);
                  }}
                >
                  Étude complète →
                </button>
              </div>
            </>
          )}

          {panelIdx === 5 && (
            <>
              <h1 className="glide-title">Méthode &amp; Contact.</h1>
              <p style={{ fontSize: '0.96rem', color: theme.muted, maxWidth: '34ch', marginBottom: '1.2rem' }}>
                {PROFILE_IDENTITY.contacts.lead}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                <a
                  href={PROFILE_IDENTITY.contacts.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glide-cta-btn"
                  style={{ backgroundColor: theme.ctaBg, color: theme.ctaFg }}
                >
                  <span>GitHub ({PROFILE_IDENTITY.contacts.githubHandle})</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <button
                  type="button"
                  className="glide-sub-pill"
                  onClick={handleCopyGithub}
                >
                  {copiedGithub ? 'Copié ✓' : 'Copier GitHub'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* COLONNE CENTRALE : Sculpture Studio en lévitation 3D */}
        <div className="glide-centerpiece-wrap">
          <img
            key={`img-${theme.num}`}
            src={theme.image}
            alt={theme.imageAlt}
            className="glide-centerpiece-img"
            style={{
              transform: `rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg)`,
            }}
          />
        </div>

        {/* COLONNE DROITE : Fiche Technique / Spécifications façon Mapple */}
        <div key={`right-${theme.num}`} className="glide-slide-anim">
          <div className="glide-spec-box">
            {panelIdx === 0 && (
              <>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: theme.accent }}>
                    SIGNATURE
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '1.05rem', marginTop: '0.2rem' }}>
                    {PROFILE_IDENTITY.signatureCanonical}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(128,128,128,0.2)', paddingTop: '0.75rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: theme.muted }}>
                    FORMATION D’EXCELLENCE
                  </div>
                  <div style={{ fontSize: '0.9rem', marginTop: '0.2rem' }}>
                    {PROFILE_IDENTITY.academicTitle} — {PROFILE_IDENTITY.institution}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(128,128,128,0.2)', paddingTop: '0.75rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: theme.muted }}>
                    NAVIGATION GLIDE &amp; SON
                  </div>
                  <div style={{ fontSize: '0.84rem', color: theme.muted, marginTop: '0.2rem' }}>
                    Utilisez la molette, les flèches clavier ou les pastilles chromatiques pour glisser entre les 6 chapitres.
                  </div>
                </div>
              </>
            )}

            {panelIdx === 1 && (
              <>
                {PROFILE_IDENTITY.workPhilosophy.map((p) => (
                  <div key={p.index}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: theme.accent }}>
                      {p.index} · {p.title.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '0.88rem', color: theme.muted, marginTop: '0.2rem' }}>
                      {p.detail}
                    </div>
                  </div>
                ))}
              </>
            )}

            {panelIdx === 2 && (
              <>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: theme.accent }}>
                    COMPÉTENCES OPÉRATIONNELLES ({activeDomain.index}/04)
                  </div>
                  <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.1rem', fontSize: '0.88rem', color: theme.fg, display: 'grid', gap: '0.35rem' }}>
                    {activeDomain.capabilities.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ borderTop: '1px solid rgba(128,128,128,0.2)', paddingTop: '0.75rem', fontSize: '0.8rem', color: theme.muted }}>
                  Socle : {activeDomain.academicOrProjectBasis}
                </div>
              </>
            )}

            {panelIdx === 3 && (
              <>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: theme.accent }}>
                    STACK TECHNIQUE VÉRIFIÉE
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.45rem' }}>
                    {lauraProject.technologies.map((t) => (
                      <span key={t.label} className="glide-sub-pill" style={{ fontSize: '0.72rem' }}>
                        {t.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(128,128,128,0.2)', paddingTop: '0.75rem', fontSize: '0.88rem', color: theme.muted }}>
                  {lauraProject.solution}
                </div>
              </>
            )}

            {panelIdx === 4 && (
              <>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: theme.accent }}>
                    ARCHITECTURE — {activePearlProject.name.toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.45rem' }}>
                    {activePearlProject.technologies.map((t) => (
                      <span key={t.label} className="glide-sub-pill" style={{ fontSize: '0.72rem' }}>
                        {t.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(128,128,128,0.2)', paddingTop: '0.75rem', fontSize: '0.88rem', color: theme.muted }}>
                  {activePearlProject.solution}
                </div>
              </>
            )}

            {panelIdx === 5 && (
              <>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: theme.accent }}>
                    DÉMARCHE EN 6 ÉTAPES — {activeStep.step} {activeStep.title.toUpperCase()}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: theme.muted, margin: '0.35rem 0 0.65rem' }}>
                    {activeStep.summary}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {PROCESS_STEPS.map((s, idx) => (
                      <button
                        key={s.step}
                        type="button"
                        className="glide-sub-pill glide-tabular"
                        style={
                          idx === stepIdx
                            ? { backgroundColor: theme.ctaBg, color: theme.ctaFg, borderColor: theme.ctaBg }
                            : { padding: '0.28rem 0.62rem', fontSize: '0.7rem' }
                        }
                        onClick={() => {
                          if (soundOn) glideSound.playTick();
                          setStepIdx(idx);
                        }}
                      >
                        {s.step}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(128,128,128,0.2)', paddingTop: '0.7rem', fontSize: '0.8rem', color: theme.muted }}>
                  LinkedIn : {PROFILE_IDENTITY.contacts.linkedin} · Email : {PROFILE_IDENTITY.contacts.email}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* BARRE INFÉRIEURE : Flèches Tactiles & Jauge de Progression */}
      <footer className="glide-bottombar">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', opacity: 0.75 }}>
          GLIDE PANEL EDITION · {PROFILE_IDENTITY.signatureCanonical}
        </div>

        <div className="glide-progress-track" aria-hidden="true">
          <div
            className="glide-progress-fill"
            style={{
              width: `${((panelIdx + 1) / GLIDE_PANELS.length) * 100}%`,
              backgroundColor: theme.accent,
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <button
            type="button"
            className="glide-arrow-btn"
            aria-label="Panneau précédent"
            onClick={() => goToPanel(panelIdx - 1)}
          >
            ←
          </button>
          <span
            className="glide-tabular"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', minWidth: '3.4rem', textAlign: 'center' }}
          >
            0{panelIdx + 1} / 06
          </span>
          <button
            type="button"
            className="glide-arrow-btn"
            aria-label="Panneau suivant"
            onClick={() => goToPanel(panelIdx + 1)}
          >
            →
          </button>
        </div>
      </footer>

      {/* MODAL SCHÉMA D'ARCHITECTURE */}
      {modalProject && (
        <div
          className="glide-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalProject(null);
          }}
        >
          <div className="glide-modal" role="dialog" aria-modal="true" aria-labelledby="glide-modal-title">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#475569' }}>
                {modalProject.steleLabel}
              </span>
              <button
                type="button"
                onClick={() => setModalProject(null)}
                style={{
                  border: 0,
                  borderRadius: '999px',
                  background: '#141922',
                  color: '#FFFFFF',
                  padding: '0.4rem 0.95rem',
                  fontSize: '0.78rem',
                }}
              >
                Fermer ✕
              </button>
            </div>

            <h2 id="glide-modal-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', marginBottom: '0.5rem' }}>
              {modalProject.name}
            </h2>
            <p style={{ color: '#475569', fontSize: '0.94rem', marginBottom: '1.25rem' }}>
              {modalProject.context}
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <ProjectArchitectureDiagram projectId={modalProject.id} />
            </div>

            <ul style={{ margin: '0 0 1.25rem', paddingLeft: '1.1rem', color: '#334155', fontSize: '0.9rem', display: 'grid', gap: '0.35rem' }}>
              {modalProject.architectureHighlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>

            {modalProject.liveUrl && (
              <a
                href={modalProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glide-cta-btn"
                style={{ backgroundColor: '#141922', color: '#FFFFFF' }}
              >
                <span>Ouvrir {modalProject.liveUrlLabel}</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
