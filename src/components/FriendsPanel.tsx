import {
  Check,
  MessageSquare,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import type { FriendRow, PendingRequest } from "../types";
import { Avatar } from "./Avatar";

type Props = {
  friends: FriendRow[];
  pendingRequests: PendingRequest[];
  onOpen: (f: FriendRow) => void;
  onRemove: (id: string) => void;
  onAccept: (fromPublicId: string) => void;
  onDecline: (fromPublicId: string) => void;
};

export function FriendsPanel({
  friends,
  pendingRequests,
  onOpen,
  onRemove,
  onAccept,
  onDecline,
}: Props) {
  const onlineCount = friends.filter((f) => f.online).length;

  return (
    <section className="fp">
      <header className="fp-head">
        <span className="fp-head-icon">
          <Users size={22} />
        </span>
        <h1>Friends</h1>
        <span className="fp-count">{friends.length}</span>
        {onlineCount > 0 && (
          <span className="fp-online">
            <span className="fp-dot online" />
            {onlineCount} online
          </span>
        )}
      </header>

      <div className="fp-scroll">
        {pendingRequests.length > 0 && (
          <div className="fp-block">
            <h2 className="fp-sub">
              <UserPlus size={18} />
              Pending requests
              <span className="fp-badge">{pendingRequests.length}</span>
            </h2>
            <ul className="fp-list">
              {pendingRequests.map((req) => (
                <li key={req.fromPublicId} className="fp-row fp-row-pending">
                  <div className="fp-open fp-static">
                    <Avatar name={req.fromDisplayName} hue={220} size={48} />
                    <div className="fp-text">
                      <strong>{req.fromDisplayName}</strong>
                      <span>Wants to be your friend</span>
                    </div>
                  </div>
                  <div className="fp-actions">
                    <button
                      type="button"
                      className="fp-pill fp-accept"
                      onClick={() => onAccept(req.fromPublicId)}
                    >
                      <Check size={16} />
                      Accept
                    </button>
                    <button
                      type="button"
                      className="fp-pill fp-decline"
                      onClick={() => onDecline(req.fromPublicId)}
                      aria-label={`Decline request from ${req.fromDisplayName}`}
                    >
                      <X size={16} />
                      Decline
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="fp-block">
          <h2 className="fp-sub">
            <Users size={18} />
            Your friends
          </h2>

          {friends.length === 0 ? (
            <div className="fp-empty">
              <span className="fp-empty-icon">
                <Users size={34} />
              </span>
              <h3>No friends yet</h3>
              <p>
                Start a random chat and tap Add friend when you click with
                someone.
              </p>
            </div>
          ) : (
            <>
              <p className="fp-hint">
                Click a friend to open your direct messages.
              </p>
              <ul className="fp-list">
                {friends.map((f) => (
                  <li key={f.publicId} className="fp-row">
                    <button
                      type="button"
                      className="fp-open"
                      onClick={() => onOpen(f)}
                    >
                      <div className="fp-avatar">
                        <Avatar
                          name={f.displayName}
                          hue={f.avatarHue ?? 220}
                          size={48}
                        />
                        <span
                          className={`fp-dot ${f.online ? "online" : "offline"}`}
                        />
                      </div>
                      <div className="fp-text">
                        <strong>{f.displayName}</strong>
                        <span className={f.online ? "fp-status-on" : ""}>
                          {f.online ? "Online" : "Offline"}
                        </span>
                        <em>{f.lastText || "No messages yet"}</em>
                      </div>
                      <MessageSquare
                        size={20}
                        className="fp-go"
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      type="button"
                      className="fp-icon-btn"
                      onClick={() => onRemove(f.publicId)}
                      title="Remove friend"
                      aria-label={`Remove ${f.displayName}`}
                    >
                      <UserMinus size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
