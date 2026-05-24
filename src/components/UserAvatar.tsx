import { Gear, SignOut, UserCircle } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

type UserAvatarMenuProps = {
  username: string;
  email: string;
  avatarUrl?: string;
  onSettings: () => void;
  onLogout: () => void;
};

export function UserAvatarMenu({
  username,
  email,
  avatarUrl,
  onSettings,
  onLogout,
}: UserAvatarMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="avatar-menu" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="avatar-trigger"
      >
        {avatarUrl ? <img src={avatarUrl} alt={username} /> : <UserCircle size={30} weight="duotone" />}
      </button>

      {isOpen && (
        <div className="avatar-dropdown" role="menu">
          <div className="avatar-user-meta">
            <strong>{username}</strong>
            <span>{email}</span>
          </div>
          <button type="button" role="menuitem" onClick={onSettings}>
            <Gear size={18} /> Account settings
          </button>
          <button type="button" role="menuitem" onClick={onLogout}>
            <SignOut size={18} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

type SidebarAvatarButtonProps = {
  avatarUrl?: string;
  isCollapsed: boolean;
  isActive: boolean;
  onClick: () => void;
};

export function SidebarAvatarButton({
  avatarUrl,
  isCollapsed,
  isActive,
  onClick,
}: SidebarAvatarButtonProps) {
  return (
    <button
      type="button"
      className={`sidebar-profile-button ${isActive ? "is-active" : ""}`}
      onClick={onClick}
    >
      <span className="sidebar-profile-avatar" aria-hidden="true">
        {avatarUrl ? (
          <img src={avatarUrl} alt="User avatar" />
        ) : (
          <UserCircle size={24} weight="duotone" />
        )}
      </span>
      {!isCollapsed && <span>Profile</span>}
    </button>
  );
}
