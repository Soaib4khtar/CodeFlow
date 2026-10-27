import React from 'react';
import { Lightbulb, Cpu } from 'lucide-react';
import { TopicData, TopicStep } from '@/types/codeflow';

interface WhyItWorksCalloutProps {
  topic: TopicData;
  currentStep: TopicStep;
  stepIndex: number;
  darkMode: boolean;
}

/**
 * Collapsible "What & Why It Works" explanation panel with live variable memory registers.
 */
export const WhyItWorksCallout: React.FC<WhyItWorksCalloutProps> = ({
  topic,
  currentStep,
  stepIndex,
  darkMode
}) => {
  return (
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
        <strong className="text-slate-700 dark:text-slate-300">
          Why this step is safe:{' '}
        </strong>
        {topic.intuition}
      </p>

      {/* Live Inline Variable Registers */}
      {currentStep.variables && Object.keys(currentStep.variables).length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mr-1">
            <Cpu
              className={`w-3 h-3 ${darkMode ? 'text-amber-400' : 'text-[#2563EB]'}`}
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
              <strong className={darkMode ? 'text-amber-400' : 'text-[#2563EB]'}>
                {String(v)}
              </strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
