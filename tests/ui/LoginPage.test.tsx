import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { makeFakeSupabase, makeSession } from './helpers.tsx';

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

/** A valid code of whatever length the project is configured for. */
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

/** Walks the first stage: enter an address and request a code. */
async function requestCode(user: ReturnType<typeof userEvent.setup>, address = 'kent@example.com') {
  await user.type(await screen.findByLabelText(/email address/i), address);
  await user.click(screen.getByRole('button', { name: /send code/i }));
}

beforeEach(() => {
  fake.current = makeFakeSupabase();
});

describe('<LoginPage> — requesting a code', () => {
  it('renders the email form once loading settles', async () => {
    renderLogin();
    fake.current!.settle(null);
    expect(await screen.findByLabelText(/email address/i)).toBeInTheDocument();
  });

  it('requests a code for the entered address and allows account creation', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);
    await requestCode(user);

    expect(fake.current!.auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'kent@example.com',
      options: { shouldCreateUser: true },
    });
  });

  it('sends no redirect URL, because the email carries no link', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);
    await requestCode(user);

    const arg = fake.current!.auth.signInWithOtp.mock.calls[0]![0];
    expect(arg.options).not.toHaveProperty('emailRedirectTo');
  });

  it('trims surrounding whitespace from the address', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);
    await requestCode(user, '  kent@example.com  ');

    expect(fake.current!.auth.signInWithOtp.mock.calls[0]![0].email).toBe('kent@example.com');
  });

  it('advances to code entry and confirms the address', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);
    await requestCode(user);

    expect(await screen.findByLabelText(/sign-in code/i)).toBeInTheDocument();
    expect(screen.getByText(/kent@example.com/)).toBeInTheDocument();
  });

  it('stays on the email stage and reports a send failure', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);
    fake.current!.auth.signInWithOtp.mockResolvedValueOnce({
      data: {},
      error: new Error('Email rate limit exceeded'),
    });
    await requestCode(user);

    expect(await screen.findByRole('alert')).toHaveTextContent(/rate limit/i);
    expect(screen.getByLabelText(/email address/i)).toHaveValue('kent@example.com');
    expect(screen.queryByLabelText(/sign-in code/i)).not.toBeInTheDocument();
  });
});

describe('<LoginPage> — entering the code', () => {
  it('verifies the typed code with type "email"', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);
    await requestCode(user);

    await user.type(await screen.findByLabelText(/sign-in code/i), FULL_CODE);
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(fake.current!.auth.verifyOtp).toHaveBeenCalledWith({
      email: 'kent@example.com',
      token: FULL_CODE,
      type: 'email',
    });
  });

  it('accepts a full-length code without truncating it', async () => {
    // Regression: the input was hardcoded to 6 while Supabase issued 8, so the
    // last digits were silently dropped and no code could ever verify.
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);
    await requestCode(user);

    await user.type(await screen.findByLabelText(/sign-in code/i), FULL_CODE);
    expect(screen.getByLabelText(/sign-in code/i)).toHaveValue(FULL_CODE);
  });

  it('matches the configured Supabase OTP length', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);
    await requestCode(user);

    const input = await screen.findByLabelText(/sign-in code/i);
    expect(input).toHaveAttribute('maxLength', String(AUTH_CODE_LENGTH));
    expect(AUTH_CODE_LENGTH).toBeGreaterThanOrEqual(6);
    expect(AUTH_CODE_LENGTH).toBeLessThanOrEqual(10);
  });

  it('strips non-digits as the user types', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);
    await requestCode(user);

    // Pasting a hyphenated code from an email client must not break verification.
    const messy = FULL_CODE.slice(0, 2) + 'a-' + FULL_CODE.slice(2);
    await user.type(await screen.findByLabelText(/sign-in code/i), messy);
    expect(screen.getByLabelText(/sign-in code/i)).toHaveValue(FULL_CODE);
  });

  it('shows a generic message for a bad code, revealing nothing about the account', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);
    await requestCode(user);

    fake.current!.auth.verifyOtp.mockResolvedValueOnce({
      data: {},
      error: new Error('Token has expired or is invalid'),
    });
    await user.type(await screen.findByLabelText(/sign-in code/i), '000000');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/not valid or has expired/i);
    expect(alert).not.toHaveTextContent(/no account|not found|unregistered/i);
  });

  it('disables resend during the cooldown and counts down', async () => {
    // Supabase rejects a second code for the same address within 60s, so the
    // button must not be clickable until then.
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);
    await requestCode(user);

    const resend = await screen.findByRole('button', { name: /send a new code/i });
    expect(resend).toBeDisabled();
    expect(resend).toHaveTextContent(`${RESEND_COOLDOWN_SECONDS}s`);
    expect(fake.current!.auth.signInWithOtp).toHaveBeenCalledTimes(1);
  });

  // The re-enable path lives in LoginPage.cooldown.test.tsx, which runs with a
  // shortened cooldown. Fake timers were tried here and leaked into later tests.

  it('lets the user go back and correct the address', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);
    await requestCode(user, 'wrong@example.com');

    await user.click(await screen.findByRole('button', { name: /different email/i }));
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/sign-in code/i)).not.toBeInTheDocument();
  });
});

describe('<LoginPage> — already signed in', () => {
  it('redirects away instead of showing the form', async () => {
    renderLogin();
    fake.current!.settle(makeSession());
    expect(await screen.findByText('PRO AREA')).toBeInTheDocument();
  });
});
