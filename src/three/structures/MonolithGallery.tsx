import { useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { SELECTED_PROJECTS, type ProjectCaseStudy } from '../../data/portfolioData';
import { motionStore, setFocusedProjectIndex } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface MonolithGalleryProps {
  materials: ArchitecturalMaterialSet;
  onSelectProject?: (project: ProjectCaseStudy) => void;
}

/**
 * Scène 04 — Galerie Muséale Interactive des Projets (z = -58.5m -> -64.5m)
 * Cadrée plein champ droit (X = 54%..84%) lorsque la caméra est en Scène 04 (z_cam ≈ -49.0m).
 */
export function MonolithGallery({ materials, onSelectProject }: MonolithGalleryProps) {
  const washRefs = useRef<Array<THREE.Mesh | null>>([null, null, null]);

  const isHtmlUiEvent = (e: ThreeEvent<PointerEvent | MouseEvent>): boolean => {
    const target = e.nativeEvent?.target as HTMLElement | null;
    if (!target) return false;
    return Boolean(target.closest('a, button, nav, input, [role="dialog"]'));
  };

  useFrame((_, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    washRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const isFocused = motionStore.focusedProjectIndex === idx;
      const targetScale = isFocused ? 1.65 : 0.72;
      mesh.scale.y = THREE.MathUtils.damp(mesh.scale.y, targetScale, 6, dt);
    });
  });

  const bays: Array<{ idx: 0 | 1 | 2; x: number; z: number }> = [
    { idx: 0, x: 1.55, z: -59.0 },
    { idx: 1, x: 2.75, z: -61.8 },
    { idx: 2, x: 3.95, z: -64.6 },
  ];

  return (
    <group name="GroundedMuseumGallery">
      {bays.map(({ idx, x, z }) => (
        <group key={idx} position={[x, 0, z]} rotation={[0, -0.32, 0]}>
          <mesh position={[0, 0.68, -0.08]} material={materials.deepConcrete} castShadow receiveShadow>
            <boxGeometry args={[2.12, 1.36, 0.42]} />
          </mesh>

          <mesh position={[0, 2.08, -0.05]} material={materials.anodizedSteel} castShadow>
            <boxGeometry args={[2.22, 1.54, 0.12]} />
          </mesh>

          <mesh
            position={[0, 2.08, 0.02]}
            material={materials.projectPlateMaterials[idx]}
            onPointerOver={(e) => {
              if (isHtmlUiEvent(e)) return;
              e.stopPropagation();
              setFocusedProjectIndex(idx);
              if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setFocusedProjectIndex(-1);
              if (typeof document !== 'undefined') document.body.style.cursor = '';
            }}
            onClick={(e) => {
              if (isHtmlUiEvent(e)) return;
              e.stopPropagation();
              const proj = SELECTED_PROJECTS[idx];
              if (proj && onSelectProject) {
                onSelectProject(proj);
              }
            }}
          >
            <planeGeometry args={[2.1, 1.42]} />
          </mesh>

          <mesh
            ref={(el) => {
              washRefs.current[idx] = el;
            }}
            position={[0, 2.82, 0.028]}
            rotation={[Math.PI, 0, 0]}
            material={materials.softCoveLight}
          >
            <planeGeometry args={[2.08, 0.58]} />
          </mesh>

          <mesh
            position={[0, 0.005, 0.28]}
            rotation={[-Math.PI / 2, 0, 0]}
            material={materials.contactAO}
          >
            <planeGeometry args={[2.45, 0.58]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
