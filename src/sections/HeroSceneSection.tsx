import { HERO_ARCHITECTURAL_DOMAINS, PROFILE_IDENTITY } from '../data/portfolioData';
import {
  selectExpertiseDomain,
  setFocusedExpertisePole,
  setHeroSteleHoverIndex,
} from '../motion/motionStore';

interface HeroSceneSectionProps {
  introReady?: boolean;
}

/**
 * SCÈNE 01 — INTRODUCTION / HERO
 * Hiérarchie stricte :
 * 1. Nom et identité (Loïc AKANDA · Côte d'Ivoire)
 * 2. Positionnement professionnel (3e année cycle ingénieur Finance INP-HB — Audit, Comptabilité & Solutions numériques)
 * 3. Courte phrase de présentation
 * 4. Accès aux projets
 * 5. Accès au CV
 */
export function HeroSceneSection({ introReady = true }: HeroSceneSectionProps) {
  const handleSelectAxis = (targetDomainIndex: number) => {
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
        <div className="hero-architectural-grid">
          <div className="hero-identity-column editorial-interactive">
            <span className="eyebrow-architectural">
              {PROFILE_IDENTITY.portfolioEdition}
            </span>

            <h1 id="hero-heading" className="zenith-two-tone-title">
              <span className="hero-line-mask">
                <span
                  className="hero-line-mask__inner zenith-two-tone-title__top"
                  data-ready={introReady ? 'true' : 'false'}
                >
                  {PROFILE_IDENTITY.firstName}
                </span>
              </span>
              <span className="hero-line-mask">
                <span
                  className="hero-line-mask__inner zenith-two-tone-title__bottom"
                  data-ready={introReady ? 'true' : 'false'}
                  style={{ transitionDelay: '0.09s' }}
                >
                  {PROFILE_IDENTITY.lastName}
                </span>
              </span>
            </h1>

            <p
              className="hero-positioning"
              style={{
                opacity: introReady ? 1 : 0,
                transform: introReady ? 'translateY(0)' : 'translateY(14px)',
                transition: 'opacity 0.75s var(--ease-architectural) 0.16s, transform 0.75s var(--ease-architectural) 0.16s',
              }}
            >
              {PROFILE_IDENTITY.positioning}
            </p>

            <p
              className="section-lead"
              style={{
                marginBottom: '2rem',
                opacity: introReady ? 1 : 0,
                transform: introReady ? 'translateY(0)' : 'translateY(14px)',
                transition: 'opacity 0.75s var(--ease-architectural) 0.24s, transform 0.75s var(--ease-architectural) 0.24s',
              }}
            >
              {PROFILE_IDENTITY.heroSummary}
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.85rem',
                opacity: introReady ? 1 : 0,
                transform: introReady ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 0.75s var(--ease-architectural) 0.3s, transform 0.75s var(--ease-architectural) 0.3s',
              }}
            >
              <a href="#projects" className="pill-cta">
                <span>{PROFILE_IDENTITY.heroPrimaryCta}</span>
                <span className="pill-cta__arrow" aria-hidden="true">
                  →
                </span>
              </a>

              <a
                href={PROFILE_IDENTITY.cvUrl}
                download={PROFILE_IDENTITY.cvDownloadName}
                className="pill-cta-silver"
              >
                <span>{PROFILE_IDENTITY.heroSecondaryCta}</span>
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <nav
            className="hero-domain-steles editorial-interactive"
            aria-label="Domaines d’activité mis en lumière dans l’espace 3D"
          >
            {HERO_ARCHITECTURAL_DOMAINS.map((axis, idx) => {
              const hoverIdx = idx as 0 | 1 | 2 | 3;
              return (
                <a
                  key={axis.id}
                  href="#expertise"
                  className="hero-domain-stele-link"
                  onMouseEnter={() => setHeroSteleHoverIndex(hoverIdx)}
                  onMouseLeave={() => setHeroSteleHoverIndex(-1)}
                  onFocus={() => setHeroSteleHoverIndex(hoverIdx)}
                  onBlur={() => setHeroSteleHoverIndex(-1)}
                  onClick={() => handleSelectAxis(axis.targetDomainIndex)}
                >
                  <span>{axis.label}</span>
                  <span aria-hidden="true" style={{ color: 'var(--azure-400)' }}>
                    0{idx + 1} ↗
                  </span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
}
