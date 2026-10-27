import React from 'react';
import { Sun, Moon, Code2, Menu, X } from 'lucide-react';
import { TopicData, PracticeProblem } from '@/types/codeflow';
import { AccountMenu } from '@/features/account/AccountMenu';
import { AccountApi } from '@/features/account/useAccount';
import { GlobalSearchBar } from './GlobalSearchBar';
import { FavouritesDropdown } from './FavouritesDropdown';

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
  return (
    <header
      className={`sticky top-0 z-40 h-14 px-4 lg:px-6 border-b transition-colors flex items-center justify-between gap-4 ${
        darkMode
          ? 'bg-slate-900/95 border-slate-800 text-slate-100'
          : 'bg-[#FAF8F5]/95 border-[#E5DFD3] text-slate-800'
      } backdrop-blur-md`}
    >
      {/* Left: Mobile Menu Button + CodeFlow Brand Logo */}
      <div className="flex items-center gap-2.5 shrink-0">
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

      {/* Center: Global Search Input & Instant Results Dropdown */}
      <GlobalSearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        allTopics={allTopics}
        allProblems={allProblems}
        onSelectTopic={onSelectTopic}
        onSelectProblem={onSelectProblem}
        darkMode={darkMode}
      />

      {/* Right: Favourites Drawer, Light/Dark Toggle, and User Account Menu */}
      <div className="relative flex items-center gap-2 sm:gap-3 shrink-0">
        <FavouritesDropdown
          allTopics={allTopics}
          favourites={favourites}
          onSelectTopic={onSelectTopic}
          onToggleFavourite={onToggleFavourite}
          darkMode={darkMode}
        />

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

        <AccountMenu
          account={account}
          darkMode={darkMode}
          onResetProgress={onResetProgress}
        />
      </div>
    </header>
  );
};
