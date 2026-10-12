import {
  DEFAULT_AVATAR_HUE,
  MAX_NAME_CHANGES_PER_DAY,
} from '../constants'
import type { BannerStyle } from '../types'

export const KEYS = {
  userId: 'chitchat_user_id',
  displayName: 'chitchat_display_name',
  interests: 'chitchat_interests',
  avatarHue: 'chitchat_avatar_hue',
  banner: 'chitchat_banner',
  nameChanges: 'chitchat_name_changes',
} as const

export function loadOrCreateUserId(): string {
  let id = localStorage.getItem(KEYS.userId)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEYS.userId, id)
  }
  return id
}

export function loadInterests(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.interests)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.map(String).filter((t) => t.length > 0)
  } catch {
    return []
  }
}

export function loadAvatarHue(): number {
  const raw = localStorage.getItem(KEYS.avatarHue)
  if (raw === null) return DEFAULT_AVATAR_HUE
  const n = Number(raw)
  return Number.isFinite(n) ? n : DEFAULT_AVATAR_HUE
}

export function loadBanner(): BannerStyle {
  return localStorage.getItem(KEYS.banner) === 'gradient' ? 'gradient' : 'simple'
}

export function nameChangeQuota(): { left: number; bump: () => boolean } {
  const today = new Date().toISOString().slice(0, 10)
  let stored = { day: today, used: 0 }
  try {
    const raw = localStorage.getItem(KEYS.nameChanges)
    if (raw) stored = JSON.parse(raw) as typeof stored
  } catch {
    stored = { day: today, used: 0 }
  }
  if (stored.day !== today) stored = { day: today, used: 0 }
  return {
    left: Math.max(0, MAX_NAME_CHANGES_PER_DAY - stored.used),
    bump: () => {
      if (stored.used >= MAX_NAME_CHANGES_PER_DAY) return false
      stored = { day: today, used: stored.used + 1 }
      localStorage.setItem(KEYS.nameChanges, JSON.stringify(stored))
      return true
    },
  }
}
