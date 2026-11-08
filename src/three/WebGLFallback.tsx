/**
 * Fallback haute fidélité lorsque WebGL est indisponible (navigateurs restreints ou tests JSDOM) :
 * Affiche l'horizon crépusculaire stratosphérique apaisant « Twilight Zenith ».
 */
export function WebGLFallback() {
  return (
    <div
      className="webgl-stage"
      data-testid="webgl-fallback"
      aria-hidden="true"
      style={{
        backgroundColor: '#080F1C',
        backgroundImage:
          'linear-gradient(180deg, rgba(8, 15, 28, 0.52) 0%, rgba(10, 19, 34, 0.28) 52%, rgba(8, 15, 28, 0.68) 100%), url(/scenes/dusk-01-zenith.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}
