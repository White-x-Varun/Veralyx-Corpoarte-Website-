import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import { SettingsProvider } from '@/context/SettingsContext';

function renderNavbar() {
  return render(
    <HelmetProvider>
      <SettingsProvider>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </SettingsProvider>
    </HelmetProvider>,
  );
}

describe('Navbar', () => {
  it('renders navigation links', async () => {
    renderNavbar();

    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^home$/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: /services/i })).toHaveAttribute('href', '/services');
    expect(screen.getByRole('link', { name: /^work$/i })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('link', { name: /careers/i })).toHaveAttribute('href', '/careers');
    expect(screen.getByRole('link', { name: /insights/i })).toHaveAttribute('href', '/blog');
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact');
  });
});
