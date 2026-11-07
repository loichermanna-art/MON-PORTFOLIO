import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MOTION_DAMPING } from '../../motion/motionConfig';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface ClairvoieGalleryProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * Scène 02 — Galerie à Claire-Voie en Béton Banché (z = -11m -> -23m)
 * Série de lames porteuses verticales ancrées du sol à la poutre de rive,
 * orientant la lumière naturelle latérale d'heure bleue sur le dallage de basalte.
 */
export function ClairvoieGallery({ materials }: ClairvoieGalleryProps) {
  const louverRefs = useRef<Array<THREE.Mesh | null>>([]);
  const smoothAct = useRef(0);

  useFrame((_, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    const local = THREE.MathUtils.clamp((motionStore.scrollProgress - 0.12) / 0.18, 0, 1);
    smoothAct.current = THREE.MathUtils.damp(
      smoothAct.current,
      motionStore.reducedMotion ? 0.45 : local,
      MOTION_DAMPING.structureActuation,
      dt
    );

    const rotY = -0.28 - smoothAct.current * 0.22;
    louverRefs.current.forEach((mesh) => {
      if (mesh) mesh.rotation.y = rotY;
    });
  });

  return (
    <group name="TectonicClairvoieGallery">
      {/* Poutre longitudinale haute portant les brise-soleil */}
      <mesh position={[3.6, 4.75, -16.8]} material={materials.deepConcrete} castShadow>
        <boxGeometry args={[0.9, 0.55, 13.5]} />
      </mesh>

      {/* Soubassement continu en pierre sombre ancrant les lames au sol */}
      <mesh position={[3.6, 0.08, -16.8]} material={materials.anodizedSteel} receiveShadow>
        <boxGeometry args={[0.95, 0.16, 13.4]} />
      </mesh>
      <mesh
        position={[3.0, 0.006, -16.8]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        material={materials.contactAO}
      >
        <planeGeometry args={[13.6, 0.85]} />
      </mesh>

      {/* 7 brise-soleil verticaux en béton coffré */}
      {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
        const z = -11.4 - idx * 1.8;
        return (
          <mesh
            key={idx}
            ref={(el) => {
              louverRefs.current[idx] = el;
            }}
            position={[3.6, 2.38, z]}
            rotation={[0, -0.35, 0]}
            material={materials.boardConcrete}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.78, 4.44, 0.18]} />
          </mesh>
        );
      })}

      {/* Poutres de plafond transversales assurant la continuité tectonique */}
      {[-12.5, -16.8, -21.1].map((zBeam, idx) => (
        <mesh
          key={idx}
          position={[0.2, 4.82, zBeam]}
          material={materials.boardConcrete}
          castShadow
        >
          <boxGeometry args={[10.4, 0.56, 0.46]} />
        </mesh>
      ))}
    </group>
  );
}
