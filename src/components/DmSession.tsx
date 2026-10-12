import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Send, Smile } from "lucide-react";
import { formatTs, isSameDay } from "../lib/format";
import type { ChatLine, FriendRow } from "../types";
import { Avatar } from "./Avatar";

type Props = {
  friend: FriendRow;
  chatId: string | null;
  messages: ChatLine[];
  userId: string;
  displayName: string;
  avatarHue: number;
  isTyping: boolean;
  onSend: (text: string) => void;
  onTyping: () => void;
  onMarkRead: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  onUnfriend: () => void;
  onBlock: () => void;
  onReport: () => void;
};

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];
const QUICK_EMOJIS = ["😂", "❤️", "👍", "🔥", "😮", "😢", "🎉", "👋", "😍", "🤣"];
const MAX_CHARS = 500;

export function DmSession(p: Props) {
  const [draft, setDraft] = useState("");
  const [hoveredMsg, setHoveredMsg] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [p.messages, p.isTyping]);

  useEffect(() => {
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.msgId;
            if (id) p.onMarkRead(id);
          }
        }
      },
      { threshold: 0.5 },
    );
    document.querySelectorAll("[data-msg-id]").forEach((el) => {
      observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [p.messages, p.onMarkRead]);

  const send = () => {
    const text = draft.trim();
    if (!text || text.length > MAX_CHARS) return;
    setDraft("");
    p.onSend(text);
    inputRef.current?.focus();
  };

  const charsLeft = MAX_CHARS - draft.length;

  return (
    <section className="dm-session">
      <header className="dm-top">
        <div className="dm-top-left">
          <div className="dm-avatar-status">
            <Avatar name={p.friend.displayName} hue={p.friend.avatarHue ?? 220} size={36} />
            <span className={`dm-status-dot ${p.friend.online ? "online" : "offline"}`} />
          </div>
          <div>
            <h1>@{p.friend.displayName}</h1>
            <span className={`online-badge ${p.friend.online ? "online" : "offline"}`}>
              {p.friend.online ? "● Online" : "○ Offline"}
            </span>
          </div>
        </div>
        <div className="dm-top-meta">
          {p.chatId && <span className="muted tiny chat-id">/chat/{p.chatId}</span>}
          <div className="session-more">
            <button
              type="button"
              className="ghost-btn"
              onClick={() => setShowMenu((v) => !v)}
              title="More options"
            >
              <MoreHorizontal size={16} />
            </button>
            {showMenu && (
              <div className="more-menu">
                <button type="button" onClick={() => { p.onUnfriend(); setShowMenu(false); }}>
                  👤 Unfriend
                </button>
                <button type="button" onClick={() => { p.onBlock(); setShowMenu(false); }}>
                  🚫 Block
                </button>
                <button type="button" onClick={() => { p.onReport(); setShowMenu(false); }}>
                  ⚑ Report
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="dm-feed">
        {p.messages.length === 0 && (
          <div className="dm-empty-state">
            <Avatar name={p.friend.displayName} hue={p.friend.avatarHue ?? 220} size={56} />
            <p className="dm-empty-name">@{p.friend.displayName}</p>
            <p className="dm-empty-hint">
              This is the beginning of your conversation with {p.friend.displayName}.
            </p>
          </div>
        )}
        {p.messages.map((row, i) => {
          const prev = p.messages[i - 1];
          const mine = row.fromPublicId === p.userId;
          const name = mine ? p.displayName.trim() || "You" : p.friend.displayName;
          const hue = mine ? p.avatarHue : (p.friend.avatarHue ?? 220);
          const msgReactions = row.reactions ?? {};
          return (
            <div key={row.id ?? `${row.ts}-${i}`} data-msg-id={!mine && row.id ? row.id : undefined}>
              {(!prev || !isSameDay(prev.ts, row.ts)) && (
                <div className="day-sep"><span>{formatTs(row.ts)}</span></div>
              )}
              <div
                className="dm-msg"
                onMouseEnter={() => setHoveredMsg(row.id ?? null)}
                onMouseLeave={() => setHoveredMsg(null)}
              >
                <Avatar name={name} hue={hue} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="dm-msg-head">
                    <strong>{name}</strong>
                    <span className="muted tiny">{formatTs(row.ts)}</span>
                    {mine && row.readAt && <span className="read-receipt">✓✓ Read</span>}
                  </div>
                  <p className="dm-msg-text">{row.text}</p>
                  {Object.keys(msgReactions).length > 0 && (
                    <div className="msg-reactions">
                      {Object.entries(msgReactions).map(([emoji, users]) =>
                        users.length > 0 ? (
                          <span
                            key={emoji}
                            className={`msg-reaction ${users.includes(p.userId) ? "mine" : ""}`}
                            onClick={() => row.id && p.onReact(row.id, emoji)}
                          >
                            {emoji} {users.length}
                          </span>
                        ) : null,
                      )}
                    </div>
                  )}
                  {hoveredMsg === row.id && row.id && (
                    <div className="reaction-bar">
                      {REACTIONS.map((emoji) => (
                        <button key={emoji} type="button" className="reaction-btn" onClick={() => p.onReact(row.id!, emoji)}>
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {p.isTyping && (
          <div className="dm-msg">
            <Avatar name={p.friend.displayName} hue={p.friend.avatarHue ?? 220} size={40} />
            <div className="typing-indicator"><span /><span /><span /></div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {showEmoji && (
        <div className="emoji-bar">
          {QUICK_EMOJIS.map((e) => (
            <button key={e} type="button" className="emoji-pick-btn"
              onClick={() => { setDraft((d) => d + e); inputRef.current?.focus(); }}>
              {e}
            </button>
          ))}
        </div>
      )}

      <div className="dm-compose">
        <button
          type="button"
          className={`plus-btn ${showEmoji ? "active" : ""}`}
          onClick={() => setShowEmoji((v) => !v)}
          title="Emoji"
          aria-label="Emoji picker"
        >
          <Smile size={18} />
        </button>
        <div className="composer-input-wrap">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) { setDraft(e.target.value); p.onTyping(); }
            }}
            placeholder={`Message @${p.friend.displayName}…`}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
            }}
          />
          {draft.length > MAX_CHARS * 0.8 && (
            <span className={`char-counter ${charsLeft < 20 ? "warn" : ""}`}>{charsLeft}</span>
          )}
        </div>
        <button type="button" className="send-btn" onClick={send}
          disabled={!draft.trim() || draft.length > MAX_CHARS} aria-label="Send">
          <Send size={16} />
        </button>
      </div>
    </section>
  );
}
