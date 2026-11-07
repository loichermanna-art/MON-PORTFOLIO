import { HERO_STELE_AXES, PROFILE_IDENTITY } from '../data/portfolioData';
import {
  selectExpertiseDomain,
  setFocusedExpertisePole,
  setHeroSteleHoverIndex,
} from '../motion/motionStore';

interface HeroSceneSectionProps {
  introReady?: boolean;
}

/**
 * SCÈNE 01 — HERO « SKY ZENITH »
 * Typographie exécutive bicolore (#525E6E + #202A36) dans le ciel clair au-dessus des nuages,
 * chorégraphie d'entrée synchronisée à la levée du rideau 000 -> 100,
 * duo de boutons pilules (Argent + Ardoise #202A36) et barre flottante des 4 axes.
 */
export function HeroSceneSection({ introReady = true }: HeroSceneSectionProps) {
  const handleSelectAxis = (targetDomainIndex: 0 | 1 | 2 | 3) => {
    selectExpertiseDomain(targetDomainIndex);
    setFocusedExpertisePole(targetDomainIndex);
  };

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="scene-band scene-band--hero"
    >
      <div className="scene-inner">
        <div className="zenith-hero-layout">
          <div
            className="zenith-hero-center zenith-hero-stagger editorial-interactive"
            data-ready={introReady ? 'true' : 'false'}
          >
            <span className="eyebrow-architectural">
              {PROFILE_IDENTITY.portfolioEdition}
            </span>

            <h1 id="hero-heading" className="zenith-two-tone-title">
              <span className="zenith-two-tone-title__top">
                {PROFILE_IDENTITY.firstName}
              </span>
              <span className="zenith-two-tone-title__bottom">
                {PROFILE_IDENTITY.lastName}
              </span>
            </h1>

            <p
              aria-label={PROFILE_IDENTITY.signatureCanonical}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--step-1)',
                fontWeight: 500,
                letterSpacing: '-0.015em',
                color: 'var(--slate-900)',
                marginBottom: '0.55rem',
              }}
            >
              {PROFILE_IDENTITY.signaturePrefix}{' '}
              <span style={{ color: 'var(--amber-700)', fontWeight: 600 }}>
                {PROFILE_IDENTITY.signatureHighlight}
              </span>
            </p>

            <p
              className="section-lead"
              style={{ maxWidth: '30rem', margin: '0 auto 1.75rem', color: 'var(--slate-600)' }}
            >
              {PROFILE_IDENTITY.heroRole}
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.85rem',
              }}
            >
              <a href="#projects" className="pill-cta-silver">
                <span>Voir les projets</span>
              </a>

              <a href="#about" className="pill-cta">
                <span>{PROFILE_IDENTITY.heroCta}</span>
                <span className="pill-cta__arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </div>

          <nav
            className="hero-axes-minimal zenith-hero-stagger editorial-interactive"
            data-ready={introReady ? 'true' : 'false'}
            style={{ transitionDelay: '0.12s' }}
            aria-label="Accès rapide aux quatre domaines d’expertise"
          >
            {HERO_STELE_AXES.map((axis, idx) => {
              const hoverIdx = idx as 0 | 1 | 2 | 3;
              const domainIdx = axis.targetDomainIndex as 0 | 1 | 2 | 3;
              return (
                <a
                  key={axis.id}
                  href="#expertise"
                  className="hero-axis-link"
                  onMouseEnter={() => setHeroSteleHoverIndex(hoverIdx)}
                  onMouseLeave={() => setHeroSteleHoverIndex(-1)}
                  onFocus={() => setHeroSteleHoverIndex(hoverIdx)}
                  onBlur={() => setHeroSteleHoverIndex(-1)}
                  onClick={() => handleSelectAxis(domainIdx)}
                >
                  <span>
                    <span style={{ opacity: 0.6, marginRight: '0.38rem' }}>+</span>
                    {axis.label}
                  </span>
                  <span aria-hidden="true" style={{ fontSize: '0.75rem', opacity: 0.65 }}>
                    ↗
                  </span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      <a
        href="#about"
        className="hero-scroll-cue editorial-interactive"
        aria-label="Défiler pour explorer le portfolio"
      >
        <span className="hero-scroll-mouse" aria-hidden="true">
          <span className="hero-scroll-wheel" />
        </span>
        <span>SCROLL TO EXPLORE</span>
      </a>
    </section>
  );
}
