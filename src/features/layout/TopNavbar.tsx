import React, { useRef, useEffect, useState } from 'react';
import { Search, Bell, Sun, Moon, Code2, Menu, X, Star, Trash2 } from 'lucide-react';
import { TopicData, PracticeProblem } from '@/types/codeflow';
import { AccountMenu } from '@/features/account/AccountMenu';
import { AccountApi } from '@/features/account/useAccount';

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
  favourites: string[];
  onToggleFavourite: (topicId: string) => void;
  onResetProgress: () => void;
  account: AccountApi;
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
  favourites,
  onToggleFavourite,
  onResetProgress,
  account
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [favDrawerOpen, setFavDrawerOpen] = useState(false);

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

        {/* Account dropdown (profile, settings, appearance, privacy, help, login/logout) */}
        <AccountMenu account={account} darkMode={darkMode} onResetProgress={onResetProgress} />

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

      </div>
    </header>
  );
};
