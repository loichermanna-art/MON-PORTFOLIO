import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface DualPillarCourtyardProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * SCÈNE 03 — La Cour des Deux Piliers (z = -19m -> -37m)
 * Met en vis-à-vis symétrique :
 * - À gauche : 4 strates horizontales en pierre calcaire (Finance · Comptabilité · Audit · Analyse).
 * - À droite : 3 portiques d'ingénierie en bronze patiné (Conception produit · Web · Gestion de projets).
 * Zéro jauge arbitraire : l'équilibre architectural incarne la complémentarité des deux pôles.
 */
export function DualPillarCourtyard({ materials }: DualPillarCourtyardProps) {
  const strataRefs = useRef<Array<THREE.Group | null>>([]);
  const frameRefs = useRef<Array<THREE.Group | null>>([]);
  const leftAdvance = useRef([0, 0, 0, 0]);
  const rightAdvance = useRef([0, 0, 0]);

  useFrame(({ clock }, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    const p = motionStore.scrollProgress;
    const elapsed = clock.getElapsedTime();

    const poleLeftBoost = motionStore.focusedExpertisePole === 0 ? 0.28 : 0;
    const poleRightBoost = motionStore.focusedExpertisePole === 1 ? 0.28 : 0;

    // 4 strates Finance/Audit à gauche
    for (let i = 0; i < 4; i++) {
      const bandStart = 0.29 + i * 0.032;
      const scrollStep = THREE.MathUtils.smoothstep(p, bandStart, bandStart + 0.06);
      const targetX = scrollStep * 0.36 + poleLeftBoost;
      leftAdvance.current[i] = THREE.MathUtils.damp(
        leftAdvance.current[i],
        targetX,
        5.0,
        dt
      );
      const group = strataRefs.current[i];
      if (group) {
        group.position.x = -3.65 + leftAdvance.current[i];
        group.position.y =
          0.95 +
          i * 0.96 +
          (motionStore.reducedMotion ? 0 : Math.sin(elapsed * 0.55 + i * 0.9) * 0.018);
      }
    }

    // 3 cadres Produit/Web/Projets à droite
    for (let j = 0; j < 3; j++) {
      const bandStart = 0.31 + j * 0.04;
      const scrollStep = THREE.MathUtils.smoothstep(p, bandStart, bandStart + 0.065);
      const targetX = scrollStep * 0.36 + poleRightBoost;
      rightAdvance.current[j] = THREE.MathUtils.damp(
        rightAdvance.current[j],
        targetX,
        5.0,
        dt
      );
      const frame = frameRefs.current[j];
      if (frame) {
        frame.position.x = 3.65 - rightAdvance.current[j];
      }
    }
  });

  return (
    <group name="DualPillarCourtyard">
      {/* Arche d'entrée de la Cour (z = -20.5m) */}
      <group position={[0, 0, -20.5]}>
        <mesh position={[-4.2, 3.5, 0]} castShadow receiveShadow material={materials.limestoneWall}>
          <boxGeometry args={[1.5, 7.0, 1.0]} />
        </mesh>
        <mesh position={[4.2, 3.5, 0]} castShadow receiveShadow material={materials.limestoneWall}>
          <boxGeometry args={[1.5, 7.0, 1.0]} />
        </mesh>
        <mesh position={[0, 6.75, 0]} castShadow receiveShadow material={materials.limestoneWall}>
          <boxGeometry args={[9.9, 0.65, 1.0]} />
        </mesh>
      </group>

      {/* Socle axial central reliant visuellement Pôle I & Pôle II */}
      <mesh
        position={[0, 0.06, -29.0]}
        receiveShadow
        material={materials.sandstonePlinth}
      >
        <boxGeometry args={[5.4, 0.12, 11.2]} />
      </mesh>
      <mesh position={[0, 0.13, -29.0]} material={materials.precisionBrass}>
        <boxGeometry args={[4.6, 0.015, 0.04]} />
      </mesh>

      {/* AILE GAUCHE : 4 Strates monolithiques en pierre d'albâtre (Finance, Comptabilité, Audit, Analyse) */}
      <mesh
        position={[-4.35, 0.25, -29.0]}
        receiveShadow
        castShadow
        material={materials.sandstonePlinth}
      >
        <boxGeometry args={[2.8, 0.5, 11.5]} />
      </mesh>

      {[0, 1, 2, 3].map((i) => (
        <group
          key={`strata-${i}`}
          ref={(el) => {
            strataRefs.current[i] = el;
          }}
          position={[-3.65, 0.95 + i * 0.96, -26.3 - i * 1.8]}
        >
          <mesh castShadow receiveShadow material={materials.limestoneWall}>
            <boxGeometry args={[2.55, 0.56, 3.4]} />
          </mesh>
          {/* Filet d'arête en laiton soulignant la précision analytique */}
          <mesh position={[1.28, 0, 0]} material={materials.precisionBrass}>
            <boxGeometry args={[0.025, 0.12, 3.42]} />
          </mesh>
        </group>
      ))}

      {/* AILE DROITE : 3 Portiques tridimensionnels en bronze patiné (Produit, Web, Projets) */}
      <mesh
        position={[4.35, 0.25, -29.0]}
        receiveShadow
        castShadow
        material={materials.sandstonePlinth}
      >
        <boxGeometry args={[2.8, 0.5, 11.5]} />
      </mesh>

      {[0, 1, 2].map((j) => {
        const height = 3.9 - j * 0.35;
        const zPos = -26.4 - j * 2.7;
        return (
          <group
            key={`bronze-frame-${j}`}
            ref={(el) => {
              frameRefs.current[j] = el;
            }}
            position={[3.65, 0.5, zPos]}
          >
            {/* Montant intérieur */}
            <mesh position={[-0.95, height / 2, 0]} castShadow material={materials.patinatedBronze}>
              <boxGeometry args={[0.12, height, 0.22]} />
            </mesh>
            {/* Montant extérieur */}
            <mesh position={[0.95, height / 2, 0]} castShadow material={materials.patinatedBronze}>
              <boxGeometry args={[0.12, height, 0.22]} />
            </mesh>
            {/* Traverse haute */}
            <mesh position={[0, height, 0]} castShadow material={materials.patinatedBronze}>
              <boxGeometry args={[2.02, 0.12, 0.22]} />
            </mesh>
            {/* Croisillon d'ingénierie en laiton */}
            <mesh position={[0, height * 0.55, 0]} material={materials.precisionBrass}>
              <boxGeometry args={[1.78, 0.028, 0.08]} />
            </mesh>
          </group>
        );
      })}

      {/* Arche de sortie ouvrant vers la Salle des Monolithes (z = -37.2m) */}
      <group position={[0, 0, -37.2]}>
        <mesh position={[-3.8, 3.6, 0]} castShadow receiveShadow material={materials.limestoneWall}>
          <boxGeometry args={[1.8, 7.2, 1.1]} />
        </mesh>
        <mesh position={[3.8, 3.6, 0]} castShadow receiveShadow material={materials.limestoneWall}>
          <boxGeometry args={[1.8, 7.2, 1.1]} />
        </mesh>
        <mesh position={[0, 6.85, 0]} castShadow receiveShadow material={materials.limestoneWall}>
          <boxGeometry args={[9.4, 0.7, 1.1]} />
        </mesh>
      </group>
    </group>
  );
}
