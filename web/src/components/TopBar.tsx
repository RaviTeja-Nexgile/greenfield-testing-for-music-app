interface TopBarProps {
  title: string;
  /** The signed-in user's initials, shown in the avatar. */
  userInitials?: string;
}

export default function TopBar({ title, userInitials = 'MG' }: TopBarProps) {
  return (
    <div className="topbar">
      <h1>{title}</h1>
      <div className="topbar-actions">
        <span className="avatar" aria-label="Your profile">
          {userInitials}
        </span>
      </div>
    </div>
  );
}
