import { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignIn.module.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="page">
      <div className="card">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">♪</span>
          <span className="brand-name">Resonance</span>
        </div>
        <h1>Sign in</h1>
        <p className="subtitle">Stream music, build playlists and discover new songs.</p>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button className="btn" type="submit">Sign in</button>
        </form>
        <p className="footer">
          New here? <Link className="link" to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
