import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface ClairvoieGalleryProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * SCÈNE 02 — La Galerie à Claire-Voie (z = -3m -> -19m)
 * 11 brise-soleil verticaux sur l'aile gauche (hommage épuré au modernisme institutionnel de l'INP-HB)
 * qui pivotent progressivement dans la plage canonique [0.12 -> 0.34].
 */
export function ClairvoieGallery({ materials }: ClairvoieGalleryProps) {
  const louverRefs = useRef<Array<THREE.Mesh | null>>([]);
  const louverZ = useMemo(
    () => Array.from({ length: 11 }, (_, i) => -4.8 - i * 1.35),
    []
  );
  const currentAngle = useRef(0.34);

  useFrame((_, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);

    const galleryProgress = THREE.MathUtils.smoothstep(motionStore.scrollProgress, 0.12, 0.34);
    const targetRotation = motionStore.reducedMotion
      ? 0.52
      : 0.32 + galleryProgress * 0.5;

    currentAngle.current = THREE.MathUtils.damp(currentAngle.current, targetRotation, 4.8, dt);

    for (let i = 0; i < louverRefs.current.length; i++) {
      const mesh = louverRefs.current[i];
      if (mesh) {
        mesh.rotation.y = currentAngle.current + i * 0.018;
      }
    }
  });

  return (
    <group name="ClairvoieGallery">
      <mesh
        position={[-4.2, 0.22, -11.6]}
        receiveShadow
        castShadow
        material={materials.sandstonePlinth}
      >
        <boxGeometry args={[1.6, 0.44, 16.2]} />
      </mesh>

      {louverZ.map((z, idx) => (
        <group key={`louver-${idx}`} position={[-4.15, 3.45, z]}>
          <mesh
            ref={(el) => {
              louverRefs.current[idx] = el;
            }}
            castShadow
            receiveShadow
            material={materials.limestoneWall}
          >
            <boxGeometry args={[0.14, 6.0, 0.76]} />
          </mesh>
          <mesh position={[0, -2.98, 0]} material={materials.patinatedBronze}>
            <cylinderGeometry args={[0.05, 0.05, 0.08, 12]} />
          </mesh>
          <mesh position={[0, 2.98, 0]} material={materials.patinatedBronze}>
            <cylinderGeometry args={[0.05, 0.05, 0.08, 12]} />
          </mesh>
        </group>
      ))}

      <mesh
        position={[-4.15, 6.65, -11.6]}
        castShadow
        receiveShadow
        material={materials.limestoneWall}
      >
        <boxGeometry args={[1.1, 0.45, 16.2]} />
      </mesh>

      {/* Stèle repère en pierre & filet bronze côté gauche */}
      <group position={[-2.35, 0, -12.8]}>
        <mesh position={[0, 1.45, 0]} castShadow receiveShadow material={materials.limestoneWall}>
          <boxGeometry args={[1.45, 2.9, 0.28]} />
        </mesh>
        <mesh position={[0, 1.45, 0.15]} material={materials.patinatedBronze}>
          <boxGeometry args={[1.22, 2.55, 0.02]} />
        </mesh>
        <mesh position={[0, 1.45, 0.165]} material={materials.precisionBrass}>
          <boxGeometry args={[0.85, 0.02, 0.015]} />
        </mesh>
      </group>

      {/* Mur calme latéral droit soutenant la lisibilité du récit About */}
      <mesh
        position={[5.4, 3.2, -11.6]}
        receiveShadow
        material={materials.limestoneWall}
      >
        <boxGeometry args={[0.6, 6.4, 15.8]} />
      </mesh>
    </group>
  );
}
