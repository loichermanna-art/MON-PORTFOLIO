/**
 * Fallback statique sans WebGL : conserve la lisibilité, la profondeur Midnight Blue (#071426)
 * et l'horizon stratosphérique sans dégrader la consultation du portfolio.
 */
export function WebGLFallback() {
  return (
    <div
      data-testid="webgl-fallback"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: '#071426',
        backgroundImage:
          'linear-gradient(180deg, rgba(7,20,38,0.62) 0%, rgba(16,39,71,0.34) 52%, rgba(7,20,38,0.82) 100%), url(/scenes/dusk-01-zenith.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    />
  );
}
