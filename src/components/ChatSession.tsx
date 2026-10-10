import { useEffect, useRef, useState } from "react";
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

const QUICK_EMOJIS = ["😂", "❤️", "👍", "🔥", "😮", "😢", "🎉", "👋"];

export function ChatSession(p: Props) {
  const [draft, setDraft] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [p.messages, p.partnerTyping]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    p.onSend(text);
    setDraft("");
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  const partner = p.partnerLabel?.trim() || "Stranger";

  if (p.phase === "searching") {
    return (
      <section className="chat-screen">
        <div className="search-panel">
          <div className="search-spinner" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h2>Finding someone…</h2>
          <p>Looking for a new chat partner for you.</p>
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
          <span className="mini-avatar" aria-hidden="true" />
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
              + Friend
            </button>
          ) : (
            <span className="pill-sent">✓ Sent</span>
          )}
          <button
            type="button"
            className="pill-action-btn danger"
            onClick={p.onReport}
            title="Report"
          >
            Report
          </button>
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
          </div>
        ) : (
          p.messages.map((msg, i) => (
            <div
              key={`${msg.ts}-${i}`}
              className={`chat-bubble ${msg.fromSelf ? "self" : "other"}`}
            >
              <span className="bubble-text">{msg.text}</span>
              <span className="bubble-ts">
                {new Date(msg.ts).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
        {p.partnerTyping && (
          <div className="chat-bubble other typing-bubble">
            <span />
            <span />
            <span />
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
              onClick={() => {
                setDraft((d) => d + e);
                inputRef.current?.focus();
              }}
            >
              {e}
            </button>
          ))}
        </div>
      )}

      <div className="composer-panel">
        <button
          type="button"
          className="plus-btn"
          aria-label="Emoji"
          onClick={() => setShowEmoji((v) => !v)}
          title="Emoji"
        >
          😊
        </button>
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            p.onTyping();
          }}
          placeholder="Send a message…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          type="button"
          className="send-btn"
          onClick={handleSend}
          disabled={!draft.trim()}
          aria-label="Send"
        >
          ➤
        </button>
      </div>
    </section>
  );
}
