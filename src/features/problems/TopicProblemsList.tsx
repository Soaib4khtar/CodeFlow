import React from 'react';
import { Search, CheckCircle2, ChevronRight } from 'lucide-react';
import { PracticeProblem, DifficultyBadge, TopicData } from '@/types/codeflow';

interface TopicProblemsListProps {
  currentTopic: TopicData;
  topicProblems: PracticeProblem[];
  visibleProblems: PracticeProblem[];
  selectedProblem: PracticeProblem;
  onSelectProblem: (problem: PracticeProblem) => void;
  problemSearch: string;
  onSearchChange: (val: string) => void;
  difficultyFilter: 'All' | DifficultyBadge;
  onDifficultyChange: (diff: 'All' | DifficultyBadge) => void;
  solvedProblems: string[];
  darkMode: boolean;
}

export function getDifficultyBadgeStyle(difficulty: DifficultyBadge): string {
  if (difficulty === 'Easy') {
    return 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]';
  }
  if (difficulty === 'Hard') {
    return 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]';
  }
  return 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE] dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800';
}

/**
 * Left sub-card in the Bottom Workspace: lists the active topic's practice problems
 * with search and Easy/Medium/Hard progression filter pills.
 */
export const TopicProblemsList: React.FC<TopicProblemsListProps> = ({
  currentTopic,
  topicProblems,
  visibleProblems,
  selectedProblem,
  onSelectProblem,
  problemSearch,
  onSearchChange,
  difficultyFilter,
  onDifficultyChange,
  solvedProblems,
  darkMode
}) => {
  return (
    <div
      className={`lg:col-span-5 rounded-xl border p-4 flex flex-col justify-between ${
        darkMode
          ? 'bg-slate-900 border-slate-800'
          : 'bg-[#FAF8F5] border-[#E6E0D4] shadow-[0_1px_3px_rgba(40,30,20,0.04)]'
      }`}
    >
      <div>
        {/* Header + Search */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div>
            <h3
              className={`text-[13.5px] font-bold ${
                darkMode ? 'text-slate-100' : 'text-[#1E293B]'
              }`}
            >
              {currentTopic.title} Questions
            </h3>
            <p className="text-[10.5px] text-slate-400">
              Ordered from Beginner Warmup → Advanced Mastery
            </p>
          </div>

          <div
            className={`flex items-center rounded-lg border px-2.5 py-1 w-40 sm:w-44 ${
              darkMode
                ? 'bg-slate-950 border-slate-800 focus-within:border-amber-400'
                : 'bg-[#F2EEE5] border-[#E0D9CB] focus-within:border-[#2563EB]'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
            <input
              type="text"
              value={problemSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter topic questions..."
              className="w-full text-xs bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Difficulty Progression Filter Pills */}
        <div className="flex items-center gap-1.5 mb-3">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => {
            const count =
              diff === 'All'
                ? topicProblems.length
                : topicProblems.filter((p) => p.difficulty === diff).length;
            const active = difficultyFilter === diff;
            return (
              <button
                key={diff}
                onClick={() => onDifficultyChange(diff)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
                  active
                    ? darkMode
                      ? 'bg-amber-500 border-amber-500 text-slate-950'
                      : 'bg-[#2563EB] border-[#2563EB] text-white'
                    : darkMode
                    ? 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    : 'bg-[#FAF8F5] border-[#E0D9CB] text-slate-600 hover:bg-[#F2EEE5]'
                }`}
              >
                {diff} ({count})
              </button>
            );
          })}
        </div>

        {/* Topic-Specific Problems Rows */}
        <div className="space-y-1.5">
          {visibleProblems.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No matching questions in {currentTopic.title} for this filter.
            </div>
          ) : (
            visibleProblems.map((prob) => {
              const isSelected = prob.id === selectedProblem.id;
              const isSolved = solvedProblems.includes(prob.id);
              return (
                <button
                  key={prob.id}
                  onClick={() => onSelectProblem(prob)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all cursor-pointer text-left ${
                    isSelected
                      ? darkMode
                        ? 'bg-amber-950/40 border-2 border-amber-500 text-amber-200 font-bold'
                        : 'bg-[#FAF8F5] border-2 border-[#2563EB] text-[#1E293B] font-bold shadow-xs'
                      : darkMode
                      ? 'hover:bg-slate-800/60 text-slate-300 border border-slate-800/60'
                      : 'hover:bg-[#F2EEE5] text-[#334155] border border-[#E5DFD3]'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`font-bold ${
                          isSelected
                            ? darkMode
                              ? 'text-amber-400'
                              : 'text-[#2563EB]'
                            : 'text-slate-400'
                        }`}
                      >
                        {prob.number}.
                      </span>
                      <span className="truncate">{prob.title}</span>
                      {isSolved && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                      )}
                    </div>

                    {/* Progression Stage Tag & Recommended Starting Point */}
                    <div className="flex items-center gap-1.5 mt-1 pl-4">
                      {prob.recommendedFirst && (
                        <span className="px-1.5 py-[1px] rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[9.5px] font-bold">
                          ★ Recommended Start
                        </span>
                      )}
                      {prob.progressionStage && (
                        <span className="text-[10px] text-slate-400 font-medium truncate">
                          {prob.progressionStage}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border ${getDifficultyBadgeStyle(
                        prob.difficulty
                      )}`}
                    >
                      {prob.difficulty}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
