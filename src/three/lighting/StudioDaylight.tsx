import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';

interface StudioDaylightProps {
  isMobile: boolean;
}

/**
 * Éclairage Architectural Réaliste Continu à « l'Heure Bleue » (Scènes 01 -> 06) :
 * - Brume exponentielle calibrée (0.0085) permettant de percevoir depuis l'oculus du Hero
 *   toute la perspective axiale du canal d'eau jusqu'à l'horizon ouvert du Belvédère.
 * - Lumière directionnelle suiveuse projetant des ombres portées douces (2048x2048)
 *   nettes dans chacune des 6 séquences architecturales, sans zone morte après z = -50m.
 */
export function StudioDaylight({ isMobile }: StudioDaylightProps) {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const keyTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());

  useFrame(() => {
    if (motionStore.isTabHidden || !keyLightRef.current) return;
    // Suit en douceur l'avancée axiale du visiteur (z = -4m -> -102m) pour garantir des ombres nettes partout
    const zFocus = THREE.MathUtils.lerp(-4, -102, motionStore.scrollProgress);
    keyLightRef.current.position.set(7.5, 11.0, zFocus - 8.0);
    keyTargetRef.current.position.set(1.8, 0.8, zFocus);
    keyTargetRef.current.updateMatrixWorld();
  });

  return (
    <>
      <color attach="background" args={['#06101E']} />
      <fogExp2 attach="fog" args={['#071426', 0.0085]} />

      <primitive object={keyTargetRef.current} />

      {/* Diffusion zénithale douce d'heure bleue */}
      <hemisphereLight
        color="#739FD2"
        groundColor="#050B14"
        intensity={0.66}
        position={[0, 24, -40]}
      />

      {/* Lumière directionnelle naturelle principale à ombres douces */}
      <directionalLight
        ref={keyLightRef}
        target={keyTargetRef.current}
        position={[7.5, 11.0, -12.0]}
        intensity={2.45}
        color="#E4EFFC"
        castShadow={!isMobile}
        shadow-mapSize={isMobile ? [512, 512] : [2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={54}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={11}
        shadow-camera-bottom={-4}
        shadow-bias={-0.00025}
        shadow-normalBias={0.02}
      />

      {/* Lumière rasante latérale révélant le micro-relief NormalMap du béton coffré */}
      <directionalLight
        position={[-8.0, 6.2, 8.0]}
        intensity={0.5}
        color="#4E78AA"
      />

      {/* Jalons lumineux muséaux continus à décroissance physique (decay=2) le long des 6 travées */}
      <pointLight position={[2.4, 4.4, -2.8]} intensity={9.5} distance={22} decay={2} color="#DCEBFA" />
      <pointLight position={[3.6, 3.2, 1.8]} intensity={3.4} distance={10} decay={2} color="#E8F1FC" />
      <pointLight position={[2.4, 4.5, -22.5]} intensity={10.0} distance={26} decay={2} color="#D8E9FB" />
      <pointLight position={[2.6, 4.5, -39.2]} intensity={11.0} distance={26} decay={2} color="#DCEBFA" />
      <pointLight position={[2.6, 4.5, -61.5]} intensity={11.5} distance={28} decay={2} color="#E0EEFC" />
      <pointLight position={[2.2, 4.5, -83.5]} intensity={10.5} distance={28} decay={2} color="#DCEBFA" />
      <pointLight position={[2.2, 5.6, -101.5]} intensity={18.5} distance={40} decay={2} color="#EAF3FE" />

      {/* Carte d'environnement PBR sobre et réaliste */}
      <Environment resolution={isMobile ? 128 : 256} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.45}
          color="#D2E5FA"
          position={[4, 3.2, -14]}
          scale={[24, 7.5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.88}
          color="#2D578A"
          position={[0, 12, -8]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[34, 34, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.48}
          color="#17355B"
          position={[-12, 4, 0]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[30, 10, 1]}
        />
      </Environment>
    </>
  );
}
