import { Component, Suspense, useEffect, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import { useLibraryMaterials } from '../resources/useLibraryMaterials';
import { EntranceCameraRig } from '../camera/EntranceCameraRig';
import { LibraryLightingRig } from './LibraryLightingRig';
import { EntranceVestibule3D } from './EntranceVestibule3D';
import { InteriorLibraryPerspective3D } from './InteriorLibraryPerspective3D';
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

function LibraryEntranceSceneContent({
  onTogglePortal,
}: {
  onTogglePortal: () => void;
}) {
  const materials = useLibraryMaterials();
  const setSceneReady = useLibraryStore((s) => s.setSceneReady);

  useEffect(() => {
    setSceneReady(true);
  }, [setSceneReady]);

  return (
    <>
      <EntranceCameraRig />
      <LibraryLightingRig />
      <EntranceVestibule3D
        materials={materials}
        onTogglePortal={onTogglePortal}
      />
      <InteriorLibraryPerspective3D materials={materials} />
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
  onTogglePortal: () => void;
}

export function LibraryEntranceCanvas({
  webglSupported,
  onTogglePortal,
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
          camera={{ position: [0, 1.66, 8.85], fov: 41, near: 0.12, far: 95 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
          }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 0.98;
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
        >
          <AdaptiveDpr pixelated={false} />
          <Suspense fallback={null}>
            <LibraryEntranceSceneContent onTogglePortal={onTogglePortal} />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
