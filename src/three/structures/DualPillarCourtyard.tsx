import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface DualPillarCourtyardProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * SCÈNE 03 — La Matrice Cubique Modulaire (Panel 03 & ER.jfif / HJ.jfif)
 * Assemblage sculptural en lévitation de cubes de marbre blanc, de verre spéculaire
 * et d'obsidienne noire au centre-droit (x = +1.15, z = -29.2), incarnant la synergie
 * entre Finance/Audit (structure solide) et Numérique/Code (transparence & modularité).
 */
export function DualPillarCourtyard({ materials }: DualPillarCourtyardProps) {
  const clusterGroupRef = useRef<THREE.Group>(null);
  const cubeRefs = useRef<Array<THREE.Mesh | null>>([]);
  const expansionRef = useRef(0);

  const cubes = useMemo(() => {
    const coords: Array<{
      pos: [number, number, number];
      size: number;
      kind: 'marble' | 'obsidian' | 'crystal';
    }> = [
      { pos: [0, 0, 0], size: 0.92, kind: 'obsidian' },
      { pos: [0.88, 0.55, 0.42], size: 0.78, kind: 'crystal' },
      { pos: [-0.82, 0.48, 0.35], size: 0.82, kind: 'obsidian' },
      { pos: [0.42, -0.78, 0.52], size: 0.74, kind: 'marble' },
      { pos: [-0.55, -0.72, -0.45], size: 0.8, kind: 'crystal' },
      { pos: [0.95, -0.35, -0.58], size: 0.84, kind: 'obsidian' },
      { pos: [-0.35, 1.12, -0.25], size: 0.72, kind: 'crystal' },
      { pos: [0.58, 1.18, -0.38], size: 0.68, kind: 'marble' },
      { pos: [-1.15, -0.15, 0.62], size: 0.64, kind: 'crystal' },
      { pos: [1.28, 0.18, 0.65], size: 0.62, kind: 'marble' },
      { pos: [0.12, -1.28, -0.12], size: 0.66, kind: 'crystal' },
      { pos: [-0.72, 0.92, -0.82], size: 0.6, kind: 'marble' },
      { pos: [0.76, -0.96, 0.72], size: 0.54, kind: 'obsidian' },
      { pos: [0.05, 1.56, 0.25], size: 0.52, kind: 'crystal' },
    ];
    return coords;
  }, []);

  useFrame(({ clock }, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);

    const poleFocused = motionStore.focusedExpertisePole !== -1 ? 0.22 : 0;
    const inBand = THREE.MathUtils.smoothstep(motionStore.scrollProgress, 0.28, 0.44) * 0.14;
    expansionRef.current = THREE.MathUtils.damp(
      expansionRef.current,
      1 + inBand + poleFocused,
      4.5,
      dt
    );

    if (clusterGroupRef.current) {
      if (motionStore.reducedMotion) {
        clusterGroupRef.current.rotation.set(0.18, -0.42, 0.08);
      } else {
        const t = clock.getElapsedTime();
        clusterGroupRef.current.rotation.y = -0.42 + t * 0.14;
        clusterGroupRef.current.rotation.x = 0.18 + Math.sin(t * 0.35) * 0.06;
      }
    }

    for (let i = 0; i < cubes.length; i++) {
      const mesh = cubeRefs.current[i];
      if (mesh) {
        const [bx, by, bz] = cubes[i].pos;
        const scale = expansionRef.current;
        mesh.position.set(bx * scale, by * scale, bz * scale);
      }
    }
  });

  return (
    <group name="DualPillarCourtyard">
      {/* Parois blanches architecturales épurées encadrant la salle */}
      <mesh
        position={[-5.6, 3.8, -29.0]}
        receiveShadow
        material={materials.whiteMarble}
      >
        <boxGeometry args={[0.9, 8.0, 16.5]} />
      </mesh>
      <mesh
        position={[5.8, 3.8, -29.0]}
        receiveShadow
        material={materials.whiteMarble}
      >
        <boxGeometry args={[0.9, 8.0, 16.5]} />
      </mesh>

      {/* Matrice cubique suspendue (Panel 03) */}
      <group ref={clusterGroupRef} position={[0.95, 2.65, -29.2]}>
        {cubes.map((cube, idx) => {
          const mat =
            cube.kind === 'obsidian'
              ? materials.obsidianBlock
              : cube.kind === 'crystal'
                ? materials.crystalGlass
                : materials.whiteMarble;

          return (
            <mesh
              key={`matrix-cube-${idx}`}
              ref={(el) => {
                cubeRefs.current[idx] = el;
              }}
              position={cube.pos}
              castShadow
              receiveShadow
              material={mat}
            >
              <boxGeometry args={[cube.size, cube.size, cube.size]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
