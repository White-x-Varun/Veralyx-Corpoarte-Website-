import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from '@/pages/Home';
import { SettingsProvider } from '@/context/SettingsContext';

vi.mock('@/api/client', () => ({
  default: {
    get: vi.fn().mockRejectedValue(new Error('offline')),
  },
}));

function renderHome() {
  return render(
    <HelmetProvider>
      <SettingsProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </SettingsProvider>
    </HelmetProvider>,
  );
}

describe('Home', () => {
  it('renders hero section', async () => {
    renderHome();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /marketing is an investment/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/strategy turns it into commercial value/i)).toBeInTheDocument();
    expect(screen.getByText(/revenue contribution/i)).toBeInTheDocument();
    expect(screen.getAllByText(/marketing and sales in sync/i).length).toBeGreaterThan(0);
  });
});
