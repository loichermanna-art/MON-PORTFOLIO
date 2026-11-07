import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface SequentialBridgeProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * Scène 05 — Anneau & Arche Séquentielle en 6 Segments (z = -68m -> -78m)
 */
export function SequentialBridge({ materials }: SequentialBridgeProps) {
  const ringRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    if (ringRef.current) {
      const targetRot = -motionStore.activeProcessStep * ((Math.PI * 2) / 6);
      ringRef.current.rotation.z = THREE.MathUtils.damp(
        ringRef.current.rotation.z,
        motionStore.reducedMotion ? 0 : targetRot + clock.getElapsedTime() * 0.05,
        4.5,
        dt
      );
    }
  });

  return (
    <group position={[2.25, 2.45, -73.5]} rotation={[0.18, -0.32, 0]} name="SequentialRing">
      <mesh material={materials.specularChrome} castShadow>
        <sphereGeometry args={[0.52, 40, 40]} />
      </mesh>

      <group ref={ringRef}>
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const arcSpan = (Math.PI * 2) / 6;
          return (
            <mesh
              key={idx}
              rotation={[0, 0, idx * arcSpan]}
              material={materials.architecturalGlass}
            >
              <torusGeometry args={[2.25, 0.14, 18, 28, arcSpan * 0.84]} />
            </mesh>
          );
        })}
        <mesh material={materials.luminousEdge}>
          <torusGeometry args={[2.25, 0.018, 12, 96]} />
        </mesh>
      </group>
    </group>
  );
}
