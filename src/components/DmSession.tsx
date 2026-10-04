import { useEffect, useRef, useState } from 'react'
import { formatTs, isSameDay } from '../lib/format'
import type { ChatLine, FriendRow } from '../types'
import { Avatar } from './Avatar'

type Props = {
  friend: FriendRow
  chatId: string | null
  messages: ChatLine[]
  userId: string
  displayName: string
  avatarHue: number
  onSend: (text: string) => void
  onUnfriend: () => void
}

/** Render with `key={friend.publicId}` so the draft resets per conversation. */
export function DmSession(p: Props) {
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [p.messages])

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setDraft('')
    p.onSend(text)
  }

  return (
    <section className="dm-session">
      <header className="dm-top">
        <h1>@{p.friend.displayName}</h1>
        <div className="dm-top-meta">
          {p.chatId && <span className="muted tiny chat-id">/chat/{p.chatId}</span>}
          <button type="button" className="ghost-btn" onClick={p.onUnfriend}>
            Unfriend
          </button>
        </div>
      </header>

      <div className="dm-feed">
        {p.messages.length === 0 && (
          <p className="muted center-note">
            No messages yet. Say hi to {p.friend.displayName}.
          </p>
        )}
        {p.messages.map((row, i) => {
          const prev = p.messages[i - 1]
          const mine = row.fromPublicId === p.userId
          const name = mine ? p.displayName.trim() || 'You' : p.friend.displayName
          const hue = mine ? p.avatarHue : (p.friend.avatarHue ?? 220)
          return (
            <div key={row.id ?? `${row.ts}-${i}`}>
              {(!prev || !isSameDay(prev.ts, row.ts)) && (
                <div className="day-sep">
                  <span>{formatTs(row.ts)}</span>
                </div>
              )}
              <div className="dm-msg">
                <Avatar name={name} hue={hue} size={40} />
                <div>
                  <div className="dm-msg-head">
                    <strong>{name}</strong>
                    <span className="muted tiny">{formatTs(row.ts)}</span>
                  </div>
                  <p className="dm-msg-text">{row.text}</p>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      <div className="dm-compose">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Send a message"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
        />
        <button type="button" className="start-mini" onClick={send}>
          Send
        </button>
      </div>
    </section>
  )
}
