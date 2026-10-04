export const INTEREST_OPTIONS = [
  'JavaScript',
  'Football',
  'Gaming',
  'Anime',
  'Music',
] as const

export const AVATAR_HUES = [45, 280, 200, 340, 140, 20]
export const DEFAULT_AVATAR_HUE = 45
export const MAX_NAME_CHANGES_PER_DAY = 3
export const TOAST_MS = 3200

export const SETTINGS_TABS = [
  ['profile', 'Profile'],
  ['account', 'Account'],
  ['standing', 'Standing'],
  ['privacy', 'Privacy'],
  ['preferences', 'Preferences'],
  ['blocked', 'Blocked'],
] as const

export const GENDER_FILTERS = [
  { value: 'male', label: 'Male', icon: '♂' },
  { value: 'any', label: 'Both', icon: '⚥' },
  { value: 'female', label: 'Female', icon: '♀' },
] as const

export const STATUS_LABELS = {
  disconnected: 'Offline',
  registering: 'Connecting…',
  idle: 'Online · ready',
  searching: 'In queue…',
  chatting: 'Live chat',
} as const
