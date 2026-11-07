import { useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { MOTION_DAMPING } from '../../motion/motionConfig';
import {
  motionStore,
  selectAboutPillar,
  setHoveredAboutPillar,
} from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface ClairvoieGalleryProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * Scène 02 — Galerie à Claire-Voie & Trois Stèles Vitrées « À PROPOS » (z = -18.5m -> -28.5m)
 * Cadrée plein champ droit lorsque la caméra est en Scène 02 (z_cam ≈ -12.0m).
 */
export function ClairvoieGallery({ materials }: ClairvoieGalleryProps) {
  const louverRefs = useRef<Array<THREE.Mesh | null>>([]);
  const washRefs = useRef<Array<THREE.Mesh | null>>([null, null, null]);
  const smoothAct = useRef(0);

  const isHtmlUiEvent = (e: ThreeEvent<PointerEvent | MouseEvent>): boolean => {
    const target = e.nativeEvent?.target as HTMLElement | null;
    if (!target) return false;
    return Boolean(target.closest('a, button, nav, input, [role="dialog"]'));
  };

  useFrame((_, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    const local = THREE.MathUtils.clamp((motionStore.scrollProgress - 0.14) / 0.18, 0, 1);
    smoothAct.current = THREE.MathUtils.damp(
      smoothAct.current,
      motionStore.reducedMotion ? 0.45 : local,
      MOTION_DAMPING.structureActuation,
      dt
    );

    const activePillar =
      motionStore.hoveredAboutPillar !== -1
        ? motionStore.hoveredAboutPillar
        : motionStore.selectedAboutPillar;

    louverRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const nearActive = idx === activePillar * 2 || idx === activePillar * 2 + 1;
      const targetRot = nearActive
        ? -0.68 - smoothAct.current * 0.12
        : -0.26 - smoothAct.current * 0.18;
      mesh.rotation.y = THREE.MathUtils.damp(mesh.rotation.y, targetRot, 6, dt);
    });

    washRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const targetScale = idx === activePillar ? 1.55 : 0.45;
      mesh.scale.y = THREE.MathUtils.damp(mesh.scale.y, targetScale, 7, dt);
    });
  });

  const aboutBays: Array<{ idx: 0 | 1 | 2; x: number; z: number }> = [
    { idx: 0, x: 2.35, z: -20.2 },
    { idx: 1, x: 2.95, z: -22.8 },
    { idx: 2, x: 3.55, z: -25.4 },
  ];

  return (
    <group name="TectonicClairvoieGallery">
      <mesh position={[4.35, 4.75, -23.0]} material={materials.deepConcrete} castShadow>
        <boxGeometry args={[0.9, 0.55, 13.8]} />
      </mesh>

      <mesh position={[4.35, 0.08, -23.0]} material={materials.anodizedSteel} receiveShadow>
        <boxGeometry args={[0.95, 0.16, 13.6]} />
      </mesh>
      <mesh
        position={[3.75, 0.006, -23.0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        material={materials.contactAO}
      >
        <planeGeometry args={[13.8, 0.85]} />
      </mesh>

      {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
        const z = -17.6 - idx * 1.8;
        return (
          <mesh
            key={idx}
            ref={(el) => {
              louverRefs.current[idx] = el;
            }}
            position={[4.35, 2.38, z]}
            rotation={[0, -0.35, 0]}
            material={materials.boardConcrete}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.78, 4.44, 0.18]} />
          </mesh>
        );
      })}

      {aboutBays.map(({ idx, x, z }) => (
        <group key={idx} position={[x, 0, z]} rotation={[0, -0.32, 0]}>
          <mesh position={[0, 0.36, 0]} material={materials.deepConcrete} castShadow receiveShadow>
            <boxGeometry args={[1.22, 0.72, 0.26]} />
          </mesh>
          <mesh position={[-0.59, 1.92, 0]} material={materials.anodizedSteel} castShadow>
            <boxGeometry args={[0.045, 2.48, 0.12]} />
          </mesh>
          <mesh position={[0.59, 1.92, 0]} material={materials.anodizedSteel} castShadow>
            <boxGeometry args={[0.045, 2.48, 0.12]} />
          </mesh>
          <mesh position={[0, 3.16, 0]} material={materials.anodizedSteel}>
            <boxGeometry args={[1.22, 0.05, 0.14]} />
          </mesh>

          <mesh
            position={[0, 1.96, 0.02]}
            material={materials.aboutPillarMaterials[idx]}
            onPointerOver={(e) => {
              if (isHtmlUiEvent(e)) return;
              e.stopPropagation();
              setHoveredAboutPillar(idx);
              if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHoveredAboutPillar(-1);
              if (typeof document !== 'undefined') document.body.style.cursor = '';
            }}
            onClick={(e) => {
              if (isHtmlUiEvent(e)) return;
              e.stopPropagation();
              selectAboutPillar(idx);
            }}
          >
            <planeGeometry args={[1.12, 2.32]} />
          </mesh>

          <mesh
            ref={(el) => {
              washRefs.current[idx] = el;
            }}
            position={[0, 3.1, 0.035]}
            rotation={[Math.PI, 0, 0]}
            material={materials.softCoveLight}
          >
            <planeGeometry args={[1.1, 0.65]} />
          </mesh>

          <mesh
            position={[0, 0.005, 0.24]}
            rotation={[-Math.PI / 2, 0, 0]}
            material={materials.contactAO}
          >
            <planeGeometry args={[1.4, 0.45]} />
          </mesh>
        </group>
      ))}

      {[-18.8, -23.0, -27.2].map((zBeam, idx) => (
        <mesh
          key={idx}
          position={[0.2, 4.82, zBeam]}
          material={materials.boardConcrete}
          castShadow
        >
          <boxGeometry args={[11.2, 0.58, 0.46]} />
        </mesh>
      ))}
    </group>
  );
}
