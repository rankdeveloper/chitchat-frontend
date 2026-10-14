import type { ReactNode } from "react";
import { CalendarDays, Hash, Pencil, Sparkles, X } from "lucide-react";

export type UserProfile = {
  publicId: string;
  displayName: string;
  gender: string;
  country: string;
  interests: string[];
  interestsOn: boolean;
  avatarHue: number;
  bannerStyle: "simple" | "gradient";
  joinDate: string;
};

type Props = {
  open: boolean;
  profile: UserProfile;
  onClose: () => void;
  onEditProfile: () => void;
  avatar: ReactNode;
};

export function ProfileCard({
  open,
  profile,
  onClose,
  onEditProfile,
  avatar,
}: Props) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="pc"
        role="dialog"
        aria-label="Your profile"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`pc-banner ${
            profile.bannerStyle === "gradient" ? "gradient" : "simple"
          }`}
        >
          <button
            type="button"
            className="pc-close"
            onClick={onClose}
            aria-label="Close profile"
          >
            <X size={18} />
          </button>
        </div>

        <div className="pc-body">
          <div className="pc-avatar">{avatar}</div>
          <h2 className="pc-name">{profile.displayName.trim() || "Guest"}</h2>
          <p className="pc-id">
            <Hash size={14} />
            {profile.publicId}
          </p>
          <button type="button" className="pc-edit" onClick={onEditProfile}>
            <Pencil size={16} />
            Edit Profile
          </button>

          <div className="pc-info">
            <div className="pc-field">
              <span className="pc-label">
                <CalendarDays size={16} />
                Meetora join date
              </span>
              <span className="pc-value">{profile.joinDate || "—"}</span>
            </div>
            <div className="pc-field">
              <span className="pc-label">
                <Sparkles size={16} />
                Interests
              </span>
              <div className="pc-chips">
                {profile.interests.length === 0 ? (
                  <span className="pc-chip muted">No interests</span>
                ) : (
                  profile.interests.map((tag) => (
                    <span key={tag} className="pc-chip">
                      {tag}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
