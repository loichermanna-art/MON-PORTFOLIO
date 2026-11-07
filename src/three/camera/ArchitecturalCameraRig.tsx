import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { MOTION_DAMPING } from '../../motion/motionConfig';
import { motionStore } from '../../motion/motionStore';

interface ArchitecturalCameraRigProps {
  isMobile: boolean;
}

const REDUCED_SCENE_ANCHORS = [0.0, 0.24, 0.4, 0.61, 0.82, 0.99] as const;

/**
 * Rig Caméra Cinématographique Continu « MIDNIGHT BLUE » (Scènes 01 -> 06) :
 * - Franchissement physique réel du tambour circulaire de l'Oculus (z = -5.1m) avec > 2,0m
 *   de dégagement radial (zéro collision murale).
 * - Cadrage asymétrique constant : le mur porteur en béton sombre occupe le tiers gauche
 *   derrière la typographie éditoriale, tandis que les deux tiers droits dévoilent le canal
 *   d'eau axial et les monuments interactifs de chaque séquence jusqu'à l'horizon (far = 170m).
 * - Couplage du regard caméra avec les interactions UI/3D sur les 6 scènes.
 */
export function ArchitecturalCameraRig({ isMobile }: ArchitecturalCameraRigProps) {
  const railGroupRef = useRef<THREE.Group>(null);
  const pointerGroupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { size } = useThree();

  const smoothedProgress = useRef(0);
  const smoothedPointer = useRef({ x: 0, y: 0 });
  const smoothedGazeOffset = useRef({ x: 0, y: 0 });
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
            new THREE.Vector3(0.25, 2.02, 13.0),
            new THREE.Vector3(1.55, 2.05, -5.1),
            new THREE.Vector3(0.05, 2.02, -12.2),
            new THREE.Vector3(0.05, 2.12, -27.8),
            new THREE.Vector3(-0.05, 2.02, -48.6),
            new THREE.Vector3(0.35, 2.08, -59.5),
            new THREE.Vector3(0.05, 2.16, -68.8),
            new THREE.Vector3(0.05, 1.98, -91.2),
          ],
          false,
          'centripetal'
        ),
        targetCurve: new THREE.CatmullRomCurve3(
          [
            new THREE.Vector3(1.95, 2.35, -2.8),
            new THREE.Vector3(2.15, 2.1, -16.8),
            new THREE.Vector3(2.15, 1.98, -22.8),
            new THREE.Vector3(2.35, 2.05, -39.5),
            new THREE.Vector3(2.35, 1.95, -61.8),
            new THREE.Vector3(2.05, 2.1, -72.0),
            new THREE.Vector3(1.95, 2.32, -82.5),
            new THREE.Vector3(2.05, 2.1, -104.5),
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
          new THREE.Vector3(1.35, 1.98, -5.1),   // Passage cinématographique au cœur de l'Oculus
          new THREE.Vector3(-0.85, 1.96, -12.2), // 02 À propos : face à la claire-voie (-20..-25m)
          new THREE.Vector3(-0.95, 2.06, -27.8), // 03 Expertise : face aux 4 monolithes (-38..-40m)
          new THREE.Vector3(-1.05, 1.98, -48.6), // 04 Projets : face aux 3 chevalets (-59..-64m)
          new THREE.Vector3(-0.45, 2.06, -59.5), // Travelling fluide le long du canal
          new THREE.Vector3(-0.95, 2.14, -68.8), // 05 Démarche : face aux 6 portiques (-79..-89m)
          new THREE.Vector3(-0.85, 1.92, -91.2), // 06 Contact : face au belvédère (-100..-121m)
        ],
        false,
        'centripetal'
      ),
      targetCurve: new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(1.55, 2.18, -2.4),
          new THREE.Vector3(2.05, 2.05, -16.8),
          new THREE.Vector3(1.55, 1.96, -22.8),
          new THREE.Vector3(1.45, 2.02, -39.5),
          new THREE.Vector3(1.35, 1.95, -61.8),
          new THREE.Vector3(1.45, 2.1, -72.0),
          new THREE.Vector3(1.15, 2.28, -82.5),
          new THREE.Vector3(1.45, 2.02, -103.5),
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

    // Couplage vivant du regard caméra avec l'élément interactif focalisé dans chacune des 6 scènes
    let desiredGazeX = 0;
    let desiredGazeY = 0;
    if (!motionStore.reducedMotion) {
      const scene = motionStore.activeScene;
      if (scene === 0 && motionStore.heroSteleHoverIndex !== -1) {
        desiredGazeX = 0.44;
        desiredGazeY = (1.5 - motionStore.heroSteleHoverIndex) * 0.06;
      } else if (scene === 1) {
        const p =
          motionStore.hoveredAboutPillar !== -1
            ? motionStore.hoveredAboutPillar
            : motionStore.selectedAboutPillar;
        desiredGazeX = (p - 1) * 0.22;
      } else if (scene === 2 && motionStore.focusedExpertisePole !== -1) {
        desiredGazeX = (motionStore.focusedExpertisePole - 1.5) * 0.28;
      } else if (scene === 3 && motionStore.focusedProjectIndex !== -1) {
        desiredGazeX = (motionStore.focusedProjectIndex - 1) * 0.36;
        desiredGazeY = -0.05;
      } else if (scene === 4) {
        desiredGazeY = (motionStore.activeProcessStep - 2.5) * 0.04;
      } else if (scene === 5 && motionStore.activeContactChannel !== -1) {
        desiredGazeX = (motionStore.activeContactChannel - 1) * 0.34;
        desiredGazeY = -0.08;
      }
    }

    smoothedGazeOffset.current.x = THREE.MathUtils.damp(
      smoothedGazeOffset.current.x,
      desiredGazeX,
      4.5,
      dt
    );
    smoothedGazeOffset.current.y = THREE.MathUtils.damp(
      smoothedGazeOffset.current.y,
      desiredGazeY,
      4.5,
      dt
    );

    tempTarget.x += smoothedGazeOffset.current.x;
    tempTarget.y += smoothedGazeOffset.current.y;

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
          Math.cos(elapsed * 0.3) * 0.016,
          Math.sin(elapsed * 0.44) * 0.022,
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
          far={170}
        />
      </group>
    </group>
  );
}
