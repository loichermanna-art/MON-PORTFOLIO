import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface SequentialBridgeProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * SCÈNE 05 — La Passerelle Séquentielle (z = -64m -> -82m)
 * 6 dalles architecturales en porte-à-faux incarnant les 6 étapes de la méthode de travail.
 * Initialement décalées, elles viennent s'aligner et se verrouiller horizontalement sans rebond
 * (0 % d'overshoot) lorsque scrollProgress parcourt [0.71 -> 0.89].
 */
export function SequentialBridge({ materials }: SequentialBridgeProps) {
  const slabRefs = useRef<Array<THREE.Group | null>>([]);
  const slabProgress = useRef([0, 0, 0, 0, 0, 0]);

  const slabs = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        index: i,
        z: -66.8 - i * 2.45,
        initialOffsetX: (i % 2 === 0 ? -1 : 1) * (1.35 - i * 0.08),
        initialOffsetY: -0.42 - (i % 2) * 0.14,
      })),
    []
  );

  useFrame((_, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    const p = motionStore.scrollProgress;

    for (let i = 0; i < slabs.length; i++) {
      // En reduced-motion : la passerelle reste calmement assemblée
      const start = 0.7 + i * 0.026;
      const targetLock = motionStore.reducedMotion
        ? 1
        : THREE.MathUtils.smoothstep(p, start, start + 0.048);

      slabProgress.current[i] = THREE.MathUtils.damp(
        slabProgress.current[i],
        targetLock,
        6.2,
        dt
      );

      const group = slabRefs.current[i];
      if (group) {
        const s = slabs[i];
        const unlocked = 1 - slabProgress.current[i];
        group.position.x = s.initialOffsetX * unlocked;
        group.position.y = 0.24 + s.initialOffsetY * unlocked;
      }
    }
  });

  return (
    <group name="SequentialBridge">
      {/* Murs bas latéraux encadrant la fosse lumineuse du pont */}
      <mesh
        position={[-4.2, 0.45, -73.0]}
        receiveShadow
        castShadow
        material={materials.sandstonePlinth}
      >
        <boxGeometry args={[1.2, 0.9, 16.8]} />
      </mesh>
      <mesh
        position={[4.2, 0.45, -73.0]}
        receiveShadow
        castShadow
        material={materials.sandstonePlinth}
      >
        <boxGeometry args={[1.2, 0.9, 16.8]} />
      </mesh>

      {/* Les 6 travées séquentielles numérotées */}
      {slabs.map((slab) => (
        <group
          key={`bridge-slab-${slab.index}`}
          ref={(el) => {
            slabRefs.current[slab.index] = el;
          }}
          position={[slab.initialOffsetX, 0.24 + slab.initialOffsetY, slab.z]}
        >
          {/* Dalle principale en pierre taillée */}
          <mesh castShadow receiveShadow material={materials.limestoneWall}>
            <boxGeometry args={[4.4, 0.28, 2.15]} />
          </mesh>
          {/* Poutre porteuse inférieure en bronze patiné */}
          <mesh position={[0, -0.18, 0]} castShadow material={materials.patinatedBronze}>
            <boxGeometry args={[4.52, 0.09, 0.34]} />
          </mesh>
          {/* Joint transversal de verrouillage en laiton sur l'axe central */}
          <mesh position={[0, 0.148, 0]} material={materials.precisionBrass}>
            <boxGeometry args={[4.38, 0.014, 0.045]} />
          </mesh>
          {/* Balises latérales basses scandant chaque étape */}
          <mesh position={[-2.08, 0.38, 0]} castShadow material={materials.patinatedBronze}>
            <boxGeometry args={[0.1, 0.48, 0.18]} />
          </mesh>
          <mesh position={[2.08, 0.38, 0]} castShadow material={materials.patinatedBronze}>
            <boxGeometry args={[0.1, 0.48, 0.18]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
