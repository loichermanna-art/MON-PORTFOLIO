/**
 * Repli architectural sobre « Heure Bleue & Béton Banché » lorsque WebGL est indisponible.
 */
export function WebGLFallback() {
  return (
    <div
      className="webgl-stage"
      aria-hidden="true"
      data-testid="webgl-fallback"
      style={{
        background:
          'linear-gradient(180deg, #061122 0%, #0E2340 48%, #071426 100%)',
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
          <linearGradient id="skyHorizon" x1="920" y1="80" x2="920" y2="620" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#163662" />
            <stop offset="65%" stopColor="#5888C1" />
            <stop offset="100%" stopColor="#D5E7F9" />
          </linearGradient>
          <linearGradient id="basaltReflection" x1="0" y1="620" x2="0" y2="900" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0E223D" />
            <stop offset="100%" stopColor="#06101E" />
          </linearGradient>
        </defs>

        {/* Ouverture circulaire architecturale vers l'horizon d'heure bleue */}
        <circle cx="940" cy="360" r="240" fill="url(#skyHorizon)" />
        <circle cx="940" cy="360" r="335" stroke="#0C1B31" strokeWidth="190" />

        {/* Portique et poutres en béton banché */}
        <rect x="0" y="0" width="1440" height="96" fill="#071324" />
        <rect x="0" y="0" width="510" height="640" fill="#081528" />

        {/* Baie vitrée à meneaux acier droite */}
        <g stroke="#0E1B2E" strokeWidth="5">
          <line x1="1120" y1="96" x2="1120" y2="640" />
          <line x1="1235" y1="96" x2="1235" y2="640" />
          <line x1="1350" y1="96" x2="1350" y2="640" />
        </g>

        {/* Dallage de basalte et bassin miroir */}
        <rect x="0" y="640" width="1440" height="260" fill="url(#basaltReflection)" />
      </svg>
    </div>
  );
}
