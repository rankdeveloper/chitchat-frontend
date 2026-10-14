import { DEFAULT_AVATAR_HUE, MAX_NAME_CHANGES_PER_DAY } from "../constants";
import { generateName } from "./profile";
import type { BannerStyle } from "../types";

export const KEYS = {
  userId: "chitchat_user_id",
  displayName: "chitchat_display_name",
  interests: "chitchat_interests",
  avatarHue: "chitchat_avatar_hue",
  banner: "chitchat_banner",
  nameChanges: "chitchat_name_changes",
  blockedUsers: "cc_blocked_users",
  typingSound: "cc_typing_sound",
  notifSound: "cc_notif_sound",
  googleEmail: "chitchat_google_email",
  googleAvatar: "chitchat_google_avatar",
  authProvider: "chitchat_auth_provider",
  authChoiceSeen: "chitchat_auth_choice_seen",
} as const;

export function loadOrCreateUserId(): string {
  let id = localStorage.getItem(KEYS.userId);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEYS.userId, id);
  }
  return id;
}

/** Persist a specific identity (e.g. the Google-derived publicId). */
export function saveUserId(id: string): void {
  localStorage.setItem(KEYS.userId, id);
}

export function loadGoogleEmail(): string {
  return localStorage.getItem(KEYS.googleEmail) ?? "";
}

export function loadGoogleAvatar(): string {
  return localStorage.getItem(KEYS.googleAvatar) ?? "";
}

export function loadAuthProvider(): "guest" | "google" {
  return localStorage.getItem(KEYS.authProvider) === "google"
    ? "google"
    : "guest";
}

export function saveGoogleAccount(info: {
  email?: string;
  avatarUrl?: string;
}): void {
  if (info.email !== undefined) {
    if (info.email) localStorage.setItem(KEYS.googleEmail, info.email);
    else localStorage.removeItem(KEYS.googleEmail);
  }
  if (info.avatarUrl !== undefined) {
    if (info.avatarUrl) localStorage.setItem(KEYS.googleAvatar, info.avatarUrl);
    else localStorage.removeItem(KEYS.googleAvatar);
  }
  localStorage.setItem(KEYS.authProvider, "google");
}

export function clearGoogleAccount(): void {
  localStorage.removeItem(KEYS.googleEmail);
  localStorage.removeItem(KEYS.googleAvatar);
  localStorage.removeItem(KEYS.authProvider);
}

export function hasPassedAuthGate(): boolean {
  return localStorage.getItem(KEYS.authChoiceSeen) === "1";
}

/** Remember that the user has made their auth choice. */
export function markAuthGatePassed(): void {
  localStorage.setItem(KEYS.authChoiceSeen, "1");
}

export function clearAuthGate(): void {
  localStorage.removeItem(KEYS.authChoiceSeen);
}

export function loadOrCreateDisplayName(): string {
  let name = localStorage.getItem(KEYS.displayName);
  if (!name) {
    name = generateName();
    localStorage.setItem(KEYS.displayName, name);
  }
  return name;
}

export function loadInterests(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.interests);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map(String).filter((t) => t.length > 0);
  } catch {
    return [];
  }
}

export function loadAvatarHue(): number {
  const raw = localStorage.getItem(KEYS.avatarHue);
  if (raw === null) return DEFAULT_AVATAR_HUE;
  const n = Number(raw);
  return Number.isFinite(n) ? n : DEFAULT_AVATAR_HUE;
}

export function loadBanner(): BannerStyle {
  return localStorage.getItem(KEYS.banner) === "gradient"
    ? "gradient"
    : "simple";
}

export function nameChangeQuota(): { left: number; bump: () => boolean } {
  const today = new Date().toISOString().slice(0, 10);
  let stored = { day: today, used: 0 };
  try {
    const raw = localStorage.getItem(KEYS.nameChanges);
    if (raw) stored = JSON.parse(raw) as typeof stored;
  } catch {
    stored = { day: today, used: 0 };
  }
  if (stored.day !== today) stored = { day: today, used: 0 };
  return {
    left: Math.max(0, MAX_NAME_CHANGES_PER_DAY - stored.used),
    bump: () => {
      if (stored.used >= MAX_NAME_CHANGES_PER_DAY) return false;
      stored = { day: today, used: stored.used + 1 };
      localStorage.setItem(KEYS.nameChanges, JSON.stringify(stored));
      return true;
    },
  };
}

export function readStoredBoolean(key: string, fallback: boolean): boolean {
  const value = localStorage.getItem(key);
  if (value === null) return fallback;
  return value !== "false";
}

export function readStoredBlockedUsers() {
  try {
    const raw = localStorage.getItem(KEYS.blockedUsers);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (
        user,
      ): user is {
        publicId: string;
        displayName: string;
        blockedAt: number;
      } => {
        if (!user || typeof user !== "object") return false;
        const candidate = user as Record<string, unknown>;
        return (
          typeof candidate.publicId === "string" &&
          typeof candidate.displayName === "string" &&
          typeof candidate.blockedAt === "number"
        );
      },
    );
  } catch {
    return [];
  }
}
