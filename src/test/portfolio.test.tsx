import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../App';
import {
  motionStore,
  setReducedMotionPreference,
  setScrollProgress,
} from '../motion/motionStore';

describe('Portfolio Loïc AKANDA — Phase 7 Complet & Phase 8 QA Multi-cycles', () => {
  it('Cycle 1 : rend les 6 scènes narratives sémantiques, un H1 unique et le repli WebGL sans erreur', () => {
    const { container } = render(<App />);

    // Lien d'évitement clavier
    expect(screen.getByText(/Aller au contenu principal/i)).toBeInTheDocument();

    // H1 unique
    const h1List = screen.getAllByRole('heading', { level: 1 });
    expect(h1List).toHaveLength(1);
    expect(h1List[0]).toHaveTextContent('Loïc AKANDA');

    // Présence effective des 6 sections landmarks par ID
    for (const id of ['hero', 'about', 'expertise', 'projects', 'process', 'contact']) {
      expect(container.querySelector(`section#${id}`)).not.toBeNull();
    }

    // Repli WebGL propre dans JSDOM
    expect(screen.getByTestId('webgl-fallback')).toBeInTheDocument();
  });

  it('Cycle 2 : garantit l’intégrité documentaire (INP-HB, 3 projets prioritaires, 0 % fictif, badges [À CONFIRMER])', () => {
    const { container } = render(<App />);

    // Projets prioritaires présents
    expect(screen.getByRole('heading', { name: 'LAURA HOUSE' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'SassySkin' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'EtuCo' })).toBeInTheDocument();

    // Aucune jauge de compétence en pourcentage inventée dans la section Expertise
    const expertiseSection = container.querySelector('#expertise');
    expect(expertiseSection).not.toBeNull();
    expect(expertiseSection?.textContent).not.toMatch(/\b\d{1,3}\s*%/);

    // Les 6 étapes de la méthode Process sont présentes
    expect(screen.getByText('Comprendre le problème')).toBeInTheDocument();
    expect(screen.getByText('Analyser les besoins')).toBeInTheDocument();
    expect(screen.getByText('Structurer une solution')).toBeInTheDocument();
    expect(screen.getByText('Concevoir')).toBeInTheDocument();
    expect(screen.getByText('Développer ou exécuter')).toBeInTheDocument();
    expect(screen.getByText('Tester et améliorer')).toBeInTheDocument();

    // Marqueurs honnêtes [À CONFIRMER] présents pour les données manquantes
    expect(screen.getAllByText(/À CONFIRMER/i).length).toBeGreaterThanOrEqual(4);
  });

  it('Cycle 3 : ouvre et ferme au clavier (Échap) le tiroir accessible d’étude de cas projet et le menu mobile', () => {
    render(<App />);

    // Ouverture du tiroir LAURA HOUSE
    const inspectButtons = screen.getAllByRole('button', {
      name: /Inspecter l’étude de cas/i,
    });
    expect(inspectButtons).toHaveLength(3);
    fireEvent.click(inspectButtons[0]);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(
      within(dialog).getByRole('heading', { level: 2, name: 'LAURA HOUSE' })
    ).toBeInTheDocument();
    expect(within(dialog).getByRole('img')).toBeInTheDocument();

    // Test du piège de focus Tab / Shift+Tab à l'intérieur de la modale
    const closeDialogBtn = within(dialog).getByRole('button', { name: /Fermer \(Échap\)/i });
    expect(document.activeElement).toBe(closeDialogBtn);
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(dialog.contains(document.activeElement)).toBe(true);

    // Fermeture clavier par touche Escape
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();

    // Menu mobile accessible au clavier
    const menuBtn = screen.getByRole('button', { name: /Menu/i });
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(menuBtn);
    expect(menuBtn).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('Cycle 4 : assure la réversibilité complète du scroll (01 -> 06 -> 01) et le mode prefers-reduced-motion', () => {
    const forwardStops: Array<[number, number]> = [
      [0.0, 0],
      [0.22, 1],
      [0.4, 2],
      [0.6, 3],
      [0.82, 4],
      [0.96, 5],
    ];

    act(() => {
      for (const [progress, expectedScene] of forwardStops) {
        setScrollProgress(progress);
        expect(motionStore.activeScene).toBe(expectedScene);
      }
    });
    expect(motionStore.activeProcessStep).toBe(5);

    // Remontée rapide puis lente jusqu'en haut (réversibilité totale)
    act(() => {
      for (const [progress, expectedScene] of [...forwardStops].reverse()) {
        setScrollProgress(progress);
        expect(motionStore.activeScene).toBe(expectedScene);
      }
    });
    expect(motionStore.activeProcessStep).toBe(0);

    // Contrôle du bouton Mouvement réduit dans l'interface
    render(<App />);
    const motionBtn = screen.getByRole('button', { name: /Cinéma 3D|Mouvement réduit/i });
    motionStore.pointerX = 0.75;
    fireEvent.click(motionBtn);
    expect(motionStore.reducedMotion).toBe(true);
    expect(motionStore.pointerX).toBe(0);

    act(() => {
      setReducedMotionPreference(false);
    });
  });

  it('Cycle 5 : conserve l’accès aux planches de maquettes Phase 4 (Desktop 1440px & Mobile 390px)', () => {
    render(<App />);

    const openMockupsBtn = screen.getByRole('button', {
      name: /Consulter les planches maquettes \(Phase 4\)/i,
    });
    fireEvent.click(openMockupsBtn);

    expect(screen.getByText(/Scène 01 — INTRODUCTION \/ HERO/i)).toBeInTheDocument();
    expect(screen.getByText(/Scène 06 — CONTACT \/ BELVÉDÈRE/i)).toBeInTheDocument();

    const mobileToggle = screen.getByRole('button', { name: /Mobile 390px/i });
    fireEvent.click(mobileToggle);
    expect(mobileToggle).toHaveAttribute('aria-pressed', 'true');

    const backBtn = screen.getByRole('button', {
      name: /Retour à l’expérience 3D complète/i,
    });
    fireEvent.click(backBtn);
    expect(screen.getByRole('heading', { level: 1, name: 'Loïc AKANDA' })).toBeInTheDocument();
  });
});
