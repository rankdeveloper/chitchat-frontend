import { INTEREST_OPTIONS } from "../constants";

type Props = {
  selected: string[];
  disabled?: boolean;
  onToggle: (tag: string) => void;
};

export function InterestChips({ selected, disabled, onToggle }: Props) {
  return (
    <div className="interest-chips">
      {INTEREST_OPTIONS.map((tag) => (
        <button
          key={tag}
          type="button"
          className={`interest-chip ${selected.includes(tag) ? "selected" : ""}`}
          disabled={disabled}
          onClick={() => onToggle(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
