import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface DualPillarCourtyardProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * Scène 03 — La Cour des Quatre Piliers Muséaux (z = -26m -> -36m)
 * Quatre stèles architecturales massives ancrées au sol (zéro volume flottant) :
 * l'éclairage rasant zénithal s'intensifie sur le pilier correspondant au domaine sélectionné.
 */
export function DualPillarCourtyard({ materials }: DualPillarCourtyardProps) {
  const coveRefs = useRef<Array<THREE.Mesh | null>>([null, null, null, null]);

  useFrame((_, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    const activeIdx =
      motionStore.focusedExpertisePole >= 0
        ? motionStore.focusedExpertisePole
        : motionStore.selectedExpertiseIndex;

    coveRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const targetScaleY = idx === activeIdx ? 1.45 : 0.45;
      mesh.scale.y = THREE.MathUtils.damp(mesh.scale.y, targetScaleY, 6, dt);
    });
  });

  const pillars: Array<[number, number]> = [
    [1.05, -28.6],
    [2.15, -29.8],
    [3.25, -29.2],
    [4.35, -28.0],
  ];

  return (
    <group name="FourGroundedExpertisePiers">
      {/* Linteau porteur reliant le sommet des 4 piliers */}
      <mesh position={[2.7, 4.65, -28.9]} rotation={[0, -0.18, 0]} material={materials.deepConcrete}>
        <boxGeometry args={[5.4, 0.48, 2.6]} />
      </mesh>

      {pillars.map(([x, z], idx) => (
        <group key={idx} position={[x, 0, z]} rotation={[0, -0.22, 0]}>
          {/* Plinthe d'assise en acier sombre */}
          <mesh position={[0, 0.04, 0]} material={materials.anodizedSteel}>
            <boxGeometry args={[0.84, 0.08, 0.84]} />
          </mesh>

          {/* Fût monolithique en béton banché */}
          <mesh position={[0, 2.24, 0]} material={materials.boardConcrete} castShadow receiveShadow>
            <boxGeometry args={[0.88, 4.32, 0.88]} />
          </mesh>

          {/* Parement verre feuilleté affleurant */}
          <mesh position={[0, 2.24, 0.455]} material={materials.structuralGlass}>
            <planeGeometry args={[0.74, 3.85]} />
          </mesh>

          {/* Lèche-mur lumineux doux en tête de pilier */}
          <mesh
            ref={(el) => {
              coveRefs.current[idx] = el;
            }}
            position={[0, 4.15, 0.46]}
            rotation={[Math.PI, 0, 0]}
            material={materials.softCoveLight}
          >
            <planeGeometry args={[0.76, 1.1]} />
          </mesh>

          {/* Ombre d'occlusion ambiante au pied du pilier */}
          <mesh
            position={[0, 0.005, 0.58]}
            rotation={[-Math.PI / 2, 0, 0]}
            material={materials.contactAO}
          >
            <planeGeometry args={[1.15, 0.5]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
