import React, { useState } from 'react';
import { AccountApi } from '../useAccount';
import { fieldClass, Label, primaryBtn, secondaryBtn } from '../AccountFieldControls';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ProfilePanelProps {
  account: AccountApi;
  darkMode: boolean;
  onNeedLogin: () => void;
  onLogout: () => void;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({
  account,
  darkMode,
  onNeedLogin,
  onLogout
}) => {
  const [name, setName] = useState(account.user?.name ?? '');
  const [email, setEmail] = useState(account.user?.email ?? '');
  const [message, setMessage] = useState('');

  if (!account.isLoggedIn) {
    return (
      <div className="space-y-3 text-xs">
        <p className="text-slate-500 dark:text-slate-400">
          You are browsing as a guest. Log in to create a profile.
        </p>
        <button onClick={onNeedLogin} className={primaryBtn}>
          Log In
        </button>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setMessage('Name cannot be empty.');
    if (!EMAIL_RE.test(email.trim())) return setMessage('Please enter a valid email address.');
    account.updateProfile({ name: name.trim(), email: email.trim() });
    setMessage('Profile saved.');
  };

  return (
    <form onSubmit={handleSave} className="space-y-3">
      <div>
        <Label>Display name</Label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClass(darkMode)}
        />
      </div>
      <div>
        <Label>Email</Label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass(darkMode)}
        />
      </div>
      {message && (
        <div
          className={`text-xs ${
            message === 'Profile saved.' ? 'text-emerald-600' : 'text-rose-500'
          }`}
        >
          {message}
        </div>
      )}
      <div className="flex items-center justify-between pt-1">
        <button type="button" onClick={onLogout} className={secondaryBtn(darkMode)}>
          Log Out
        </button>
        <button type="submit" className={primaryBtn}>
          Save changes
        </button>
      </div>
    </form>
  );
};
