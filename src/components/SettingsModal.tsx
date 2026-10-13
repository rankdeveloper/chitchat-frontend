import { useState } from 'react'
import { COUNTRY_OPTIONS, SETTINGS_TABS } from '../constants'
import type { BannerStyle, SettingsTab } from '../types'
import { Avatar } from './Avatar'
import { InterestChips } from './InterestChips'

type Props = {
  displayName: string
  avatarHue: number
  bannerStyle: BannerStyle
  gender: string
  country: string
  interests: string[]
  interestsOn: boolean
  nameChangesLeft: number
  onClose: () => void
  onCycleAvatar: () => void
  onResetAvatar: () => void
  onBanner: (style: BannerStyle) => void
  onToggleInterest: (tag: string) => void
  onCommitName: (name: string) => boolean
  onGenderChange: (value: string) => void
  onCountryChange: (value: string) => void
}

export function SettingsModal(p: Props) {
  const [tab, setTab] = useState<SettingsTab>('profile')
  const [editing, setEditing] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const [typingSound, setTypingSound] = useState(() => localStorage.getItem('cc_typing_sound') !== 'false')
  const [notifSound, setNotifSound] = useState(() => localStorage.getItem('cc_notif_sound') !== 'false')
  const name = p.displayName.trim() || 'Guest'

  const handleTypingSoundChange = (val: boolean) => {
    setTypingSound(val)
    localStorage.setItem('cc_typing_sound', String(val))
  }

  const handleNotifSoundChange = (val: boolean) => {
    setNotifSound(val)
    localStorage.setItem('cc_notif_sound', String(val))
  }

  return (
    <div className="modal-backdrop" onClick={p.onClose}>
      <section
        className="settings-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="settings-title"
      >
        <header className="settings-head">
          <h2 id="settings-title">Settings</h2>
          <button type="button" className="icon-btn" onClick={p.onClose}>
            ×
          </button>
        </header>

        <div className="settings-body">
          <nav className="settings-nav">
            {SETTINGS_TABS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={tab === id ? 'active' : ''}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="settings-content">
            {tab === 'profile' && (
              <>
                <div className="settings-row">
                  <span className="settings-label">Avatar</span>
                  <div className="avatar-edit">
                    <Avatar name={name} hue={p.avatarHue} size={72} />
                    <button type="button" className="ghost-btn" onClick={p.onCycleAvatar}>
                      Change
                    </button>
                    <button type="button" className="ghost-btn" onClick={p.onResetAvatar}>
                      Remove
                    </button>
                  </div>
                  <p className="muted tiny">
                    Avatars cycle through colors. Do not upload inappropriate
                    avatars.
                  </p>
                </div>

                <div className="settings-row">
                  <span className="settings-label">Banner</span>
                  <div className="banner-picks">
                    {(['simple', 'gradient'] as const).map((style) => (
                      <button
                        key={style}
                        type="button"
                        className={`banner-pick ${style} ${
                          p.bannerStyle === style ? 'selected' : ''
                        }`}
                        onClick={() => p.onBanner(style)}
                      >
                        {style === 'simple' ? 'Simple' : 'Gradient'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-row">
                  <span className="settings-label">Username</span>
                  {editing ? (
                    <div className="name-edit">
                      <input
                        value={nameDraft}
                        onChange={(e) => setNameDraft(e.target.value)}
                        maxLength={24}
                      />
                      <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => p.onCommitName(nameDraft) && setEditing(false)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="name-edit">
                      <strong>{name}</strong>
                      <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => {
                          setNameDraft(p.displayName)
                          setEditing(true)
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                  <p className="muted tiny">
                    You have {p.nameChangesLeft} name changes left for today.
                  </p>
                </div>

                <div className="settings-row">
                  <span className="settings-label">Gender</span>
                  <div className="seg-control">
                    {(['male', 'unspecified', 'female'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        className={`seg-btn ${p.gender === g ? 'active' : ''}`}
                        onClick={() => p.onGenderChange(g)}
                      >
                        {g === 'unspecified' ? 'Other' : g.charAt(0).toUpperCase() + g.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-row">
                  <span className="settings-label">Country</span>
                  <div className="select-wrap">
                    <select
                      value={p.country || 'any'}
                      onChange={(e) => p.onCountryChange(e.target.value === 'any' ? '' : e.target.value)}
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="settings-row">
                  <span className="settings-label">
                    Interests ({p.interestsOn ? 'ON' : 'OFF'})
                  </span>
                  <InterestChips selected={p.interests} onToggle={p.onToggleInterest} />
                </div>
              </>
            )}

            {tab === 'account' && (
              <>
                <div className="settings-row">
                  <span className="settings-label">Account Info</span>
                  <p className="muted">Your account is linked to your browser's local storage.</p>
                </div>
                <div className="settings-row">
                  <span className="settings-label">Data</span>
                  <p className="muted tiny">Profile data is stored locally and synced with our servers when you chat.</p>
                </div>
              </>
            )}

            {tab === 'privacy' && (
              <>
                <div className="settings-row">
                  <span className="settings-label">Privacy</span>
                  <p className="muted">Your profile is only visible to people you chat with or add as friends.</p>
                </div>
                <div className="settings-row">
                  <span className="settings-label">Blocked Users</span>
                  <p className="muted tiny">Blocked users cannot see your profile or message you.</p>
                </div>
              </>
            )}

            {tab === 'preferences' && (
              <>
                <div className="settings-row">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span className="settings-label">Typing Sound</span>
                      <p className="muted tiny">Play sound when typing in chat.</p>
                    </div>
                    <button
                      type="button"
                      className={`toggle-switch ${typingSound ? 'on' : ''}`}
                      onClick={() => handleTypingSoundChange(!typingSound)}
                      aria-label="Toggle typing sound"
                    >
                      <span className="toggle-knob" />
                    </button>
                  </div>
                </div>
                <div className="settings-row">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span className="settings-label">Notification Sound</span>
                      <p className="muted tiny">Play sound for new messages and friend requests.</p>
                    </div>
                    <button
                      type="button"
                      className={`toggle-switch ${notifSound ? 'on' : ''}`}
                      onClick={() => handleNotifSoundChange(!notifSound)}
                      aria-label="Toggle notification sound"
                    >
                      <span className="toggle-knob" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {tab === 'blocked' && (
              <>
                <div className="settings-row">
                  <span className="settings-label">Blocked Users</span>
                  <p className="muted">You haven't blocked anyone yet.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
