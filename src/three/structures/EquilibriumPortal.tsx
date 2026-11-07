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
 * Scène 01 — Portail Monumental à Oculus Franchissable & Façade Vitrée à Meneaux Acier :
 * - L'ouverture circulaire (r = 3.25m, centrée sur l'axe du canal d'eau) est véritablement
 *   ouverte sur toute la profondeur de la nef muséale et franchie physiquement par la caméra
 *   lors de la transition Scène 01 -> Scène 02 (zéro paroi opaque intermédiaire).
 * - La façade vitrée droite (« HeroInteractiveGlassStele ») est ancrée du sol au plafond
 *   par 4 meneaux en acier thermolaqué et synchronisée en temps réel avec l'UI.
 */
export function EquilibriumPortal({ materials }: EquilibriumPortalProps) {
  const highlightWashRef = useRef<THREE.Mesh>(null);
  const [hoveredRow, setHoveredRow] = useState<-1 | 0 | 1 | 2 | 3>(-1);

  // Mur porteur de 2.05m d'épaisseur percé d'une arche circulaire franchissable (r = 3.25m)
  const concreteOculusWallGeo = useMemo(() => {
    const wall = new THREE.Shape();
    wall.moveTo(-7.8, -0.5);
    wall.lineTo(8.8, -0.5);
    wall.lineTo(8.8, 8.6);
    wall.lineTo(-7.8, 8.6);
    wall.closePath();

    // Ouverture circulaire centrée sur l'axe du canal et de la trajectoire caméra (rayon 3.25m)
    const oculusHole = new THREE.Path();
    oculusHole.absarc(0.35, 2.85, 3.25, 0, Math.PI * 2, true);
    wall.holes.push(oculusHole);

    const geo = new THREE.ExtrudeGeometry(wall, {
      depth: 2.05,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.025,
      bevelSegments: 2,
      curveSegments: 84,
    });

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
          1. MUR DE FAÇADE MONUMENTAL EN BÉTON BANCHÉ PERCÉ DE L'OCULUS (z = -6.2m)
             Ouvert sur toute la perspective axiale vers les Scènes 02 -> 06.
         ===================================================================== */}
      <group position={[1.9, 0, -6.2]} rotation={[0, -0.14, 0]}>
        <mesh
          geometry={concreteOculusWallGeo}
          material={materials.boardConcrete}
          castShadow
          receiveShadow
        />

        {/* Éclairage architectural rasant dissimulé dans la feuillure arrière de l'oculus */}
        <mesh
          position={[0.35, 2.85, 0.08]}
          material={materials.softCoveLight}
        >
          <ringGeometry args={[3.24, 3.54, 84]} />
        </mesh>

        {/* Ombre de contact au pied des culées latérales du mur d'oculus */}
        <mesh
          position={[-4.6, 0.007, 2.28]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={materials.contactAO}
        >
          <planeGeometry args={[5.4, 0.75]} />
        </mesh>
        <mesh
          position={[5.8, 0.007, 2.28]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={materials.contactAO}
        >
          <planeGeometry args={[4.6, 0.75]} />
        </mesh>

        {/* Voile atmosphérique très subtil traversant le tambour circulaire */}
        <mesh
          position={[0.35, 2.75, 2.25]}
          rotation={[-0.2, 0.28, 0]}
          material={materials.atmosphericShaft}
        >
          <planeGeometry args={[5.2, 5.8]} />
        </mesh>
      </group>

      {/* =====================================================================
          2. PASSERELLES PIÉTONNES EN BASALTE BORDANT LE CANAL VERS L'OCULUS
         ===================================================================== */}
      <group position={[-0.75, 0, -2.4]}>
        <mesh position={[0, 0.09, 0]} material={materials.boardConcrete} castShadow receiveShadow>
          <boxGeometry args={[1.45, 0.18, 4.6]} />
        </mesh>
        <mesh
          position={[0.82, 0.006, 0]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          material={materials.contactAO}
        >
          <planeGeometry args={[4.8, 0.36]} />
        </mesh>
      </group>

      {/* =====================================================================
          3. BAIE VITRÉE ARCHITECTURALE DROITE À MENEAUX ACIER (ancrée sol-plafond)
             Sérigraphie interactive « AUDIT · FINANCE · DÉVELOPPEMENT · INNOVATION »
         ===================================================================== */}
      <group
        position={[4.15, 0, 1.55]}
        rotation={[0, -0.42, 0]}
        name="HeroInteractiveGlassStele"
      >
        <mesh position={[0, 0.045, 0]} material={materials.anodizedSteel} castShadow receiveShadow>
          <boxGeometry args={[3.28, 0.09, 0.18]} />
        </mesh>

        <mesh position={[0, 4.42, 0]} material={materials.anodizedSteel} castShadow>
          <boxGeometry args={[3.28, 0.1, 0.18]} />
        </mesh>

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

        {[1.05, 3.38].map((ty, idx) => (
          <mesh key={idx} position={[0, ty, 0]} material={materials.anodizedSteel}>
            <boxGeometry args={[3.22, 0.038, 0.12]} />
          </mesh>
        ))}

        <mesh position={[-1.07, 2.23, 0]} material={materials.structuralGlass}>
          <planeGeometry args={[1.02, 4.26]} />
        </mesh>
        <mesh position={[1.07, 2.23, 0]} material={materials.structuralGlass}>
          <planeGeometry args={[1.02, 4.26]} />
        </mesh>

        <mesh position={[0, 2.22, 0.01]} material={materials.etchedBayGlass}>
          <planeGeometry args={[1.04, 2.3]} />
        </mesh>

        <mesh
          position={[0, 0.005, 0.25]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={materials.contactAO}
        >
          <planeGeometry args={[3.4, 0.48]} />
        </mesh>

        <mesh ref={highlightWashRef} position={[0, 2.22, -0.02]} visible={false}>
          <planeGeometry args={[1.02, 0.28]} />
          <meshBasicMaterial color="#9AC2F0" transparent opacity={0.2} />
        </mesh>

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
