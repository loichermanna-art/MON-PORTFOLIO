/**
 * WebGLFallback.tsx — Repli architectural sobre lorsque WebGL est indisponible (Brief §10).
 * Conserve la perspective axiale du Péristyle en dessin géométral minéral sans perte de lisibilité.
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
        paddingRight: '6vw',
        background:
          'radial-gradient(circle at 72% 38%, rgba(252,251,248,0.95) 0%, rgba(245,242,235,1) 58%, rgba(234,229,218,0.85) 100%)',
      }}
    >
      <svg
        width="560"
        height="560"
        viewBox="0 0 560 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.72, maxWidth: '48vw', height: 'auto' }}
      >
        {/* Perspective axiale du Péristyle & Portique d'Équilibre */}
        <rect x="90" y="70" width="380" height="420" stroke="#6E502F" strokeOpacity="0.32" strokeWidth="1" />
        <rect x="145" y="118" width="270" height="372" stroke="#141413" strokeOpacity="0.18" strokeWidth="1.5" />
        <rect x="200" y="168" width="160" height="322" stroke="#6E502F" strokeOpacity="0.5" strokeWidth="1.5" />
        <line x1="280" y1="70" x2="280" y2="520" stroke="#9E7C4E" strokeOpacity="0.55" strokeWidth="1" />
        <line x1="172" y1="210" x2="388" y2="210" stroke="#183B56" strokeOpacity="0.65" strokeWidth="2" />
        <polygon points="280,295 288,308 280,321 272,308" fill="#6E502F" fillOpacity="0.65" />
        <line x1="40" y1="490" x2="520" y2="490" stroke="#141413" strokeOpacity="0.16" strokeWidth="1" />
      </svg>
    </div>
  );
}
