import { useState, useEffect, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { AUTH_CODE_LENGTH, RESEND_COOLDOWN_SECONDS } from '../config';
import './LoginPage.css';

type Stage = 'enter-email' | 'enter-code';

export default function LoginPage() {
  const { session, loading, sendLoginCode, verifyLoginCode } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState<Stage>('enter-email');
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Supabase refuses a second code for the same address within 60s, so the
  // resend button counts down rather than letting the user trigger an error.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? '/pro';

  if (loading) {
    return (
      <div className="container login-page" role="status" aria-live="polite">
        <p>Loading…</p>
      </div>
    );
  }

  if (session) return <Navigate to={from} replace />;

  const handleSendCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await sendLoginCode(email.trim());
      setStage('enter-code');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the sign-in code.');
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await sendLoginCode(email.trim());
      setCode('');
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setNotice('A new code is on its way.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend the code.');
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await verifyLoginCode(email.trim(), code.trim());
      // On success the session updates and the <Navigate> above takes over.
    } catch {
      // Deliberately generic: a precise message would confirm whether an address
      // has an account, and the code is short enough to be worth guessing at.
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
              Enter your email and we'll send you a {AUTH_CODE_LENGTH}-digit sign-in
              code. No password needed.
            </p>
            <form className="login-form" onSubmit={handleSendCode}>
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
                {busy ? 'Sending…' : 'Send code'}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="login-card__desc">
              We sent a {AUTH_CODE_LENGTH}-digit code to <strong>{email}</strong>. It
              expires shortly, so enter it soon.
            </p>
            <form className="login-form" onSubmit={handleVerify}>
              <label className="login-form__label" htmlFor="login-code">
                Sign-in code
              </label>
              <input
                id="login-code"
                type="text"
                required
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                pattern="[0-9]*"
                maxLength={AUTH_CODE_LENGTH}
                className="login-form__input login-form__input--code"
                placeholder={'0'.repeat(AUTH_CODE_LENGTH)}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              />
              <button type="submit" className="btn btn-primary login-form__submit" disabled={busy}>
                {busy ? 'Verifying…' : 'Sign in'}
              </button>
            </form>

            <button
              type="button"
              className="login-card__link"
              onClick={handleResend}
              disabled={busy || cooldown > 0}
            >
              {cooldown > 0 ? `Send a new code (${cooldown}s)` : 'Send a new code'}
            </button>
            <button
              type="button"
              className="login-card__link"
              onClick={() => {
                setStage('enter-email');
                setCode('');
                setError(null);
                setNotice(null);
              }}
            >
              Use a different email
            </button>
          </>
        )}

        {notice && (
          <p className="login-card__notice" role="status">
            {notice}
          </p>
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
