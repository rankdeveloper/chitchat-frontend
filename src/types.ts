export type FriendRow = {
  publicId: string
  displayName: string
  gender?: string
  country?: string
  chatId?: string | null
  lastText?: string
  lastMessageAt?: number
  avatarHue?: number
}

export type ChatLine = {
  id?: string
  fromPublicId: string
  fromDisplayName?: string
  text: string
  ts: number
}

export type ChatMessage = { fromSelf: boolean; text: string; ts: number }

export type UiPhase =
  | 'disconnected'
  | 'registering'
  | 'idle'
  | 'searching'
  | 'chatting'

export type NavTab = 'chat' | 'friends'

export type SettingsTab =
  | 'profile'
  | 'account'
  | 'standing'
  | 'privacy'
  | 'preferences'
  | 'blocked'

export type BannerStyle = 'simple' | 'gradient'

/** Profile as stored on the server. */
export type SavedProfile = {
  publicId: string
  displayName: string
  gender: string
  country: string
  interests: string[]
  interestsOn: boolean
  avatarHue: number
  bannerStyle: BannerStyle
  joinDate: string
}

/** Latest local profile values, readable from socket callbacks without stale closures. */
export type ProfileSnapshot = {
  displayName: string
  gender: string
  country: string
  interests: string[]
  interestsOn: boolean
  avatarHue: number
  bannerStyle: BannerStyle
}

export type ChatFilters = { gender: string; country: string }

export type SocketRef = { current: import('socket.io-client').Socket | null }
