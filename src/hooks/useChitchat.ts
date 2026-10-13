import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { resolveName, toWireProfile } from '../lib/profile'
import { KEYS } from '../lib/storage'
import type {
  ChatFilters,
  ChatLine,
  ChatMessage,
  FriendRow,
  NavTab,
  PendingRequest,
  ProfileSnapshot,
  SavedProfile,
  SocketRef,
  UiPhase,
} from '../types'

type Args = {
  socketRef: SocketRef
  userId: string
  profileRef: { current: ProfileSnapshot }
  applyServerProfile: (p: SavedProfile) => void
  showToast: (msg: string) => void
}

const byRecent = (a: FriendRow, b: FriendRow) =>
  (b.lastMessageAt ?? 0) - (a.lastMessageAt ?? 0)

/** Socket lifecycle + random-chat, friends and DM state. */
export function useChitchat({
  socketRef,
  userId,
  profileRef,
  applyServerProfile,
  showToast,
}: Args) {
  const [phase, setPhase] = useState<UiPhase>('disconnected')
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [nav, setNav] = useState<NavTab>('chat')

  const [partnerLabel, setPartnerLabel] = useState<string | null>(
    () => sessionStorage.getItem('cc_partner_label')
  )
  const [partnerPublicId, setPartnerPublicId] = useState<string | null>(
    () => sessionStorage.getItem('cc_partner_id')
  )
  const [partnerTyping, setPartnerTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const raw = sessionStorage.getItem('cc_messages')
      return raw ? (JSON.parse(raw) as ChatMessage[]) : []
    } catch { return [] }
  })
  const [friendRequestSent, setFriendRequestSent] = useState(false)

  const [friends, setFriends] = useState<FriendRow[]>([])
  const [onlineFriends, setOnlineFriends] = useState<Set<string>>(new Set())
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([])
  const [activeDmId, setActiveDmId] = useState<string | null>(null)
  const [dmChatId, setDmChatId] = useState<string | null>(null)
  const [dmMessages, setDmMessages] = useState<ChatLine[]>([])
  const [dmTyping, setDmTyping] = useState<string | null>(null)

  const activeDmRef = useRef<string | null>(null)
  activeDmRef.current = activeDmId

  const typingTimerRef = useRef<number | undefined>(undefined)
  const dmTypingTimerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const socket = io({
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: true,
    })
    socketRef.current = socket

    const resetSession = () => {
      setPartnerLabel(null)
      setPartnerPublicId(null)
      setPartnerTyping(false)
      setFriendRequestSent(false)
      setMessages([])
      sessionStorage.removeItem('cc_messages')
      sessionStorage.removeItem('cc_partner_label')
      sessionStorage.removeItem('cc_partner_id')
      sessionStorage.removeItem('cc_phase')
    }
    const backToSearching = () => {
      sessionStorage.removeItem('cc_phase')
      setPhase('searching')
      resetSession()
    }
    const applyFriends = (list: FriendRow[]) =>
      setFriends([...(list ?? [])].sort(byRecent))

    socket.on('connect', () => {
      setConnectionError(null)
      const p = profileRef.current
      const name = resolveName(p.displayName)
      localStorage.setItem(KEYS.displayName, name)
      socket.emit(
        'register',
        {
          userPublicId: userId,
          displayName: name,
          profile: toWireProfile(p),
        },
        (err?: string) => {
          if (err) {
            setConnectionError(err)
            setPhase('disconnected')
            sessionStorage.removeItem('cc_phase')
            return
          }
          // Check if we're restoring a chat session
          const saved = sessionStorage.getItem('cc_phase')
          if (saved === 'chatting') {
            // Session will be restored by server, don't change phase
            return
          }
          setPhase('idle')
          sessionStorage.removeItem('cc_phase')
          socket.emit('list_friends')
        },
      )
    })

    socket.on('connect_error', () => {
      setConnectionError(
        'Cannot reach the server. Start the backend on port 3000 (and MongoDB).',
      )
      setPhase('disconnected')
    })

    socket.on('registered', (p?: SavedProfile) => {
      setPhase('idle')
      if (p?.publicId) applyServerProfile(p)
    })
    socket.on('profile', (p: SavedProfile) => {
      if (p?.publicId) applyServerProfile(p)
    })

    // ── random chat ──────────────────────────────────────────────
    socket.on('searching', () => {
      setPhase('searching')
      resetSession()
      setNav('chat')
      setActiveDmId(null)
    })

    socket.on(
      'matched',
      (payload: { partnerPublicId: string; partnerDisplayName: string }) => {
        const label = payload.partnerDisplayName ?? 'Stranger'
        setPhase('chatting')
        setPartnerLabel(label)
        setPartnerPublicId(payload.partnerPublicId)
        setFriendRequestSent(false)
        setMessages([])
        sessionStorage.setItem('cc_phase', 'chatting')
        sessionStorage.setItem('cc_partner_label', label)
        sessionStorage.setItem('cc_partner_id', payload.partnerPublicId)
        sessionStorage.removeItem('cc_messages')
      },
    )

    socket.on(
      'chat_message',
      (payload: { fromPublicId?: string; text: string; ts: number }) => {
        setMessages((m) => {
          const next = [
            ...m,
            {
              fromSelf: payload.fromPublicId === userId,
              text: payload.text,
              ts: payload.ts,
            },
          ]
          sessionStorage.setItem('cc_messages', JSON.stringify(next))
          return next
        })
      },
    )

    socket.on('partner_typing', () => setPartnerTyping(true))
    socket.on('partner_stop_typing', () => setPartnerTyping(false))

    socket.on('dm_partner_typing', (body: { fromPublicId: string }) => {
      if (body.fromPublicId !== activeDmRef.current) return
      setDmTyping(body.fromPublicId)
      window.clearTimeout(dmTypingTimerRef.current)
      dmTypingTimerRef.current = window.setTimeout(() => setDmTyping(null), 3000)
    })
    socket.on('dm_partner_stop_typing', (body: { fromPublicId: string }) => {
      if (body.fromPublicId !== activeDmRef.current) return
      setDmTyping(null)
    })

    socket.on('dm_read_receipt', (body: { messageId: string; readBy: string; readAt: number }) => {
      setDmMessages((m) =>
        m.map((msg) =>
          msg.id === body.messageId ? { ...msg, readAt: body.readAt } : msg,
        ),
      )
    })

    socket.on(
      'message_reacted',
      (body: { messageId: string; emoji: string; users: string[] }) => {
        setDmMessages((m) =>
          m.map((msg) => {
            if (msg.id !== body.messageId) return msg
            const reactions = { ...(msg.reactions ?? {}) }
            if (body.users.length === 0) delete reactions[body.emoji]
            else reactions[body.emoji] = body.users
            return { ...msg, reactions }
          }),
        )
      },
    )

    socket.on('friend_request_sent', () => {
      setFriendRequestSent(true)
      showToast('Friend request sent!')
    })
    socket.on('friend_request_received', (payload: { fromPublicId: string; fromDisplayName: string }) => {
      showToast(`${payload.fromDisplayName} sent you a friend request!`)
      setPendingRequests((prev) => {
        if (prev.some((r) => r.fromPublicId === payload.fromPublicId)) return prev
        return [...prev, { fromPublicId: payload.fromPublicId, fromDisplayName: payload.fromDisplayName }]
      })
    })
    socket.on('friend_request_declined', () => showToast('Friend request declined.'))

    socket.on('user_blocked', (payload: { targetPublicId: string }) => {
      showToast('User blocked.')
      setFriends((prev) => prev.filter((f) => f.publicId !== payload.targetPublicId))
    })
    socket.on('user_reported', () => showToast('User reported. Thank you.'))

    socket.on('friends_online', (ids: string[]) => {
      setOnlineFriends(new Set(ids))
    })
    socket.on('friend_online', (payload: { publicId: string }) => {
      setOnlineFriends((prev) => new Set([...prev, payload.publicId]))
    })
    socket.on('friend_offline', (payload: { publicId: string }) => {
      setOnlineFriends((prev) => {
        const next = new Set(prev)
        next.delete(payload.publicId)
        return next
      })
    })
    socket.on('pending_requests', (list: PendingRequest[]) => {
      setPendingRequests(list)
    })

    socket.on('partner_next', () => {
      showToast('Your chat partner has skipped this chat.')
      backToSearching()
    })
    socket.on('partner_disconnected', () => {
      showToast('Partner left — searching again.')
      backToSearching()
    })
    socket.on('session_reset', resetSession)
    socket.on('search_cancelled', () => {
      setPhase('idle')
      sessionStorage.removeItem('cc_phase')
    })
    socket.on('session_restored', (payload: { partnerPublicId: string; partnerDisplayName: string; randomChatId?: string }) => {
      setPhase('chatting')
      setPartnerLabel(payload.partnerDisplayName ?? 'Stranger')
      setPartnerPublicId(payload.partnerPublicId)
      setMessages([])
      sessionStorage.setItem('cc_phase', 'chatting')
      sessionStorage.setItem('cc_partner_label', payload.partnerDisplayName ?? 'Stranger')
      sessionStorage.setItem('cc_partner_id', payload.partnerPublicId)
      showToast('Reconnected to chat!')
      // Request message history from server
      if (payload.randomChatId) {
        socket.emit('random_history', { randomChatId: payload.randomChatId })
      }
      socket.emit('list_friends')
    })
    socket.on('partner_reconnected', () => {
      showToast('Your partner reconnected!')
    })
    socket.on('random_chat_history', (body: { randomChatId: string; messages: Array<{ fromPublicId: string; text: string; ts: number }> }) => {
      const msgs = body.messages.map(m => ({
        fromSelf: m.fromPublicId === userId,
        text: m.text,
        ts: m.ts,
      }))
      setMessages(msgs)
      sessionStorage.setItem('cc_messages', JSON.stringify(msgs))
    })

    // ── friends & DMs ────────────────────────────────────────────
    socket.on('friends_list', applyFriends)
    socket.on('dm_list', applyFriends)

    socket.on('friend_added', () => {
      showToast('Friend added!')
      setFriendRequestSent(false)
      socket.emit('list_friends')
    })

    socket.on('friend_removed', (payload: { friendPublicId?: string }) => {
      showToast('Friend removed.')
      if (
        payload?.friendPublicId &&
        activeDmRef.current === payload.friendPublicId
      ) {
        setActiveDmId(null)
        setDmMessages([])
        setDmChatId(null)
      }
      socket.emit('list_friends')
    })

    socket.on(
      'dm_history',
      (body: { chatId: string; friendPublicId: string; messages: ChatLine[] }) => {
        if (body.friendPublicId !== activeDmRef.current) return
        setDmChatId(body.chatId)
        setDmMessages(body.messages ?? [])
      },
    )

    socket.on(
      'dm_message',
      (body: {
        chatId: string
        id: string
        fromPublicId: string
        fromDisplayName?: string
        friendPublicId: string
        text: string
        ts: number
      }) => {
        const other =
          body.fromPublicId === userId ? body.friendPublicId : body.fromPublicId

        setFriends((prev) =>
          prev
            .map((f) =>
              f.publicId === other
                ? {
                    ...f,
                    chatId: body.chatId,
                    lastText: body.text,
                    lastMessageAt: body.ts,
                  }
                : f,
            )
            .sort(byRecent),
        )

        if (activeDmRef.current !== other) return
        setDmChatId(body.chatId)
        setDmMessages((m) => {
          if (body.id && m.some((x) => x.id === body.id)) return m
          return [
            ...m,
            {
              id: body.id,
              fromPublicId: body.fromPublicId,
              fromDisplayName: body.fromDisplayName,
              text: body.text,
              ts: body.ts,
            },
          ]
        })
      },
    )

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [socketRef, userId, profileRef, applyServerProfile, showToast])

  // ── actions ────────────────────────────────────────────────────
  const emit = (event: string, payload?: unknown) =>
    socketRef.current?.emit(event, payload)
  const emitWithToast = (event: string, payload: unknown) =>
    socketRef.current?.emit(event, payload, (err?: string) => {
      if (err) showToast(err)
    })

  const startChat = (filters: ChatFilters) => {
    const s = socketRef.current
    if (!s || phase === 'disconnected') return
    const p = profileRef.current
    const name = resolveName(p.displayName)
    const interests = p.interestsOn
      ? p.interests.map((i) => i.toLowerCase()).sort()
      : []

    localStorage.setItem(KEYS.displayName, name)
    s.emit(
      'register',
      { userPublicId: userId, displayName: name, profile: toWireProfile(p) },
      () =>
        emitWithToast('start_chat', {
          genderPref: filters.gender,
          countryPref: filters.country.trim() || 'any',
          interests,
        }),
    )
  }

  const cancelSearch = () => emit('cancel_search')
  const nextChat = () => emit('next')
  const addFriend = () => emitWithToast('add_friend', {})
  const sendFriendRequest = () => {
    if (friendRequestSent) return
    emitWithToast('send_friend_request', {})
  }
  const acceptFriendRequest = (fromPublicId: string) =>
    emitWithToast('accept_friend_request', { fromPublicId })
  const declineFriendRequest = (fromPublicId: string) =>
    emitWithToast('decline_friend_request', { fromPublicId })
  const removeFriend = (friendPublicId: string) =>
    emitWithToast('remove_friend', { friendPublicId })
  const blockUser = (targetPublicId: string) =>
    emitWithToast('block_user', { targetPublicId })
  const reportUser = (targetPublicId: string, reason?: string) =>
    emitWithToast('report_user', { targetPublicId, reason })

  const sendMessage = (text: string) => {
    if (!socketRef.current) return
    setMessages((m) => {
      const next = [...m, { fromSelf: true, text, ts: Date.now() }]
      sessionStorage.setItem('cc_messages', JSON.stringify(next))
      return next
    })
    emitWithToast('chat_message', { text })
    window.clearTimeout(typingTimerRef.current)
    emit('stop_typing')
  }

  let typingDebounce: number | undefined
  const sendTyping = () => {
    emit('typing')
    window.clearTimeout(typingDebounce)
    typingDebounce = window.setTimeout(() => emit('stop_typing'), 2000)
  }

  const openDm = (friend: FriendRow) => {
    setActiveDmId(friend.publicId)
    setDmChatId(friend.chatId ?? null)
    setDmMessages([])
    emit('dm_history', { friendPublicId: friend.publicId })
  }

  const sendDm = (text: string) => {
    if (!activeDmId) return
    emitWithToast('dm_send', { friendPublicId: activeDmId, text })
    emit('dm_stop_typing', { friendPublicId: activeDmId })
  }

  let dmTypingDebounce: number | undefined
  const sendDmTyping = () => {
    if (!activeDmId) return
    emit('dm_typing', { friendPublicId: activeDmId })
    window.clearTimeout(dmTypingDebounce)
    dmTypingDebounce = window.setTimeout(
      () => emit('dm_stop_typing', { friendPublicId: activeDmId }),
      2000,
    )
  }

  const markDmRead = (messageId: string) => {
    if (!activeDmId) return
    emit('dm_read', { friendPublicId: activeDmId, messageId })
  }

  const reactToMessage = (messageId: string, emoji: string) => {
    if (!activeDmId) return
    emit('react_message', { messageId, emoji, friendPublicId: activeDmId })
  }

  const openFriendsTab = () => {
    setNav('friends')
    emit('list_friends')
  }

  const goNewChat = () => {
    setNav('chat')
    setActiveDmId(null)
    if (phase === 'searching') cancelSearch()
  }

  return {
    phase,
    connectionError,
    nav,
    partnerLabel,
    partnerPublicId,
    partnerTyping,
    friendRequestSent,
    messages,
    friends,
    onlineFriends,
    pendingRequests,
    activeDmId,
    dmChatId,
    dmMessages,
    dmTyping,
    startChat,
    cancelSearch,
    nextChat,
    addFriend,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    blockUser,
    reportUser,
    sendMessage,
    sendTyping,
    openDm,
    sendDm,
    sendDmTyping,
    markDmRead,
    reactToMessage,
    openFriendsTab,
    goNewChat,
  }
}
