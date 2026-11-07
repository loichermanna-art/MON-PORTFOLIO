import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface OpenBelvedereProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * Scène 06 — Belvédère Ouvert sur l'Horizon Lumineux (z = -86m -> -102m)
 */
export function OpenBelvedere({ materials }: OpenBelvedereProps) {
  return (
    <group name="OpenHorizonBelvedere">
      {/* Parois monumentales encadrant l'ouverture finale */}
      <mesh position={[-2.9, 3.8, -93.5]} material={materials.deepConcrete} castShadow>
        <boxGeometry args={[1.6, 7.6, 8.5]} />
      </mesh>
      <mesh position={[5.2, 3.8, -93.5]} material={materials.deepConcrete} castShadow>
        <boxGeometry args={[1.6, 7.6, 8.5]} />
      </mesh>

      {/* Emmarchements finaux s'avançant vers la clarté */}
      {[0, 1, 2, 3, 4].map((step) => (
        <mesh
          key={step}
          position={[1.15, step * 0.14 + 0.07, -88.5 - step * 0.8]}
          material={materials.darkConcrete}
          receiveShadow
        >
          <boxGeometry args={[6.1, 0.14, 0.85]} />
        </mesh>
      ))}

      {/* Grande ouverture lumineuse finale */}
      <mesh position={[1.15, 4.2, -101.5]}>
        <planeGeometry args={[18, 12]} />
        <primitive object={materials.skyApertureMaterial} attach="material" />
      </mesh>
      <mesh position={[1.15, 3.4, -96.5]} material={materials.luminousCore}>
        <torusGeometry args={[2.9, 0.05, 16, 80]} />
      </mesh>
    </group>
  );
}
