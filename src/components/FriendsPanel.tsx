import type { FriendRow, PendingRequest } from '../types'
import { Avatar } from './Avatar'

type Props = {
  friends: FriendRow[]
  pendingRequests: PendingRequest[]
  onOpen: (f: FriendRow) => void
  onRemove: (id: string) => void
  onAccept: (fromPublicId: string) => void
  onDecline: (fromPublicId: string) => void
}

export function FriendsPanel({ friends, pendingRequests, onOpen, onRemove, onAccept, onDecline }: Props) {
  return (
    <section className="friends-panel">
      <header className="main-top">
        <h1>Friends</h1>
      </header>

      {pendingRequests.length > 0 && (
        <div className="pending-section">
          <p className="pending-heading">Pending requests ({pendingRequests.length})</p>
          <ul className="friends-list">
            {pendingRequests.map((req) => (
              <li key={req.fromPublicId} className="friend-row">
                <div className="friend-open">
                  <Avatar name={req.fromDisplayName} hue={220} size={36} />
                  <div>
                    <strong>{req.fromDisplayName}</strong>
                    <div className="muted tiny">Wants to be your friend</div>
                  </div>
                </div>
                <div className="pending-actions">
                  <button
                    type="button"
                    className="accept-btn"
                    onClick={() => onAccept(req.fromPublicId)}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => onDecline(req.fromPublicId)}
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="muted" style={{ marginTop: pendingRequests.length > 0 ? 16 : 0 }}>
        Pick someone from Direct Messages on the left to open a saved chat.
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
              <div className="avatar-wrap">
                <Avatar name={f.displayName} hue={f.avatarHue ?? 220} size={36} />
                <span className={`presence-dot ${f.online ? 'online' : 'offline'}`} />
              </div>
              <div>
                <strong>{f.displayName}</strong>
                <div className="muted tiny">
                  {f.online ? '● Online' : '○ Offline'} · {f.lastText || 'No messages yet'}
                </div>
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
