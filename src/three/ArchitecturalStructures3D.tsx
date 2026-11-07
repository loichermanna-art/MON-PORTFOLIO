import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore } from '../motion/motionStore';

/**
 * ArchitecturalStructures3D.tsx — Structures architecturales 3D Midnight Blue (#071426 / #102747 / #174477 / #76A9E8)
 * jalonnant le corridor narratif continu (z = -1.6 -> -44.0) et réagissant en temps réel
 * aux sélections et survols de chacune des 6 scènes du portfolio.
 */

function createArchitecturalEdgeMaterial(initialIntensity = 0.25): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    uniforms: {
      uIntensity: { value: initialIntensity },
      uCamZ: { value: 5.5 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorldPos;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uIntensity;
      uniform float uCamZ;
      varying vec3 vWorldPos;
      varying vec2 vUv;

      void main() {
        float distZ = uCamZ - vWorldPos.z;
        float nearFade = smoothstep(0.9, 3.2, distZ);
        float farFade = 1.0 - smoothstep(14.0, 28.0, distZ);
        float depthVis = nearFade * farFade;

        // Verre structurel Midnight Blue biseauté : cœur #102747 translucide, arêtes #76A9E8 / #E8EDF5
        float edgeX = min(vUv.x, 1.0 - vUv.x);
        float edgeY = min(vUv.y, 1.0 - vUv.y);
        float border = 1.0 - smoothstep(0.0, 0.055, min(edgeX, edgeY));
        float verticalGrad = smoothstep(0.0, 1.0, vUv.y);

        vec3 coreCol = vec3(0.063, 0.153, 0.278);   // #102747
        vec3 steelCol = vec3(0.090, 0.267, 0.467);  // #174477
        vec3 azureCol = vec3(0.463, 0.663, 0.910);  // #76A9E8
        vec3 iceCol = vec3(0.910, 0.929, 0.961);    // #E8EDF5

        vec3 activeTint = mix(azureCol, iceCol, clamp((uIntensity - 0.55) * 1.4, 0.0, 1.0));
        vec3 col = mix(coreCol, steelCol, verticalGrad * 0.55);
        col = mix(col, activeTint, border * (0.35 + uIntensity * 0.65));

        float bodyAlpha = (0.14 + uIntensity * 0.16) * verticalGrad;
        float edgeAlpha = border * (0.22 + uIntensity * 0.56);
        float alpha = clamp(bodyAlpha + edgeAlpha, 0.0, 0.82) * depthVis;

        gl_FragColor = vec4(col, alpha);
      }
    `,
    side: THREE.DoubleSide,
  });
}

export function ArchitecturalStructures3D({ isMobile }: { isMobile: boolean }) {
  // 01. HERO — 4 lames verticales associées aux 4 grands pôles d'activité
  const heroBladeRefs = useRef<Array<THREE.Mesh | null>>([]);
  const heroMaterials = useMemo(
    () => [0, 1, 2, 3].map(() => createArchitecturalEdgeMaterial(0.28)),
    []
  );

  // 02. PARCOURS — 6 stèles chronologiques échelonnées le long de la passerelle spatiale
  const timelineSteleRefs = useRef<Array<THREE.Mesh | null>>([]);
  const timelineMaterials = useMemo(
    () => [0, 1, 2, 3, 4, 5].map(() => createArchitecturalEdgeMaterial(0.24)),
    []
  );

  // 03. COMPÉTENCES — 5 monolithes disposés en hémicycle
  const expertiseMonolithRefs = useRef<Array<THREE.Mesh | null>>([]);
  const expertiseMaterials = useMemo(
    () => [0, 1, 2, 3, 4].map(() => createArchitecturalEdgeMaterial(0.24)),
    []
  );

  // 04. PROJETS — 4 pavillons monumentaux alternés gauche/droite
  const projectPavilionRefs = useRef<Array<THREE.Group | null>>([]);
  const projectMaterials = useMemo(
    () => [0, 1, 2, 3].map(() => createArchitecturalEdgeMaterial(0.3)),
    []
  );

  // 05. MÉTHODE — 6 portiques séquentiels en perspective
  const processMaterials = useMemo(
    () => [0, 1, 2, 3, 4, 5].map(() => createArchitecturalEdgeMaterial(0.22)),
    []
  );

  // 06. CONTACT — 2 colonnades d'ouverture du belvédère
  const contactMaterials = useMemo(
    () => [0, 1].map(() => createArchitecturalEdgeMaterial(0.35)),
    []
  );

  useEffect(() => {
    const allMats = [
      ...heroMaterials,
      ...timelineMaterials,
      ...expertiseMaterials,
      ...projectMaterials,
      ...processMaterials,
      ...contactMaterials,
    ];
    return () => {
      allMats.forEach((m) => m.dispose());
    };
  }, [
    heroMaterials,
    timelineMaterials,
    expertiseMaterials,
    projectMaterials,
    processMaterials,
    contactMaterials,
  ]);

  useFrame(({ camera }, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    const camZ = camera.position.z;

    // 01. Lames Hero
    for (let i = 0; i < 4; i++) {
      const mat = heroMaterials[i];
      const isHovered = motionStore.heroSteleHoverIndex === i;
      const target = isHovered ? 0.95 : 0.26;
      mat.uniforms.uIntensity.value = THREE.MathUtils.damp(
        mat.uniforms.uIntensity.value,
        target,
        6.0,
        dt
      );
      mat.uniforms.uCamZ.value = camZ;

      const mesh = heroBladeRefs.current[i];
      if (mesh) {
        const baseZ = -1.4 - i * 0.55;
        mesh.position.z = THREE.MathUtils.damp(
          mesh.position.z,
          isHovered ? baseZ + 0.35 : baseZ,
          5.5,
          dt
        );
      }
    }

    // 02. Stèles chronologiques Parcours
    const activeMilestone =
      motionStore.hoveredAboutPillar >= 0
        ? motionStore.hoveredAboutPillar
        : motionStore.selectedAboutPillar;
    for (let i = 0; i < 6; i++) {
      const mat = timelineMaterials[i];
      const isFocused = activeMilestone === i;
      const isPassed = i < activeMilestone;
      const target = isFocused ? 0.96 : isPassed ? 0.44 : 0.2;
      mat.uniforms.uIntensity.value = THREE.MathUtils.damp(
        mat.uniforms.uIntensity.value,
        target,
        5.5,
        dt
      );
      mat.uniforms.uCamZ.value = camZ;

      const stele = timelineSteleRefs.current[i];
      if (stele) {
        const baseY = -0.38 + i * 0.08;
        stele.position.y = THREE.MathUtils.damp(
          stele.position.y,
          isFocused ? baseY + 0.22 : baseY,
          5.0,
          dt
        );
      }
    }

    // 03. Monolithes des 5 domaines de compétences
    const activeExp =
      motionStore.focusedExpertisePole >= 0
        ? motionStore.focusedExpertisePole
        : motionStore.selectedExpertiseIndex;
    for (let i = 0; i < 5; i++) {
      const mat = expertiseMaterials[i];
      const isSelected = activeExp === i;
      mat.uniforms.uIntensity.value = THREE.MathUtils.damp(
        mat.uniforms.uIntensity.value,
        isSelected ? 0.96 : 0.2,
        5.5,
        dt
      );
      mat.uniforms.uCamZ.value = camZ;

      const mono = expertiseMonolithRefs.current[i];
      if (mono) {
        const targetScaleY = isSelected ? 1.12 : 0.94;
        mono.scale.y = THREE.MathUtils.damp(mono.scale.y, targetScaleY, 5.0, dt);
      }
    }

    // 04. Pavillons des 4 Projets
    const activeProj =
      motionStore.caseStudyOpenIndex >= 0
        ? motionStore.caseStudyOpenIndex
        : motionStore.focusedProjectIndex;
    for (let i = 0; i < 4; i++) {
      const mat = projectMaterials[i];
      const isCurrent = activeProj === i;
      mat.uniforms.uIntensity.value = THREE.MathUtils.damp(
        mat.uniforms.uIntensity.value,
        isCurrent ? 0.98 : 0.3,
        5.5,
        dt
      );
      mat.uniforms.uCamZ.value = camZ;

      const pav = projectPavilionRefs.current[i];
      if (pav) {
        const s = isCurrent ? 1.06 : 1.0;
        pav.scale.setScalar(THREE.MathUtils.damp(pav.scale.x, s, 5.0, dt));
      }
    }

    // 05. Six Portiques Méthode
    const step = motionStore.activeProcessStep;
    for (let i = 0; i < 6; i++) {
      const mat = processMaterials[i];
      const isCurrent = i === step;
      const isDone = i < step;
      mat.uniforms.uIntensity.value = THREE.MathUtils.damp(
        mat.uniforms.uIntensity.value,
        isCurrent ? 0.98 : isDone ? 0.48 : 0.18,
        5.5,
        dt
      );
      mat.uniforms.uCamZ.value = camZ;
    }

    // 06. Belvédère Contact
    const contactActive = motionStore.activeContactChannel >= 0;
    for (let i = 0; i < 2; i++) {
      const mat = contactMaterials[i];
      mat.uniforms.uIntensity.value = THREE.MathUtils.damp(
        mat.uniforms.uIntensity.value,
        contactActive ? 0.88 : 0.42,
        5.0,
        dt
      );
      mat.uniforms.uCamZ.value = camZ;
    }
  });

  const spread = isMobile ? 0.62 : 1.0;

  return (
    <group name="MidnightBlueArchitecturalCorridor" renderOrder={-5}>
      {/* SCÈNE 01 — 4 lames verticales de verre structurel à droite de l'Oculus */}
      <group name="Scene01HeroBlades">
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={`hero-blade-${i}`}
            ref={(el) => {
              heroBladeRefs.current[i] = el;
            }}
            position={[(1.55 + i * 0.48) * spread, -0.05 + i * 0.06, -1.4 - i * 0.55]}
            rotation={[0, -0.34, 0]}
            material={heroMaterials[i]}
          >
            <planeGeometry args={[0.42, 2.35]} />
          </mesh>
        ))}
      </group>

      {/* SCÈNE 02 — Passerelle Chronologique : 6 stèles échelonnées en profondeur */}
      <group name="Scene02TimelineSteles">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const side = i % 2 === 0 ? 1 : -1;
          return (
            <mesh
              key={`timeline-stele-${i}`}
              ref={(el) => {
                timelineSteleRefs.current[i] = el;
              }}
              position={[
                side * (1.35 + (i % 3) * 0.28) * spread,
                -0.38 + i * 0.08,
                -7.6 - i * 1.05,
              ]}
              rotation={[0, -side * 0.26, 0]}
              material={timelineMaterials[i]}
            >
              <planeGeometry args={[0.68, 1.85]} />
            </mesh>
          );
        })}
      </group>

      {/* SCÈNE 03 — Hémicycle des 5 Monolithes de Compétences */}
      <group name="Scene03ExpertiseMonoliths" position={[0, 0, -18.4]}>
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = ((i - 2) / 2) * 0.68;
          const x = Math.sin(angle) * 2.85 * spread;
          const z = -Math.cos(angle) * 1.35;
          return (
            <mesh
              key={`exp-mono-${i}`}
              ref={(el) => {
                expertiseMonolithRefs.current[i] = el;
              }}
              position={[x, 0.05, z]}
              rotation={[0, -angle * 0.85, 0]}
              material={expertiseMaterials[i]}
            >
              <planeGeometry args={[0.74, 2.55]} />
            </mesh>
          );
        })}
      </group>

      {/* SCÈNE 04 — Galerie des 4 Pavillons Monumentaux (alternés gauche / droite) */}
      <group name="Scene04ProjectPavilions">
        {[0, 1, 2, 3].map((i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          const z = -23.8 - i * 2.85;
          return (
            <group
              key={`proj-pav-${i}`}
              ref={(el) => {
                projectPavilionRefs.current[i] = el;
              }}
              position={[dir * 1.75 * spread, 0.04, z]}
              rotation={[0, -dir * 0.24, 0]}
            >
              <mesh material={projectMaterials[i]}>
                <planeGeometry args={[2.35, 1.55]} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* SCÈNE 05 — Corridor des 6 Portiques Séquentiels */}
      <group name="Scene05ProcessPorticos">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const z = -35.8 - i * 0.92;
          const w = (3.4 - i * 0.12) * spread;
          const h = 2.25 - i * 0.06;
          return (
            <group key={`proc-arch-${i}`} position={[0, 0.06, z]}>
              {/* Montant gauche */}
              <mesh position={[-w * 0.5, 0, 0]} material={processMaterials[i]}>
                <planeGeometry args={[0.16, h]} />
              </mesh>
              {/* Montant droit */}
              <mesh position={[w * 0.5, 0, 0]} material={processMaterials[i]}>
                <planeGeometry args={[0.16, h]} />
              </mesh>
              {/* Linteau supérieur */}
              <mesh position={[0, h * 0.5, 0]} material={processMaterials[i]}>
                <planeGeometry args={[w + 0.16, 0.12]} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* SCÈNE 06 — Belvédère Ouvert de Contact */}
      <group name="Scene06ContactBelvedere" position={[0, 0.08, -43.8]}>
        <mesh
          position={[-2.35 * spread, 0, 0]}
          rotation={[0, 0.22, 0]}
          material={contactMaterials[0]}
        >
          <planeGeometry args={[0.62, 2.75]} />
        </mesh>
        <mesh
          position={[2.35 * spread, 0, 0]}
          rotation={[0, -0.22, 0]}
          material={contactMaterials[1]}
        >
          <planeGeometry args={[0.62, 2.75]} />
        </mesh>
      </group>
    </group>
  );
}
