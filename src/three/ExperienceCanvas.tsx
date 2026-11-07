import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { createArchitecturalMaterials } from './materials/architecturalMaterials';
import { StudioDaylight } from './lighting/StudioDaylight';
import { ArchitecturalCameraRig } from './camera/ArchitecturalCameraRig';
import { PeristyleHall } from './structures/PeristyleHall';
import { EquilibriumPortal } from './structures/EquilibriumPortal';
import { ClairvoieGallery } from './structures/ClairvoieGallery';
import { DualPillarCourtyard } from './structures/DualPillarCourtyard';
import { MonolithGallery } from './structures/MonolithGallery';
import { SequentialBridge } from './structures/SequentialBridge';
import { OpenBelvedere } from './structures/OpenBelvedere';
import { WebGLFallback } from './WebGLFallback';

export function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
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

function AtriumWorld({ isMobile }: { isMobile: boolean }) {
  const materials = useMemo(() => createArchitecturalMaterials(), []);

  useEffect(() => {
    return () => {
      materials.dispose();
    };
  }, [materials]);

  return (
    <>
      <StudioDaylight isMobile={isMobile} />
      <ArchitecturalCameraRig isMobile={isMobile} />
      <PeristyleHall materials={materials} isMobile={isMobile} />
      <EquilibriumPortal materials={materials} />
      <ClairvoieGallery materials={materials} />
      <DualPillarCourtyard materials={materials} />
      <MonolithGallery materials={materials} />
      <SequentialBridge materials={materials} />
      <OpenBelvedere materials={materials} />
    </>
  );
}

export function ExperienceCanvas() {
  const [webglAvailable] = useState<boolean>(() => detectWebGLSupport());
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [eventRoot, setEventRoot] = useState<HTMLElement | undefined>(undefined);

  useEffect(() => {
    setEventRoot(document.getElementById('root') ?? undefined);
    const updateViewport = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', updateViewport, { passive: true });
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  if (!webglAvailable) {
    return <WebGLFallback />;
  }

  return (
    <div className="webgl-stage" aria-hidden="true">
      <Canvas
        shadows
        dpr={isMobile ? [1, 1.25] : [1, 1.75]}
        eventSource={eventRoot}
        eventPrefix="client"
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.06,
        }}
      >
        <Suspense fallback={null}>
          <AtriumWorld isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
