import { useEffect, useState } from 'react';
import { useAuth, getAccessToken } from '../auth/AuthProvider';

type Me = { id: string; email: string | null; tier: number; status: string };

/**
 * Deliberately unstyled placeholder.
 *
 * The PRO interface design is unresolved, so this exists only to prove the gate
 * works end to end and to give Phases 3–4 somewhere to land. Phase 8 replaces
 * it wholesale — do not build on it.
 */
export default function ProPage() {
  const { user, signOut } = useAuth();
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const token = await getAccessToken();
      if (!token) {
        if (active) setError('No access token available.');
        return;
      }
      try {
        const res = await fetch('/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`/api/me returned ${res.status}`);
        const data = (await res.json()) as Me;
        if (active) setMe(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : String(err));
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '50vh' }}>
      <h1>Signal &amp; Fracture PRO</h1>
      <p style={{ opacity: 0.75 }}>
        Signed in as <strong>{user?.email}</strong>
      </p>

      <h2 style={{ marginTop: '2rem', fontSize: '1rem', letterSpacing: '0.06em' }}>
        SERVER VERIFICATION
      </h2>
      {error && <p role="alert">Error: {error}</p>}
      {me && (
        <pre
          style={{
            padding: '1rem',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            overflowX: 'auto',
          }}
        >
          {JSON.stringify(me, null, 2)}
        </pre>
      )}
      {!me && !error && <p>Checking with the server…</p>}

      <button
        type="button"
        className="btn btn-secondary"
        style={{ marginTop: '2rem' }}
        onClick={() => void signOut()}
      >
        Sign out
      </button>
    </div>
  );
}
