import React from 'react';
import { ArrowDown } from 'lucide-react';
import { TopicStep, VisualBox, VisualPointer } from '@/types/codeflow';

interface ArrayBoxesStageProps {
  currentStep: TopicStep;
  darkMode: boolean;
}

const POINTER_STYLES: Record<string, { arrow: string; label: string }> = {
  emerald: { arrow: 'text-[#16A34A]', label: 'text-[#16A34A]' },
  green: { arrow: 'text-[#16A34A]', label: 'text-[#16A34A]' },
  blue: {
    arrow: 'text-[#2563EB] dark:text-amber-400',
    label: 'text-[#2563EB] dark:text-amber-400'
  },
  purple: { arrow: 'text-[#9333EA]', label: 'text-[#9333EA]' },
  amber: {
    arrow: 'text-[#D97706] dark:text-amber-400',
    label: 'text-[#D97706] dark:text-amber-400'
  },
  rose: { arrow: 'text-[#E11D48]', label: 'text-[#E11D48]' }
};

/**
 * Renders the visual array boxes, animated pointer arrows above each index,
 * and the current step's action explanation note.
 */
export const ArrayBoxesStage: React.FC<ArrayBoxesStageProps> = ({
  currentStep,
  darkMode
}) => {
  const actionNote =
    (currentStep as { actionNote?: string }).actionNote || currentStep.explanation;

  return (
    <div
      className={`rounded-xl border px-4 py-5 mb-3.5 min-h-[148px] flex flex-col items-center justify-center ${
        darkMode
          ? 'bg-slate-950/60 border-slate-800/80'
          : 'bg-[#F2EEE5] border-[#E0D9CB]'
      }`}
    >
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
                      POINTER_STYLES[ptr.color || 'blue'] || POINTER_STYLES.blue;
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

      {actionNote && (
        <div className="mt-3 text-center">
          <span
            className={`text-[11.5px] font-medium px-3 py-1 rounded-full border ${
              darkMode
                ? 'bg-slate-900 border-slate-800 text-slate-300'
                : 'bg-[#FAF8F5] border-[#E0D9CB] text-slate-700'
            }`}
          >
            {actionNote}
          </span>
        </div>
      )}
    </div>
  );
};
