import { useEffect, useRef, useState } from 'react';
import { LIBRARY_COLLECTIONS, PROCESS_STEPS, PROFILE_IDENTITY, SELECTED_PROJECTS, SPATIAL_TIMELINE_MILESTONES } from '../data/portfolioData';
import './cinematic.css';

const sections = [
  ['accueil', 'Accueil'], ['parcours', 'Parcours'], ['expertise', 'Expertise'],
  ['projets', 'Projets'], ['methode', 'Méthode'], ['contact', 'Contact'],
] as const;

/** One scroll timeline drives both the virtual camera and the editorial layers. */
function useMotionTimeline() {
  const [active, setActive] = useState(0);
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
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    media.addEventListener('change', schedule);
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); media.removeEventListener('change', schedule); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return active;
}

function MotionBackground() {
  return <div className="motion-background" aria-hidden="true">
    <div className="motion-background__grain" />
    <div className="motion-background__grid" />
    <div className="motion-depth-scene">
      <div className="motion-depth-scene__plane plane-back" />
      <div className="motion-depth-scene__plane plane-middle" />
      <div className="motion-depth-scene__plane plane-front" />
      <div className="motion-depth-scene__beam beam-one" />
      <div className="motion-depth-scene__beam beam-two" />
      <div className="motion-depth-scene__horizon" />
    </div>
    <div className="motion-orbit">
      <div className="motion-orbit__ring ring-one" /><div className="motion-orbit__ring ring-two" /><div className="motion-orbit__ring ring-three" />
      <div className="motion-orbit__core"><span>LA</span></div>
      <div className="motion-orbit__axis axis-one" /><div className="motion-orbit__axis axis-two" />
      <i className="motion-orbit__point point-one" /><i className="motion-orbit__point point-two" />
    </div>
    <div className="motion-background__fade" />
  </div>;
}

export function CinematicPortfolio() {
  const active = useMotionTimeline();
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="motion-site">
    <a className="motion-skip" href="#contenu">Aller au contenu</a>
    <MotionBackground />
    <header className="motion-header">
      <a href="#accueil" className="motion-brand" aria-label="Loïc AKANDA, accueil"><span>LA<span className="motion-brand__dot">.</span></span><span>LOÏC AKANDA<small>PORTFOLIO / 2026</small></span></a>
      <nav id="motion-navigation" aria-label="Navigation principale" className={`motion-nav ${menuOpen ? 'is-open' : ''}`}>{sections.slice(1).map(([id, label], i) => <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)} aria-current={active === i + 1 ? 'location' : undefined}>{label}</a>)}</nav>
      <a className="motion-contact-link" href="#contact">Parlons ensemble <span>↗</span></a>
      <button className="motion-menu-toggle" type="button" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={menuOpen} aria-controls="motion-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '✕' : '☰'}</button>
    </header>
    <main id="contenu">
      <section id="accueil" className="motion-section motion-hero">
        <div className="motion-hero__content">
          <p className="motion-eyebrow"><span className="motion-live-dot" /> FINANCE · AUDIT · DIGITAL <span className="motion-eyebrow__line" /></p>
          <h1>La rigueur<br /><em>rencontre</em><br />l’<span>innovation.</span></h1>
          <div className="motion-hero__description"><span className="motion-rule" /><p>{PROFILE_IDENTITY.heroSummary}</p></div>
          <a href="#projets" className="motion-button">Explorer mes réalisations <span>↗</span></a>
        </div>
        <div className="motion-hero__side"><span>UNE VISION EN MOUVEMENT</span><span>01 — 06</span></div>
        <div className="motion-hero__bottom"><span>LOÏC AKANDA <b> / </b> INP-HB</span><a href="#parcours">DÉFILER POUR EXPLORER <span>↓</span></a><span>CÔTE D’IVOIRE &nbsp; ●</span></div>
      </section>
      <section id="parcours" className="motion-section motion-content-section">
        <div className="motion-section__heading"><p className="motion-eyebrow">01 / LE PARCOURS <span className="motion-eyebrow__line" /></p><h2>Le sens du<br /><em>chemin.</em></h2><p className="motion-intro">Un parcours où l’exigence académique rencontre l’expérience du terrain.</p></div>
        <div className="motion-timeline">{SPATIAL_TIMELINE_MILESTONES.map((item) => <article className="motion-timeline__item" key={item.id}><span className="motion-index">{item.order} <i /></span><div><p className="motion-meta">{item.period} · {item.category}</p><h3>{item.title}</h3><p>{item.organization}</p><p className="motion-muted">{item.summary}</p></div></article>)}</div>
      </section>
      <section id="expertise" className="motion-section motion-content-section motion-expertise">
        <div className="motion-section__heading"><p className="motion-eyebrow">02 / LES EXPERTISES <span className="motion-eyebrow__line" /></p><h2>Comprendre.<br /><em>Structurer.</em><br />Créer.</h2><p className="motion-intro">Des compétences complémentaires au service de décisions éclairées et de solutions concrètes.</p></div>
        <div className="motion-expertise__grid">{LIBRARY_COLLECTIONS.map((skill, i) => <article className="motion-skill" key={skill.id}><div className="motion-skill__top"><span>0{i + 1} /</span><span>↗</span></div><h3>{skill.title}</h3><p>{skill.summary}</p><span className="motion-skill__line" /></article>)}</div>
      </section>
      <section id="projets" className="motion-section motion-projects">
        <div className="motion-projects__head"><div><p className="motion-eyebrow">03 / RÉALISATIONS <span className="motion-eyebrow__line" /></p><h2>Des idées<br /><em>à l’impact.</em></h2></div><p className="motion-intro">Quatre projets numériques, pensés pour répondre à des besoins réels.</p></div>
        <div className="motion-project-list">{SELECTED_PROJECTS.map((project, i) => <article className="motion-project" key={project.id}><div className="motion-project__image"><img src={project.visuals.find(v => v.src.startsWith('/'))?.src ?? project.visuals[0]?.src} alt={(project.visuals.find(v => v.src.startsWith('/')) ?? project.visuals[0])?.alt ?? project.name} loading="lazy" /><span className="motion-project__number">0{i + 1}</span><span className="motion-project__image-label">SELECTED WORK / {project.index}</span></div><div className="motion-project__body"><p className="motion-meta">{project.category}</p><h3>{project.name}</h3><p>{project.oneLinePitch}</p>{project.operationalNote && <p className="motion-project__note">{project.operationalNote}</p>}<div className="motion-project__links"><a href={project.liveUrl} target="_blank" rel="noreferrer">Voir le projet ↗</a>{project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noreferrer">GitHub ↗</a>}</div></div></article>)}</div>
      </section>
      <section id="methode" className="motion-section motion-method"><div className="motion-section__heading"><p className="motion-eyebrow">04 / LA MÉTHODE <span className="motion-eyebrow__line" /></p><h2>De la vision<br /><em>à l’action.</em></h2><p className="motion-intro">Une démarche structurée, de la compréhension du besoin à la réalisation.</p></div><div className="motion-method__list">{PROCESS_STEPS.map((step) => <article key={step.step}><span>{step.step}</span><h3>{step.title}</h3><p>{step.objective}</p><span>↗</span></article>)}</div></section>
      <section id="contact" className="motion-section motion-contact"><p className="motion-eyebrow">05 / CONTACT <span className="motion-eyebrow__line" /></p><p className="motion-contact__kicker">UN PROJET ? UNE OPPORTUNITÉ ?</p><h2>Construisons<br /><em>la suite.</em></h2><p>{PROFILE_IDENTITY.contacts.lead}</p><a className="motion-button motion-button--light" href={`mailto:${PROFILE_IDENTITY.contacts.email}`}>Écrivons la suite ensemble <span>↗</span></a><div className="motion-contact__links"><a href={PROFILE_IDENTITY.contacts.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={PROFILE_IDENTITY.contacts.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a><a href={`tel:${PROFILE_IDENTITY.contacts.phonePrimary.replace(/\s/g, '')}`}>{PROFILE_IDENTITY.contacts.phonePrimary}</a></div><footer><span>© LOÏC AKANDA</span><span>FINANCE · AUDIT · DIGITAL</span><a href="#accueil">RETOUR EN HAUT ↑</a></footer></section>
    </main>
    <div className="motion-progress" aria-hidden="true"><span>{String(active + 1).padStart(2, '0')}</span><i><b style={{ height: `${((active + 1) / sections.length) * 100}%` }} /></i><span>06</span></div>
  </div>;
}
