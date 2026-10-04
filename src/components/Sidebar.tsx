import { useState } from 'react'
import { STATUS_LABELS } from '../constants'
import type { FriendRow, NavTab, UiPhase } from '../types'
import { Avatar } from './Avatar'

type Props = {
  phase: UiPhase
  nav: NavTab
  activeDmId: string | null
  showNewChat: boolean
  friends: FriendRow[]
  displayName: string
  avatarHue: number
  onChat: () => void
  onFriends: () => void
  onOpenDm: (f: FriendRow) => void
  onRemoveFriend: (id: string) => void
  onOpenProfile: () => void
  onOpenSettings: () => void
}

export function Sidebar(p: Props) {
  const [filter, setFilter] = useState('')
  const name = p.displayName.trim()

  const q = filter.trim().toLowerCase()
  const visible = q
    ? p.friends.filter((f) => f.displayName.toLowerCase().includes(q))
    : p.friends

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true" />
        <div>
          <strong>Chitchat</strong>
          <span className="brand-sub">Talk to strangers</span>
        </div>
      </div>

      <nav className="side-nav">
        <button
          type="button"
          className={`nav-btn ${p.nav === 'chat' && !p.activeDmId ? 'active' : ''}`}
          onClick={p.onChat}
        >
          Chat
        </button>
        <button
          type="button"
          className={`nav-btn ${p.nav === 'friends' ? 'active' : ''}`}
          onClick={p.onFriends}
        >
          Friends
        </button>
        {p.showNewChat && (
          <button type="button" className="nav-btn new-chat active">
            New Chat
          </button>
        )}
      </nav>

      <div className="dm-section">
        <div className="dm-heading">Direct Messages</div>
        <input
          className="dm-search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={name ? `@${name}` : 'Search friends…'}
        />
        <ul className="dm-list">
          {visible.length === 0 && (
            <li className="dm-empty">
              Add friends during random chat to message them here.
            </li>
          )}
          {visible.map((f) => (
            <li key={f.publicId}>
              <button
                type="button"
                className={`dm-item ${p.activeDmId === f.publicId ? 'active' : ''}`}
                onClick={() => p.onOpenDm(f)}
              >
                <Avatar name={f.displayName} hue={f.avatarHue ?? 220} size={34} />
                <span className="dm-item-text">
                  <span className="dm-name">{f.displayName}</span>
                  {f.lastText ? (
                    <span className="dm-preview">{f.lastText}</span>
                  ) : null}
                </span>
                <span
                  className="dm-close"
                  role="button"
                  tabIndex={0}
                  title="Remove friend"
                  onClick={(e) => {
                    e.stopPropagation()
                    p.onRemoveFriend(f.publicId)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.stopPropagation()
                      p.onRemoveFriend(f.publicId)
                    }
                  }}
                >
                  ×
                </span>
              </button>
            </li>
          ))}
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
            <Avatar name={name || 'Guest'} hue={p.avatarHue} size={34} />
          </button>
          <button type="button" className="me-name-btn" onClick={p.onOpenProfile}>
            <span className="me-name">{name || 'Guest'}</span>
            <span className="muted tiny">Free</span>
          </button>
          <button
            type="button"
            className="icon-btn"
            title="Settings"
            onClick={p.onOpenSettings}
          >
            ⚙
          </button>
        </div>
        <div className={`status-dot status-dot--${p.phase}`}>
          {STATUS_LABELS[p.phase]}
        </div>
      </div>
    </aside>
  )
}
