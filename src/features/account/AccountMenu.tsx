import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  User,
  Settings,
  Sliders,
  Shield,
  HelpCircle,
  LogOut,
  LogIn,
  X,
  Sun,
  Moon,
  Download,
  Trash2,
  Check,
  Send,
  ChevronDown
} from 'lucide-react';
import {
  AccountApi,
  ACCOUNT_STORAGE_PREFIX,
  DEFAULT_PREFERENCES,
  PlaybackSpeed
} from './useAccount';
import { CodeLanguage } from '@/types/codeflow';

type PanelId = 'login' | 'profile' | 'settings' | 'appearance' | 'privacy' | 'help';

interface AccountMenuProps {
  account: AccountApi;
  darkMode: boolean;
  onResetProgress: () => void;
}

const PANEL_TITLES: Record<PanelId, string> = {
  login: 'Log In',
  profile: 'Profile & Account',
  settings: 'Settings & Preferences',
  appearance: 'Editor & Appearance',
  privacy: 'Privacy & Security',
  help: 'Help & Feedback'
};

const FAQS: { q: string; a: string }[] = [
  {
    q: 'How do I visualize my own code?',
    a: 'Pick a problem, write your solution in the main editor, then press "Run & Visualize". Each executed line becomes a step you can play, pause or step through.'
  },
  {
    q: 'What does "Show Answer" do?',
    a: 'It loads the reference solution into the editor, runs it against every test case and visualizes it. Your previous code is replaced, so copy it first if you want to keep it.'
  },
  {
    q: 'Where is my progress stored?',
    a: 'Solved problems, favourites, preferences and your profile are stored only in this browser (localStorage). Use Privacy & Security to export or erase them.'
  },
  {
    q: 'How do I step through execution?',
    a: 'Use the arrow buttons in the toolbar, or press the left/right arrow keys. Space toggles play and pause when the editor is not focused.'
  }
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AccountMenu: React.FC<AccountMenuProps> = ({ account, darkMode, onResetProgress }) => {
  const { user, isLoggedIn, preferences } = account;
  const [menuOpen, setMenuOpen] = useState(false);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click / Escape
  useEffect(() => {
    if (!menuOpen && !panel) return;
    const onDown = (e: MouseEvent) => {
      if (menuOpen && rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setPanel(null);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen, panel]);

  const openPanel = (id: PanelId) => {
    setPanel(id);
    setMenuOpen(false);
  };

  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase();

  const itemClass = `w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs font-medium transition-colors cursor-pointer ${
    darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#EFECE4]'
  }`;
  const iconClass = darkMode ? 'text-slate-400' : 'text-slate-500';
  const accent = darkMode ? 'text-amber-400' : 'text-[#2563EB]';

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setMenuOpen((p) => !p)}
        title="Account"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className={`w-7 h-7 rounded-full bg-[#2563EB] dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-bold flex items-center justify-center shadow-xs select-none cursor-pointer transition-transform ${
          menuOpen ? 'ring-2 ring-blue-400 dark:ring-amber-400 scale-105' : 'hover:scale-105'
        }`}
      >
        {initial || <User className="w-3.5 h-3.5" />}
      </button>

      {menuOpen && (
        <div
          role="menu"
          className={`absolute right-0 top-10 w-64 rounded-xl border shadow-xl p-2.5 z-50 space-y-1 ${
            darkMode
              ? 'bg-slate-900 border-slate-700 text-slate-100'
              : 'bg-[#FAF8F5] border-[#E2DCD0] text-[#1E293B]'
          }`}
        >
          <div className="flex items-center gap-2.5 px-1.5 pb-2.5 border-b border-slate-200 dark:border-slate-800">
            <div className="w-9 h-9 rounded-full bg-[#2563EB] dark:bg-amber-500 text-white dark:text-slate-950 text-sm font-extrabold flex items-center justify-center shrink-0">
              {initial || <User className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">{user?.name || 'Guest'}</div>
              <div className="text-[11px] text-slate-400 truncate">
                {user?.email || 'Not logged in'}
              </div>
            </div>
          </div>

          <button role="menuitem" onClick={() => openPanel('profile')} className={itemClass}>
            <User className={`w-4 h-4 ${accent}`} />
            <span>Profile & Account</span>
          </button>
          <button role="menuitem" onClick={() => openPanel('settings')} className={itemClass}>
            <Settings className={`w-4 h-4 ${iconClass}`} />
            <span>Settings & Preferences</span>
          </button>
          <button role="menuitem" onClick={() => openPanel('appearance')} className={itemClass}>
            <Sliders className={`w-4 h-4 ${iconClass}`} />
            <span>Editor & Appearance</span>
          </button>
          <button role="menuitem" onClick={() => openPanel('privacy')} className={itemClass}>
            <Shield className={`w-4 h-4 ${iconClass}`} />
            <span>Privacy & Security</span>
          </button>
          <button role="menuitem" onClick={() => openPanel('help')} className={itemClass}>
            <HelpCircle className={`w-4 h-4 ${iconClass}`} />
            <span>Help & Feedback</span>
          </button>

          <div className="pt-1 mt-1 border-t border-slate-200 dark:border-slate-800">
            {isLoggedIn ? (
              <button
                role="menuitem"
                onClick={() => {
                  account.logout();
                  setMenuOpen(false);
                }}
                className={`${itemClass} !text-rose-600 dark:!text-rose-400`}
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            ) : (
              <button
                role="menuitem"
                onClick={() => openPanel('login')}
                className={`${itemClass} ${accent} font-semibold`}
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </button>
            )}
          </div>
        </div>
      )}

      {panel &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setPanel(null);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={PANEL_TITLES[panel]}
              className={`w-full max-w-md max-h-[85vh] overflow-y-auto rounded-xl border shadow-2xl p-5 space-y-4 ${
                darkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-100'
                  : 'bg-[#FAF8F5] border-[#E2DCD0] text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold">{PANEL_TITLES[panel]}</h3>
                <button
                  onClick={() => setPanel(null)}
                  aria-label="Close"
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {panel === 'login' && (
                <LoginPanel
                  darkMode={darkMode}
                  onSubmit={(p) => {
                    account.login(p);
                    setPanel(null);
                  }}
                />
              )}
              {panel === 'profile' && (
                <ProfilePanel
                  account={account}
                  darkMode={darkMode}
                  onNeedLogin={() => setPanel('login')}
                  onLogout={() => {
                    account.logout();
                    setPanel(null);
                  }}
                />
              )}
              {panel === 'settings' && <SettingsPanel account={account} darkMode={darkMode} />}
              {panel === 'appearance' && <AppearancePanel account={account} darkMode={darkMode} />}
              {panel === 'privacy' && (
                <PrivacyPanel darkMode={darkMode} onResetProgress={onResetProgress} />
              )}
              {panel === 'help' && <HelpPanel darkMode={darkMode} />}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

/* ---------------------------------------------------------------- helpers */

const fieldClass = (darkMode: boolean) =>
  `w-full px-3 py-1.5 rounded-lg border text-xs bg-transparent focus:outline-none focus:ring-2 ${
    darkMode
      ? 'border-slate-700 focus:ring-amber-400/30 focus:border-amber-400'
      : 'border-[#D8D0C0] focus:ring-blue-500/20 focus:border-[#2563EB]'
  }`;

const primaryBtn =
  'px-4 py-1.5 rounded-lg bg-[#2563EB] dark:bg-amber-500 hover:bg-[#1D4ED8] dark:hover:bg-amber-600 text-white dark:text-slate-950 text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

const secondaryBtn = (darkMode: boolean) =>
  `px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
    darkMode
      ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
      : 'border-[#D8D0C0] text-slate-700 hover:bg-[#EFECE4]'
  }`;

const Segmented = <T extends string>({
  value,
  options,
  onChange,
  darkMode
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  darkMode: boolean;
}) => (
  <div className="flex gap-1.5">
    {options.map((o) => (
      <button
        key={o.id}
        onClick={() => onChange(o.id)}
        className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
          value === o.id
            ? darkMode
              ? 'bg-amber-500 border-amber-500 text-slate-950'
              : 'bg-[#2563EB] border-[#2563EB] text-white'
            : darkMode
            ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
            : 'border-[#D8D0C0] text-slate-700 hover:bg-[#EFECE4]'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({
  checked,
  onChange,
  label
}) => (
  <button
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${
      checked ? 'bg-[#2563EB] dark:bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
        checked ? 'translate-x-4' : ''
      }`}
    />
  </button>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-[11px] font-semibold text-slate-400 mb-1">{children}</label>
);

/* ----------------------------------------------------------------- panels */

const LoginPanel: React.FC<{
  darkMode: boolean;
  onSubmit: (p: { name: string; email: string }) => void;
}> = ({ darkMode, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter your name.');
    if (!EMAIL_RE.test(email.trim())) return setError('Please enter a valid email address.');
    onSubmit({ name: name.trim(), email: email.trim() });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
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

const ProfilePanel: React.FC<{
  account: AccountApi;
  darkMode: boolean;
  onNeedLogin: () => void;
  onLogout: () => void;
}> = ({ account, darkMode, onNeedLogin, onLogout }) => {
  const [name, setName] = useState(account.user?.name ?? '');
  const [email, setEmail] = useState(account.user?.email ?? '');
  const [msg, setMsg] = useState('');

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

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setMsg('Name cannot be empty.');
    if (!EMAIL_RE.test(email.trim())) return setMsg('Please enter a valid email address.');
    account.updateProfile({ name: name.trim(), email: email.trim() });
    setMsg('Profile saved.');
  };

  return (
    <form onSubmit={save} className="space-y-3">
      <div>
        <Label>Display name</Label>
        <input value={name} onChange={(e) => setName(e.target.value)} className={fieldClass(darkMode)} />
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
      {msg && (
        <div className={`text-xs ${msg === 'Profile saved.' ? 'text-emerald-600' : 'text-rose-500'}`}>
          {msg}
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

const SettingsPanel: React.FC<{ account: AccountApi; darkMode: boolean }> = ({
  account,
  darkMode
}) => {
  const p = account.preferences;
  const languages: { id: CodeLanguage; label: string }[] = [
    { id: 'javascript', label: 'JavaScript' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'python', label: 'Python' },
    { id: 'cpp', label: 'C++' }
  ];
  return (
    <div className="space-y-4">
      <div>
        <Label>Playback speed</Label>
        <Segmented<PlaybackSpeed>
          darkMode={darkMode}
          value={p.playbackSpeed}
          onChange={(v) => account.updatePreferences({ playbackSpeed: v })}
          options={[
            { id: 'slow', label: 'Slow' },
            { id: 'normal', label: 'Normal' },
            { id: 'fast', label: 'Fast' }
          ]}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold">Auto-play after Run & Visualize</div>
          <div className="text-[11px] text-slate-400">
            Start stepping through the trace automatically.
          </div>
        </div>
        <Toggle
          checked={p.autoPlay}
          label="Auto-play"
          onChange={(v) => account.updatePreferences({ autoPlay: v })}
        />
      </div>

      <div>
        <Label>Default language</Label>
        <div className="relative">
          <select
            value={p.defaultLanguage}
            onChange={(e) =>
              account.updatePreferences({ defaultLanguage: e.target.value as CodeLanguage })
            }
            className={`${fieldClass(darkMode)} appearance-none pr-8 cursor-pointer`}
          >
            {languages.map((l) => (
              <option key={l.id} value={l.id} className="text-slate-900">
                {l.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button onClick={account.resetPreferences} className={secondaryBtn(darkMode)}>
          Restore defaults
        </button>
      </div>
    </div>
  );
};

const AppearancePanel: React.FC<{ account: AccountApi; darkMode: boolean }> = ({
  account,
  darkMode
}) => {
  const p = account.preferences;
  return (
    <div className="space-y-4">
      <div>
        <Label>Theme</Label>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { id: 'light', label: 'Light (Beige)', Icon: Sun },
              { id: 'dark', label: 'Dark (Amber)', Icon: Moon }
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => account.updatePreferences({ theme: id })}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                p.theme === id
                  ? darkMode
                    ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                    : 'border-[#2563EB] bg-[#EFECE4] text-[#1E293B]'
                  : darkMode
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                  : 'border-[#D8D0C0] text-slate-700 hover:bg-[#EFECE4]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1 text-left">{label}</span>
              {p.theme === id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Editor font size: {p.editorFontSize}px</Label>
        <input
          type="range"
          min={11}
          max={18}
          step={0.5}
          value={p.editorFontSize}
          onChange={(e) => account.updatePreferences({ editorFontSize: Number(e.target.value) })}
          className="w-full accent-[#2563EB] dark:accent-amber-500 cursor-pointer"
        />
        <pre
          className="mt-2 rounded-lg bg-[#0D1117] text-slate-200 px-3 py-2 font-mono leading-[1.68]"
          style={{ fontSize: p.editorFontSize }}
        >
          <span className="text-[#C084FC]">const</span> mid = <span className="text-[#60A5FA]">Math</span>
          .floor(<span className="text-[#FBBF24]">4</span> / <span className="text-[#FBBF24]">2</span>);
        </pre>
      </div>

      <div className="flex justify-end pt-1">
        <button
          onClick={() =>
            account.updatePreferences({
              theme: DEFAULT_PREFERENCES.theme,
              editorFontSize: DEFAULT_PREFERENCES.editorFontSize
            })
          }
          className={secondaryBtn(darkMode)}
        >
          Reset appearance
        </button>
      </div>
    </div>
  );
};

const PrivacyPanel: React.FC<{ darkMode: boolean; onResetProgress: () => void }> = ({
  darkMode,
  onResetProgress
}) => {
  const [confirm, setConfirm] = useState<'progress' | 'all' | null>(null);
  const [msg, setMsg] = useState('');

  const exportData = () => {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(ACCOUNT_STORAGE_PREFIX)) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) as string);
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codeflow-data.json';
    a.click();
    URL.revokeObjectURL(url);
    setMsg('Your data was exported to codeflow-data.json.');
  };

  const clearAll = () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(ACCOUNT_STORAGE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  return (
    <div className="space-y-3 text-xs">
      <p className="text-slate-500 dark:text-slate-400">
        CodeFlow has no server: your code, progress and profile never leave this browser.
      </p>

      <button onClick={exportData} className={`${secondaryBtn(darkMode)} w-full flex items-center gap-2`}>
        <Download className="w-3.5 h-3.5" /> Export my data (JSON)
      </button>

      {confirm === null ? (
        <>
          <button
            onClick={() => setConfirm('progress')}
            className={`${secondaryBtn(darkMode)} w-full flex items-center gap-2`}
          >
            <Trash2 className="w-3.5 h-3.5" /> Reset learning progress
          </button>
          <button
            onClick={() => setConfirm('all')}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Erase all local data
          </button>
        </>
      ) : (
        <div className="rounded-lg border border-rose-300 dark:border-rose-800 p-3 space-y-2">
          <div className="font-semibold text-rose-600 dark:text-rose-400">
            {confirm === 'progress'
              ? 'Reset solved problems and mastered topics?'
              : 'Erase progress, favourites, profile and preferences?'}
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setConfirm(null)} className={secondaryBtn(darkMode)}>
              Cancel
            </button>
            <button
              onClick={() => {
                if (confirm === 'progress') {
                  onResetProgress();
                  setConfirm(null);
                  setMsg('Learning progress was reset.');
                } else {
                  clearAll();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {msg && <div className="text-emerald-600 dark:text-emerald-400">{msg}</div>}
    </div>
  );
};

const LS_FEEDBACK_KEY = 'codeflow_feedback_v1';

const HelpPanel: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [open, setOpen] = useState<number | null>(0);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const prev = JSON.parse(localStorage.getItem(LS_FEEDBACK_KEY) || '[]');
      prev.push({ text: text.trim(), at: new Date().toISOString() });
      localStorage.setItem(LS_FEEDBACK_KEY, JSON.stringify(prev));
    } catch {
      // ignore storage errors
    }
    setText('');
    setSent(true);
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="space-y-1.5">
        {FAQS.map((f, i) => (
          <div
            key={f.q}
            className={`rounded-lg border ${darkMode ? 'border-slate-700' : 'border-[#E0D9CB]'}`}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left font-semibold cursor-pointer"
            >
              <span>{f.q}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
              />
            </button>
            {open === i && (
              <p className="px-3 pb-2.5 text-slate-500 dark:text-slate-400 leading-relaxed">{f.a}</p>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={send} className="space-y-2">
        <Label>Send feedback</Label>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setSent(false);
          }}
          rows={3}
          placeholder="Tell us what to improve..."
          className={`${fieldClass(darkMode)} resize-none`}
        />
        <div className="flex items-center justify-between">
          <span className="text-emerald-600 dark:text-emerald-400">
            {sent ? 'Thanks! Feedback saved.' : ''}
          </span>
          <button type="submit" disabled={!text.trim()} className={`${primaryBtn} flex items-center gap-1.5`}>
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </div>
      </form>
    </div>
  );
};
