import React from 'react';
import { BookOpen } from 'lucide-react';
import { TopicData, PracticeProblem } from '@/types/codeflow';

interface ConceptPrimerBannerProps {
  currentTopic: TopicData;
  firstProblem?: PracticeProblem;
  darkMode: boolean;
}

/**
 * 3-column Guided Mastery Path concept primer banner (hidden by default, toggled via Show Concept Guide).
 */
export const ConceptPrimerBanner: React.FC<ConceptPrimerBannerProps> = ({
  currentTopic,
  firstProblem,
  darkMode
}) => {
  return (
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
            Start with <strong>#1 ({firstProblem?.title})</strong> to build the
            foundation before moving to Medium & Hard variations.
          </p>
        </div>
      </div>
    </div>
  );
};
