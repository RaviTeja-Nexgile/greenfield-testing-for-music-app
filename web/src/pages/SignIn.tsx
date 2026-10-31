import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignIn.module.css';

const TOKEN_KEY = 'token';

function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export default function SignIn() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const endpoint = mode === 'signin' ? '/api/auth/signin' : '/api/auth/signup';
      const body =
        mode === 'signin'
          ? { email, password }
          : { name, email, password, consent };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message ?? 'Something went wrong. Please try again.');
        return;
      }

      storeToken(data.token);
      navigate('/home', { replace: true });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function switchMode(next: 'signin' | 'signup') {
    setMode(next);
    setError(null);
  }

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 18V6l12-2v12" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </span>
          <span className={styles.brandName}>Resonance</span>
        </div>

        <h1>{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h1>
        <p className={styles.subtitle}>
          {mode === 'signin'
            ? 'Sign in to keep listening to your music, playlists and recommendations.'
            : 'Sign up to stream music, build playlists and discover new songs.'}
        </p>

        {error && (
          <div className={styles.errorBanner} role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className={styles.field}>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                className={styles.input}
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className={styles.input}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className={styles.input}
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {mode === 'signup' ? (
            <div className={styles.consentRow}>
              <label className={styles.check}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                I consent to the treatment of my personal data
              </label>
            </div>
          ) : (
            <div className={styles.row}>
              <label className={styles.check}>
                <input type="checkbox" /> Remember me
              </label>
              <a className={styles.link} href="#">
                Forgot password?
              </a>
            </div>
          )}

          <button className={styles.btn} type="submit" disabled={submitting}>
            {submitting ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        {mode === 'signin' && (
          <>
            <div className={styles.divider}>or continue with</div>
            <button className={styles.btnGhost} type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <p className={styles.footer}>
          {mode === 'signin' ? 'New to Resonance? ' : 'Already have an account? '}
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
          >
            {mode === 'signin' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </main>
    </div>
  );
}
