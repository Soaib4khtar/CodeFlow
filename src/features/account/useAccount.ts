import { useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CodeLanguage } from '@/types/codeflow';

export interface UserProfile {
  name: string;
  email: string;
}

export type PlaybackSpeed = 'slow' | 'normal' | 'fast';

export interface Preferences {
  theme: 'light' | 'dark';
  editorFontSize: number;
  autoPlay: boolean;
  playbackSpeed: PlaybackSpeed;
  defaultLanguage: CodeLanguage;
}

export const DEFAULT_PREFERENCES: Preferences = {
  theme: 'light',
  editorFontSize: 12.5,
  autoPlay: true,
  playbackSpeed: 'normal',
  defaultLanguage: 'javascript'
};

/** Milliseconds between auto-played execution steps. */
export const PLAYBACK_MS: Record<PlaybackSpeed, number> = {
  slow: 1700,
  normal: 1050,
  fast: 500
};

export const ACCOUNT_STORAGE_PREFIX = 'codeflow_';
const LS_USER_KEY = 'codeflow_user_v1';
const LS_PREFS_KEY = 'codeflow_prefs_v1';

export interface AccountApi {
  user: UserProfile | null;
  isLoggedIn: boolean;
  preferences: Preferences;
  login: (profile: UserProfile) => void;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
  updatePreferences: (patch: Partial<Preferences>) => void;
  resetPreferences: () => void;
}

/**
 * Local-first account state (profile session + preferences).
 * There is no backend yet, so everything lives in localStorage; swap the
 * implementations of login/logout for real API calls later without touching UI.
 */
export function useAccount(): AccountApi {
  const [user, setUser] = useLocalStorage<UserProfile | null>(LS_USER_KEY, null);
  const [stored, setStored] = useLocalStorage<Preferences>(LS_PREFS_KEY, DEFAULT_PREFERENCES);
  const preferences: Preferences = { ...DEFAULT_PREFERENCES, ...stored };

  const login = useCallback((profile: UserProfile) => setUser(profile), [setUser]);
  const logout = useCallback(() => setUser(null), [setUser]);
  const updateProfile = useCallback((profile: UserProfile) => setUser(profile), [setUser]);
  const updatePreferences = useCallback(
    (patch: Partial<Preferences>) => setStored((prev) => ({ ...DEFAULT_PREFERENCES, ...prev, ...patch })),
    [setStored]
  );
  const resetPreferences = useCallback(() => setStored(DEFAULT_PREFERENCES), [setStored]);

  return {
    user,
    isLoggedIn: user !== null,
    preferences,
    login,
    logout,
    updateProfile,
    updatePreferences,
    resetPreferences
  };
}
