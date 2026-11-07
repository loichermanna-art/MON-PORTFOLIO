import { useEffect, useRef, useState } from 'react';
import { MaskReveal } from '../components/typography/MaskReveal';
import { PROFILE_IDENTITY } from '../data/portfolioData';
import {
  motionStore,
  selectAboutPillar,
  setHoveredAboutPillar,
  subscribeAboutPillar,
} from '../motion/motionStore';
import { useSectionDepthMotion } from '../motion/useSectionDepthMotion';

/**
 * Scène 02 — À PROPOS (Couplage bidirectionnel avec la Galerie à Claire-Voie 3D) :
 * - Dégage entièrement le centre et le haut-droite du viewport pour laisser respirer
 *   les 7 brise-soleil en béton coffré et les 3 stèles vitrées gravées dans l'espace 3D.
 * - Survoler ou sélectionner un repère (dans l'UI ou directement sur la stèle 3D) oriente
 *   les lames de béton pour laisser entrer la lumière d'heure bleue et inflexit la caméra.
 */
export function AboutSceneSection() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLElement>(null);
  const [selectedPillar, setSelectedPillar] = useState<0 | 1 | 2>(
    motionStore.selectedAboutPillar
  );
  const [hoveredPillar, setHoveredPillar] = useState<-1 | 0 | 1 | 2>(
    motionStore.hoveredAboutPillar
  );

  useEffect(() => {
    return subscribeAboutPillar((sel, hov) => {
      setSelectedPillar(sel);
      setHoveredPillar(hov);
    });
  }, []);

  useSectionDepthMotion(1, leftRef, rightRef);

  const activeIdx: 0 | 1 | 2 = hoveredPillar !== -1 ? hoveredPillar : selectedPillar;
  const activeItem =
    PROFILE_IDENTITY.workPhilosophy[activeIdx] ?? PROFILE_IDENTITY.workPhilosophy[0];

  return (
    <section
      id="about"
      className="scene-section"
      data-scene-index="1"
      aria-labelledby="about-heading"
    >
      <div className="arch-container">
        <div className="arch-grid" style={{ alignItems: 'end' }}>
          <div ref={leftRef} className="spatial-left">
            <MaskReveal>
              <span className="spatial-overline">02 · À propos</span>
            </MaskReveal>

            <MaskReveal delayMs={70}>
              <h2 id="about-heading" className="spatial-heading">
                {PROFILE_IDENTITY.aboutHeading}
              </h2>
            </MaskReveal>

            <MaskReveal delayMs={140}>
              <p className="spatial-lead">{PROFILE_IDENTITY.aboutIntro}</p>
            </MaskReveal>

            <MaskReveal delayMs={190}>
              <p className="spatial-lead" style={{ marginTop: '-0.75rem' }}>
                {PROFILE_IDENTITY.aboutBridge}
              </p>
            </MaskReveal>

            <MaskReveal delayMs={240}>
              <a href="#expertise" className="pill-cta">
                <span>Explorer mes compétences</span>
                <span className="pill-cta__arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </MaskReveal>
          </div>

          <aside
            ref={rightRef}
            className="spatial-dock-right"
            aria-label="Repères académiques et travées de la claire-voie 3D"
            onMouseLeave={() => setHoveredAboutPillar(-1)}
          >
            <div className="spatial-dock-header">
              <span className="spatial-dock-kicker">
                CLAIRE-VOIE 3D · {PROFILE_IDENTITY.institution}
              </span>
              <span className="spatial-dock-status tabular">
                TRAVÉE 0{activeIdx + 1} / 03
              </span>
            </div>

            <div
              className="spatial-pill-strip"
              role="tablist"
              aria-label="Trois principes fondateurs"
            >
              {PROFILE_IDENTITY.workPhilosophy.map((item, idx) => {
                const typedIdx = idx as 0 | 1 | 2;
                const isActive = activeIdx === typedIdx;
                return (
                  <button
                    key={item.index}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className="spatial-tab-chip tabular"
                    data-active={isActive ? 'true' : 'false'}
                    onMouseEnter={() => setHoveredAboutPillar(typedIdx)}
                    onFocus={() => setHoveredAboutPillar(typedIdx)}
                    onBlur={() => setHoveredAboutPillar(-1)}
                    onClick={() => selectAboutPillar(typedIdx)}
                  >
                    <span className="spatial-tab-chip__num">{item.index}</span>
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="spatial-dock-readout" aria-live="polite">
              <strong className="spatial-dock-readout__title">{activeItem.title}</strong>
              <p className="spatial-dock-readout__desc">{activeItem.detail}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
