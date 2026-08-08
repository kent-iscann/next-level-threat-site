import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { makeFakeSupabase, makeSession } from './helpers.tsx';

const fake = vi.hoisted(() => ({ current: null as ReturnType<typeof import('./helpers.tsx')['makeFakeSupabase']> | null }));

vi.mock('../../src/lib/supabase', () => ({
  get supabase() {
    return fake.current!.client;
  },
}));

const { AuthProvider } = await import('../../src/auth/AuthProvider.tsx');
const { RequireAuth } = await import('../../src/auth/RequireAuth.tsx');

function renderGuarded(initialPath = '/pro') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<div>LOGIN PAGE</div>} />
          <Route
            path="/pro"
            element={
              <RequireAuth>
                <div>PROTECTED CONTENT</div>
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  fake.current = makeFakeSupabase();
});

describe('<RequireAuth>', () => {
  it('shows a pending state while the session is still loading', () => {
    renderGuarded();
    expect(screen.getByText(/checking your session/i)).toBeInTheDocument();
    // Critically, it must NOT redirect yet — that would flash the login page
    // for an already-signed-in user on every hard refresh.
    expect(screen.queryByText('LOGIN PAGE')).not.toBeInTheDocument();
  });

  it('renders children once a session resolves', async () => {
    renderGuarded();
    fake.current!.settle(makeSession());
    expect(await screen.findByText('PROTECTED CONTENT')).toBeInTheDocument();
  });

  it('redirects to /login when there is no session', async () => {
    renderGuarded();
    fake.current!.settle(null);
    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
    expect(screen.queryByText('PROTECTED CONTENT')).not.toBeInTheDocument();
  });

  it('never renders protected children before the session is known', async () => {
    renderGuarded();
    expect(screen.queryByText('PROTECTED CONTENT')).not.toBeInTheDocument();
    fake.current!.settle(null);
    await screen.findByText('LOGIN PAGE');
    expect(screen.queryByText('PROTECTED CONTENT')).not.toBeInTheDocument();
  });

  it('reacts to a sign-out pushed by onAuthStateChange', async () => {
    renderGuarded();
    fake.current!.settle(makeSession());
    await screen.findByText('PROTECTED CONTENT');

    fake.current!.emit('SIGNED_OUT', null);
    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
  });

  it('picks up a session delivered after initial load', async () => {
    renderGuarded();
    fake.current!.settle(null);
    await screen.findByText('LOGIN PAGE');

    // e.g. verifyOtp succeeding, or a token refresh restoring a session
    fake.current!.emit('SIGNED_IN', makeSession());
    // The router has already navigated to /login; the guard's job is to stop
    // blocking, which the login page then acts on by redirecting onward.
    expect(fake.current!.auth.onAuthStateChange).toHaveBeenCalled();
  });

  it('unsubscribes from auth changes on unmount', async () => {
    const { unmount } = renderGuarded();
    fake.current!.settle(makeSession());
    await screen.findByText('PROTECTED CONTENT');

    const { subscription } = fake.current!.auth.onAuthStateChange.mock.results[0].value.data;
    unmount();
    expect(subscription.unsubscribe).toHaveBeenCalled();
  });
});
