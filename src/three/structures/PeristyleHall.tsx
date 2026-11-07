import { useMemo } from 'react';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface PeristyleHallProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * SCÈNE 01 & NEF CONTINUE — Arches Paraboliques Blanches & Miroir d'Ardoise
 * Synthèse directe de `UI.jfif`, `MS7W...jfif` (Oculus), `YT.jfif` et `Panel 01` :
 * - Sol continu en ardoise sombre polie semi-réfléchissante (128m).
 * - Dalles blanches lumineuses étagées en léger porte-à-faux formant le chemin central.
 * - Grandes nervures paraboliques blanches rythmées encadrant la perspective.
 */
export function PeristyleHall({ materials }: PeristyleHallProps) {
  const archRibsZ = useMemo(() => [11.5, 7.5, 3.5, -0.5], []);
  const floatingSlabsZ = useMemo(
    () => Array.from({ length: 16 }, (_, i) => 12.0 - i * 4.8),
    []
  );

  return (
    <group name="PeristyleHall">
      {/* Grand miroir minéral sombre continu de z = +18m à z = -104m */}
      <mesh
        position={[0, 0, -43]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={materials.reflectiveSlateFloor}
      >
        <planeGeometry args={[48, 130]} />
      </mesh>

      {/* Chemin axial de dalles blanches flottantes étagées (YT.jfif & TRES BON.jfif) */}
      {floatingSlabsZ.map((z, idx) => (
        <mesh
          key={`walk-slab-${idx}`}
          position={[(idx % 2 === 0 ? 1 : -1) * 0.22, 0.06, z]}
          receiveShadow
          castShadow
          material={materials.luminousSlab}
        >
          <boxGeometry args={[3.8, 0.12, 3.9]} />
        </mesh>
      ))}

      {/* Nervures architecturales courbes / inclinées blanches (UI.jfif & Oculus) */}
      {archRibsZ.map((z, idx) => (
        <group key={`parabolic-arch-${idx}`} position={[0.4, 0, z]}>
          {/* Jambe inclinée gauche */}
          <mesh
            position={[-5.4, 3.8, 0]}
            rotation={[0, 0, -0.26]}
            castShadow
            receiveShadow
            material={materials.whiteMarble}
          >
            <boxGeometry args={[0.72, 8.2, 1.35]} />
          </mesh>
          {/* Jambe inclinée droite */}
          <mesh
            position={[5.8, 3.8, 0]}
            rotation={[0, 0, 0.26]}
            castShadow
            receiveShadow
            material={materials.whiteMarble}
          >
            <boxGeometry args={[0.72, 8.2, 1.35]} />
          </mesh>
          {/* Arche courbe sommitale */}
          <mesh
            position={[0.2, 7.2, 0]}
            rotation={[0, 0, 0]}
            castShadow
            receiveShadow
            material={materials.whiteMarble}
          >
            <torusGeometry args={[4.65, 0.34, 14, 48, Math.PI]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
