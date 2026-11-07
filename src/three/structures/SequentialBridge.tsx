import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface SequentialBridgeProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * Scène 05 — Les Six Portiques Séquentiels en Béton Banché (z = -66m -> -79m)
 * Remplace tout anneau ou sphère flottante irréaliste par une perspective architecturale
 * rigoureuse de 6 portiques ancrés au sol, dont l'intrados s'éclaire selon l'étape active (1 à 6).
 */
export function SequentialBridge({ materials }: SequentialBridgeProps) {
  const soffitGlowRefs = useRef<Array<THREE.Mesh | null>>([]);

  useFrame((_, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    soffitGlowRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const isActive = idx === motionStore.activeProcessStep;
      const targetScale = isActive ? 1.65 : 0.42;
      mesh.scale.y = THREE.MathUtils.damp(mesh.scale.y, targetScale, 7, dt);
    });
  });

  return (
    <group name="SixSequentialConcretePortals">
      {[0, 1, 2, 3, 4, 5].map((idx) => {
        const z = -67.2 - idx * 2.15;
        const xCenter = 2.15;
        return (
          <group key={idx} position={[xCenter, 0, z]} rotation={[0, -0.16, 0]}>
            {/* Piédroits gauche et droit en béton coffré */}
            <mesh position={[-1.95, 2.25, 0]} material={materials.boardConcrete} castShadow receiveShadow>
              <boxGeometry args={[0.46, 4.5, 0.56]} />
            </mesh>
            <mesh position={[1.95, 2.25, 0]} material={materials.boardConcrete} castShadow receiveShadow>
              <boxGeometry args={[0.46, 4.5, 0.56]} />
            </mesh>

            {/* Linteau supérieur */}
            <mesh position={[0, 4.35, 0]} material={materials.deepConcrete} castShadow>
              <boxGeometry args={[4.36, 0.44, 0.56]} />
            </mesh>

            {/* Gorge lumineuse sous le linteau révélant la travée active */}
            <mesh
              ref={(el) => {
                soffitGlowRefs.current[idx] = el;
              }}
              position={[0, 4.12, 0.29]}
              rotation={[Math.PI, 0, 0]}
              material={materials.softCoveLight}
            >
              <planeGeometry args={[3.4, 0.65]} />
            </mesh>

            {/* Ombres de contact aux pieds des piédroits */}
            <mesh
              position={[0, 0.005, 0.42]}
              rotation={[-Math.PI / 2, 0, 0]}
              material={materials.contactAO}
            >
              <planeGeometry args={[4.6, 0.45]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
