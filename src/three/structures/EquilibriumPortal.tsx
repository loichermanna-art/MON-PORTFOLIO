import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface EquilibriumPortalProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * SCÈNE 01 — Passerelle Courbe en Porte-à-Faux & Sphère Spéculaire d'Équilibre (Panel 01)
 * Placée sur l'axe droit (x = +2.35, z = +1.8) afin de laisser tout le ciel brumeux gauche
 * totalement pur pour la typographie monumentale « Loïc AKANDA ».
 */
export function EquilibriumPortal({ materials }: EquilibriumPortalProps) {
  const sphereGroupIdleRef = useRef<THREE.Group>(null);
  const skyRingScrollRef = useRef<THREE.Group>(null);
  const smoothedOpen = useRef(0);

  useFrame(({ clock }, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);

    const openFactor = THREE.MathUtils.smoothstep(motionStore.scrollProgress, 0.02, 0.16);
    smoothedOpen.current = THREE.MathUtils.damp(smoothedOpen.current, openFactor, 5.0, dt);

    if (skyRingScrollRef.current) {
      skyRingScrollRef.current.rotation.y = -0.35 + smoothedOpen.current * 0.45;
      skyRingScrollRef.current.position.y = 4.65 + smoothedOpen.current * 0.55;
    }

    if (sphereGroupIdleRef.current) {
      if (motionStore.reducedMotion) {
        sphereGroupIdleRef.current.position.y = 3.05;
        sphereGroupIdleRef.current.rotation.y = 0;
      } else {
        const t = clock.getElapsedTime();
        sphereGroupIdleRef.current.position.y = 3.05 + Math.sin(t * 0.65) * 0.12;
        sphereGroupIdleRef.current.rotation.y = t * 0.18;
      }
    }
  });

  return (
    <group position={[2.45, 0, 1.8]} name="EquilibriumPortal">
      {/* Grand pilier monolithique droit en marbre blanc (Panel 01) */}
      <mesh
        position={[2.55, 4.2, -1.2]}
        castShadow
        receiveShadow
        material={materials.whiteMarble}
      >
        <boxGeometry args={[1.55, 8.4, 1.55]} />
      </mesh>
      <mesh
        position={[-1.45, 3.6, -2.6]}
        castShadow
        receiveShadow
        material={materials.whiteMarble}
      >
        <boxGeometry args={[1.25, 7.2, 1.25]} />
      </mesh>

      {/* Passerelle aérienne courbe monumentale surplombant la terrasse (Panel 01) */}
      <group ref={skyRingScrollRef} position={[0.3, 4.65, -0.4]} rotation={[Math.PI / 2, 0, -0.35]}>
        <mesh castShadow receiveShadow material={materials.whiteMarble}>
          <torusGeometry args={[3.45, 0.42, 18, 64, Math.PI * 1.35]} />
        </mesh>
      </group>

      {/* Sphère spéculaire d'équilibre en lévitation (Panel 01) */}
      <group ref={sphereGroupIdleRef} position={[0.45, 3.05, 0.5]}>
        <mesh castShadow material={materials.specularChrome}>
          <sphereGeometry args={[1.08, 48, 48]} />
        </mesh>
        {/* Fin anneau orbital incliné en verre/chrome */}
        <mesh rotation={[1.18, 0.25, 0]} material={materials.crystalGlass}>
          <torusGeometry args={[1.52, 0.025, 12, 64]} />
        </mesh>
      </group>

      {/* Socle sculpté bas sur le miroir d'eau */}
      <mesh
        position={[0.45, 0.18, 0.5]}
        receiveShadow
        castShadow
        material={materials.whiteMarble}
      >
        <boxGeometry args={[3.6, 0.36, 2.4]} />
      </mesh>
    </group>
  );
}
