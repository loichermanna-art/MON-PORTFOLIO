import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface OpenBelvedereProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * Scène 06 — Le Belvédère sur l'Eau (z = -86m -> -106m)
 * Esplanade calme en pierre de basalte, garde-corps fin en acier thermolaqué
 * et ouverture architecturale dégagée sur le ciel naturel d'heure bleue.
 */
export function OpenBelvedere({ materials }: OpenBelvedereProps) {
  return (
    <group name="CalmHorizonBelvedere">
      {/* Deux murs-voiles latéraux en béton banché cadrant l'horizon */}
      <mesh position={[-3.2, 2.6, -92.5]} material={materials.deepConcrete} castShadow>
        <boxGeometry args={[0.9, 5.2, 9.0]} />
      </mesh>
      <mesh position={[5.4, 2.6, -92.5]} material={materials.deepConcrete} castShadow>
        <boxGeometry args={[0.9, 5.2, 9.0]} />
      </mesh>

      {/* Dalle de toiture en porte-à-faux calme */}
      <mesh position={[1.1, 5.05, -90.5]} material={materials.boardConcrete}>
        <boxGeometry args={[9.6, 0.45, 6.2]} />
      </mesh>

      {/* Garde-corps minimaliste en acier thermolaqué en bord d'esplanade */}
      <group position={[1.1, 0, -94.8]}>
        <mesh position={[0, 1.02, 0]} material={materials.anodizedSteel}>
          <boxGeometry args={[7.6, 0.045, 0.06]} />
        </mesh>
        {[-3.4, -1.7, 0, 1.7, 3.4].map((px, idx) => (
          <mesh key={idx} position={[px, 0.51, 0]} material={materials.anodizedSteel}>
            <boxGeometry args={[0.035, 1.02, 0.035]} />
          </mesh>
        ))}
      </group>

      {/* Horizon céleste d'heure bleue final */}
      <mesh position={[1.1, 5.2, -106.0]}>
        <planeGeometry args={[48, 22]} />
        <primitive object={materials.blueHourSky} attach="material" />
      </mesh>
    </group>
  );
}
