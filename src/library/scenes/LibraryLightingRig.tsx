import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createMetropolisSkyMaterial } from '../resources/metropolisCompiler';
import { libraryMotionState, useLibraryStore } from '../state/useLibraryStore';

function HdriGlobalIllumination({ intensity }: { intensity: number }) {
  return (
    <Environment
      files="/hdri/lebombo_1k.hdr"
      environmentIntensity={intensity}
      background={false}
    />
  );
}

/**
 * 360° Financial Metropolis Lighting, 3-Mood Sky Vault & Texel-Snapped Shadow System
 */
export function LibraryLightingRig() {
  const { gl, scene } = useThree();
  const deviceTier = useLibraryStore((s) => s.deviceTier);
  const atmosphereMood = useLibraryStore((s) => s.atmosphereMood);

  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const keyTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const motesRef = useRef<THREE.Points>(null);

  const skyMaterial = useMemo(() => createMetropolisSkyMaterial(), []);

  // Subtle floating dust motes inside the illuminated halls (1 draw call)
  const { motesGeo, motesMat } = useMemo(() => {
    const count = deviceTier === 'mobile' ? 160 : 380;
    const positions = new Float32Array(count * 3);
    let seed = 90210;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 12.0;
      positions[i * 3 + 1] = 0.8 + rand() * 7.6;
      positions[i * 3 + 2] = 12.0 - rand() * 120.0;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: new THREE.Color('#ffe9c4'),
      size: 0.04,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { motesGeo: geo, motesMat: mat };
  }, [deviceTier]);

  useEffect(() => {
    const targetObj = keyTargetRef.current;
    scene.add(targetObj);
    if (keyLightRef.current) {
      keyLightRef.current.target = targetObj;
    }

    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);

    if (!scene.environment) {
      scene.environment = envRT.texture;
      scene.environmentIntensity = 0.52;
    }

    return () => {
      scene.remove(targetObj);
      envRT.dispose();
      roomEnv.dispose();
      pmrem.dispose();
      skyMaterial.dispose();
      motesGeo.dispose();
      motesMat.dispose();
    };
  }, [gl, scene, skyMaterial, motesGeo, motesMat]);

  // Synchronize Sky Shader Uniforms & Environment Intensity across Twilight / Night / Day
  useEffect(() => {
    if (atmosphereMood === 'twilight') {
      skyMaterial.uniforms.uZenithColor.value.set('#081a36');
      skyMaterial.uniforms.uHorizonColor.value.set('#2f598a');
      skyMaterial.uniforms.uSunsetGlowColor.value.set('#f09d59');
      skyMaterial.uniforms.uStarIntensity.value = 0.36;
      skyMaterial.uniforms.uSunDir.value.set(0.42, 0.14, -0.89).normalize();
      scene.environmentIntensity = 0.52;
    } else if (atmosphereMood === 'night') {
      skyMaterial.uniforms.uZenithColor.value.set('#030914');
      skyMaterial.uniforms.uHorizonColor.value.set('#102747');
      skyMaterial.uniforms.uSunsetGlowColor.value.set('#28548a');
      skyMaterial.uniforms.uStarIntensity.value = 0.92;
      skyMaterial.uniforms.uSunDir.value.set(0.32, 0.38, -0.86).normalize();
      scene.environmentIntensity = 0.36;
    } else {
      skyMaterial.uniforms.uZenithColor.value.set('#2d67a8');
      skyMaterial.uniforms.uHorizonColor.value.set('#c4dbf2');
      skyMaterial.uniforms.uSunsetGlowColor.value.set('#fff3dc');
      skyMaterial.uniforms.uStarIntensity.value = 0.0;
      skyMaterial.uniforms.uSunDir.value.set(0.42, 0.58, -0.70).normalize();
      scene.environmentIntensity = 0.68;
    }
  }, [atmosphereMood, skyMaterial, scene]);

  const shadowMapSize = deviceTier === 'desktop' ? 2048 : 1024;
  const shadowFrustumHalf = 16;
  const texelWorldSize = (shadowFrustumHalf * 2) / shadowMapSize;

  useFrame(({ clock }) => {
    if (libraryMotionState.isTabHidden) return;

    if (keyLightRef.current && deviceTier !== 'mobile') {
      const snappedZ =
        Math.round((libraryMotionState.camZ - 6.0) / texelWorldSize) *
        texelWorldSize;
      keyTargetRef.current.position.set(0, 0, snappedZ);
      keyTargetRef.current.updateMatrixWorld();
      keyLightRef.current.position.set(5.6, 17.5, snappedZ + 7.2);
    }

    if (motesRef.current && !useLibraryStore.getState().reducedMotion) {
      const t = clock.getElapsedTime();
      motesRef.current.position.y = Math.sin(t * 0.35) * 0.16;
      motesRef.current.position.x = Math.cos(t * 0.24) * 0.12;
    }
  });

  const fogColor =
    atmosphereMood === 'night'
      ? '#071426'
      : atmosphereMood === 'twilight'
        ? '#1d385e'
        : '#bfd4eb';

  const keyIntensity =
    atmosphereMood === 'night'
      ? 1.05
      : atmosphereMood === 'twilight'
        ? 1.95
        : 2.55;

  const keyColor =
    atmosphereMood === 'night'
      ? '#9ec6f5'
      : atmosphereMood === 'twilight'
        ? '#ffdcb4'
        : '#fff8ec';

  const interiorBoost =
    atmosphereMood === 'night' ? 1.35 : atmosphereMood === 'twilight' ? 1.12 : 0.85;

  const hdriIntensity =
    atmosphereMood === 'night' ? 0.34 : atmosphereMood === 'twilight' ? 0.52 : 0.68;

  return (
    <>
      {/* 360° Metropolis Atmospheric Sky Vault */}
      <mesh material={skyMaterial} scale={[430, 430, 430]} frustumCulled={false}>
        <sphereGeometry args={[1, 36, 24]} />
      </mesh>

      {/* Long-Range Urban Aerial Perspective Fog */}
      <fogExp2 attach="fog" args={[fogColor, 0.00165]} />

      <Suspense fallback={null}>
        <HdriGlobalIllumination intensity={hdriIntensity} />
      </Suspense>

      <hemisphereLight
        args={[
          atmosphereMood === 'night' ? '#3d6ea8' : '#cbe0fa',
          atmosphereMood === 'night' ? '#1c1815' : '#8a7660',
          atmosphereMood === 'night' ? 0.58 : 0.88,
        ]}
      />

      {/* Primary Texel-Stabilized Key Light */}
      <directionalLight
        ref={keyLightRef}
        position={[5.6, 17.5, 11.0]}
        intensity={keyIntensity}
        color={keyColor}
        castShadow={deviceTier !== 'mobile'}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-bias={-0.00022}
        shadow-normalBias={0.018}
        shadow-camera-near={1}
        shadow-camera-far={44}
        shadow-camera-left={-shadowFrustumHalf}
        shadow-camera-right={shadowFrustumHalf}
        shadow-camera-top={shadowFrustumHalf}
        shadow-camera-bottom={-shadowFrustumHalf}
      />

      {/* Counter-fill cool skyline bounce */}
      <directionalLight
        position={[-7.5, 14.0, -45.0]}
        intensity={atmosphereMood === 'night' ? 0.65 : 1.05}
        color="#76A9E8"
      />

      {/* Warm Executive Gallery & Brazier Pools along the 120m Headquarters Spine */}
      <pointLight
        position={[0, 4.2, 10.5]}
        intensity={13 * interiorBoost}
        distance={24}
        decay={1.8}
        color="#ffcb88"
      />
      <pointLight
        position={[0, 4.6, -4.5]}
        intensity={15 * interiorBoost}
        distance={24}
        decay={1.7}
        color="#f5c68a"
      />
      <pointLight
        position={[0, 4.6, -16.5]}
        intensity={15 * interiorBoost}
        distance={24}
        decay={1.7}
        color="#f5c68a"
      />
      <pointLight
        position={[0, 8.2, -37.5]}
        intensity={30 * interiorBoost}
        distance={38}
        decay={1.55}
        color="#ffdfa8"
      />
      <pointLight
        position={[0, 6.2, -64.5]}
        intensity={28 * interiorBoost}
        distance={38}
        decay={1.6}
        color="#eef5ff"
      />
      <pointLight
        position={[0, 5.8, -89.5]}
        intensity={22 * interiorBoost}
        distance={28}
        decay={1.7}
        color="#f8c98b"
      />
      <pointLight
        position={[0, 6.0, -104.5]}
        intensity={24 * interiorBoost}
        distance={34}
        decay={1.6}
        color="#fff1d9"
      />

      <points
        ref={motesRef}
        geometry={motesGeo}
        material={motesMat}
        frustumCulled={false}
        raycast={() => null}
      />
    </>
  );
}
