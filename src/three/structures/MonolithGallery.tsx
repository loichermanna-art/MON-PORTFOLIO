import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface MonolithGalleryProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * Scène 04 — Galerie Muséale des Projets (z = -43m -> -55m)
 * Trois chevalets architecturaux en béton banché et acier thermolaqué ancrés dans le sol
 * (LAURA HOUSE, SassySkin, EtuCo), éclairés chacun par une rampe muséale douce.
 */
export function MonolithGallery({ materials }: MonolithGalleryProps) {
  const washRefs = useRef<Array<THREE.Mesh | null>>([null, null, null]);

  useFrame((_, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    washRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const isFocused = motionStore.focusedProjectIndex === idx;
      const targetScale = isFocused ? 1.5 : 0.75;
      mesh.scale.y = THREE.MathUtils.damp(mesh.scale.y, targetScale, 6, dt);
    });
  });

  const bays: Array<[number, number]> = [
    [1.25, -46.2],
    [2.85, -49.0],
    [4.35, -51.8],
  ];

  return (
    <group name="GroundedMuseumGallery">
      {bays.map(([x, z], idx) => (
        <group key={idx} position={[x, 0, z]} rotation={[0, -0.32, 0]}>
          {/* Socle porteur massif en béton banché reposant au sol */}
          <mesh position={[0, 0.68, -0.08]} material={materials.deepConcrete} castShadow receiveShadow>
            <boxGeometry args={[2.18, 1.36, 0.42]} />
          </mesh>

          {/* Châssis muséal en acier thermolaqué */}
          <mesh position={[0, 2.08, -0.05]} material={materials.anodizedSteel} castShadow>
            <boxGeometry args={[2.28, 1.54, 0.12]} />
          </mesh>

          {/* Cartel architectural du projet */}
          <mesh position={[0, 2.08, 0.018]} material={materials.projectPlateMaterials[idx as 0 | 1 | 2]}>
            <planeGeometry args={[2.16, 1.42]} />
          </mesh>

          {/* Rampe d'éclairage muséal rasant en partie supérieure */}
          <mesh
            ref={(el) => {
              washRefs.current[idx] = el;
            }}
            position={[0, 2.82, 0.025]}
            rotation={[Math.PI, 0, 0]}
            material={materials.softCoveLight}
          >
            <planeGeometry args={[2.14, 0.55]} />
          </mesh>

          {/* Ombre de contact au sol */}
          <mesh
            position={[0, 0.005, 0.28]}
            rotation={[-Math.PI / 2, 0, 0]}
            material={materials.contactAO}
          >
            <planeGeometry args={[2.5, 0.58]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
