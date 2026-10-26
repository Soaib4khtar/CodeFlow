import React, { useState } from 'react';
import {
  Share2,
  CheckCircle2,
  Cpu,
  Lightbulb,
  ArrowDown
} from 'lucide-react';
import { TopicData, TopicStep, VisualBox, VisualPointer } from '../types/codeflow';

interface ExecutionVisualizerCardProps {
  topic: TopicData;
  currentStep: TopicStep;
  stepIndex: number;
  onSelectStep: (stepIndex: number) => void;
  darkMode: boolean;
}

const pointersMap: Record<
  string,
  { arrow: string; label: string; badge: string }
> = {
  emerald: {
    arrow: 'text-[#16A34A]',
    label: 'text-[#16A34A]',
    badge: 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]'
  },
  blue: {
    arrow: 'text-[#2563EB] dark:text-amber-400',
    label: 'text-[#2563EB] dark:text-amber-400',
    badge: 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE] dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700'
  },
  purple: {
    arrow: 'text-[#9333EA]',
    label: 'text-[#9333EA]',
    badge: 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]'
  },
  amber: {
    arrow: 'text-[#D97706] dark:text-amber-400',
    label: 'text-[#D97706] dark:text-amber-400',
    badge: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A] dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700'
  },
  rose: {
    arrow: 'text-[#E11D48]',
    label: 'text-[#E11D48]',
    badge: 'bg-[#FFE4E6] text-[#BE123C] border-[#FECDD3]'
  }
};

export const ExecutionVisualizerCard: React.FC<ExecutionVisualizerCardProps> = ({
  topic,
  currentStep,
  stepIndex,
  onSelectStep,
  darkMode
}) => {
  // Requirement: keep the Why It Works button turned off by default
  const [showDeepWhy, setShowDeepWhy] = useState<boolean>(false);

  // Build clean trace lines for the Execution Trace list
  const traceLines =
    topic.id === 'binary-search' && topic.steps.length === 8
      ? [
          { stepIdx: 2, text: 'mid = Math.floor((0 + 4) / 2) → 2   (value = 5)' },
          { stepIdx: 3, text: 'Compare 7 with 5 → 7 > 5, so move left = mid + 1' },
          { stepIdx: 4, text: 'New range: [3, 4]' },
          { stepIdx: 5, text: 'mid = Math.floor((3 + 4) / 2) → 3   (value = 7)' },
          { stepIdx: 6, text: 'Compare 7 with 7 → target matched at mid!' }
        ]
      : topic.steps.map((s, idx) => ({
          stepIdx: idx,
          text: s.explanation
        }));

  return (
    <div
      className={`rounded-xl border p-4 flex flex-col justify-between transition-colors ${
        darkMode
          ? 'bg-slate-900 border-slate-800'
          : 'bg-[#FAF8F5] border-[#E6E0D4] shadow-[0_1px_3px_rgba(40,30,20,0.04)]'
      }`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Share2
              className={`w-4 h-4 ${
                darkMode ? 'text-amber-400' : 'text-[#2563EB]'
              }`}
            />
            <h2
              className={`text-[13.5px] font-bold ${
                darkMode ? 'text-slate-100' : 'text-[#1E293B]'
              }`}
            >
              Code Flow and Execution Visualizer
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDeepWhy((prev) => !prev)}
              className={`px-2 py-0.5 rounded-md text-[10.5px] font-semibold border flex items-center gap-1 transition-colors cursor-pointer ${
                showDeepWhy
                  ? darkMode
                    ? 'bg-amber-950/70 border-amber-700 text-amber-300'
                    : 'bg-[#EAE4D8] border-[#D0C6B5] text-[#1E293B]'
                  : darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-400'
                  : 'bg-[#F2EEE5] border-[#E0D9CB] text-slate-600 hover:bg-[#EAE4D8]'
              }`}
              title="Toggle Deep 'Why It Works' Step Inspector"
            >
              <Lightbulb className="w-3 h-3" />
              <span>Why It Works</span>
            </button>

            <span
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                darkMode
                  ? 'bg-amber-950/70 border-amber-800 text-amber-300'
                  : 'bg-[#F2EEE5] border-[#E0D9CB] text-slate-800'
              }`}
            >
              {topic.title}
            </span>
          </div>
        </div>

        {/* Visual Diagram Canvas */}
        <div
          className={`rounded-xl border px-4 py-5 mb-3.5 min-h-[148px] flex flex-col items-center justify-center ${
            darkMode
              ? 'bg-slate-950/60 border-slate-800/80'
              : 'bg-[#F2EEE5] border-[#E0D9CB]'
          }`}
        >
          {/* 1. Array / Linear Box + Colored Pointer Arrows View */}
          {currentStep.boxes && (
            <div className="flex flex-wrap items-start justify-center gap-2.5 sm:gap-3.5">
              {currentStep.boxes.map((box: VisualBox) => {
                const pointersHere = (currentStep.pointers || []).filter(
                  (p: VisualPointer) => p.index === box.index
                );

                let boxClass = darkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-200'
                  : 'bg-[#FAF8F5] border-[#DCD5C5] text-[#1E293B]';

                if (box.state === 'active') {
                  boxClass = darkMode
                    ? 'bg-amber-950/80 border-amber-500 text-amber-200 ring-2 ring-amber-500/30'
                    : 'bg-[#FAF8F5] border-[#2563EB] text-[#2563EB] ring-2 ring-blue-500/20 font-bold';
                } else if (box.state === 'found') {
                  boxClass = darkMode
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30'
                    : 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D] ring-2 ring-emerald-500/20 font-bold';
                } else if (box.state === 'discarded') {
                  boxClass = darkMode
                    ? 'bg-slate-900/40 border-slate-800/50 text-slate-600 line-through'
                    : 'bg-[#EAE4D8]/60 border-[#D8D0C0] text-slate-400 line-through';
                }

                return (
                  <div key={box.index} className="flex flex-col items-center">
                    {/* Pointer Arrows above the box */}
                    <div className="h-9 flex flex-col justify-end items-center mb-1">
                      {pointersHere.map((ptr: VisualPointer, pIdx: number) => {
                        const style =
                          pointersMap[ptr.color || 'blue'] || pointersMap.blue;
                        const ptrName = ptr.label || (ptr as { name?: string }).name || '';
                        return (
                          <div
                            key={pIdx}
                            className="flex flex-col items-center animate-bounce"
                            style={{ animationDuration: '1.4s' }}
                          >
                            <span
                              className={`text-[9.5px] font-mono font-bold px-1 rounded uppercase tracking-wider ${style.label}`}
                            >
                              {ptrName}
                            </span>
                            <ArrowDown
                              className={`w-3.5 h-3.5 stroke-[2.5] -mt-0.5 ${style.arrow}`}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Element Box Container */}
                    <div
                      className={`w-12 h-12 sm:w-13 sm:h-13 rounded-xl border flex items-center justify-center font-mono text-base font-bold transition-all shadow-xs ${boxClass}`}
                    >
                      {box.value}
                    </div>

                    {/* Array Index underneath */}
                    <span className="text-[10.5px] font-mono text-slate-400 mt-1 select-none">
                      [{box.index}]
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. Structured Logic Note / Context Flow */}
          {((currentStep as { actionNote?: string }).actionNote || currentStep.explanation) && (
            <div className="mt-3 text-center">
              <span
                className={`text-[11.5px] font-medium px-3 py-1 rounded-full border ${
                  darkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-300'
                    : 'bg-[#FAF8F5] border-[#E0D9CB] text-slate-700'
                }`}
              >
                {(currentStep as { actionNote?: string }).actionNote || currentStep.explanation}
              </span>
            </div>
          )}
        </div>

        {/* Deep "Why It Works & Live Memory Registers" Callout */}
        {showDeepWhy && (
          <div
            className={`rounded-xl border p-3 mb-3.5 space-y-2 transition-all ${
              darkMode
                ? 'bg-slate-950/80 border-slate-800 text-slate-200'
                : 'bg-[#FAF8F5] border-[#E0D9CB] text-[#1E293B]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div
                className={`flex items-center gap-1.5 text-xs font-bold ${
                  darkMode ? 'text-amber-400' : 'text-[#2563EB]'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Step {stepIndex + 1} — What & Why It Works (Line {currentStep.activeLine})
                </span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  darkMode
                    ? 'bg-amber-950 dark:border-amber-800 text-amber-300'
                    : 'bg-[#F2EEE5] border-[#E0D9CB] text-slate-700'
                }`}
              >
                Time: {topic.timeComplexity} · Space: {topic.spaceComplexity}
              </span>
            </div>

            <p className="text-[11.5px] font-medium leading-relaxed">
              {currentStep.explanation}
            </p>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              <strong className="text-slate-700 dark:text-slate-300">Why this step is safe: </strong>
              {topic.intuition}
            </p>

            {/* Live Inline Variable Registers */}
            {currentStep.variables && Object.keys(currentStep.variables).length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mr-1">
                  <Cpu
                    className={`w-3 h-3 ${
                      darkMode ? 'text-amber-400' : 'text-[#2563EB]'
                    }`}
                  />{' '}
                  Memory:
                </span>
                {Object.entries(currentStep.variables).map(([k, v]) => (
                  <span
                    key={k}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-mono border ${
                      darkMode
                        ? 'bg-slate-900 border-slate-700 text-slate-200'
                        : 'bg-[#F2EEE5] border-[#E0D9CB] text-slate-700 shadow-2xs'
                    }`}
                  >
                    <span className="text-slate-400">{k}=</span>
                    <strong
                      className={
                        darkMode ? 'text-amber-400' : 'text-[#2563EB]'
                      }
                    >
                      {String(v)}
                    </strong>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Execution Trace List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3
            className={`text-xs font-bold ${
              darkMode ? 'text-slate-200' : 'text-[#1E293B]'
            }`}
          >
            Execution Trace
          </h3>
          <span className="text-[10px] font-mono text-slate-400">
            Click any row or press ← / → / Space
          </span>
        </div>

        <div className="space-y-1.5 max-h-[195px] overflow-y-auto pr-0.5">
          {traceLines.map((item, idx) => {
            const isCurrent =
              stepIndex === item.stepIdx || (idx === 0 && stepIndex < traceLines[0].stepIdx);
            return (
              <div
                key={idx}
                onClick={() => onSelectStep(item.stepIdx)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-[11.5px] font-mono cursor-pointer transition-all ${
                  isCurrent
                    ? darkMode
                      ? 'bg-amber-950/50 border-amber-800 text-amber-200 font-medium'
                      : 'bg-[#EAE4D8] border-[#D0C6B5] text-[#1E293B] font-semibold'
                    : darkMode
                    ? 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:bg-slate-800/50'
                    : 'bg-[#FAF8F5] border-[#E5DFD3] text-[#475569] hover:bg-[#F2EEE5]'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? darkMode
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-[#2563EB] text-white'
                      : darkMode
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-[#E2DCD0] text-slate-600'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="truncate">{item.text}</span>
              </div>
            );
          })}

          {/* Final Green Checkmark Result Row */}
          <div
            onClick={() => onSelectStep(topic.steps.length - 1)}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-[11.5px] font-medium cursor-pointer transition-all ${
              darkMode
                ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                : 'bg-[#F0FDF4] border-[#DCFCE7] text-[#15803D]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span>{topic.traceSummary}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
