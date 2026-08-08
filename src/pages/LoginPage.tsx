import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import './LoginPage.css';

type Stage = 'enter-email' | 'enter-code';

const CODE_LENGTH = 6;

export default function LoginPage() {
  const { session, loading, sendLoginCode, verifyLoginCode } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState<Stage>('enter-email');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
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

  const sendCode = async (address: string) => {
    await sendLoginCode(address);
    setStage('enter-code');
  };

  const handleSendCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await sendCode(email.trim());
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
      // has an account, and a 6-digit code is short enough to be worth guessing.
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
              Enter your email and we'll send you a {CODE_LENGTH}-digit sign-in code.
              No password needed.
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
              We sent a {CODE_LENGTH}-digit code to <strong>{email}</strong>. It expires
              shortly, so enter it soon.
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
                maxLength={CODE_LENGTH}
                className="login-form__input login-form__input--code"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              />
              <button type="submit" className="btn btn-primary login-form__submit" disabled={busy}>
                {busy ? 'Verifying…' : 'Sign in'}
              </button>
            </form>

            <button type="button" className="login-card__link" onClick={handleResend} disabled={busy}>
              Send a new code
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
