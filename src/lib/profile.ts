import type { ProfileSnapshot } from '../types'

const ADJECTIVES = [
  'Happy', 'Clever', 'Swift', 'Bright', 'Calm', 'Bold', 'Keen', 'Witty',
  'Jolly', 'Vivid', 'Eager', 'Gentle', 'Lively', 'Proud', 'Quiet', 'Rare',
  'Sleek', 'Tidy', 'Unique', 'Vivacious', 'Warm', 'Zesty', 'Agile', 'Blissful',
  'Cosmic', 'Daring', 'Elegant', 'Fearless', 'Glorious', 'Honest', 'Inspired',
  'Joyful', 'Kinetic', 'Luminous', 'Mighty', 'Noble', 'Optimistic', 'Playful',
]

const NOUNS = [
  'Panda', 'Tiger', 'Eagle', 'Dolphin', 'Phoenix', 'Dragon', 'Wolf', 'Fox',
  'Hawk', 'Owl', 'Raven', 'Swan', 'Penguin', 'Otter', 'Lynx', 'Cheetah',
  'Falcon', 'Crane', 'Stag', 'Badger', 'Otter', 'Puma', 'Viper', 'Cobra',
  'Shark', 'Whale', 'Salmon', 'Trout', 'Heron', 'Stork', 'Albatross', 'Condor',
  'Jaguar', 'Cougar', 'Panther', 'Leopard', 'Lion', 'Bear', 'Moose', 'Elk',
]

export const generateName = (): string => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const num = Math.floor(Math.random() * 10000)
  return `${adj}${noun}${num}`
}

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
