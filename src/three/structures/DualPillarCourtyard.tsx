import { useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import {
  motionStore,
  selectExpertiseDomain,
  setFocusedExpertisePole,
} from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface DualPillarCourtyardProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * Scène 03 — La Cour des Quatre Piliers Muséaux Interactifs (z = -38.4m -> -41.6m)
 * Cadrée plein champ droit (X = 56%..82%) lorsque la caméra est en Scène 03 (z_cam ≈ -27.8m).
 */
export function DualPillarCourtyard({ materials }: DualPillarCourtyardProps) {
  const coveRefs = useRef<Array<THREE.Mesh | null>>([null, null, null, null]);

  const isHtmlUiEvent = (e: ThreeEvent<PointerEvent | MouseEvent>): boolean => {
    const target = e.nativeEvent?.target as HTMLElement | null;
    if (!target) return false;
    return Boolean(target.closest('a, button, nav, input, [role="dialog"]'));
  };

  useFrame((_, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    const activeIdx =
      motionStore.focusedExpertisePole >= 0
        ? motionStore.focusedExpertisePole
        : motionStore.selectedExpertiseIndex;

    coveRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const targetScaleY = idx === activeIdx ? 1.55 : 0.45;
      mesh.scale.y = THREE.MathUtils.damp(mesh.scale.y, targetScaleY, 6, dt);
    });
  });

  const pillars: Array<{ idx: 0 | 1 | 2 | 3; x: number; z: number }> = [
    { idx: 0, x: 1.45, z: -38.8 },
    { idx: 1, x: 2.35, z: -40.2 },
    { idx: 2, x: 3.25, z: -39.6 },
    { idx: 3, x: 4.15, z: -38.4 },
  ];

  return (
    <group name="FourGroundedExpertisePiers">
      <mesh position={[2.8, 4.65, -39.3]} rotation={[0, -0.16, 0]} material={materials.deepConcrete}>
        <boxGeometry args={[4.8, 0.48, 2.8]} />
      </mesh>

      {pillars.map(({ idx, x, z }) => (
        <group key={idx} position={[x, 0, z]} rotation={[0, -0.24, 0]}>
          <mesh position={[0, 0.04, 0]} material={materials.anodizedSteel}>
            <boxGeometry args={[0.84, 0.08, 0.84]} />
          </mesh>

          <mesh position={[0, 2.24, 0]} material={materials.boardConcrete} castShadow receiveShadow>
            <boxGeometry args={[0.88, 4.32, 0.86]} />
          </mesh>

          <mesh
            position={[0, 2.15, 0.445]}
            material={materials.expertisePlaqueMaterials[idx]}
            onPointerOver={(e) => {
              if (isHtmlUiEvent(e)) return;
              e.stopPropagation();
              setFocusedExpertisePole(idx);
              if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setFocusedExpertisePole(-1);
              if (typeof document !== 'undefined') document.body.style.cursor = '';
            }}
            onClick={(e) => {
              if (isHtmlUiEvent(e)) return;
              e.stopPropagation();
              selectExpertiseDomain(idx);
              setFocusedExpertisePole(idx);
            }}
          >
            <planeGeometry args={[0.78, 2.3]} />
          </mesh>

          <mesh
            ref={(el) => {
              coveRefs.current[idx] = el;
            }}
            position={[0, 4.15, 0.45]}
            rotation={[Math.PI, 0, 0]}
            material={materials.softCoveLight}
          >
            <planeGeometry args={[0.78, 1.15]} />
          </mesh>

          <mesh
            position={[0, 0.005, 0.58]}
            rotation={[-Math.PI / 2, 0, 0]}
            material={materials.contactAO}
          >
            <planeGeometry args={[1.15, 0.5]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
