import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface MonolithGalleryProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * Scène 04 — Galerie Architecturale des Projets (z = -42m -> -58m)
 * Trois stèles muséales intégrées dans l'espace pour LAURA HOUSE, SassySkin et EtuCo.
 */
export function MonolithGallery({ materials }: MonolithGalleryProps) {
  const steleRefs = useRef<Array<THREE.Group | null>>([null, null, null]);

  useFrame((_, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);

    steleRefs.current.forEach((group, idx) => {
      if (!group) return;
      const isFocused = motionStore.focusedProjectIndex === idx;
      const baseZ = [-46.5, -49.2, -52.0][idx];
      const targetZ = isFocused ? baseZ + 0.55 : baseZ;
      group.position.z = THREE.MathUtils.damp(group.position.z, targetZ, 5.5, dt);
    });
  });

  const coords: Array<[number, number, number]> = [
    [1.15, 2.05, -46.5],
    [2.85, 2.15, -49.2],
    [4.45, 2.0, -52.0],
  ];

  return (
    <group name="ProjectsArchitecturalGallery">
      {coords.map(([x, y, z], idx) => (
        <group
          key={idx}
          ref={(el) => {
            steleRefs.current[idx] = el;
          }}
          position={[x, y, z]}
          rotation={[0, -0.34, 0]}
        >
          {/* Socle porteur en béton sombre */}
          <mesh position={[0, -1.35, -0.12]} material={materials.deepConcrete} castShadow>
            <boxGeometry args={[2.1, 1.5, 0.36]} />
          </mesh>
          {/* Châssis acier & dalle projet */}
          <mesh position={[0, 0, -0.06]} material={materials.brushedDarkSteel} castShadow>
            <boxGeometry args={[2.32, 1.58, 0.08]} />
          </mesh>
          <mesh material={materials.projectPlateMaterials[idx as 0 | 1 | 2]}>
            <boxGeometry args={[2.22, 1.46, 0.04]} />
          </mesh>
          <mesh position={[0, 0.8, 0]} material={materials.luminousEdge}>
            <boxGeometry args={[2.34, 0.02, 0.09]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
