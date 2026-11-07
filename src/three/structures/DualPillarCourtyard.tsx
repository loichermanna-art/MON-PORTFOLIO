import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface DualPillarCourtyardProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * Scène 03 — Quatre Stèles Monolithiques d'Expertise (z = -25m -> -36m)
 * Chaque colonne correspond à l'un des 4 domaines sélectionnables et s'élève lorsqu'il est actif.
 */
export function DualPillarCourtyard({ materials }: DualPillarCourtyardProps) {
  const pillarRefs = useRef<Array<THREE.Group | null>>([null, null, null, null]);

  useFrame((_, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    const activeIdx =
      motionStore.focusedExpertisePole >= 0
        ? motionStore.focusedExpertisePole
        : motionStore.selectedExpertiseIndex;

    pillarRefs.current.forEach((group, idx) => {
      if (!group) return;
      const isSelected = idx === activeIdx;
      const targetY = isSelected ? 0.36 : 0;
      group.position.y = THREE.MathUtils.damp(group.position.y, targetY, 6, dt);
    });
  });

  const positions: Array<[number, number]> = [
    [0.65, -28.8],
    [1.85, -29.8],
    [3.05, -29.2],
    [4.25, -28.2],
  ];

  return (
    <group name="FourExpertiseMonoliths">
      {positions.map(([x, z], idx) => (
        <group
          key={idx}
          ref={(el) => {
            pillarRefs.current[idx] = el;
          }}
          position={[x, 0, z]}
          rotation={[0, -0.22, 0]}
        >
          <mesh position={[0, 1.95, 0]} material={materials.darkConcrete} castShadow receiveShadow>
            <boxGeometry args={[0.82, 3.9, 0.82]} />
          </mesh>
          <mesh position={[0, 2.05, 0.44]} material={materials.architecturalGlass}>
            <boxGeometry args={[0.74, 3.5, 0.05]} />
          </mesh>
          <mesh position={[0, 3.92, 0]} material={materials.luminousEdge}>
            <boxGeometry args={[0.84, 0.03, 0.84]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
