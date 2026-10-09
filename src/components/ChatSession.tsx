import { useEffect, useRef, useState } from 'react'
import type { ChatMessage, UiPhase } from '../types'

type Props = {
  phase: UiPhase
  partnerLabel: string | null
  partnerPublicId: string | null
  partnerTyping: boolean
  friendRequestSent: boolean
  messages: ChatMessage[]
  onSend: (text: string) => void
  onTyping: () => void
  onNext: () => void
  onCancel: () => void
  onSendFriendRequest: () => void
  onBlock: () => void
  onReport: () => void
}

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥']

export function ChatSession(p: Props) {
  const [draft, setDraft] = useState('')
  const [hoveredMsg, setHoveredMsg] = useState<number | null>(null)
  const [showReport, setShowReport] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const searching = p.phase === 'searching'

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [p.messages, p.partnerTyping])

  const send = () => {
    const text = draft.trim()
    if (!text) return
    p.onSend(text)
    setDraft('')
  }

  return (
    <section className="session">
      <header className="main-top">
        <div className="session-partner-info">
          <h1>
            {searching ? 'Finding a stranger…' : `@${p.partnerLabel ?? 'stranger'}`}
          </h1>
        </div>
        {p.phase === 'chatting' && (
          <div className="session-actions">
            {!p.friendRequestSent ? (
              <button type="button" className="ghost-btn" onClick={p.onSendFriendRequest}>
                Add friend
              </button>
            ) : (
              <span className="req-sent-badge">Request sent ✓</span>
            )}
            <div className="session-more">
              <button
                type="button"
                className="ghost-btn"
                onClick={() => setShowReport((v) => !v)}
              >
                ⋯
              </button>
              {showReport && (
                <div className="more-menu">
                  <button
                    type="button"
                    onClick={() => { p.onBlock(); setShowReport(false) }}
                  >
                    🚫 Block
                  </button>
                  <button
                    type="button"
                    onClick={() => { p.onReport(); setShowReport(false) }}
                  >
                    ⚑ Report
                  </button>
                </div>
              )}
            </div>
            <button type="button" className="skip-btn" onClick={p.onNext}>
              Next
            </button>
          </div>
        )}
        {searching && (
          <button type="button" className="ghost-btn" onClick={p.onCancel}>
            Leave queue
          </button>
        )}
      </header>

      {p.phase === 'chatting' && (
        <p className="system-line">
          You are now chatting with <strong>{p.partnerLabel}</strong>. Say hi!
        </p>
      )}

      <div className="messages">
        {p.messages.map((row, i) => (
          <div
            key={`${row.ts}-${i}`}
            className={`bubble ${row.fromSelf ? 'me' : 'them'}`}
            onMouseEnter={() => setHoveredMsg(i)}
            onMouseLeave={() => setHoveredMsg(null)}
          >
            {row.text}
            {hoveredMsg === i && !row.fromSelf && (
              <div className="reaction-bar">
                {REACTIONS.map((emoji) => (
                  <button key={emoji} type="button" className="reaction-btn" title={emoji}>
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {p.partnerTyping && (
          <div className="typing-indicator them">
            <span /><span /><span />
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="compose">
        <button
          type="button"
          className="esc-btn"
          onClick={searching ? p.onCancel : p.onNext}
        >
          ESC
        </button>
        <button
          type="button"
          className="start-mini"
          onClick={searching ? undefined : p.onNext}
          disabled={searching}
        >
          START
        </button>
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            p.onTyping()
          }}
          placeholder="Send a message."
          disabled={p.phase !== 'chatting'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
        />
      </div>
    </section>
  )
}
