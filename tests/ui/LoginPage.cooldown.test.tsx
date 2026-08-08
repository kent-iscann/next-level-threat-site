/**
 * Resend cooldown, isolated in its own file.
 *
 * VITE_AUTH_RESEND_COOLDOWN is stubbed to 1s BEFORE config.ts is imported, so
 * the countdown elapses in real time. Fake timers were tried first and leaked
 * across tests, hanging every case that ran after them.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { makeFakeSupabase } from './helpers.tsx';

vi.stubEnv('VITE_AUTH_RESEND_COOLDOWN', '1');

const fake = vi.hoisted(() => ({
  current: null as ReturnType<typeof import('./helpers.tsx')['makeFakeSupabase']> | null,
}));

vi.mock('../../src/lib/supabase', () => ({
  get supabase() {
    return fake.current!.client;
  },
}));

const { AuthProvider } = await import('../../src/auth/AuthProvider.tsx');
const { default: LoginPage } = await import('../../src/pages/LoginPage.tsx');
const { AUTH_CODE_LENGTH, RESEND_COOLDOWN_SECONDS } = await import('../../src/config.ts');

const FULL_CODE = '1234567890'.slice(0, AUTH_CODE_LENGTH);

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pro" element={<div>PRO AREA</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  fake.current = makeFakeSupabase();
});

describe('resend cooldown', () => {
  it('is shortened to 1s for this file', () => {
    expect(RESEND_COOLDOWN_SECONDS).toBe(1);
  });

  it('re-enables the button once the countdown reaches zero', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);

    await user.type(await screen.findByLabelText(/email address/i), 'kent@example.com');
    await user.click(screen.getByRole('button', { name: /send code/i }));

    const resend = await screen.findByRole('button', { name: /send a new code/i });
    expect(resend).toBeDisabled();

    await waitFor(() => expect(resend).toBeEnabled(), { timeout: 3000 });
  });

  it('sends a fresh code and clears the previous entry', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);

    await user.type(await screen.findByLabelText(/email address/i), 'kent@example.com');
    await user.click(screen.getByRole('button', { name: /send code/i }));
    await user.type(await screen.findByLabelText(/sign-in code/i), FULL_CODE);

    const resend = screen.getByRole('button', { name: /send a new code/i });
    await waitFor(() => expect(resend).toBeEnabled(), { timeout: 3000 });
    await user.click(resend);

    expect(fake.current!.auth.signInWithOtp).toHaveBeenCalledTimes(2);
    expect(screen.getByLabelText(/sign-in code/i)).toHaveValue('');
    expect(await screen.findByRole('status')).toHaveTextContent(/new code/i);
  });

  it('restarts the cooldown after a resend', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);

    await user.type(await screen.findByLabelText(/email address/i), 'kent@example.com');
    await user.click(screen.getByRole('button', { name: /send code/i }));

    const resend = await screen.findByRole('button', { name: /send a new code/i });
    await waitFor(() => expect(resend).toBeEnabled(), { timeout: 3000 });
    await user.click(resend);

    expect(screen.getByRole('button', { name: /send a new code/i })).toBeDisabled();
  });
});
