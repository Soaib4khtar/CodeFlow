import React, { useRef, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { TopicData, PracticeProblem } from '@/types/codeflow';

interface GlobalSearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  allTopics: TopicData[];
  allProblems: PracticeProblem[];
  onSelectTopic: (topicId: string) => void;
  onSelectProblem: (problem: PracticeProblem) => void;
  darkMode: boolean;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  allTopics,
  allProblems,
  onSelectTopic,
  onSelectProblem,
  darkMode
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Press '/' anywhere outside inputs to focus the global search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement as HTMLElement)?.tagName;
      if (
        e.key === '/' &&
        document.activeElement !== inputRef.current &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)
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

  const query = searchQuery.trim().toLowerCase();
  const filteredTopics = query
    ? allTopics
        .filter(
          (t) =>
            t.title.toLowerCase().includes(query) || t.pillar.toLowerCase().includes(query)
        )
        .slice(0, 6)
    : [];

  const filteredProblems = query
    ? allProblems.filter((p) => p.title.toLowerCase().includes(query)).slice(0, 4)
    : [];

  return (
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

      {dropdownOpen && query.length > 0 && (
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
  );
};
