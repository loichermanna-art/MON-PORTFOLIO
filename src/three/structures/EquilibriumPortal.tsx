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

/**
 * Scène 01 — Façade Monumentale à Oculus en Béton Banché & Baie Vitrée à Meneaux Acier
 * Architecture 100 % constructible, sobre et photoréaliste (inspirée de Tadao Ando & Mies van der Rohe) :
 * - Aucun personnage-capsule artificiel, aucune sphère flottante, aucun anneau néon, aucun nuage 2D.
 * - Véritable mur porteur de 2,10 m d'épaisseur en béton banché percé d'une voûte circulaire
 *   dont l'intrados capte naturellement la lumière d'heure bleue.
 * - Véritable façade rideau vitrée à meneaux verticaux en acier thermolaqué ancrée du sol au plafond
 *   (avec sérigraphie muséale interactive « AUDIT · FINANCE · DÉVELOPPEMENT · INNOVATION »).
 */
export function EquilibriumPortal({ materials }: EquilibriumPortalProps) {
  const highlightWashRef = useRef<THREE.Mesh>(null);
  const [hoveredRow, setHoveredRow] = useState<-1 | 0 | 1 | 2 | 3>(-1);

  // Mur de façade monumental en béton banché (16m x 9m, épaisseur réelle 2.05m) percé d'un oculus
  const concreteOculusWallGeo = useMemo(() => {
    const wall = new THREE.Shape();
    wall.moveTo(-8.5, -0.6);
    wall.lineTo(8.5, -0.6);
    wall.lineTo(8.5, 8.6);
    wall.lineTo(-8.5, 8.6);
    wall.closePath();

    // Ouverture circulaire architecturale (centre légèrement surélevé, tangente au palier haut)
    const oculusHole = new THREE.Path();
    oculusHole.absarc(0.4, 3.55, 3.15, 0, Math.PI * 2, true);
    wall.holes.push(oculusHole);

    const geo = new THREE.ExtrudeGeometry(wall, {
      depth: 2.05,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.025,
      bevelSegments: 2,
      curveSegments: 80,
    });

    // Normalisation propre des UV pour appliquer fidèlement le grain du béton coffré à l'échelle métrique
    const pos = geo.attributes.position;
    const uvs = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      uvs.setXY(i, (x + z * 0.5) * 0.16, y * 0.16);
    }
    uvs.needsUpdate = true;
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    const activeHover = hoveredRow !== -1 ? hoveredRow : motionStore.heroSteleHoverIndex;

    if (highlightWashRef.current) {
      if (activeHover !== -1) {
        const rowOffsets = [0.44, 0.12, -0.2, -0.52] as const;
        highlightWashRef.current.visible = true;
        highlightWashRef.current.position.y = THREE.MathUtils.damp(
          highlightWashRef.current.position.y,
          rowOffsets[activeHover],
          10,
          dt
        );
      } else {
        highlightWashRef.current.visible = false;
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
          1. VOÛTE CÉLESTE D'HEURE BLEUE & LIGNE D'HORIZON MARINE SOBRE
         ===================================================================== */}
      <mesh position={[2.2, 5.2, -26.0]} rotation={[0, -0.12, 0]}>
        <planeGeometry args={[56, 24]} />
        <primitive object={materials.blueHourSky} attach="material" />
      </mesh>

      {/* Plan d'eau calme d'horizon derrière l'oculus (continuité maritime / lacustre type Ando) */}
      <mesh
        position={[2.4, 0.36, -15.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={materials.honedBasaltFloor}
      >
        <planeGeometry args={[42, 20]} />
      </mesh>

      {/* =====================================================================
          2. MUR DE FAÇADE MONUMENTAL EN BÉTON BANCHÉ PERCÉ DE L'OCULUS (z = -6.2m)
         ===================================================================== */}
      <group position={[2.25, 0, -6.2]} rotation={[0, -0.22, 0]}>
        <mesh
          geometry={concreteOculusWallGeo}
          material={materials.boardConcrete}
          castShadow
          receiveShadow
        />

        {/* Éclairage architectural rasant dissimulé dans la feuillure arrière de l'oculus */}
        <mesh
          position={[0.4, 3.55, 0.08]}
          rotation={[0, 0, 0]}
          material={materials.softCoveLight}
        >
          <ringGeometry args={[3.14, 3.42, 80]} />
        </mesh>

        {/* Ombre de contact au pied du grand mur d'oculus */}
        <mesh
          position={[0, 0.465, 2.45]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={materials.contactAO}
        >
          <planeGeometry args={[14, 0.85]} />
        </mesh>

        {/* Voile atmosphérique très subtil traversant l'ouverture circulaire */}
        <mesh
          position={[0.25, 2.85, 2.4]}
          rotation={[-0.22, 0.35, 0]}
          material={materials.atmosphericShaft}
        >
          <planeGeometry args={[5.4, 6.2]} />
        </mesh>
      </group>

      {/* =====================================================================
          3. EMMARCHEMENTS LARGES EN PIERRE DE BASALTE & PARVIS HAUT
         ===================================================================== */}
      <group position={[2.15, 0, -2.35]} rotation={[0, -0.22, 0]}>
        {[0, 1, 2, 3].map((step) => {
          const stepH = 0.115;
          const isLanding = step === 3;
          const depth = isLanding ? 4.2 : 0.68;
          const y = step * stepH + stepH * 0.5;
          const z = isLanding ? -step * 0.64 - 1.65 : -step * 0.64;
          const width = 5.6;

          return (
            <group key={step}>
              <mesh
                position={[0, y, z]}
                material={materials.boardConcrete}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[width, stepH, depth]} />
              </mesh>
              {/* Ombre de creux sous chaque nez de marche (réalisme tectonique) */}
              <mesh
                position={[0, step * stepH + 0.004, -step * 0.64 + 0.38]}
                rotation={[-Math.PI / 2, 0, 0]}
                material={materials.contactAO}
              >
                <planeGeometry args={[width, 0.24]} />
              </mesh>
            </group>
          );
        })}

        {/* Muret garde-corps massif en béton banché à gauche des marches */}
        <mesh
          position={[-2.92, 0.52, -1.2]}
          material={materials.deepConcrete}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.38, 1.04, 4.8]} />
        </mesh>
      </group>

      {/* =====================================================================
          4. BAIE VITRÉE ARCHITECTURALE DROITE À MENEAUX ACIER (100 % ancrée sol-plafond)
             Sérigraphie interactive « AUDIT · FINANCE · DÉVELOPPEMENT · INNOVATION »
         ===================================================================== */}
      <group
        position={[4.05, 0, 1.55]}
        rotation={[0, -0.42, 0]}
        name="HeroInteractiveGlassStele"
      >
        {/* Rail bas d'ancrage en acier thermolaqué encastré dans le dallage */}
        <mesh position={[0, 0.045, 0]} material={materials.anodizedSteel} castShadow receiveShadow>
          <boxGeometry args={[3.28, 0.09, 0.18]} />
        </mesh>

        {/* Lisse haute reliée sous la poutre béton */}
        <mesh position={[0, 4.42, 0]} material={materials.anodizedSteel} castShadow>
          <boxGeometry args={[3.28, 0.1, 0.18]} />
        </mesh>

        {/* Meneaux verticaux structurels (profilés I en acier thermolaqué sombre) */}
        {[-1.6, -0.54, 0.54, 1.6].map((mx, idx) => (
          <mesh
            key={idx}
            position={[mx, 2.23, 0]}
            material={materials.anodizedSteel}
            castShadow
          >
            <boxGeometry args={[0.055, 4.32, 0.15]} />
          </mesh>
        ))}

        {/* Traverses horizontales fines d'imposte et d'allège */}
        {[1.05, 3.38].map((ty, idx) => (
          <mesh key={idx} position={[0, ty, 0]} material={materials.anodizedSteel}>
            <boxGeometry args={[3.22, 0.038, 0.12]} />
          </mesh>
        ))}

        {/* Vitrages feuilletés latéraux */}
        <mesh position={[-1.07, 2.23, 0]} material={materials.structuralGlass}>
          <planeGeometry args={[1.02, 4.26]} />
        </mesh>
        <mesh position={[1.07, 2.23, 0]} material={materials.structuralGlass}>
          <planeGeometry args={[1.02, 4.26]} />
        </mesh>

        {/* Panneau central sérigraphié (« AUDIT · FINANCE · DÉVELOPPEMENT · INNOVATION ») */}
        <mesh position={[0, 2.22, 0.01]} material={materials.etchedBayGlass}>
          <planeGeometry args={[1.04, 2.3]} />
        </mesh>

        {/* Ombre de contact au sol le long de la façade vitrée */}
        <mesh
          position={[0, 0.005, 0.25]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={materials.contactAO}
        >
          <planeGeometry args={[3.4, 0.48]} />
        </mesh>

        {/* Halo doux muséal rétro-éclairant la ligne survolée */}
        <mesh ref={highlightWashRef} position={[0, 2.22, -0.02]} visible={false}>
          <planeGeometry args={[1.02, 0.28]} />
          <meshBasicMaterial color="#9AC2F0" transparent opacity={0.18} />
        </mesh>

        {/* 4 zones interactives raycastées sur la travée vitrée centrale */}
        {([0, 1, 2, 3] as const).map((rowIdx) => {
          const yPos = 2.22 + [0.44, 0.12, -0.2, -0.52][rowIdx];
          return (
            <mesh
              key={rowIdx}
              position={[0, yPos, 0.04]}
              onPointerOver={(e) => handleRowPointerOver(e, rowIdx)}
              onPointerOut={handleRowPointerOut}
              onClick={(e) => handleRowClick(e, rowIdx)}
            >
              <planeGeometry args={[1.95, 0.28]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
