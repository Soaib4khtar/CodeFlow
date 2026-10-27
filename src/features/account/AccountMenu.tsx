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
  X
} from 'lucide-react';
import { AccountApi } from './useAccount';
import { LoginPanel } from './panels/LoginPanel';
import { ProfilePanel } from './panels/ProfilePanel';
import { SettingsPanel } from './panels/SettingsPanel';
import { AppearancePanel } from './panels/AppearancePanel';
import { PrivacyPanel } from './panels/PrivacyPanel';
import { HelpPanel } from './panels/HelpPanel';

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

export const AccountMenu: React.FC<AccountMenuProps> = ({
  account,
  darkMode,
  onResetProgress
}) => {
  const { user, isLoggedIn } = account;
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen && !activePanel) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (menuOpen && rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setActivePanel(null);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen, activePanel]);

  const openPanel = (id: PanelId) => {
    setActivePanel(id);
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
        onClick={() => setMenuOpen((prev) => !prev)}
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

      {activePanel &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setActivePanel(null);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={PANEL_TITLES[activePanel]}
              className={`w-full max-w-md max-h-[85vh] overflow-y-auto rounded-xl border shadow-2xl p-5 space-y-4 ${
                darkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-100'
                  : 'bg-[#FAF8F5] border-[#E2DCD0] text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold">{PANEL_TITLES[activePanel]}</h3>
                <button
                  onClick={() => setActivePanel(null)}
                  aria-label="Close"
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {activePanel === 'login' && (
                <LoginPanel
                  darkMode={darkMode}
                  onSubmit={(profile) => {
                    account.login(profile);
                    setActivePanel(null);
                  }}
                />
              )}
              {activePanel === 'profile' && (
                <ProfilePanel
                  account={account}
                  darkMode={darkMode}
                  onNeedLogin={() => setActivePanel('login')}
                  onLogout={() => {
                    account.logout();
                    setActivePanel(null);
                  }}
                />
              )}
              {activePanel === 'settings' && (
                <SettingsPanel account={account} darkMode={darkMode} />
              )}
              {activePanel === 'appearance' && (
                <AppearancePanel account={account} darkMode={darkMode} />
              )}
              {activePanel === 'privacy' && (
                <PrivacyPanel darkMode={darkMode} onResetProgress={onResetProgress} />
              )}
              {activePanel === 'help' && <HelpPanel darkMode={darkMode} />}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
