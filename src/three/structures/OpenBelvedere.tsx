import { useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { PROFILE_IDENTITY } from '../../data/portfolioData';
import {
  motionStore,
  selectContactChannel,
  setActiveContactChannel,
} from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface OpenBelvedereProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * Scène 06 — Le Belvédère Ouvert sur l'Horizon & Ses Trois Pupitres de Seuil (z = -97m -> -122m)
 */
export function OpenBelvedere({ materials }: OpenBelvedereProps) {
  const beaconWashRefs = useRef<Array<THREE.Mesh | null>>([null, null, null]);

  const isHtmlUiEvent = (e: ThreeEvent<PointerEvent | MouseEvent>): boolean => {
    const target = e.nativeEvent?.target as HTMLElement | null;
    if (!target) return false;
    return Boolean(target.closest('a, button, nav, input, [role="dialog"]'));
  };

  useFrame((_, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    const active =
      motionStore.activeContactChannel !== -1
        ? motionStore.activeContactChannel
        : motionStore.selectedContactChannel;

    beaconWashRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const targetScale = idx === active ? 1.65 : 0.55;
      mesh.scale.y = THREE.MathUtils.damp(mesh.scale.y, targetScale, 7, dt);
    });
  });

  const beacons: Array<{ idx: 0 | 1 | 2; x: number; z: number }> = [
    { idx: 0, x: 1.45, z: -100.2 },
    { idx: 1, x: 2.75, z: -100.8 },
    { idx: 2, x: 4.05, z: -100.0 },
  ];

  return (
    <group name="CalmHorizonBelvedere">
      <mesh position={[-3.4, 2.6, -100.2]} material={materials.deepConcrete} castShadow>
        <boxGeometry args={[0.9, 5.2, 8.2]} />
      </mesh>
      <mesh position={[6.1, 2.6, -100.2]} material={materials.deepConcrete} castShadow>
        <boxGeometry args={[0.9, 5.2, 8.2]} />
      </mesh>

      <mesh position={[1.35, 5.05, -98.4]} material={materials.boardConcrete}>
        <boxGeometry args={[10.4, 0.42, 4.8]} />
      </mesh>

      <group position={[1.35, 0, -104.2]}>
        <mesh position={[0, 1.0, 0]} material={materials.anodizedSteel}>
          <boxGeometry args={[8.6, 0.045, 0.06]} />
        </mesh>
        {[-3.8, -1.9, 0, 1.9, 3.8].map((px, idx) => (
          <mesh key={idx} position={[px, 0.5, 0]} material={materials.anodizedSteel}>
            <boxGeometry args={[0.035, 1.0, 0.035]} />
          </mesh>
        ))}
      </group>

      {beacons.map(({ idx, x, z }) => (
        <group key={idx} position={[x, 0, z]} rotation={[0, -0.24, 0]}>
          <mesh position={[0, 0.42, 0]} material={materials.deepConcrete} castShadow receiveShadow>
            <boxGeometry args={[1.08, 0.84, 0.24]} />
          </mesh>
          <mesh position={[-0.52, 1.56, 0]} material={materials.anodizedSteel}>
            <boxGeometry args={[0.04, 1.48, 0.1]} />
          </mesh>
          <mesh position={[0.52, 1.56, 0]} material={materials.anodizedSteel}>
            <boxGeometry args={[0.04, 1.48, 0.1]} />
          </mesh>
          <mesh position={[0, 2.3, 0]} material={materials.anodizedSteel}>
            <boxGeometry args={[1.08, 0.045, 0.12]} />
          </mesh>

          <mesh
            position={[0, 1.56, 0.02]}
            material={materials.contactBeaconMaterials[idx]}
            onPointerOver={(e) => {
              if (isHtmlUiEvent(e)) return;
              e.stopPropagation();
              setActiveContactChannel(idx);
              if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setActiveContactChannel(-1);
              if (typeof document !== 'undefined') document.body.style.cursor = '';
            }}
            onClick={(e) => {
              if (isHtmlUiEvent(e)) return;
              e.stopPropagation();
              selectContactChannel(idx);
              if (idx === 2 && typeof window !== 'undefined') {
                window.open(PROFILE_IDENTITY.contacts.githubUrl, '_blank', 'noopener,noreferrer');
              }
            }}
          >
            <planeGeometry args={[1.0, 1.42]} />
          </mesh>

          <mesh
            ref={(el) => {
              beaconWashRefs.current[idx] = el;
            }}
            position={[0, 2.26, 0.03]}
            rotation={[Math.PI, 0, 0]}
            material={materials.softCoveLight}
          >
            <planeGeometry args={[0.98, 0.5]} />
          </mesh>

          <mesh
            position={[0, 0.005, 0.22]}
            rotation={[-Math.PI / 2, 0, 0]}
            material={materials.contactAO}
          >
            <planeGeometry args={[1.25, 0.42]} />
          </mesh>
        </group>
      ))}

      <mesh
        position={[1.8, -0.02, -113.0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={materials.honedBasaltFloor}
      >
        <planeGeometry args={[76, 18]} />
      </mesh>

      <mesh position={[1.8, 6.2, -121.5]}>
        <planeGeometry args={[96, 36]} />
        <primitive object={materials.blueHourSky} attach="material" />
      </mesh>
    </group>
  );
}
