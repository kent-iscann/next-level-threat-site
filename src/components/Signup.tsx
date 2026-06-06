import { useState, FormEvent } from 'react';
import './Signup.css';

export function Signup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to subscribe at this time.');
      }

      setStatus('success');
      setMessage('Thanks — you are now subscribed.');
      setEmail('');
    } catch (error) {
      console.error('Signup error', error);
      const errorMessage = error instanceof Error ? error.message : 'Unable to subscribe at this time.';
      setStatus('error');
      setMessage(`Subscription failed. ${errorMessage}`);
    }
  };

  return (
    <div className="newsletter__inner">
      <form className="newsletter__form" onSubmit={handleSubmit}>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="your@email.com"
          required
          className="newsletter__input"
          aria-label="Email address"
        />
        <button type="submit" className="btn btn-primary newsletter__btn" disabled={status === 'loading'}>
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>

      {message && (
        <p className={`newsletter__note${status === 'error' ? ' newsletter__note--error' : ''}`} role="status" aria-live="polite">
          {message}
        </p>
      )}

      {!message && <p className="newsletter__note">One email per week. No spam. Unsubscribe anytime.</p>}
    </div>
  );
}
