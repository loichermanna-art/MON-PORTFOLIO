import { useMemo } from 'react';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface PeristyleHallProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * SCÈNE 01 — Le Péristyle de Lumière (z = +16m -> -2m)
 * Inclut également le grand dallage continu et le méridien axial de laiton qui relient
 * sans aucune rupture spatiale les 6 zones de l'édifice (de z = +18m à z = -100m).
 */
export function PeristyleHall({ materials }: PeristyleHallProps) {
  const columnPositionsZ = useMemo(() => [12.5, 9.5, 6.5, 3.5, 0.5, -2.5], []);
  const ceilingBeamsZ = useMemo(() => [11.0, 8.0, 5.0, 2.0, -1.0], []);

  return (
    <group name="PeristyleHall">
      {/* Grand dallage continu d'un seul tenant traversant tout l'édifice (124m de long) */}
      <mesh
        position={[0, 0, -42]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={materials.limestonePaving}
      >
        <planeGeometry args={[42, 126]} />
      </mesh>

      {/* Filet méridien axial continu en laiton incrusté au sol du Péristyle au Belvédère */}
      <mesh position={[0, 0.008, -39]} material={materials.precisionBrass}>
        <boxGeometry args={[0.032, 0.012, 110]} />
      </mesh>
      <mesh position={[1.85, 0.006, -2]} material={materials.patinatedBronze}>
        <boxGeometry args={[0.02, 0.01, 32]} />
      </mesh>

      {/* Socles latéraux surélevés encadrant le Péristyle d'entrée */}
      <mesh
        position={[-5.6, 0.18, 5]}
        receiveShadow
        castShadow
        material={materials.sandstonePlinth}
      >
        <boxGeometry args={[2.8, 0.36, 18]} />
      </mesh>
      <mesh
        position={[5.6, 0.18, 5]}
        receiveShadow
        castShadow
        material={materials.sandstonePlinth}
      >
        <boxGeometry args={[2.8, 0.36, 18]} />
      </mesh>

      {/* Colonnade monumentale gauche & droite */}
      {columnPositionsZ.map((z, idx) => (
        <group key={`col-pair-${idx}`}>
          <mesh
            position={[-4.8, 3.65, z]}
            castShadow
            receiveShadow
            material={materials.limestoneWall}
          >
            <boxGeometry args={[0.78, 6.6, 0.78]} />
          </mesh>
          <mesh position={[-4.8, 0.38, z]} material={materials.patinatedBronze}>
            <boxGeometry args={[0.84, 0.05, 0.84]} />
          </mesh>

          <mesh
            position={[5.1, 3.65, z]}
            castShadow
            receiveShadow
            material={materials.limestoneWall}
          >
            <boxGeometry args={[0.78, 6.6, 0.78]} />
          </mesh>
          <mesh position={[5.1, 0.38, z]} material={materials.patinatedBronze}>
            <boxGeometry args={[0.84, 0.05, 0.84]} />
          </mesh>
        </group>
      ))}

      {/* Architraves longitudinales */}
      <mesh
        position={[-4.8, 7.15, 5]}
        castShadow
        receiveShadow
        material={materials.limestoneWall}
      >
        <boxGeometry args={[0.92, 0.55, 18.2]} />
      </mesh>
      <mesh
        position={[5.1, 7.15, 5]}
        castShadow
        receiveShadow
        material={materials.limestoneWall}
      >
        <boxGeometry args={[0.92, 0.55, 18.2]} />
      </mesh>

      {/* Poutres zénithales transversales */}
      {ceilingBeamsZ.map((z, idx) => (
        <mesh
          key={`beam-${idx}`}
          position={[0.15, 7.35, z]}
          castShadow
          receiveShadow
          material={materials.sandstonePlinth}
        >
          <boxGeometry args={[10.8, 0.28, 0.38]} />
        </mesh>
      ))}
    </group>
  );
}
