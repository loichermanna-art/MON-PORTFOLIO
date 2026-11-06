import { useEffect, useRef, useState } from 'react';
import { NAV_SCENES } from '../../data/portfolioData';
import { motionStore, subscribeActiveScene } from '../../motion/motionStore';

interface ArchitecturalHeaderProps {
  mode: 'experience' | 'mockups';
  onSwitchMode: (mode: 'experience' | 'mockups') => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export function ArchitecturalHeader({
  mode,
  onSwitchMode,
  reducedMotion,
  onToggleReducedMotion,
}: ArchitecturalHeaderProps) {
  const [activeScene, setActiveScene] = useState<number>(motionStore.activeScene);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribeActiveScene((idx) => setActiveScene(idx));
  }, []);

  // Filet de progression GPU (transform: scaleX) sans aucun re-render React
  useEffect(() => {
    if (mode !== 'experience') return;
    let rafId = 0;
    const syncBar = () => {
      if (progressBarRef.current && !motionStore.isTabHidden) {
        progressBarRef.current.style.transform = `scaleX(${motionStore.scrollProgress.toFixed(4)})`;
      }
      rafId = window.requestAnimationFrame(syncBar);
    };
    rafId = window.requestAnimationFrame(syncBar);
    return () => window.cancelAnimationFrame(rafId);
  }, [mode]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const activeNav = NAV_SCENES[activeScene] ?? NAV_SCENES[0];

  return (
    <>
      <header className="arch-header" role="banner">
        <div className="arch-container arch-header__inner">
          <a
            href="#hero"
            className="arch-brand"
            onClick={(e) => {
              setMobileMenuOpen(false);
              if (mode !== 'experience') {
                e.preventDefault();
                onSwitchMode('experience');
              }
            }}
          >
            <span className="arch-brand__name">Loïc AKANDA</span>
            <span className="arch-brand__role">Finance · Audit · Produits Numériques</span>
          </a>

          {mode === 'experience' ? (
            <nav className="arch-nav" aria-label="Navigation principale des 6 scènes">
              {NAV_SCENES.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="arch-nav__link tabular"
                  aria-current={activeScene === item.index ? 'true' : undefined}
                >
                  <span className="arch-nav__num">{item.num}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          ) : (
            <nav className="arch-nav" aria-label="Navigation des maquettes Phase 4">
              {NAV_SCENES.map((item) => (
                <a key={item.id} href={`#mockup-${item.num}`} className="arch-nav__link tabular">
                  <span className="arch-nav__num">{item.num}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          )}

          <div className="arch-header__utils">
            <div className="arch-scene-badge tabular" aria-live="polite">
              {mode === 'experience'
                ? `${activeNav.num} / 06 · ${activeNav.zone.toUpperCase()}`
                : 'PHASE 4 · MAQUETTES'}
            </div>

            <button
              type="button"
              className="arch-motion-btn"
              aria-pressed={reducedMotion}
              onClick={onToggleReducedMotion}
              title="Activer ou désactiver la réduction des mouvements"
            >
              <span>{reducedMotion ? 'Mouvement réduit' : 'Cinéma 3D'}</span>
            </button>

            <button
              type="button"
              className="arch-menu-btn"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-scene-nav"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              <span>{mobileMenuOpen ? 'Fermer' : 'Menu'}</span>
            </button>
          </div>
        </div>

        {mode === 'experience' && (
          <div ref={progressBarRef} className="arch-header__progress" aria-hidden="true" />
        )}
      </header>

      {mobileMenuOpen && (
        <nav
          id="mobile-scene-nav"
          className="arch-mobile-nav"
          aria-label="Navigation mobile"
        >
          <div className="arch-mobile-nav__list">
            {NAV_SCENES.map((item) => (
              <a
                key={item.id}
                href={mode === 'experience' ? `#${item.id}` : `#mockup-${item.num}`}
                className="arch-mobile-nav__link tabular"
                aria-current={
                  mode === 'experience' && activeScene === item.index ? 'true' : undefined
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>
                  <strong style={{ color: 'var(--accent-bronze)', marginRight: '0.5rem' }}>
                    {item.num}
                  </strong>
                  {item.label}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>{item.zone}</span>
              </a>
            ))}
          </div>

          {mode !== 'experience' && (
            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%' }}
              onClick={() => {
                setMobileMenuOpen(false);
                onSwitchMode('experience');
              }}
            >
              Retour à l’expérience 3D complète
            </button>
          )}
        </nav>
      )}
    </>
  );
}
