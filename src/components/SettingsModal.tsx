import { useState } from 'react'
import { SETTINGS_TABS } from '../constants'
import type { BannerStyle, SettingsTab } from '../types'
import { Avatar } from './Avatar'
import { InterestChips } from './InterestChips'

type Props = {
  displayName: string
  avatarHue: number
  bannerStyle: BannerStyle
  interests: string[]
  interestsOn: boolean
  nameChangesLeft: number
  onClose: () => void
  onCycleAvatar: () => void
  onResetAvatar: () => void
  onBanner: (style: BannerStyle) => void
  onToggleInterest: (tag: string) => void
  /** Returns true when the name editor should close. */
  onCommitName: (name: string) => boolean
}

export function SettingsModal(p: Props) {
  const [tab, setTab] = useState<SettingsTab>('profile')
  const [editing, setEditing] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const name = p.displayName.trim() || 'Guest'

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
            {tab !== 'profile' ? (
              <p className="muted">
                {tab.charAt(0).toUpperCase() + tab.slice(1)} settings are not
                available in this local build yet.
              </p>
            ) : (
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
                  <span className="settings-label">
                    Interests ({p.interestsOn ? 'ON' : 'OFF'})
                  </span>
                  <InterestChips selected={p.interests} onToggle={p.onToggleInterest} />
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
