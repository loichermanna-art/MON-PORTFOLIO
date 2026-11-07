/**
 * Repli architectural statique « MIDNIGHT BLUE » affiché si WebGL est indisponible.
 * Restitue fidèlement la composition de l'oculus lumineux, des marches et du sol miroir.
 */
export function WebGLFallback() {
  return (
    <div
      className="webgl-stage"
      aria-hidden="true"
      data-testid="webgl-fallback"
      style={{
        background:
          'radial-gradient(circle at 68% 36%, rgba(118, 169, 232, 0.34) 0%, rgba(16, 39, 71, 0.85) 38%, #071426 76%)',
        overflow: 'hidden',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <radialGradient id="oculusGlow" cx="68%" cy="38%" r="34%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.92" />
            <stop offset="42%" stopColor="#76A9E8" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#071426" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="floorMirror" x1="0" y1="620" x2="0" y2="900" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#102747" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#071426" stopOpacity="0.98" />
          </linearGradient>
        </defs>

        {/* Lumière de l'oculus */}
        <circle cx="980" cy="340" r="320" fill="url(#oculusGlow)" />
        <circle cx="980" cy="340" r="245" stroke="#E8EDF5" strokeWidth="4" strokeOpacity="0.85" />
        <circle cx="980" cy="340" r="345" stroke="#174477" strokeWidth="92" strokeOpacity="0.82" />

        {/* Portique béton gauche */}
        <polygon points="0,0 740,0 590,210 0,340" fill="#071426" fillOpacity="0.94" />
        <rect x="0" y="0" width="490" height="650" fill="#071426" fillOpacity="0.88" />
        <line x1="490" y1="120" x2="490" y2="650" stroke="#76A9E8" strokeOpacity="0.45" strokeWidth="1.5" />

        {/* Stèle de verre droite */}
        <polygon
          points="1085,235 1355,165 1355,595 1085,620"
          fill="#102747"
          fillOpacity="0.48"
          stroke="#76A9E8"
          strokeOpacity="0.65"
          strokeWidth="1.8"
        />

        {/* Dalle réfléchissante */}
        <rect x="0" y="640" width="1440" height="260" fill="url(#floorMirror)" />
        <line x1="0" y1="640" x2="1440" y2="640" stroke="#76A9E8" strokeOpacity="0.32" strokeWidth="1" />
      </svg>
    </div>
  );
}
