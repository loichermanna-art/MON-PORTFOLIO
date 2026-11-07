import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { MOTION_DAMPING } from '../../motion/motionConfig';
import { motionStore } from '../../motion/motionStore';

interface ArchitecturalCameraRigProps {
  isMobile: boolean;
}

const REDUCED_SCENE_ANCHORS = [0.0, 0.22, 0.4, 0.58, 0.8, 0.98] as const;

/**
 * Rig Caméra Cinématographique continu calé sur la composition spatiale des 6 panneaux :
 * Maintient une respiration lumineuse dégagée sur le tiers gauche pour la typographie sans boîte,
 * tout en magnifiant la profondeur architecturale et les volumes 3D au centre-droit.
 */
export function ArchitecturalCameraRig({ isMobile }: ArchitecturalCameraRigProps) {
  const railGroupRef = useRef<THREE.Group>(null);
  const pointerGroupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { size } = useThree();

  const smoothedProgress = useRef(0);
  const smoothedPointer = useRef({ x: 0, y: 0 });
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempTarget = useMemo(() => new THREE.Vector3(), []);
  const lookMatrix = useMemo(() => new THREE.Matrix4(), []);
  const targetQuat = useMemo(() => new THREE.Quaternion(), []);
  const upVec = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  const { positionCurve, targetCurve } = useMemo(() => {
    if (isMobile) {
      return {
        positionCurve: new THREE.CatmullRomCurve3(
          [
            new THREE.Vector3(0.0, 2.35, 14.2),   // 01 Hero
            new THREE.Vector3(0.0, 2.25, 4.0),    // Traversée arches
            new THREE.Vector3(-0.15, 2.2, -4.8),  // 02 À propos (Canyon cantilever)
            new THREE.Vector3(-0.15, 2.4, -21.0), // 03 Expertise (Matrice cubes)
            new THREE.Vector3(-0.25, 2.2, -39.8), // 04 Projets (Pilastres & écrans)
            new THREE.Vector3(-0.2, 2.2, -52.5),  // Transition
            new THREE.Vector3(-0.15, 2.3, -65.5), // 05 Démarche (Anneau orbital)
            new THREE.Vector3(-0.1, 2.1, -84.5),  // 06 Contact (Escalier d'horizon)
          ],
          false,
          'centripetal'
        ),
        targetCurve: new THREE.CatmullRomCurve3(
          [
            new THREE.Vector3(1.55, 2.75, 1.5),
            new THREE.Vector3(0.55, 2.45, -6.0),
            new THREE.Vector3(1.15, 2.45, -13.2),
            new THREE.Vector3(0.85, 2.65, -29.2),
            new THREE.Vector3(1.85, 2.25, -48.2),
            new THREE.Vector3(0.85, 2.25, -60.0),
            new THREE.Vector3(1.15, 2.35, -73.2),
            new THREE.Vector3(0.95, 2.65, -94.8),
          ],
          false,
          'centripetal'
        ),
      };
    }

    return {
      positionCurve: new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(-1.12, 2.12, 12.8),  // 01 Hero : arche courbe + sphère chrome à droite
          new THREE.Vector3(-0.45, 2.15, 4.2),   // Plongée fluide sous les nervures paraboliques
          new THREE.Vector3(-0.95, 2.15, -4.6),  // 02 À propos : canyon cantilever + monolithe droit
          new THREE.Vector3(-1.05, 2.35, -20.8), // 03 Expertise : matrice cubique suspendue
          new THREE.Vector3(-1.15, 2.15, -39.5), // 04 Projets : pilastres chrome + 3 écrans flottants
          new THREE.Vector3(-0.65, 2.2, -53.5),  // Travelling continu dans la nef
          new THREE.Vector3(-1.05, 2.25, -65.2), // 05 Démarche : anneau cristallin & sphère centrale
          new THREE.Vector3(-0.88, 2.05, -84.2), // 06 Contact : escalier monumental & soleil d'horizon
        ],
        false,
        'centripetal'
      ),
      targetCurve: new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(1.85, 2.52, 1.4),
          new THREE.Vector3(0.65, 2.35, -6.2),
          new THREE.Vector3(1.35, 2.32, -13.2),
          new THREE.Vector3(1.05, 2.58, -29.2),
          new THREE.Vector3(2.15, 2.15, -48.4),
          new THREE.Vector3(0.95, 2.2, -61.5),
          new THREE.Vector3(1.45, 2.28, -73.2),
          new THREE.Vector3(1.15, 2.55, -94.8),
        ],
        false,
        'centripetal'
      ),
    };
  }, [isMobile]);

  useFrame(({ clock }, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);

    if (motionStore.reducedMotion) {
      const targetAnchor = REDUCED_SCENE_ANCHORS[motionStore.activeScene] ?? 0;
      smoothedProgress.current = THREE.MathUtils.damp(
        smoothedProgress.current,
        targetAnchor,
        MOTION_DAMPING.cameraReduced,
        dt
      );
    } else {
      smoothedProgress.current = THREE.MathUtils.damp(
        smoothedProgress.current,
        motionStore.scrollProgress,
        MOTION_DAMPING.cameraRail,
        dt
      );
    }

    const tScroll = Math.max(0, Math.min(1, smoothedProgress.current));
    positionCurve.getPointAt(tScroll, tempPos);
    targetCurve.getPointAt(tScroll, tempTarget);

    if (railGroupRef.current) {
      railGroupRef.current.position.copy(tempPos);
      lookMatrix.lookAt(tempPos, tempTarget, upVec);
      targetQuat.setFromRotationMatrix(lookMatrix);
      railGroupRef.current.quaternion.copy(targetQuat);
    }

    if (pointerGroupRef.current) {
      const targetPx = isMobile || motionStore.reducedMotion ? 0 : motionStore.pointerX;
      const targetPy = isMobile || motionStore.reducedMotion ? 0 : motionStore.pointerY;

      smoothedPointer.current.x = THREE.MathUtils.damp(
        smoothedPointer.current.x,
        targetPx,
        MOTION_DAMPING.pointerParallax,
        dt
      );
      smoothedPointer.current.y = THREE.MathUtils.damp(
        smoothedPointer.current.y,
        targetPy,
        MOTION_DAMPING.pointerParallax,
        dt
      );

      pointerGroupRef.current.position.set(
        smoothedPointer.current.x * 0.16,
        smoothedPointer.current.y * 0.1,
        0
      );
      pointerGroupRef.current.rotation.set(
        smoothedPointer.current.y * 0.015,
        -smoothedPointer.current.x * 0.022,
        0
      );
    }

    if (cameraRef.current) {
      if (motionStore.reducedMotion) {
        cameraRef.current.position.set(0, 0, 0);
      } else {
        const elapsed = clock.getElapsedTime();
        cameraRef.current.position.set(
          Math.cos(elapsed * 0.32) * 0.02,
          Math.sin(elapsed * 0.46) * 0.028,
          0
        );
      }
    }
  });

  const responsiveFov = isMobile || size.width < 768 ? 45 : 38;

  return (
    <group ref={railGroupRef} name="CameraRailGroup">
      <group ref={pointerGroupRef} name="CameraPointerGroup">
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          fov={responsiveFov}
          near={0.2}
          far={110}
        />
      </group>
    </group>
  );
}
