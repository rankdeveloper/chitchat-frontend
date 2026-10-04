import type { ReactNode } from 'react'

export type UserProfile = {
  publicId: string
  displayName: string
  gender: string
  country: string
  interests: string[]
  interestsOn: boolean
  avatarHue: number
  bannerStyle: 'simple' | 'gradient'
  joinDate: string
}

type Props = {
  open: boolean
  profile: UserProfile
  onClose: () => void
  onEditProfile: () => void
  avatar: ReactNode
}

export function ProfileCard({
  open,
  profile,
  onClose,
  onEditProfile,
  avatar,
}: Props) {
  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="profile-card"
        role="dialog"
        aria-label="Your profile"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`profile-banner ${
            profile.bannerStyle === 'gradient' ? 'gradient' : 'simple'
          }`}
        />
        <div className="profile-card-body">
          <div className="profile-avatar-wrap">{avatar}</div>
          <h2 className="profile-name">
            {profile.displayName.trim() || 'Guest'}
          </h2>
          <p className="profile-id">ID: {profile.publicId}</p>
          <button
            type="button"
            className="profile-edit-btn"
            onClick={onEditProfile}
          >
            Edit Profile
          </button>

          <div className="profile-info-box">
            <div className="profile-field">
              <span className="profile-label">Chitchat join date</span>
              <span className="profile-value">
                {profile.joinDate || '—'}
              </span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Interests</span>
              <div className="profile-interest-chips">
                {profile.interests.length === 0 ? (
                  <span className="interest-chip muted-chip">No interests</span>
                ) : (
                  profile.interests.map((tag) => (
                    <span key={tag} className="interest-chip selected">
                      {tag}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
