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

/**
 * Monde 3D continu unique réunissant les 6 espaces architecturaux (z = +16m -> -98m) :
 * 01 Péristyle & Portique -> 02 Galerie à Claire-Voie -> 03 Cour des Deux Piliers ->
 * 04 Salle des Monolithes -> 05 Passerelle Séquentielle -> 06 Belvédère Ouvert.
 */
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
      <PeristyleHall materials={materials} />
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

  useEffect(() => {
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
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.03,
        }}
      >
        <Suspense fallback={null}>
          <AtriumWorld isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
