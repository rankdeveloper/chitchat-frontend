import type { FriendRow } from '../types'
import { Avatar } from './Avatar'

type Props = {
  friends: FriendRow[]
  onOpen: (f: FriendRow) => void
  onRemove: (id: string) => void
}

export function FriendsPanel({ friends, onOpen, onRemove }: Props) {
  return (
    <section className="friends-panel">
      <header className="main-top">
        <h1>Friends</h1>
      </header>
      <p className="muted">
        Pick someone from Direct Messages on the left to open a saved chat —
        same idea as{' '}
        <a href="https://www.chitchat.gg/" target="_blank" rel="noopener noreferrer">
          chitchat.gg
        </a>
        .
      </p>
      <ul className="friends-list">
        {friends.length === 0 && (
          <li className="muted">
            No friends yet. Use Add friend during a random chat.
          </li>
        )}
        {friends.map((f) => (
          <li key={f.publicId} className="friend-row">
            <button type="button" className="friend-open" onClick={() => onOpen(f)}>
              <Avatar name={f.displayName} hue={f.avatarHue ?? 220} size={36} />
              <div>
                <strong>{f.displayName}</strong>
                <div className="muted tiny">{f.lastText || 'No messages yet'}</div>
              </div>
            </button>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => onRemove(f.publicId)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
