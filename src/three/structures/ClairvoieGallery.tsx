import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface ClairvoieGalleryProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * SCÈNE 02 — Le Canyon des Blocs Cantilever & Monolithe Cadré
 * Synthèse directe de `TRES BON.jfif` et `Panel 02` :
 * - Parois blanches monumentales d'où jaillissent des volumes cubiques en porte-à-faux.
 * - Grand cadre monolithique vertical en chrome et marbre sur la droite (Panel 02).
 */
export function ClairvoieGallery({ materials }: ClairvoieGalleryProps) {
  const blockRefs = useRef<Array<THREE.Mesh | null>>([]);
  const smoothedExtend = useRef(0);

  const cantilevers = useMemo(
    () => [
      { side: -1, y: 4.4, z: -6.2, w: 1.8, h: 0.75, d: 1.3 },
      { side: 1, y: 3.1, z: -7.8, w: 2.1, h: 0.95, d: 1.5 },
      { side: -1, y: 2.4, z: -9.6, w: 1.5, h: 0.85, d: 1.2 },
      { side: 1, y: 4.8, z: -11.4, w: 2.3, h: 0.8, d: 1.6 },
      { side: -1, y: 3.8, z: -13.2, w: 1.9, h: 0.9, d: 1.4 },
      { side: 1, y: 1.8, z: -14.8, w: 1.7, h: 0.75, d: 1.3 },
      { side: -1, y: 4.9, z: -16.5, w: 2.0, h: 0.8, d: 1.4 },
    ],
    []
  );

  useFrame((_, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);

    const active = THREE.MathUtils.smoothstep(motionStore.scrollProgress, 0.11, 0.32);
    smoothedExtend.current = THREE.MathUtils.damp(smoothedExtend.current, active, 4.8, dt);

    for (let i = 0; i < cantilevers.length; i++) {
      const mesh = blockRefs.current[i];
      const item = cantilevers[i];
      if (mesh) {
        const baseWallX = item.side * 4.55;
        const jut = (0.55 + smoothedExtend.current * 0.75) * -item.side;
        mesh.position.x = baseWallX + jut;
      }
    }
  });

  return (
    <group name="ClairvoieGallery">
      {/* Parois blanches inclinées du canyon (TRES BON.jfif) */}
      <mesh
        position={[-5.35, 3.8, -11.5]}
        rotation={[0, 0, -0.14]}
        castShadow
        receiveShadow
        material={materials.whiteMarble}
      >
        <boxGeometry args={[1.1, 8.2, 16.5]} />
      </mesh>
      <mesh
        position={[5.35, 3.8, -11.5]}
        rotation={[0, 0, 0.14]}
        castShadow
        receiveShadow
        material={materials.whiteMarble}
      >
        <boxGeometry args={[1.1, 8.2, 16.5]} />
      </mesh>

      {/* Blocs géométriques blancs en porte-à-faux (TRES BON.jfif & Panel 02) */}
      {cantilevers.map((c, idx) => (
        <mesh
          key={`cantilever-${idx}`}
          ref={(el) => {
            blockRefs.current[idx] = el;
          }}
          position={[c.side * 4.0, c.y, c.z]}
          castShadow
          receiveShadow
          material={idx % 3 === 1 ? materials.specularChrome : materials.whiteMarble}
        >
          <boxGeometry args={[c.w, c.h, c.d]} />
        </mesh>
      ))}

      {/* Monolithe cadré vertical en chrome spéculaire côté droit (Panel 02) */}
      <group position={[2.25, 0, -12.6]} rotation={[0, -0.22, 0]}>
        <mesh position={[0, 2.25, 0]} castShadow material={materials.specularChrome}>
          <boxGeometry args={[1.95, 4.1, 0.18]} />
        </mesh>
        <mesh position={[0, 2.25, 0.1]} material={materials.obsidianBlock}>
          <boxGeometry args={[1.76, 3.88, 0.04]} />
        </mesh>
        {/* Colonnes architecturales miniatures sculptées à l'intérieur du monolithe */}
        {[-0.52, -0.17, 0.17, 0.52].map((cx, i) => (
          <mesh key={`inner-col-${i}`} position={[cx, 2.15, 0.13]} material={materials.whiteMarble}>
            <boxGeometry args={[0.14, 2.8, 0.06]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
