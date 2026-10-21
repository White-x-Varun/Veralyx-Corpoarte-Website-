import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Contact from '@/pages/Contact';
import { SettingsProvider } from '@/context/SettingsContext';
import { ToastProvider } from '@/context/ToastContext';

vi.mock('@/api/client', () => ({
  default: {
    get: vi.fn().mockRejectedValue(new Error('offline')),
    post: vi.fn(),
  },
}));

function renderContact() {
  return render(
    <HelmetProvider>
      <SettingsProvider>
        <ToastProvider>
          <MemoryRouter>
            <Contact />
          </MemoryRouter>
        </ToastProvider>
      </SettingsProvider>
    </HelmetProvider>,
  );
}

describe('Contact form', () => {
  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup();
    renderContact();

    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/subject must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
    });
  });
});
