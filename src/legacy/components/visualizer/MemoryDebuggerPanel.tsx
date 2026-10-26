import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExecutionStep } from '../../types/visualizer';
import { Cpu, HardDrive, Eye, Terminal } from 'lucide-react';

interface MemoryDebuggerPanelProps {
  step: ExecutionStep;
}

export const MemoryDebuggerPanel: React.FC<MemoryDebuggerPanelProps> = ({ step }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Call Stack Frames (LIFO) */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-300 flex items-center gap-1.5 font-semibold">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            Call Stack (LIFO Frames)
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Depth: {step.callStack.length}
          </span>
        </div>

        <div className="space-y-2 flex-1">
          <AnimatePresence>
            {step.callStack.map((frame, idx) => {
              const isTop = idx === 0;
              const statusStyle =
                frame.status === 'returning'
                  ? 'border-emerald-400/70 bg-emerald-950/30'
                  : isTop
                  ? 'border-indigo-400 bg-indigo-950/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                  : 'border-slate-800 bg-slate-950/60 opacity-75';

              return (
                <motion.div
                  key={`${frame.funcName}-${idx}`}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  className={`rounded-lg border p-2.5 font-mono text-xs ${statusStyle}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100">
                      {frame.funcName}({frame.args})
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-indigo-300">
                      {frame.status === 'returning' ? 'RETURN' : isTop ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </div>
                  {Object.keys(frame.locals).length > 0 && (
                    <div className="mt-2 pt-1.5 border-t border-slate-800/80 grid grid-cols-2 gap-1 text-[11px]">
                      {Object.entries(frame.locals).map(([k, v]) => (
                        <div key={k} className="truncate">
                          <span className="text-slate-500">{k}:</span>{' '}
                          <span className="text-amber-300 font-semibold">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. Heap Memory Allocations */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 flex items-center gap-1.5 font-semibold">
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            Heap Memory & Pointers
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Blocks: {step.heap.length}
          </span>
        </div>

        <div className="space-y-2 flex-1">
          {step.heap.map((block) => (
            <motion.div
              key={block.address}
              layout
              className={`rounded-lg border p-2.5 font-mono text-xs transition-all ${
                block.highlight
                  ? 'border-emerald-400/80 bg-emerald-950/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'border-slate-800 bg-slate-950/60'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  {block.address}
                </span>
                <span className="text-slate-400">{block.type}</span>
                {block.refCount !== undefined && (
                  <span className="text-[10px] text-indigo-300">refs: {block.refCount}</span>
                )}
              </div>
              <div className="text-slate-300 text-[11px] break-all">
                <span className="text-slate-500">{block.label} = </span>
                <span className="text-emerald-200 font-semibold">{block.value}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. Live Variable Watch & Console Output */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-300 flex items-center gap-1.5 font-semibold">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              Variable Watch Table
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {Object.entries(step.variables).map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between px-2.5 py-1.5 rounded bg-slate-950/70 border border-slate-800/80"
              >
                <span className="text-slate-400">{k}</span>
                <span className="text-amber-300 font-bold truncate max-w-[170px]">
                  {String(v)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {step.consoleOutput && step.consoleOutput.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-800">
            <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1 mb-1">
              <Terminal className="w-3 h-3 text-indigo-400" /> Trace Log
            </div>
            {step.consoleOutput.map((line, i) => (
              <div key={i} className="text-[11px] font-mono text-indigo-200 bg-slate-950 px-2 py-1 rounded">
                &gt; {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
