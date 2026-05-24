import type { ReactNode } from "react";
import {
  CaretLeft,
  CaretRight,
  Cube,
  House,
  ShoppingCart,
} from "@phosphor-icons/react";
import { AsciiGlyph } from "./AsciiGlyph";
import { ShinyText } from "./ShinyText";
import { SidebarAvatarButton } from "./UserAvatar";

type AppView = "home" | "products" | "purchase" | "plan" | "settings";

type SidebarProps = {
  isCollapsed: boolean;
  currentView: AppView;
  avatarUrl?: string;
  onToggle: () => void;
  onNavigate: (view: AppView) => void;
  onOpenSettings: () => void;
};

const items: { view: AppView; label: string; icon: ReactNode }[] = [
  { view: "home", label: "Home", icon: <House size={18} /> },
  { view: "products", label: "Products", icon: <Cube size={18} /> },
  { view: "purchase", label: "Purchase", icon: <ShoppingCart size={18} /> },
];

export function Sidebar({
  isCollapsed,
  currentView,
  avatarUrl,
  onToggle,
  onNavigate,
  onOpenSettings,
}: SidebarProps) {
  return (
    <aside className={`sidebar ${isCollapsed ? "is-collapsed" : ""}`}>
      <button type="button" className="sidebar-toggle" onClick={onToggle}>
        {isCollapsed ? <CaretRight size={18} /> : <CaretLeft size={18} />}
      </button>

      <div className="sidebar-logo-wrap">
        {isCollapsed ? (
          <span className="sidebar-logo-text sidebar-logo-text-collapsed">
            <AsciiGlyph target="N" />
          </span>
        ) : (
          <span className="sidebar-logo-text">
            <ShinyText text={"Nocturne\nProject"} />
          </span>
        )}
      </div>

      <div className="sidebar-separator" aria-hidden="true" />

      <nav className="sidebar-nav">
        {items.map((item) => (
          <button
            key={item.view}
            type="button"
            className={currentView === item.view ? "is-active" : ""}
            onClick={() => onNavigate(item.view)}
          >
            {item.icon}
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <SidebarAvatarButton
          avatarUrl={avatarUrl}
          isCollapsed={isCollapsed}
          isActive={currentView === "settings"}
          onClick={onOpenSettings}
        />
      </div>
    </aside>
  );
}
