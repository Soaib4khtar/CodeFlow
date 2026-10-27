import React, { useState } from 'react';
import { Share2, Lightbulb } from 'lucide-react';
import { TopicData, TopicStep } from '@/types/codeflow';
import { ArrayBoxesStage } from './ArrayBoxesStage';
import { WhyItWorksCallout } from './WhyItWorksCallout';
import { ExecutionTraceList } from './ExecutionTraceList';

interface ExecutionVisualizerCardProps {
  topic: TopicData;
  currentStep: TopicStep;
  stepIndex: number;
  onSelectStep: (stepIndex: number) => void;
  darkMode: boolean;
}

/**
 * Right-hand workspace card displaying the live visual diagram, optional
 * "Why It Works" memory inspector, and clickable step-by-step execution trace.
 */
export const ExecutionVisualizerCard: React.FC<ExecutionVisualizerCardProps> = ({
  topic,
  currentStep,
  stepIndex,
  onSelectStep,
  darkMode
}) => {
  // Keep the Why It Works button turned off by default
  const [showDeepWhy, setShowDeepWhy] = useState<boolean>(false);

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

        {/* Visual Array / Pointer Canvas */}
        <ArrayBoxesStage currentStep={currentStep} darkMode={darkMode} />

        {/* Optional Deep "Why It Works & Live Memory Registers" Callout */}
        {showDeepWhy && (
          <WhyItWorksCallout
            topic={topic}
            currentStep={currentStep}
            stepIndex={stepIndex}
            darkMode={darkMode}
          />
        )}
      </div>

      {/* Step-by-Step Execution Trace List */}
      <ExecutionTraceList
        topic={topic}
        stepIndex={stepIndex}
        onSelectStep={onSelectStep}
        darkMode={darkMode}
      />
    </div>
  );
};
