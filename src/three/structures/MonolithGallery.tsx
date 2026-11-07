import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface MonolithGalleryProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * SCÈNE 04 — Pilastres Chrome/Marbre & 3 Écrans Spatiaux Flottants (Panel 04)
 * Met en scène les 3 écrans flottants inclinés en perspective (LAURA HOUSE, SassySkin, EtuCo)
 * devant des colonnes verticales en chrome brossé et marbre clair.
 */
export function MonolithGallery({ materials }: MonolithGalleryProps) {
  const screenRefs = useRef<Array<THREE.Group | null>>([]);
  const hoverLift = useRef([0, 0, 0]);

  const screens = useMemo(
    () => [
      { idx: 0 as const, x: 0.95, y: 2.35, z: -46.8, rotY: -0.34, scale: 1.06 },
      { idx: 1 as const, x: 2.85, y: 2.15, z: -48.6, rotY: -0.38, scale: 0.94 },
      { idx: 2 as const, x: 4.55, y: 2.02, z: -50.4, rotY: -0.42, scale: 0.88 },
    ],
    []
  );

  const pilastersZ = useMemo(() => [-42.0, -47.5, -53.0, -58.5], []);

  useFrame(({ clock }, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();

    for (let i = 0; i < screens.length; i++) {
      const target = motionStore.focusedProjectIndex === i ? 1 : 0;
      hoverLift.current[i] = THREE.MathUtils.damp(hoverLift.current[i], target, 5.5, dt);

      const group = screenRefs.current[i];
      if (group) {
        const s = screens[i];
        const idleFloat = motionStore.reducedMotion
          ? 0
          : Math.sin(t * 0.7 + i * 1.1) * 0.05;
        group.position.y = s.y + idleFloat + hoverLift.current[i] * 0.18;
        group.position.z = s.z + hoverLift.current[i] * 0.45;
      }
    }
  });

  return (
    <group name="MonolithGallery">
      {/* Pilastres verticaux en chrome spéculaire & marbre (Panel 04) */}
      {pilastersZ.map((z, idx) => (
        <group key={`pilaster-${idx}`}>
          <mesh position={[-4.6, 4.0, z]} castShadow material={materials.specularChrome}>
            <boxGeometry args={[0.42, 8.0, 0.42]} />
          </mesh>
          <mesh position={[5.4, 4.0, z]} castShadow material={materials.whiteMarble}>
            <boxGeometry args={[0.78, 8.0, 0.78]} />
          </mesh>
          <mesh position={[0.4, 4.0, z - 2.2]} material={materials.specularChrome}>
            <boxGeometry args={[0.26, 8.0, 0.26]} />
          </mesh>
        </group>
      ))}

      {/* Les 3 panneaux flottants en perspective dans l'espace 3D */}
      {screens.map((scr) => (
        <group
          key={`floating-screen-${scr.idx}`}
          ref={(el) => {
            screenRefs.current[scr.idx] = el;
          }}
          position={[scr.x, scr.y, scr.z]}
          rotation={[0, scr.rotY, 0]}
          scale={scr.scale}
        >
          {/* Châssis fin en titane/chrome */}
          <mesh castShadow material={materials.specularChrome}>
            <boxGeometry args={[2.32, 1.88, 0.06]} />
          </mesh>
          {/* Dalle écran haute résolution */}
          <mesh position={[0, 0, 0.036]} material={materials.projectPlateMaterials[scr.idx]}>
            <planeGeometry args={[2.22, 1.78]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
