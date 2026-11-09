import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createTempleSkyMaterial } from '../resources/templeGeometryCompiler';
import { libraryMotionState, useLibraryStore } from '../state/useLibraryStore';

function HdriGlobalIllumination() {
  return (
    <Environment
      files="/hdri/lebombo_1k.hdr"
      environmentIntensity={0.62}
      background={false}
    />
  );
}

/**
 * AAA Temple Lighting, Atmospheric Sky & Texel-Snapped Shadow System
 * (`threejs-shadow-systems` + `threejs-atmosphere-aerial-perspective` + `threejs-exposure-color-grading`)
 */
export function LibraryLightingRig() {
  const { gl, scene } = useThree();
  const deviceTier = useLibraryStore((s) => s.deviceTier);

  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const keyTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const motesRef = useRef<THREE.Points>(null);

  const skyMaterial = useMemo(() => createTempleSkyMaterial(), []);

  // Subtle floating architectural dust motes caught in the Temple sunbeams (1 draw call)
  const { motesGeo, motesMat } = useMemo(() => {
    const count = deviceTier === 'mobile' ? 180 : 420;
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
      size: 0.042,
      transparent: true,
      opacity: 0.52,
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
      scene.environmentIntensity = 0.56;
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

  const shadowMapSize = deviceTier === 'desktop' ? 2048 : 1024;
  const shadowFrustumHalf = 16; // 32m local window around visitor
  const texelWorldSize = (shadowFrustumHalf * 2) / shadowMapSize;

  useFrame(({ clock }) => {
    if (libraryMotionState.isTabHidden) return;

    // Texel-stabilized shadow camera tracking visitor Z across all 6 sanctuaries
    if (keyLightRef.current && deviceTier !== 'mobile') {
      const snappedZ =
        Math.round((libraryMotionState.camZ - 6.0) / texelWorldSize) *
        texelWorldSize;
      keyTargetRef.current.position.set(0, 0, snappedZ);
      keyTargetRef.current.updateMatrixWorld();
      keyLightRef.current.position.set(5.4, 17.5, snappedZ + 7.2);
    }

    if (motesRef.current && !useLibraryStore.getState().reducedMotion) {
      const t = clock.getElapsedTime();
      motesRef.current.position.y = Math.sin(t * 0.35) * 0.16;
      motesRef.current.position.x = Math.cos(t * 0.24) * 0.12;
    }
  });

  return (
    <>
      {/* Analytic Rayleigh/Mie Golden-Twilight Temple Sky Dome */}
      <mesh material={skyMaterial} scale={[210, 210, 210]} frustumCulled={false}>
        <sphereGeometry args={[1, 32, 20]} />
      </mesh>

      {/* Matching Warm-Cool Horizon Aerial Perspective Fog */}
      <fogExp2 attach="fog" args={['#d8e2ee', 0.0034]} />

      <Suspense fallback={null}>
        <HdriGlobalIllumination />
      </Suspense>

      <hemisphereLight args={['#e5effc', '#9c866e', 0.92]} />

      {/* Primary Texel-Stabilized Skylight Sun casting crisp shadows in every hall */}
      <directionalLight
        ref={keyLightRef}
        position={[5.4, 17.5, 11.0]}
        intensity={2.35}
        color="#fff6e8"
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

      {/* Counter-fill cool skylight rim */}
      <directionalLight
        position={[-6.5, 15.0, -45.0]}
        intensity={1.15}
        color="#cbe0fa"
      />

      {/* Warm Sanctuary Brazier & Gallery Pools along the 130m axis */}
      <pointLight position={[0, 4.2, 10.5]} intensity={12} distance={22} decay={1.8} color="#ffcb88" />
      <pointLight position={[0, 4.6, -4.5]} intensity={14} distance={24} decay={1.7} color="#f5c68a" />
      <pointLight position={[0, 4.6, -16.5]} intensity={14} distance={24} decay={1.7} color="#f5c68a" />
      <pointLight position={[0, 8.2, -37.5]} intensity={30} distance={38} decay={1.55} color="#ffdfa8" />
      <pointLight position={[0, 6.2, -64.5]} intensity={28} distance={38} decay={1.6} color="#eef5ff" />
      <pointLight position={[0, 5.8, -89.5]} intensity={20} distance={28} decay={1.7} color="#f8c98b" />
      <pointLight position={[0, 6.0, -104.5]} intensity={24} distance={34} decay={1.6} color="#fff1d9" />

      {/* Atmospheric Temple Dust Motes */}
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
