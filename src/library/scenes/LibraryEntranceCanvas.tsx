import { Component, Suspense, useEffect, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import { useLibraryMaterials } from '../resources/useLibraryMaterials';
import { FirstPersonWalkRig } from '../camera/FirstPersonWalkRig';
import { LibraryLightingRig } from './LibraryLightingRig';
import { MetropolisWorld3D } from './MetropolisWorld3D';
import { WorldArchitecture3D } from './WorldArchitecture3D';
import { WorldInteractiveStations3D } from './WorldInteractiveStations3D';
import { useLibraryStore } from '../state/useLibraryStore';

export function detectWebGLAvailable(): boolean {
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

interface CanvasErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface CanvasErrorBoundaryState {
  hasError: boolean;
}

class CanvasErrorBoundary extends Component<
  CanvasErrorBoundaryProps,
  CanvasErrorBoundaryState
> {
  state: CanvasErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): CanvasErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function WalkthroughWorldSceneContent() {
  const materials = useLibraryMaterials();
  const setSceneReady = useLibraryStore((s) => s.setSceneReady);

  useEffect(() => {
    setSceneReady(true);
  }, [setSceneReady]);

  return (
    <>
      <FirstPersonWalkRig />
      <LibraryLightingRig />
      <MetropolisWorld3D materials={materials} />
      <WorldArchitecture3D materials={materials} />
      <WorldInteractiveStations3D materials={materials} />
    </>
  );
}

export function LibraryStaticArchitecturalFallback() {
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

interface LibraryEntranceCanvasProps {
  webglSupported: boolean;
}

export function LibraryEntranceCanvas({
  webglSupported,
}: LibraryEntranceCanvasProps) {
  const deviceTier = useLibraryStore((s) => s.deviceTier);

  if (!webglSupported) {
    return <LibraryStaticArchitecturalFallback />;
  }

  const maxDpr = deviceTier === 'mobile' ? 1.5 : 2;

  return (
    <div className="library-canvas-layer">
      <CanvasErrorBoundary fallback={<LibraryStaticArchitecturalFallback />}>
        <Canvas
          shadows={deviceTier !== 'mobile' ? 'soft' : false}
          dpr={[1, maxDpr]}
          camera={{ position: [0, 1.66, 11.2], fov: 49, near: 0.12, far: 480 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
          }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.AgXToneMapping;
            gl.toneMappingExposure = 1.04;
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
        >
          <AdaptiveDpr pixelated={false} />
          <Suspense fallback={null}>
            <WalkthroughWorldSceneContent />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
