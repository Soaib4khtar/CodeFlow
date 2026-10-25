import React, { useState, useEffect, useCallback } from 'react';
import {
  ALL_CODEFLOW_TOPICS,
  PRACTICE_PROBLEMS,
  getProblemsForTopic
} from './data/problemsData';
import { CodeLanguage, PracticeProblem, TopicData } from './types/codeflow';
import { TopNavbar } from './components/TopNavbar';
import { LeftSidebar } from './components/LeftSidebar';
import { CodeEditorCard } from './components/CodeEditorCard';
import { ExecutionVisualizerCard } from './components/ExecutionVisualizerCard';
import { BottomWorkspace } from './components/BottomWorkspace';
import {
  generateCustomSteps,
  getCustomInputMeta,
  CustomRunResult
} from './utils/customStepGenerator';
import {
  ChevronRight,
  ChevronLeft,
  Star,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  FileCode2,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';

const LS_FAV_KEY = 'codeflow_favourites_v1';
const LS_COMPLETED_TOPICS_KEY = 'codeflow_completed_topics_v1';
const LS_SOLVED_PROBLEMS_KEY = 'codeflow_solved_problems_v1';

function loadSavedList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function App() {
  // Default to 'binary-search' and its #1 Recommended Problem on load
  const [selectedTopicId, setSelectedTopicId] = useState<string>('binary-search');
  const [stepIndex, setStepIndex] = useState<number>(2); // 0-indexed -> Step 3 / 8
  const [language, setLanguage] = useState<CodeLanguage>('javascript');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Persistent Progress & Favourites in localStorage
  const [favourites, setFavourites] = useState<string[]>(() => loadSavedList(LS_FAV_KEY));
  const [completedTopics, setCompletedTopics] = useState<string[]>(() =>
    loadSavedList(LS_COMPLETED_TOPICS_KEY)
  );
  const [solvedProblems, setSolvedProblems] = useState<string[]>(() =>
    loadSavedList(LS_SOLVED_PROBLEMS_KEY)
  );

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);
  const [demoMode, setDemoMode] = useState<string>('Demo Algorithm');
  const [selectedProblem, setSelectedProblem] = useState<PracticeProblem>(
    () => getProblemsForTopic('binary-search')[0] || PRACTICE_PROBLEMS[0]
  );

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_FAV_KEY, JSON.stringify(favourites));
    } catch {
      // ignore storage errors
    }
  }, [favourites]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_COMPLETED_TOPICS_KEY, JSON.stringify(completedTopics));
    } catch {
      // ignore storage errors
    }
  }, [completedTopics]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_SOLVED_PROBLEMS_KEY, JSON.stringify(solvedProblems));
    } catch {
      // ignore storage errors
    }
  }, [solvedProblems]);

  const baseTopic =
    ALL_CODEFLOW_TOPICS.find((t) => t.id === selectedTopicId) || ALL_CODEFLOW_TOPICS[0];

  const customMeta = getCustomInputMeta(baseTopic.id);

  // Dynamic Custom Input state
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [customArrayStr, setCustomArrayStr] = useState<string>(customMeta.defaultArray);
  const [customTargetStr, setCustomTargetStr] = useState<string>(customMeta.defaultTarget);
  const [customRun, setCustomRun] = useState<CustomRunResult | null>(null);

  // Update default custom inputs when switching topics
  useEffect(() => {
    const meta = getCustomInputMeta(baseTopic.id);
    setCustomArrayStr(meta.defaultArray);
    setCustomTargetStr(meta.defaultTarget);
  }, [baseTopic.id]);

  // Merge custom steps if active
  const currentTopic: TopicData = customRun
    ? {
        ...baseTopic,
        steps: customRun.steps,
        traceSummary: customRun.traceSummary
      }
    : baseTopic;

  const totalSteps = currentTopic.steps.length;
  const safeStepIndex = Math.min(stepIndex, totalSteps - 1);
  const currentStep = currentTopic.steps[safeStepIndex];

  // Handle topic selection — automatically selects the #1 Recommended Beginner Problem for that topic
  const handleSelectTopic = (topicId: string) => {
    setIsPlaying(false);
    setCustomRun(null);
    setSelectedTopicId(topicId);
    const nextTopic = ALL_CODEFLOW_TOPICS.find((t) => t.id === topicId);
    if (nextTopic) {
      setStepIndex(nextTopic.defaultStep ? nextTopic.defaultStep - 1 : 0);
    } else {
      setStepIndex(0);
    }
    const topicProbs = getProblemsForTopic(topicId);
    if (topicProbs.length > 0) {
      setSelectedProblem(topicProbs[0]);
    }
  };

  // Auto-step playback when "Run" is clicked
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev + 1 >= totalSteps) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1050);
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps]);

  const handleRunToggle = useCallback(() => {
    setIsPlaying((prevPlaying) => {
      if (prevPlaying) {
        return false;
      }
      setStepIndex((curr) => (curr >= totalSteps - 1 ? 0 : curr));
      return true;
    });
  }, [totalSteps]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCustomRun(null);
    setStepIndex(0);
  }, []);

  // Keyboard shortcuts: Space (Play/Pause), ArrowLeft (Prev Step), ArrowRight (Next Step)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setIsPlaying(false);
        setStepIndex((s) => Math.min(totalSteps - 1, s + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setIsPlaying(false);
        setStepIndex((s) => Math.max(0, s - 1));
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleRunToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSteps, handleRunToggle]);

  const handleApplyCustomInput = (e: React.FormEvent) => {
    e.preventDefault();
    const res = generateCustomSteps(baseTopic.id, customArrayStr, customTargetStr);
    if (res) {
      setCustomRun(res);
      setStepIndex(0);
      setIsPlaying(true);
    }
  };

  const toggleFavourite = (id: string) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCompletedTopic = (id: string) => {
    setCompletedTopics((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const markTopicCompleted = (id: string) => {
    setCompletedTopics((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const markProblemSolved = (id: string) => {
    setSolvedProblems((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleResetProgress = () => {
    setCompletedTopics([]);
    setSolvedProblems([]);
  };

  const isFav = favourites.includes(currentTopic.id);
  const isCompleted = completedTopics.includes(currentTopic.id);

  const difficultyBadgeStyle =
    currentTopic.difficulty === 'Easy'
      ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]'
      : currentTopic.difficulty === 'Hard'
      ? 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]'
      : 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]';

  const langBadgeMap: Record<CodeLanguage, { short: string; label: string; bg: string }> = {
    javascript: { short: 'JS', label: 'JavaScript', bg: 'bg-[#FACC15] text-slate-900' },
    typescript: { short: 'TS', label: 'TypeScript', bg: 'bg-[#3B82F6] text-white' },
    python: { short: 'PY', label: 'Python', bg: 'bg-[#10B981] text-white' },
    cpp: { short: 'C++', label: 'C++', bg: 'bg-[#6366F1] text-white' }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#F4F7FB] text-[#1E293B]'
      }`}
    >
      {/* Top Header Bar */}
      <TopNavbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        allTopics={ALL_CODEFLOW_TOPICS}
        allProblems={PRACTICE_PROBLEMS}
        onSelectTopic={handleSelectTopic}
        onSelectProblem={(prob) => {
          handleSelectTopic(prob.topicId);
          setSelectedProblem(prob);
        }}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
        sidebarVisible={sidebarVisible}
        onToggleSidebar={() => setSidebarVisible((prev) => !prev)}
        favourites={favourites}
        onToggleFavourite={toggleFavourite}
        completedTopics={completedTopics}
        solvedProblems={solvedProblems}
        onResetProgress={handleResetProgress}
      />

      {/* Main Body Layout: Left Sidebar + Right Content Workspace */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <LeftSidebar
          topics={ALL_CODEFLOW_TOPICS}
          selectedTopicId={currentTopic.id}
          onSelectTopic={handleSelectTopic}
          darkMode={darkMode}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          sidebarVisible={sidebarVisible}
          onToggleSidebar={() => setSidebarVisible((prev) => !prev)}
          completedTopics={completedTopics}
          favourites={favourites}
        />

        {/* Main Workspace automatically expands smoothly when sidebar is hidden */}
        <main className="flex-1 min-w-0 p-4 sm:p-5 lg:p-6 space-y-4 transition-all duration-300 ease-in-out">
          {/* 1. Topic Header & Structured Roadmap Breadcrumb Section */}
          <div className="space-y-1.5">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-1.5">
                <span>{currentTopic.pillar}</span>
                {currentTopic.learningPhase && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-[#2563EB] font-semibold">
                      {currentTopic.learningPhase}
                    </span>
                  </>
                )}
                <ChevronRight className="w-3.5 h-3.5" />
                <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
                  {currentTopic.learningOrder
                    ? `#${currentTopic.learningOrder}. ${currentTopic.title}`
                    : currentTopic.title}
                </span>
              </div>
            </div>

            {/* Title + Difficulty + Right Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h1
                  className={`text-xl sm:text-[24px] font-extrabold tracking-tight ${
                    darkMode ? 'text-white' : 'text-[#0F172A]'
                  }`}
                >
                  {currentTopic.title}
                </h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${difficultyBadgeStyle}`}
                >
                  {currentTopic.difficulty}
                </span>
              </div>

              {/* Right Controls: Mastered Toggle + Add to Favourites + Top Step Counter */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => toggleCompletedTopic(currentTopic.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D] dark:bg-emerald-950/50 dark:border-emerald-700 dark:text-emerald-300'
                      : darkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-[#E2E8F0] text-[#334155] hover:bg-slate-50 shadow-2xs'
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      isCompleted ? 'text-[#16A34A]' : 'text-slate-400'
                    }`}
                  />
                  <span>{isCompleted ? 'Mastered' : 'Mark Mastered'}</span>
                </button>

                <button
                  onClick={() => toggleFavourite(currentTopic.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    isFav
                      ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/50 dark:border-amber-700 dark:text-amber-300'
                      : darkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-[#E2E8F0] text-[#334155] hover:bg-slate-50 shadow-2xs'
                  }`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      isFav ? 'fill-amber-400 text-amber-500' : 'text-slate-400'
                    }`}
                  />
                  <span>{isFav ? 'Added to Favourites' : 'Add to Favourites'}</span>
                </button>

                {/* Top-Right Compact Stepper < 3 / 8 > */}
                <div
                  className={`flex items-center rounded-lg border text-xs font-semibold overflow-hidden ${
                    darkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-200'
                      : 'bg-white border-[#E2E8F0] text-[#334155] shadow-2xs'
                  }`}
                >
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setStepIndex((s) => Math.max(0, s - 1));
                    }}
                    disabled={safeStepIndex === 0}
                    className="px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 transition-colors cursor-pointer"
                    aria-label="Previous step"
                    title="Previous step (←)"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2.5 py-1.5 border-x border-[#E2E8F0] dark:border-slate-800 font-mono text-[11.5px]">
                    {safeStepIndex + 1} / {totalSteps}
                  </span>
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setStepIndex((s) => Math.min(totalSteps - 1, s + 1));
                    }}
                    disabled={safeStepIndex >= totalSteps - 1}
                    className="px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 transition-colors cursor-pointer"
                    aria-label="Next step"
                    title="Next step (→)"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Problem / Concept Description */}
            <p
              className={`text-xs sm:text-[13px] max-w-2xl leading-relaxed ${
                darkMode ? 'text-slate-400' : 'text-[#475569]'
              }`}
            >
              {currentTopic.description}
            </p>
          </div>

          {/* 2. Execution Toolbar Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Left: Language Selector Dropdown */}
            <div className="relative flex items-center">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                  darkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-200'
                    : 'bg-white border-[#E2E8F0] text-[#1E293B] shadow-2xs'
                }`}
              >
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${langBadgeMap[language].bg}`}
                >
                  {langBadgeMap[language].short}
                </span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as CodeLanguage)}
                  aria-label="Select programming language"
                  className="bg-transparent pr-4 focus:outline-none cursor-pointer font-semibold text-xs appearance-none"
                >
                  <option value="javascript" className="text-slate-900">
                    JavaScript
                  </option>
                  <option value="typescript" className="text-slate-900">
                    TypeScript
                  </option>
                  <option value="python" className="text-slate-900">
                    Python
                  </option>
                  <option value="cpp" className="text-slate-900">
                    C++
                  </option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 -ml-3 pointer-events-none" />
              </div>
            </div>

            {/* Center: Step Counter + Run + Reset */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div
                className={`flex items-center rounded-lg border text-xs font-semibold ${
                  darkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-200'
                    : 'bg-white border-[#E2E8F0] text-[#334155] shadow-2xs'
                }`}
              >
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIndex((s) => Math.max(0, s - 1));
                  }}
                  disabled={safeStepIndex === 0}
                  title="Step Backward (←)"
                  className="px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-3.5 py-1.5 border-x border-[#E2E8F0] dark:border-slate-800 text-xs">
                  Step{' '}
                  <strong className="font-bold">
                    {safeStepIndex + 1} / {totalSteps}
                  </strong>
                </span>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIndex((s) => Math.min(totalSteps - 1, s + 1));
                  }}
                  disabled={safeStepIndex >= totalSteps - 1}
                  title="Step Forward (→)"
                  className="px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleRunToggle}
                title="Run / Pause (Space)"
                className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  darkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    : 'bg-white border-[#E2E8F0] text-[#334155] hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset</span>
              </button>
            </div>

            {/* Right: Demo Algorithm Mode Selector + Custom Input Toggle */}
            <div className="flex items-center gap-2">
              {currentTopic.pillar === 'DSA' && (
                <button
                  onClick={() => setShowCustomInput((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    showCustomInput || customRun
                      ? 'bg-[#E8F1FF] border-[#3B82F6] text-[#1D4ED8]'
                      : darkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-[#E2E8F0] text-[#334155] hover:bg-slate-50 shadow-2xs'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Custom Input</span>
                </button>
              )}

              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                  darkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-200'
                    : 'bg-white border-[#E2E8F0] text-[#334155] shadow-2xs'
                }`}
              >
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <FileCode2 className="w-3.5 h-3.5 text-[#2563EB]" />
                <select
                  value={demoMode}
                  onChange={(e) => {
                    setDemoMode(e.target.value);
                    if (e.target.value === 'Custom Input') {
                      setShowCustomInput(true);
                    } else if (e.target.value === 'Step 1 Start') {
                      setCustomRun(null);
                      setStepIndex(0);
                    } else if (e.target.value === 'Final Result') {
                      setStepIndex(totalSteps - 1);
                    } else {
                      setCustomRun(null);
                      setStepIndex(
                        baseTopic.defaultStep ? baseTopic.defaultStep - 1 : 0
                      );
                    }
                  }}
                  aria-label="Select demo mode"
                  className="bg-transparent pr-4 focus:outline-none cursor-pointer text-xs font-semibold appearance-none"
                >
                  <option value="Demo Algorithm" className="text-slate-900">
                    Demo Algorithm
                  </option>
                  <option value="Step 1 Start" className="text-slate-900">
                    Start from Step 1
                  </option>
                  <option value="Final Result" className="text-slate-900">
                    Jump to Final Output
                  </option>
                  <option value="Custom Input" className="text-slate-900">
                    Custom Array / Target
                  </option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 -ml-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Optional Expandable Custom Input Bar with Topic-Aware Labels & Presets */}
          {showCustomInput && currentTopic.pillar === 'DSA' && (
            <form
              onSubmit={handleApplyCustomInput}
              className={`rounded-xl border px-4 py-3 space-y-2.5 transition-all ${
                darkMode
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-white border-[#BFDBFE] shadow-2xs'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-[#2563EB]">
                      {customMeta.arrayLabel}
                    </label>
                    <input
                      type="text"
                      value={customArrayStr}
                      onChange={(e) => setCustomArrayStr(e.target.value)}
                      placeholder={customMeta.defaultArray}
                      className={`px-2.5 py-1 rounded-lg border font-mono text-xs w-52 sm:w-64 focus:outline-none focus:border-blue-500 ${
                        darkMode
                          ? 'bg-slate-950 border-slate-700 text-slate-100'
                          : 'bg-[#F8FAFC] border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-[#2563EB]">
                      {customMeta.targetLabel}
                    </label>
                    <input
                      type="text"
                      value={customTargetStr}
                      onChange={(e) => setCustomTargetStr(e.target.value)}
                      placeholder={customMeta.defaultTarget}
                      className={`px-2.5 py-1 rounded-lg border font-mono text-xs w-20 focus:outline-none focus:border-blue-500 ${
                        darkMode
                          ? 'bg-slate-950 border-slate-700 text-slate-100'
                          : 'bg-[#F8FAFC] border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {customRun && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomRun(null);
                        setStepIndex(0);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Reset Default
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-2xs cursor-pointer"
                  >
                    Apply & Animate
                  </button>
                </div>
              </div>

              {/* Quick 1-Click Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10.5px] font-semibold text-slate-400 mr-1">
                  Quick Presets:
                </span>
                {customMeta.presets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setCustomArrayStr(preset.arr);
                      setCustomTargetStr(preset.target);
                      const res = generateCustomSteps(
                        baseTopic.id,
                        preset.arr,
                        preset.target
                      );
                      if (res) {
                        setCustomRun(res);
                        setStepIndex(0);
                        setIsPlaying(true);
                      }
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                      darkMode
                        ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-blue-500'
                        : 'bg-[#F8FAFC] border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-[#2563EB] hover:border-blue-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </form>
          )}

          {/* 3. Main Two-Column Split: Code Editor Card + Execution Visualizer Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CodeEditorCard
              code={currentTopic.code[language]}
              activeLine={currentStep.activeLine}
              darkMode={darkMode}
            />

            <ExecutionVisualizerCard
              topic={currentTopic}
              currentStep={currentStep}
              stepIndex={safeStepIndex}
              onSelectStep={(idx) => {
                setIsPlaying(false);
                setStepIndex(idx);
              }}
              darkMode={darkMode}
            />
          </div>

          {/* 4. Bottom Workspace: Topic-Filtered Problem Set + Guided Onboarding + Explorer */}
          <BottomWorkspace
            problems={PRACTICE_PROBLEMS}
            selectedProblem={selectedProblem}
            onSelectProblem={(prob) => setSelectedProblem(prob)}
            onStartSolving={(prob) => {
              setSelectedProblem(prob);
              setStepIndex(0);
              setIsPlaying(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            currentTopic={currentTopic}
            currentStep={currentStep}
            darkMode={darkMode}
            solvedProblems={solvedProblems}
            onMarkProblemSolved={markProblemSolved}
            onMarkTopicCompleted={markTopicCompleted}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
