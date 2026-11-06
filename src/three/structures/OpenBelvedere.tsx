import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface OpenBelvedereProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * SCÈNE 06 — Le Belvédère Ouvert (z = -82m -> -98m)
 * Terrasse architecturale symétrique, calme et dégagée concluant la traversée de l'édifice.
 */
export function OpenBelvedere({ materials }: OpenBelvedereProps) {
  return (
    <group name="OpenBelvedere">
      {/* Dernier grand portique d'ouverture sur le Belvédère (z = -82.6m) */}
      <group position={[0, 0, -82.6]}>
        <mesh position={[-4.4, 3.6, 0]} castShadow receiveShadow material={materials.limestoneWall}>
          <boxGeometry args={[1.4, 7.2, 1.0]} />
        </mesh>
        <mesh position={[4.4, 3.6, 0]} castShadow receiveShadow material={materials.limestoneWall}>
          <boxGeometry args={[1.4, 7.2, 1.0]} />
        </mesh>
        <mesh position={[0, 6.9, 0]} castShadow receiveShadow material={materials.limestoneWall}>
          <boxGeometry args={[10.2, 0.65, 1.0]} />
        </mesh>
        <mesh position={[0, 6.56, 0]} material={materials.precisionBrass}>
          <boxGeometry args={[9.8, 0.03, 1.04]} />
        </mesh>
      </group>

      {/* Esplanade surélevée calme en pierre d'albâtre */}
      <mesh
        position={[0, 0.12, -89.5]}
        receiveShadow
        material={materials.limestoneWall}
      >
        <boxGeometry args={[14.0, 0.24, 12.5]} />
      </mesh>

      {/* Garde-corps minimaliste d'horizon en bronze patiné et filet laiton (z = -94.8m) */}
      <group position={[0, 0.24, -94.8]}>
        <mesh position={[0, 0.98, 0]} castShadow material={materials.patinatedBronze}>
          <boxGeometry args={[12.8, 0.06, 0.09]} />
        </mesh>
        <mesh position={[0, 1.02, 0]} material={materials.precisionBrass}>
          <boxGeometry args={[12.8, 0.016, 0.095]} />
        </mesh>
        {[-6.0, -3.6, -1.2, 1.2, 3.6, 6.0].map((bx, i) => (
          <mesh key={`baluster-${i}`} position={[bx, 0.49, 0]} castShadow material={materials.patinatedBronze}>
            <boxGeometry args={[0.06, 0.98, 0.06]} />
          </mesh>
        ))}
      </group>

      {/* Anneau méridien solaire apaisé à l'horizon (z = -97.2m) */}
      <group position={[0, 2.35, -97.2]}>
        <mesh material={materials.precisionBrass}>
          <torusGeometry args={[1.65, 0.024, 12, 64]} />
        </mesh>
        <mesh position={[0, -1.2, 0]} material={materials.patinatedBronze}>
          <boxGeometry args={[0.06, 1.8, 0.06]} />
        </mesh>
      </group>
    </group>
  );
}
