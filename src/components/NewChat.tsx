import { useState } from "react";
import { GENDER_FILTERS } from "../constants";
import { InterestChips } from "./InterestChips";

type Props = {
  interests: string[];
  interestsOn: boolean;
  gender: string;
  filterGender: string;
  filterCountry: string;
  busy: boolean;
  canStart: boolean;
  onToggleInterest: (tag: string) => void;
  onToggleInterestsOn: () => void;
  onGenderChange: (value: string) => void;
  onFilterGender: (value: string) => void;
  onFilterCountry: (value: string) => void;
  onStart: () => void;
};

export function NewChat(p: Props) {
  const [manage, setManage] = useState(false);

  return (
    <section className="new-chat">
      <header className="main-top">
        <h1>New Chat</h1>
      </header>

      <div className="pref-card">
        <div className="interests-head">
          <div className="interests-title">
            <span>Your Interests</span>
            <span className={`on-badge ${p.interestsOn ? "on" : "off"}`}>
              ({p.interestsOn ? "ON" : "OFF"})
            </span>
          </div>
          <div className="interests-tools">
            <button
              type="button"
              className={`toggle ${p.interestsOn ? "on" : ""}`}
              aria-pressed={p.interestsOn}
              onClick={p.onToggleInterestsOn}
              disabled={p.busy}
            >
              <span className="toggle-knob" />
            </button>
            <button
              type="button"
              className="linkish"
              onClick={() => setManage((v) => !v)}
              disabled={p.busy}
            >
              Manage
            </button>
          </div>
        </div>

        <div
          className={`interests-box ${manage ? "open" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => !p.busy && setManage(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!p.busy) setManage(true);
            }
          }}
        >
          {p.interests.length === 0 ? (
            <p className="empty-interests">
              You have no interests. Click to add some.
            </p>
          ) : (
            <div className="interest-chips">
              {p.interests.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="interest-chip selected"
                  disabled={p.busy}
                  onClick={(e) => {
                    e.stopPropagation();
                    p.onToggleInterest(tag);
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {manage && (
            <div
              className="interest-picker"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="picker-label">Pick interests</p>
              <InterestChips
                selected={p.interests}
                disabled={p.busy}
                onToggle={p.onToggleInterest}
              />
              <button
                type="button"
                className="done-btn"
                onClick={() => setManage(false)}
              >
                Done
              </button>
            </div>
          )}
        </div>

        <div className="gender-block">
          <p className="gender-label">Gender Filter:</p>
          <div className="gender-grid">
            {GENDER_FILTERS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`gender-card ${p.filterGender === opt.value ? "selected" : ""}`}
                disabled={p.busy}
                onClick={() => p.onFilterGender(opt.value)}
              >
                <span className="gender-icon">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <label className="country-field">
          <span>Country (optional)</span>
          <input
            value={p.filterCountry}
            onChange={(e) => p.onFilterCountry(e.target.value)}
            placeholder="Any country"
            disabled={p.busy}
          />
        </label>

        <label className="country-field">
          <span>Your gender (for matching)</span>
          <select
            value={p.gender}
            onChange={(e) => p.onGenderChange(e.target.value)}
            disabled={p.busy}
          >
            <option value="unspecified">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>

        <div className="start-row">
          <button
            type="button"
            className="video-btn"
            title="Video chat coming later"
            disabled
          >
            📹
          </button>
          <button
            type="button"
            className="start-text-btn"
            onClick={p.onStart}
            disabled={!p.canStart}
          >
            <span aria-hidden="true">💬</span>
            Start Text Chat
          </button>
        </div>

        <p className="rules">Be respectful and follow our chat rules.</p>
      </div>
    </section>
  );
}
