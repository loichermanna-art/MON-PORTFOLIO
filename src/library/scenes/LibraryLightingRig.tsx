import { Suspense, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { libraryMotionState, useLibraryStore } from '../state/useLibraryStore';

function HdriGlobalIllumination() {
  return (
    <Environment
      files="/hdri/lebombo_1k.hdr"
      environmentIntensity={0.54}
      background={false}
    />
  );
}

/**
 * Physically plausible architectural lighting rig:
 * 1. Immediate PMREM RoomEnvironment on frame 0 -> upgraded seamlessly to Poly Haven CC0 HDRI.
 * 2. Cool natural overhead clerestory daylight (#E8F1FC / #76A9E8 zenith tint) casting soft shadows.
 * 3. Warm 2900K architectural interior light pools awakening progressively as the portal opens.
 */
export function LibraryLightingRig() {
  const { gl, scene } = useThree();
  const deviceTier = useLibraryStore((s) => s.deviceTier);
  const naveWarmLightRef = useRef<THREE.PointLight>(null);
  const farNaveLightRef = useRef<THREE.PointLight>(null);
  const thresholdFillRef = useRef<THREE.PointLight>(null);

  // Instant frame-0 PBR environment before async 1K HDRI finishes loading
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);

    if (!scene.environment) {
      scene.environment = envRT.texture;
      scene.environmentIntensity = 0.48;
    }

    return () => {
      envRT.dispose();
      roomEnv.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  useFrame(() => {
    if (libraryMotionState.isTabHidden) return;
    const p = libraryMotionState.currentProgress;
    // Secondary motion: interior reading lights brighten gently as the doors swing open
    const revealBoost = THREE.MathUtils.smoothstep(p, 0.08, 0.78);

    if (thresholdFillRef.current) {
      thresholdFillRef.current.intensity = 6.5 + revealBoost * 8.5;
    }
    if (naveWarmLightRef.current) {
      naveWarmLightRef.current.intensity = 14.0 + revealBoost * 16.0;
    }
    if (farNaveLightRef.current) {
      farNaveLightRef.current.intensity = 18.0 + revealBoost * 14.0;
    }
  });

  const shadowMapSize = deviceTier === 'desktop' ? 2048 : 1024;

  return (
    <>
      <color attach="background" args={['#dce6f2']} />
      {/* Subtle atmospheric aerial perspective inside the 56-meter building */}
      <fogExp2 attach="fog" args={['#d8e2ee', 0.0095]} />

      <Suspense fallback={null}>
        <HdriGlobalIllumination />
      </Suspense>

      {/* Natural North-Sky / Clerestory Hemisphere Balance (Cool zenith sky vs warm limestone bounce) */}
      <hemisphereLight args={['#dceaf9', '#8e7d6b', 0.78]} />

      {/* Primary Natural Clerestory Daylight streaming from the coffered ceiling skylights */}
      <directionalLight
        position={[3.6, 12.5, 6.8]}
        intensity={2.15}
        color="#f2f7fd"
        castShadow={deviceTier !== 'mobile'}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-bias={-0.00025}
        shadow-normalBias={0.02}
        shadow-camera-near={1}
        shadow-camera-far={38}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
      />

      {/* Secondary high clerestory daylight shaft inside the Great Nave */}
      <directionalLight
        position={[-4.5, 15.0, -20.0]}
        intensity={1.55}
        color="#d6e7fb"
      />

      {/* Warm 2900K vestibule wall-sconce bounce */}
      <pointLight
        position={[-3.3, 2.6, 4.8]}
        intensity={5.2}
        distance={10}
        decay={2}
        color="#f5c589"
      />
      <pointLight
        position={[3.3, 2.6, 4.8]}
        intensity={5.2}
        distance={10}
        decay={2}
        color="#f5c589"
      />

      {/* Interior Archives & Great Nave warm architectural pools */}
      <pointLight
        ref={thresholdFillRef}
        position={[0, 3.9, -4.5]}
        intensity={6.5}
        distance={18}
        decay={1.8}
        color="#f4c68e"
      />
      <pointLight
        ref={naveWarmLightRef}
        position={[0, 5.2, -18.5]}
        intensity={14.0}
        distance={28}
        decay={1.7}
        color="#f3c184"
      />
      <pointLight
        ref={farNaveLightRef}
        position={[0, 6.8, -33.5]}
        intensity={18.0}
        distance={34}
        decay={1.6}
        color="#e8f0fb"
      />
    </>
  );
}
