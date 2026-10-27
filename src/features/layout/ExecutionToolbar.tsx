import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Eye,
  X
} from 'lucide-react';
import { CodeLanguage, PracticeProblem } from '@/types/codeflow';
import { generatePseudocode } from '@/lib/problemHelpers';

const LANG_BADGES: Record<CodeLanguage, { short: string; label: string; bg: string }> = {
  javascript: { short: 'JS', label: 'JavaScript', bg: 'bg-[#FACC15] text-slate-900' },
  typescript: { short: 'TS', label: 'TypeScript', bg: 'bg-[#3B82F6] text-white' },
  python: { short: 'PY', label: 'Python', bg: 'bg-[#10B981] text-white' },
  cpp: { short: 'C++', label: 'C++', bg: 'bg-[#6366F1] text-white' }
};

interface ExecutionToolbarProps {
  language: CodeLanguage;
  onLanguageChange: (lang: CodeLanguage) => void;
  stepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onStepPrev: () => void;
  onStepNext: () => void;
  onRunToggle: () => void;
  onReset: () => void;
  showPseudocode: boolean;
  onTogglePseudocode: () => void;
  onShowAnswer: () => void;
  selectedProblem: PracticeProblem;
  darkMode: boolean;
}

export const ExecutionToolbar: React.FC<ExecutionToolbarProps> = ({
  language,
  onLanguageChange,
  stepIndex,
  totalSteps,
  isPlaying,
  onStepPrev,
  onStepNext,
  onRunToggle,
  onReset,
  showPseudocode,
  onTogglePseudocode,
  onShowAnswer,
  selectedProblem,
  darkMode
}) => {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Left: Language Selector */}
        <div className="relative flex items-center">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
              darkMode
                ? 'bg-slate-900 border-slate-800 text-slate-200'
                : 'bg-[#FAF8F5] border-[#E0D9CB] text-[#1E293B] shadow-2xs'
            }`}
          >
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${LANG_BADGES[language].bg}`}
            >
              {LANG_BADGES[language].short}
            </span>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as CodeLanguage)}
              aria-label="Select programming language"
              className="bg-transparent pr-4 focus:outline-none cursor-pointer font-semibold text-xs appearance-none"
            >
              <option value="javascript" className="text-slate-900">
                JavaScript
              </option>
              <option value="typescript" className="text-slate-900">
                TypeScript
              </option>
              <option value="python" className="text-slate-900">
                Python
              </option>
              <option value="cpp" className="text-slate-900">
                C++
              </option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 -ml-3 pointer-events-none" />
          </div>
        </div>

        {/* Center: Step Counter + Run/Pause + Reset */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div
            className={`flex items-center rounded-lg border text-xs font-semibold ${
              darkMode
                ? 'bg-slate-900 border-slate-800 text-slate-200'
                : 'bg-[#FAF8F5] border-[#E0D9CB] text-[#334155] shadow-2xs'
            }`}
          >
            <button
              onClick={onStepPrev}
              disabled={stepIndex === 0}
              title="Step Backward (←)"
              className="px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-3.5 py-1.5 border-x border-[#E0D9CB] dark:border-slate-800 text-xs">
              Step{' '}
              <strong className="font-bold">
                {stepIndex + 1} / {totalSteps}
              </strong>
            </span>
            <button
              onClick={onStepNext}
              disabled={stepIndex >= totalSteps - 1}
              title="Step Forward (→)"
              className="px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onRunToggle}
            title="Run / Pause (Space)"
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              darkMode
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              darkMode
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-[#FAF8F5] border-[#E0D9CB] text-[#334155] hover:bg-[#F2EEE5] shadow-2xs'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>

        {/* Right: Pseudocode + Show Answer Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePseudocode}
            title={`Show pseudocode for #${selectedProblem.number}. ${selectedProblem.title}`}
            className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showPseudocode
                ? darkMode
                  ? 'bg-amber-950/70 border-amber-700 text-amber-300'
                  : 'bg-[#EAE4D8] border-[#D0C6B5] text-[#1E293B]'
                : darkMode
                ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'bg-[#FAF8F5] border-[#E0D9CB] text-[#334155] hover:bg-[#F2EEE5] shadow-2xs'
            }`}
          >
            <FileText
              className={`w-3.5 h-3.5 ${
                darkMode ? 'text-amber-400' : 'text-[#2563EB]'
              }`}
            />
            <span>Pseudocode</span>
          </button>

          <button
            onClick={onShowAnswer}
            title={`Reveal final solution code for #${selectedProblem.number}. ${selectedProblem.title} and visualize all test cases`}
            className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              darkMode
                ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300 hover:bg-emerald-900/70'
                : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#15803D] hover:bg-[#D1FAE5] shadow-2xs'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Show Answer</span>
          </button>
        </div>
      </div>

      {/* Collapsible Pseudocode Drawer */}
      {showPseudocode && (
        <div
          className={`rounded-xl border p-4 ${
            darkMode
              ? 'bg-slate-900 border-slate-800 text-slate-200'
              : 'bg-[#FAF8F5] border-[#E0D9CB] text-[#1E293B] shadow-[0_1px_3px_rgba(40,30,20,0.04)]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-bold flex items-center gap-1.5 ${
                darkMode ? 'text-amber-400' : 'text-[#2563EB]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Pseudocode · #{selectedProblem.number}. {selectedProblem.title}
            </span>
            <button
              onClick={onTogglePseudocode}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Close pseudocode"
            >
              <X className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
          <pre className="text-[12px] leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto">
            {generatePseudocode(selectedProblem)}
          </pre>
        </div>
      )}
    </>
  );
};
