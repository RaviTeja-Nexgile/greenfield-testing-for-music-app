import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import PlayerBar from './PlayerBar';

const titles: Record<string, string> = {
  '/home': 'Good evening',
  '/search': 'Search',
  '/player': 'Now playing',
  '/library': 'Your Library',
  '/profile': 'Your profile',
};

export default function AppShell() {
  const location = useLocation();
  const title = titles[location.pathname] ?? 'Resonance';

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <div className="mobile-top">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 18V6l12-2v12" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </span>
            <span className="brand-name">Resonance</span>
          </div>
          <span className="avatar" aria-label="Your profile">
            MG
          </span>
        </div>
        <TopBar title={title} />
        <Outlet />
      </main>
      <PlayerBar />
    </div>
  );
}
