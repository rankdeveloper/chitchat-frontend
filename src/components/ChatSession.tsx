import { useEffect, useRef, useState } from "react";
import { Flag, MoreHorizontal, Send, Smile, UserPlus } from "lucide-react";
import type { ChatMessage, UiPhase } from "../types";

type Props = {
  phase: UiPhase;
  partnerLabel: string | null;
  partnerPublicId: string | null;
  partnerTyping: boolean;
  friendRequestSent: boolean;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  onTyping: () => void;
  onNext: () => void;
  onCancel: () => void;
  onSendFriendRequest: () => void;
  onBlock: () => void;
  onReport: () => void;
};

const QUICK_EMOJIS = ["😂", "❤️", "👍", "🔥", "😮", "😢", "🎉", "👋", "😍", "🤣", "😭", "🙏"];
const MAX_CHARS = 500;

export function ChatSession(p: Props) {
  const [draft, setDraft] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [reactions, setReactions] = useState<Record<number, string[]>>({});
  const [showMenu, setShowMenu] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [p.messages, p.partnerTyping]);

  useEffect(() => {
    if (p.phase === "chatting") inputRef.current?.focus();
  }, [p.phase]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text || text.length > MAX_CHARS) return;
    p.onSend(text);
    setDraft("");
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  const toggleReaction = (idx: number, emoji: string) => {
    setReactions((prev) => {
      const cur = prev[idx] ?? [];
      const has = cur.includes(emoji);
      return { ...prev, [idx]: has ? cur.filter((e) => e !== emoji) : [...cur, emoji] };
    });
  };

  const partner = p.partnerLabel?.trim() || "Stranger";
  const charsLeft = MAX_CHARS - draft.length;

  if (p.phase === "searching") {
    return (
      <section className="chat-screen">
        <div className="search-panel">
          <div className="search-pulse-ring" aria-hidden="true">
            <div className="search-pulse-inner">🔍</div>
          </div>
          <h2>Finding someone…</h2>
          <p>Searching for a chat partner that matches your preferences.</p>
          <div className="search-actions">
            <button type="button" className="ghost-btn" onClick={p.onCancel}>
              Cancel
            </button>
            <button type="button" className="primary-btn" onClick={p.onNext}>
              Skip
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="chat-screen">
      <div className="chat-header-pill">
        <div className="chat-partner-info">
          <div className="partner-avatar-ring">
            <span className="mini-avatar" aria-hidden="true" />
            <span className="partner-online-dot" />
          </div>
          <div>
            <span className="chat-partner-name">@{partner}</span>
            <span className="chat-partner-sub">Stranger · Random chat</span>
          </div>
        </div>

        <div className="chat-header-actions">
          {!p.friendRequestSent ? (
            <button
              type="button"
              className="pill-action-btn add"
              onClick={p.onSendFriendRequest}
              title="Add friend"
            >
              <UserPlus size={13} /> Friend
            </button>
          ) : (
            <span className="pill-sent">✓ Sent</span>
          )}

          <div className="report-wrap">
            <button
              type="button"
              className="pill-action-btn danger"
              onClick={() => setShowMenu((v) => !v)}
              title="More options"
            >
              <MoreHorizontal size={14} />
            </button>
            {showMenu && (
              <div className="report-menu">
                <button type="button" onClick={() => { p.onReport(); setShowMenu(false); }}>
                  <Flag size={13} /> Report user
                </button>
                <button type="button" onClick={() => { p.onBlock(); setShowMenu(false); }}>
                  🚫 Block user
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="pill-action-btn next"
            onClick={p.onNext}
            title="Next chat"
          >
            Next ›
          </button>
        </div>
      </div>

      <div className="messages-list" aria-live="polite">
        {p.messages.length === 0 ? (
          <div className="empty-state">
            <span>👋</span>
            <p>Say hello to @{partner}!</p>
            <p className="empty-hint">Be kind and respectful.</p>
          </div>
        ) : (
          p.messages.map((msg, i) => (
            <div
              key={`${msg.ts}-${i}`}
              className={`bubble-wrap ${msg.fromSelf ? "self" : "other"}`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className={`chat-bubble ${msg.fromSelf ? "self" : "other"}`}>
                <span className="bubble-text">{msg.text}</span>
                <span className="bubble-ts">
                  {new Date(msg.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {msg.fromSelf && <span className="bubble-check">✓</span>}
                </span>
              </div>
              {reactions[i] && reactions[i].length > 0 && (
                <div className={`bubble-reactions ${msg.fromSelf ? "self" : "other"}`}>
                  {reactions[i].map((e) => (
                    <span key={e} className="bubble-reaction" onClick={() => toggleReaction(i, e)}>{e}</span>
                  ))}
                </div>
              )}
              {hoveredIdx === i && (
                <div className={`bubble-react-bar ${msg.fromSelf ? "self" : "other"}`}>
                  {["👍", "❤️", "😂", "😮", "😢"].map((e) => (
                    <button
                      key={e}
                      type="button"
                      className={`react-pick ${(reactions[i] ?? []).includes(e) ? "active" : ""}`}
                      onClick={() => toggleReaction(i, e)}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
        {p.partnerTyping && (
          <div className="bubble-wrap other">
            <div className="chat-bubble other typing-bubble">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {showEmoji && (
        <div className="emoji-bar">
          {QUICK_EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              className="emoji-pick-btn"
              onClick={() => { setDraft((d) => d + e); inputRef.current?.focus(); }}
            >
              {e}
            </button>
          ))}
        </div>
      )}

      <div className="composer-panel">
        <button
          type="button"
          className={`plus-btn ${showEmoji ? "active" : ""}`}
          aria-label="Emoji"
          onClick={() => setShowEmoji((v) => !v)}
          title="Emoji"
        >
          <Smile size={18} />
        </button>
        <div className="composer-input-wrap">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setDraft(e.target.value);
                p.onTyping();
              }
            }}
            placeholder="Send a message…"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
          />
          {draft.length > MAX_CHARS * 0.8 && (
            <span className={`char-counter ${charsLeft < 20 ? "warn" : ""}`}>{charsLeft}</span>
          )}
        </div>
        <button
          type="button"
          className="send-btn"
          onClick={handleSend}
          disabled={!draft.trim() || draft.length > MAX_CHARS}
          aria-label="Send"
        >
          <Send size={16} />
        </button>
      </div>
    </section>
  );
}
