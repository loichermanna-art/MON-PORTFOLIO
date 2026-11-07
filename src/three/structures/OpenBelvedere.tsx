import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface OpenBelvedereProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * SCÈNE 06 — Escalier Monumental, Monolithes Biseautés & Sphère d'Horizon Dorée (Panel 06 & PO.jfif)
 * Grand escalier cérémoniel s'élevant entre deux hauts murs monolithiques vers la sphère
 * spéculaire et le coucher de soleil doré à l'horizon.
 */
export function OpenBelvedere({ materials }: OpenBelvedereProps) {
  const horizonSphereRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!horizonSphereRef.current || motionStore.isTabHidden) return;
    if (motionStore.reducedMotion) {
      horizonSphereRef.current.position.y = 3.15;
      return;
    }
    horizonSphereRef.current.position.y = 3.15 + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
  });

  return (
    <group name="OpenBelvedere">
      {/* Deux parois monolithiques monumentales encadrant l'horizon (Panel 06) */}
      <mesh
        position={[-4.2, 4.6, -91.5]}
        rotation={[0, 0.16, 0]}
        castShadow
        receiveShadow
        material={materials.whiteMarble}
      >
        <boxGeometry args={[2.2, 9.2, 8.5]} />
      </mesh>
      <mesh
        position={[5.2, 4.6, -91.5]}
        rotation={[0, -0.16, 0]}
        castShadow
        receiveShadow
        material={materials.whiteMarble}
      >
        <boxGeometry args={[2.2, 9.2, 8.5]} />
      </mesh>

      {/* Grand escalier cérémoniel à 7 degrés (Panel 06) */}
      {[0, 1, 2, 3, 4, 5, 6].map((step) => (
        <mesh
          key={`horizon-step-${step}`}
          position={[0.85, 0.11 + step * 0.2, -88.2 - step * 0.85]}
          receiveShadow
          castShadow
          material={materials.reflectiveSlateFloor}
        >
          <boxGeometry args={[8.6 - step * 0.35, 0.2, 0.92]} />
        </mesh>
      ))}

      {/* Grande sphère spéculaire d'horizon au sommet des marches (Panel 06) */}
      <mesh
        ref={horizonSphereRef}
        position={[1.35, 3.15, -94.8]}
        castShadow
        material={materials.specularChrome}
      >
        <sphereGeometry args={[1.68, 48, 48]} />
      </mesh>

      {/* Disque solaire chaud rayonnant en contre-jour à l'horizon (PO.jfif & Panel 06) */}
      <mesh position={[2.65, 3.25, -98.5]} material={materials.sunsetHalo}>
        <circleGeometry args={[3.8, 48]} />
      </mesh>
    </group>
  );
}
