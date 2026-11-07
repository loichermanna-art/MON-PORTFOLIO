/**
 * Fallback haute fidélité lorsque WebGL est indisponible (ex. navigateurs restreints ou tests JSDOM) :
 * Affiche la planche architecturale photoréaliste d'ouverture avec son clair-obscur monumental.
 */
export function WebGLFallback() {
  return (
    <div
      className="webgl-stage"
      data-testid="webgl-fallback"
      aria-hidden="true"
      style={{
        backgroundColor: '#0A0C10',
        backgroundImage:
          'linear-gradient(90deg, rgba(10, 12, 16, 0.72) 0%, rgba(10, 12, 16, 0.24) 42%, rgba(10, 12, 16, 0.05) 100%), url(/scenes/scene-01-hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}
