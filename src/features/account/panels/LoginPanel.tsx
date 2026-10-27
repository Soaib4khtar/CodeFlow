import React, { useState } from 'react';
import { fieldClass, Label, primaryBtn } from '../AccountFieldControls';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginPanelProps {
  darkMode: boolean;
  onSubmit: (profile: { name: string; email: string }) => void;
}

export const LoginPanel: React.FC<LoginPanelProps> = ({ darkMode, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter your name.');
    if (!EMAIL_RE.test(email.trim())) return setError('Please enter a valid email address.');
    onSubmit({ name: name.trim(), email: email.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Create a local profile to personalise CodeFlow. Your data stays in this browser.
      </p>
      <div>
        <Label>Name</Label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClass(darkMode)}
          placeholder="Your name"
        />
      </div>
      <div>
        <Label>Email</Label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass(darkMode)}
          placeholder="you@example.com"
        />
      </div>
      {error && <div className="text-xs text-rose-500">{error}</div>}
      <div className="flex justify-end">
        <button type="submit" className={primaryBtn}>
          Log In
        </button>
      </div>
    </form>
  );
};
