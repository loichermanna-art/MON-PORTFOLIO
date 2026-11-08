import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export const LIBRARY_MODEL_PATHS = {
  doorLeaf: '/models/monumental-door-leaf.glb',
  bookcaseBay: '/models/bookcase-bay.glb',
  sconce: '/models/architectural-sconce.glb',
  bookUnit: '/models/curved-book-unit.glb',
} as const;

useGLTF.preload(LIBRARY_MODEL_PATHS.doorLeaf);
useGLTF.preload(LIBRARY_MODEL_PATHS.bookcaseBay);
useGLTF.preload(LIBRARY_MODEL_PATHS.sconce);
useGLTF.preload(LIBRARY_MODEL_PATHS.bookUnit);

function configureRepeatingSet(
  albedo: THREE.Texture,
  normal: THREE.Texture,
  roughness: THREE.Texture,
  repeatX: number,
  repeatY: number,
  anisotropy: number
): void {
  albedo.colorSpace = THREE.SRGBColorSpace;
  normal.colorSpace = THREE.NoColorSpace;
  roughness.colorSpace = THREE.NoColorSpace;

  for (const tex of [albedo, normal, roughness]) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.anisotropy = anisotropy;
    tex.needsUpdate = true;
  }
}

export interface LibraryMaterialPalette {
  walnutMillwork: THREE.MeshPhysicalMaterial;
  limestoneMonolith: THREE.MeshStandardMaterial;
  limestoneAshlarWall: THREE.MeshStandardMaterial;
  limestoneAshlarFloorMaps: {
    map: THREE.Texture;
    normalMap: THREE.Texture;
    roughnessMap: THREE.Texture;
  };
  architecturalConcrete: THREE.MeshStandardMaterial;
  burnishedBronze: THREE.MeshStandardMaterial;
  brushedBrass: THREE.MeshStandardMaterial;
  architecturalGlass: THREE.MeshPhysicalMaterial;
  frostedSkylightDiffuser: THREE.MeshStandardMaterial;
  warmOpalDiffuser: THREE.MeshStandardMaterial;
  midnightSignagePlaque: THREE.MeshPhysicalMaterial;
  bookCreamPages: THREE.MeshStandardMaterial;
  bookClothBase: THREE.MeshStandardMaterial;
}

/**
 * Centralized PBR material registry so identical architectural materials are shared
 * across all meshes (Three.js `material-reuse` & `memory-dispose-on-unmount` best practices).
 */
export function useLibraryMaterials(): LibraryMaterialPalette {
  const { gl } = useThree();
  const maxAniso = Math.min(8, gl.capabilities.getMaxAnisotropy());

  const textures = useTexture({
    walnutAlbedo: '/textures/library/walnut-albedo.jpg',
    walnutNormal: '/textures/library/walnut-normal.jpg',
    walnutRoughness: '/textures/library/walnut-roughness.jpg',
    limeAlbedo: '/textures/library/limestone-albedo.jpg',
    limeNormal: '/textures/library/limestone-normal.jpg',
    limeRoughness: '/textures/library/limestone-roughness.jpg',
    ashlarAlbedo: '/textures/library/limestone-ashlar-albedo.jpg',
    ashlarNormal: '/textures/library/limestone-ashlar-normal.jpg',
    ashlarRoughness: '/textures/library/limestone-ashlar-roughness.jpg',
    concreteAlbedo: '/textures/library/concrete-albedo.jpg',
    concreteNormal: '/textures/library/concrete-normal.jpg',
    concreteRoughness: '/textures/library/concrete-roughness.jpg',
  });

  const floorMaps = useMemo(() => {
    const map = textures.ashlarAlbedo.clone();
    const normalMap = textures.ashlarNormal.clone();
    const roughnessMap = textures.ashlarRoughness.clone();
    configureRepeatingSet(map, normalMap, roughnessMap, 3.5, 5.5, maxAniso);
    return { map, normalMap, roughnessMap };
  }, [
    textures.ashlarAlbedo,
    textures.ashlarNormal,
    textures.ashlarRoughness,
    maxAniso,
  ]);

  const materials = useMemo<LibraryMaterialPalette>(() => {
    configureRepeatingSet(
      textures.walnutAlbedo,
      textures.walnutNormal,
      textures.walnutRoughness,
      1.0,
      1.0,
      maxAniso
    );
    configureRepeatingSet(
      textures.limeAlbedo,
      textures.limeNormal,
      textures.limeRoughness,
      1.25,
      1.25,
      maxAniso
    );
    configureRepeatingSet(
      textures.ashlarAlbedo,
      textures.ashlarNormal,
      textures.ashlarRoughness,
      2.2,
      2.0,
      maxAniso
    );
    configureRepeatingSet(
      textures.concreteAlbedo,
      textures.concreteNormal,
      textures.concreteRoughness,
      2.0,
      2.0,
      maxAniso
    );

    const walnutMillwork = new THREE.MeshPhysicalMaterial({
      name: 'WalnutMillwork',
      color: new THREE.Color('#c9b29d'),
      map: textures.walnutAlbedo,
      normalMap: textures.walnutNormal,
      normalScale: new THREE.Vector2(0.55, 0.55),
      roughnessMap: textures.walnutRoughness,
      roughness: 0.52,
      metalness: 0.0,
      clearcoat: 0.16,
      clearcoatRoughness: 0.44,
      envMapIntensity: 0.85,
    });

    const limestoneMonolith = new THREE.MeshStandardMaterial({
      name: 'LimestoneMonolith',
      color: new THREE.Color('#ded8ce'),
      map: textures.limeAlbedo,
      normalMap: textures.limeNormal,
      normalScale: new THREE.Vector2(0.42, 0.42),
      roughnessMap: textures.limeRoughness,
      roughness: 0.68,
      metalness: 0.0,
      envMapIntensity: 0.72,
    });

    const limestoneAshlarWall = new THREE.MeshStandardMaterial({
      name: 'LimestoneAshlarWall',
      color: new THREE.Color('#dbd4c9'),
      map: textures.ashlarAlbedo,
      normalMap: textures.ashlarNormal,
      normalScale: new THREE.Vector2(0.52, 0.52),
      roughnessMap: textures.ashlarRoughness,
      roughness: 0.66,
      metalness: 0.0,
      envMapIntensity: 0.75,
    });

    const architecturalConcrete = new THREE.MeshStandardMaterial({
      name: 'ArchitecturalConcrete',
      color: new THREE.Color('#cbc7c0'),
      map: textures.concreteAlbedo,
      normalMap: textures.concreteNormal,
      normalScale: new THREE.Vector2(0.38, 0.38),
      roughnessMap: textures.concreteRoughness,
      roughness: 0.82,
      metalness: 0.0,
      envMapIntensity: 0.65,
    });

    const burnishedBronze = new THREE.MeshStandardMaterial({
      name: 'BurnishedBronze',
      color: new THREE.Color('#30261f'),
      metalness: 0.86,
      roughness: 0.34,
      envMapIntensity: 1.15,
    });

    const brushedBrass = new THREE.MeshStandardMaterial({
      name: 'BrushedBrass',
      color: new THREE.Color('#b69562'),
      metalness: 0.9,
      roughness: 0.27,
      envMapIntensity: 1.25,
    });

    const architecturalGlass = new THREE.MeshPhysicalMaterial({
      name: 'ArchitecturalGlass',
      color: new THREE.Color('#dfeaf6'),
      transparent: true,
      opacity: 0.22,
      roughness: 0.05,
      metalness: 0.04,
      ior: 1.52,
      reflectivity: 0.88,
      envMapIntensity: 1.45,
      depthWrite: false,
    });

    const frostedSkylightDiffuser = new THREE.MeshStandardMaterial({
      name: 'FrostedSkylightDiffuser',
      color: new THREE.Color('#eef4fc'),
      emissive: new THREE.Color('#dce9f8'),
      emissiveIntensity: 1.15,
      roughness: 0.35,
      metalness: 0.0,
    });

    const warmOpalDiffuser = new THREE.MeshStandardMaterial({
      name: 'WarmOpalDiffuser',
      color: new THREE.Color('#fff2dc'),
      emissive: new THREE.Color('#f4bf7c'),
      emissiveIntensity: 1.45,
      roughness: 0.32,
      metalness: 0.0,
    });

    // Subtle Midnight Blue architectural signage material (#102747)
    const midnightSignagePlaque = new THREE.MeshPhysicalMaterial({
      name: 'MidnightSignagePlaque',
      color: new THREE.Color('#102747'),
      roughness: 0.34,
      metalness: 0.12,
      clearcoat: 0.22,
      clearcoatRoughness: 0.36,
      envMapIntensity: 0.9,
    });

    const bookCreamPages = new THREE.MeshStandardMaterial({
      name: 'BookCreamPages',
      color: new THREE.Color('#eae3d4'),
      roughness: 0.88,
      metalness: 0.0,
      envMapIntensity: 0.5,
    });

    const bookClothBase = new THREE.MeshStandardMaterial({
      name: 'BookClothBase',
      color: new THREE.Color('#ffffff'),
      roughness: 0.76,
      metalness: 0.04,
      envMapIntensity: 0.6,
    });

    return {
      walnutMillwork,
      limestoneMonolith,
      limestoneAshlarWall,
      limestoneAshlarFloorMaps: floorMaps,
      architecturalConcrete,
      burnishedBronze,
      brushedBrass,
      architecturalGlass,
      frostedSkylightDiffuser,
      warmOpalDiffuser,
      midnightSignagePlaque,
      bookCreamPages,
      bookClothBase,
    };
  }, [textures, floorMaps, maxAniso]);

  useEffect(() => {
    return () => {
      materials.walnutMillwork.dispose();
      materials.limestoneMonolith.dispose();
      materials.limestoneAshlarWall.dispose();
      materials.architecturalConcrete.dispose();
      materials.burnishedBronze.dispose();
      materials.brushedBrass.dispose();
      materials.architecturalGlass.dispose();
      materials.frostedSkylightDiffuser.dispose();
      materials.warmOpalDiffuser.dispose();
      materials.midnightSignagePlaque.dispose();
      materials.bookCreamPages.dispose();
      materials.bookClothBase.dispose();
      floorMaps.map.dispose();
      floorMaps.normalMap.dispose();
      floorMaps.roughnessMap.dispose();
    };
  }, [materials, floorMaps]);

  return materials;
}
