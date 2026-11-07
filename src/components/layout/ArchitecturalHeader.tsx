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
 * Navigation Exécutive « SKY ZENITH » :
 * - Filet supérieur de progression d'horizon (0 -> 100 %)
 * - Barre supérieure aérienne : marque « Loïc AKANDA. », liens des 6 chapitres, horloge GMT Côte d'Ivoire & Menu
 * - Rail d'altitude discret 01/06 -> 06/06 à gauche + accès rapide GitHub / LinkedIn / Courriel
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
  const [clockLabel, setClockLabel] = useState<string>('');
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
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat('fr-FR', {
          timeZone: 'Africa/Abidjan',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date());
        setClockLabel(`CI · ${formatted} GMT`);
      } catch {
        setClockLabel('CI · UTC+00');
      }
    };
    updateClock();
    const id = window.setInterval(updateClock, 30000);
    return () => window.clearInterval(id);
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
              <span>Loïc AKANDA</span>
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
              {clockLabel && (
                <span className="hud-clock-pill tabular" aria-hidden="true">
                  <span className="hud-clock-pill__dot" />
                  <span>{clockLabel}</span>
                </span>
              )}

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

        <div className="hud-socials-bottom" aria-label="Réseaux professionnels et contact">
          <a
            href={PROFILE_IDENTITY.contacts.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hud-social-circle"
            aria-label="Profil GitHub de Loïc AKANDA"
            title="GitHub"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.05 11.05 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>

          <a
            href="#contact"
            className="hud-social-circle"
            aria-label="LinkedIn — Accéder aux coordonnées"
            title="LinkedIn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4.98 3.5a2.49 2.49 0 1 1 0 4.98 2.49 2.49 0 0 1 0-4.98ZM3 9h4v12H3V9Zm7 0h3.83v1.64h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13V21h-4v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95V21h-4V9Z" />
            </svg>
          </a>

          <a
            href="#contact"
            className="hud-social-circle"
            aria-label="Envoyer un message — Section Contact"
            title="Contact E-mail"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
        </div>
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
                  marginBottom: '1.75rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--slate-600)',
                    letterSpacing: '0.16em',
                  }}
                >
                  LOÏC AKANDA · 01 — 06
                </span>
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ minHeight: '2.25rem', padding: '0.3rem 0.95rem', fontSize: '0.8rem' }}
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
                        fontSize: '0.75rem',
                        color: 'var(--slate-600)',
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
                gap: '0.7rem',
                paddingTop: '1.35rem',
                borderTop: '1px solid var(--line-hairline)',
              }}
            >
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
                  ? 'Planches aériennes (01 — 06)'
                  : 'Retour à l’expérience immersive'}
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
