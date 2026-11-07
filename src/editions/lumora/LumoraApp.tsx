import { useEffect, useMemo, useRef, useState } from 'react';
import Lenis from 'lenis';
import { ProjectArchitectureDiagram } from '../../components/projects/ProjectArchitectureDiagram';
import {
  EXPERTISE_DOMAINS,
  PROCESS_STEPS,
  PROFILE_IDENTITY,
  SELECTED_PROJECTS,
  type ProjectCaseStudy,
} from '../../data/portfolioData';
import { LiquidRevealHero } from './LiquidRevealHero';

const PROJECT_IMAGES: Record<ProjectCaseStudy['id'], string> = {
  'laura-house': '/lumora/work-laura.jpg',
  sassyskin: '/lumora/work-sassy.jpg',
  etuco: '/lumora/work-etuco.jpg',
};

const MARQUEE_ITEMS = [
  'FINANCE & COMPTABILITÉ',
  'AUDIT & CONTRÔLE INTERNE',
  'DÉVELOPPEMENT NUMÉRIQUE',
  'GESTION DE PROJETS',
  'INP-HB · CYCLE INGÉNIEUR',
  'LAURA HOUSE',
  'SASSYSKIN',
  'ETUCO',
];

function useSpringReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.14 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

export function LumoraApp() {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // 1. Intro Loader 000 -> 100
  const [progress, setProgress] = useState<number>(() => (reducedMotion ? 100 : 0));
  const [loaderDone, setLoaderDone] = useState<boolean>(() => reducedMotion);

  // 2. Scrubbed Word-by-Word Illumination
  const scrubRef = useRef<HTMLParagraphElement | null>(null);
  const [litRatio, setLitRatio] = useState<number>(0.2);

  // 3. Accordéon Expertise & Modal Projet & Horloge temps réel
  const [openService, setOpenService] = useState<number>(0);
  const [activeProject, setActiveProject] = useState<ProjectCaseStudy | null>(null);
  const [copiedGithub, setCopiedGithub] = useState(false);
  const [clockText, setClockText] = useState<string>('');

  // 4. Curseur flottant magnétique sur les cartes Projets
  const [cursorVisible, setCursorVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorTarget = useRef({ x: 0, y: 0, cx: 0, cy: 0 });

  // Animation du compteur d'introduction 000 -> 100
  useEffect(() => {
    if (reducedMotion) {
      setProgress(100);
      setLoaderDone(true);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1280;

    const tick = (now: number) => {
      const t = Math.max(0, Math.min(1, (now - start) / duration));
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const val = Math.round(eased * 100);
      setProgress(val);
      if (t < 1) {
        raf = window.requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setLoaderDone(true), 160);
      }
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [reducedMotion]);

  // Lenis Smooth Scroll
  useEffect(() => {
    if (
      reducedMotion ||
      typeof window === 'undefined' ||
      typeof ResizeObserver === 'undefined'
    ) {
      return;
    }
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
    });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => {
      window.cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reducedMotion]);

  // Illumination mot-par-mot liée au scroll sur la section À propos
  useEffect(() => {
    const onScroll = () => {
      const el = scrubRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const start = vh * 0.85;
      const end = vh * 0.22;
      const raw = (start - rect.top) / Math.max(1, start - end);
      setLitRatio(Math.max(0.08, Math.min(1, raw)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Suivi ressort du badge curseur sur les cartes Projets
  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cursorTarget.current.x = e.clientX + 16;
      cursorTarget.current.y = e.clientY + 16;
    };
    const animateCursor = () => {
      const c = cursorTarget.current;
      c.cx += (c.x - c.cx) * 0.2;
      c.cy += (c.y - c.cy) * 0.2;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${c.cx.toFixed(1)}px, ${c.cy.toFixed(1)}px, 0)`;
      }
      raf = window.requestAnimationFrame(animateCursor);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = window.requestAnimationFrame(animateCursor);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  // Horloge locale temps réel (Côte d'Ivoire — UTC+00)
  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat('fr-FR', {
          timeZone: 'Africa/Abidjan',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(new Date());
        setClockText(`${formatted} GMT`);
      } catch {
        setClockText(new Date().toTimeString().slice(0, 8));
      }
    };
    updateClock();
    const id = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Fermeture Escape sur la fiche projet
  useEffect(() => {
    if (!activeProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveProject(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeProject]);

  const statementWords = useMemo(
    () =>
      'Étudiant en 3e année du cycle ingénieur en finance à l’INP-HB, j’unis la rigueur de l’audit financier et la création d’applications numériques sobres, structurées et orientées impact.'.split(
        ' '
      ),
    []
  );

  const aboutReveal = useSpringReveal<HTMLDivElement>();
  const worksReveal = useSpringReveal<HTMLDivElement>();
  const servicesReveal = useSpringReveal<HTMLDivElement>();
  const processReveal = useSpringReveal<HTMLDivElement>();
  const numbersReveal = useSpringReveal<HTMLDivElement>();

  const handleCopyGithub = async () => {
    try {
      await navigator.clipboard?.writeText(PROFILE_IDENTITY.contacts.githubUrl);
      setCopiedGithub(true);
      window.setTimeout(() => setCopiedGithub(false), 2200);
    } catch {
      setCopiedGithub(false);
    }
  };

  return (
    <>
      <a href="#main" className="lum-skip">
        Aller au contenu principal
      </a>

      {/* Grille éditoriale suisse subtile */}
      <div className="lum-grid-lines" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* Curseur flottant sur les cartes projets */}
      {!reducedMotion && (
        <div
          ref={cursorRef}
          className="lum-cursor-pill"
          style={{ opacity: cursorVisible ? 1 : 0 }}
          aria-hidden="true"
        >
          Voir l’étude ↗
        </div>
      )}

      {/* 1. RIDEAU D'OUVERTURE LUMORA 000 -> 100 */}
      <div
        className="lum-loader"
        data-done={loaderDone ? 'true' : 'false'}
        aria-hidden={loaderDone}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            LOÏC AKANDA<sup style={{ color: 'var(--lum-accent)' }}>®</sup>
          </span>
          <button
            type="button"
            onClick={() => {
              setProgress(100);
              setLoaderDone(true);
            }}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.22)',
              color: '#F6F5F1',
              borderRadius: '999px',
              padding: '0.35rem 0.9rem',
              fontSize: '0.75rem',
            }}
          >
            Passer ↗
          </button>
        </div>

        <div>
          <p style={{ color: '#A3A097', fontSize: '0.95rem', marginBottom: '0.6rem' }}>
            Finance. Innovation. Impact. — Précision éditoriale &amp; solutions numériques.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.76rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#A3A097',
              }}
            >
              Chargement de l’édition Lumora
            </span>
            <span className="lum-loader__counter lum-tabular">
              {String(progress).padStart(3, '0')}
            </span>
          </div>
          <div className="lum-loader__bar-track">
            <div
              className="lum-loader__bar-fill"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
        </div>
      </div>

      {/* 2. HEADER SUISSE COLLANT */}
      <header className="lum-header" role="banner">
        <div className="lum-shell lum-header__inner">
          <a href="#top" className="lum-brand">
            LOÏC AKANDA<sup>®</sup>
          </a>

          <nav className="lum-nav" aria-label="Navigation principale">
            <a href="#about">À propos</a>
            <a href="#works">Projets</a>
            <a href="#services">Expertise</a>
            <a href="#process">Démarche</a>
            <a href="#contact">Contact</a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              type="button"
              className="lum-pill-outline"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.76rem' }}
              aria-pressed={reducedMotion}
              onClick={() => setReducedMotion((v) => !v)}
            >
              {reducedMotion ? 'Anim : Calme' : 'Anim : Fluide'}
            </button>
            <a href="#contact" className="lum-pill-orange">
              <span>Échanger</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </header>

      <main id="main">
        {/* 3. HERO PLEIN CADRE AVEC RÉVÉLATION LIQUIDE AU CURSEUR */}
        <section id="top" className="lum-hero">
          <div className="lum-shell">
            <div className="lum-hero__frame" data-ready={loaderDone ? 'true' : 'false'}>
              <LiquidRevealHero reducedMotion={reducedMotion} />
              <div className="lum-hero__vignette" />

              <div className="lum-hero__top">
                <span className="lum-chip-glass">
                  <span className="lum-dot-live" />
                  <span>PORTFOLIO 2026 · INP-HB FINANCE</span>
                </span>

                <span className="lum-chip-glass">
                  Glissez le curseur pour révéler la lumière
                </span>
              </div>

              <div className="lum-hero__bottom">
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#E5E2DA',
                    marginBottom: '0.75rem',
                  }}
                >
                  Loïc AKANDA — {PROFILE_IDENTITY.signatureCanonical}
                </p>

                <h1 className="lum-hero__title">
                  Idées fortes, conçues avec une précision calme.
                </h1>

                <div className="lum-hero__meta-row">
                  <div style={{ maxWidth: '30rem' }}>
                    <p style={{ fontSize: '1.02rem', color: '#ECEAE3', marginBottom: '1.1rem' }}>
                      {PROFILE_IDENTITY.heroRole} De l’analyse stratégique et financière à la
                      réalisation d’applications web complètes.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <a href="#works" className="lum-pill-orange">
                        <span>Voir les réalisations</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                      <a
                        href="#about"
                        className="lum-pill-outline"
                        style={{
                          background: 'rgba(255,255,255,0.14)',
                          color: '#FFFFFF',
                          borderColor: 'rgba(255,255,255,0.32)',
                        }}
                      >
                        <span>Découvrir le parcours</span>
                      </a>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.74rem',
                        color: '#D6D3C9',
                        marginBottom: '0.35rem',
                      }}
                    >
                      3 PROJETS CONCRETS · 4 DOMAINES
                    </div>
                    <a
                      href="#about"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        letterSpacing: '0.12em',
                        color: '#FFFFFF',
                      }}
                    >
                      SCROLL TO EXPLORE ↓
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. BANDE DÉFILANTE KINETIC MARQUEE */}
        <div className="lum-marquee" aria-hidden="true">
          <div className="lum-marquee__track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((label, idx) => (
              <span key={`${label}-${idx}`} className="lum-marquee__item">
                <span>{label}</span>
                <span className="lum-marquee__star">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* 5. SECTION À PROPOS — MOTS ILLUMINÉS AU SCROLL + TRIADE */}
        <section id="about" className="lum-section" aria-labelledby="lum-about-title">
          <div
            ref={aboutReveal.ref}
            data-visible={aboutReveal.visible ? 'true' : 'false'}
            className="lum-shell lum-spring-reveal"
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 22rem), 1fr))',
                gap: '2.5rem',
                alignItems: 'start',
              }}
            >
              <div>
                <span className="lum-eyebrow" id="lum-about-title">
                  À propos · Double compétence
                </span>
                <p style={{ fontSize: '1.05rem', color: 'var(--lum-muted)', maxWidth: '26rem', marginBottom: '1.5rem' }}>
                  {PROFILE_IDENTITY.aboutBridge}
                </p>

                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.55rem',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                  }}
                >
                  <span>Analyser.</span>
                  <span>Concevoir.</span>
                  <span style={{ color: 'var(--lum-accent)' }}>Impacter.</span>
                </div>
              </div>

              <div>
                <p ref={scrubRef} className="lum-scrub-statement">
                  {statementWords.map((word, idx) => {
                    const threshold = idx / statementWords.length;
                    const isLit = reducedMotion || litRatio >= threshold;
                    return (
                      <span
                        key={`${word}-${idx}`}
                        className="lum-scrub-word"
                        style={{ color: isLit ? 'var(--lum-ink)' : 'var(--lum-faint)' }}
                      >
                        {word}
                      </span>
                    );
                  })}
                </p>
              </div>
            </div>

            <div className="lum-triad-grid">
              {PROFILE_IDENTITY.workPhilosophy.map((pillar) => (
                <article key={pillar.index} className="lum-triad-card">
                  <div
                    className="lum-tabular"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--lum-accent)',
                      fontWeight: 600,
                      marginBottom: '0.75rem',
                    }}
                  >
                    PILIER {pillar.index}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      marginBottom: '0.55rem',
                    }}
                  >
                    {pillar.title}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--lum-muted)' }}>
                    {pillar.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 6. SELECTED WORK — GRILLE BENTO À RESSORT */}
        <section id="works" className="lum-section" aria-labelledby="lum-works-title">
          <div
            ref={worksReveal.ref}
            data-visible={worksReveal.visible ? 'true' : 'false'}
            className="lum-shell lum-spring-reveal"
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: '1rem',
              }}
            >
              <div>
                <span className="lum-eyebrow">Portfolio · Réalisations vérifiées</span>
                <h2
                  id="lum-works-title"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.1rem, 4.2vw, 3.6rem)',
                    fontWeight: 500,
                    letterSpacing: '-0.04em',
                  }}
                >
                  Des idées qui prennent vie.
                </h2>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--lum-muted)' }}>
                01 — 03 SÉLECTIONNÉES
              </span>
            </div>

            <div className="lum-works-grid">
              {SELECTED_PROJECTS.map((project, idx) => {
                const variantClass =
                  idx === 0
                    ? 'lum-work-card lum-work-card--featured'
                    : idx === 1
                      ? 'lum-work-card lum-work-card--secondary'
                      : 'lum-work-card lum-work-card--wide';

                return (
                  <article
                    key={project.id}
                    className={variantClass}
                    onMouseEnter={() => setCursorVisible(true)}
                    onMouseLeave={() => setCursorVisible(false)}
                  >
                    <div className="lum-work-card__media">
                      <img
                        src={PROJECT_IMAGES[project.id]}
                        alt={`Illustration éditoriale pour ${project.name}`}
                        loading="lazy"
                      />
                    </div>

                    <div className="lum-work-card__body">
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.73rem',
                            opacity: 0.72,
                            marginBottom: '0.65rem',
                          }}
                        >
                          <span>{project.steleLabel}</span>
                          <span>®</span>
                        </div>

                        <h3
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.65rem',
                            fontWeight: 600,
                            letterSpacing: '-0.03em',
                            marginBottom: '0.5rem',
                          }}
                        >
                          {project.name}
                        </h3>

                        <p style={{ fontSize: '0.94rem', opacity: 0.84, marginBottom: '1rem' }}>
                          {project.tagline}
                        </p>

                        <div className="lum-tag-row">
                          {project.technologies.map((t) => (
                            <span key={t.label} className="lum-chip">
                              {t.label}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', paddingTop: '0.5rem' }}>
                        <button
                          type="button"
                          className="lum-pill-orange"
                          onClick={() => setActiveProject(project)}
                        >
                          <span>Étude d’architecture</span>
                          <span aria-hidden="true">→</span>
                        </button>

                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={idx === 0 ? 'lum-pill-outline' : 'lum-pill-ink'}
                          >
                            <span>{project.liveUrlLabel}</span>
                            <span aria-hidden="true">↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. EXPERTISE — RANGÉES ACCORDÉON SUISSES 01 -> 04 (0 % JAUGE FACTICE) */}
        <section id="services" className="lum-section" aria-labelledby="lum-services-title">
          <div
            ref={servicesReveal.ref}
            data-visible={servicesReveal.visible ? 'true' : 'false'}
            className="lum-shell lum-spring-reveal"
          >
            <span className="lum-eyebrow">Expertise · Quatre domaines complémentaires</span>
            <h2
              id="lum-services-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.1rem, 4vw, 3.4rem)',
                fontWeight: 500,
                letterSpacing: '-0.04em',
                marginBottom: '2.25rem',
              }}
            >
              Ce que je structure le mieux.
            </h2>

            <div>
              {EXPERTISE_DOMAINS.map((domain, idx) => {
                const isOpen = openService === idx;
                return (
                  <div
                    key={domain.id}
                    className="lum-service-row"
                    data-open={isOpen ? 'true' : 'false'}
                  >
                    <button
                      type="button"
                      className="lum-service-trigger"
                      aria-expanded={isOpen}
                      onClick={() => setOpenService(isOpen ? -1 : idx)}
                    >
                      <span className="lum-service-num lum-tabular">{domain.index}</span>
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(1.25rem, 2.2vw, 1.75rem)',
                          fontWeight: 600,
                          letterSpacing: '-0.025em',
                        }}
                      >
                        {domain.title}
                      </span>
                      <span
                        className="lum-service-summary-inline"
                        style={{ fontSize: '0.92rem', color: 'var(--lum-muted)' }}
                      >
                        {domain.shortSubtitle}
                      </span>
                      <span
                        aria-hidden="true"
                        style={{
                          justifySelf: 'end',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1.15rem',
                          color: isOpen ? 'var(--lum-accent)' : 'var(--lum-ink)',
                        }}
                      >
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        style={{
                          padding: '0 0.5rem 1.75rem 4.5rem',
                          display: 'grid',
                          gap: '0.85rem',
                          maxWidth: '54rem',
                        }}
                      >
                        <p style={{ color: 'var(--lum-muted)', fontSize: '0.96rem' }}>
                          {domain.summary}
                        </p>
                        <div className="lum-tag-row">
                          {domain.capabilities.map((cap) => (
                            <span
                              key={cap}
                              className="lum-chip"
                              style={{ background: '#FFFFFF', opacity: 1 }}
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.74rem',
                            color: 'var(--lum-accent)',
                          }}
                        >
                          Socle : {domain.academicOrProjectBasis}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 8. MA DÉMARCHE (01-06) + REPÈRES VÉRIFIÉS */}
        <section id="process" className="lum-section" aria-labelledby="lum-process-title">
          <div
            ref={processReveal.ref}
            data-visible={processReveal.visible ? 'true' : 'false'}
            className="lum-shell lum-spring-reveal"
          >
            <span className="lum-eyebrow">Méthode · Six étapes rigoureuses</span>
            <h2
              id="lum-process-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
                fontWeight: 500,
                letterSpacing: '-0.04em',
              }}
            >
              Une approche structurée pour des solutions durables.
            </h2>

            <div className="lum-process-grid">
              {PROCESS_STEPS.map((step) => (
                <article key={step.step} className="lum-process-card">
                  <div>
                    <span
                      className="lum-tabular"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--lum-accent)',
                      }}
                    >
                      ÉTAPE {step.step}
                    </span>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        margin: '0.45rem 0',
                      }}
                    >
                      {step.title}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--lum-muted)' }}>
                      {step.summary}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--lum-ink)',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--lum-line)',
                    }}
                  >
                    Livrable : {step.deliverable}
                  </span>
                </article>
              ))}
            </div>

            <div
              ref={numbersReveal.ref}
              data-visible={numbersReveal.visible ? 'true' : 'false'}
              className="lum-metrics-band lum-spring-reveal"
              style={{ marginTop: '3.5rem' }}
            >
              <div className="lum-metric-box">
                <div className="lum-metric-val lum-tabular">INP-HB</div>
                <div style={{ fontSize: '0.85rem', color: '#C8C4BA' }}>
                  3e année cycle ingénieur en finance
                </div>
              </div>
              <div className="lum-metric-box">
                <div className="lum-metric-val lum-tabular">03</div>
                <div style={{ fontSize: '0.85rem', color: '#C8C4BA' }}>
                  Projets numériques conçus &amp; structurés
                </div>
              </div>
              <div className="lum-metric-box">
                <div className="lum-metric-val lum-tabular">04</div>
                <div style={{ fontSize: '0.85rem', color: '#C8C4BA' }}>
                  Pôles complémentaires Finance &amp; Tech
                </div>
              </div>
              <div className="lum-metric-box">
                <div className="lum-metric-val lum-tabular" style={{ color: 'var(--lum-accent)' }}>
                  06
                </div>
                <div style={{ fontSize: '0.85rem', color: '#C8C4BA' }}>
                  Étapes méthodiques de l’analyse au suivi
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 9. FOOTER MONUMENTAL LUMORA + HORLOGE TEMPS RÉEL */}
      <footer id="contact" className="lum-footer">
        <div className="lum-shell">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 22rem), 1fr))',
              gap: '2.5rem',
              alignItems: 'start',
            }}
          >
            <div>
              <span className="lum-eyebrow" style={{ color: '#C8C4BA' }}>
                Restons connectés
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.035em',
                  marginBottom: '0.85rem',
                }}
              >
                {PROFILE_IDENTITY.contacts.heading}
              </h2>
              <p style={{ color: '#A8A49B', maxWidth: '28rem', marginBottom: '1.6rem' }}>
                {PROFILE_IDENTITY.contacts.lead}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <a
                  href={PROFILE_IDENTITY.contacts.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lum-pill-orange"
                >
                  <span>GitHub ({PROFILE_IDENTITY.contacts.githubHandle})</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <button
                  type="button"
                  className="lum-pill-outline"
                  onClick={handleCopyGithub}
                >
                  {copiedGithub ? 'Lien GitHub copié ✓' : 'Copier le lien GitHub'}
                </button>
              </div>
            </div>

            <div
              style={{
                background: '#17171A',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '1.25rem',
                padding: '1.6rem',
                display: 'grid',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#9E9A90' }}>
                  HEURE LOCALE — CÔTE D’IVOIRE
                </div>
                <div className="lum-tabular" style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF' }}>
                  {clockText || 'UTC+00'}
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.85rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#9E9A90' }}>
                  LINKEDIN PROFESSIONNEL
                </div>
                <div style={{ fontSize: '0.9rem', color: '#E5E2DA' }}>
                  {PROFILE_IDENTITY.contacts.linkedin}
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.85rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#9E9A90' }}>
                  COURRIEL DIRECT
                </div>
                <div style={{ fontSize: '0.9rem', color: '#E5E2DA' }}>
                  {PROFILE_IDENTITY.contacts.email}
                </div>
              </div>
            </div>
          </div>

          <div className="lum-footer__giant" aria-hidden="true">
            LOÏC AKANDA<span style={{ color: 'var(--lum-accent)' }}>®</span>
          </div>

          <div
            style={{
              marginTop: '1.25rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              color: '#9E9A90',
            }}
          >
            <span>© 2026 Loïc AKANDA · {PROFILE_IDENTITY.signatureCanonical}</span>
            <span>Édition Lumora · {PROFILE_IDENTITY.institution}</span>
          </div>
        </div>
      </footer>

      {/* MODAL FICHE PROJET DÉTAILLÉE */}
      {activeProject && (
        <div
          className="lum-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveProject(null);
          }}
        >
          <div className="lum-modal" role="dialog" aria-modal="true" aria-labelledby="lum-modal-title">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--lum-line)',
                marginBottom: '1.5rem',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--lum-accent)' }}>
                {activeProject.steleLabel}
              </span>
              <button
                type="button"
                className="lum-pill-ink"
                style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                onClick={() => setActiveProject(null)}
              >
                Fermer ✕
              </button>
            </div>

            <h2
              id="lum-modal-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.1rem',
                fontWeight: 600,
                marginBottom: '0.6rem',
              }}
            >
              {activeProject.name}
            </h2>
            <p style={{ color: 'var(--lum-muted)', marginBottom: '1.4rem' }}>
              {activeProject.context}
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <ProjectArchitectureDiagram projectId={activeProject.id} />
            </div>

            <div style={{ display: 'grid', gap: '1.1rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Problématique
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--lum-muted)' }}>
                  {activeProject.problem}
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Solution &amp; Architecture
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--lum-muted)' }}>
                  {activeProject.solution}
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Livrables vérifiés ({activeProject.role})
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.88rem', color: 'var(--lum-muted)' }}>
                  {activeProject.architectureHighlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {activeProject.liveUrl && (
              <a
                href={activeProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="lum-pill-orange"
              >
                <span>Ouvrir {activeProject.liveUrlLabel}</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
