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

    await user.type(await screen.findByLabelText(/sign-in code/i), '123456');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(fake.current!.auth.verifyOtp).toHaveBeenCalledWith({
      email: 'kent@example.com',
      token: '123456',
      type: 'email',
    });
  });

  it('strips non-digits as the user types', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);
    await requestCode(user);

    // Pasting "123-456" from an email client should not break verification.
    await user.type(await screen.findByLabelText(/sign-in code/i), '12a3-45b6');
    expect(screen.getByLabelText(/sign-in code/i)).toHaveValue('123456');
  });

  it('caps the code at six digits', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);
    await requestCode(user);

    const input = await screen.findByLabelText(/sign-in code/i);
    expect(input).toHaveAttribute('maxLength', '6');
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

  it('resends a code and clears the previous entry', async () => {
    const user = userEvent.setup();
    renderLogin();
    fake.current!.settle(null);
    await requestCode(user);

    await user.type(await screen.findByLabelText(/sign-in code/i), '111111');
    await user.click(screen.getByRole('button', { name: /send a new code/i }));

    expect(fake.current!.auth.signInWithOtp).toHaveBeenCalledTimes(2);
    expect(screen.getByLabelText(/sign-in code/i)).toHaveValue('');
    expect(await screen.findByRole('status')).toHaveTextContent(/new code/i);
  });

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
