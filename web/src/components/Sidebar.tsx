import { NavLink } from 'react-router-dom';

interface NavItem {
  to: string;
  label: string;
  icon: JSX.Element;
}

const browseItems: NavItem[] = [
  {
    to: '/home',
    label: 'Home',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    to: '/search',
    label: 'Search',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    to: '/library',
    label: 'Your Library',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M9 18V6l12-2v12" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
];

const playlistItems: NavItem[] = [
  {
    to: '/library',
    label: 'Create playlist',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    to: '/library',
    label: 'Liked Songs',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 18V6l12-2v12" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </span>
      <span className="brand-name">Resonance</span>
    </div>
  );
}

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
  return (
    <div className="nav-group">
      <div className="nav-label">{label}</div>
      {items.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Brand />
      <nav aria-label="Main navigation">
        <NavGroup label="Browse" items={browseItems} />
        <NavGroup label="Playlists" items={playlistItems} />
      </nav>
    </aside>
  );
}
