import { useState } from "react";
import { X } from "lucide-react";
import { Logo } from "./LandingPage";

type Props = {
  open: boolean;
  onClose: () => void;
  onGuestContinue: () => void;
  onGoogle: () => void;
  onApple: () => void;
};

export function AuthChoiceModal({
  open,
  onClose,
  onGuestContinue,
  onGoogle,
  onApple,
}: Props) {
  const [selectedGender, setSelectedGender] = useState<"male" | "female">(
    "male",
  );

  if (!open) return null;

  return (
    <div className="modal-backdrop auth-choice-backdrop" onClick={onClose}>
      <section
        className="auth-choice-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-choice-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="auth-choice-header">
          <div className="auth-choice-brand-wrap">
            <div className="auth-choice-brand-icon">
              <Logo size={28} />
            </div>
            <h2 id="auth-choice-title">Meetora</h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close sign in options"
          >
            <X size={20} />
          </button>
        </div>

        <div className="auth-choice-body">
          <label className="auth-choice-label">I am:</label>

          <div className="auth-choice-gender-grid">
            <button
              type="button"
              className={`auth-choice-gender-btn ${
                selectedGender === "male" ? "selected" : ""
              }`}
              onClick={() => setSelectedGender("male")}
            >
              <span className="auth-choice-gender-mark male">♂</span>
              <span>Male</span>
            </button>
            <button
              type="button"
              className={`auth-choice-gender-btn ${
                selectedGender === "female" ? "selected" : ""
              }`}
              onClick={() => setSelectedGender("female")}
            >
              <span className="auth-choice-gender-mark female">♀</span>
              <span>Female</span>
            </button>
          </div>

          <button
            type="button"
            className="auth-choice-primary"
            onClick={onGuestContinue}
          >
            Continue as guest
          </button>

          <div className="auth-choice-divider">
            <span>or</span>
          </div>

          <button
            type="button"
            className="auth-choice-social"
            onClick={onGoogle}
          >
            <span className="auth-choice-social-mark google">G</span>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            className="auth-choice-social"
            onClick={onApple}
          >
            <span className="auth-choice-social-mark apple"></span>
            <span>Continue with Apple</span>
          </button>

          <p className="auth-choice-footer">
            Already have an account? <button type="button">Log in</button>
          </p>

          <p className="auth-choice-terms">
            By continuing, you confirm you're 18+ and agree to our{" "}
            <button type="button">Terms</button> and{" "}
            <button type="button">Privacy Policy</button>.
          </p>
        </div>
      </section>
    </div>
  );
}
