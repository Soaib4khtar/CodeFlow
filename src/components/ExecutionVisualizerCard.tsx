import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, CheckCircle2, ArrowRight, Lightbulb, Cpu } from 'lucide-react';
import { TopicData, TopicStep, VisualPointer } from '../types/codeflow';

interface ExecutionVisualizerCardProps {
  topic: TopicData;
  currentStep: TopicStep;
  stepIndex: number;
  onSelectStep: (idx: number) => void;
  darkMode: boolean;
}

const pointerStyles: Record<
  VisualPointer['color'],
  { arrow: string; label: string; badge: string }
> = {
  green: {
    arrow: 'text-[#16A34A]',
    label: 'text-[#16A34A]',
    badge: 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]'
  },
  blue: {
    arrow: 'text-[#2563EB]',
    label: 'text-[#2563EB]',
    badge: 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]'
  },
  purple: {
    arrow: 'text-[#9333EA]',
    label: 'text-[#9333EA]',
    badge: 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]'
  },
  amber: {
    arrow: 'text-[#D97706]',
    label: 'text-[#D97706]',
    badge: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
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
  const [showDeepWhy, setShowDeepWhy] = useState<boolean>(true);

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
          : 'bg-white border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.03)]'
      }`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#2563EB]" />
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
                    ? 'bg-blue-950/70 border-blue-700 text-blue-300'
                    : 'bg-[#EBF2FF] border-[#BFDBFE] text-[#2563EB]'
                  : darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
              title="Toggle Deep 'Why It Works' Step Inspector"
            >
              <Lightbulb className="w-3 h-3" />
              <span>Why It Works</span>
            </button>

            <span
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                darkMode
                  ? 'bg-blue-950/70 border-blue-800 text-blue-300'
                  : 'bg-[#EBF2FF] border-[#D0E1FD] text-[#2563EB]'
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
              : 'bg-[#FAFBFD] border-[#EDF2F7]'
          }`}
        >
          {/* 1. Array / Linear Box + Colored Pointer Arrows View */}
          {currentStep.boxes && (
            <div className="flex flex-wrap items-start justify-center gap-2.5 sm:gap-3.5">
              {currentStep.boxes.map((box) => {
                const pointersHere = (currentStep.pointers || []).filter(
                  (p) => p.index === box.index
                );

                let boxClass = darkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-200'
                  : 'bg-[#F8FAFC] border-[#DCE4F0] text-[#1E293B]';

                if (box.state === 'active') {
                  boxClass = darkMode
                    ? 'bg-blue-950/80 border-2 border-blue-400 text-blue-200 font-bold shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                    : 'bg-[#E8F1FF] border-2 border-[#3B82F6] text-[#1E40AF] font-bold shadow-[0_2px_8px_rgba(59,130,246,0.18)]';
                } else if (box.state === 'found') {
                  boxClass = darkMode
                    ? 'bg-emerald-950/80 border-2 border-emerald-400 text-emerald-200 font-bold'
                    : 'bg-[#ECFDF5] border-2 border-[#10B981] text-[#065F46] font-bold shadow-[0_2px_8px_rgba(16,185,129,0.16)]';
                } else if (box.state === 'window') {
                  boxClass = darkMode
                    ? 'bg-indigo-950/60 border-indigo-400 text-indigo-200'
                    : 'bg-[#F0F7FF] border-[#93C5FD] text-[#1E3A8A]';
                } else if (box.state === 'discarded') {
                  boxClass = darkMode
                    ? 'bg-slate-900/40 border-slate-800 text-slate-600'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-400 opacity-65';
                }

                return (
                  <div key={box.index} className="flex flex-col items-center">
                    <motion.div
                      layout
                      initial={{ scale: 0.95, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`min-w-[58px] sm:min-w-[68px] px-3 h-11 rounded-lg border flex flex-col items-center justify-center text-sm transition-all ${boxClass}`}
                    >
                      <span>{box.value}</span>
                      {box.subText && (
                        <span className="text-[9px] font-mono opacity-75 leading-none mt-0.5">
                          {box.subText}
                        </span>
                      )}
                    </motion.div>

                    {/* Pointer Arrows Below Box */}
                    <div className="min-h-[54px] mt-1 flex flex-col items-center justify-start">
                      {pointersHere.map((ptr) => {
                        const st = pointerStyles[ptr.color];
                        return (
                          <motion.div
                            key={ptr.label}
                            initial={{ y: 4, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex flex-col items-center leading-tight"
                          >
                            <span className={`text-sm font-bold leading-none ${st.arrow}`}>
                              ↑
                            </span>
                            <span className={`text-[11px] font-semibold mt-0.5 ${st.label}`}>
                              {ptr.label}
                            </span>
                            <span
                              className={`mt-1 px-2 py-[1px] rounded-full text-[10px] font-bold border ${st.badge}`}
                            >
                              {ptr.index}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. Hierarchical Tree / BST / Trie / Segment Tree View */}
          {currentStep.treeNodes && (
            <div className="relative w-full h-[165px]">
              <svg className="w-full h-full">
                {currentStep.treeNodes.map((node) => {
                  const children = [node.leftId, node.rightId].filter(Boolean) as string[];
                  return children.map((cid) => {
                    const target = currentStep.treeNodes!.find((n) => n.id === cid);
                    if (!target) return null;
                    return (
                      <line
                        key={`${node.id}-${cid}`}
                        x1={`${node.x}%`}
                        y1={`${node.y}%`}
                        x2={`${target.x}%`}
                        y2={`${target.y}%`}
                        stroke={
                          target.state === 'active' || target.state === 'found'
                            ? '#3B82F6'
                            : '#CBD5E1'
                        }
                        strokeWidth={2}
                      />
                    );
                  });
                })}
              </svg>
              {currentStep.treeNodes.map((node) => {
                const isAct = node.state === 'active';
                const isFnd = node.state === 'found';
                return (
                  <div
                    key={node.id}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  >
                    <div
                      className={`px-2.5 min-w-[36px] h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold shadow-2xs ${
                        isFnd
                          ? 'bg-[#DCFCE7] border-[#16A34A] text-[#15803D]'
                          : isAct
                          ? 'bg-[#DBEAFE] border-[#2563EB] text-[#1D4ED8]'
                          : darkMode
                          ? 'bg-slate-800 border-slate-600 text-slate-200'
                          : 'bg-white border-slate-300 text-slate-700'
                      }`}
                    >
                      {node.label}
                    </div>
                    {node.note && (
                      <span className="mt-0.5 px-1.5 py-[1px] rounded bg-blue-50 text-[#2563EB] border border-blue-200 text-[9px] font-semibold whitespace-nowrap">
                        {node.note}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. Graph Network View */}
          {currentStep.graph && (
            <div className="relative w-full h-[160px]">
              <svg className="w-full h-full">
                {currentStep.graph.edges.map((e, idx) => {
                  const u = currentStep.graph!.nodes.find((n) => n.id === e.from);
                  const v = currentStep.graph!.nodes.find((n) => n.id === e.to);
                  if (!u || !v) return null;
                  return (
                    <g key={idx}>
                      <line
                        x1={`${u.x}%`}
                        y1={`${u.y}%`}
                        x2={`${v.x}%`}
                        y2={`${v.y}%`}
                        stroke={
                          e.state === 'path'
                            ? '#16A34A'
                            : e.state === 'active'
                            ? '#2563EB'
                            : '#CBD5E1'
                        }
                        strokeWidth={e.state === 'path' || e.state === 'active' ? 2.5 : 1.8}
                      />
                      {e.weight !== undefined && (
                        <text
                          x={`${(u.x + v.x) / 2}%`}
                          y={`${(u.y + v.y) / 2 - 4}%`}
                          textAnchor="middle"
                          className="fill-[#2563EB] text-[10px] font-bold"
                        >
                          w={e.weight}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
              {currentStep.graph.nodes.map((n) => (
                <div
                  key={n.id}
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                >
                  <div
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                      n.state === 'found'
                        ? 'bg-[#DCFCE7] border-[#16A34A] text-[#15803D]'
                        : n.state === 'active'
                        ? 'bg-[#DBEAFE] border-[#2563EB] text-[#1D4ED8]'
                        : darkMode
                        ? 'bg-slate-800 border-slate-600 text-slate-200'
                        : 'bg-white border-slate-300 text-slate-700'
                    }`}
                  >
                    {n.label}
                  </div>
                  {n.badge && (
                    <span className="mt-0.5 px-1.5 py-[1px] rounded bg-slate-100 text-slate-700 text-[9px] font-mono border border-slate-200">
                      {n.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 4. Backend / System Design / Web Dev Architecture Flow */}
          {currentStep.architecture && (
            <div className="w-full space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currentStep.architecture.stages.map((st, idx) => (
                  <div
                    key={st.id}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      st.state === 'active'
                        ? 'bg-[#E8F1FF] border-[#3B82F6] text-[#1E40AF] shadow-2xs'
                        : st.state === 'done'
                        ? 'bg-[#ECFDF5] border-[#10B981]/50 text-[#065F46]'
                        : darkMode
                        ? 'bg-slate-900 border-slate-800 text-slate-400'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider opacity-75 mb-1">
                      <span>{st.tag}</span>
                      {idx < currentStep.architecture!.stages.length - 1 && (
                        <ArrowRight className="w-3 h-3" />
                      )}
                    </div>
                    <div className="text-xs font-bold truncate">{st.title}</div>
                    <div className="text-[10px] font-mono opacity-85 truncate mt-0.5">
                      {st.subtitle}
                    </div>
                  </div>
                ))}
              </div>
              {currentStep.architecture.packetLabel && (
                <div className="text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-[11px] font-mono font-semibold">
                    ⚡ {currentStep.architecture.packetLabel}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Deep "Why It Works & Live Memory Registers" Callout */}
        {showDeepWhy && (
          <div
            className={`rounded-xl border p-3 mb-3.5 space-y-2 transition-all ${
              darkMode
                ? 'bg-slate-950/80 border-slate-800 text-slate-200'
                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB]">
                <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Step {stepIndex + 1} — What & Why It Works (Line {currentStep.activeLine})
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300">
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
                  <Cpu className="w-3 h-3 text-[#2563EB]" /> Memory:
                </span>
                {Object.entries(currentStep.variables).map(([k, v]) => (
                  <span
                    key={k}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-mono border ${
                      darkMode
                        ? 'bg-slate-900 border-slate-700 text-slate-200'
                        : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
                    }`}
                  >
                    <span className="text-slate-400">{k}=</span>
                    <strong className="text-[#2563EB]">{String(v)}</strong>
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
                      ? 'bg-blue-950/50 border-blue-800 text-blue-200 font-medium'
                      : 'bg-[#EBF3FF] border-[#C6DCFD] text-[#1E3A8A] font-medium'
                    : darkMode
                    ? 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:bg-slate-800/50'
                    : 'bg-[#F8FAFC] border-[#E9EEF5] text-[#475569] hover:bg-slate-100/70'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-[#2563EB] text-white'
                      : darkMode
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-[#E2E8F0] text-[#475569]'
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
