import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { MOTION_DAMPING } from '../../motion/motionConfig';
import { motionStore } from '../../motion/motionStore';

interface ArchitecturalCameraRigProps {
  isMobile: boolean;
}

/**
 * Rig Caméra Cinématographique Complet des 6 Scènes (MOTION.md §2 & §3) :
 * 1. railGroupRef    -> Contrôlé UNIQUEMENT par scrollProgress (aucun conflit)
 * 2. pointerGroupRef -> Contrôlé UNIQUEMENT par pointerX / pointerY (+ léger focus stèle)
 * 3. cameraRef       -> Contrôlé UNIQUEMENT par la respiration autonome Idle
 *
 * Points de passage calés sur les plages canoniques [0..1] :
 * - 0.00 : Scène 01 Hero (Péristyle)
 * - 0.11 : Franchissement du Portique d'Équilibre entrouvert
 * - 0.24 : Scène 02 About (Galerie à Claire-Voie, caméra droite regardant gauche)
 * - 0.40 : Scène 03 Expertise (Cour des Deux Piliers, plongée symétrique douce)
 * - 0.51 : Scène 04.1 LAURA HOUSE (texte gauche, Stèle 01 droite)
 * - 0.60 : Scène 04.2 SassySkin   (Stèle 02 gauche, texte droite)
 * - 0.69 : Scène 04.3 EtuCo       (texte gauche, Stèle 03 droite)
 * - 0.82 : Scène 05 Process       (Passerelle séquentielle de 6 dalles)
 * - 0.95 -> 1.00 : Scène 06 Contact (Belvédère ouvert, recul apaisé)
 */
const REDUCED_SCENE_ANCHORS = [0.0, 0.24, 0.4, 0.6, 0.82, 0.98] as const;

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
            new THREE.Vector3(0.1, 2.35, 15.0),   // 01 Hero
            new THREE.Vector3(0.25, 2.15, 5.0),   // Seuil Portique
            new THREE.Vector3(0.2, 2.05, -4.5),   // 02 About
            new THREE.Vector3(0.0, 2.95, -20.5),  // 03 Expertise
            new THREE.Vector3(-0.35, 2.0, -39.0), // 04.1 LAURA HOUSE
            new THREE.Vector3(0.35, 2.0, -47.2),  // 04.2 SassySkin
            new THREE.Vector3(-0.35, 2.0, -55.2), // 04.3 EtuCo
            new THREE.Vector3(0.0, 2.4, -66.5),   // 05 Process entrée
            new THREE.Vector3(0.0, 2.15, -75.5),  // 05 Process sortie
            new THREE.Vector3(0.0, 2.1, -85.8),   // 06 Contact Belvédère
          ],
          false,
          'centripetal'
        ),
        targetCurve: new THREE.CatmullRomCurve3(
          [
            new THREE.Vector3(1.1, 2.55, 1.8),
            new THREE.Vector3(0.35, 2.25, -5.5),
            new THREE.Vector3(-1.45, 2.15, -14.2),
            new THREE.Vector3(0.0, 1.85, -31.0),
            new THREE.Vector3(1.65, 2.15, -43.8),
            new THREE.Vector3(-1.65, 2.15, -51.8),
            new THREE.Vector3(1.65, 2.15, -59.8),
            new THREE.Vector3(0.0, 1.75, -75.0),
            new THREE.Vector3(0.0, 1.85, -83.5),
            new THREE.Vector3(0.0, 2.1, -96.5),
          ],
          false,
          'centripetal'
        ),
      };
    }

    return {
      positionCurve: new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(-0.88, 2.05, 13.5),  // 01 Hero : texte gauche, Péristyle + Portique droite
          new THREE.Vector3(0.35, 2.0, 4.8),     // Franchissement du Portique d'Équilibre
          new THREE.Vector3(1.38, 1.95, -4.2),   // 02 About : brise-soleil gauche, texte droite
          new THREE.Vector3(0.0, 3.25, -20.8),   // 03 Expertise : plongée symétrique Cour des Deux Piliers
          new THREE.Vector3(-1.22, 1.88, -38.8), // 04.1 LAURA HOUSE : texte gauche, Stèle 01 droite
          new THREE.Vector3(1.22, 1.88, -46.8),  // 04.2 SassySkin   : Stèle 02 gauche, texte droite
          new THREE.Vector3(-1.22, 1.88, -54.8), // 04.3 EtuCo       : texte gauche, Stèle 03 droite
          new THREE.Vector3(-1.45, 2.42, -65.2), // 05 Process : approche latérale de la Passerelle
          new THREE.Vector3(0.0, 2.12, -75.2),   // 05 Process : traversée axiale des 6 dalles verrouillées
          new THREE.Vector3(0.0, 2.06, -85.8),   // 06 Contact : stabilisation apaisée sur le Belvédère
        ],
        false,
        'centripetal'
      ),
      targetCurve: new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(1.58, 2.22, 1.4),
          new THREE.Vector3(0.45, 2.12, -5.2),
          new THREE.Vector3(-1.95, 2.06, -14.5),
          new THREE.Vector3(0.0, 1.82, -31.2),
          new THREE.Vector3(2.05, 2.05, -43.6),
          new THREE.Vector3(-2.05, 2.05, -51.6),
          new THREE.Vector3(2.05, 2.05, -59.6),
          new THREE.Vector3(0.0, 1.65, -74.5),
          new THREE.Vector3(0.0, 1.85, -84.0),
          new THREE.Vector3(0.0, 2.05, -96.5),
        ],
        false,
        'centripetal'
      ),
    };
  }, [isMobile]);

  useFrame(({ clock }, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);

    // 1. Étage Rail (Scroll uniquement)
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

    // 2. Étage Parallaxe Pointeur (Souris uniquement, coupé sur mobile & reduced-motion)
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

    // 3. Étage Respiration Autonome (Horloge uniquement)
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
          far={105}
        />
      </group>
    </group>
  );
}
