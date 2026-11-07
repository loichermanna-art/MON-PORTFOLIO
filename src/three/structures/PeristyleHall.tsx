import { MeshReflectorMaterial } from '@react-three/drei';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface PeristyleHallProps {
  materials: ArchitecturalMaterialSet;
  isMobile?: boolean;
}

/**
 * Ossature Architecturale Réaliste du Pavillon Contemporain (Béton banché, Basalte adouci,
 * Plafond à poutres portantes et Miroir d'eau encadré de margelles) :
 * - 100 % des éléments obéissent à la gravité (colonnes porteuses, plinthes en retrait,
 *   ombres d'occlusion ambiante de contact aux pieds de murs).
 * - Séparation réaliste entre le dallage de pierre adoucie (semi-mat texturé) et le bassin
 *   architectural calme encastré (miroir d'eau inspiré de Tadao Ando / Salk Institute).
 */
export function PeristyleHall({ materials, isMobile = false }: PeristyleHallProps) {
  const usePlanarReflector = !isMobile && !motionStore.reducedMotion;

  return (
    <group name="TectonicConcretePavilion">
      {/* =====================================================================
          1. DALLAGE GÉNÉRAL EN PIERRE DE BASALTE ADOUCIE (avec NormalMap & RoughnessMap)
         ===================================================================== */}
      <mesh
        position={[0, 0, -44]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={materials.honedBasaltFloor}
      >
        <planeGeometry args={[52, 136]} />
      </mesh>

      {/* =====================================================================
          2. BASSIN ARCHITECTURAL ENCASTRÉ (« MIROIR D'EAU » CALME AVEC MARGELLES)
             Situé dans l'axe perspectif droit vers l'oculus (x = 2.25m, z = +7.5m -> -5.2m)
         ===================================================================== */}
      <group position={[2.25, 0.012, 1.6]}>
        {/* Surface d'eau immobile réfléchissant le ciel d'heure bleue et l'oculus en béton */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[5.4, 11.6]} />
          {usePlanarReflector ? (
            <MeshReflectorMaterial
              blur={[360, 110]}
              resolution={512}
              mixBlur={0.9}
              mixStrength={1.18}
              roughness={0.08}
              depthScale={0.5}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#081526"
              metalness={0.35}
              mirror={0.72}
              normalMap={materials.basaltNormalMap ?? undefined}
              normalScale={[0.04, 0.04]}
            />
          ) : (
            <primitive object={materials.honedBasaltFloor} attach="material" />
          )}
        </mesh>

        {/* Margelles basses en pierre sombre délimitant physiquement le bassin */}
        <mesh position={[-2.74, 0.035, 0]} material={materials.deepConcrete} receiveShadow>
          <boxGeometry args={[0.12, 0.07, 11.8]} />
        </mesh>
        <mesh position={[2.74, 0.035, 0]} material={materials.deepConcrete} receiveShadow>
          <boxGeometry args={[0.12, 0.07, 11.8]} />
        </mesh>
        <mesh position={[0, 0.035, 5.84]} material={materials.deepConcrete} receiveShadow>
          <boxGeometry args={[5.6, 0.07, 0.12]} />
        </mesh>
      </group>

      {/* =====================================================================
          3. PAROI EN BÉTON BANCHÉ GAUCHE & COLONNADE PORTEUSE DU PORTIQUE
         ===================================================================== */}
      {/* Mur porteur continu gauche (arrière-plan naturel et sobre de la typographie) */}
      <mesh
        position={[-4.85, 2.65, -18]}
        material={materials.deepConcrete}
        receiveShadow
      >
        <boxGeometry args={[1.2, 5.3, 68]} />
      </mesh>

      {/* Plinthe en retrait sombre (shadow-gap architectural réel au pied du mur gauche) */}
      <mesh position={[-4.22, 0.04, -18]} material={materials.anodizedSteel}>
        <boxGeometry args={[0.08, 0.08, 68]} />
      </mesh>

      {/* Ombre d'occlusion ambiante douce au pied du mur gauche */}
      <mesh
        position={[-3.82, 0.006, 2]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        material={materials.contactAO}
      >
        <planeGeometry args={[28, 0.95]} />
      </mesh>

      {/* Refend vertical en béton banché marquant la limite droite de l'alcôve Hero */}
      <group position={[-1.58, 0, 2.15]}>
        <mesh
          position={[0, 2.45, 0]}
          material={materials.boardConcrete}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.68, 4.9, 1.85]} />
        </mesh>
        {/* Plinthe acier en creux */}
        <mesh position={[0, 0.035, 0]} material={materials.anodizedSteel}>
          <boxGeometry args={[0.62, 0.07, 1.79]} />
        </mesh>
        {/* Ombre de contact au sol autour du pilier */}
        <mesh
          position={[0.52, 0.006, 0]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          material={materials.contactAO}
        >
          <planeGeometry args={[2.2, 0.55]} />
        </mesh>
      </group>

      {/* =====================================================================
          4. PLAFOND À CAISSONS & POUTRES TRANSVERSALES EN BÉTON BRUT
         ===================================================================== */}
      {/* Dalle de toiture haute au-dessus du portique d'entrée */}
      <mesh position={[-1.2, 5.35, 4.5]} material={materials.deepConcrete}>
        <boxGeometry args={[12.5, 0.5, 14.0]} />
      </mesh>

      {/* Poutres maîtresses régulières rythmant la perspective du plafond */}
      {[7.2, 4.4, 1.6, -1.2].map((zBeam, idx) => (
        <group key={idx} position={[-0.9, 4.78, zBeam]}>
          <mesh material={materials.boardConcrete} castShadow receiveShadow>
            <boxGeometry args={[10.8, 0.68, 0.52]} />
          </mesh>
          {/* Gorge lumineuse architecturale douce lavant le béton (dégradé GLSL, zéro néon) */}
          <mesh
            position={[0.4, -0.345, -0.28]}
            rotation={[Math.PI * 0.5, 0, 0]}
            material={materials.softCoveLight}
          >
            <planeGeometry args={[8.4, 0.42]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
