import { useEffect, useRef, useState } from 'react';
import { MaskReveal } from '../components/typography/MaskReveal';
import { HERO_STELE_AXES, PROFILE_IDENTITY } from '../data/portfolioData';
import {
  motionStore,
  selectExpertiseDomain,
  setHeroSteleHoverIndex,
  subscribeHeroSteleHover,
} from '../motion/motionStore';
import { useSectionDepthMotion } from '../motion/useSectionDepthMotion';

/**
 * Scène 01 — L'OCULUS MONUMENTAL (Hero)
 * Couplage spatial complet Premier Plan <-> Monde 3D :
 * - L'ancrage typographique gauche s'inscrit sur le mur porteur en béton sombre et recule en
 *   perspective lorsque la caméra franchit le tambour circulaire de l'oculus.
 * - Le rail bas-droit est synchronisé bidirectionnellement avec la baie vitrée 3D à meneaux acier.
 */
export function HeroSceneSection() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLElement>(null);
  const [hoveredSteleIdx, setHoveredSteleIdx] = useState<-1 | 0 | 1 | 2 | 3>(
    motionStore.heroSteleHoverIndex
  );

  useEffect(() => {
    return subscribeHeroSteleHover((idx) => setHoveredSteleIdx(idx));
  }, []);

  useSectionDepthMotion(0, anchorRef, bridgeRef);

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

          <aside
            ref={bridgeRef}
            className="hero-stele-bridge"
            aria-label="Axes de la stèle architecturale : Audit, Finance, Développement, Innovation"
          >
            <span className="hero-stele-bridge__caption">
              {hoveredSteleIdx !== -1
                ? `BAIE VITRÉE 3D ACTIVE · ${HERO_STELE_AXES[hoveredSteleIdx].label}`
                : 'BAIE VITRÉE 3D · SÉRIGRAPHIE'}
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
