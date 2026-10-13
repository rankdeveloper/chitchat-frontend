import { useRef, useState } from "react";
import {
  ChevronDown,
  Globe,
  Mars,
  MessageSquare,
  Search,
  User,
  Venus,
  VenusAndMars,
  X,
} from "lucide-react";
import { COUNTRY_OPTIONS, INTEREST_SUGGESTIONS } from "../constants";
import { Logo, Sparkles } from "./LandingPage";

type Props = {
  interests: string[];
  interestsOn: boolean;
  gender: string;
  filterGender: string;
  filterCountry: string;
  busy: boolean;
  canStart: boolean;
  onlineCount: number;
  onToggleInterest: (tag: string) => void;
  onToggleInterestsOn: () => void;
  onGenderChange: (value: string) => void;
  onFilterGender: (value: string) => void;
  onFilterCountry: (value: string) => void;
  onStart: () => void;
};

function GenderIcon({ g }: { g: string }) {
  const Icon = g === "male" ? Mars : g === "female" ? Venus : VenusAndMars;
  return <Icon size={16} className={`gi gi-${g}`} aria-hidden="true" />;
}

export function NewChat(p: Props) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const normalized = input.trim().toLowerCase();
  const suggestions = normalized
    ? INTEREST_SUGGESTIONS.filter(
        (s) =>
          s.toLowerCase().includes(normalized) &&
          !p.interests.map((t) => t.toLowerCase()).includes(s.toLowerCase()),
      )
    : [];

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag || tag.length > 32) return;
    if (p.interests.map((t) => t.toLowerCase()).includes(tag.toLowerCase()))
      return;
    p.onToggleInterest(tag);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <section className="new-chat-screen">
      <Sparkles />

      <div className="nc-body">
        <div className="brand-hero">
          <span className="logo-glow">
            <Logo size={72} />
          </span>
          <h1>Meetora</h1>
          <div className="online-pill">
            <span className="online-pulse" />
            <span>{(p.onlineCount || 0).toLocaleString()} online now</span>
          </div>
        </div>

        <div className="nc-stack">
          <div className="nc-interests">
            <div className="nc-section-head">
              <span className="nc-title">What do you like?</span>
              <button
                type="button"
                className={`toggle-switch ${p.interestsOn ? "on" : ""}`}
                aria-label="Toggle interests matching"
                aria-pressed={p.interestsOn}
                onClick={p.onToggleInterestsOn}
                disabled={p.busy}
              >
                <span className="toggle-knob" />
              </button>
            </div>

            <div
              className={`tag-input-field ${!p.interestsOn || p.busy ? "disabled" : ""}`}
              onClick={() => {
                if (p.interestsOn && !p.busy) inputRef.current?.focus();
              }}
            >
              {p.interests.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                  {!p.busy && p.interestsOn && (
                    <button
                      type="button"
                      className="tag-chip-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        p.onToggleInterest(tag);
                      }}
                      aria-label={`Remove ${tag}`}
                    >
                      <X size={11} />
                    </button>
                  )}
                </span>
              ))}
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === ",") && input.trim()) {
                    e.preventDefault();
                    addTag(input);
                  }
                  if (
                    e.key === "Backspace" &&
                    !input &&
                    p.interests.length > 0
                  ) {
                    p.onToggleInterest(p.interests[p.interests.length - 1]);
                  }
                }}
                placeholder={
                  p.interests.length === 0
                    ? "Add a few interests you like…"
                    : ""
                }
                disabled={p.busy || !p.interestsOn}
                className="tag-input-inner"
              />
            </div>

            {suggestions.length > 0 && p.interestsOn && !p.busy && (
              <div className="tag-suggestions">
                {suggestions.slice(0, 6).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="tag-suggestion-btn"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addTag(s);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {p.interests.length > 0 && p.interestsOn && (
              <p className="nc-hint">
                Matching on {p.interests.length} interest
                {p.interests.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <details className="nc-acc">
            <summary>
              <span className="nc-acc-icons">
                <Venus size={18} className="gi-female" />
                <Mars size={18} className="gi-male" />
              </span>
              <span className="nc-acc-label">Gender</span>
              <ChevronDown size={18} className="nc-acc-chevron" />
            </summary>
            <div className="nc-acc-body">
              <div className="nc-filter-group">
                <label className="nc-label">
                  <User size={16} />I am
                </label>
                <div className="seg-control">
                  {(["male", "unspecified", "female"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`seg-btn ${p.gender === g ? "active" : ""}`}
                      onClick={() => p.onGenderChange(g)}
                      disabled={p.busy}
                    >
                      <GenderIcon g={g} />
                      {g === "male"
                        ? "Male"
                        : g === "female"
                          ? "Female"
                          : "Other"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="nc-filter-group">
                <label className="nc-label">
                  <Search size={16} />
                  Looking for
                </label>
                <div className="seg-control">
                  {(["male", "any", "female"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`seg-btn ${p.filterGender === g ? "active" : ""}`}
                      onClick={() => p.onFilterGender(g)}
                      disabled={p.busy}
                    >
                      <GenderIcon g={g} />
                      {g === "male"
                        ? "Male"
                        : g === "female"
                          ? "Female"
                          : "Anyone"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </details>

          <details className="nc-acc">
            <summary>
              <span className="nc-acc-icons">
                <Globe size={18} className="gi-country" />
              </span>
              <span className="nc-acc-label">Country</span>
              <ChevronDown size={18} className="nc-acc-chevron" />
            </summary>
            <div className="nc-acc-body">
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
          </details>
        </div>
      </div>

      <div className="nc-dock">
        <button
          type="button"
          className="start-chat-btn"
          onClick={p.onStart}
          disabled={!p.canStart || p.busy}
        >
          <MessageSquare size={22} />
          Start Text Chat
        </button>
        <p className="nc-footer-note">
          By chatting you agree to our{" "}
          <a href="#" onClick={(e) => e.preventDefault()}>
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" onClick={(e) => e.preventDefault()}>
            Community Guidelines
          </a>
          .
        </p>
      </div>
    </section>
  );
}
