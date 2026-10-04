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

  const [partnerLabel, setPartnerLabel] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const [friends, setFriends] = useState<FriendRow[]>([])
  const [activeDmId, setActiveDmId] = useState<string | null>(null)
  const [dmChatId, setDmChatId] = useState<string | null>(null)
  const [dmMessages, setDmMessages] = useState<ChatLine[]>([])

  const activeDmRef = useRef<string | null>(null)
  activeDmRef.current = activeDmId

  useEffect(() => {
    const socket = io({
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: true,
    })
    socketRef.current = socket

    const resetSession = () => {
      setPartnerLabel(null)
      setMessages([])
    }
    const backToSearching = () => {
      setPhase('searching')
      resetSession()
    }
    const applyFriends = (list: FriendRow[]) =>
      setFriends([...(list ?? [])].sort(byRecent))

    socket.on('connect', () => {
      setConnectionError(null)
      setPhase('registering')
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
            return
          }
          setPhase('idle')
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
        setPhase('chatting')
        setPartnerLabel(payload.partnerDisplayName ?? 'Stranger')
        setMessages([])
      },
    )

    socket.on(
      'chat_message',
      (payload: { fromPublicId?: string; text: string; ts: number }) => {
        setMessages((m) => [
          ...m,
          {
            fromSelf: payload.fromPublicId === userId,
            text: payload.text,
            ts: payload.ts,
          },
        ])
      },
    )

    socket.on('partner_next', () => {
      showToast('Your chat partner has skipped this chat.')
      backToSearching()
    })
    socket.on('partner_disconnected', () => {
      showToast('Partner left — searching again.')
      backToSearching()
    })
    socket.on('session_reset', resetSession)
    socket.on('search_cancelled', () => setPhase('idle'))

    // ── friends & DMs ────────────────────────────────────────────
    socket.on('friends_list', applyFriends)
    socket.on('dm_list', applyFriends)

    socket.on('friend_added', () => {
      showToast('Added to friends — open Direct Messages.')
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
  const removeFriend = (friendPublicId: string) =>
    emitWithToast('remove_friend', { friendPublicId })

  const sendMessage = (text: string) => {
    if (!socketRef.current) return
    setMessages((m) => [...m, { fromSelf: true, text, ts: Date.now() }])
    emitWithToast('chat_message', { text })
  }

  const openDm = (friend: FriendRow) => {
    setNav('friends')
    setActiveDmId(friend.publicId)
    setDmChatId(friend.chatId ?? null)
    setDmMessages([])
    emit('dm_history', { friendPublicId: friend.publicId })
  }

  const sendDm = (text: string) => {
    if (!activeDmId) return
    emitWithToast('dm_send', { friendPublicId: activeDmId, text })
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
    messages,
    friends,
    activeDmId,
    dmChatId,
    dmMessages,
    startChat,
    cancelSearch,
    nextChat,
    addFriend,
    removeFriend,
    sendMessage,
    openDm,
    sendDm,
    openFriendsTab,
    goNewChat,
  }
}
