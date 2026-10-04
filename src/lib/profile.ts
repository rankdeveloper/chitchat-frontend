import type { ProfileSnapshot } from '../types'

export const resolveName = (name: string) => name.trim() || 'Guest'

/** Shape the server expects for `register` / `update_profile`. */
export const toWireProfile = (p: ProfileSnapshot) => ({
  gender: p.gender,
  country: p.country.trim(),
  interests: p.interests,
  interestsOn: p.interestsOn,
  avatarHue: p.avatarHue,
  bannerStyle: p.bannerStyle,
})
