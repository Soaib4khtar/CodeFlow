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
  Eye,
  Activity,
  Server,
  ArrowRight,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import { DifficultyBadge, PracticeProblem, TopicData, TopicStep } from '../types/codeflow';
import { END_TO_END_SCENARIOS } from '../data/quizzesAndSimulations';

interface BottomWorkspaceProps {
  problems: PracticeProblem[]; // Topic-filtered problems for currentTopic
  selectedProblem: PracticeProblem;
  onSelectProblem: (prob: PracticeProblem) => void;
  onStartSolving: (prob: PracticeProblem) => void;
  currentTopic: TopicData;
  currentStep: TopicStep;
  darkMode: boolean;
  solvedProblems: string[];
  onMarkProblemSolved: (problemId: string) => void;
  onMarkTopicCompleted: (topicId: string) => void;
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
    stack: [
      'HTML5 & Semantic DOM',
      'CSS3, Flexbox/Grid & Tailwind',
      'JavaScript ES6+ & Event Loop',
      'TypeScript Type Safety',
      'React 18 Hooks & Fiber',
      'Next.js App Router & SSR'
    ],
    summary:
      'Build accessible, responsive interfaces with component-driven architecture, predictable client/server state management (TanStack Query / Zustand), and compile-time type safety.'
  },
  {
    level: 'Level 2: Backend Engineering & API Design',
    stack: [
      'Node.js Runtime & Streams',
      'Express / Fastify REST APIs',
      'Middleware & Zod Validation',
      'JWT, OAuth2 & Session Auth',
      'RBAC Authorization',
      'Layered Service Architecture'
    ],
    summary:
      'Design stateless, validated HTTP APIs with structured middleware pipelines, secure authentication, proper HTTP status semantics, and clean separation of concerns.'
  },
  {
    level: 'Level 3: Databases, Indexing & Data Modeling',
    stack: [
      'SQL & PostgreSQL',
      '1:N & M:N Schema Relations',
      'B-Tree & Composite Indexes',
      'ACID Transactions & Locking',
      'Schema Migrations',
      'Prisma / Drizzle ORM'
    ],
    summary:
      'Model normalized relational data, optimize slow queries using EXPLAIN ANALYZE and B-Tree indexes, and guarantee data integrity under concurrent writes with ACID transactions.'
  },
  {
    level: 'Level 4: Dev Tools, Docker, CI/CD & Distributed Systems',
    stack: [
      'Git Branching & PR Reviews',
      'Vitest / Playwright Testing',
      'Docker Multi-Stage Containers',
      'GitHub Actions CI/CD',
      'Redis Caching & Message Queues',
      'Load Balancing & Observability'
    ],
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
  darkMode,
  solvedProblems,
  onMarkProblemSolved,
  onMarkTopicCompleted
}) => {
  const [activeTab, setActiveTab] = useState<'problems' | 'explorer'>('problems');
  const [explorerSubTab, setExplorerSubTab] = useState<
    'internals' | 'simulator' | 'codebase' | 'roadmap'
  >('internals');
  const [problemSearch, setProblemSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | DifficultyBadge>('All');
  const [showConceptPrimer, setShowConceptPrimer] = useState<boolean>(true);
  const [selectedFileIdx, setSelectedFileIdx] = useState(3);
  const [selectedSimIdx, setSelectedSimIdx] = useState(0);

  // End-to-End Request & Failure Simulator state
  const activeScenario = END_TO_END_SCENARIOS[0];
  const [selectedModeIdx, setSelectedModeIdx] = useState(0);
  const [selectedHopIdx, setSelectedHopIdx] = useState(3);
  const activeMode = activeScenario.modes[selectedModeIdx] || activeScenario.modes[0];
  const activeHop = activeMode.hops[selectedHopIdx] || activeMode.hops[0];

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

  useEffect(() => {
    setDifficultyFilter('All');
    setProblemSearch('');
    setSolverOpen(false);
  }, [currentTopic.id]);

  // Filter strictly to current topic's problems + search + difficulty filter
  const topicProblems = problems.filter((p) => p.topicId === currentTopic.id);
  const visibleProblems = topicProblems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(problemSearch.toLowerCase());
    const matchesDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  });

  const solvedInTopicCount = topicProblems.filter((p) =>
    solvedProblems.includes(p.id)
  ).length;

  const getBadgeStyle = (prob: PracticeProblem) => {
    if (prob.difficulty === 'Easy') {
      return 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]';
    }
    if (prob.difficulty === 'Hard') {
      return 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]';
    }
    return 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]';
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
      if (outcomes.every((o) => o.passed)) {
        onMarkProblemSolved(selectedProblem.id);
        // If all problems in this topic are solved, automatically mark the topic as Mastered!
        const nextSolvedSet = new Set([...solvedProblems, selectedProblem.id]);
        if (topicProblems.every((tp) => nextSolvedSet.has(tp.id))) {
          onMarkTopicCompleted(currentTopic.id);
        }
      }
    } catch (err: unknown) {
      setRuntimeError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="space-y-3">
      {/* Top Tab Bar: Topic Problem Set | Code/Algorithm Explorer */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] dark:border-slate-800">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('problems')}
            className={`flex items-center gap-2 pb-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'problems'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>{currentTopic.title} Problem Set</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-50 text-[#2563EB] dark:bg-blue-950 dark:text-blue-300">
              {solvedInTopicCount}/{topicProblems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-2 pb-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'explorer'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Code/Algorithm Explorer</span>
          </button>
        </div>

        {/* Right Side Controls: Toggle Guided Concept Primer OR Explorer Sub-Tabs */}
        {activeTab === 'problems' && (
          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={() => setShowConceptPrimer((prev) => !prev)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                showConceptPrimer
                  ? 'bg-[#EBF2FF] border-[#BFDBFE] text-[#2563EB] dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300'
                  : darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-400'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>{showConceptPrimer ? 'Hide Concept Guide' : 'Show Concept Guide'}</span>
            </button>
          </div>
        )}

        {activeTab === 'explorer' && (
          <div className="flex flex-wrap items-center gap-1.5 pb-2">
            <button
              onClick={() => setExplorerSubTab('internals')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                explorerSubTab === 'internals'
                  ? 'bg-[#2563EB] text-white'
                  : darkMode
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Cpu className="w-3 h-3" />
              <span>Memory & Codebase</span>
            </button>

            <button
              onClick={() => setExplorerSubTab('simulator')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                explorerSubTab === 'simulator'
                  ? 'bg-[#2563EB] text-white'
                  : darkMode
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Request & Failure Simulator</span>
            </button>

            <button
              onClick={() => setExplorerSubTab('codebase')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                explorerSubTab === 'codebase'
                  ? 'bg-[#2563EB] text-white'
                  : darkMode
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bug className="w-3 h-3" />
              <span>Bug & Refactor Tasks</span>
            </button>

            <button
              onClick={() => setExplorerSubTab('roadmap')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                explorerSubTab === 'roadmap'
                  ? 'bg-[#2563EB] text-white'
                  : darkMode
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Modern Tech Roadmap</span>
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: Topic-Specific Problem Set + Guided Onboarding Primer + Interactive Judge */}
      {activeTab === 'problems' && (
        <div className="space-y-3.5">
          {/* Guided Onboarding & Concept-First Progression Banner */}
          {showConceptPrimer && (
            <div
              className={`rounded-xl border p-3.5 transition-all ${
                darkMode
                  ? 'bg-slate-900/90 border-slate-800 text-slate-200'
                  : 'bg-white border-[#D0E1FD] shadow-[0_1px_3px_rgba(37,99,235,0.05)]'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                <div className="lg:col-span-5 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#2563EB]">
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Guided Mastery Path —{' '}
                      {currentTopic.learningOrder
                        ? `Topic #${currentTopic.learningOrder}: ${currentTopic.title}`
                        : currentTopic.title}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>1. Core Mental Model: </strong>
                    {currentTopic.intuition}
                  </p>
                </div>

                <div className="lg:col-span-4 space-y-1 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-2 lg:pt-0 lg:pl-3">
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                    2. How It Works Under the Hood:
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {currentTopic.internals}
                  </p>
                </div>

                <div className="lg:col-span-3 flex flex-col justify-between gap-2 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-2 lg:pt-0 lg:pl-3">
                  <div className="text-[11px] font-bold text-[#15803D] dark:text-emerald-400">
                    3. Recommended Starting Point:
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Start with <strong>#1 ({topicProblems[0]?.title})</strong> to build the foundation before moving to Medium & Hard variations.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Sub-Card: Topic-Filtered Problems List (Easy -> Medium -> Hard) */}
            <div
              className={`lg:col-span-5 rounded-xl border p-4 flex flex-col justify-between ${
                darkMode
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-white border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.03)]'
              }`}
            >
              <div>
                {/* Header + Search */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div>
                    <h3
                      className={`text-[13.5px] font-bold ${
                        darkMode ? 'text-slate-100' : 'text-[#1E293B]'
                      }`}
                    >
                      {currentTopic.title} Questions
                    </h3>
                    <p className="text-[10.5px] text-slate-400">
                      Ordered from Beginner Warmup → Advanced Mastery
                    </p>
                  </div>

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
                      placeholder="Filter topic questions..."
                      className="w-full text-xs bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Difficulty Progression Filter Pills */}
                <div className="flex items-center gap-1.5 mb-3">
                  {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => {
                    const count =
                      diff === 'All'
                        ? topicProblems.length
                        : topicProblems.filter((p) => p.difficulty === diff).length;
                    const active = difficultyFilter === diff;
                    return (
                      <button
                        key={diff}
                        onClick={() => setDifficultyFilter(diff)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#2563EB] border-[#2563EB] text-white'
                            : darkMode
                            ? 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                            : 'bg-[#F8FAFC] border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {diff} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Topic-Specific Problems Rows */}
                <div className="space-y-1.5">
                  {visibleProblems.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No matching questions in {currentTopic.title} for this filter.
                    </div>
                  ) : (
                    visibleProblems.map((prob) => {
                      const isSelected = prob.id === selectedProblem.id;
                      const isSolved = solvedProblems.includes(prob.id);
                      return (
                        <button
                          key={prob.id}
                          onClick={() => onSelectProblem(prob)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all cursor-pointer text-left ${
                            isSelected
                              ? darkMode
                                ? 'bg-blue-950/60 border border-blue-800/80 text-blue-200 font-semibold'
                                : 'bg-[#EBF3FF] border border-[#C6DCFD] text-[#1E3A8A] font-semibold'
                              : darkMode
                              ? 'hover:bg-slate-800/60 text-slate-300 border border-slate-800/60'
                              : 'hover:bg-slate-50 text-[#334155] border border-[#EDF2F7]'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-2 truncate">
                              <span
                                className={`font-bold ${
                                  isSelected ? 'text-[#2563EB]' : 'text-slate-400'
                                }`}
                              >
                                {prob.number}.
                              </span>
                              <span className="truncate">{prob.title}</span>
                              {isSolved && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                              )}
                            </div>

                            {/* Progression Stage Tag & Recommended Starting Point */}
                            <div className="flex items-center gap-1.5 mt-1 pl-4">
                              {prob.recommendedFirst && (
                                <span className="px-1.5 py-[1px] rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[9.5px] font-bold">
                                  ★ Recommended Start
                                </span>
                              )}
                              {prob.progressionStage && (
                                <span className="text-[10px] text-slate-400 font-medium truncate">
                                  {prob.progressionStage}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border ${getBadgeStyle(
                                prob
                              )}`}
                            >
                              {prob.difficulty}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right Sub-Card: Question Details + Logic Builder OR Interactive Live Code Judge */}
            <div
              className={`lg:col-span-7 rounded-xl border p-4 flex flex-col justify-between ${
                darkMode
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-white border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.03)]'
              }`}
            >
              {!solverOpen ? (
                /* Standard Question Details + Step-by-Step Logic Hint View */
                <>
                  <div>
                    {/* Card Title Header */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EDF2F7] dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#2563EB]" />
                        <h3
                          className={`text-[13.5px] font-bold ${
                            darkMode ? 'text-slate-100' : 'text-[#1E293B]'
                          }`}
                        >
                          Question Details & Underlying Logic
                        </h3>
                        {selectedProblem.progressionStage && (
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                            {selectedProblem.progressionStage}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onStartSolving(selectedProblem)}
                        className="text-[11px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Animate Topic Above</span>
                      </button>
                    </div>

                    {/* Problem Number + Title + Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4
                        className={`text-base font-extrabold ${
                          darkMode ? 'text-white' : 'text-[#0F172A]'
                        }`}
                      >
                        {selectedProblem.number}. {selectedProblem.title}
                      </h4>

                      <div className="flex items-center gap-2 shrink-0">
                        {solvedProblems.includes(selectedProblem.id) && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Solved
                          </span>
                        )}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getBadgeStyle(
                            selectedProblem
                          )}`}
                        >
                          {selectedProblem.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Problem Statement */}
                    <p
                      className={`text-xs leading-relaxed mb-3 ${
                        darkMode ? 'text-slate-300' : 'text-[#475569]'
                      }`}
                    >
                      {selectedProblem.description}
                    </p>

                    {/* How to Build the Underlying Logic (Intuition First!) */}
                    {selectedProblem.logicHint && (
                      <div
                        className={`rounded-lg border p-3 mb-3.5 text-xs leading-relaxed ${
                          darkMode
                            ? 'bg-blue-950/30 border-blue-800/70 text-blue-200'
                            : 'bg-[#F0F7FF] border-[#BFDBFE] text-[#1E3A8A]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-[#2563EB] dark:text-blue-300 mb-1">
                          <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                          <span>Building the Underlying Logic (Before You Code):</span>
                        </div>
                        <p className="text-[11.5px]">{selectedProblem.logicHint}</p>
                      </div>
                    )}

                    {/* Example 1 & Example 2 Boxes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                      <div>
                        <div
                          className={`text-xs font-bold mb-1 ${
                            darkMode ? 'text-slate-200' : 'text-[#1E293B]'
                          }`}
                        >
                          Example 1:
                        </div>

                        <div
                          className={`rounded-lg border px-3 py-2 font-mono text-[11.5px] space-y-1 ${
                            darkMode
                              ? 'bg-slate-950/70 border-slate-800 text-slate-200'
                              : 'bg-[#F8FAFC] border-[#E5EAF2] text-[#334155]'
                          }`}
                        >
                          <div className="truncate">
                            <span className="font-bold text-[#1E293B] dark:text-white">
                              Input:{' '}
                            </span>
                            <span>{selectedProblem.example1.input}</span>
                          </div>
                          <div>
                            <span className="font-bold text-[#1E293B] dark:text-white">
                              Output:{' '}
                            </span>
                            <span className="text-[#16A34A] font-bold">
                              {selectedProblem.example1.output}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div
                          className={`text-xs font-bold mb-1 ${
                            darkMode ? 'text-slate-200' : 'text-[#1E293B]'
                          }`}
                        >
                          Example 2:
                        </div>

                        <div
                          className={`rounded-lg border px-3 py-2 font-mono text-[11.5px] space-y-1 ${
                            darkMode
                              ? 'bg-slate-950/70 border-slate-800 text-slate-200'
                              : 'bg-[#F8FAFC] border-[#E5EAF2] text-[#334155]'
                          }`}
                        >
                          <div className="truncate">
                            <span className="font-bold text-[#1E293B] dark:text-white">
                              Input:{' '}
                            </span>
                            <span>{selectedProblem.example2.input}</span>
                          </div>
                          <div>
                            <span className="font-bold text-[#1E293B] dark:text-white">
                              Output:{' '}
                            </span>
                            <span className="text-[#16A34A] font-bold">
                              {selectedProblem.example2.output}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Right Action Buttons: Next Question in Progression + Start Solving */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] text-slate-400">
                      Question {selectedProblem.number} of {topicProblems.length} in{' '}
                      <strong>{currentTopic.title}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {selectedProblem.number < topicProblems.length && (
                        <button
                          onClick={() => {
                            const nextProb = topicProblems.find(
                              (p) => p.number === selectedProblem.number + 1
                            );
                            if (nextProb) onSelectProblem(nextProb);
                          }}
                          className="px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          Next Stage →
                        </button>
                      )}

                      <button
                        onClick={() => setSolverOpen(true)}
                        className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Solving</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Interactive Code Solver & Multi-Test-Case Judge */
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#EDF2F7] dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSolverOpen(false)}
                        className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                        title="Back to Problem Details"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-extrabold">
                        Solve #{selectedProblem.number}. {selectedProblem.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setUserCode(selectedProblem.solutionCode)}
                        className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Show Solution
                      </button>
                      <button
                        onClick={() => {
                          setUserCode(selectedProblem.starterCode);
                          setTestResults(null);
                          setRuntimeError(null);
                        }}
                        className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                      <button
                        onClick={handleRunProblemTests}
                        className="px-3 py-1 rounded-md bg-[#16A34A] hover:bg-[#15803D] text-white text-[11px] font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Run Tests</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Code Textarea */}
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    spellCheck={false}
                    className="w-full h-36 p-3 rounded-lg bg-[#0F172A] text-slate-100 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y border border-slate-800"
                  />

                  {/* Runtime Error */}
                  {runtimeError && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
                      Runtime Error: {runtimeError}
                    </div>
                  )}

                  {/* Test Case Outcomes */}
                  {testResults && (
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                        <span>
                          Test Results ({testResults.filter((r) => r.passed).length}/
                          {testResults.length} Passed)
                        </span>
                        {testResults.every((r) => r.passed) && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#16A34A] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Passed!
                            </span>
                            {selectedProblem.number < topicProblems.length && (
                              <button
                                onClick={() => {
                                  const nextProb = topicProblems.find(
                                    (p) => p.number === selectedProblem.number + 1
                                  );
                                  if (nextProb) {
                                    onSelectProblem(nextProb);
                                    setSolverOpen(false);
                                  }
                                }}
                                className="px-2.5 py-0.5 rounded bg-[#2563EB] text-white text-[11px] font-semibold cursor-pointer"
                              >
                                Continue to Question #{selectedProblem.number + 1} →
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {testResults.map((tr, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded-lg border text-[11px] font-mono ${
                              tr.passed
                                ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D] dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                                : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
                            }`}
                          >
                            <div className="flex items-center gap-1 font-bold mb-1 truncate">
                              {tr.passed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 shrink-0" />
                              )}
                              <span className="truncate">Case {i + 1}</span>
                            </div>
                            <div className="truncate opacity-85">{tr.label}</div>
                            <div>
                              Out: <strong>{tr.actual}</strong> (Exp: {tr.expected})
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Code/Algorithm Explorer (4 Rich Sub-Views) */}
      {activeTab === 'explorer' && (
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

          {explorerSubTab === 'simulator' && (
            /* Sub-View 2: Interactive End-to-End Request & Failure Simulator */
            <div
              className={`rounded-xl border p-4 space-y-4 ${
                darkMode
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-white border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.03)]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#2563EB]" />
                  <div>
                    <h3 className="text-[13.5px] font-bold">
                      End-to-End HTTP Request & Infrastructure Failure Simulator
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Inspect live JSON payloads, Redis commands, and SQL transactions across every service hop
                    </p>
                  </div>
                </div>

                {/* Condition / Failure Mode Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {activeScenario.modes.map((mode, idx) => (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setSelectedModeIdx(idx);
                        setSelectedHopIdx(0);
                      }}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                        selectedModeIdx === idx
                          ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-2xs'
                          : darkMode
                          ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                          : 'bg-[#F8FAFC] border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5-Hop Interactive Pipeline Diagram */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {activeMode.hops.map((hop, idx) => {
                  const isSelected = selectedHopIdx === idx;
                  const statusStyle =
                    hop.status === 'error'
                      ? 'border-rose-400 bg-rose-50/70 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200'
                      : hop.status === 'warn'
                      ? 'border-amber-400 bg-amber-50/70 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200'
                      : hop.status === 'skipped'
                      ? 'border-slate-200 bg-slate-50 text-slate-400 opacity-65 dark:bg-slate-950/40 dark:border-slate-800'
                      : 'border-emerald-300 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200';

                  return (
                    <button
                      key={hop.hopNumber}
                      onClick={() => setSelectedHopIdx(idx)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${statusStyle} ${
                        isSelected ? 'ring-2 ring-[#2563EB] shadow-sm' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                        <span>Hop {hop.hopNumber}</span>
                        <span className="font-mono">{hop.latencyMs}ms</span>
                      </div>
                      <div className="text-xs font-extrabold truncate">{hop.stageName}</div>
                      <div className="text-[10px] font-mono opacity-80 truncate mt-0.5">
                        {hop.component}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Hop Details + Live JSON Payload Inspector */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div
                  className={`lg:col-span-6 p-3.5 rounded-xl border flex flex-col justify-between space-y-2.5 ${
                    darkMode ? 'bg-slate-950 border-slate-800' : 'bg-[#F8FAFC] border-[#E2E8F0]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-[#2563EB]">
                        Hop {activeHop.hopNumber}: {activeHop.stageName} ({activeHop.component})
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-mono font-bold bg-blue-50 text-[#2563EB] border border-blue-200">
                        {activeMode.statusCode} · Total {activeMode.totalLatencyMs}ms
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-900 text-blue-300 font-mono text-[11px] border border-slate-800">
                      $ {activeHop.commandOrAction}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong>What happens internally: </strong>
                      {activeHop.whyItMatters}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400">{activeMode.summary}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setSelectedHopIdx((i) => Math.max(0, i - 1))}
                        disabled={selectedHopIdx === 0}
                        className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                      >
                        Prev Hop
                      </button>
                      <button
                        onClick={() =>
                          setSelectedHopIdx((i) => Math.min(activeMode.hops.length - 1, i + 1))
                        }
                        disabled={selectedHopIdx >= activeMode.hops.length - 1}
                        className="px-2.5 py-1 rounded bg-[#2563EB] text-white text-xs font-semibold flex items-center gap-1 disabled:opacity-40 cursor-pointer"
                      >
                        <span>Next Hop</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 flex flex-col">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Live Hop Payload / State Snapshot (JSON):
                  </div>
                  <pre className="flex-1 p-3.5 rounded-xl bg-[#0F172A] text-emerald-300 font-mono text-[11.5px] overflow-x-auto border border-slate-800">
                    {activeHop.payloadJson}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {explorerSubTab === 'codebase' && (
            /* Sub-View 3: Real-World Bug Fixing, Feature Implementation & Refactoring Simulator */
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
            /* Sub-View 4: Structured Modern Web Technologies Learning Path */
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
