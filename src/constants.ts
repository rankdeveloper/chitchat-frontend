export const INTEREST_OPTIONS = [
  'Gaming', 'Anime', 'Music', 'Movies', 'Sports',
  'Football', 'Basketball', 'Travel', 'Cooking', 'Art',
  'Photography', 'Reading', 'Fitness', 'Technology', 'JavaScript',
  'Python', 'Fashion', 'Dance', 'Memes', 'Crypto',
] as const

export const COUNTRY_OPTIONS = [
  { code: 'any', name: 'Any Country' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'PH', name: 'Philippines' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
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
