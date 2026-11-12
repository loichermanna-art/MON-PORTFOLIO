import { useEffect, useRef, useState } from 'react';
import { CV_PRO_EXPRESS_PROJECT, LIBRARY_COLLECTIONS, PROCESS_STEPS, PROFILE_IDENTITY, SELECTED_PROJECTS, SPATIAL_TIMELINE_MILESTONES } from '../data/portfolioData';
import './cinematic.css';

const sections = [
  ['accueil', 'Accueil'], ['parcours', 'Parcours'], ['expertise', 'Expertise'],
  ['projets', 'Projets'], ['methode', 'Méthode'], ['contact', 'Contact'],
] as const;

const projects = [...SELECTED_PROJECTS, CV_PRO_EXPRESS_PROJECT];

/** One scroll timeline drives both the virtual camera and the editorial layers. */
function useMotionTimeline() {
  const [active, setActive] = useState(0);
  const [projectIndex, setProjectIndex] = useState(0);
  const projectIndexRef = useRef(0);
  const activeRef = useRef(0);
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const nodes = sections.map(([id]) => document.getElementById(id));
      const midpoint = window.innerHeight * 0.46;
      let index = 0;
      nodes.forEach((node, i) => { if (node && node.getBoundingClientRect().top <= midpoint) index = i; });
      if (activeRef.current !== index) { activeRef.current = index; setActive(index); }
      const rect = nodes[index]?.getBoundingClientRect();
      const nextRect = nodes[index + 1]?.getBoundingClientRect();
      const distance = rect ? Math.max(1, nextRect ? nextRect.top - rect.top : rect.height) : 1;
      const local = rect ? Math.max(0, Math.min(1, (midpoint - rect.top) / distance)) : 0;
      const progress = index + local;
      const motion = media.matches ? 0 : progress;
      root.style.setProperty('--scene-progress', String(motion));
      root.style.setProperty('--scene-rotation', `${motion * 38}deg`);
      root.style.setProperty('--scene-shift', `${Math.sin(motion * 1.7) * 7}vw`);
      root.style.setProperty('--scene-tilt', `${Math.sin(motion * 1.2) * 12}deg`);
      root.style.setProperty('--scene-dolly', `${Math.sin(motion * 1.1) * 120}px`);
      root.style.setProperty('--scene-pan-y', `${Math.sin(motion * .8) * 7}vh`);
      root.style.setProperty('--scene-roll', `${Math.sin(motion * .9) * 9}deg`);
      nodes.forEach((section) => {
        if (!section) return;
        const bounds = section.getBoundingClientRect();
        const offset = Math.max(-1, Math.min(1, bounds.top / Math.max(window.innerHeight, 1)));
        section.style.setProperty('--section-depth', media.matches ? '0px' : `${offset * 24}px`);
      });
      const cylinder = document.getElementById('project-cylinder');
      if (cylinder) {
        const bounds = cylinder.getBoundingClientRect();
        const distance = Math.max(1, bounds.height - window.innerHeight);
        const progress = Math.max(0, Math.min(1, -bounds.top / distance));
        if (!media.matches) {
          cylinder.style.setProperty('--cylinder-angle', `${-progress * (projects.length - 1) * 360 / projects.length}deg`);
          const nextProject = Math.round(progress * (projects.length - 1));
          if (projectIndexRef.current !== nextProject) { projectIndexRef.current = nextProject; setProjectIndex(nextProject); }
        }
      }
      document.querySelectorAll<HTMLElement>('.motion-project__image, .motion-skill, .motion-timeline__item, .motion-method__list article, .scroll-text').forEach((item) => {
        const bounds = item.getBoundingClientRect();
        // Each element follows its own position in the viewport, not a shared time-based animation.
        const offset = Math.max(-1, Math.min(1, (bounds.top + bounds.height / 2 - window.innerHeight / 2) / window.innerHeight));
        item.style.setProperty('--item-depth', media.matches ? '0px' : `${offset * 45}px`);
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    media.addEventListener('change', schedule);
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); media.removeEventListener('change', schedule); if (frame) cancelAnimationFrame(frame); };
  }, []);
  const selectProject = (index: number) => {
    const cylinder = document.getElementById('project-cylinder');
    if (!cylinder) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      projectIndexRef.current = index;
      setProjectIndex(index);
      cylinder.style.setProperty('--cylinder-angle', `${-index * 360 / projects.length}deg`);
    } else {
      const top = window.scrollY + cylinder.getBoundingClientRect().top;
      const distance = Math.max(0, cylinder.offsetHeight - window.innerHeight);
      window.scrollTo({ top: top + distance * index / (projects.length - 1), behavior: 'smooth' });
    }
  };
  return { active, projectIndex, selectProject };
}

function WelcomeIntro() {
  const [visible, setVisible] = useState(() => {
    try {
      return !window.location.hash && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && sessionStorage.getItem('portfolio-intro-seen') !== '1';
    } catch { return false; }
  });
  useEffect(() => {
    if (!visible) return;
    const close = () => { try { sessionStorage.setItem('portfolio-intro-seen', '1'); } catch { /* storage may be disabled */ } setVisible(false); };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    const timer = window.setTimeout(close, 4200);
    window.addEventListener('keydown', onKeyDown);
    return () => { window.clearTimeout(timer); window.removeEventListener('keydown', onKeyDown); };
  }, [visible]);
  if (!visible) return null;
  const dismiss = () => { try { sessionStorage.setItem('portfolio-intro-seen', '1'); } catch { /* storage may be disabled */ } setVisible(false); };
  return <div className="welcome-intro" aria-label="Introduction au portfolio de Loïc AKANDA">
    <div className="welcome-intro__halo" aria-hidden="true" />
    <div className="welcome-intro__copy"><span className="welcome-intro__eyebrow">PORTFOLIO · FINANCE & DIGITAL</span><div className="welcome-intro__name" aria-label="Loïc AKANDA"><span>Loïc</span><span>AKANDA<span className="welcome-intro__dot">.</span></span></div><span className="welcome-intro__subtitle">LA RIGUEUR EN MOUVEMENT</span></div>
    <div className="welcome-intro__progress" aria-hidden="true"><span /></div>
    <button type="button" onClick={dismiss}>Passer l’introduction <span>↗</span></button>
  </div>;
}

function useEditorialReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const elements = document.querySelectorAll<HTMLElement>('.motion-section__heading, .motion-timeline__item, .motion-skill, .motion-project, .motion-method__list article, .motion-contact > h2, .motion-projects__head');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    elements.forEach((element) => {
      if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('motion-reveal');
      observer.observe(element);
    });
    return () => { observer.disconnect(); elements.forEach((element) => element.classList.remove('motion-reveal', 'is-revealed')); };
  }, []);
}

function MotionBackground() {
  return <div className="motion-background motion-background--warm" aria-hidden="true">
    <div className="warm-glow warm-glow--one" />
    <div className="warm-glow warm-glow--two" />
    <div className="warm-glow warm-glow--three" />
    <div className="warm-grain" />
  </div>;
}

export function CinematicPortfolio() {
  const { active, projectIndex, selectProject } = useMotionTimeline();
  const currentProject = projects[projectIndex];
  useEditorialReveal();
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="motion-site">
    <a className="motion-skip" href="#contenu">Aller au contenu</a>
    <MotionBackground />
    <WelcomeIntro />
    <header className="motion-header">
      <a href="#accueil" className="motion-brand" aria-label="Loïc AKANDA, accueil"><span>LA<span className="motion-brand__dot">.</span></span><span>LOÏC AKANDA<small>PORTFOLIO / 2026</small></span></a>
      <nav id="motion-navigation" aria-label="Navigation principale" className={`motion-nav ${menuOpen ? 'is-open' : ''}`}>{sections.slice(1).map(([id, label], i) => <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)} aria-current={active === i + 1 ? 'location' : undefined}>{label}</a>)}</nav>
      <a className="motion-contact-link" href="#contact">Parlons ensemble <span>↗</span></a>
      <button className="motion-menu-toggle" type="button" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={menuOpen} aria-controls="motion-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '✕' : '☰'}</button>
    </header>
    <main id="contenu">
      <section id="accueil" className="motion-section motion-hero">
        <div className="hero-typography" aria-hidden="true">LOÏC<span>AKANDA</span></div>
        <div className="motion-hero__content">
          <p className="motion-eyebrow"><span className="motion-live-dot" /> FINANCE · AUDIT · DIGITAL <span className="motion-eyebrow__line" /></p>
          <h1 className="scroll-text">La rigueur<br /><em>rencontre</em><br />l’<span>innovation.</span></h1>
          <div className="motion-hero__description"><span className="motion-rule" /><p className="scroll-text">{PROFILE_IDENTITY.heroSummary}</p></div>
          <a href="#projets" className="motion-button">Explorer mes réalisations <span>↗</span></a>
        </div>
        <div className="motion-hero__side"><span>UNE VISION EN MOUVEMENT</span><span>01 — 06</span></div>
        <div className="motion-hero__bottom"><span>LOÏC AKANDA <b> / </b> INP-HB</span><a href="#parcours">DÉFILER POUR EXPLORER <span>↓</span></a><span>CÔTE D’IVOIRE &nbsp; ●</span></div>
      </section>
      <section id="parcours" className="motion-section motion-content-section scene-parcours"><span className="scene-word" aria-hidden="true">parcours</span>
        <div className="motion-section__heading"><p className="motion-eyebrow">01 / LE PARCOURS <span className="motion-eyebrow__line" /></p><h2 className="scroll-text">Le sens du<br /><em>chemin.</em></h2><p className="motion-intro scroll-text">Un parcours où l’exigence académique rencontre l’expérience du terrain.</p></div>
        <div className="motion-timeline">{SPATIAL_TIMELINE_MILESTONES.map((item) => <article className="motion-timeline__item" key={item.id}><span className="motion-index">{item.order} <i /></span><div><p className="motion-meta">{item.period} · {item.category}</p><h3 className="scroll-text">{item.title}</h3><p>{item.organization}</p><p className="motion-muted scroll-text">{item.summary}</p></div></article>)}</div>
      </section>
      <section id="expertise" className="motion-section motion-content-section motion-expertise scene-expertise"><span className="scene-word" aria-hidden="true">expertise</span>
        <div className="motion-section__heading"><p className="motion-eyebrow">02 / LES EXPERTISES <span className="motion-eyebrow__line" /></p><h2 className="scroll-text">Comprendre.<br /><em>Structurer.</em><br />Créer.</h2><p className="motion-intro scroll-text">Des compétences complémentaires au service de décisions éclairées et de solutions concrètes.</p></div>
        <div className="motion-expertise__grid">{LIBRARY_COLLECTIONS.map((skill, i) => <article className="motion-skill" key={skill.id}><div className="motion-skill__top"><span>0{i + 1} /</span><span>↗</span></div><h3 className="scroll-text">{skill.title}</h3><p className="scroll-text">{skill.summary}</p><span className="motion-skill__line" /></article>)}</div>
      </section>
      <section id="projets" className="motion-section motion-projects scene-projets"><span className="scene-word" aria-hidden="true">projets</span>
        <div className="motion-projects__head"><div><p className="motion-eyebrow">03 / RÉALISATIONS <span className="motion-eyebrow__line" /></p><h2 className="scroll-text">Des idées<br /><em>à l’impact.</em></h2></div><p className="motion-intro scroll-text">Cinq projets numériques, pensés pour répondre à des besoins réels.</p></div>
        <div id="project-cylinder" className="project-cylinder">
          <div className="project-cylinder__sticky">
            <p className="project-cylinder__hint">DÉFILEZ POUR FAIRE TOURNER · CLIQUEZ POUR VISITER ↓</p>
            <div className="project-cylinder__stage">
              <div className="project-cylinder__wheel" aria-hidden="true">
                {projects.flatMap((project, i) => Array.from({ length: 4 }, (_, slice) => <a key={`${project.id}-${slice}`} tabIndex={-1} href={project.liveUrl} target="_blank" rel="noreferrer" className="project-cylinder__slice" style={{ transform: `rotateY(${i * 360 / projects.length + (slice - 1.5) * 360 / (projects.length * 4)}deg) translateZ(var(--cylinder-radius))`, backgroundImage: `url("${project.visuals.find(v => v.src.startsWith('/'))?.src ?? project.visuals[0]?.src}")`, backgroundPosition: `${slice * 100 / 3}% center` }} />))}
              </div>
            </div>
            <div className="project-cylinder__details">
              <p>{String(projectIndex + 1).padStart(2, '0')} / {projects.length} · {currentProject.category}</p>
              <h3>{currentProject.name}</h3><p>{currentProject.oneLinePitch}</p>
              {currentProject.operationalNote && <p className="project-cylinder__note">{currentProject.operationalNote}</p>}
              <a href={currentProject.liveUrl} target="_blank" rel="noreferrer">Visiter {currentProject.name} ↗</a>
              {currentProject.repoUrl && <a href={currentProject.repoUrl} target="_blank" rel="noreferrer">GitHub ↗</a>}
            </div>
            <div className="project-cylinder__controls" aria-label="Choisir un projet">{projects.map((project, i) => <button type="button" key={project.id} onClick={() => selectProject(i)} aria-label={`Afficher ${project.name}`} aria-pressed={projectIndex === i}><span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span></button>)}</div>
          </div>
        </div>
      </section>
      <section id="methode" className="motion-section motion-method scene-methode"><span className="scene-word" aria-hidden="true">méthode</span><div className="motion-section__heading"><p className="motion-eyebrow">04 / LA MÉTHODE <span className="motion-eyebrow__line" /></p><h2 className="scroll-text">De la vision<br /><em>à l’action.</em></h2><p className="motion-intro scroll-text">Une démarche structurée, de la compréhension du besoin à la réalisation.</p></div><div className="motion-method__list">{PROCESS_STEPS.map((step) => <article key={step.step}><span>{step.step}</span><h3 className="scroll-text">{step.title}</h3><p className="scroll-text">{step.objective}</p><span>↗</span></article>)}</div></section>
      <section id="contact" className="motion-section motion-contact scene-contact"><span className="scene-word" aria-hidden="true">ensemble</span><p className="motion-eyebrow">05 / CONTACT <span className="motion-eyebrow__line" /></p><p className="motion-contact__kicker">UN PROJET ? UNE OPPORTUNITÉ ?</p><h2 className="scroll-text">Construisons<br /><em>la suite.</em></h2><p className="scroll-text">{PROFILE_IDENTITY.contacts.lead}</p><a className="motion-button motion-button--light" href={`mailto:${PROFILE_IDENTITY.contacts.email}`}>Écrivons la suite ensemble <span>↗</span></a><div className="motion-contact__links"><a href={PROFILE_IDENTITY.contacts.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={PROFILE_IDENTITY.contacts.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a><a href={`tel:${PROFILE_IDENTITY.contacts.phonePrimary.replace(/\s/g, '')}`}>{PROFILE_IDENTITY.contacts.phonePrimary}</a></div><footer><span>© LOÏC AKANDA</span><span>FINANCE · AUDIT · DIGITAL</span><a href="#accueil">RETOUR EN HAUT ↑</a></footer></section>
    </main>
    <div className="motion-progress" aria-hidden="true"><span>{String(active + 1).padStart(2, '0')}</span><i><b style={{ height: `${((active + 1) / sections.length) * 100}%` }} /></i><span>06</span></div>
  </div>;
}
