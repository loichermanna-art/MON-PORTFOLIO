import { MeshReflectorMaterial } from '@react-three/drei';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface PeristyleHallProps {
  materials: ArchitecturalMaterialSet;
  isMobile?: boolean;
}

/**
 * Ossature Architecturale Continue du Pavillon Contemporain (z = +14m -> -106m) :
 * Unifie les 6 séquences en UN SEUL ÉDIFICE CONTINU (esprit Salk Institute / Tadao Ando).
 */
export function PeristyleHall({ materials, isMobile = false }: PeristyleHallProps) {
  const usePlanarReflector = !isMobile && !motionStore.reducedMotion;

  return (
    <group name="TectonicConcretePavilion">
      {/* 1. Dallage général continu en pierre de basalte adoucie */}
      <mesh
        position={[0, 0, -50]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={materials.honedBasaltFloor}
      >
        <planeGeometry args={[58, 156]} />
      </mesh>

      {/* 2. Canal d'eau axial ininterrompu (z = +7.5m -> -104.2m, longueur 111.7m) */}
      <group position={[2.25, 0.012, -48.35]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[4.4, 111.7]} />
          {usePlanarReflector ? (
            <MeshReflectorMaterial
              blur={[340, 105]}
              resolution={512}
              mixBlur={0.88}
              mixStrength={1.22}
              roughness={0.075}
              depthScale={0.5}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#081526"
              metalness={0.36}
              mirror={0.74}
              normalMap={materials.basaltNormalMap ?? undefined}
              normalScale={[0.04, 0.04]}
            />
          ) : (
            <primitive object={materials.honedBasaltFloor} attach="material" />
          )}
        </mesh>

        <mesh position={[-2.26, 0.035, 0]} material={materials.deepConcrete} receiveShadow>
          <boxGeometry args={[0.12, 0.07, 111.9]} />
        </mesh>
        <mesh position={[2.26, 0.035, 0]} material={materials.deepConcrete} receiveShadow>
          <boxGeometry args={[0.12, 0.07, 111.9]} />
        </mesh>
        <mesh position={[0, 0.035, 55.9]} material={materials.deepConcrete} receiveShadow>
          <boxGeometry args={[4.64, 0.07, 0.12]} />
        </mesh>
        <mesh position={[0, 0.025, -55.9]} material={materials.anodizedSteel}>
          <boxGeometry args={[4.64, 0.05, 0.09]} />
        </mesh>
      </group>

      {/* 3. Mur porteur gauche continu en béton banché (z = +12m -> -96m) */}
      <mesh
        position={[-4.85, 2.65, -42]}
        material={materials.deepConcrete}
        receiveShadow
      >
        <boxGeometry args={[1.2, 5.3, 108]} />
      </mesh>

      <mesh position={[-4.22, 0.04, -42]} material={materials.anodizedSteel}>
        <boxGeometry args={[0.08, 0.08, 108]} />
      </mesh>

      <mesh
        position={[-3.82, 0.006, -42]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        material={materials.contactAO}
      >
        <planeGeometry args={[108, 0.95]} />
      </mesh>

      {/* Refend vertical en béton banché cadrant l'alcôve d'entrée du Hero */}
      <group position={[-1.65, 0, 2.25]}>
        <mesh
          position={[0, 2.45, 0]}
          material={materials.boardConcrete}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.64, 4.9, 1.75]} />
        </mesh>
        <mesh position={[0, 0.035, 0]} material={materials.anodizedSteel}>
          <boxGeometry args={[0.58, 0.07, 1.69]} />
        </mesh>
        <mesh
          position={[0.5, 0.006, 0]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          material={materials.contactAO}
        >
          <planeGeometry args={[2.1, 0.55]} />
        </mesh>
      </group>

      {/* 4. Toiture & poutres transversales rythmant toute la nef (z = +7.2 -> -92m) */}
      <mesh position={[-1.2, 5.35, 4.5]} material={materials.deepConcrete}>
        <boxGeometry args={[12.5, 0.5, 14.0]} />
      </mesh>

      {[7.2, 4.4, 1.6, -1.2, -15.5, -31.5, -44.5, -52.5, -69.5, -91.5].map((zBeam, idx) => (
        <group key={idx} position={[-0.7, 4.82, zBeam]}>
          <mesh material={materials.boardConcrete} castShadow receiveShadow>
            <boxGeometry args={[11.2, 0.62, 0.48]} />
          </mesh>
          <mesh
            position={[0.45, -0.315, -0.25]}
            rotation={[Math.PI * 0.5, 0, 0]}
            material={materials.softCoveLight}
          >
            <planeGeometry args={[8.6, 0.38]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
