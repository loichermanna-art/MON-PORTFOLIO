import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';
import {
  libraryMotionState,
  useLibraryStore,
} from '../library/state/useLibraryStore';

describe('The Infinite Library — Prototype Phase 4 (Espace 01 : L’Entrée) & Intégrité Éditoriale', () => {
  beforeEach(() => {
    libraryMotionState.targetProgress = 0;
    libraryMotionState.currentProgress = 0;
    useLibraryStore.setState({
      portalPhase: 'vestibule',
      doorHovered: false,
      dossierOpen: false,
      dossierTab: 'overview',
      selectedProjectId: null,
      selectedCollectionId: 'finance',
      reducedMotion: false,
      manualReducedMotion: null,
    });
  });

  it('Cycle 1 : valide l’Espace 01 — L’Entrée (identité Loïc AKANDA, 3e année cycle ingénieur Finance INP-HB, CTA portail, CV PDF, navigation 6 espaces et fallback architectural)', () => {
    const { container } = render(<App />);

    expect(
      screen.getByText(/Aller directement à la présentation principale/i)
    ).toBeInTheDocument();

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent(/Loïc\s*AKANDA/i);

    expect(
      screen.getByText(
        /Étudiant en 3e année du cycle ingénieur en Finance à l’INP-HB/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Entrer dans la bibliothèque/i })
    ).toBeInTheDocument();

    const cvLinks = screen.getAllByRole('link', { name: /CV/i });
    expect(
      cvLinks.some(
        (link) => link.getAttribute('href') === '/cv/CV-Loic-AKANDA.pdf'
      )
    ).toBe(true);

    const spacesNav = screen.getByRole('navigation', {
      name: /Plan des six espaces de la bibliothèque/i,
    });
    expect(within(spacesNav).getAllByRole('button')).toHaveLength(6);

    // En environnement JSDOM sans WebGL, le repli architectural statique est rendu proprement
    expect(
      container.querySelector('.library-static-fallback img')
    ).toHaveAttribute('src', '/scenes/library-entrance-fallback.jpg');
  });

  it('Cycle 2 : valide le basculement Mouvement Réduit et l’ouverture/fermeture accessible du Catalogue Général (touche Escape)', () => {
    render(<App />);

    const motionBtn = screen.getByRole('button', { name: /Mouvement :/i });
    fireEvent.click(motionBtn);
    expect(useLibraryStore.getState().reducedMotion).toBe(true);
    expect(motionBtn).toHaveAttribute('aria-pressed', 'true');

    // Ouverture directe des 4 projets
    fireEvent.click(
      screen.getByRole('button', { name: /Consulter les 4 projets/i })
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Fermeture clavier par Escape
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('Cycle 3 : valide l’exactitude des Archives (stages Drone Groupe CI & IACG) et des 6 Collections de compétences sans aucune jauge en %', () => {
    render(<App />);

    // Accès à l’Espace 02 (Les Archives)
    fireEvent.click(screen.getByRole('button', { name: /02\s*Les Archives/i }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getAllByText(/DRONE GROUPE CI/i).length).toBeGreaterThanOrEqual(1);
    expect(within(dialog).getAllByText(/IACG/i).length).toBeGreaterThanOrEqual(1);

    // Accès à l’Espace 03 (Les Rayonnages — 6 collections exactes)
    fireEvent.click(
      within(dialog).getByRole('tab', {
        name: /03\s*Les Rayonnages/i,
      })
    );

    for (const collectionTitle of [
      'Finance',
      'Comptabilité',
      'Audit',
      'Analyse financière',
      'Outils numériques',
      'Création et réalisation de projets digitaux',
    ]) {
      expect(
        within(dialog).getByRole('button', {
          name: new RegExp(collectionTitle, 'i'),
        })
      ).toBeInTheDocument();
    }

    // Zéro pourcentage arbitraire inventé
    expect(dialog.textContent).not.toMatch(/\b\d{1,3}\s*%/);
  });

  it('Cycle 4 : valide les 4 Projets réels (dont LAURA HOUSE Wave manuel + QR unique et GYM OS SPORT SVG), les 6 Méthodes et les vraies coordonnées du Belvédère', () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', { name: /04\s*La Collection Privée/i })
    );
    const dialog = screen.getByRole('dialog');

    // Sélection de LAURA HOUSE et vérification stricte du workflow réel
    fireEvent.click(
      within(dialog).getByRole('button', { name: /03\s*LAURA HOUSE/i })
    );
    expect(
      within(dialog).getByText(/lien marchand Wave de la cliente/i)
    ).toBeInTheDocument();

    // Sélection de GYM OS SPORT et vérification de la vraie planche SVG biomécanique
    fireEvent.click(
      within(dialog).getByRole('button', { name: /04\s*GYM OS SPORT/i })
    );
    expect(
      within(dialog).getByAltText(
        /Décomposition biomécanique en 4 phases du Squat à la barre/i
      )
    ).toHaveAttribute('src', '/projects/gym-os-biomechanics.svg');

    // Espace 05 — La Salle des Méthodes (6 étapes)
    fireEvent.click(
      within(dialog).getByRole('tab', { name: /05\s*La Salle des Méthodes/i })
    );
    for (const stepTitle of [
      'Comprendre',
      'Analyser',
      'Concevoir',
      'Réaliser',
      'Tester',
      'Améliorer',
    ]) {
      expect(
        within(dialog).getByRole('heading', { name: stepTitle })
      ).toBeInTheDocument();
    }

    // Espace 06 — Le Belvédère (coordonnées vérifiées)
    fireEvent.click(
      within(dialog).getByRole('tab', { name: /06\s*Le Belvédère/i })
    );
    expect(
      within(dialog).getByText('loichermanna@gmail.com')
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText('linkedin.com/in/loic-akanda-assi')
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText('github.com/loichermanna-art')
    ).toBeInTheDocument();
  });
});
