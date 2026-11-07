import { useEffect, useRef, useState } from 'react';
import { NAV_SCENES, PROFILE_IDENTITY } from '../../data/portfolioData';
import { motionStore, subscribeActiveScene } from '../../motion/motionStore';

interface ArchitecturalHeaderProps {
  mode: 'experience' | 'mockups';
  onSwitchMode: (mode: 'experience' | 'mockups') => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

/**
 * Shell HUD Architectural fidèle à la planche des 6 panneaux :
 * 1. Rail vertical gauche fixe : monogramme géométrique « LA », compteur « 01 /06 » + trait
 *    vertical dynamique, et 3 icônes minimalistes en pied (GitHub, LinkedIn, Contact).
 * 2. Déclencheur minimaliste haut-droit « Menu ⋮ » ouvrant un tiroir latéral épuré.
 */
export function ArchitecturalHeader({
  mode,
  onSwitchMode,
  reducedMotion,
  onToggleReducedMotion,
}: ArchitecturalHeaderProps) {
  const [activeScene, setActiveScene] = useState<number>(motionStore.activeScene);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const progressFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribeActiveScene((idx) => setActiveScene(idx));
  }, []);

  useEffect(() => {
    if (mode !== 'experience') return;
    let rafId = 0;
    const syncProgress = () => {
      if (progressFillRef.current && !motionStore.isTabHidden) {
        const p = Math.max(0.12, motionStore.scrollProgress);
        progressFillRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
      }
      rafId = window.requestAnimationFrame(syncProgress);
    };
    rafId = window.requestAnimationFrame(syncProgress);
    return () => window.cancelAnimationFrame(rafId);
  }, [mode]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const activeNav = NAV_SCENES[activeScene] ?? NAV_SCENES[0];
  const isDusk = mode === 'experience' && activeScene === 5;

  return (
    <>
      <header role="banner">
        {/* Rail vertical gauche signature */}
        <div className="hud-rail" data-dusk={isDusk ? 'true' : 'false'}>
          <a
            href="#hero"
            className="hud-monogram"
            aria-label="Loïc AKANDA — Retour à l’accueil"
            onClick={(e) => {
              setMenuOpen(false);
              if (mode !== 'experience') {
                e.preventDefault();
                onSwitchMode('experience');
              }
            }}
          >
            <svg width="30" height="26" viewBox="0 0 30 26" fill="none" aria-hidden="true">
              <path
                d="M3 3V23M9 23L17.5 3L26 23M12.2 16.5H22.8"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <div className="hud-progress-block tabular" aria-live="polite">
            <span className="hud-progress-num">
              {mode === 'experience' ? activeNav.num : '04'}
            </span>
            <span className="hud-progress-total">/06</span>
            <div className="hud-progress-line" aria-hidden="true">
              <div ref={progressFillRef} className="hud-progress-fill" />
            </div>
          </div>

          <div className="hud-socials" aria-label="Accès rapides">
            <a
              href={PROFILE_IDENTITY.contacts.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hud-social-link"
              aria-label="GitHub de Loïc AKANDA"
              title="GitHub"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.05 11.05 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
            </a>

            <a
              href="#contact"
              className="hud-social-link"
              aria-label="LinkedIn & Réseau professionnel"
              title="LinkedIn (Section Contact)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.49 2.49 0 1 1 0 4.98 2.49 2.49 0 0 1 0-4.98ZM3 9h4v12H3V9Zm7 0h3.83v1.64h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13V21h-4v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95V21h-4V9Z" />
              </svg>
            </a>

            <a
              href="#contact"
              className="hud-social-link"
              aria-label="Contacter Loïc AKANDA"
              title="Me contacter"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Coin supérieur droit minimaliste : « Menu ⋮ » */}
        <div className="hud-top-right">
          <button
            type="button"
            className="hud-menu-trigger"
            data-dusk={isDusk ? 'true' : 'false'}
            aria-expanded={menuOpen}
            aria-controls="hud-navigation-drawer"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span>{menuOpen ? 'Fermer' : 'Menu'}</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <circle cx="8" cy="3" r="1.4" />
              <circle cx="8" cy="8" r="1.4" />
              <circle cx="8" cy="13" r="1.4" />
            </svg>
          </button>
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
            aria-label="Navigation principale"
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '2rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--ink-muted)',
                    letterSpacing: '0.06em',
                  }}
                >
                  NAVIGATION · 01 — 06
                </span>
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ minHeight: '2.25rem', padding: '0.3rem 0.85rem', fontSize: '0.8rem' }}
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
                        fontSize: '0.78rem',
                        color: 'var(--ink-muted)',
                      }}
                    >
                      {item.num}
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
                borderTop: '1px solid var(--line-subtle)',
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
                  ? 'Consulter les planches maquettes (Phase 4)'
                  : 'Retour à l’expérience 3D'}
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
