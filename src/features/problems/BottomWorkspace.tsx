import React, { useState, useEffect } from 'react';
import { ListFilter, BookOpen } from 'lucide-react';
import {
  PracticeProblem,
  DifficultyBadge,
  TopicData,
  TopicStep
} from '@/types/codeflow';
import { ConceptPrimerBanner } from './ConceptPrimerBanner';
import { TopicProblemsList } from './TopicProblemsList';
import { ProblemDetailsCard } from './ProblemDetailsCard';

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

/**
 * Bottom Workspace container: pairs the active topic's Problem Set list with the
 * Question Details & Underlying Logic panel and optional Concept Guide banner.
 */
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
  // Show/Hide Concept Guide toggle is hidden by default
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

  return (
    <div className="space-y-3">
      {/* Top Tab Bar: Topic Problem Set + Show/Hide Concept Guide */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2DCD0] dark:border-slate-800">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 pb-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer border-[#2563EB] text-[#2563EB] dark:border-amber-400 dark:text-amber-400">
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
        {showConceptPrimer && (
          <ConceptPrimerBanner
            currentTopic={currentTopic}
            firstProblem={topicProblems[0]}
            darkMode={darkMode}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <TopicProblemsList
            currentTopic={currentTopic}
            topicProblems={topicProblems}
            visibleProblems={visibleProblems}
            selectedProblem={selectedProblem}
            onSelectProblem={onSelectProblem}
            problemSearch={problemSearch}
            onSearchChange={setProblemSearch}
            difficultyFilter={difficultyFilter}
            onDifficultyChange={setDifficultyFilter}
            solvedProblems={solvedProblems}
            darkMode={darkMode}
          />

          <ProblemDetailsCard
            selectedProblem={selectedProblem}
            currentTopic={currentTopic}
            totalTopicProblems={topicProblems.length}
            isSolved={solvedProblems.includes(selectedProblem.id)}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
};
