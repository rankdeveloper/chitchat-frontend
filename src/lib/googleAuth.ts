const GSI_SRC = "https://accounts.google.com/gsi/client";

type GoogleCredentialResponse = { credential?: string };

type GoogleIdApi = {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    use_fedcm_for_prompt?: boolean;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      type?: "standard" | "icon";
      theme?: "outline" | "filled_blue" | "filled_black";
      size?: "small" | "medium" | "large";
      text?: "signin_with" | "signup_with" | "continue_with" | "signin";
      shape?: "rectangular" | "pill" | "circle" | "square";
      logo_alignment?: "left" | "center";
      width?: number;
      locale?: string;
    },
  ) => void;
  prompt: () => void;
  cancel: () => void;
};

type GoogleNamespace = { accounts?: { id?: GoogleIdApi } };

declare global {
  interface Window {
    google?: GoogleNamespace;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadGsiScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google sign-in is unavailable"));
  }
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GSI_SRC}"]`,
    );
    const script = existing ?? document.createElement("script");

    const cleanup = () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };
    const onLoad = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      scriptPromise = null;
      reject(new Error("Failed to load Google Identity Services"));
    };

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    if (!existing) document.head.appendChild(script);
  });

  return scriptPromise;
}

export function getGoogleClientId(): string {
  const raw = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return typeof raw === "string" ? raw.trim() : "";
}

export function isGoogleConfigured(): boolean {
  return getGoogleClientId().length > 0;
}

export async function initGoogleIdentity(
  clientId: string,
  onCredential: (credential: string) => void,
): Promise<void> {
  await loadGsiScript();
  const google = window.google;
  if (!google?.accounts?.id) {
    throw new Error("Google Identity Services unavailable");
  }
  google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      if (response?.credential) onCredential(response.credential);
    },
  });
}

export function renderGoogleButton(container: HTMLElement): void {
  const google = window.google;
  if (!google?.accounts?.id) return;
  container.innerHTML = "";
  google.accounts.id.renderButton(container, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "continue_with",
    shape: "rectangular",
    logo_alignment: "left",
    width: Math.max(200, Math.floor(container.clientWidth || 320)),
  });
}
