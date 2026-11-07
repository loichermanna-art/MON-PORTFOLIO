import { MeshReflectorMaterial } from '@react-three/drei';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface PeristyleHallProps {
  materials: ArchitecturalMaterialSet;
  isMobile?: boolean;
}

/**
 * Infrastructure Architecturale Continue & Portique Brutaliste du Hero (« MIDNIGHT BLUE ») :
 * - Dalle miroir temps réel (MeshReflectorMaterial sur Desktop) reflétant l'oculus, la silhouette
 *   et la stèle de verre.
 * - Portique en béton sombre à gauche et soffites en porte-à-faux en haut-gauche créant l'écrin
 *   naturel haute-lisibilité de la typographie « Loïc AKANDA ».
 * - Disque architectural affleurant en bas-droite et socles minéraux de premier plan en bas-gauche
 *   pour une parallaxe d'occlusion réelle lors de l'avancée caméra.
 */
export function PeristyleHall({ materials, isMobile = false }: PeristyleHallProps) {
  const usePlanarReflector = !isMobile && !motionStore.reducedMotion;

  return (
    <group name="MidnightArchitecturalSpine">
      {/* Dalle monumentale réfléchissante bleu nuit */}
      <mesh
        position={[0, 0, -44]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[48, 132]} />
        {usePlanarReflector ? (
          <MeshReflectorMaterial
            blur={[300, 90]}
            resolution={512}
            mixBlur={0.88}
            mixStrength={1.42}
            roughness={0.26}
            depthScale={0.85}
            minDepthThreshold={0.35}
            maxDepthThreshold={1.35}
            color="#08172C"
            metalness={0.58}
            mirror={0.62}
          />
        ) : (
          <primitive object={materials.wetMirrorFallback} attach="material" />
        )}
      </mesh>

      {/* Filets lumineux de calepinage longitudinal guidant le regard de 01 à 06 */}
      <mesh position={[-1.08, 0.008, -42]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.02, 108]} />
        <meshBasicMaterial color="#76A9E8" transparent opacity={0.28} />
      </mesh>
      <mesh position={[4.45, 0.008, -42]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.02, 108]} />
        <meshBasicMaterial color="#76A9E8" transparent opacity={0.24} />
      </mesh>

      {/* =====================================================================
          HERO PREMIER PLAN & PORTIQUE GAUCHE (Encadrement naturel du texte)
         ===================================================================== */}

      {/* Paroi sombre d'alcôve gauche garantissant un contraste 18.4:1 naturel derrière le H1 */}
      <mesh
        position={[-5.4, 3.6, 3.2]}
        material={materials.deepConcrete}
        receiveShadow
      >
        <boxGeometry args={[6.8, 7.6, 10.5]} />
      </mesh>

      {/* Pile verticale en béton coffré bordant la droite du bloc typographique */}
      <mesh
        position={[-1.62, 2.45, 1.55]}
        material={materials.darkConcrete}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.08, 4.9, 1.95]} />
      </mesh>

      {/* Fente lumineuse verticale fine sur l'arête de la pile (réf. REFERENCE_HERO_PORTFOLIO.png) */}
      <mesh position={[-1.07, 2.15, 2.53]} material={materials.luminousEdge}>
        <boxGeometry args={[0.022, 4.1, 0.022]} />
      </mesh>

      {/* Grand soffite supérieur en porte-à-faux (haut-gauche -> centre) */}
      <mesh
        position={[-2.45, 5.25, 5.1]}
        rotation={[0, 0.14, 0]}
        material={materials.deepConcrete}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[5.2, 1.7, 6.4]} />
      </mesh>

      {/* Second bloc béton en encorbellement avec joint lumineux d'angle */}
      <mesh
        position={[-0.52, 4.42, 3.15]}
        rotation={[0, -0.18, 0]}
        material={materials.darkConcrete}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2.55, 1.18, 3.7]} />
      </mesh>

      {/* Point lumineux d'encastrement sous le soffite */}
      <mesh position={[-1.32, 3.82, 2.55]} material={materials.luminousCore}>
        <boxGeometry args={[0.16, 0.03, 0.16]} />
      </mesh>

      {/* Socles architecturaux bas de premier plan gauche (parallaxe d'avant-plan au scroll) */}
      <mesh
        position={[-2.75, 0.22, 8.35]}
        rotation={[0.06, 0.38, -0.08]}
        material={materials.deepConcrete}
      >
        <boxGeometry args={[2.1, 0.52, 1.45]} />
      </mesh>
      <mesh
        position={[-1.65, 0.12, 8.95]}
        rotation={[0.04, -0.24, 0.05]}
        material={materials.darkConcrete}
      >
        <boxGeometry args={[1.35, 0.3, 1.05]} />
      </mesh>

      {/* Plateforme circulaire affleurante en acier sombre poli (bas-droite de la référence) */}
      <group position={[3.65, 0.018, 5.45]}>
        <mesh material={materials.brushedDarkSteel} receiveShadow>
          <cylinderGeometry args={[2.15, 2.18, 0.036, 64]} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.019, 0]}>
          <ringGeometry args={[2.12, 2.155, 64]} />
          <meshBasicMaterial color="#76A9E8" transparent opacity={0.55} />
        </mesh>
      </group>

      {/* Sillon courbe gravé dans la dalle devant les marches */}
      <mesh position={[3.1, 0.009, 3.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.38, 3.41, 64, 1, Math.PI * 0.65, Math.PI * 0.72]} />
        <meshBasicMaterial color="#76A9E8" transparent opacity={0.32} />
      </mesh>
    </group>
  );
}
