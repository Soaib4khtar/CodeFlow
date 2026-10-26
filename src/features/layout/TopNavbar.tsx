import React, { useRef, useEffect, useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Code2,
  Menu,
  X,
  PanelLeftOpen,
  Star,
  Trash2,
  User,
  Settings,
  Sliders,
  Keyboard,
  HelpCircle,
  LogOut,
  LogIn,
  Shield,
  Check
} from 'lucide-react';
import { TopicData, PracticeProblem } from '../types/codeflow';

interface TopNavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  allTopics: TopicData[];
  allProblems: PracticeProblem[];
  onSelectTopic: (topicId: string) => void;
  onSelectProblem: (problem: PracticeProblem) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleMobileMenu: () => void;
  mobileMenuOpen: boolean;
  sidebarVisible: boolean;
  onToggleSidebar: () => void;
  favourites: string[];
  onToggleFavourite: (topicId: string) => void;
  completedTopics: string[];
  solvedProblems: string[];
  onResetProgress: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  searchQuery,
  onSearchChange,
  allTopics,
  allProblems,
  onSelectTopic,
  onSelectProblem,
  darkMode,
  onToggleDarkMode,
  onToggleMobileMenu,
  mobileMenuOpen,
  sidebarVisible,
  onToggleSidebar,
  favourites,
  onToggleFavourite,
  completedTopics
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [favDrawerOpen, setFavDrawerOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Press '/' to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement !== inputRef.current &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(
          (document.activeElement as HTMLElement)?.tagName
        )
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setDropdownOpen(true);
      } else if (e.key === 'Escape') {
        setDropdownOpen(false);
        setFavDrawerOpen(false);
        setAccountMenuOpen(false);
        setActiveModal(null);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTopics = searchQuery.trim()
    ? allTopics
        .filter(
          (t) =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.pillar.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const filteredProblems = searchQuery.trim()
    ? allProblems
        .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 4)
    : [];

  const favouriteTopics = allTopics.filter((t) => favourites.includes(t.id));

  return (
    <header
      className={`sticky top-0 z-40 h-14 px-4 lg:px-6 border-b transition-colors flex items-center justify-between gap-4 ${
        darkMode
          ? 'bg-slate-900/95 border-slate-800 text-slate-100'
          : 'bg-[#FAF8F5]/95 border-[#E5DFD3] text-slate-800'
      } backdrop-blur-md`}
    >
      {/* Left: Mobile menu toggle + Brand Logo (desktop sidebar toggle moved directly underneath the CodeFlow logo per user request) */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Mobile menu button (< lg) */}
        <button
          onClick={onToggleMobileMenu}
          className={`lg:hidden p-1.5 rounded-lg border transition-colors ${
            darkMode
              ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
              : 'border-[#E2DCD0] bg-[#FAF8F5] text-slate-600 hover:bg-[#EAE4D8]'
          }`}
          aria-label="Toggle Mobile Menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        <div
          onClick={() => onSelectTopic('binary-search')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] dark:bg-amber-500 flex items-center justify-center text-white dark:text-slate-950 shadow-sm shadow-blue-500/20 dark:shadow-amber-500/20 font-bold">
            <Code2 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[19px] font-extrabold tracking-tight">
            <span className={darkMode ? 'text-white' : 'text-[#0F172A]'}>Code</span>
            <span className="text-[#2563EB] dark:text-amber-400">Flow</span>
          </span>
        </div>
      </div>

      {/* Center: Global Search Input */}
      <div className="relative flex-1 max-w-md mx-auto">
        <div
          className={`flex items-center rounded-lg border px-3 py-1.5 transition-all ${
            darkMode
              ? 'bg-slate-800/80 border-slate-700 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20'
              : 'bg-[#F2EEE5] border-[#E0D9CB] focus-within:bg-[#FAF8F5] focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-blue-500/10'
          }`}
        >
          <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 180)}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setDropdownOpen(true);
            }}
            placeholder="Search topics, problems, or concepts..."
            className={`w-full text-xs sm:text-[13px] bg-transparent focus:outline-none ${
              darkMode
                ? 'text-slate-100 placeholder:text-slate-400'
                : 'text-slate-800 placeholder:text-slate-400'
            }`}
          />
          <kbd
            className={`ml-2 px-1.5 py-0.5 text-[10px] font-mono rounded border shrink-0 ${
              darkMode
                ? 'bg-slate-900 border-slate-700 text-slate-400'
                : 'bg-[#FAF8F5] border-[#E0D9CB] text-slate-500 shadow-2xs'
            }`}
          >
            /
          </kbd>
        </div>

        {/* Instant Search Results Dropdown */}
        {dropdownOpen && searchQuery.trim().length > 0 && (
          <div
            className={`absolute left-0 right-0 mt-1.5 rounded-xl border shadow-xl overflow-hidden z-50 ${
              darkMode
                ? 'bg-slate-900 border-slate-700 text-slate-100'
                : 'bg-[#FAF8F5] border-[#E2DCD0] text-slate-800'
            }`}
          >
            {filteredTopics.length === 0 && filteredProblems.length === 0 ? (
              <div className="p-3.5 text-xs text-slate-400 text-center">
                No matching topics or problems found for "{searchQuery}"
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTopics.length > 0 && (
                  <div className="p-2">
                    <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Topics ({filteredTopics.length})
                    </div>
                    {filteredTopics.map((t) => (
                      <button
                        key={t.id}
                        onMouseDown={() => {
                          onSelectTopic(t.id);
                          onSearchChange('');
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                          darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#EFECE4]'
                        }`}
                      >
                        <span className="font-medium">{t.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-amber-950/60 dark:text-amber-300">
                          {t.pillar}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {filteredProblems.length > 0 && (
                  <div className="p-2">
                    <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Problems ({filteredProblems.length})
                    </div>
                    {filteredProblems.map((p) => (
                      <button
                        key={p.id}
                        onMouseDown={() => {
                          onSelectProblem(p);
                          onSearchChange('');
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                          darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#EFECE4]'
                        }`}
                      >
                        <span className="font-medium">
                          #{p.number}. {p.title}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-medium">
                          {p.difficulty}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Utility Icons (Favourites, Dark Mode, User Account Options Menu) */}
      <div className="relative flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Bell / Favourites Drawer Button */}
        <button
          onClick={() => {
            setFavDrawerOpen((prev) => !prev);
            setAccountMenuOpen(false);
          }}
          title="Saved Favourites"
          className={`p-2 rounded-lg transition-colors relative cursor-pointer ${
            favDrawerOpen
              ? 'bg-[#EFECE4] text-[#2563EB] dark:bg-slate-800 dark:text-amber-400'
              : darkMode
              ? 'text-slate-300 hover:bg-slate-800'
              : 'text-slate-500 hover:bg-[#EFECE4] hover:text-slate-700'
          }`}
        >
          <Bell className="w-4 h-4" />
          {favourites.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-amber-400 absolute top-2 right-2" />
          )}
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            darkMode
              ? 'text-amber-400 hover:bg-slate-800'
              : 'text-slate-500 hover:bg-[#EFECE4] hover:text-slate-700'
          }`}
        >
          {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* User Account Options Button (Repurposed from Progress Dashboard) */}
        <button
          onClick={() => {
            setAccountMenuOpen((prev) => !prev);
            setFavDrawerOpen(false);
          }}
          title="User Account Options"
          className={`w-7 h-7 rounded-full bg-[#2563EB] dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-bold flex items-center justify-center shadow-xs select-none cursor-pointer transition-transform ${
            accountMenuOpen
              ? 'ring-2 ring-blue-400 dark:ring-amber-400 scale-105'
              : 'hover:scale-105'
          }`}
        >
          S
        </button>

        {/* POPOVER 1: Saved Favourites Drawer */}
        {favDrawerOpen && (
          <div
            className={`absolute right-0 top-12 w-80 rounded-xl border shadow-xl p-3.5 z-50 space-y-3 ${
              darkMode
                ? 'bg-slate-900 border-slate-700 text-slate-100'
                : 'bg-[#FAF8F5] border-[#E2DCD0] text-[#1E293B]'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Saved Favourites ({favouriteTopics.length})</span>
              </div>
              <button
                onClick={() => setFavDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {favouriteTopics.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">
                No favourite topics saved yet. Click <strong>"Add to Favourites"</strong> on any topic to bookmark it here!
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto space-y-1.5">
                {favouriteTopics.map((t) => (
                  <div
                    key={t.id}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs ${
                      darkMode
                        ? 'bg-slate-950/60 border-slate-800'
                        : 'bg-[#F2EEE5] border-[#E0D9CB]'
                    }`}
                  >
                    <button
                      onClick={() => {
                        onSelectTopic(t.id);
                        setFavDrawerOpen(false);
                      }}
                      className="text-left font-semibold hover:text-[#2563EB] dark:hover:text-amber-400 truncate flex-1 cursor-pointer"
                    >
                      {t.title}
                      <span className="ml-1.5 text-[10px] font-normal text-slate-400">
                        ({t.pillar})
                      </span>
                    </button>
                    <button
                      onClick={() => onToggleFavourite(t.id)}
                      title="Remove from Favourites"
                      className="text-slate-400 hover:text-rose-500 ml-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* POPOVER 2: Repurposed User Account Options Menu */}
        {accountMenuOpen && (
          <div
            className={`absolute right-0 top-12 w-72 rounded-xl border shadow-xl p-3 z-50 space-y-2 ${
              darkMode
                ? 'bg-slate-900 border-slate-700 text-slate-100'
                : 'bg-[#FAF8F5] border-[#E2DCD0] text-[#1E293B]'
            }`}
          >
            {/* User Profile Header */}
            <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#2563EB] dark:bg-amber-500 text-white dark:text-slate-950 text-sm font-extrabold flex items-center justify-center shrink-0">
                  S
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Soaib</div>
                  <div className="text-[11px] text-slate-400 truncate">soaib@codeflow.dev</div>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {isLoggedIn ? 'Active' : 'Guest'}
              </span>
            </div>

            {/* Account Options Navigation List */}
            <div className="space-y-0.5 text-xs">
              <button
                onClick={() => {
                  setActiveModal('profile');
                  setAccountMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#EFECE4]'
                }`}
              >
                <User className="w-4 h-4 text-[#2563EB] dark:text-amber-400" />
                <span className="font-medium flex-1">Profile & Account</span>
              </button>

              <button
                onClick={() => {
                  setActiveModal('settings');
                  setAccountMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#EFECE4]'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="font-medium flex-1">Settings & Preferences</span>
              </button>

              <button
                onClick={() => {
                  setActiveModal('editor');
                  setAccountMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#EFECE4]'
                }`}
              >
                <Sliders className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="font-medium flex-1">Editor & Appearance</span>
              </button>

              <button
                onClick={() => {
                  setActiveModal('shortcuts');
                  setAccountMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#EFECE4]'
                }`}
              >
                <Keyboard className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="font-medium flex-1">Keyboard Shortcuts</span>
                <span className="text-[10px] font-mono text-slate-400 border border-slate-300 dark:border-slate-700 px-1 rounded">
                  /
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveModal('security');
                  setAccountMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#EFECE4]'
                }`}
              >
                <Shield className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="font-medium flex-1">Privacy & Security</span>
              </button>

              <button
                onClick={() => {
                  setActiveModal('help');
                  setAccountMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#EFECE4]'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="font-medium flex-1">Help & Feedback</span>
              </button>
            </div>

            {/* Divider & Login / Logout Action */}
            <div className="pt-1 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setIsLoggedIn((prev) => !prev);
                  setAccountMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs font-semibold transition-colors cursor-pointer ${
                  isLoggedIn
                    ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                    : 'text-[#2563EB] dark:text-amber-400 hover:bg-blue-50 dark:hover:bg-amber-950/40'
                }`}
              >
                {isLoggedIn ? (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Log In</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Account Modal for Settings/Shortcuts/Profile when selected */}
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div
              className={`w-full max-w-md rounded-xl border shadow-2xl p-5 space-y-4 ${
                darkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-100'
                  : 'bg-[#FAF8F5] border-[#E2DCD0] text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold capitalize">
                  {activeModal === 'profile' && <User className="w-4 h-4 text-[#2563EB] dark:text-amber-400" />}
                  {activeModal === 'settings' && <Settings className="w-4 h-4 text-[#2563EB] dark:text-amber-400" />}
                  {activeModal === 'editor' && <Sliders className="w-4 h-4 text-[#2563EB] dark:text-amber-400" />}
                  {activeModal === 'shortcuts' && <Keyboard className="w-4 h-4 text-[#2563EB] dark:text-amber-400" />}
                  {activeModal === 'security' && <Shield className="w-4 h-4 text-[#2563EB] dark:text-amber-400" />}
                  {activeModal === 'help' && <HelpCircle className="w-4 h-4 text-[#2563EB] dark:text-amber-400" />}
                  <span>
                    {activeModal === 'shortcuts'
                      ? 'Keyboard Shortcuts'
                      : activeModal === 'editor'
                      ? 'Editor & Appearance'
                      : activeModal === 'security'
                      ? 'Privacy & Security'
                      : activeModal === 'profile'
                      ? 'Account & Profile'
                      : activeModal === 'help'
                      ? 'Help & Documentation'
                      : 'Preferences & Settings'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {activeModal === 'shortcuts' && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-300">Run / Pause Execution</span>
                    <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono font-bold">Space</kbd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-300">Next Step</span>
                    <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono font-bold">→</kbd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-300">Previous Step</span>
                    <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono font-bold">←</kbd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-300">Focus Global Search</span>
                    <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono font-bold">/</kbd>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-600 dark:text-slate-300">Indent in Code Editor</span>
                    <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono font-bold">Tab</kbd>
                  </div>
                </div>
              )}

              {activeModal === 'profile' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Display Name</label>
                    <input
                      type="text"
                      defaultValue="Soaib"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue="soaib@codeflow.dev"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Account Role</label>
                    <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs">
                      Software Engineering Learner
                    </div>
                  </div>
                </div>
              )}

              {(activeModal === 'settings' || activeModal === 'editor' || activeModal === 'security' || activeModal === 'help') && (
                <div className="py-2 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                  <p>Account options and custom user preferences are synchronized with your active session.</p>
                  <div className="p-3 rounded-lg bg-[#F2EEE5] dark:bg-slate-800/80 border border-[#E0D9CB] dark:border-slate-700 text-[11.5px] space-y-1">
                    <div className="font-semibold text-slate-700 dark:text-slate-200">Session Status:</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Logged in as Soaib</div>
                    <div className="text-slate-500">Theme: {darkMode ? 'Dark Mode (Amber/Gold)' : 'Light Mode (Beige Palette)'}</div>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-1.5 rounded-lg bg-[#2563EB] dark:bg-amber-500 hover:bg-[#1D4ED8] dark:hover:bg-amber-600 text-white dark:text-slate-950 text-xs font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
