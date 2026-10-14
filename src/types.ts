export type FriendRow = {
  publicId: string;
  displayName: string;
  gender?: string;
  country?: string;
  chatId?: string | null;
  lastText?: string;
  lastMessageAt?: number;
  avatarHue?: number;
  online?: boolean;
};

export type ChatLine = {
  id?: string;
  fromPublicId: string;
  fromDisplayName?: string;
  text: string;
  ts: number;
  reactions?: Record<string, string[]>;
  readAt?: number | null;
};

export type ChatMessage = { fromSelf: boolean; text: string; ts: number };

export type PendingRequest = {
  fromPublicId: string;
  fromDisplayName: string;
};

export type BlockedUser = {
  publicId: string;
  displayName: string;
  blockedAt: number;
};

export type UiPhase =
  | "disconnected"
  | "registering"
  | "idle"
  | "searching"
  | "chatting"
  | "spying";

export type NavTab = "chat" | "friends";

export type SettingsTab =
  | "profile"
  | "account"
  | "privacy"
  | "preferences"
  | "blocked";

export type BannerStyle = "simple" | "gradient";

/** Profile as stored on the server. */
export type SavedProfile = {
  publicId: string;
  displayName: string;
  gender: string;
  country: string;
  interests: string[];
  interestsOn: boolean;
  avatarHue: number;
  bannerStyle: BannerStyle;
  joinDate: string;
};

/** Latest local profile values, readable from socket callbacks without stale closures. */
export type ProfileSnapshot = {
  displayName: string;
  gender: string;
  country: string;
  interests: string[];
  interestsOn: boolean;
  avatarHue: number;
  bannerStyle: BannerStyle;
};

export type ChatFilters = { gender: string; country: string };

export type SocketRef = { current: import("socket.io-client").Socket | null };
