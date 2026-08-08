import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { makeFakeSupabase, makeSession } from './helpers.tsx';

const fake = vi.hoisted(() => ({
  current: null as ReturnType<typeof import('./helpers.tsx')['makeFakeSupabase']> | null,
  otpEnabled: false,
}));

vi.mock('../../src/lib/supabase', () => ({
  get supabase() {
    return fake.current!.client;
  },
  get OTP_CODE_ENABLED() {
    return fake.otpEnabled;
  },
}));

const { AuthProvider } = await import('../../src/auth/AuthProvider.tsx');
const { default: LoginPage } = await import('../../src/pages/LoginPage.tsx');

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
  fake.otpEnabled = false;
});

describe('<LoginPage> — sending the link', () => {
  it('renders the email form once loading settles', async () => {
    renderLogin();
    fake.current!.settle(null);
    expect(await screen.findByLabelText(/email address/i)).toBeInTheDocument();
  });

  it('sends a magic link to the entered address', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);

    await user.type(await screen.findByLabelText(/email address/i), 'kent@example.com');
    await user.click(screen.getByRole('button', { name: /send sign-in link/i }));

    expect(fake.current!.auth.signInWithOtp).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'kent@example.com' })
    );
  });

  it('points the redirect at /auth/callback on the current origin', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);

    await user.type(await screen.findByLabelText(/email address/i), 'kent@example.com');
    await user.click(screen.getByRole('button', { name: /send sign-in link/i }));

    const arg = fake.current!.auth.signInWithOtp.mock.calls[0][0];
    expect(arg.options.emailRedirectTo).toBe(`${window.location.origin}/auth/callback`);
  });

  it('trims surrounding whitespace from the address', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);

    await user.type(await screen.findByLabelText(/email address/i), '  kent@example.com  ');
    await user.click(screen.getByRole('button', { name: /send sign-in link/i }));

    expect(fake.current!.auth.signInWithOtp.mock.calls[0][0].email).toBe('kent@example.com');
  });

  it('confirms the address it sent to', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);

    await user.type(await screen.findByLabelText(/email address/i), 'kent@example.com');
    await user.click(screen.getByRole('button', { name: /send sign-in link/i }));

    expect(await screen.findByText(/kent@example.com/)).toBeInTheDocument();
  });

  it('surfaces a send failure without losing the entered address', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);
    fake.current!.auth.signInWithOtp.mockResolvedValueOnce({
      data: {},
      error: new Error('Email rate limit exceeded'),
    });

    await user.type(await screen.findByLabelText(/email address/i), 'kent@example.com');
    await user.click(screen.getByRole('button', { name: /send sign-in link/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/rate limit/i);
    expect(screen.getByLabelText(/email address/i)).toHaveValue('kent@example.com');
  });

  it('lets the user go back and correct the address', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);

    await user.type(await screen.findByLabelText(/email address/i), 'wrong@example.com');
    await user.click(screen.getByRole('button', { name: /send sign-in link/i }));
    await user.click(await screen.findByRole('button', { name: /different email/i }));

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });
});

describe('<LoginPage> — already signed in', () => {
  it('redirects away instead of showing the form', async () => {
    renderLogin();
    fake.current!.settle(makeSession());
    expect(await screen.findByText('PRO AREA')).toBeInTheDocument();
  });
});

describe('<LoginPage> — OTP code fallback', () => {
  it('is hidden when the feature flag is off', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);

    await user.type(await screen.findByLabelText(/email address/i), 'kent@example.com');
    await user.click(screen.getByRole('button', { name: /send sign-in link/i }));

    await screen.findByText(/kent@example.com/);
    expect(screen.queryByLabelText(/6-digit code/i)).not.toBeInTheDocument();
  });

  it('verifies a typed code when the flag is on', async () => {
    fake.otpEnabled = true;
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);

    await user.type(await screen.findByLabelText(/email address/i), 'kent@example.com');
    await user.click(screen.getByRole('button', { name: /send sign-in link/i }));

    await user.type(await screen.findByLabelText(/6-digit code/i), '123456');
    await user.click(screen.getByRole('button', { name: /verify code/i }));

    expect(fake.current!.auth.verifyOtp).toHaveBeenCalledWith({
      email: 'kent@example.com',
      token: '123456',
      type: 'email',
    });
  });

  it('shows a generic message for a bad code, revealing nothing about the account', async () => {
    fake.otpEnabled = true;
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);
    fake.current!.auth.verifyOtp.mockResolvedValueOnce({
      data: {},
      error: new Error('Token has expired or is invalid'),
    });

    await user.type(await screen.findByLabelText(/email address/i), 'kent@example.com');
    await user.click(screen.getByRole('button', { name: /send sign-in link/i }));
    await user.type(await screen.findByLabelText(/6-digit code/i), '000000');
    await user.click(screen.getByRole('button', { name: /verify code/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/not valid or has expired/i);
    // Must not distinguish "no such account" from "wrong code".
    expect(alert).not.toHaveTextContent(/no account|not found|unregistered/i);
  });
});
