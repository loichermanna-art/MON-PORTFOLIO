import { useEffect, useRef, useState } from 'react';
import { MaskReveal } from '../components/typography/MaskReveal';
import { HERO_STELE_AXES, PROFILE_IDENTITY } from '../data/portfolioData';
import {
  motionStore,
  selectExpertiseDomain,
  setHeroSteleHoverIndex,
  subscribeHeroSteleHover,
} from '../motion/motionStore';

/**
 * Scène 01 — PROTOTYPE FONCTIONNEL DU HERO (Phase 3)
 * Intégration réelle Premier Plan <-> Monde 3D :
 * 1. Le bloc typographique (« PORTFOLIO 2026 », « Loïc AKANDA », « Finance. Innovation. Impact. »)
 *    prend place dans l'alcôve béton sombre gauche de l'architecture 3D et accompagne en perspective
 *    l'avancée de la caméra sous le soffite lors du défilement.
 * 2. Le pont interactif droit est synchronisé en temps réel avec la stèle de verre 3D
 *    (« AUDIT · FINANCE · DÉVELOPPEMENT · INNOVATION »), garantissant l'interaction souris,
 *    clavier et tactile.
 */
export function HeroSceneSection() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [hoveredSteleIdx, setHoveredSteleIdx] = useState<-1 | 0 | 1 | 2 | 3>(
    motionStore.heroSteleHoverIndex
  );

  useEffect(() => {
    return subscribeHeroSteleHover((idx) => setHoveredSteleIdx(idx));
  }, []);

  // Couplage spatial au scroll : recul perspectif fluide lorsque la caméra franchit le portique
  useEffect(() => {
    let rafId = 0;
    const syncDepth = () => {
      if (anchorRef.current && !motionStore.isTabHidden) {
        if (motionStore.reducedMotion) {
          anchorRef.current.style.transform = 'none';
          anchorRef.current.style.opacity = '1';
        } else {
          const localP = Math.max(0, Math.min(1, motionStore.scrollProgress / 0.15));
          const translateY = -localP * 34;
          const scale = 1 - localP * 0.045;
          const opacity = Math.max(0.18, 1 - localP * 0.82);
          anchorRef.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
          anchorRef.current.style.opacity = opacity.toFixed(3);
        }
      }
      rafId = window.requestAnimationFrame(syncDepth);
    };
    rafId = window.requestAnimationFrame(syncDepth);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const handleAxisActivate = (axisIdx: 0 | 1 | 2 | 3) => {
    const axis = HERO_STELE_AXES[axisIdx];
    selectExpertiseDomain(axis.targetDomainIndex);
    const expertiseEl = document.getElementById('expertise');
    expertiseEl?.scrollIntoView?.({
      behavior: motionStore.reducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <section
      id="hero"
      className="hero-stage"
      data-scene-index="0"
      aria-labelledby="hero-heading"
    >
      <div className="arch-container">
        <div className="arch-grid" style={{ alignItems: 'end' }}>
          <div ref={anchorRef} className="hero-editorial-anchor">
            <MaskReveal delayMs={30} immediatelyVisible>
              <div className="hero-eyebrow">
                <span>{PROFILE_IDENTITY.portfolioEdition}</span>
                <span className="hero-eyebrow__line" aria-hidden="true" />
              </div>
            </MaskReveal>

            <MaskReveal delayMs={90} immediatelyVisible>
              <h1 id="hero-heading" className="hero-name">
                <span className="hero-name__first">{PROFILE_IDENTITY.firstName} </span>
                <span className="hero-name__last">{PROFILE_IDENTITY.lastName}</span>
              </h1>
            </MaskReveal>

            <MaskReveal delayMs={150} immediatelyVisible>
              <p
                className="hero-signature"
                aria-label={PROFILE_IDENTITY.signatureCanonical}
              >
                {PROFILE_IDENTITY.signaturePrefix}{' '}
                <span className="hero-signature__impact">
                  {PROFILE_IDENTITY.signatureHighlight}
                </span>
              </p>
            </MaskReveal>

            <MaskReveal delayMs={210} immediatelyVisible>
              <p className="hero-subtitle">{PROFILE_IDENTITY.heroRole}</p>
            </MaskReveal>

            <MaskReveal delayMs={270} immediatelyVisible>
              <a href="#about" className="pill-cta">
                <span>{PROFILE_IDENTITY.heroCta}</span>
                <span className="pill-cta__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </MaskReveal>
          </div>

          {/* Contrôle clavier/tactile couplé en direct à la stèle de verre 3D droite */}
          <aside
            className="hero-stele-bridge"
            aria-label="Axes de la stèle architecturale : Audit, Finance, Développement, Innovation"
          >
            <span className="hero-stele-bridge__caption">
              {hoveredSteleIdx !== -1
                ? `STÈLE 3D ACTIVE · ${HERO_STELE_AXES[hoveredSteleIdx].label}`
                : 'STÈLE ARCHITECTURALE · AXES'}
            </span>
            <div className="hero-stele-pill-row">
              {HERO_STELE_AXES.map((axis, idx) => {
                const typedIdx = idx as 0 | 1 | 2 | 3;
                const isActive = hoveredSteleIdx === typedIdx;
                return (
                  <button
                    key={axis.id}
                    type="button"
                    className="hero-stele-chip"
                    data-active={isActive ? 'true' : 'false'}
                    onMouseEnter={() => setHeroSteleHoverIndex(typedIdx)}
                    onMouseLeave={() => setHeroSteleHoverIndex(-1)}
                    onFocus={() => setHeroSteleHoverIndex(typedIdx)}
                    onBlur={() => setHeroSteleHoverIndex(-1)}
                    onClick={() => handleAxisActivate(typedIdx)}
                  >
                    {axis.label}
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>

      {/* Indicateur bas-centre « SCROLL TO EXPLORE » */}
      <a
        href="#about"
        className="hero-scroll-cue"
        aria-label="Défiler pour explorer le portfolio"
      >
        <span className="hero-scroll-mouse" aria-hidden="true">
          <span className="hero-scroll-mouse__wheel" />
        </span>
        <span className="hero-scroll-cue__label">SCROLL TO EXPLORE</span>
        <span className="hero-scroll-cue__line" aria-hidden="true" />
      </a>
    </section>
  );
}
