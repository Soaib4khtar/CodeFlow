import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExecutionStep,
  ArrayCell,
  PointerMarker,
  LinkedNodeVisual,
  TreeNodeVisual,
  GraphNodeVisual,
  GraphEdgeVisual,
  HashBucketVisual,
  BackendFlowNode,
  MatrixCell
} from '../../types/visualizer';
import { ArrowRight, Database, Server, ShieldCheck, Globe, Cpu, Layers, Sparkles } from 'lucide-react';

interface VisualizerStageProps {
  step: ExecutionStep;
}

const cellColorMap: Record<NonNullable<ArrayCell['state']>, string> = {
  default: 'bg-slate-900/90 border-slate-700 text-slate-200',
  active: 'bg-indigo-600/30 border-indigo-400 text-indigo-100 shadow-[0_0_20px_rgba(99,102,241,0.35)] ring-2 ring-indigo-500/40',
  comparing: 'bg-amber-500/25 border-amber-400 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
  swapped: 'bg-purple-600/30 border-purple-400 text-purple-100',
  sorted: 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200',
  window: 'bg-cyan-500/20 border-cyan-400 text-cyan-100',
  found: 'bg-emerald-500/35 border-emerald-400 text-emerald-50 shadow-[0_0_22px_rgba(16,185,129,0.45)] ring-2 ring-emerald-400/50',
  discarded: 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-50',
  pivot: 'bg-rose-500/30 border-rose-400 text-rose-100 shadow-[0_0_18px_rgba(244,63,94,0.35)]',
  visited: 'bg-slate-800/80 border-indigo-500/40 text-indigo-200'
};

const pointerBadgeColors: Record<PointerMarker['color'], string> = {
  indigo: 'bg-indigo-500 text-white border-indigo-300',
  emerald: 'bg-emerald-500 text-slate-950 font-bold border-emerald-300',
  amber: 'bg-amber-500 text-slate-950 font-bold border-amber-300',
  rose: 'bg-rose-500 text-white border-rose-300',
  cyan: 'bg-cyan-500 text-slate-950 font-bold border-cyan-300',
  purple: 'bg-purple-500 text-white border-purple-300'
};

export const VisualizerStage: React.FC<VisualizerStageProps> = ({ step }) => {
  return (
    <div className="space-y-6">
      {/* 1. Primary Array / Contiguous Memory Strip */}
      {step.array && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Active Data Structure / Array State
            </span>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-400" /> Active</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Compare/Wait</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Match/Locked</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 py-3">
            {step.array.map((cell) => {
              const pointersHere = (step.pointers || []).filter((p) => p.index === cell.index);
              const style = cellColorMap[cell.state || 'default'];
              return (
                <motion.div
                  key={cell.index}
                  layout
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                  className="flex flex-col items-center"
                >
                  {/* Top Memory Address or Index */}
                  <div className="text-[10px] font-mono text-slate-500 mb-1">
                    {cell.memoryAddr ? `${cell.memoryAddr} [${cell.index}]` : `idx ${cell.index}`}
                  </div>

                  {/* Cell Box */}
                  <div
                    className={`min-w-[68px] px-3 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${style}`}
                  >
                    <span className="text-lg font-bold font-mono tracking-tight">{cell.value}</span>
                    {cell.subLabel && (
                      <span className="text-[10px] font-mono opacity-80 mt-0.5 whitespace-nowrap">
                        {cell.subLabel}
                      </span>
                    )}
                  </div>

                  {/* Pointer Markers Below Cell */}
                  <div className="min-h-[28px] mt-1.5 flex flex-wrap gap-1 justify-center">
                    <AnimatePresence>
                      {pointersHere.map((ptr) => (
                        <motion.span
                          key={ptr.name}
                          initial={{ y: 6, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -6, opacity: 0 }}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shadow-sm ${pointerBadgeColors[ptr.color]}`}
                        >
                          ↑ {ptr.name}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Auxiliary Array / Stack / Prefix Sum Strip */}
      {step.auxiliaryArray && (
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-indigo-300 mb-3">
            {step.auxiliaryArray.label}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {step.auxiliaryArray.cells.map((cell) => (
              <motion.div
                key={cell.index}
                layout
                className={`px-3.5 py-2.5 rounded-lg border font-mono text-sm flex flex-col items-center ${cellColorMap[cell.state || 'default']}`}
              >
                <span className="font-semibold">{cell.value}</span>
                {cell.subLabel && <span className="text-[10px] opacity-75 mt-0.5">{cell.subLabel}</span>}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Linked List Pointer Visualizer */}
      {step.linkedList && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">
            Non-Contiguous Heap Nodes & Next Pointers
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 py-2">
            {step.linkedList.map((node: LinkedNodeVisual, idx: number) => {
              const stateColors: Record<NonNullable<LinkedNodeVisual['state']>, string> = {
                default: 'border-slate-700 bg-slate-900/90',
                active: 'border-indigo-400 bg-indigo-950/60 shadow-[0_0_20px_rgba(99,102,241,0.3)]',
                visited: 'border-slate-600 bg-slate-900/60',
                modified: 'border-amber-400 bg-amber-950/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
                new: 'border-emerald-400 bg-emerald-950/50 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
              };
              return (
                <React.Fragment key={node.id}>
                  <motion.div
                    layout
                    className={`rounded-xl border-2 p-3 min-w-[145px] transition-all ${stateColors[node.state || 'default']}`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-1 mb-2">
                      <span>Heap {node.addr}</span>
                      {node.pointerLabel && (
                        <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold">
                          {node.pointerLabel}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-center font-mono">
                      <div className="bg-slate-950/80 rounded p-1.5 border border-slate-800">
                        <div className="text-[9px] text-slate-500">val</div>
                        <div className="text-base font-bold text-slate-100">{node.val}</div>
                      </div>
                      <div className="bg-slate-950/80 rounded p-1.5 border border-slate-800">
                        <div className="text-[9px] text-slate-500">next*</div>
                        <div className="text-xs font-semibold text-emerald-300 truncate">
                          {node.nextAddr ?? 'null'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  {idx < step.linkedList!.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Hash Table Buckets & Collision Chains */}
      {step.hashBuckets && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">
            Hash Table Bucket Array & Separate Chaining Lists
          </div>
          <div className="space-y-2.5">
            {step.hashBuckets.map((bucket: HashBucketVisual) => (
              <div
                key={bucket.bucketIndex}
                className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-950/70 border border-slate-800/80 rounded-lg p-3"
              >
                <div className="w-28 shrink-0 font-mono text-xs font-semibold text-indigo-300 bg-indigo-950/40 border border-indigo-500/30 rounded px-2.5 py-2 text-center">
                  Bucket [{bucket.bucketIndex}]
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block shrink-0" />
                <div className="flex flex-wrap items-center gap-2.5">
                  {bucket.entries.length === 0 ? (
                    <span className="text-xs font-mono text-slate-600 italic">null (empty bucket)</span>
                  ) : (
                    bucket.entries.map((entry, idx) => {
                      const entryStyle =
                        entry.state === 'collision'
                          ? 'border-amber-400 bg-amber-950/40 text-amber-100'
                          : entry.state === 'found'
                          ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100 ring-2 ring-emerald-500/40'
                          : entry.state === 'active'
                          ? 'border-indigo-400 bg-indigo-950/50 text-indigo-100'
                          : 'border-slate-700 bg-slate-900 text-slate-200';
                      return (
                        <React.Fragment key={entry.key}>
                          <motion.div
                            layout
                            className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-2 ${entryStyle}`}
                          >
                            <span className="font-bold">"{entry.key}"</span>
                            <span className="text-slate-400">:</span>
                            <span className="text-emerald-300 font-bold">{entry.value}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/70 text-slate-400">
                              {entry.hash}
                            </span>
                          </motion.div>
                          {idx < bucket.entries.length - 1 && (
                            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Tree / BST / Heap / Trie Visualizer (SVG + Animated Nodes) */}
      {step.tree && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            Hierarchical Tree / Heap / Prefix Trie Structure
          </div>
          <div className="relative w-full h-[290px] bg-slate-950/50 rounded-xl border border-slate-800/60 overflow-hidden">
            <svg className="w-full h-full">
              {step.tree.map((node: TreeNodeVisual) => {
                const targets = [node.leftId, node.rightId, ...(node.childrenIds || [])].filter(Boolean) as string[];
                return targets.map((targetId) => {
                  const child = step.tree!.find((n) => n.id === targetId);
                  if (!child) return null;
                  const isHighlighted =
                    (node.state === 'active' || node.state === 'path' || node.state === 'visited' || node.state === 'modified') &&
                    (child.state === 'active' || child.state === 'path' || child.state === 'found' || child.state === 'modified');
                  return (
                    <line
                      key={`${node.id}-${child.id}`}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${child.x}%`}
                      y2={`${child.y}%`}
                      stroke={isHighlighted ? '#818cf8' : '#334155'}
                      strokeWidth={isHighlighted ? 3 : 2}
                      strokeDasharray={child.state === 'found' ? '0' : undefined}
                    />
                  );
                });
              })}
            </svg>

            {step.tree.map((node: TreeNodeVisual) => {
              const nodeStyles: Record<NonNullable<TreeNodeVisual['state']>, string> = {
                default: 'bg-slate-900 border-slate-600 text-slate-200',
                active: 'bg-indigo-600 border-indigo-300 text-white shadow-[0_0_20px_rgba(99,102,241,0.6)] scale-110',
                visited: 'bg-slate-800 border-indigo-500/50 text-indigo-200',
                path: 'bg-amber-500/30 border-amber-400 text-amber-100',
                found: 'bg-emerald-500 border-emerald-200 text-slate-950 font-extrabold shadow-[0_0_24px_rgba(16,185,129,0.6)] scale-110',
                modified: 'bg-purple-600/40 border-purple-300 text-purple-100'
              };
              return (
                <motion.div
                  key={node.id}
                  layout
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                >
                  <div
                    className={`px-3 py-1.5 min-w-[44px] h-11 rounded-full border-2 flex items-center justify-center font-mono text-sm font-bold transition-all ${nodeStyles[node.state || 'default']}`}
                  >
                    {node.val}
                  </div>
                  {node.badge && (
                    <span className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-950/90 border border-slate-700 text-indigo-300 whitespace-nowrap shadow">
                      {node.badge}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Graph Network Visualizer (BFS, Dijkstra, TopoSort, Union-Find MST) */}
      {step.graph && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Graph Topology & Edge Relaxation Canvas
            </span>
            {step.graph.queueOrStack && (
              <div className="flex items-center gap-2 bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-lg">
                <span className="text-[11px] font-mono text-indigo-400 font-semibold">
                  {step.graph.queueOrStack.label}:
                </span>
                <div className="flex items-center gap-1.5">
                  {step.graph.queueOrStack.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/40 text-indigo-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative w-full h-[270px] bg-slate-950/50 rounded-xl border border-slate-800/60 overflow-hidden">
            <svg className="w-full h-full">
              {step.graph.edges.map((edge: GraphEdgeVisual, idx: number) => {
                const u = step.graph!.nodes.find((n) => n.id === edge.from);
                const v = step.graph!.nodes.find((n) => n.id === edge.to);
                if (!u || !v) return null;
                const strokeColor =
                  edge.state === 'active'
                    ? '#fbbf24'
                    : edge.state === 'relaxed' || edge.state === 'mst'
                    ? '#34d399'
                    : edge.state === 'discarded'
                    ? '#475569'
                    : '#475569';
                const midX = (u.x + v.x) / 2;
                const midY = (u.y + v.y) / 2;
                return (
                  <g key={idx}>
                    <line
                      x1={`${u.x}%`}
                      y1={`${u.y}%`}
                      x2={`${v.x}%`}
                      y2={`${v.y}%`}
                      stroke={strokeColor}
                      strokeWidth={edge.state === 'active' || edge.state === 'relaxed' || edge.state === 'mst' ? 3.5 : 2}
                      strokeDasharray={edge.state === 'discarded' ? '5,5' : undefined}
                    />
                    {edge.weight !== undefined && (
                      <text
                        x={`${midX}%`}
                        y={`${midY - 3}%`}
                        textAnchor="middle"
                        className="fill-amber-300 font-mono text-[11px] font-bold"
                      >
                        w={edge.weight}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {step.graph.nodes.map((node: GraphNodeVisual) => {
              const gStyles: Record<NonNullable<GraphNodeVisual['state']>, string> = {
                default: 'bg-slate-900 border-slate-600 text-slate-200',
                current: 'bg-indigo-600 border-indigo-300 text-white shadow-[0_0_20px_rgba(99,102,241,0.6)] scale-110',
                queued: 'bg-amber-500/30 border-amber-400 text-amber-100',
                visited: 'bg-slate-800 border-indigo-400 text-indigo-200',
                'shortest-path': 'bg-emerald-500 border-emerald-200 text-slate-950 font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.5)]'
              };
              return (
                <div
                  key={node.id}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                >
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono text-sm font-bold transition-all ${gStyles[node.state || 'default']}`}
                  >
                    {node.label}
                  </div>
                  {node.distance !== undefined && (
                    <span className="mt-1 px-2 py-0.5 rounded bg-slate-950/90 border border-slate-700 text-[10px] font-mono text-emerald-300">
                      {node.distance}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. 2D Dynamic Programming Tabulation Matrix */}
      {step.matrix && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 overflow-x-auto">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
            2D Dynamic Programming State Table (dp[i][w])
          </div>
          <table className="w-full border-collapse font-mono text-xs">
            <thead>
              <tr>
                <th className="p-2 border border-slate-800 bg-slate-950 text-slate-400 text-left">Item \ Cap</th>
                {step.matrix.colHeaders.map((col, idx) => (
                  <th key={idx} className="p-2 border border-slate-800 bg-slate-950 text-indigo-300 text-center">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {step.matrix.cells.map((row: MatrixCell[], rIdx: number) => (
                <tr key={rIdx}>
                  <td className="p-2 border border-slate-800 bg-slate-950 font-semibold text-slate-300">
                    {step.matrix!.rowHeaders[rIdx]}
                  </td>
                  {row.map((cell: MatrixCell, cIdx: number) => {
                    const mStyle =
                      cell.state === 'optimal'
                        ? 'bg-emerald-500/35 border-emerald-400 text-emerald-100 font-extrabold ring-2 ring-emerald-400/50'
                        : cell.state === 'active'
                        ? 'bg-indigo-600/35 border-indigo-400 text-white font-bold'
                        : cell.state === 'lookup'
                        ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-semibold'
                        : cell.state === 'computed'
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-200'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300';
                    return (
                      <td key={cIdx} className={`p-2.5 border text-center transition-all ${mStyle}`}>
                        {cell.value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 8. Backend Request/Response & Middleware Architecture Visualizer */}
      {step.backendFlow && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              Backend Request / Middleware / Cache / Database Pipeline
            </span>
            {step.backendFlow.activePacket && (
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-indigo-500/20 border border-indigo-400/50 text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Packet: {step.backendFlow.activePacket.label}
              </span>
            )}
          </div>

          {/* Pipeline Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {step.backendFlow.nodes.map((node: BackendFlowNode, idx: number) => {
              const bStyle =
                node.state === 'active'
                  ? 'border-indigo-400 bg-indigo-950/60 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                  : node.state === 'success'
                  ? 'border-emerald-500/60 bg-emerald-950/30'
                  : node.state === 'error'
                  ? 'border-amber-500/70 bg-amber-950/30'
                  : node.state === 'bypassed'
                  ? 'border-slate-800 bg-slate-950/40 opacity-50'
                  : 'border-slate-800 bg-slate-950/70';

              const Icon =
                node.layer === 'client'
                  ? Globe
                  : node.layer === 'database' || node.layer === 'cache'
                  ? Database
                  : node.layer === 'middleware'
                  ? ShieldCheck
                  : Cpu;

              return (
                <motion.div
                  key={node.id}
                  layout
                  className={`p-3.5 rounded-xl border-2 transition-all ${bStyle}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-indigo-400" />
                      {idx + 1}. {node.layer}
                    </span>
                    {node.latencyMs !== undefined && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-emerald-300">
                        {node.latencyMs}ms
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-sm text-slate-100">{node.title}</div>
                  <div className="text-xs font-mono text-slate-400 mt-1">{node.subtitle}</div>
                </motion.div>
              );
            })}
          </div>

          {/* HTTP Inspector & SQL Query Plan Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {step.backendFlow.httpInspector && (
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-indigo-300 font-bold">
                    {step.backendFlow.httpInspector.method} {step.backendFlow.httpInspector.url}
                  </span>
                  {step.backendFlow.httpInspector.status && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      HTTP {step.backendFlow.httpInspector.status}
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-[11px] text-slate-400">
                  {Object.entries(step.backendFlow.httpInspector.headers).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-slate-500">{k}:</span> <span className="text-slate-300">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-emerald-300 overflow-x-auto">
                  {step.backendFlow.httpInspector.body}
                </div>
              </div>
            )}

            {step.backendFlow.dbQuery && (
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-amber-300 font-bold">PostgreSQL Query & Execution Plan</span>
                  <span className="text-[11px] text-slate-400">
                    Rows: {step.backendFlow.dbQuery.rowsAffected}
                  </span>
                </div>
                <div className="text-indigo-200 bg-slate-900 p-2 rounded border border-slate-800">
                  {step.backendFlow.dbQuery.sql}
                </div>
                <div className="text-[11px] text-emerald-300">
                  Plan: {step.backendFlow.dbQuery.plan}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
