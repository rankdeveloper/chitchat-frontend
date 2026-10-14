import { useState } from "react";
import {
  AtSign,
  Ban,
  Bell,
  Check,
  Globe,
  KeyRound,
  Mars,
  Palette,
  Pencil,
  RefreshCw,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Smile,
  Sparkles,
  Trash2,
  User,
  Venus,
  VenusAndMars,
  Volume2,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { COUNTRY_OPTIONS, SETTINGS_TABS } from "../constants";
import type { BannerStyle, SettingsTab } from "../types";
import { Avatar } from "./Avatar";
import { InterestChips } from "./InterestChips";

type Props = {
  displayName: string;
  avatarHue: number;
  bannerStyle: BannerStyle;
  gender: string;
  country: string;
  interests: string[];
  interestsOn: boolean;
  nameChangesLeft: number;
  blockedUsers: Array<{
    publicId: string;
    displayName: string;
    blockedAt: number;
  }>;
  typingSoundEnabled: boolean;
  notifSoundEnabled: boolean;
  onClose: () => void;
  onCycleAvatar: () => void;
  onResetAvatar: () => void;
  onBanner: (style: BannerStyle) => void;
  onToggleInterest: (tag: string) => void;
  onCommitName: (name: string) => boolean;
  onGenderChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onToggleTypingSound: () => void;
  onToggleNotifSound: () => void;
  onUnblockUser?: (publicId: string) => void;
};

const TAB_ICONS: Record<string, LucideIcon> = {
  profile: User,
  account: KeyRound,
  privacy: Shield,
  preferences: SlidersHorizontal,
  blocked: Ban,
};

function GenderIcon({ g }: { g: string }) {
  const Icon = g === "male" ? Mars : g === "female" ? Venus : VenusAndMars;
  return <Icon size={16} className={`gi gi-${g}`} aria-hidden="true" />;
}

export function SettingsModal(p: Props) {
  const [tab, setTab] = useState<SettingsTab>("profile");
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const name = p.displayName.trim() || "Guest";

  const handleTypingSoundChange = () => {
    p.onToggleTypingSound();
  };

  const handleNotifSoundChange = () => {
    p.onToggleNotifSound();
  };

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
          <button
            type="button"
            className="icon-btn"
            onClick={p.onClose}
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </header>

        <div className="settings-body">
          <nav className="settings-nav">
            {SETTINGS_TABS.map(([id, label]) => {
              const Icon = TAB_ICONS[id] ?? User;
              return (
                <button
                  key={id}
                  type="button"
                  className={tab === id ? "active" : ""}
                  onClick={() => setTab(id)}
                >
                  <Icon size={18} />
                  {label}
                </button>
              );
            })}
          </nav>

          <div className="settings-content">
            {tab === "profile" && (
              <>
                <div className="settings-row">
                  <span className="settings-label">
                    <Smile size={18} />
                    Avatar
                  </span>
                  <div className="avatar-edit">
                    <Avatar name={name} hue={p.avatarHue} size={72} />
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={p.onCycleAvatar}
                    >
                      <RefreshCw size={15} />
                      Change
                    </button>
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={p.onResetAvatar}
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>
                  </div>
                  <p className="muted tiny">
                    Avatars cycle through colors. Do not upload inappropriate
                    avatars.
                  </p>
                </div>

                <div className="settings-row">
                  <span className="settings-label">
                    <Palette size={18} />
                    Banner
                  </span>
                  <div className="banner-picks">
                    {(["simple", "gradient"] as const).map((style) => (
                      <button
                        key={style}
                        type="button"
                        className={`banner-pick ${style} ${
                          p.bannerStyle === style ? "selected" : ""
                        }`}
                        onClick={() => p.onBanner(style)}
                      >
                        {style === "simple" ? "Simple" : "Gradient"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-row">
                  <span className="settings-label">
                    <AtSign size={18} />
                    Username
                  </span>
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
                        onClick={() =>
                          p.onCommitName(nameDraft) && setEditing(false)
                        }
                      >
                        <Check size={15} />
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
                          setNameDraft(p.displayName);
                          setEditing(true);
                        }}
                      >
                        <Pencil size={15} />
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
                    <VenusAndMars size={18} />
                    Gender
                  </span>
                  <div className="seg-control">
                    {(["male", "unspecified", "female"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        className={`seg-btn ${p.gender === g ? "active" : ""}`}
                        onClick={() => p.onGenderChange(g)}
                      >
                        <GenderIcon g={g} />
                        {g === "unspecified"
                          ? "Other"
                          : g.charAt(0).toUpperCase() + g.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-row">
                  <span className="settings-label">
                    <Globe size={18} />
                    Country
                  </span>
                  <div className="select-wrap">
                    <select
                      value={p.country || "any"}
                      onChange={(e) =>
                        p.onCountryChange(
                          e.target.value === "any" ? "" : e.target.value,
                        )
                      }
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="settings-row">
                  <span className="settings-label">
                    <Sparkles size={18} />
                    Interests ({p.interestsOn ? "ON" : "OFF"})
                  </span>
                  <InterestChips
                    selected={p.interests}
                    onToggle={p.onToggleInterest}
                  />
                </div>
              </>
            )}

            {tab === "account" && (
              <>
                <div className="settings-row">
                  <span className="settings-label">
                    <KeyRound size={18} />
                    Account Info
                  </span>
                  <p className="muted">
                    Your account is linked to your browser's local storage.
                  </p>
                </div>
                <div className="settings-row">
                  <span className="settings-label">
                    <Shield size={18} />
                    Data
                  </span>
                  <p className="muted tiny">
                    Profile data is stored locally and synced with our servers
                    when you chat.
                  </p>
                </div>
              </>
            )}

            {tab === "privacy" && (
              <>
                <div className="settings-row">
                  <span className="settings-label">
                    <Shield size={18} />
                    Privacy
                  </span>
                  <p className="muted">
                    Your profile is only visible to people you chat with or add
                    as friends.
                  </p>
                </div>
                <div className="settings-row">
                  <span className="settings-label">
                    <Ban size={18} />
                    Blocked Users
                  </span>
                  <p className="muted tiny">
                    Blocked users cannot see your profile or message you.
                  </p>
                </div>
              </>
            )}

            {tab === "preferences" && (
              <>
                <div className="settings-row settings-toggle-row">
                  <span className="settings-icon-tile">
                    <Volume2 size={20} />
                  </span>
                  <div className="settings-toggle-text">
                    <span className="settings-label">Typing Sound</span>
                    <p className="muted tiny">
                      Play sound when typing in chat.
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`toggle-switch ${p.typingSoundEnabled ? "on" : ""}`}
                    onClick={handleTypingSoundChange}
                    aria-label="Toggle typing sound"
                    aria-pressed={p.typingSoundEnabled}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>
                <div className="settings-row settings-toggle-row">
                  <span className="settings-icon-tile">
                    <Bell size={20} />
                  </span>
                  <div className="settings-toggle-text">
                    <span className="settings-label">Notification Sound</span>
                    <p className="muted tiny">
                      Play sound for new messages and friend requests.
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`toggle-switch ${p.notifSoundEnabled ? "on" : ""}`}
                    onClick={handleNotifSoundChange}
                    aria-label="Toggle notification sound"
                    aria-pressed={p.notifSoundEnabled}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>
              </>
            )}

            {tab === "blocked" && (
              <div className="settings-empty">
                {p.blockedUsers.length === 0 ? (
                  <>
                    <span className="settings-icon-tile large">
                      <ShieldCheck size={30} />
                    </span>
                    <strong>No blocked users</strong>
                    <p className="muted">You haven't blocked anyone yet.</p>
                  </>
                ) : (
                  <div className="blocked-list" style={{ width: "100%" }}>
                    {p.blockedUsers.map((user) => (
                      <div
                        key={user.publicId}
                        className="blocked-item"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                          padding: "10px 12px",
                          borderRadius: 12,
                          background: "rgba(255,255,255,0.04)",
                          marginBottom: 8,
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {user.displayName}
                          </div>
                          <div className="muted tiny">
                            Blocked{" "}
                            {new Date(user.blockedAt).toLocaleDateString()}
                          </div>
                        </div>
                        {p.onUnblockUser && (
                          <button
                            type="button"
                            className="ghost-btn"
                            onClick={() => {
                              if (p.onUnblockUser) {
                                p.onUnblockUser(user.publicId);
                              }
                            }}
                          >
                            Unblock
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
