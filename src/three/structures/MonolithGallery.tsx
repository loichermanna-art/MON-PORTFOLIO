import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface MonolithGalleryProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * SCÈNE 04 — La Salle des Monolithes d'Exposition (z = -38m -> -64m)
 * Nef muséale abritant les 3 stèles monumentales dédiées aux projets vérifiés :
 * - Stèle 01 (x = +2.35, z = -43.5) : LAURA HOUSE (texte à gauche, stèle à droite)
 * - Stèle 02 (x = -2.35, z = -51.5) : SassySkin   (stèle à gauche, texte à droite)
 * - Stèle 03 (x = +2.35, z = -59.5) : EtuCo       (texte à gauche, stèle à droite)
 */
export function MonolithGallery({ materials }: MonolithGalleryProps) {
  const steleRefs = useRef<Array<THREE.Group | null>>([]);
  const focusShift = useRef([0, 0, 0]);

  const steles = useMemo(
    () => [
      { idx: 0 as const, x: 2.35, z: -43.5, baseRotY: -0.28 },
      { idx: 1 as const, x: -2.35, z: -51.5, baseRotY: 0.28 },
      { idx: 2 as const, x: 2.35, z: -59.5, baseRotY: -0.28 },
    ],
    []
  );

  const naveColumnsZ = useMemo(() => [-41.0, -47.5, -55.5, -62.0], []);

  useFrame((_, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);

    for (let i = 0; i < steles.length; i++) {
      const isFocused = motionStore.focusedProjectIndex === i ? 1 : 0;
      focusShift.current[i] = THREE.MathUtils.damp(
        focusShift.current[i],
        isFocused,
        5.5,
        dt
      );
      const group = steleRefs.current[i];
      if (group) {
        const s = steles[i];
        const inwardDir = s.x > 0 ? -1 : 1;
        group.position.x = s.x + inwardDir * focusShift.current[i] * 0.24;
        group.rotation.y = s.baseRotY + inwardDir * focusShift.current[i] * 0.06;
      }
    }
  });

  return (
    <group name="MonolithGallery">
      {/* Piliers latéraux et verrières zénithales de la nef muséale */}
      {naveColumnsZ.map((z, idx) => (
        <group key={`nave-col-${idx}`}>
          <mesh
            position={[-5.1, 3.6, z]}
            castShadow
            receiveShadow
            material={materials.limestoneWall}
          >
            <boxGeometry args={[0.85, 7.2, 0.85]} />
          </mesh>
          <mesh
            position={[5.1, 3.6, z]}
            castShadow
            receiveShadow
            material={materials.limestoneWall}
          >
            <boxGeometry args={[0.85, 7.2, 0.85]} />
          </mesh>
          <mesh
            position={[0, 7.1, z]}
            castShadow
            receiveShadow
            material={materials.sandstonePlinth}
          >
            <boxGeometry args={[11.0, 0.34, 0.55]} />
          </mesh>
        </group>
      ))}

      {/* Les 3 Stèles d'exposition muséales */}
      {steles.map((stele) => (
        <group
          key={`stele-${stele.idx}`}
          ref={(el) => {
            steleRefs.current[stele.idx] = el;
          }}
          position={[stele.x, 0, stele.z]}
          rotation={[0, stele.baseRotY, 0]}
        >
          {/* Socle muséal et cadre périphérique en bronze au sol */}
          <mesh position={[0, 0.09, 0]} receiveShadow castShadow material={materials.sandstonePlinth}>
            <boxGeometry args={[2.55, 0.18, 1.35]} />
          </mesh>
          <mesh position={[0, 0.19, 0]} material={materials.precisionBrass}>
            <boxGeometry args={[2.25, 0.02, 1.05]} />
          </mesh>

          {/* Corps monolithique en pierre d'albâtre */}
          <mesh position={[0, 2.05, 0]} castShadow receiveShadow material={materials.limestoneWall}>
            <boxGeometry args={[1.96, 3.72, 0.34]} />
          </mesh>

          {/* Châssis biseauté en bronze patiné */}
          <mesh position={[0, 2.08, 0.175]} castShadow material={materials.patinatedBronze}>
            <boxGeometry args={[1.68, 3.16, 0.04]} />
          </mesh>

          {/* Plaque d'interface projet haute définition (768x1024 procédurale locale) */}
          <mesh
            position={[0, 2.08, 0.2]}
            material={materials.projectPlateMaterials[stele.idx]}
          >
            <planeGeometry args={[1.54, 2.05]} />
          </mesh>

          {/* Filet supérieur et inférieur en laiton */}
          <mesh position={[0, 3.22, 0.202]} material={materials.precisionBrass}>
            <boxGeometry args={[1.54, 0.025, 0.015]} />
          </mesh>
          <mesh position={[0, 0.92, 0.202]} material={materials.precisionBrass}>
            <boxGeometry args={[1.54, 0.025, 0.015]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
