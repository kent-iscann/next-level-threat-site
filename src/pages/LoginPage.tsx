import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { OTP_CODE_ENABLED } from '../lib/supabase';
import './LoginPage.css';

type Stage = 'enter-email' | 'sent';

export default function LoginPage() {
  const { session, loading, signInWithEmail, verifyOtpCode } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState<Stage>('enter-email');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? '/pro';

  if (loading) {
    return (
      <div className="container login-page" role="status" aria-live="polite">
        <p>Loading…</p>
      </div>
    );
  }

  if (session) return <Navigate to={from} replace />;

  const handleSendLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signInWithEmail(email.trim());
      setStage('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the sign-in email.');
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await verifyOtpCode(email.trim(), code.trim());
      // A successful verify updates the session; <Navigate> above takes over.
    } catch {
      // Deliberately generic: a precise message would confirm whether an
      // address has an account, and the code is short enough to guess at.
      setError('That code is not valid or has expired. Request a new one.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container login-page">
      <div className="login-card card">
        <h1 className="login-card__title">Sign in</h1>

        {stage === 'enter-email' ? (
          <>
            <p className="login-card__desc">
              Enter your email and we'll send you a secure sign-in link. No password needed.
            </p>
            <form className="login-form" onSubmit={handleSendLink}>
              <label className="login-form__label" htmlFor="login-email">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                autoFocus
                className="login-form__input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-primary login-form__submit" disabled={busy}>
                {busy ? 'Sending…' : 'Send sign-in link'}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="login-card__desc">
              We sent a sign-in link to <strong>{email}</strong>. Open it in this browser
              to continue.
            </p>

            {OTP_CODE_ENABLED && (
              <form className="login-form" onSubmit={handleVerifyCode}>
                <label className="login-form__label" htmlFor="login-code">
                  Or enter the 6-digit code from the email
                </label>
                <input
                  id="login-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]*"
                  maxLength={6}
                  className="login-form__input login-form__input--code"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button type="submit" className="btn btn-primary login-form__submit" disabled={busy}>
                  {busy ? 'Verifying…' : 'Verify code'}
                </button>
              </form>
            )}

            <button
              type="button"
              className="login-card__link"
              onClick={() => {
                setStage('enter-email');
                setCode('');
                setError(null);
              }}
            >
              Use a different email
            </button>
          </>
        )}

        {error && (
          <p className="login-card__error" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
