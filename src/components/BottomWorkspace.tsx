import React, { useState } from 'react';
import {
  ListFilter,
  GitFork,
  Search,
  ChevronRight,
  FileText,
  Play,
  Cpu,
  Clock,
  Layers,
  FolderGit2,
  FileCode
} from 'lucide-react';
import { PracticeProblem, TopicData, TopicStep } from '../types/codeflow';

interface BottomWorkspaceProps {
  problems: PracticeProblem[];
  selectedProblem: PracticeProblem;
  onSelectProblem: (prob: PracticeProblem) => void;
  onStartSolving: (prob: PracticeProblem) => void;
  currentTopic: TopicData;
  currentStep: TopicStep;
  darkMode: boolean;
}

const CODEBASE_FILES = [
  {
    path: 'src/routes/api.routes.ts',
    role: 'Entry Point & Route Registration',
    connectsTo: 'auth.middleware.ts → search.controller.ts',
    purpose:
      'Maps incoming HTTP endpoints (GET /api/search, POST /api/orders) to middleware chains and controllers.',
    snippet: `router.get('/api/search', rateLimiter, verifyJwt, searchController.findItem);`
  },
  {
    path: 'src/middleware/auth.middleware.ts',
    role: 'Security & Request Context Guard',
    connectsTo: 'search.controller.ts',
    purpose:
      'Validates Bearer JWT signatures, checks Redis rate-limit buckets, and attaches req.user before business logic executes.',
    snippet: `export function verifyJwt(req, res, next) {\n  req.user = decodeToken(req.headers.authorization);\n  next();\n}`
  },
  {
    path: 'src/controllers/search.controller.ts',
    role: 'HTTP Transport Layer',
    connectsTo: 'catalog.service.ts',
    purpose:
      'Parses query parameters, validates schema with Zod, delegates to Service layer, and formats HTTP status codes.',
    snippet: `export async function findItem(req, res) {\n  const item = await catalogService.binarySearchSku(req.query.sku);\n  return res.status(200).json({ data: item });\n}`
  },
  {
    path: 'src/services/catalog.service.ts',
    role: 'Core Business & Algorithmic Logic',
    connectsTo: 'catalog.repository.ts + Redis Cache',
    purpose:
      'Executes in-memory DSA algorithms (Binary Search, Trie Autocomplete, Graph routing) and coordinates caching.',
    snippet: `export async function binarySearchSku(targetSku: number) {\n  const sortedSkus = await catalogRepo.getCachedSkuIndex();\n  return binarySearch(sortedSkus, targetSku);\n}`
  },
  {
    path: 'src/repositories/catalog.repository.ts',
    role: 'Database & B-Tree Index Access Layer',
    connectsTo: 'PostgreSQL Primary + Read Replica',
    purpose:
      'Encapsulates parameterized SQL queries and ORM transactions so upper layers remain database-agnostic.',
    snippet: `export async function getCachedSkuIndex() {\n  return db.query('SELECT sku_id FROM products ORDER BY sku_id ASC');\n}`
  }
];

export const BottomWorkspace: React.FC<BottomWorkspaceProps> = ({
  problems,
  selectedProblem,
  onSelectProblem,
  onStartSolving,
  currentTopic,
  currentStep,
  darkMode
}) => {
  const [activeTab, setActiveTab] = useState<'problems' | 'explorer'>('problems');
  const [problemSearch, setProblemSearch] = useState('');
  const [selectedFileIdx, setSelectedFileIdx] = useState(3);

  const visibleProblems = problems.filter((p) =>
    p.title.toLowerCase().includes(problemSearch.toLowerCase())
  );

  const getBadgeStyle = (prob: PracticeProblem) => {
    if (prob.number === 2) {
      return 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]';
    }
    if (prob.difficulty === 'Easy') {
      return 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]';
    }
    if (prob.difficulty === 'Hard') {
      return 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]';
    }
    return 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]';
  };

  return (
    <div className="space-y-2.5">
      {/* Section Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('problems')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold border transition-all ${
            activeTab === 'problems'
              ? darkMode
                ? 'bg-slate-900 border-blue-500 text-blue-400 shadow-2xs'
                : 'bg-white border-[#CBD5E1] text-[#2563EB] shadow-2xs'
              : darkMode
              ? 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
              : 'bg-[#EEF3FA] border-transparent text-slate-600 hover:bg-white/80'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Problems</span>
        </button>

        <button
          onClick={() => setActiveTab('explorer')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold border transition-all ${
            activeTab === 'explorer'
              ? darkMode
                ? 'bg-slate-900 border-blue-500 text-blue-400 shadow-2xs'
                : 'bg-white border-[#CBD5E1] text-[#2563EB] shadow-2xs'
              : darkMode
              ? 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
              : 'bg-[#EEF3FA] border-transparent text-slate-600 hover:bg-white/80'
          }`}
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>Code/Algorithm Explorer</span>
        </button>
      </div>

      {/* TAB 1: Problems Split View (Matches Reference Image) */}
      {activeTab === 'problems' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Bottom-Left Card: List of All the Problems (5 cols) */}
          <div
            className={`lg:col-span-5 rounded-xl border p-4 flex flex-col justify-between ${
              darkMode
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.03)]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <ListFilter className="w-4 h-4 text-slate-500" />
                  <h3
                    className={`text-[13.5px] font-bold ${
                      darkMode ? 'text-slate-100' : 'text-[#1E293B]'
                    }`}
                  >
                    List of All the Problems
                  </h3>
                </div>

                {/* Search problems input */}
                <div
                  className={`flex items-center rounded-lg border px-2.5 py-1 w-40 sm:w-44 ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800'
                      : 'bg-[#F8FAFC] border-[#E2E8F0]'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                  <input
                    type="text"
                    value={problemSearch}
                    onChange={(e) => setProblemSearch(e.target.value)}
                    placeholder="Search problems..."
                    className="w-full bg-transparent text-[11.5px] focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-0.5">
                {visibleProblems.map((prob) => {
                  const isSelected = prob.id === selectedProblem.id;
                  return (
                    <button
                      key={prob.id}
                      onClick={() => onSelectProblem(prob)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? darkMode
                            ? 'bg-blue-950/60 border-blue-700 text-blue-200'
                            : 'bg-[#E8F1FF] border-[#BFDBFE] text-[#1E3A8A]'
                          : darkMode
                          ? 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                          : 'bg-[#FAFBFD] border-[#EDF2F7] text-[#1E293B] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-[#2563EB] text-white'
                              : darkMode
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-[#E2E8F0] text-[#475569]'
                          }`}
                        >
                          {prob.number}
                        </span>
                        <span className="text-xs font-semibold truncate">{prob.title}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10.5px] font-semibold border ${getBadgeStyle(
                            prob
                          )}`}
                        >
                          {prob.difficulty}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom-Right Card: Details of the Question (7 cols) */}
          <div
            className={`lg:col-span-7 rounded-xl border p-4 flex flex-col justify-between ${
              darkMode
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.03)]'
            }`}
          >
            <div className="space-y-2.5">
              {/* Header */}
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2563EB]" />
                <h3
                  className={`text-[13.5px] font-bold ${
                    darkMode ? 'text-slate-100' : 'text-[#1E293B]'
                  }`}
                >
                  Details of the Question
                </h3>
              </div>

              {/* Problem Title + Badge */}
              <div className="flex items-center gap-2.5 pt-0.5">
                <h4
                  className={`text-[15px] font-bold ${
                    darkMode ? 'text-white' : 'text-[#0F172A]'
                  }`}
                >
                  {selectedProblem.title}
                </h4>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10.5px] font-semibold border ${getBadgeStyle(
                    selectedProblem
                  )}`}
                >
                  {selectedProblem.difficulty}
                </span>
              </div>

              {/* Description */}
              <p
                className={`text-xs leading-relaxed ${
                  darkMode ? 'text-slate-300' : 'text-[#475569]'
                }`}
              >
                {selectedProblem.description}
              </p>

              {/* Example 1 */}
              <div className="space-y-1">
                <div
                  className={`text-xs font-bold ${
                    darkMode ? 'text-slate-200' : 'text-[#1E293B]'
                  }`}
                >
                  Example 1:
                </div>
                <div
                  className={`rounded-lg border px-3 py-2 font-mono text-[11.5px] space-y-0.5 ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-300'
                      : 'bg-[#F4F7FB] border-[#E5EAF2] text-[#334155]'
                  }`}
                >
                  <div>
                    <span className="font-semibold">Input:</span> {selectedProblem.example1.input}
                  </div>
                  <div>
                    <span className="font-semibold">Output:</span> {selectedProblem.example1.output}
                  </div>
                </div>
              </div>

              {/* Example 2 + Start Solving Button */}
              <div className="space-y-1">
                <div
                  className={`text-xs font-bold ${
                    darkMode ? 'text-slate-200' : 'text-[#1E293B]'
                  }`}
                >
                  Example 2:
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div
                    className={`flex-1 rounded-lg border px-3 py-2 font-mono text-[11.5px] space-y-0.5 ${
                      darkMode
                        ? 'bg-slate-950 border-slate-800 text-slate-300'
                        : 'bg-[#F4F7FB] border-[#E5EAF2] text-[#334155]'
                    }`}
                  >
                    <div>
                      <span className="font-semibold">Input:</span> {selectedProblem.example2.input}
                    </div>
                    <div>
                      <span className="font-semibold">Output:</span> {selectedProblem.example2.output}
                    </div>
                  </div>

                  <button
                    onClick={() => onStartSolving(selectedProblem)}
                    className="px-4 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Solving</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: Code/Algorithm Explorer (Memory Internals + Industry Codebase Architecture) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Card: Algorithm Internals, Complexity & Live Memory Watch */}
          <div
            className={`lg:col-span-5 rounded-xl border p-4 space-y-3.5 ${
              darkMode
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.03)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#2563EB]" />
                <h3
                  className={`text-[13.5px] font-bold ${
                    darkMode ? 'text-slate-100' : 'text-[#1E293B]'
                  }`}
                >
                  Algorithm Internals & Memory State
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200 font-semibold">
                Step {currentStep.stepNumber}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div
                className={`p-2.5 rounded-lg border ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-[#F8FAFC] border-[#E2E8F0]'
                }`}
              >
                <div className="text-[10px] font-semibold uppercase text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#2563EB]" /> Time Complexity
                </div>
                <div className="text-xs font-bold font-mono mt-1 text-[#2563EB]">
                  {currentTopic.timeComplexity}
                </div>
              </div>

              <div
                className={`p-2.5 rounded-lg border ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-[#F8FAFC] border-[#E2E8F0]'
                }`}
              >
                <div className="text-[10px] font-semibold uppercase text-slate-400 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#16A34A]" /> Space Complexity
                </div>
                <div className="text-xs font-bold font-mono mt-1 text-[#16A34A]">
                  {currentTopic.spaceComplexity}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="font-semibold text-[#1E293B] dark:text-slate-200">
                Why It Works & Under the Hood:
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentTopic.intuition} {currentTopic.internals}
              </p>
            </div>

            {currentStep.variables && (
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Live Step Variables & Registers
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 font-mono text-[11px]">
                  {Object.entries(currentStep.variables).map(([k, v]) => (
                    <div
                      key={k}
                      className={`px-2.5 py-1.5 rounded border flex items-center justify-between ${
                        darkMode
                          ? 'bg-slate-950 border-slate-800 text-slate-200'
                          : 'bg-[#F4F7FB] border-[#E5EAF2] text-slate-700'
                      }`}
                    >
                      <span className="text-slate-400">{k}:</span>
                      <span className="font-bold text-[#2563EB]">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Card: Large Codebase Explorer & Cross-File Execution Tracer */}
          <div
            className={`lg:col-span-7 rounded-xl border p-4 space-y-3 ${
              darkMode
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.03)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#2563EB]" />
                <h3
                  className={`text-[13.5px] font-bold ${
                    darkMode ? 'text-slate-100' : 'text-[#1E293B]'
                  }`}
                >
                  Production Codebase Architecture Explorer
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Click any file to trace cross-file execution
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5 space-y-1">
                {CODEBASE_FILES.map((file, idx) => (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFileIdx(idx)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg border text-xs font-mono flex items-center gap-2 transition-all ${
                      selectedFileIdx === idx
                        ? darkMode
                          ? 'bg-blue-950/60 border-blue-700 text-blue-200 font-bold'
                          : 'bg-[#E8F1FF] border-[#BFDBFE] text-[#1D4ED8] font-bold'
                        : darkMode
                        ? 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                        : 'bg-[#FAFBFD] border-[#EDF2F7] text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    <span className="truncate">{file.path}</span>
                  </button>
                ))}
              </div>

              <div className="sm:col-span-7 flex flex-col justify-between space-y-2">
                <div
                  className={`p-3 rounded-lg border space-y-1.5 ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800'
                      : 'bg-[#F8FAFC] border-[#E2E8F0]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2563EB]">
                      {CODEBASE_FILES[selectedFileIdx].role}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      → {CODEBASE_FILES[selectedFileIdx].connectsTo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {CODEBASE_FILES[selectedFileIdx].purpose}
                  </p>
                </div>

                <pre className="p-3 rounded-lg bg-[#0F172A] text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800">
                  {CODEBASE_FILES[selectedFileIdx].snippet}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
