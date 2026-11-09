import { Suspense, lazy, useEffect, useMemo } from 'react';
import {
  detectDeviceTier,
  libraryMotionState,
  useLibraryStore,
} from './state/useLibraryStore';
import { LibraryHeaderBar } from './ui/LibraryHeaderBar';
import { SpatialWalkHUD } from './ui/SpatialWalkHUD';
import { LibraryDossierModal } from './ui/LibraryDossierModal';

const LazyLibraryEntranceCanvas = lazy(() =>
  import('./scenes/LibraryEntranceCanvas').then((m) => ({
    default: m.LibraryEntranceCanvas,
  }))
);

function detectWebGLSupportSync(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function ArchitecturalFallbackBackdrop() {
  return (
    <div className="library-static-fallback" aria-hidden="true">
      <img
        src="/scenes/library-entrance-fallback.jpg"
        alt=""
        width={1600}
        height={900}
        fetchPriority="high"
        decoding="async"
      />
      <div className="library-static-fallback__vignette" />
    </div>
  );
}

export function InfiniteLibraryExperience() {
  const webglSupported = useMemo(() => detectWebGLSupportSync(), []);

  useEffect(() => {
    const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mql) {
      useLibraryStore.getState().setSystemReducedMotion(mql.matches);
      const onMotionChange = (ev: MediaQueryListEvent) =>
        useLibraryStore.getState().setSystemReducedMotion(ev.matches);
      mql.addEventListener?.('change', onMotionChange);

      const onResize = () =>
        useLibraryStore.getState().setDeviceTier(detectDeviceTier());
      const onVisibility = () => {
        libraryMotionState.isTabHidden = document.hidden;
      };

      window.addEventListener('resize', onResize, { passive: true });
      document.addEventListener('visibilitychange', onVisibility);

      return () => {
        mql.removeEventListener?.('change', onMotionChange);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVisibility);
      };
    }
    return undefined;
  }, []);

  return (
    <div className="lib-app-root lib-app-root--walkthrough">
      <a href="#walk-hero-title" className="lib-skip-link">
        Aller directement à la navigation principale
      </a>

      <LibraryHeaderBar />

      {/* Interactive Full-Viewport 3D Walkthrough World */}
      <div className="lib-viewport-stage lib-viewport-stage--interactive">
        {webglSupported ? (
          <Suspense fallback={<ArchitecturalFallbackBackdrop />}>
            <LazyLibraryEntranceCanvas webglSupported={webglSupported} />
          </Suspense>
        ) : (
          <ArchitecturalFallbackBackdrop />
        )}
      </div>

      {/* Spatial Walkthrough HUD (pointer-events: none wrapper so 3D world receives clicks & drags) */}
      <main id="library-entrance-main" className="walk-main-layer">
        <SpatialWalkHUD />
      </main>

      {/* Optional Accessible Reading Mode Modal */}
      <LibraryDossierModal />
    </div>
  );
}
