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
import { getBlankStarterCode, generatePseudocode } from './utils/problemHelpers';
import {
  executeAndVisualizeCode,
  LiveExecutionResult
} from './utils/liveCodeVisualizer';
import {
  ChevronRight,
  ChevronLeft,
  Star,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  CheckCircle2,
  Eye,
  FileText,
  X,
  PanelLeftOpen
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

  const [selectedProblem, setSelectedProblem] = useState<PracticeProblem>(
    () => getProblemsForTopic('binary-search')[0] || PRACTICE_PROBLEMS[0]
  );

  const baseTopic =
    ALL_CODEFLOW_TOPICS.find((t) => t.id === selectedTopicId) || ALL_CODEFLOW_TOPICS[0];

  // Main Code Editor state & dynamic live execution trace state
  const [editorCode, setEditorCode] = useState<string>(() => baseTopic.code['javascript']);
  const [liveResult, setLiveResult] = useState<LiveExecutionResult | null>(null);
  const [showPseudocode, setShowPseudocode] = useState<boolean>(false);

  // Synchronize darkMode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  // Merge live visualized steps if the user ran custom/problem code without errors
  const currentTopic: TopicData =
    liveResult && !liveResult.error && liveResult.steps.length > 0
      ? {
          ...baseTopic,
          steps: liveResult.steps,
          traceSummary: liveResult.traceSummary
        }
      : baseTopic;

  const totalSteps = currentTopic.steps.length;
  const safeStepIndex = Math.min(stepIndex, totalSteps - 1);
  const currentStep = currentTopic.steps[safeStepIndex];

  const markTopicCompleted = useCallback((id: string) => {
    setCompletedTopics((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const markProblemSolved = useCallback((id: string) => {
    setSolvedProblems((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  // Run and visualize whatever code is currently in the Main Code Editor
  const runAndVisualizeEditorCode = useCallback(
    (codeToRun: string, problemToTest: PracticeProblem) => {
      const result = executeAndVisualizeCode(
        codeToRun,
        problemToTest,
        baseTopic.steps[0]?.boxes
      );
      setLiveResult(result);

      if (!result.error && result.steps.length > 0) {
        setStepIndex(0);
        setIsPlaying(true);

        // If all test cases for the active problem passed, mark it solved!
        if (
          result.testResults.length > 0 &&
          result.testResults.every((tr) => tr.passed)
        ) {
          markProblemSolved(problemToTest.id);
          const topicProbs = getProblemsForTopic(baseTopic.id);
          const nextSolved = new Set([...solvedProblems, problemToTest.id]);
          if (topicProbs.every((tp) => nextSolved.has(tp.id))) {
            markTopicCompleted(baseTopic.id);
          }
        }
      }
    },
    [baseTopic, solvedProblems, markProblemSolved, markTopicCompleted]
  );

  // Handle topic selection from sidebar or search
  const handleSelectTopic = (topicId: string) => {
    setIsPlaying(false);
    setLiveResult(null);
    setSelectedTopicId(topicId);

    const nextTopic = ALL_CODEFLOW_TOPICS.find((t) => t.id === topicId);
    if (nextTopic) {
      setEditorCode(nextTopic.code[language]);
      setStepIndex(nextTopic.defaultStep ? nextTopic.defaultStep - 1 : 0);
    } else {
      setStepIndex(0);
    }

    const topicProbs = getProblemsForTopic(topicId);
    if (topicProbs.length > 0) {
      setSelectedProblem(topicProbs[0]);
    }
  };

  // Handle language dropdown change
  const handleLanguageChange = (newLang: CodeLanguage) => {
    setLanguage(newLang);
    setLiveResult(null);
    setEditorCode(baseTopic.code[newLang]);
  };

  // Clicking on ANY problem in the Problem Set opens the Main Code Editor with blank starter template
  const handleOpenProblemInEditor = (prob: PracticeProblem) => {
    setIsPlaying(false);
    setSelectedProblem(prob);
    // Start with blank starter code by default (solution only shown on Show Answer)
    setEditorCode(getBlankStarterCode(prob));
    setShowPseudocode(false);
    setLiveResult(null);
    setStepIndex(0);

    // Smoothly scroll up to the Main Code Editor so the user can immediately solve it
    const editorEl = document.getElementById('main-code-editor-card');
    if (editorEl) {
      editorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // "Show Answer" button: reveals the final code required to pass all test cases and visualizes it
  const handleShowAnswer = () => {
    const finalSolution = selectedProblem.solutionCode;
    setShowPseudocode(false);
    setEditorCode(finalSolution);
    runAndVisualizeEditorCode(finalSolution, selectedProblem);
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
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    // Execute & visualize the code in the Main Code Editor
    if (editorCode.trim() !== baseTopic.code[language].trim()) {
      runAndVisualizeEditorCode(editorCode, selectedProblem);
      return;
    }

    setStepIndex((curr) => (curr >= totalSteps - 1 ? 0 : curr));
    setIsPlaying(true);
  }, [
    isPlaying,
    editorCode,
    baseTopic,
    language,
    selectedProblem,
    totalSteps,
    runAndVisualizeEditorCode
  ]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setLiveResult(null);
    setEditorCode(baseTopic.code[language]);
    setStepIndex(0);
  }, [baseTopic, language]);

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
      : 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE] dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800';

  const langBadgeMap: Record<CodeLanguage, { short: string; label: string; bg: string }> = {
    javascript: { short: 'JS', label: 'JavaScript', bg: 'bg-[#FACC15] text-slate-900' },
    typescript: { short: 'TS', label: 'TypeScript', bg: 'bg-[#3B82F6] text-white' },
    python: { short: 'PY', label: 'Python', bg: 'bg-[#10B981] text-white' },
    cpp: { short: 'C++', label: 'C++', bg: 'bg-[#6366F1] text-white' }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#F5F2EB] text-[#1E293B]'
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
          handleOpenProblemInEditor(prob);
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

      {/* Main Body Layout: Left Sidebar fills the left edge + Right Content Workspace */}
      <div className="flex-1 flex w-full">
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

        {/* Main Workspace fills remaining width and scrolls independently */}
        <main className="flex-1 min-w-0 max-w-[1600px] p-4 sm:p-5 lg:p-6 space-y-4 transition-all duration-300 ease-in-out">
          {/* Collapsed Sidebar Toggle Button: Positioned directly below the main header, aligned right underneath the CodeFlow logo */}
          {!sidebarVisible && (
            <div className="hidden lg:flex items-center -mt-1 mb-1">
              <button
                onClick={() => setSidebarVisible(true)}
                title="Show Sidebar"
                aria-label="Show Sidebar"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                  darkMode
                    ? 'border-slate-700 bg-slate-900 text-amber-400 hover:bg-slate-800 hover:text-amber-300'
                    : 'border-[#E0D9CB] bg-[#FAF8F5] text-slate-700 hover:bg-[#F2EEE5] hover:text-[#2563EB]'
                }`}
              >
                <PanelLeftOpen className="w-4 h-4 text-[#2563EB] dark:text-amber-400" />
                <span>Show Sidebar</span>
              </button>
            </div>
          )}

          {/* 1. Topic Header & Structured Roadmap Breadcrumb Section */}
          <div className="space-y-1.5">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-1.5">
                <span>{currentTopic.pillar}</span>
                {currentTopic.learningPhase && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span
                      className={`font-semibold ${
                        darkMode ? 'text-amber-400' : 'text-[#2563EB]'
                      }`}
                    >
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

              {/* Right Controls: Mastered Toggle + Add to Favourites */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => toggleCompletedTopic(currentTopic.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D] dark:bg-emerald-950/50 dark:border-emerald-700 dark:text-emerald-300'
                      : darkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      : 'bg-[#FAF8F5] border-[#E0D9CB] text-[#334155] hover:bg-[#F2EEE5] shadow-2xs'
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
                      : 'bg-[#FAF8F5] border-[#E0D9CB] text-[#334155] hover:bg-[#F2EEE5] shadow-2xs'
                  }`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      isFav ? 'fill-amber-400 text-amber-500' : 'text-slate-400'
                    }`}
                  />
                  <span>{isFav ? 'Added to Favourites' : 'Add to Favourites'}</span>
                </button>
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
                    : 'bg-[#FAF8F5] border-[#E0D9CB] text-[#1E293B] shadow-2xs'
                }`}
              >
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${langBadgeMap[language].bg}`}
                >
                  {langBadgeMap[language].short}
                </span>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value as CodeLanguage)}
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
                    : 'bg-[#FAF8F5] border-[#E0D9CB] text-[#334155] shadow-2xs'
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
                <span className="px-3.5 py-1.5 border-x border-[#E0D9CB] dark:border-slate-800 text-xs">
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
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  darkMode
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
                }`}
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
                    : 'bg-[#FAF8F5] border-[#E0D9CB] text-[#334155] hover:bg-[#F2EEE5] shadow-2xs'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset</span>
              </button>
            </div>

            {/* Right: Pseudocode + Show Answer Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPseudocode((p) => !p)}
                title={`Show pseudocode for #${selectedProblem.number}. ${selectedProblem.title}`}
                className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  showPseudocode
                    ? darkMode
                      ? 'bg-amber-950/70 border-amber-700 text-amber-300'
                      : 'bg-[#EAE4D8] border-[#D0C6B5] text-[#1E293B]'
                    : darkMode
                    ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'bg-[#FAF8F5] border-[#E0D9CB] text-[#334155] hover:bg-[#F2EEE5] shadow-2xs'
                }`}
              >
                <FileText
                  className={`w-3.5 h-3.5 ${
                    darkMode ? 'text-amber-400' : 'text-[#2563EB]'
                  }`}
                />
                <span>Pseudocode</span>
              </button>

              <button
                onClick={handleShowAnswer}
                title={`Reveal final solution code for #${selectedProblem.number}. ${selectedProblem.title} and visualize all test cases`}
                className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  darkMode
                    ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300 hover:bg-emerald-900/70'
                    : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#15803D] hover:bg-[#D1FAE5] shadow-2xs'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Show Answer</span>
              </button>
            </div>
          </div>

          {showPseudocode && (
            <div
              className={`rounded-xl border p-4 ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-200'
                  : 'bg-[#FAF8F5] border-[#E0D9CB] text-[#1E293B] shadow-[0_1px_3px_rgba(40,30,20,0.04)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-bold flex items-center gap-1.5 ${
                    darkMode ? 'text-amber-400' : 'text-[#2563EB]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Pseudocode · #{selectedProblem.number}. {selectedProblem.title}
                </span>
                <button
                  onClick={() => setShowPseudocode(false)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  aria-label="Close pseudocode"
                >
                  <X className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
              <pre className="text-[12px] leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto">
                {generatePseudocode(selectedProblem)}
              </pre>
            </div>
          )}

          {/* 3. Main Two-Column Split: Code Editor Card + Execution Visualizer Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CodeEditorCard
              code={editorCode}
              onCodeChange={(newCode) => setEditorCode(newCode)}
              onRunAndVisualize={() =>
                runAndVisualizeEditorCode(editorCode, selectedProblem)
              }
              activeLine={currentStep.activeLine}
              darkMode={darkMode}
              activeProblem={selectedProblem}
              executionError={liveResult?.error}
              testResults={liveResult?.testResults}
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

          {/* 4. Bottom Workspace: Topic-Filtered Problem Set + Guided Onboarding */}
          <BottomWorkspace
            problems={PRACTICE_PROBLEMS}
            selectedProblem={selectedProblem}
            onSelectProblem={handleOpenProblemInEditor}
            onStartSolving={handleOpenProblemInEditor}
            currentTopic={currentTopic}
            currentStep={currentStep}
            darkMode={darkMode}
            solvedProblems={solvedProblems}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
