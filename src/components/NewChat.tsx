import { useState } from "react";
import { COUNTRY_OPTIONS, INTEREST_OPTIONS } from "../constants";

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
  const [interestSearch, setInterestSearch] = useState("");

  const filtered = interestSearch.trim()
    ? INTEREST_OPTIONS.filter((t) =>
        t.toLowerCase().includes(interestSearch.toLowerCase()),
      )
    : INTEREST_OPTIONS;

  return (
    <section className="new-chat-screen">
      <div className="brand-hero">
        <div className="brand-badge" aria-hidden="true">
          <span className="brand-eye" />
        </div>
        <h1>Chitchat</h1>
        <p className="brand-tagline">Talk to strangers, make friends.</p>
      </div>

      <div className="prompt-card">
        <div className="nc-section">
          <div className="nc-section-head">
            <span className="nc-label">Interests</span>
            <button
              type="button"
              className={`toggle-switch ${p.interestsOn ? "on" : ""}`}
              aria-label="Toggle interests matching"
              onClick={p.onToggleInterestsOn}
              disabled={p.busy}
            >
              <span className="toggle-knob" />
            </button>
          </div>
          <input
            type="text"
            className="interest-input"
            value={interestSearch}
            onChange={(e) => setInterestSearch(e.target.value)}
            placeholder="Search interests…"
            disabled={p.busy || !p.interestsOn}
          />
          <div className="interest-chip-row">
            {filtered.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`interest-chip ${p.interests.includes(tag) ? "selected" : ""}`}
                onClick={() => p.onToggleInterest(tag)}
                disabled={p.busy || !p.interestsOn}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="nc-filters">
          <div className="nc-filter-group">
            <label className="nc-label">I am</label>
            <div className="seg-control">
              {(["male", "unspecified", "female"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`seg-btn ${p.gender === g ? "active" : ""}`}
                  onClick={() => p.onGenderChange(g)}
                  disabled={p.busy}
                >
                  {g === "unspecified"
                    ? "Other"
                    : g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="nc-filter-group">
            <label className="nc-label">Looking for</label>
            <div className="seg-control">
              {(["male", "any", "female"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`seg-btn ${p.filterGender === g ? "active" : ""}`}
                  onClick={() => p.onFilterGender(g)}
                  disabled={p.busy}
                >
                  {g === "any"
                    ? "Anyone"
                    : g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="nc-filter-group">
            <label className="nc-label">Country</label>
            <div className="select-wrap">
              <select
                value={p.filterCountry || "any"}
                onChange={(e) =>
                  p.onFilterCountry(
                    e.target.value === "any" ? "" : e.target.value,
                  )
                }
                disabled={p.busy}
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="start-chat-btn"
        onClick={p.onStart}
        disabled={!p.canStart || p.busy}
      >
        <span className="chat-emoji" aria-hidden="true">
          ✉
        </span>
        Start Text Chat
      </button>
    </section>
  );
}
