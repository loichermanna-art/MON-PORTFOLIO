/**
 * Fallback haute fidélité lorsque WebGL est indisponible (navigateurs restreints ou tests JSDOM) :
 * Affiche la vue aérienne stratosphérique lumineuse d'ouverture « Sky Zenith ».
 */
export function WebGLFallback() {
  return (
    <div
      className="webgl-stage"
      data-testid="webgl-fallback"
      aria-hidden="true"
      style={{
        backgroundColor: '#F8FAFC',
        backgroundImage:
          'linear-gradient(180deg, rgba(248, 250, 252, 0.55) 0%, rgba(248, 250, 252, 0.12) 55%, rgba(248, 250, 252, 0.0) 100%), url(/scenes/sky-01-hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}
