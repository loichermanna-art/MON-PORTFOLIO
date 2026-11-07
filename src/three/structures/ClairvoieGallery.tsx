import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MOTION_DAMPING } from '../../motion/motionConfig';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface ClairvoieGalleryProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * Scène 02 — Cadres & Portiques Géométriques en Béton Bleu Nuit (z = -9m -> -22m)
 */
export function ClairvoieGallery({ materials }: ClairvoieGalleryProps) {
  const frameGroupRef = useRef<THREE.Group>(null);
  const smoothAct = useRef(0);

  useFrame((_, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    const local = THREE.MathUtils.clamp((motionStore.scrollProgress - 0.12) / 0.18, 0, 1);
    smoothAct.current = THREE.MathUtils.damp(
      smoothAct.current,
      motionStore.reducedMotion ? 0.5 : local,
      MOTION_DAMPING.structureActuation,
      dt
    );

    if (frameGroupRef.current) {
      frameGroupRef.current.position.y = (1 - smoothAct.current) * 0.22;
    }
  });

  return (
    <group position={[0, 0, 0]} name="MidnightFramesGallery">
      {[0, 1, 2, 3].map((idx) => {
        const z = -11.5 - idx * 2.6;
        const xOffset = 1.65 + idx * 0.25;
        return (
          <group key={idx} position={[xOffset, 2.4, z]}>
            {/* Cadre architectural en béton coffré sombre */}
            <mesh position={[-1.9, 0, 0]} material={materials.darkConcrete} castShadow>
              <boxGeometry args={[0.45, 4.8, 0.65]} />
            </mesh>
            <mesh position={[1.9, 0, 0]} material={materials.darkConcrete} castShadow>
              <boxGeometry args={[0.45, 4.8, 0.65]} />
            </mesh>
            <mesh position={[0, 2.25, 0]} material={materials.deepConcrete} castShadow>
              <boxGeometry args={[4.25, 0.45, 0.65]} />
            </mesh>
            {/* Filet lumineux intérieur azur */}
            <mesh position={[1.66, 0, 0]} material={materials.luminousEdge}>
              <boxGeometry args={[0.02, 4.3, 0.02]} />
            </mesh>
          </group>
        );
      })}

      <group ref={frameGroupRef} position={[2.15, 1.9, -15.2]} rotation={[0, -0.24, 0]}>
        <mesh material={materials.architecturalGlass}>
          <boxGeometry args={[2.2, 3.4, 0.08]} />
        </mesh>
        <mesh position={[0, 1.71, 0]} material={materials.luminousCore}>
          <boxGeometry args={[2.22, 0.022, 0.09]} />
        </mesh>
      </group>
    </group>
  );
}
