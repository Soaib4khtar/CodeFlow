import React from 'react';
import { FileText, CheckCircle2, Lightbulb } from 'lucide-react';
import { PracticeProblem, TopicData } from '@/types/codeflow';
import { getDifficultyBadgeStyle } from './TopicProblemsList';

interface ProblemDetailsCardProps {
  selectedProblem: PracticeProblem;
  currentTopic: TopicData;
  totalTopicProblems: number;
  isSolved: boolean;
  darkMode: boolean;
}

/**
 * Right sub-card in the Bottom Workspace: displays the selected problem's statement,
 * underlying logic hint, and input/output examples.
 */
export const ProblemDetailsCard: React.FC<ProblemDetailsCardProps> = ({
  selectedProblem,
  currentTopic,
  totalTopicProblems,
  isSolved,
  darkMode
}) => {
  return (
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
            {isSolved && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Solved
              </span>
            )}
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getDifficultyBadgeStyle(
                selectedProblem.difficulty
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
          {[
            { label: 'Example 1:', ex: selectedProblem.example1 },
            { label: 'Example 2:', ex: selectedProblem.example2 }
          ].map(({ label, ex }) => (
            <div key={label}>
              <div
                className={`text-xs font-bold mb-1 ${
                  darkMode ? 'text-slate-200' : 'text-[#1E293B]'
                }`}
              >
                {label}
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
                  <span>{ex.input}</span>
                </div>
                <div>
                  <span className="font-bold text-[#1E293B] dark:text-white">
                    Output:{' '}
                  </span>
                  <span className="text-[#16A34A] font-bold">{ex.output}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Progress Label */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <span className="text-[11px] text-slate-400">
          Question {selectedProblem.number} of {totalTopicProblems} in{' '}
          <strong>{currentTopic.title}</strong>
        </span>
      </div>
    </div>
  );
};
