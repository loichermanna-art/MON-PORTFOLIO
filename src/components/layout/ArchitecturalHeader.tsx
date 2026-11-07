import { useEffect, useRef, useState } from 'react';
import { NAV_SCENES, PROFILE_IDENTITY } from '../../data/portfolioData';
import {
  motionStore,
  subscribeActiveScene,
} from '../../motion/motionStore';

interface ArchitecturalHeaderProps {
  mode: 'experience' | 'mockups';
  onSwitchMode: (mode: 'experience' | 'mockups') => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

/**
 * Shell de Navigation Architectural « MIDNIGHT BLUE » :
 * - Monogramme LA. (#FFFFFF + point #76A9E8)
 * - 6 séquences narratives explicites
 * - Accès direct au CV PDF officiel + Menu d'options accessibles (Mouvement réduit)
 * - Rail vertical gauche 01/06 -> 06/06
 */
export function ArchitecturalHeader({
  mode,
  onSwitchMode,
  reducedMotion,
  onToggleReducedMotion,
}: ArchitecturalHeaderProps) {
  const [activeScene, setActiveScene] = useState<number>(motionStore.activeScene);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const progressFillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return subscribeActiveScene((idx) => setActiveScene(idx));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 28);
      if (progressFillRef.current) {
        const doc = document.documentElement;
        const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
        const ratio = Math.max(0, Math.min(1, window.scrollY / maxScroll));
        progressFillRef.current.style.transform = `scaleX(${ratio.toFixed(4)})`;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const activeOffsetRem = activeScene * 3.2;

  return (
    <>
      <header role="banner">
        <div className="sky-navbar" data-scrolled={scrolled ? 'true' : 'false'}>
          {mode === 'experience' && (
            <div className="sky-navbar__progress-track" aria-hidden="true">
              <div
                ref={progressFillRef}
                className="sky-navbar__progress-fill"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
          )}

          <div className="sky-navbar__inner">
            <a
              href="#hero"
              className="hud-brand"
              aria-label="Loïc AKANDA — Retour en haut de page"
              onClick={(e) => {
                setMenuOpen(false);
                if (mode !== 'experience') {
                  e.preventDefault();
                  onSwitchMode('experience');
                }
              }}
            >
              <span>LA</span>
              <span className="hud-brand__dot">.</span>
            </a>

            {mode === 'experience' && (
              <nav
                className="sky-navbar__links"
                aria-label="Barre de navigation supérieure"
              >
                {NAV_SCENES.map((scene) => {
                  const isCurrent = activeScene === scene.index;
                  return (
                    <a
                      key={scene.id}
                      href={`#${scene.id}`}
                      className="sky-navbar__link"
                      aria-current={isCurrent ? 'true' : undefined}
                    >
                      {scene.label}
                    </a>
                  );
                })}
              </nav>
            )}

            <div className="hud-top-right">
              <a
                href={PROFILE_IDENTITY.cvUrl}
                download={PROFILE_IDENTITY.cvDownloadName}
                className="hud-cv-link"
              >
                <span>CV PDF</span>
                <span aria-hidden="true">↓</span>
              </a>

              <button
                type="button"
                className="hud-menu-trigger"
                aria-expanded={menuOpen}
                aria-controls="hud-navigation-drawer"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span>{menuOpen ? 'Fermer' : 'Menu'}</span>
                <svg
                  width="18"
                  height="12"
                  viewBox="0 0 18 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="2" y1="1.5" x2="17" y2="1.5" />
                  <line x1="0.5" y1="6" x2="17" y2="6" />
                  <line x1="5" y1="10.5" x2="17" y2="10.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {mode === 'experience' && (
          <nav
            className="hud-rail-nav"
            aria-label="Navigation directe des six sections"
          >
            <ul className="hud-rail-list tabular">
              {NAV_SCENES.map((scene, index) => {
                const isCurrent = activeScene === scene.index;
                return (
                  <li key={scene.id} style={{ position: 'relative' }}>
                    {index === 0 && (
                      <span
                        aria-hidden="true"
                        className="hud-rail-active-bar"
                        style={{
                          left: 'calc(-0.85rem - 1.5px)',
                          transform: `translateY(${activeOffsetRem}rem)`,
                        }}
                      />
                    )}
                    <a
                      href={`#${scene.id}`}
                      className="hud-rail-item"
                      aria-current={isCurrent ? 'true' : undefined}
                      aria-label={`Section ${scene.num} sur 06 — ${scene.label}`}
                      title={`${scene.num} — ${scene.label}`}
                    >
                      <span className="hud-rail-item__num">{scene.num}</span>
                      <span className="hud-rail-item__total">/06</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </header>

      {menuOpen && (
        <div
          className="hud-drawer-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMenuOpen(false);
          }}
        >
          <nav
            id="hud-navigation-drawer"
            className="hud-drawer"
            aria-label="Menu principal"
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--azure-400)',
                    letterSpacing: '0.14em',
                  }}
                >
                  LOÏC AKANDA · 01 — 06
                </span>
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ minHeight: '2.2rem', padding: '0.3rem 0.9rem', fontSize: '0.8rem' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Fermer
                </button>
              </div>

              <div>
                {NAV_SCENES.map((item) => (
                  <a
                    key={item.id}
                    href={mode === 'experience' ? `#${item.id}` : `#mockup-${item.num}`}
                    className="hud-drawer__link tabular"
                    aria-current={
                      mode === 'experience' && activeScene === item.index ? 'true' : undefined
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.74rem',
                        color: 'var(--ice-300)',
                      }}
                    >
                      {item.num}/06
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gap: '0.65rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--line-hairline)',
              }}
            >
              <a
                href={PROFILE_IDENTITY.cvUrl}
                download={PROFILE_IDENTITY.cvDownloadName}
                className="btn-primary"
                onClick={() => setMenuOpen(false)}
              >
                Télécharger le CV (PDF) ↓
              </a>

              <button
                type="button"
                className="btn-secondary"
                aria-pressed={reducedMotion}
                onClick={onToggleReducedMotion}
              >
                {reducedMotion ? 'Mouvement réduit : Activé' : 'Activer le mouvement réduit'}
              </button>

              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setMenuOpen(false);
                  onSwitchMode(mode === 'experience' ? 'mockups' : 'experience');
                }}
              >
                {mode === 'experience'
                  ? 'Vue synthétique des 6 scènes'
                  : 'Retour à l’expérience immersive'}
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
