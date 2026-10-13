import { useState } from "react";
import { Menu, MessageSquare, Search, Settings, Users, X } from "lucide-react";
import { STATUS_LABELS } from "../constants";
import type { FriendRow, NavTab, PendingRequest, UiPhase } from "../types";
import { Avatar } from "./Avatar";
import { Logo } from "./LandingPage";

type Props = {
  phase: UiPhase;
  nav: NavTab;
  activeDmId: string | null;
  showNewChat: boolean;
  friends: FriendRow[];
  onlineFriends: Set<string>;
  pendingRequests: PendingRequest[];
  displayName: string;
  avatarHue: number;
  onChat: () => void;
  onFriends: () => void;
  onOpenDm: (f: FriendRow) => void;
  onRemoveFriend: (id: string) => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
};

export function Sidebar(p: Props) {
  const [filter, setFilter] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [open, setOpen] = useState(false);
  const name = p.displayName.trim();

  const q = filter.trim().toLowerCase();
  const visible = q
    ? p.friends.filter((f) => f.displayName.toLowerCase().includes(q))
    : p.friends;

  const onlineCount = p.friends.filter((f) =>
    p.onlineFriends.has(f.publicId),
  ).length;

  const toggleSearch = () => {
    if (showSearch) setFilter("");
    setShowSearch((v) => !v);
  };

  return (
    <>
      <button
        type="button"
        className="sidebar-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {open && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)} />
      )}

      <aside className={`sidebar ${open ? "mobile-open" : ""}`}>
        <div className="brand">
          <Logo size={40} />
          <strong>Meetora</strong>
          <button
            type="button"
            className="brand-collapse"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={15} />
          </button>
        </div>

        <nav className="side-nav">
          <button
            type="button"
            className={`nav-btn nav-new ${p.nav === "chat" && !p.activeDmId ? "active" : ""}`}
            onClick={() => {
              p.onChat();
              setOpen(false);
            }}
          >
            <span className="nav-icon">
              <MessageSquare size={22} />
            </span>
            <span>New Chat</span>
            {p.phase === "searching" && (
              <span className="nav-badge searching">●</span>
            )}
            {p.phase === "chatting" && (
              <span className="nav-badge chatting">●</span>
            )}
          </button>

          <button
            type="button"
            className={`nav-btn nav-friends ${p.nav === "friends" && !p.activeDmId ? "active" : ""}`}
            onClick={() => {
              p.onFriends();
              setOpen(false);
            }}
          >
            <span className="nav-icon">
              <Users size={18} />
            </span>
            <span>Friends</span>
            {p.pendingRequests.length > 0 && (
              <span className="nav-badge count">
                {p.pendingRequests.length}
              </span>
            )}
          </button>
        </nav>

        <div className="dm-section">
          <div className="dm-heading">
            <span>Messages</span>
            {onlineCount > 0 && (
              <span className="dm-online-count">
                <span className="dm-online-dot" />
                {onlineCount}
              </span>
            )}
            <button
              type="button"
              className="dm-search-btn"
              onClick={toggleSearch}
              aria-label={showSearch ? "Close search" : "Search friends"}
              aria-pressed={showSearch}
            >
              {showSearch ? <X size={18} /> : <Search size={18} />}
            </button>
          </div>
          {showSearch && (
            <input
              className="dm-search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search friends…"
              autoFocus
            />
          )}
          <ul className="dm-list">
            {visible.length === 0 && (
              <li className="dm-empty">
                {filter
                  ? "No results."
                  : p.friends.length === 0
                    ? "Add friends during a random chat."
                    : "No matches."}
              </li>
            )}
            {visible.map((f) => {
              const isOnline = p.onlineFriends.has(f.publicId);
              const isActive = p.activeDmId === f.publicId;
              const hasUnread = !!f.lastText && !isActive;
              return (
                <li key={f.publicId}>
                  <button
                    type="button"
                    className={`dm-item ${isActive ? "active" : ""}`}
                    onClick={() => {
                      p.onOpenDm(f);
                      setOpen(false);
                    }}
                  >
                    <div className="dm-avatar-wrap">
                      <Avatar
                        name={f.displayName}
                        hue={f.avatarHue ?? 220}
                        size={48}
                      />
                      <span
                        className={`dm-presence ${isOnline ? "online" : "offline"}`}
                      />
                    </div>
                    <span className="dm-item-text">
                      <span className={`dm-name ${hasUnread ? "unread" : ""}`}>
                        {f.displayName}
                      </span>
                      {f.lastText && (
                        <span className="dm-preview">{f.lastText}</span>
                      )}
                    </span>
                    {hasUnread && <span className="dm-unread-dot" />}
                    <span
                      className="dm-close"
                      role="button"
                      tabIndex={0}
                      title="Remove friend"
                      onClick={(e) => {
                        e.stopPropagation();
                        p.onRemoveFriend(f.publicId);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.stopPropagation();
                          p.onRemoveFriend(f.publicId);
                        }
                      }}
                    >
                      <X size={13} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="side-foot">
          <div className="me-row">
            <button
              type="button"
              className="me-avatar-btn"
              onClick={p.onOpenProfile}
              title="Open profile"
            >
              <Avatar name={name || "Guest"} hue={p.avatarHue} size={44} />
            </button>
            <button
              type="button"
              className="me-name-btn"
              onClick={p.onOpenProfile}
            >
              <span className="me-name">{name || "Guest"}</span>
              <span className="muted tiny">Free</span>
            </button>
            <button
              type="button"
              className="icon-btn"
              title="Settings"
              onClick={p.onOpenSettings}
            >
              <Settings size={20} />
            </button>
          </div>
          <div className={`status-dot status-dot--${p.phase}`}>
            {STATUS_LABELS[p.phase]}
          </div>
        </div>
      </aside>
    </>
  );
}
