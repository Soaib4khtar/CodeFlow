import React, { useState } from 'react';
import { Database, Play, Zap, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

interface QueryScenario {
  id: string;
  label: string;
  sql: string;
  withIndex: boolean;
  cacheHit: boolean;
  executionPlan: string;
  pagesRead: number;
  latencyMs: number;
  rows: Record<string, string | number>[];
  explanation: string;
}

const SCENARIOS: QueryScenario[] = [
  {
    id: 'seq-scan',
    label: '1. Unindexed Query (Full Table Scan O(N))',
    sql: "SELECT id, email, plan FROM users WHERE email = 'soaib@codeatlas.dev'; -- No Index!",
    withIndex: false,
    cacheHit: false,
    executionPlan: 'Seq Scan on users (cost=0.00..18420.00 rows=1000000) (actual time=412.6ms)',
    pagesRead: 8420,
    latencyMs: 412.6,
    rows: [{ id: 'usr_9042', email: 'soaib@codeatlas.dev', plan: 'Enterprise' }],
    explanation: 'Without an index on `email`, PostgreSQL must read every 8KB heap page off disk (8,420 pages / 1,000,000 rows) to check if `email` matches.'
  },
  {
    id: 'btree-index',
    label: '2. B-Tree Indexed Query (O(log N) Tree Traversal)',
    sql: "CREATE INDEX idx_users_email ON users(email);\nSELECT id, email, plan FROM users WHERE email = 'soaib@codeatlas.dev';",
    withIndex: true,
    cacheHit: false,
    executionPlan: 'Index Scan using idx_users_email on users (cost=0.42..8.44 rows=1) (actual time=2.4ms)',
    pagesRead: 4,
    latencyMs: 2.4,
    rows: [{ id: 'usr_9042', email: 'soaib@codeatlas.dev', plan: 'Enterprise' }],
    explanation: 'With `idx_users_email`, PostgreSQL traverses a 3-level balanced B+ Tree (Root -> Internal -> Leaf -> Heap Tuple), reading only 4 pages (170x faster!).'
  },
  {
    id: 'redis-hit',
    label: '3. Redis Cache-Aside HIT (O(1) RAM Hash Table)',
    sql: 'GET user:email:soaib@codeatlas.dev  -- Served from Redis RAM before hitting SQL',
    withIndex: true,
    cacheHit: true,
    executionPlan: 'Redis In-Memory Hash Bucket Lookup O(1) (TTL remaining: 284s)',
    pagesRead: 0,
    latencyMs: 0.4,
    rows: [{ id: 'usr_9042', email: 'soaib@codeatlas.dev', plan: 'Enterprise', source: 'Redis RAM' }],
    explanation: 'By caching the serialized row in Redis with a key hash, the API responds in 0.4ms with zero disk page reads on PostgreSQL.'
  }
];

export const SqlApiPlaygroundModal: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(SCENARIOS[1].id);
  const current = SCENARIOS.find((s) => s.id === selectedId) || SCENARIOS[0];

  return (
    <div className="bg-slate-900/70 border border-indigo-500/30 rounded-2xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            Interactive SQL B-Tree Index & Redis Cache-Aside Benchmark Lab
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare O(N) Sequential Disk Scans vs. O(log N) B-Tree Indexes vs. O(1) Redis RAM Lookups on 1,000,000 rows.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {current.latencyMs} ms
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-indigo-500/15 border border-indigo-500/40 text-indigo-300">
            Disk Pages Read: {current.pagesRead}
          </span>
        </div>
      </div>

      {/* Scenario Selector Pills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => setSelectedId(sc.id)}
            className={`p-3 rounded-xl border text-left transition-all ${
              sc.id === selectedId
                ? 'border-indigo-400 bg-indigo-950/50 text-white shadow'
                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-xs font-bold flex items-center justify-between">
              <span>{sc.label}</span>
              <Play className="w-3 h-3 text-indigo-400 shrink-0" />
            </div>
            <div className="text-[11px] font-mono mt-1.5 text-emerald-300">
              Latency: {sc.latencyMs}ms • {sc.pagesRead} pages
            </div>
          </button>
        ))}
      </div>

      {/* Query & Execution Plan Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-400">Executed Query / Command</div>
          <pre className="text-indigo-200 whitespace-pre-wrap">{current.sql}</pre>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300">
            EXPLAIN ANALYZE: {current.executionPlan}
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-start gap-2.5">
            {current.withIndex ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <p className="text-xs text-slate-300 leading-relaxed">{current.explanation}</p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Returned Tuple:</span>
            <span className="text-emerald-300">{JSON.stringify(current.rows[0])}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
