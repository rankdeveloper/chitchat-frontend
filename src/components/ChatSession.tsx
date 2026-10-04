import { useEffect, useRef, useState } from 'react'
import type { ChatMessage, UiPhase } from '../types'

type Props = {
  phase: UiPhase
  partnerLabel: string | null
  messages: ChatMessage[]
  onSend: (text: string) => void
  onNext: () => void
  onCancel: () => void
  onAddFriend: () => void
}

export function ChatSession(p: Props) {
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const searching = p.phase === 'searching'

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [p.messages])

  const send = () => {
    const text = draft.trim()
    if (!text) return
    p.onSend(text)
    setDraft('')
  }

  return (
    <section className="session">
      <header className="main-top">
        <h1>
          {searching ? 'Finding a stranger…' : `@${p.partnerLabel ?? 'stranger'}`}
        </h1>
        {p.phase === 'chatting' && (
          <div className="session-actions">
            <button type="button" className="ghost-btn" onClick={p.onAddFriend}>
              Add friend
            </button>
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
          >
            {row.text}
          </div>
        ))}
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
          onChange={(e) => setDraft(e.target.value)}
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
