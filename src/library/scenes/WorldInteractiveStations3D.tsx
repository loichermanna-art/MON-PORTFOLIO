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

function ProjectAlcoveStation({
  station,
  materials,
  isInspected,
  onSelect,
  onHover,
}: {
  station: WorldStation3D;
  materials: LibraryMaterialPalette;
  isInspected: boolean;
  onSelect: (id: string) => void;
  onHover: (label: string | null) => void;
}) {
  const project = station.project!;
  const visualIdx = useLibraryStore(
    (s) => s.projectVisualIndex[project.id] ?? 0
  );
  const [hovered, setHovered] = useState(false);

  const screenTexture = useMemo(
    () => createProjectExhibitionScreenTexture(project, visualIdx, 8),
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
      {/* Sculpted Limestone Plinth */}
      <mesh
        position={[0, 0.24, 0]}
        material={materials.limestoneMonolith}
        raycast={noRaycast}
      >
        <boxGeometry args={[4.35, 0.48, 0.85]} />
      </mesh>
      {/* Walnut Architectural Backing Frame */}
      <mesh
        position={[0, 2.05, -0.14]}
        material={materials.walnutMillwork}
        raycast={noRaycast}
      >
        <boxGeometry args={[4.28, 3.18, 0.16]} />
      </mesh>
      {/* Burnished Bronze Outer Bezel */}
      <mesh
        position={[0, 2.12, -0.02]}
        material={materials.burnishedBronze}
        raycast={noRaycast}
      >
        <boxGeometry args={[4.06, 2.58, 0.12]} />
      </mesh>

      {/* Top Illuminated Accent Bar */}
      <mesh position={[0, 3.48, 0.04]} raycast={noRaycast}>
        <boxGeometry args={[3.9, 0.055, 0.08]} />
        <meshBasicMaterial color={active ? '#76A9E8' : '#f4bf7c'} />
      </mesh>

      {/* Giant Interactive Backlit 3D Exhibition Screen (3.92m x 2.45m) */}
      <mesh
        position={[0, 2.12, 0.055]}
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
        <planeGeometry args={[3.92, 2.45]} />
        <meshBasicMaterial map={screenTexture} toneMapped={false} />
      </mesh>

      {/* Active Brass Selection Outline */}
      {active && (
        <mesh position={[0, 2.12, 0.048]} raycast={noRaycast}>
          <planeGeometry args={[4.02, 2.55]} />
          <meshBasicMaterial color="#76A9E8" />
        </mesh>
      )}
    </group>
  );
}

function StandardArchitecturalStation({
  station,
  materials,
  isInspected,
  onSelect,
  onHover,
}: {
  station: WorldStation3D;
  materials: LibraryMaterialPalette;
  isInspected: boolean;
  onSelect: (id: string) => void;
  onHover: (label: string | null) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const plaqueTexture = useMemo(() => {
    let summary = '';
    let ctaLabel = 'Cliquer pour s’approcher & inspecter →';
    if (station.kind === 'identity') {
      summary = PROFILE_IDENTITY.heroSummary;
      ctaLabel = 'Inspecter mon profil & télécharger le CV →';
    } else if (station.milestone) {
      summary = station.milestone.summary;
    } else if (station.skill) {
      summary = station.skill.summary;
    } else if (station.methodStep) {
      summary = station.methodStep.objective;
    } else if (station.kind === 'contact') {
      summary = PROFILE_IDENTITY.contacts.lead;
      ctaLabel = 'Ouvrir mes coordonnées & télécharger le CV →';
    }

    return createStationPlaqueTexture({
      code: station.code,
      badge: station.badge,
      title: station.title,
      subtitle: station.subtitle,
      summary,
      ctaLabel,
      anisotropy: 4,
    });
  }, [station]);

  useEffect(() => {
    return () => {
      plaqueTexture.dispose();
    };
  }, [plaqueTexture]);

  const active = hovered || isInspected;
  const isWideDesk = station.kind === 'identity' || station.kind === 'contact';
  const width = isWideDesk ? 1.95 : 1.38;
  const plaqueH = isWideDesk ? 1.12 : 0.96;

  return (
    <group position={station.position} rotation={[0, station.rotationY, 0]}>
      {/* Stone & Walnut Pedestal Base */}
      <mesh
        position={[0, 0.56, 0]}
        material={
          station.kind === 'skill' || isWideDesk
            ? materials.walnutMillwork
            : materials.limestoneMonolith
        }
        raycast={noRaycast}
      >
        <boxGeometry args={[width * 0.82, 1.12, 0.58]} />
      </mesh>

      {/* Brushed Brass Collar */}
      <mesh
        position={[0, 1.14, 0]}
        material={materials.brushedBrass}
        raycast={noRaycast}
      >
        <boxGeometry args={[width * 0.88, 0.045, 0.64]} />
      </mesh>

      {/* Vertical Architectural Backing Totem for Skills & Milestones */}
      <mesh
        position={[0, 1.56, -0.06]}
        material={materials.burnishedBronze}
        raycast={noRaycast}
      >
        <boxGeometry args={[width + 0.08, plaqueH + 0.08, 0.09]} />
      </mesh>

      {/* Top Museum Light Strip */}
      <mesh position={[0, 1.56 + plaqueH * 0.5 + 0.07, 0.02]} raycast={noRaycast}>
        <boxGeometry args={[width * 0.92, 0.038, 0.06]} />
        <meshBasicMaterial color={active ? '#76A9E8' : '#f4bf7c'} />
      </mesh>

      {/* Interactive Engraved Plaque */}
      <mesh
        position={[0, 1.56, 0.002]}
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
        <mesh position={[0, 1.56, -0.005]} raycast={noRaycast}>
          <planeGeometry args={[width + 0.06, plaqueH + 0.06]} />
          <meshBasicMaterial color="#76A9E8" />
        </mesh>
      )}
    </group>
  );
}

export function WorldInteractiveStations3D({
  materials,
}: WorldInteractiveStations3DProps) {
  const inspectedStationId = useLibraryStore((s) => s.inspectedStationId);
  const hoveredStationLabel = useLibraryStore((s) => s.hoveredStationLabel);
  const inspectStation = useLibraryStore((s) => s.inspectStation);
  const setHoveredStationLabel = useLibraryStore((s) => s.setHoveredStationLabel);

  useCursor(Boolean(hoveredStationLabel), 'pointer');

  return (
    <group name="WorldInteractiveStations-24">
      {WORLD_STATIONS_3D.map((station) =>
        station.kind === 'project' ? (
          <ProjectAlcoveStation
            key={station.id}
            station={station}
            materials={materials}
            isInspected={inspectedStationId === station.id}
            onSelect={inspectStation}
            onHover={setHoveredStationLabel}
          />
        ) : (
          <StandardArchitecturalStation
            key={station.id}
            station={station}
            materials={materials}
            isInspected={inspectedStationId === station.id}
            onSelect={inspectStation}
            onHover={setHoveredStationLabel}
          />
        )
      )}
    </group>
  );
}
