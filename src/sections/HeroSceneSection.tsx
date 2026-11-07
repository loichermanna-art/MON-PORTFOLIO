import { HERO_STELE_AXES, PROFILE_IDENTITY } from '../data/portfolioData';
import {
  selectExpertiseDomain,
  setFocusedExpertisePole,
  setHeroSteleHoverIndex,
} from '../motion/motionStore';

/**
 * SCÈNE 01 — HERO « MONUMENTAL CHIAROSCURO »
 * Paroi d'ombre monolithique à gauche + Grand Oculus baigné de lumière blanche à droite.
 */
export function HeroSceneSection() {
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
        <div className="chiaroscuro-split">
          <div className="editorial-monolith-copy editorial-interactive">
            <span className="eyebrow-architectural">
              {PROFILE_IDENTITY.portfolioEdition}
            </span>

            <h1
              id="hero-heading"
              style={{
                fontSize: 'var(--step-hero)',
                lineHeight: 0.96,
                letterSpacing: '-0.04em',
                marginBottom: '1.3rem',
              }}
            >
              <span style={{ display: 'block', fontWeight: 400, color: 'var(--alabaster-100)' }}>
                {PROFILE_IDENTITY.firstName}
              </span>
              <span style={{ display: 'block', fontWeight: 700, color: 'var(--white)' }}>
                {PROFILE_IDENTITY.lastName}
              </span>
            </h1>

            <p
              aria-label={PROFILE_IDENTITY.signatureCanonical}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--step-1)',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                color: 'var(--alabaster-100)',
                marginBottom: '0.8rem',
              }}
            >
              {PROFILE_IDENTITY.signaturePrefix}{' '}
              <span style={{ color: 'var(--white)', fontWeight: 600 }}>
                {PROFILE_IDENTITY.signatureHighlight}
              </span>
            </p>

            <p
              className="section-lead"
              style={{ maxWidth: '25rem', marginBottom: '2.1rem' }}
            >
              {PROFILE_IDENTITY.heroRole}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
              <a href="#about" className="pill-cta">
                <span>{PROFILE_IDENTITY.heroCta}</span>
                <span className="pill-cta__arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </div>

          <nav
            className="hero-axes-minimal editorial-interactive"
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
                    <span style={{ opacity: 0.55, marginRight: '0.55rem' }}>+</span>
                    {axis.label}
                  </span>
                  <span aria-hidden="true" style={{ fontSize: '0.78rem', opacity: 0.65 }}>
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
