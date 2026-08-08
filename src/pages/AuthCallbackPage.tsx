import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import './LoginPage.css';

/** Supabase reports failures either in the query string or the hash fragment. */
function readAuthError(): string | null {
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const description = query.get('error_description') ?? hash.get('error_description');
  const code = query.get('error') ?? hash.get('error');
  if (!description && !code) return null;
  return description ?? code;
}

/** How long to wait for the PKCE exchange before declaring it failed. */
const EXCHANGE_TIMEOUT_MS = 15_000;

export default function AuthCallbackPage() {
  const { session, loading } = useAuth();
  const [urlError] = useState(readAuthError);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (session || urlError) return;
    const timer = setTimeout(() => setTimedOut(true), EXCHANGE_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [session, urlError]);

  if (session) return <Navigate to="/pro" replace />;

  const failed = urlError ?? (timedOut ? 'timeout' : null);

  if (failed) {
    return (
      <div className="container login-page">
        <div className="login-card card">
          <h1 className="login-card__title">Sign-in link didn't work</h1>
          <p className="login-card__desc">
            {failed === 'timeout'
              ? 'We could not complete the sign-in. This usually means the link was opened in a different browser than the one that requested it, or it had already been used.'
              : failed}
          </p>
          <Link to="/login" className="btn btn-primary login-form__submit">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container login-page" role="status" aria-live="polite">
      <div className="login-card card">
        <h1 className="login-card__title">Signing you in…</h1>
        <p className="login-card__desc">
          {loading ? 'Verifying your link.' : 'Almost there.'}
        </p>
      </div>
    </div>
  );
}
