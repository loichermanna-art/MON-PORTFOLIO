import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';
import {
  libraryMotionState,
  useLibraryStore,
} from '../library/state/useLibraryStore';

describe('Parcours 3D Immersif Complet (6 Salles Traversables & 24 Stations 3D)', () => {
  beforeEach(() => {
    libraryMotionState.camX = 0;
    libraryMotionState.camY = 1.66;
    libraryMotionState.camZ = 8.2;
    libraryMotionState.yaw = 0;
    libraryMotionState.pitch = 0;
    libraryMotionState.glideActive = false;
    useLibraryStore.setState({
      activeRoomIndex: 0,
      inspectedStationId: null,
      hoveredStationLabel: null,
      hasStartedWalking: false,
      dossierOpen: false,
      dossierTab: 'overview',
      selectedProjectId: null,
      selectedCollectionId: 'finance',
      reducedMotion: false,
      manualReducedMotion: null,
    });
  });

  it('Cycle 1 : affiche l’accueil spatial, les 6 salles navigables en 3D, le pavé de marche et le CV officiel', () => {
    const { container } = render(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /Loïc\s*AKANDA/i
    );
    expect(
      screen.getByText(
        /Étudiant en 3e année du cycle ingénieur en Finance à l’INP-HB/i
      )
    ).toBeInTheDocument();

    const spacesNav = screen.getByRole('navigation', {
      name: /Navigation spatiale dans les six salles du parcours 3D/i,
    });
    expect(within(spacesNav).getAllByRole('button')).toHaveLength(6);

    expect(
      screen.getByRole('button', { name: /Avancer dans l’espace 3D/i })
    ).toBeInTheDocument();

    const cvLinks = screen.getAllByRole('link', { name: /CV/i });
    expect(
      cvLinks.some((l) => l.getAttribute('href') === '/cv/CV-Loic-AKANDA.pdf')
    ).toBe(true);

    expect(
      container.querySelector('.library-static-fallback img')
    ).toHaveAttribute('src', '/scenes/library-entrance-fallback.jpg');
  });

  it('Cycle 2 : déplace réellement le visiteur de salle en salle en 3D (z = +8.2 -> -98.4) sans ouvrir de modale 2D forcée', () => {
    render(<App />);

    // Départ vers Salle 02 (Le Parcours)
    fireEvent.click(
      screen.getByRole('button', { name: /Commencer le parcours 3D/i })
    );
    expect(useLibraryStore.getState().activeRoomIndex).toBe(1);
    expect(libraryMotionState.glideTargetZ).toBeCloseTo(-2.6, 1);
    expect(screen.queryByRole('dialog')).toBeNull();

    // Déplacement vers Salle 04 (Les Réalisations — z = -51.4)
    const spacesNav = screen.getByRole('navigation', {
      name: /Navigation spatiale dans les six salles du parcours 3D/i,
    });
    fireEvent.click(
      within(spacesNav).getByRole('button', { name: /04\s*Les Réalisations/i })
    );
    expect(useLibraryStore.getState().activeRoomIndex).toBe(3);
    expect(libraryMotionState.glideTargetZ).toBeCloseTo(-51.4, 1);
    expect(screen.queryByRole('dialog')).toBeNull();

    // Avancée Salle suivante -> Salle 05 (La Méthode) puis Salle 06 (Le Belvédère)
    fireEvent.click(screen.getByRole('button', { name: /Salle suiv\./i }));
    expect(useLibraryStore.getState().activeRoomIndex).toBe(4);
    fireEvent.click(screen.getByRole('button', { name: /Salle suiv\./i }));
    expect(useLibraryStore.getState().activeRoomIndex).toBe(5);
    expect(libraryMotionState.glideTargetZ).toBeCloseTo(-98.4, 1);

    // Marche libre vers un point au sol (clic au sol)
    act(() => {
      useLibraryStore.getState().walkToFloorPoint(1.2, -34.0);
    });
    expect(libraryMotionState.glideTargetZ).toBeCloseTo(-34.0, 1);
  });

  it('Cycle 3 : inspecte en 3D les stèles des stages (IACG, Drone Groupe CI), les 6 pôles sans % et les 4 projets réels (LAURA HOUSE Wave manuel + GYM OS SPORT SVG)', () => {
    render(<App />);

    // Inspection stèle stage IACG
    act(() => {
      useLibraryStore.getState().inspectStation('station-milestone-stage-iacg');
    });
    expect(
      screen.getByRole('region', { name: /Inspection 3D/i })
    ).toHaveTextContent(/Sage 100/i);

    // Inspection stèle stage Drone Groupe CI
    act(() => {
      useLibraryStore
        .getState()
        .inspectStation('station-milestone-stage-drone-groupe');
    });
    expect(
      screen.getByRole('region', { name: /Inspection 3D/i })
    ).toHaveTextContent(/tableau de bord/i);

    // Inspection d’un pôle de compétence : zéro jauge en %
    act(() => {
      useLibraryStore.getState().inspectStation('station-skill-audit');
    });
    const skillPanel = screen.getByRole('region', {
      name: /Inspection 3D/i,
    });
    expect(skillPanel.textContent).not.toMatch(/\b\d{1,3}\s*%/);

    // Inspection écran géant 3D LAURA HOUSE : workflow Wave manuel + QR unique strict
    act(() => {
      useLibraryStore.getState().inspectStation('station-project-laura-house');
    });
    expect(
      screen.getByText(/lien marchand Wave de la cliente/i)
    ).toBeInTheDocument();

    // Inspection écran géant 3D GYM OS SPORT : vraie planche SVG biomécanique
    act(() => {
      useLibraryStore.getState().inspectStation('station-project-gym-os-sport');
    });
    expect(
      screen.getByAltText(
        /Décomposition biomécanique en 4 phases du Squat à la barre/i
      )
    ).toHaveAttribute('src', '/projects/gym-os-biomechanics.svg');

    // Retour à la marche libre
    fireEvent.click(
      screen.getByRole('button', { name: /Continuer la marche/i })
    );
    expect(useLibraryStore.getState().inspectedStationId).toBeNull();
  });

  it('Cycle 4 : valide le mode Mouvement Réduit et le Mode Lecture accessible (fermeture Escape)', () => {
    render(<App />);

    const motionBtn = screen.getByRole('button', { name: /Mouvement :/i });
    fireEvent.click(motionBtn);
    expect(useLibraryStore.getState().reducedMotion).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: /Mode Lecture/i }));
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
