import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('Portfolio cinématique', () => {
  it('permet de passer l’introduction et la mémorise pour la session', () => {
    window.history.replaceState(null, '', '/');
    window.sessionStorage.removeItem('portfolio-intro-seen');
    const view = render(<App />);
    expect(screen.getByLabelText('Introduction au portfolio de Loïc AKANDA')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /passer l’introduction/i }));
    expect(screen.queryByLabelText('Introduction au portfolio de Loïc AKANDA')).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem('portfolio-intro-seen')).toBe('1');
    view.unmount();
    render(<App />);
    expect(screen.queryByLabelText('Introduction au portfolio de Loïc AKANDA')).not.toBeInTheDocument();
  });

  it('présente les six sections, les projets et les contacts sans CV', () => {
    const { container } = render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('La rigueur');
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' });
    expect(within(nav).getByRole('link', { name: 'Projets' })).toHaveAttribute('href', '#projets');
    for (const id of ['accueil', 'parcours', 'expertise', 'projets', 'methode', 'contact']) {
      expect(container.querySelector(`#${id}`)).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: 'Afficher SassySkin' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Afficher LAURA HOUSE' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Afficher GYM OS SPORT' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Afficher CV Pro Express' })).toBeInTheDocument();
    expect(container.querySelector('.motion-project-list')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.project-cylinder__slice').length).toBe(20);
    expect(screen.queryByRole('link', { name: /télécharger.*cv/i })).not.toBeInTheDocument();
    expect(container.querySelector('a[href^="mailto:"]')).toHaveAttribute('href', 'mailto:loichermanna@gmail.com');
    const menu = screen.getByRole('button', { name: 'Ouvrir le menu' });
    fireEvent.click(menu);
    expect(screen.getByRole('button', { name: 'Fermer le menu' })).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(within(nav).getByRole('link', { name: 'Projets' }));
    expect(screen.getByRole('button', { name: 'Ouvrir le menu' })).toHaveAttribute('aria-expanded', 'false');
  });
});
