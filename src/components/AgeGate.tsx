import { useState } from "react";

type Props = {
  onConfirm: () => void;
};

export function AgeGate({ onConfirm }: Props) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="modal-backdrop" style={{ zIndex: 9999 }}>
      <div className="age-gate-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Age Verification</h2>
        <p>Meetora is for users 18 years and older.</p>
        <p className="muted" style={{ fontSize: "0.85rem", marginTop: "12px" }}>
          By continuing, you confirm that you are at least 18 years old and
          agree to our Terms of Service and Community Guidelines.
        </p>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <input
            type="checkbox"
            id="age-agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <label
            htmlFor="age-agree"
            style={{ fontSize: "0.85rem", cursor: "pointer" }}
          >
            I confirm I am 18 or older
          </label>
        </div>
        <button
          type="button"
          className="start-chat-btn"
          onClick={onConfirm}
          disabled={!agreed}
          style={{ marginTop: "20px", width: "100%" }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
