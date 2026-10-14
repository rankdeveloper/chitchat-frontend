import { useEffect, useRef, useState } from "react";
import {
  getGoogleClientId,
  initGoogleIdentity,
  isGoogleConfigured,
  renderGoogleButton,
} from "../lib/googleAuth";

type Props = {
  onCredential: (credential: string) => void;

  onUnavailable?: () => void;
  disabled?: boolean;
};

export function GoogleSignInButton({
  onCredential,
  onUnavailable,
  disabled = false,
}: Props) {
  const holderRef = useRef<HTMLDivElement | null>(null);
  const credentialRef = useRef(onCredential);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    credentialRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!isGoogleConfigured()) return;
    let active = true;

    initGoogleIdentity(getGoogleClientId(), (credential) => {
      credentialRef.current(credential);
    })
      .then(() => {
        if (!active || !holderRef.current) return;
        renderGoogleButton(holderRef.current);
        setReady(true);
      })
      .catch(() => {
        if (active) setReady(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleClick = () => {
    if (!ready) onUnavailable?.();
  };

  return (
    <div className="google-signin">
      <button
        type="button"
        className="auth-choice-social"
        onClick={handleClick}
        disabled={disabled}
        aria-label="Continue with Google"
      >
        <span className="auth-choice-social-mark google" aria-hidden="true">
          G
        </span>
        <span>Continue with Google</span>
      </button>

      <div
        ref={holderRef}
        className="google-signin-overlay"
        style={ready ? undefined : { display: "none" }}
        aria-hidden="true"
      />
    </div>
  );
}
