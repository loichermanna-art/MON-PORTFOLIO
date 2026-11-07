/**
 * WebGLFallback.tsx — Repli architectural sobre fidèle à la direction « Horizon Monolithique »
 * (Arches paraboliques blanches + Sphère spéculaire d'équilibre).
 */
export function WebGLFallback() {
  return (
    <div
      className="webgl-stage"
      aria-hidden="true"
      data-testid="webgl-fallback"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: '7vw',
        background:
          'radial-gradient(circle at 74% 42%, #FFFFFF 0%, #F2F4F8 54%, #E2E7F0 100%)',
      }}
    >
      <svg
        width="620"
        height="560"
        viewBox="0 0 620 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.88, maxWidth: '50vw', height: 'auto' }}
      >
        <defs>
          <radialGradient id="chrome-sphere" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="48%" stopColor="#CBD5E1" />
            <stop offset="82%" stopColor="#334155" />
            <stop offset="100%" stopColor="#94A3B8" />
          </radialGradient>
        </defs>
        <path
          d="M90 500 Q310 40 530 500"
          stroke="#FFFFFF"
          strokeWidth="26"
          fill="none"
        />
        <path
          d="M145 500 Q310 115 475 500"
          stroke="#E2E8F0"
          strokeWidth="14"
          fill="none"
        />
        <circle cx="365" cy="255" r="74" fill="url(#chrome-sphere)" />
        <ellipse
          cx="365"
          cy="255"
          rx="112"
          ry="28"
          transform="rotate(-18 365 255)"
          stroke="#64748B"
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />
        <line x1="40" y1="500" x2="580" y2="500" stroke="#1E293B" strokeOpacity="0.22" />
      </svg>
    </div>
  );
}
