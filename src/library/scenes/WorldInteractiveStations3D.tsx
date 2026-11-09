import { useEffect, useMemo, useState } from 'react';
import { useCursor } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import type { LibraryMaterialPalette } from '../resources/useLibraryMaterials';
import {
  createProjectExhibitionScreenTexture,
  createStationPlaqueTexture,
} from '../resources/proceduralSignage';
import { WORLD_STATIONS_3D, type WorldStation3D } from '../data/worldStations';
import { useLibraryStore } from '../state/useLibraryStore';
import { PROFILE_IDENTITY } from '../../data/portfolioData';

interface WorldInteractiveStations3DProps {
  materials: LibraryMaterialPalette;
}

const noRaycast = () => null;

function ProjectShrineStation({
  station,
  materials,
  isInspected,
  enableShadows,
  onSelect,
  onHover,
}: {
  station: WorldStation3D;
  materials: LibraryMaterialPalette;
  isInspected: boolean;
  enableShadows: boolean;
  onSelect: (id: string) => void;
  onHover: (label: string | null) => void;
}) {
  const project = station.project!;
  const visualIdx = useLibraryStore(
    (s) => s.projectVisualIndex[project.id] ?? 0
  );
  const [hovered, setHovered] = useState(false);

  const screenTexture = useMemo(
    () => createProjectExhibitionScreenTexture(project, visualIdx, 16),
    [project, visualIdx]
  );

  useEffect(() => {
    return () => {
      screenTexture.dispose();
    };
  }, [screenTexture]);

  const active = hovered || isInspected;

  return (
    <group position={station.position} rotation={[0, station.rotationY, 0]}>
      {/* Two-tier Stepped Temple Plinth */}
      <mesh
        position={[0, 0.14, 0]}
        material={materials.limestoneMonolith}
        castShadow={enableShadows}
        receiveShadow={enableShadows}
        raycast={noRaycast}
      >
        <boxGeometry args={[4.85, 0.28, 1.15]} />
      </mesh>
      <mesh
        position={[0, 0.4, -0.04]}
        material={materials.walnutMillwork}
        castShadow={enableShadows}
        raycast={noRaycast}
      >
        <boxGeometry args={[4.48, 0.26, 0.88]} />
      </mesh>

      {/* Twin Flanking Bronze Pilasters + Crowning Temple Cornice */}
      <mesh
        position={[-2.18, 2.22, -0.04]}
        material={materials.burnishedBronze}
        castShadow={enableShadows}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.2, 3.42, 0.28]} />
      </mesh>
      <mesh
        position={[2.18, 2.22, -0.04]}
        material={materials.burnishedBronze}
        castShadow={enableShadows}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.2, 3.42, 0.28]} />
      </mesh>
      <mesh
        position={[0, 3.98, -0.02]}
        material={materials.limestoneMonolith}
        castShadow={enableShadows}
        raycast={noRaycast}
      >
        <boxGeometry args={[4.76, 0.26, 0.42]} />
      </mesh>
      <mesh
        position={[0, 3.82, 0.02]}
        material={materials.brushedBrass}
        raycast={noRaycast}
      >
        <boxGeometry args={[4.52, 0.055, 0.3]} />
      </mesh>

      {/* Recessed Walnut Backboard + Burnished Bronze Screen Bezel */}
      <mesh
        position={[0, 2.18, -0.14]}
        material={materials.walnutMillwork}
        raycast={noRaycast}
      >
        <boxGeometry args={[4.26, 3.16, 0.14]} />
      </mesh>
      <mesh
        position={[0, 2.18, -0.03]}
        material={materials.burnishedBronze}
        raycast={noRaycast}
      >
        <boxGeometry args={[4.12, 2.64, 0.1]} />
      </mesh>

      {/* Gallery Overhead Light Bar */}
      <mesh position={[0, 3.6, 0.08]} raycast={noRaycast}>
        <boxGeometry args={[3.95, 0.05, 0.08]} />
        <meshBasicMaterial color={active ? '#ffffff' : '#d8dce3'} />
      </mesh>

      {/* TRUE 2K (2048×1280) Interactive Backlit 3D Shrine Screen */}
      <mesh
        position={[0, 2.18, 0.035]}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          onHover(`${station.code} — ${station.title}`);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          if (e.delta > 5) return;
          e.stopPropagation();
          onSelect(station.id);
        }}
      >
        <planeGeometry args={[3.96, 2.48]} />
        <meshBasicMaterial map={screenTexture} toneMapped={false} />
      </mesh>

      {active && (
        <mesh position={[0, 2.18, 0.026]} raycast={noRaycast}>
          <planeGeometry args={[4.04, 2.56]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
    </group>
  );
}

function TempleSteleStation({
  station,
  materials,
  isInspected,
  enableShadows,
  onSelect,
  onHover,
}: {
  station: WorldStation3D;
  materials: LibraryMaterialPalette;
  isInspected: boolean;
  enableShadows: boolean;
  onSelect: (id: string) => void;
  onHover: (label: string | null) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const plaqueTexture = useMemo(() => {
    let summary = '';
    let tags: string[] | undefined;
    let stepIndex: number | undefined;
    let stepTotal: number | undefined;
    let ctaLabel = 'Cliquer sur la stèle pour s’approcher & lire →';

    if (station.kind === 'identity') {
      summary = PROFILE_IDENTITY.heroSummary;
      tags = ['INP-HB · ECS', 'Audit financier', 'Solutions web'];
      ctaLabel = 'Inspecter mon profil & télécharger le CV →';
    } else if (station.milestone) {
      summary = station.milestone.summary;
      tags = station.milestone.toolsOrContext;
      stepIndex = Math.max(0, parseInt(station.milestone.order, 10) - 1);
      stepTotal = 6;
    } else if (station.skill) {
      summary = station.skill.summary;
      tags = station.skill.toolsContext;
    } else if (station.methodStep) {
      summary = station.methodStep.objective;
      tags = [station.methodStep.realExample.projectOrContext];
      stepIndex = Math.max(0, parseInt(station.methodStep.step, 10) - 1);
      stepTotal = 6;
    } else if (station.kind === 'contact') {
      summary = PROFILE_IDENTITY.contacts.lead;
      tags = ['Email direct', 'LinkedIn', 'GitHub', 'CV PDF'];
      ctaLabel = 'Ouvrir mes coordonnées & télécharger le CV →';
    }

    return createStationPlaqueTexture({
      code: station.code,
      badge: station.badge,
      title: station.title,
      subtitle: station.subtitle,
      summary,
      tags,
      stepIndex,
      stepTotal,
      ctaLabel,
      anisotropy: 16,
    });
  }, [station]);

  useEffect(() => {
    return () => {
      plaqueTexture.dispose();
    };
  }, [plaqueTexture]);

  const active = hovered || isInspected;
  const isWideAltar = station.kind === 'identity' || station.kind === 'contact';
  const width = isWideAltar ? 2.08 : 1.52;
  const plaqueH = isWideAltar ? 1.24 : 1.06;

  return (
    <group position={station.position} rotation={[0, station.rotationY, 0]}>
      {/* Stepped Stone Foundation */}
      <mesh
        position={[0, 0.11, 0]}
        material={materials.limestoneMonolith}
        castShadow={enableShadows}
        receiveShadow={enableShadows}
        raycast={noRaycast}
      >
        <boxGeometry args={[width * 1.08, 0.22, 0.78]} />
      </mesh>

      {/* Sculpted Pedestal Body */}
      <mesh
        position={[0, 0.64, 0]}
        material={
          station.kind === 'skill' || isWideAltar
            ? materials.walnutMillwork
            : materials.limestoneMonolith
        }
        castShadow={enableShadows}
        receiveShadow={enableShadows}
        raycast={noRaycast}
      >
        <boxGeometry args={[width * 0.86, 0.88, 0.56]} />
      </mesh>

      {/* Brushed Gold Molding Collar */}
      <mesh
        position={[0, 1.1, 0]}
        material={materials.brushedBrass}
        raycast={noRaycast}
      >
        <boxGeometry args={[width * 0.94, 0.05, 0.64]} />
      </mesh>

      {/* Monumental Bronze & Stone Stele Frame + Crowning Cap */}
      <mesh
        position={[0, 1.68, -0.06]}
        material={materials.burnishedBronze}
        castShadow={enableShadows}
        raycast={noRaycast}
      >
        <boxGeometry args={[width + 0.12, plaqueH + 0.12, 0.11]} />
      </mesh>
      <mesh
        position={[0, 1.68 + plaqueH * 0.5 + 0.12, -0.04]}
        material={materials.limestoneMonolith}
        castShadow={enableShadows}
        raycast={noRaycast}
      >
        <boxGeometry args={[width + 0.24, 0.14, 0.22]} />
      </mesh>

      {/* Museum Top Light Bar */}
      <mesh position={[0, 1.68 + plaqueH * 0.5 + 0.03, 0.03]} raycast={noRaycast}>
        <boxGeometry args={[width * 0.92, 0.036, 0.06]} />
        <meshBasicMaterial color={active ? '#ffffff' : '#d8dce3'} />
      </mesh>

      {/* High-Definition Engraved Temple Tablet */}
      <mesh
        position={[0, 1.68, 0.005]}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          onHover(`${station.code} — ${station.title}`);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          if (e.delta > 5) return;
          e.stopPropagation();
          onSelect(station.id);
        }}
      >
        <planeGeometry args={[width, plaqueH]} />
        <meshBasicMaterial map={plaqueTexture} toneMapped={false} />
      </mesh>

      {active && (
        <mesh position={[0, 1.68, -0.003]} raycast={noRaycast}>
          <planeGeometry args={[width + 0.06, plaqueH + 0.06]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
    </group>
  );
}

export function WorldInteractiveStations3D({
  materials,
}: WorldInteractiveStations3DProps) {
  const deviceTier = useLibraryStore((s) => s.deviceTier);
  const inspectedStationId = useLibraryStore((s) => s.inspectedStationId);
  const hoveredStationLabel = useLibraryStore((s) => s.hoveredStationLabel);
  const inspectStation = useLibraryStore((s) => s.inspectStation);
  const setHoveredStationLabel = useLibraryStore((s) => s.setHoveredStationLabel);

  useCursor(Boolean(hoveredStationLabel), 'pointer');
  const enableShadows = deviceTier !== 'mobile';

  return (
    <group name="TempleInteractiveStations-24">
      {WORLD_STATIONS_3D.map((station) =>
        station.kind === 'project' ? (
          <ProjectShrineStation
            key={station.id}
            station={station}
            materials={materials}
            isInspected={inspectedStationId === station.id}
            enableShadows={enableShadows}
            onSelect={inspectStation}
            onHover={setHoveredStationLabel}
          />
        ) : (
          <TempleSteleStation
            key={station.id}
            station={station}
            materials={materials}
            isInspected={inspectedStationId === station.id}
            enableShadows={enableShadows}
            onSelect={inspectStation}
            onHover={setHoveredStationLabel}
          />
        )
      )}
    </group>
  );
}
