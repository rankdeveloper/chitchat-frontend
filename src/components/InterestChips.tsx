import { useRef, useState } from "react";
import { X } from "lucide-react";
import { INTEREST_SUGGESTIONS } from "../constants";

type Props = {
  selected: string[];
  disabled?: boolean;
  onToggle: (tag: string) => void;
};

export function InterestChips({ selected, disabled, onToggle }: Props) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const normalized = input.trim().toLowerCase();
  const suggestions = normalized
    ? INTEREST_SUGGESTIONS.filter(
        (s) =>
          s.toLowerCase().includes(normalized) &&
          !selected.map((t) => t.toLowerCase()).includes(s.toLowerCase()),
      )
    : [];

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag || tag.length > 32) return;
    if (selected.map((t) => t.toLowerCase()).includes(tag.toLowerCase())) return;
    onToggle(tag);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <div className="tag-input-wrap">
      <div
        className="tag-input-field"
        onClick={() => inputRef.current?.focus()}
      >
        {selected.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
            {!disabled && (
              <button
                type="button"
                className="tag-chip-remove"
                onClick={(e) => { e.stopPropagation(); onToggle(tag); }}
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
            if (e.key === "Backspace" && !input && selected.length > 0) {
              onToggle(selected[selected.length - 1]);
            }
          }}
          placeholder={selected.length === 0 ? "Type an interest and press Enter…" : ""}
          disabled={disabled}
          className="tag-input-inner"
        />
      </div>
      {suggestions.length > 0 && (
        <div className="tag-suggestions">
          {suggestions.slice(0, 6).map((s) => (
            <button
              key={s}
              type="button"
              className="tag-suggestion-btn"
              onMouseDown={(e) => { e.preventDefault(); addTag(s); }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
