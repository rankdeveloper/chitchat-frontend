import { useCallback, useRef, useState } from "react";
import {
  AVATAR_HUES,
  DEFAULT_AVATAR_HUE,
  INTEREST_OPTIONS,
} from "../constants";
import { resolveName } from "../lib/profile";
import {
  KEYS,
  loadAvatarHue,
  loadBanner,
  loadInterests,
  nameChangeQuota,
} from "../lib/storage";
import type {
  BannerStyle,
  ProfileSnapshot,
  SavedProfile,
  SocketRef,
} from "../types";

export function useProfile(
  socketRef: SocketRef,
  showToast: (msg: string) => void,
) {
  const [displayName, setDisplayName] = useState(
    () => localStorage.getItem(KEYS.displayName) ?? "",
  );
  const [gender, setGender] = useState("unspecified");
  const [interests, setInterests] = useState<string[]>(loadInterests);
  const [interestsOn, setInterestsOn] = useState(true);
  const [avatarHue, setAvatarHue] = useState(loadAvatarHue);
  const [bannerStyle, setBannerStyle] = useState<BannerStyle>(loadBanner);
  const [joinDate, setJoinDate] = useState("");
  const [nameChangesLeft, setNameChangesLeft] = useState(
    () => nameChangeQuota().left,
  );
  const country = "";

  // Always holds the latest values so socket callbacks never see stale state.
  const profileRef = useRef<ProfileSnapshot>({} as ProfileSnapshot);
  profileRef.current = {
    displayName,
    gender,
    country,
    interests,
    interestsOn,
    avatarHue,
    bannerStyle,
  };

  const applyServerProfile = useCallback((p: SavedProfile) => {
    if (p.displayName) {
      setDisplayName(p.displayName);
      localStorage.setItem(KEYS.displayName, p.displayName);
    }
    if (p.gender) setGender(p.gender);
    if (Array.isArray(p.interests)) {
      const next = p.interests.filter((t) =>
        (INTEREST_OPTIONS as readonly string[]).includes(t),
      );
      setInterests(next);
      localStorage.setItem(KEYS.interests, JSON.stringify(next));
    }
    if (typeof p.interestsOn === "boolean") setInterestsOn(p.interestsOn);
    if (typeof p.avatarHue === "number") {
      setAvatarHue(p.avatarHue);
      localStorage.setItem(KEYS.avatarHue, String(p.avatarHue));
    }
    if (p.bannerStyle === "simple" || p.bannerStyle === "gradient") {
      setBannerStyle(p.bannerStyle);
      localStorage.setItem(KEYS.banner, p.bannerStyle);
    }
    if (p.joinDate) setJoinDate(p.joinDate);
  }, []);

  const persistProfile = useCallback(
    (patch?: Partial<SavedProfile>) => {
      const s = socketRef.current;
      if (!s) return;
      const p = profileRef.current;
      s.emit(
        "update_profile",
        {
          displayName: patch?.displayName ?? resolveName(p.displayName),
          gender: patch?.gender ?? p.gender,
          country: patch?.country ?? p.country.trim(),
          interests: patch?.interests ?? p.interests,
          interestsOn: patch?.interestsOn ?? p.interestsOn,
          avatarHue: patch?.avatarHue ?? p.avatarHue,
          bannerStyle: patch?.bannerStyle ?? p.bannerStyle,
        },
        (err?: string) => {
          if (err) showToast(err);
        },
      );
    },
    [socketRef, showToast],
  );

  const toggleInterest = (tag: string) => {
    const next = interests.includes(tag)
      ? interests.filter((t) => t !== tag)
      : [...interests, tag];
    setInterests(next);
    localStorage.setItem(KEYS.interests, JSON.stringify(next));
    persistProfile({ interests: next });
  };

  const toggleInterestsOn = () => {
    const next = !interestsOn;
    setInterestsOn(next);
    persistProfile({ interestsOn: next });
  };

  const changeGender = (value: string) => {
    setGender(value);
    persistProfile({ gender: value });
  };

  const setAvatar = (hue: number) => {
    setAvatarHue(hue);
    localStorage.setItem(KEYS.avatarHue, String(hue));
    persistProfile({ avatarHue: hue });
  };
  const cycleAvatar = () => {
    const i = AVATAR_HUES.indexOf(avatarHue);
    setAvatar(AVATAR_HUES[(i + 1) % AVATAR_HUES.length]);
  };
  const resetAvatar = () => setAvatar(DEFAULT_AVATAR_HUE);

  const changeBanner = (style: BannerStyle) => {
    setBannerStyle(style);
    localStorage.setItem(KEYS.banner, style);
    persistProfile({ bannerStyle: style });
  };

  /** Returns true when the editor should close. */
  const commitUsername = (raw: string): boolean => {
    const next = resolveName(raw);
    if (next === resolveName(displayName)) return true;
    const quota = nameChangeQuota();
    if (!quota.bump()) {
      showToast("No username changes left today.");
      return false;
    }
    setNameChangesLeft(nameChangeQuota().left);
    setDisplayName(next);
    localStorage.setItem(KEYS.displayName, next);
    persistProfile({ displayName: next });
    showToast("Username updated.");
    return true;
  };

  return {
    displayName,
    gender,
    country,
    interests,
    interestsOn,
    avatarHue,
    bannerStyle,
    joinDate,
    nameChangesLeft,
    profileRef,
    applyServerProfile,
    toggleInterest,
    toggleInterestsOn,
    changeGender,
    cycleAvatar,
    resetAvatar,
    changeBanner,
    commitUsername,
  };
}
