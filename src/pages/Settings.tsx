import { Lock, SignOut, User } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import type { AuthResponse } from "../features/auth/api/auth-client";
import { ShinyText } from "../components/ShinyText";

type SettingsPageProps = {
  auth: AuthResponse;
  avatarUrl?: string;
  onAvatarChange: (nextAvatar: string) => void;
  onLogout: () => Promise<void>;
};

export default function SettingsPage({
  auth,
  avatarUrl,
  onAvatarChange,
  onLogout,
}: SettingsPageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const onPickAvatar = () => fileInputRef.current?.click();

  const onAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        onAvatarChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onPasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("Fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    setPasswordMessage(
      "Password change request saved (backend integration pending).",
    );
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <section>
      <p className="hero-kicker">
              <ShinyText text="Account settings" />
            </p>

      <div className="settings-grid">
        <article className="settings-card">
          <h2 className="settings-card-name">
            <User size={20} /> Profile
          </h2>
            <div className="avatar-edit">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" onClick={onPickAvatar}/>
              ) : (
                <div className="avatar-placeholder" onClick={onPickAvatar}>
                  <p className="avatar-text">No avatar</p>
                  </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onAvatarUpload}
                hidden
              />
            </div>
            <p>Login: {auth.user.username}</p>
            <p>Email: {auth.user.email}</p>
        </article>

        <article className="settings-card">
          <h2 className="settings-card-name">
            <Lock size={20} /> Change password
          </h2>

          <form className="settings-form" onSubmit={onPasswordSubmit}>
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            <p className={`status-line ${!passwordMessage ? "invisible" : ""}`}>
              {passwordMessage || "Placeholder"}
            </p>

            <div className="password-form-flex">
              <button type="submit" className="ghost-button">
                Save password
              </button>
            </div>
          </form>
        </article>
      </div>
      <div className="settings-auth-control">
        <button
          type="button"
          className="ghost-button"
          onClick={() => void onLogout()}
        >
          <SignOut size={16} /> Log out
        </button>
      </div>
    </section>
  );
}
