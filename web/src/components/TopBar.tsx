import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title: string;
  /** The signed-in user's initials, shown in the avatar. */
  userInitials?: string;
}

export default function TopBar({ title, userInitials = 'MG' }: TopBarProps) {
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
    } catch {
      // Even if the server round-trip fails, sign out locally.
    }
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  }

  return (
    <div className="topbar">
      <h1>{title}</h1>
      <div className="topbar-actions">
        <span className="avatar" aria-label="Your profile">
          {userInitials}
        </span>
        <button type="button" className="signout-btn" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}
