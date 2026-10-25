import React, { useRef, useEffect, useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Code2,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen
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
  onToggleSidebar
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  return (
    <header
      className={`sticky top-0 z-40 h-14 px-4 lg:px-6 border-b transition-colors flex items-center justify-between gap-4 ${
        darkMode
          ? 'bg-slate-900/95 border-slate-800 text-slate-100'
          : 'bg-white/95 border-[#E5EAF2] text-slate-800'
      } backdrop-blur-md`}
    >
      {/* Left: Sidebar Toggle + Brand Logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Mobile menu button (< lg) */}
        <button
          onClick={onToggleMobileMenu}
          className={`lg:hidden p-1.5 rounded-lg border transition-colors ${
            darkMode
              ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
              : 'border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="Toggle Mobile Menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Desktop Sidebar Visibility Toggle (lg+) */}
        <button
          onClick={onToggleSidebar}
          title={sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
          aria-label={sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
          className={`hidden lg:flex items-center justify-center p-1.5 rounded-lg border transition-all cursor-pointer ${
            darkMode
              ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'border-[#E2E8F0] text-slate-600 hover:bg-slate-100 hover:text-[#2563EB]'
          }`}
        >
          {sidebarVisible ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeftOpen className="w-4 h-4 text-[#2563EB]" />
          )}
        </button>

        <div
          onClick={() => onSelectTopic('binary-search')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Code2 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[19px] font-extrabold tracking-tight">
            <span className={darkMode ? 'text-white' : 'text-[#0F172A]'}>Code</span>
            <span className="text-[#2563EB]">Flow</span>
          </span>
        </div>
      </div>

      {/* Center: Global Search Input */}
      <div className="relative flex-1 max-w-md mx-auto">
        <div
          className={`flex items-center rounded-lg border px-3 py-1.5 transition-all ${
            darkMode
              ? 'bg-slate-800/80 border-slate-700 focus-within:border-blue-500'
              : 'bg-[#F8FAFC] border-[#E2E8F0] focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10'
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
                : 'text-slate-700 placeholder:text-slate-400'
            }`}
          />
          <kbd
            className={`ml-2 px-1.5 py-0.5 text-[10px] font-mono rounded border shrink-0 ${
              darkMode
                ? 'bg-slate-900 border-slate-700 text-slate-400'
                : 'bg-white border-slate-200 text-slate-400 shadow-2xs'
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
                : 'bg-white border-slate-200 text-slate-800'
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
                          darkMode ? 'hover:bg-slate-800' : 'hover:bg-blue-50/80'
                        }`}
                      >
                        <span className="font-medium">{t.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
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
                          darkMode ? 'hover:bg-slate-800' : 'hover:bg-blue-50/80'
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

      {/* Right: Utility Icons & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          title="Notifications"
          className={`p-2 rounded-lg transition-colors relative ${
            darkMode
              ? 'text-slate-300 hover:bg-slate-800'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 absolute top-2 right-2" />
        </button>

        <button
          onClick={onToggleDarkMode}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            darkMode
              ? 'text-amber-300 hover:bg-slate-800'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
          }`}
        >
          {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        <div
          title="Soaib"
          className="w-7 h-7 rounded-full bg-[#3B82F6] text-white text-xs font-bold flex items-center justify-center shadow-xs select-none cursor-pointer"
        >
          S
        </div>
      </div>
    </header>
  );
};
