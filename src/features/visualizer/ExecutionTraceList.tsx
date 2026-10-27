import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { TopicData } from '@/types/codeflow';

interface ExecutionTraceListProps {
  topic: TopicData;
  stepIndex: number;
  onSelectStep: (stepIndex: number) => void;
  darkMode: boolean;
}

/**
 * Renders the clickable step-by-step Execution Trace rows and final summary row.
 */
export const ExecutionTraceList: React.FC<ExecutionTraceListProps> = ({
  topic,
  stepIndex,
  onSelectStep,
  darkMode
}) => {
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
            stepIndex === item.stepIdx ||
            (idx === 0 && stepIndex < traceLines[0].stepIdx);
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
  );
};
