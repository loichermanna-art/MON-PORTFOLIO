import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { MOTION_DAMPING } from '../../motion/motionConfig';
import { motionStore } from '../../motion/motionStore';

interface ArchitecturalCameraRigProps {
  isMobile: boolean;
}

const REDUCED_SCENE_ANCHORS = [0.0, 0.2, 0.38, 0.58, 0.8, 0.98] as const;

/**
 * Rig Caméra Cinématographique « MIDNIGHT BLUE » :
 * - Scène 01 (Hero) : Cadrage millimétré [ -0.65, 1.85, 11.4 ] -> [ 1.45, 2.25, -2.0 ]
 *   plaçant l'alcôve béton sombre derrière « Loïc AKANDA » à gauche, l'oculus lumineux et
 *   la silhouette au centre-droit, et la stèle de verre interactive à droite.
 * - Réaction subtile au survol de la stèle 3D et avancée fluide sous le soffite au scroll.
 */
export function ArchitecturalCameraRig({ isMobile }: ArchitecturalCameraRigProps) {
  const railGroupRef = useRef<THREE.Group>(null);
  const pointerGroupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { size } = useThree();

  const smoothedProgress = useRef(0);
  const smoothedPointer = useRef({ x: 0, y: 0 });
  const smoothedSteleFocus = useRef(0);
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
            new THREE.Vector3(0.35, 2.05, 13.2),  // 01 Hero mobile
            new THREE.Vector3(0.55, 1.95, 4.8),   // Franchissement portique
            new THREE.Vector3(0.15, 2.05, -5.2),  // 02 À propos
            new THREE.Vector3(0.15, 2.2, -21.2),  // 03 Expertise
            new THREE.Vector3(0.1, 2.05, -40.2),  // 04 Projets
            new THREE.Vector3(0.2, 2.1, -55.0),   // Transition
            new THREE.Vector3(0.15, 2.2, -65.5),  // 05 Démarche
            new THREE.Vector3(0.1, 2.0, -83.5),   // 06 Contact
          ],
          false,
          'centripetal'
        ),
        targetCurve: new THREE.CatmullRomCurve3(
          [
            new THREE.Vector3(1.95, 2.45, -2.5),
            new THREE.Vector3(1.65, 2.2, -6.5),
            new THREE.Vector3(1.65, 2.15, -15.2),
            new THREE.Vector3(2.1, 2.1, -29.2),
            new THREE.Vector3(2.5, 2.05, -49.0),
            new THREE.Vector3(1.8, 2.1, -62.0),
            new THREE.Vector3(1.9, 2.35, -73.5),
            new THREE.Vector3(1.15, 2.6, -96.5),
          ],
          false,
          'centripetal'
        ),
      };
    }

    return {
      positionCurve: new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(-0.65, 1.85, 11.4),  // 01 Hero : perspective référence exacte
          new THREE.Vector3(0.25, 1.88, 3.8),    // Avancée cinématographique sous le soffite vers l'oculus
          new THREE.Vector3(-0.85, 2.05, -5.0),  // 02 À propos : cadres géométriques
          new THREE.Vector3(-0.95, 2.15, -21.0), // 03 Expertise : 4 monolithes sélectionnables
          new THREE.Vector3(-1.05, 2.05, -40.2), // 04 Projets : galerie immersive
          new THREE.Vector3(-0.55, 2.1, -55.5),  // Travelling de liaison
          new THREE.Vector3(-0.95, 2.2, -65.5),  // 05 Démarche : anneau séquentiel
          new THREE.Vector3(-0.75, 1.95, -83.2), // 06 Contact : horizon lumineux ouvert
        ],
        false,
        'centripetal'
      ),
      targetCurve: new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(1.45, 2.25, -2.0),
          new THREE.Vector3(1.85, 2.2, -6.8),
          new THREE.Vector3(1.75, 2.15, -15.2),
          new THREE.Vector3(2.25, 2.05, -29.2),
          new THREE.Vector3(2.65, 2.05, -49.2),
          new THREE.Vector3(1.65, 2.15, -62.5),
          new THREE.Vector3(2.1, 2.35, -73.5),
          new THREE.Vector3(1.15, 2.65, -96.5),
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

    // Inflexion subtile du regard vers la stèle de verre 3D du Hero lorsqu'elle est survolée
    const steleTarget =
      tScroll < 0.14 && motionStore.heroSteleHoverIndex >= 0 && !motionStore.reducedMotion
        ? 1
        : 0;
    smoothedSteleFocus.current = THREE.MathUtils.damp(
      smoothedSteleFocus.current,
      steleTarget,
      4.5,
      dt
    );
    tempTarget.x += smoothedSteleFocus.current * 0.42;
    tempTarget.y -= smoothedSteleFocus.current * 0.08;

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
        smoothedPointer.current.x * 0.18,
        smoothedPointer.current.y * 0.1,
        0
      );
      pointerGroupRef.current.rotation.set(
        smoothedPointer.current.y * 0.014,
        -smoothedPointer.current.x * 0.02,
        0
      );
    }

    if (cameraRef.current) {
      if (motionStore.reducedMotion) {
        cameraRef.current.position.set(0, 0, 0);
      } else {
        const elapsed = clock.getElapsedTime();
        cameraRef.current.position.set(
          Math.cos(elapsed * 0.3) * 0.018,
          Math.sin(elapsed * 0.44) * 0.024,
          0
        );
      }
    }
  });

  const responsiveFov = isMobile || size.width < 768 ? 46 : 38;

  return (
    <group ref={railGroupRef} name="CameraRailGroup">
      <group ref={pointerGroupRef} name="CameraPointerGroup">
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          fov={responsiveFov}
          near={0.2}
          far={120}
        />
      </group>
    </group>
  );
}
