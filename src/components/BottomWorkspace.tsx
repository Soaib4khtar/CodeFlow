import React, { useState, useEffect } from 'react';
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
  FileCode,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Bug,
  Compass,
  ArrowLeft,
  Eye
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

interface TestRunOutcome {
  label: string;
  passed: boolean;
  actual: string;
  expected: string;
}

const CODEBASE_FILES = [
  {
    path: 'src/routes/api.routes.ts',
    role: '1. Entry Point & Route Registration',
    connectsTo: 'auth.middleware.ts → search.controller.ts',
    purpose:
      'Maps incoming HTTP endpoints (GET /api/search, POST /api/orders) to middleware chains and controllers.',
    snippet: `router.get('/api/search', rateLimiter, verifyJwt, searchController.findItem);\nrouter.post('/api/orders', rateLimiter, verifyJwt, validateBody, orderController.create);`
  },
  {
    path: 'src/middleware/auth.middleware.ts',
    role: '2. Security & Request Context Guard',
    connectsTo: 'search.controller.ts',
    purpose:
      'Validates Bearer JWT signatures, checks Redis rate-limit buckets, and attaches req.user before business logic executes.',
    snippet: `export function verifyJwt(req, res, next) {\n  const token = req.headers.authorization?.split(' ')[1];\n  if (!token) return res.status(401).json({ error: 'Unauthorized' });\n  req.user = jwt.verify(token, process.env.JWT_SECRET);\n  next();\n}`
  },
  {
    path: 'src/controllers/search.controller.ts',
    role: '3. HTTP Transport Layer',
    connectsTo: 'catalog.service.ts',
    purpose:
      'Parses query parameters, validates schema with Zod, delegates to Service layer, and formats HTTP status codes.',
    snippet: `export async function findItem(req, res, next) {\n  try {\n    const item = await catalogService.binarySearchSku(Number(req.query.sku));\n    return res.status(200).json({ data: item });\n  } catch (err) { next(err); }\n}`
  },
  {
    path: 'src/services/catalog.service.ts',
    role: '4. Core Business & Algorithmic Logic',
    connectsTo: 'catalog.repository.ts + Redis Cache',
    purpose:
      'Executes in-memory DSA algorithms (Binary Search, Trie Autocomplete, Graph routing) and coordinates caching.',
    snippet: `export async function binarySearchSku(targetSku: number) {\n  const sortedSkus = await catalogRepo.getCachedSkuIndex();\n  return binarySearch(sortedSkus, targetSku);\n}`
  },
  {
    path: 'src/repositories/catalog.repository.ts',
    role: '5. Database & B-Tree Index Access Layer',
    connectsTo: 'PostgreSQL Primary + Read Replica',
    purpose:
      'Encapsulates parameterized SQL queries and ORM transactions so upper layers remain database-agnostic.',
    snippet: `export async function getCachedSkuIndex() {\n  return db.query('SELECT sku_id, price FROM products ORDER BY sku_id ASC');\n}`
  }
];

const DEV_SIMULATIONS = [
  {
    id: 'sim-n-plus-1',
    title: 'Bug Fix: Eliminate N+1 SQL Query Bottleneck',
    impact: 'Latency: 420ms → 12ms (51 queries → 2 queries)',
    fileAffected: 'src/services/order.service.ts',
    problem:
      'GET /api/orders times out under load because it loops over 50 orders and fires a separate SELECT query for each user.',
    beforeCode: `// ❌ Slow: 50 sequential DB round-trips inside loop\nfor (const order of orders) {\n  order.user = await userRepo.findById(order.userId);\n}`,
    afterCode: `// ✅ Fixed: 1 batch SQL query + O(1) Hash Map join\nconst ids = [...new Set(orders.map(o => o.userId))];\nconst users = await userRepo.findManyIn(ids);\nconst map = new Map(users.map(u => [u.id, u]));\norders.forEach(o => { o.user = map.get(o.userId); });`
  },
  {
    id: 'sim-rate-limit',
    title: 'Feature: Add Sliding Window Redis Rate Limiter',
    impact: 'Blocks brute-force spikes with HTTP 429 before hitting DB',
    fileAffected: 'src/middleware/rateLimit.middleware.ts',
    problem:
      'Login endpoint /api/auth/login is vulnerable to credential stuffing. We need a middleware that limits each IP to 10 requests/minute.',
    beforeCode: `// ❌ Unprotected route directly hits bcrypt + DB\nrouter.post('/auth/login', authController.login);`,
    afterCode: `// ✅ Protected with Redis atomic INCR + EXPIRE middleware\nexport async function rateLimiter(req, res, next) {\n  const count = await redis.incr(\`rl:\${req.ip}\`);\n  if (count === 1) await redis.expire(\`rl:\${req.ip}\`, 60);\n  if (count > 10) return res.status(429).json({ error: 'Rate limit' });\n  next();\n}`
  },
  {
    id: 'sim-refactor-service',
    title: 'Refactor: Extract Service & Transaction from Controller',
    impact: 'Enables unit testing & prevents partial order writes',
    fileAffected: 'src/controllers/checkout.controller.ts → checkout.service.ts',
    problem:
      'Controller directly mutates inventory and orders without a database transaction. If payment fails, inventory is still deducted!',
    beforeCode: `// ❌ Controller mixes HTTP and non-atomic DB writes\nawait db.query('UPDATE inventory SET qty = qty - 1');\nawait stripe.charge(req.body.token); // If this throws, stock is lost!`,
    afterCode: `// ✅ Service wraps operations in an ACID SQL Transaction\nawait db.transaction(async (tx) => {\n  await inventoryRepo.decrement(tx, itemId);\n  await paymentService.charge(token);\n  await orderRepo.create(tx, userId, itemId);\n});`
  }
];

const TECH_ROADMAP_LEVELS = [
  {
    level: 'Level 1: Frontend Foundations & UI Architecture',
    stack: ['HTML5 & Semantic DOM', 'CSS3, Flexbox/Grid & Tailwind', 'JavaScript ES6+ & Event Loop', 'TypeScript Type Safety', 'React 18 Hooks & Fiber', 'Next.js App Router & SSR'],
    summary:
      'Build accessible, responsive interfaces with component-driven architecture, predictable client/server state management (TanStack Query / Zustand), and compile-time type safety.'
  },
  {
    level: 'Level 2: Backend Engineering & API Design',
    stack: ['Node.js Runtime & Streams', 'Express / Fastify REST APIs', 'Middleware & Zod Validation', 'JWT, OAuth2 & Session Auth', 'RBAC Authorization', 'Layered Service Architecture'],
    summary:
      'Design stateless, validated HTTP APIs with structured middleware pipelines, secure authentication, proper HTTP status semantics, and clean separation of concerns.'
  },
  {
    level: 'Level 3: Databases, Indexing & Data Modeling',
    stack: ['SQL & PostgreSQL', '1:N & M:N Schema Relations', 'B-Tree & Composite Indexes', 'ACID Transactions & Locking', 'Schema Migrations', 'Prisma / Drizzle ORM'],
    summary:
      'Model normalized relational data, optimize slow queries using EXPLAIN ANALYZE and B-Tree indexes, and guarantee data integrity under concurrent writes with ACID transactions.'
  },
  {
    level: 'Level 4: Dev Tools, Docker, CI/CD & Distributed Systems',
    stack: ['Git Branching & PR Reviews', 'Vitest / Playwright Testing', 'Docker Multi-Stage Containers', 'GitHub Actions CI/CD', 'Redis Caching & Message Queues', 'Load Balancing & Observability'],
    summary:
      'Ship production software confidently with automated CI test gates, containerized deployments, Redis caching, async worker queues, and structured logging/monitoring.'
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
  const [explorerSubTab, setExplorerSubTab] = useState<'internals' | 'codebase' | 'roadmap'>('internals');
  const [problemSearch, setProblemSearch] = useState('');
  const [selectedFileIdx, setSelectedFileIdx] = useState(3);
  const [selectedSimIdx, setSelectedSimIdx] = useState(0);

  // Interactive Problem Solver Judge state
  const [solverOpen, setSolverOpen] = useState(false);
  const [userCode, setUserCode] = useState(selectedProblem.starterCode);
  const [testResults, setTestResults] = useState<TestRunOutcome[] | null>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  useEffect(() => {
    setUserCode(selectedProblem.starterCode);
    setTestResults(null);
    setRuntimeError(null);
  }, [selectedProblem]);

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

  const handleRunProblemTests = () => {
    setRuntimeError(null);
    try {
      const fnFactory = new Function(
        `${userCode}\nreturn typeof ${selectedProblem.functionName} !== 'undefined' ? ${selectedProblem.functionName} : null;`
      );
      const userFn = fnFactory();
      if (typeof userFn !== 'function') {
        setRuntimeError(
          `Function "${selectedProblem.functionName}" not found. Keep the function name as ${selectedProblem.functionName}.`
        );
        return;
      }

      const outcomes: TestRunOutcome[] = selectedProblem.testCases.map((tc) => {
        const clonedArgs = JSON.parse(JSON.stringify(tc.args));
        const res = userFn(...clonedArgs);
        const actualStr = JSON.stringify(res);
        const expectedStr = JSON.stringify(tc.expected);
        return {
          label: tc.label,
          passed: actualStr === expectedStr,
          actual: actualStr,
          expected: expectedStr
        };
      });
      setTestResults(outcomes);
    } catch (err: unknown) {
      setRuntimeError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Section Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('problems')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
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
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
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

        {/* Sub-mode pills when Explorer is active */}
        {activeTab === 'explorer' && (
          <div className="flex items-center gap-1.5">
            {[
              { id: 'internals', label: 'Memory & Complexity', icon: Cpu },
              { id: 'codebase', label: 'Large Codebase & Bug Simulator', icon: FolderGit2 },
              { id: 'roadmap', label: 'Modern Tech Roadmap', icon: Compass }
            ].map((tab) => {
              const Icon = tab.icon;
              const isAct = explorerSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setExplorerSubTab(tab.id as typeof explorerSubTab)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                    isAct
                      ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-2xs'
                      : darkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-[#E2E8F0] text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* TAB 1: Problems Split View */}
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

              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-0.5">
                {visibleProblems.map((prob) => {
                  const isSelected = prob.id === selectedProblem.id;
                  return (
                    <button
                      key={prob.id}
                      onClick={() => {
                        onSelectProblem(prob);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all cursor-pointer ${
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

          {/* Bottom-Right Card: Details of the Question OR Interactive Solver & Test Judge (7 cols) */}
          <div
            className={`lg:col-span-7 rounded-xl border p-4 flex flex-col justify-between ${
              darkMode
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.03)]'
            }`}
          >
            {!solverOpen ? (
              /* Question Details View (Exact Reference Match) */
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
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

                  <button
                    onClick={() => onStartSolving(selectedProblem)}
                    className={`text-[11px] font-semibold flex items-center gap-1 px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                      darkMode
                        ? 'border-slate-700 text-blue-300 hover:bg-slate-800'
                        : 'border-blue-200 bg-blue-50/70 text-[#2563EB] hover:bg-blue-100/70'
                    }`}
                  >
                    <Eye className="w-3 h-3" /> Load in Visualizer Above
                  </button>
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
                      <span className="font-semibold">Output:</span>{' '}
                      {selectedProblem.example1.output}
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
                        <span className="font-semibold">Input:</span>{' '}
                        {selectedProblem.example2.input}
                      </div>
                      <div>
                        <span className="font-semibold">Output:</span>{' '}
                        {selectedProblem.example2.output}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSolverOpen(true);
                        handleRunProblemTests();
                      }}
                      className="px-4 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Solving</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Interactive Problem Judge & Code Test Runner */
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSolverOpen(false)}
                      className={`p-1 rounded-md border ${
                        darkMode
                          ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                      title="Back to Question Details"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <h4 className="text-xs sm:text-sm font-bold">
                      Solving: #{selectedProblem.number}. {selectedProblem.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setUserCode(selectedProblem.starterCode)}
                      className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-[11px] font-medium flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                    <button
                      onClick={() => onStartSolving(selectedProblem)}
                      className="px-2.5 py-1 rounded-md border border-blue-200 bg-blue-50 text-[#2563EB] text-[11px] font-semibold cursor-pointer"
                    >
                      Visualize Above
                    </button>
                    <button
                      onClick={handleRunProblemTests}
                      className="px-3 py-1 rounded-md bg-[#16A34A] hover:bg-[#15803D] text-white text-[11px] font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" /> Run Test Cases
                    </button>
                  </div>
                </div>

                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  spellCheck={false}
                  className="w-full h-36 rounded-lg bg-[#0F172A] text-slate-100 font-mono text-xs p-3 border border-slate-800 focus:outline-none focus:border-blue-500"
                />

                {runtimeError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
                    Runtime Error: {runtimeError}
                  </div>
                )}

                {testResults && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-500">
                      Test Case Results ({testResults.filter((r) => r.passed).length}/
                      {testResults.length} Passed):
                    </div>
                    {testResults.map((tr, i) => (
                      <div
                        key={i}
                        className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono flex flex-wrap items-center justify-between gap-2 ${
                          tr.passed
                            ? darkMode
                              ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
                              : 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]'
                            : darkMode
                            ? 'bg-rose-950/30 border-rose-800 text-rose-300'
                            : 'bg-rose-50 border-rose-200 text-rose-700'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 font-semibold">
                          {tr.passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          )}
                          {tr.label}
                        </span>
                        <span>
                          Output: <strong>{tr.actual}</strong> (Expected: {tr.expected})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TAB 2: Code/Algorithm Explorer (3 Rich Sub-Views) */
        <>
          {explorerSubTab === 'internals' && (
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

              {/* Right Card: Production Codebase Architecture Explorer */}
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
                        className={`w-full text-left px-2.5 py-2 rounded-lg border text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
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
                      <div className="flex flex-wrap items-center justify-between gap-1">
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

          {explorerSubTab === 'codebase' && (
            /* Sub-View 2: Real-World Bug Fixing, Feature Implementation & Refactoring Simulator */
            <div
              className={`rounded-xl border p-4 space-y-4 ${
                darkMode
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-white border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.03)]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Bug className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="text-[13.5px] font-bold">
                    Real-World Engineering Task Simulator (Bug Fixing, Features & Refactoring)
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  {DEV_SIMULATIONS.map((sim, idx) => (
                    <button
                      key={sim.id}
                      onClick={() => setSelectedSimIdx(idx)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
                        selectedSimIdx === idx
                          ? 'bg-[#E8F1FF] border-[#3B82F6] text-[#1D4ED8]'
                          : darkMode
                          ? 'border-slate-800 text-slate-400'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Task #{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-4 space-y-2">
                  <div className="text-xs font-bold text-[#2563EB]">
                    {DEV_SIMULATIONS[selectedSimIdx].title}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    File: {DEV_SIMULATIONS[selectedSimIdx].fileAffected}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {DEV_SIMULATIONS[selectedSimIdx].problem}
                  </p>
                  <div className="p-2.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-xs font-semibold">
                    ✓ Impact: {DEV_SIMULATIONS[selectedSimIdx].impact}
                  </div>
                </div>

                <div className="lg:col-span-4">
                  <div className="text-[11px] font-bold text-rose-600 mb-1">
                    Before (Anti-Pattern / Bug):
                  </div>
                  <pre className="p-3 rounded-lg bg-[#0F172A] text-rose-200 font-mono text-[11px] overflow-x-auto border border-rose-900/50 h-[125px]">
                    {DEV_SIMULATIONS[selectedSimIdx].beforeCode}
                  </pre>
                </div>

                <div className="lg:col-span-4">
                  <div className="text-[11px] font-bold text-[#16A34A] mb-1">
                    After (Production Fix):
                  </div>
                  <pre className="p-3 rounded-lg bg-[#0F172A] text-emerald-200 font-mono text-[11px] overflow-x-auto border border-emerald-900/50 h-[125px]">
                    {DEV_SIMULATIONS[selectedSimIdx].afterCode}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {explorerSubTab === 'roadmap' && (
            /* Sub-View 3: Structured Modern Web Technologies Learning Path */
            <div
              className={`rounded-xl border p-4 space-y-3 ${
                darkMode
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-white border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.03)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-[13.5px] font-bold">
                  Structured Production Web & Backend Technology Roadmap (Beginner → Distributed Systems)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {TECH_ROADMAP_LEVELS.map((lvl, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2.5 ${
                      darkMode
                        ? 'bg-slate-950/60 border-slate-800'
                        : 'bg-[#FAFBFD] border-[#E2E8F0]'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-[#2563EB]">{lvl.level}</div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {lvl.summary}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {lvl.stack.map((tech) => (
                        <span
                          key={tech}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            darkMode
                              ? 'bg-slate-900 border-slate-700 text-slate-300'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
