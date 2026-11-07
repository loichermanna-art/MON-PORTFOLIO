import { useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore, setActiveProcessStep } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface SequentialBridgeProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * Scène 05 — Les Six Portiques Séquentiels Interactifs en Béton Banché (z = -79m -> -89.5m)
 * Cadrés en perspective axiale dégagée (X = 62%..76%) lorsque la caméra est en Scène 05 (z_cam ≈ -69.5m).
 */
export function SequentialBridge({ materials }: SequentialBridgeProps) {
  const soffitGlowRefs = useRef<Array<THREE.Mesh | null>>([]);

  const isHtmlUiEvent = (e: ThreeEvent<PointerEvent | MouseEvent>): boolean => {
    const target = e.nativeEvent?.target as HTMLElement | null;
    if (!target) return false;
    return Boolean(target.closest('a, button, nav, input, [role="dialog"]'));
  };

  useFrame((_, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    soffitGlowRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const isActive = idx === motionStore.activeProcessStep;
      const targetScale = isActive ? 1.75 : 0.42;
      mesh.scale.y = THREE.MathUtils.damp(mesh.scale.y, targetScale, 7, dt);
    });
  });

  return (
    <group name="SixSequentialConcretePortals">
      {([0, 1, 2, 3, 4, 5] as const).map((idx) => {
        const z = -79.0 - idx * 2.05;
        const xCenter = 2.25;
        return (
          <group key={idx} position={[xCenter, 0, z]} rotation={[0, -0.14, 0]}>
            <mesh position={[-2.55, 2.25, 0]} material={materials.boardConcrete} castShadow receiveShadow>
              <boxGeometry args={[0.48, 4.5, 0.56]} />
            </mesh>
            <mesh position={[2.55, 2.25, 0]} material={materials.boardConcrete} castShadow receiveShadow>
              <boxGeometry args={[0.48, 4.5, 0.56]} />
            </mesh>

            <mesh position={[0, 4.35, 0]} material={materials.deepConcrete} castShadow>
              <boxGeometry args={[5.58, 0.48, 0.58]} />
            </mesh>

            <mesh
              position={[0, 4.35, 0.305]}
              material={materials.processPortalMaterials[idx]}
              onPointerOver={(e) => {
                if (isHtmlUiEvent(e)) return;
                e.stopPropagation();
                setActiveProcessStep(idx);
                if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                if (typeof document !== 'undefined') document.body.style.cursor = '';
              }}
              onClick={(e) => {
                if (isHtmlUiEvent(e)) return;
                e.stopPropagation();
                setActiveProcessStep(idx);
              }}
            >
              <planeGeometry args={[2.55, 0.42]} />
            </mesh>

            <mesh
              ref={(el) => {
                soffitGlowRefs.current[idx] = el;
              }}
              position={[0, 4.1, 0.29]}
              rotation={[Math.PI, 0, 0]}
              material={materials.softCoveLight}
            >
              <planeGeometry args={[4.5, 0.68]} />
            </mesh>

            <mesh
              position={[-2.55, 0.005, 0.42]}
              rotation={[-Math.PI / 2, 0, 0]}
              material={materials.contactAO}
            >
              <planeGeometry args={[0.95, 0.45]} />
            </mesh>
            <mesh
              position={[2.55, 0.005, 0.42]}
              rotation={[-Math.PI / 2, 0, 0]}
              material={materials.contactAO}
            >
              <planeGeometry args={[0.95, 0.45]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
