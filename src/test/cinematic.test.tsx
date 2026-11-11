import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('Portfolio cinématique', () => {
  it('présente les six sections, les projets et les contacts sans CV', () => {
    const { container } = render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('La rigueur');
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' });
    expect(within(nav).getByRole('link', { name: 'Projets' })).toHaveAttribute('href', '#projets');
    for (const id of ['accueil', 'parcours', 'expertise', 'projets', 'methode', 'contact']) {
      expect(container.querySelector(`#${id}`)).toBeInTheDocument();
    }
    expect(screen.getByRole('heading', { name: 'SassySkin' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'LAURA HOUSE' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'GYM OS SPORT' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /télécharger.*cv/i })).not.toBeInTheDocument();
    expect(container.querySelector('a[href^="mailto:"]')).toHaveAttribute('href', 'mailto:loichermanna@gmail.com');
    const menu = screen.getByRole('button', { name: 'Ouvrir le menu' });
    fireEvent.click(menu);
    expect(screen.getByRole('button', { name: 'Fermer le menu' })).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(within(nav).getByRole('link', { name: 'Projets' }));
    expect(screen.getByRole('button', { name: 'Ouvrir le menu' })).toHaveAttribute('aria-expanded', 'false');
  });
});
