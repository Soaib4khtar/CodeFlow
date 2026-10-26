import React, { useState, useEffect } from 'react';
import {
  ListFilter,
  Search,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  FileText
} from 'lucide-react';
import {
  PracticeProblem,
  DifficultyBadge,
  TopicData,
  TopicStep
} from '@/types/codeflow';

interface BottomWorkspaceProps {
  problems: PracticeProblem[];
  selectedProblem: PracticeProblem;
  onSelectProblem: (problem: PracticeProblem) => void;
  onStartSolving: (problem: PracticeProblem) => void;
  currentTopic: TopicData;
  currentStep: TopicStep;
  darkMode: boolean;
  solvedProblems: string[];
}

export const BottomWorkspace: React.FC<BottomWorkspaceProps> = ({
  problems,
  selectedProblem,
  onSelectProblem,
  currentTopic,
  darkMode,
  solvedProblems
}) => {
  const [problemSearch, setProblemSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | DifficultyBadge>('All');
  // Requirement: Set the Show/Hide Concept Guide toggle to hidden by default
  const [showConceptPrimer, setShowConceptPrimer] = useState<boolean>(false);

  useEffect(() => {
    setDifficultyFilter('All');
    setProblemSearch('');
  }, [currentTopic.id]);

  // Filter strictly to current topic's problems + search + difficulty filter
  const topicProblems = problems.filter((p) => p.topicId === currentTopic.id);
  const visibleProblems = topicProblems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(problemSearch.toLowerCase());
    const matchesDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  });

  const solvedInTopicCount = topicProblems.filter((p) =>
    solvedProblems.includes(p.id)
  ).length;

  const getBadgeStyle = (prob: PracticeProblem) => {
    if (prob.difficulty === 'Easy') {
      return 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]';
    }
    if (prob.difficulty === 'Hard') {
      return 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]';
    }
    return 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE] dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800';
  };

  return (
    <div className="space-y-3">
      {/* Top Tab Bar: Topic Problem Set + Show/Hide Concept Guide */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2DCD0] dark:border-slate-800">
        <div className="flex items-center gap-6">
          <button
            className={`flex items-center gap-2 pb-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer border-[#2563EB] text-[#2563EB] dark:border-amber-400 dark:text-amber-400`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>{currentTopic.title} Problem Set</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#EFECE4] text-[#1E293B] dark:bg-amber-950 dark:text-amber-300">
              {solvedInTopicCount}/{topicProblems.length}
            </span>
          </button>
        </div>

        {/* Right Side Controls: Toggle Guided Concept Primer */}
        <div className="flex items-center gap-2 pb-2">
          <button
            onClick={() => setShowConceptPrimer((prev) => !prev)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              showConceptPrimer
                ? darkMode
                  ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                  : 'bg-[#EAE4D8] border-[#D0C6B5] text-[#1E293B]'
                : darkMode
                ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                : 'bg-[#FAF8F5] border-[#E0D9CB] text-slate-600 hover:bg-[#F2EEE5]'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>{showConceptPrimer ? 'Hide Concept Guide' : 'Show Concept Guide'}</span>
          </button>
        </div>
      </div>

      {/* Main Topic Problem Set + Concept Primer */}
      <div className="space-y-3.5">
        {/* Guided Onboarding & Concept-First Progression Banner (Hidden by default) */}
        {showConceptPrimer && (
          <div
            className={`rounded-xl border p-3.5 transition-all ${
              darkMode
                ? 'bg-slate-900/90 border-slate-800 text-slate-200'
                : 'bg-[#FAF8F5] border-[#E0D9CB] shadow-[0_1px_3px_rgba(40,30,20,0.04)]'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
              <div className="lg:col-span-5 space-y-1">
                <div
                  className={`flex items-center gap-2 text-xs font-extrabold ${
                    darkMode ? 'text-amber-400' : 'text-[#2563EB]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Guided Mastery Path —{' '}
                    {currentTopic.learningOrder
                      ? `Topic #${currentTopic.learningOrder}: ${currentTopic.title}`
                      : currentTopic.title}
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>1. Core Mental Model: </strong>
                  {currentTopic.intuition}
                </p>
              </div>

              <div className="lg:col-span-4 space-y-1 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-2 lg:pt-0 lg:pl-3">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                  2. How It Works Under the Hood:
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {currentTopic.internals}
                </p>
              </div>

              <div className="lg:col-span-3 flex flex-col justify-between gap-2 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-2 lg:pt-0 lg:pl-3">
                <div className="text-[11px] font-bold text-[#15803D] dark:text-emerald-400">
                  3. Recommended Starting Point:
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Start with <strong>#1 ({topicProblems[0]?.title})</strong> to build the foundation before moving to Medium & Hard variations.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Sub-Card: Topic-Filtered Problems List (Easy -> Medium -> Hard) */}
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
                    onChange={(e) => setProblemSearch(e.target.value)}
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
                      onClick={() => setDifficultyFilter(diff)}
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
                            className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border ${getBadgeStyle(
                              prob
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

          {/* Right Sub-Card: Question Details + Logic Builder */}
          <div
            className={`lg:col-span-7 rounded-xl border p-4 flex flex-col justify-between ${
              darkMode
                ? 'bg-slate-900 border-slate-800'
                : 'bg-[#FAF8F5] border-[#E6E0D4] shadow-[0_1px_3px_rgba(40,30,20,0.04)]'
            }`}
          >
            <div>
              {/* Card Title Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8E2D6] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText
                    className={`w-4 h-4 ${
                      darkMode ? 'text-amber-400' : 'text-[#2563EB]'
                    }`}
                  />
                  <h3
                    className={`text-[13.5px] font-bold ${
                      darkMode ? 'text-slate-100' : 'text-[#1E293B]'
                    }`}
                  >
                    Question Details & Underlying Logic
                  </h3>
                  {selectedProblem.progressionStage && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        darkMode
                          ? 'bg-amber-950 text-amber-300'
                          : 'bg-[#EAE4D8] text-slate-800'
                      }`}
                    >
                      {selectedProblem.progressionStage}
                    </span>
                  )}
                </div>
              </div>

              {/* Problem Number + Title + Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4
                  className={`text-base font-extrabold ${
                    darkMode ? 'text-white' : 'text-[#0F172A]'
                  }`}
                >
                  {selectedProblem.number}. {selectedProblem.title}
                </h4>

                <div className="flex items-center gap-2 shrink-0">
                  {solvedProblems.includes(selectedProblem.id) && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Solved
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getBadgeStyle(
                      selectedProblem
                    )}`}
                  >
                    {selectedProblem.difficulty}
                  </span>
                </div>
              </div>

              {/* Problem Statement */}
              <p
                className={`text-xs leading-relaxed mb-3 ${
                  darkMode ? 'text-slate-300' : 'text-[#475569]'
                }`}
              >
                {selectedProblem.description}
              </p>

              {/* How to Build the Underlying Logic (Intuition First!) */}
              {selectedProblem.logicHint && (
                <div
                  className={`rounded-lg border p-3 mb-3.5 text-xs leading-relaxed ${
                    darkMode
                      ? 'bg-amber-950/30 border-amber-800/70 text-amber-200'
                      : 'bg-[#F2EEE5] border-[#E0D9CB] text-[#1E293B]'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 font-bold mb-1 ${
                      darkMode ? 'text-amber-400' : 'text-[#854D0E]'
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                    <span>Building the Underlying Logic (Before You Code):</span>
                  </div>
                  <p className="text-[11.5px]">{selectedProblem.logicHint}</p>
                </div>
              )}

              {/* Example 1 & Example 2 Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                <div>
                  <div
                    className={`text-xs font-bold mb-1 ${
                      darkMode ? 'text-slate-200' : 'text-[#1E293B]'
                    }`}
                  >
                    Example 1:
                  </div>

                  <div
                    className={`rounded-lg border px-3 py-2 font-mono text-[11.5px] space-y-1 ${
                      darkMode
                        ? 'bg-slate-950/70 border-slate-800 text-slate-200'
                        : 'bg-[#F2EEE5] border-[#E0D9CB] text-[#334155]'
                    }`}
                  >
                    <div className="truncate">
                      <span className="font-bold text-[#1E293B] dark:text-white">
                        Input:{' '}
                      </span>
                      <span>{selectedProblem.example1.input}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#1E293B] dark:text-white">
                        Output:{' '}
                      </span>
                      <span className="text-[#16A34A] font-bold">
                        {selectedProblem.example1.output}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div
                    className={`text-xs font-bold mb-1 ${
                      darkMode ? 'text-slate-200' : 'text-[#1E293B]'
                    }`}
                  >
                    Example 2:
                  </div>

                  <div
                    className={`rounded-lg border px-3 py-2 font-mono text-[11.5px] space-y-1 ${
                      darkMode
                        ? 'bg-slate-950/70 border-slate-800 text-slate-200'
                        : 'bg-[#F2EEE5] border-[#E0D9CB] text-[#334155]'
                    }`}
                  >
                    <div className="truncate">
                      <span className="font-bold text-[#1E293B] dark:text-white">
                        Input:{' '}
                      </span>
                      <span>{selectedProblem.example2.input}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#1E293B] dark:text-white">
                        Output:{' '}
                      </span>
                      <span className="text-[#16A34A] font-bold">
                        {selectedProblem.example2.output}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Progress Label (Buttons were cleanly removed) */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-slate-400">
                Question {selectedProblem.number} of {topicProblems.length} in{' '}
                <strong>{currentTopic.title}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
