import { useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { HERO_STELE_AXES } from '../../data/portfolioData';
import {
  motionStore,
  selectExpertiseDomain,
  setHeroSteleHoverIndex,
} from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface EquilibriumPortalProps {
  materials: ArchitecturalMaterialSet;
}

const SKYLINE_TOWERS: ReadonlyArray<{
  pos: [number, number, number];
  size: [number, number, number];
}> = [
  { pos: [0.6, 2.1, -13.2], size: [0.62, 4.2, 0.62] },
  { pos: [1.45, 2.85, -13.8], size: [0.74, 5.7, 0.74] },
  { pos: [2.35, 1.9, -12.8], size: [0.58, 3.8, 0.58] },
  { pos: [3.35, 3.35, -14.2], size: [0.82, 6.7, 0.82] },
  { pos: [4.35, 2.4, -13.4], size: [0.68, 4.8, 0.68] },
  { pos: [5.4, 2.95, -14.0], size: [0.76, 5.9, 0.76] },
];

/**
 * Scène 01 — L'Oculus Monumental, la Silhouette d'Échelle & la Stèle de Verre Interactive 3D
 * Transforme les principes de REFERENCE_HERO_PORTFOLIO.png en espace tridimensionnel vivant :
 * 1. Oculus circulaire monumental à gorge lumineuse froide (#FFFFFF / #76A9E8) ouvrant sur le ciel.
 * 2. Cinq emmarchements cérémoniels et silhouette humaine discrète projetant son reflet au sol.
 * 3. Stèle de verre architecturale droite (« AUDIT · FINANCE · DÉVELOPPEMENT · INNOVATION »)
 *    réellement interactive dans l'espace 3D (survol lumineux + navigation directe).
 */
export function EquilibriumPortal({ materials }: EquilibriumPortalProps) {
  const sphereUnderSoffitRef = useRef<THREE.Mesh>(null);
  const highlightBarRef = useRef<THREE.Mesh>(null);
  const steleGroupRef = useRef<THREE.Group>(null);
  const [hoveredRow, setHoveredRow] = useState<-1 | 0 | 1 | 2 | 3>(-1);

  // Géométrie extrudée du grand mur-anneau de l'oculus (avec véritable épaisseur architecturale)
  const oculusExtrudeGeo = useMemo(() => {
    const outerShape = new THREE.Shape();
    outerShape.absarc(0, 0, 6.35, 0, Math.PI * 2, false);
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 3.68, 0, Math.PI * 2, true);
    outerShape.holes.push(holePath);

    return new THREE.ExtrudeGeometry(outerShape, {
      depth: 1.85,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelSegments: 3,
      curveSegments: 72,
    });
  }, []);

  useFrame(({ clock }, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();

    if (sphereUnderSoffitRef.current && !motionStore.reducedMotion) {
      sphereUnderSoffitRef.current.position.y = 3.12 + Math.sin(t * 0.75) * 0.045;
    }

    const activeHover = hoveredRow >= 0 ? hoveredRow : motionStore.heroSteleHoverIndex;

    if (steleGroupRef.current) {
      const targetZ = activeHover >= 0 ? 1.78 : 1.65;
      steleGroupRef.current.position.z = THREE.MathUtils.damp(
        steleGroupRef.current.position.z,
        targetZ,
        6,
        dt
      );
    }

    if (highlightBarRef.current) {
      if (activeHover !== -1) {
        // Aligné sur les 4 lignes gravées de createHeroGlassSteleTexture
        const rowOffsets = [0.46, 0.17, -0.12, -0.41] as const;
        const targetY = rowOffsets[activeHover];
        highlightBarRef.current.visible = true;
        highlightBarRef.current.position.y = THREE.MathUtils.damp(
          highlightBarRef.current.position.y,
          targetY,
          10,
          dt
        );
      } else {
        highlightBarRef.current.visible = false;
      }
    }
  });

  const isHtmlUiEvent = (e: ThreeEvent<PointerEvent | MouseEvent>): boolean => {
    const target = e.nativeEvent?.target as HTMLElement | null;
    if (!target) return false;
    return Boolean(target.closest('a, button, nav, input, [role="dialog"]'));
  };

  const handleRowPointerOver = (
    e: ThreeEvent<PointerEvent>,
    rowIndex: 0 | 1 | 2 | 3
  ) => {
    if (isHtmlUiEvent(e)) return;
    e.stopPropagation();
    setHoveredRow(rowIndex);
    setHeroSteleHoverIndex(rowIndex);
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'pointer';
    }
  };

  const handleRowPointerOut = () => {
    setHoveredRow(-1);
    setHeroSteleHoverIndex(-1);
    if (typeof document !== 'undefined') {
      document.body.style.cursor = '';
    }
  };

  const handleRowClick = (
    e: ThreeEvent<MouseEvent>,
    rowIndex: 0 | 1 | 2 | 3
  ) => {
    if (isHtmlUiEvent(e)) return;
    e.stopPropagation();
    const axis = HERO_STELE_AXES[rowIndex];
    selectExpertiseDomain(axis.targetDomainIndex);
    const expertiseEl = document.getElementById('expertise');
    expertiseEl?.scrollIntoView?.({
      behavior: motionStore.reducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <group name="HeroOculusMonument">
      {/* =====================================================================
          1. OUVERTURE CÉLESTE & HORIZON ARCHITECTURAL LOINTAIN (z = -15.5m)
         ===================================================================== */}
      <mesh position={[3.35, 4.4, -15.6]} rotation={[0, -0.16, 0]}>
        <planeGeometry args={[22, 14]} />
        <primitive object={materials.skyApertureMaterial} attach="material" />
      </mesh>

      {/* Silhouettes architecturales minimalistes dans la brume d'horizon */}
      <group name="DistantHorizonTowers">
        {SKYLINE_TOWERS.map((tower, idx) => (
          <mesh
            key={idx}
            position={tower.pos}
            material={materials.distantTowerMaterial}
          >
            <boxGeometry args={tower.size} />
          </mesh>
        ))}
      </group>

      {/* =====================================================================
          2. L'OCULUS CIRCULAIRE MONUMENTAL À GORGE LUMINEUSE (z = -5.4m)
         ===================================================================== */}
      <group position={[2.85, 3.65, -5.6]} rotation={[0, -0.26, 0]}>
        {/* Masse circulaire en béton coffré */}
        <mesh
          geometry={oculusExtrudeGeo}
          material={materials.darkConcrete}
          castShadow
          receiveShadow
        />

        {/* Gorge annulaire intérieure blanc-azur haute intensité (zéro z-fighting) */}
        <mesh position={[0, 0, 1.92]} material={materials.luminousCore}>
          <torusGeometry args={[3.59, 0.055, 24, 112]} />
        </mesh>
        <mesh position={[0, 0, 1.95]}>
          <ringGeometry args={[3.46, 3.72, 112]} />
          <meshBasicMaterial
            color="#76A9E8"
            transparent
            opacity={0.44}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Grands pans de verre verticaux intérieurs captant le ciel */}
        <mesh position={[1.15, 0.2, 0.85]} material={materials.architecturalGlass}>
          <boxGeometry args={[1.45, 7.2, 0.08]} />
        </mesh>
        <mesh position={[2.35, -0.1, 1.05]} material={materials.architecturalGlass}>
          <boxGeometry args={[1.15, 6.8, 0.08]} />
        </mesh>
        <mesh position={[0.42, 0.2, 0.9]} material={materials.luminousEdge}>
          <boxGeometry args={[0.024, 7.2, 0.024]} />
        </mesh>
        <mesh position={[1.76, 0.2, 1.08]} material={materials.luminousEdge}>
          <boxGeometry args={[0.024, 6.8, 0.024]} />
        </mesh>
      </group>

      {/* =====================================================================
          3. EMMARCHEMENTS CÉRÉMONIELS, MURETS & SILHOUETTE HUMAINE D'ÉCHELLE
         ===================================================================== */}
      <group position={[1.82, 0, -0.15]}>
        {[0, 1, 2, 3, 4].map((step) => {
          const stepH = 0.115;
          const isTopLanding = step === 4;
          const depth = isTopLanding ? 3.4 : 0.58;
          const y = step * stepH + stepH * 0.5;
          const z = isTopLanding ? 1.35 - step * 0.54 - 1.41 : 1.35 - step * 0.54;
          const w = 5.15 - step * 0.12;
          return (
            <group key={step}>
              <mesh
                position={[0, y, z]}
                material={materials.darkConcrete}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[w, stepH, depth]} />
              </mesh>
              {/* Nez de marche accrochant le contre-jour bleu froid */}
              <mesh position={[0, y + stepH * 0.48, 1.35 - step * 0.54 + 0.285]}>
                <boxGeometry args={[w, 0.012, 0.016]} />
                <meshBasicMaterial color="#8CC0FF" transparent opacity={0.55} />
              </mesh>
            </group>
          );
        })}

        {/* Muret bas de cadrage gauche */}
        <mesh
          position={[-2.62, 0.46, 0.72]}
          rotation={[0, 0.24, 0]}
          material={materials.deepConcrete}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.42, 0.92, 3.2]} />
        </mesh>

        {/* Muret bas de cadrage droit supportant la stèle de verre */}
        <mesh
          position={[2.68, 0.52, 0.95]}
          rotation={[0, -0.38, 0]}
          material={materials.deepConcrete}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.48, 1.04, 3.6]} />
        </mesh>

        {/* Silhouette humaine architecturale sobre (échelle monumentale ~1,75 m) */}
        <group position={[0.14, 0.575, -0.55]} name="HumanScaleSilhouette">
          {/* Jambe gauche */}
          <mesh position={[-0.065, 0.42, 0.02]} material={materials.silhouetteMaterial} castShadow>
            <capsuleGeometry args={[0.048, 0.72, 8, 12]} />
          </mesh>
          {/* Jambe droite en léger pas avant */}
          <mesh position={[0.065, 0.42, -0.03]} material={materials.silhouetteMaterial} castShadow>
            <capsuleGeometry args={[0.048, 0.72, 8, 12]} />
          </mesh>
          {/* Buste veste structurée */}
          <mesh position={[0, 1.08, 0]} material={materials.silhouetteMaterial} castShadow>
            <cylinderGeometry args={[0.175, 0.135, 0.62, 16]} />
          </mesh>
          {/* Épaules */}
          <mesh position={[0, 1.35, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.silhouetteMaterial} castShadow>
            <capsuleGeometry args={[0.068, 0.26, 8, 12]} />
          </mesh>
          {/* Bras gauche & droit le long du corps */}
          <mesh position={[-0.195, 1.06, 0]} rotation={[0, 0, 0.06]} material={materials.silhouetteMaterial}>
            <capsuleGeometry args={[0.038, 0.48, 6, 10]} />
          </mesh>
          <mesh position={[0.195, 1.06, 0]} rotation={[0, 0, -0.06]} material={materials.silhouetteMaterial}>
            <capsuleGeometry args={[0.038, 0.48, 6, 10]} />
          </mesh>
          {/* Tête */}
          <mesh position={[0, 1.56, -0.01]} material={materials.silhouetteMaterial} castShadow>
            <sphereGeometry args={[0.098, 18, 18]} />
          </mesh>
        </group>
      </group>

      {/* Sphère d'équilibre en chrome sombre sous le soffite gauche (réf. image) */}
      <mesh
        ref={sphereUnderSoffitRef}
        position={[-0.52, 3.12, 3.05]}
        material={materials.specularChrome}
        castShadow
      >
        <sphereGeometry args={[0.235, 40, 40]} />
      </mesh>

      {/* =====================================================================
          4. STÈLE DE VERRE ARCHITECTURALE INTERACTIVE 3D (Droite)
             « AUDIT · FINANCE · DÉVELOPPEMENT · INNOVATION »
         ===================================================================== */}
      <group
        ref={steleGroupRef}
        position={[3.88, 1.98, 1.65]}
        rotation={[0, -0.42, 0]}
        name="HeroInteractiveGlassStele"
      >
        {/* Dalle principale en verre gravé */}
        <mesh material={materials.heroSteleFaceMaterial} castShadow>
          <boxGeometry args={[2.62, 2.88, 0.055]} />
        </mesh>

        {/* Blocs prismatiques internes en verre à gauche de la stèle (fidèles à la réf.) */}
        <mesh position={[-0.92, -0.68, -0.14]} material={materials.architecturalGlass}>
          <boxGeometry args={[0.28, 1.48, 0.22]} />
        </mesh>
        <mesh position={[-0.6, -0.48, -0.18]} material={materials.architecturalGlass}>
          <boxGeometry args={[0.28, 1.88, 0.22]} />
        </mesh>

        {/* Arêtes biseautées lumineuses */}
        <mesh position={[0, 1.45, 0]} material={materials.luminousCore}>
          <boxGeometry args={[2.64, 0.022, 0.062]} />
        </mesh>
        <mesh position={[-1.32, 0, 0]} material={materials.luminousEdge}>
          <boxGeometry args={[0.022, 2.9, 0.062]} />
        </mesh>
        <mesh position={[1.32, 0, 0]} material={materials.luminousEdge}>
          <boxGeometry args={[0.022, 2.9, 0.062]} />
        </mesh>

        {/* Barre de focus lumineuse 3D réagissant au survol d'un des 4 axes */}
        <mesh ref={highlightBarRef} position={[0.12, 0.46, 0.032]} visible={false}>
          <planeGeometry args={[1.92, 0.24]} />
          <meshBasicMaterial color="#76A9E8" transparent opacity={0.22} />
        </mesh>

        {/* 4 zones interactives raycastées directement dans l'espace 3D */}
        {([0, 1, 2, 3] as const).map((rowIdx) => {
          const yPos = [0.46, 0.17, -0.12, -0.41][rowIdx];
          return (
            <mesh
              key={rowIdx}
              position={[0.12, yPos, 0.04]}
              onPointerOver={(e) => handleRowPointerOver(e, rowIdx)}
              onPointerOut={handleRowPointerOut}
              onClick={(e) => handleRowClick(e, rowIdx)}
            >
              <planeGeometry args={[2.1, 0.26]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          );
        })}
      </group>

      {/* Sphère secondaire discrète à l'extrême droite de la stèle */}
      <mesh
        position={[5.38, 1.88, 0.92]}
        material={materials.specularChrome}
      >
        <sphereGeometry args={[0.18, 32, 32]} />
      </mesh>
    </group>
  );
}
