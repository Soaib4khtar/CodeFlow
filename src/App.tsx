import React, { useState, useEffect } from 'react';
import { ALL_CODEFLOW_TOPICS, PRACTICE_PROBLEMS } from './data/problemsData';
import { CodeLanguage, PracticeProblem } from './types/codeflow';
import { TopNavbar } from './components/TopNavbar';
import { LeftSidebar } from './components/LeftSidebar';
import { CodeEditorCard } from './components/CodeEditorCard';
import { ExecutionVisualizerCard } from './components/ExecutionVisualizerCard';
import { BottomWorkspace } from './components/BottomWorkspace';
import {
  ChevronRight,
  ChevronLeft,
  Star,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  FileCode2
} from 'lucide-react';

export function App() {
  // Default to 'binary-search' and Problem #2 ('Binary Search') to match the reference design on load
  const [selectedTopicId, setSelectedTopicId] = useState<string>('binary-search');
  const [stepIndex, setStepIndex] = useState<number>(2); // 0-indexed -> Step 3 / 8
  const [language, setLanguage] = useState<CodeLanguage>('javascript');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [demoMode, setDemoMode] = useState<string>('Demo Algorithm');
  const [selectedProblem, setSelectedProblem] = useState<PracticeProblem>(
    PRACTICE_PROBLEMS[1] // #2 Binary Search
  );

  const currentTopic =
    ALL_CODEFLOW_TOPICS.find((t) => t.id === selectedTopicId) || ALL_CODEFLOW_TOPICS[15];

  const totalSteps = currentTopic.steps.length;
  const safeStepIndex = Math.min(stepIndex, totalSteps - 1);
  const currentStep = currentTopic.steps[safeStepIndex];

  // Handle topic selection
  const handleSelectTopic = (topicId: string) => {
    setIsPlaying(false);
    setSelectedTopicId(topicId);
    const nextTopic = ALL_CODEFLOW_TOPICS.find((t) => t.id === topicId);
    if (nextTopic) {
      setStepIndex(nextTopic.defaultStep ? nextTopic.defaultStep - 1 : 0);
    } else {
      setStepIndex(0);
    }
    const matchingProblem = PRACTICE_PROBLEMS.find((p) => p.topicId === topicId);
    if (matchingProblem) {
      setSelectedProblem(matchingProblem);
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
    }, 1100);
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps]);

  const handleRunToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (safeStepIndex >= totalSteps - 1) {
        setStepIndex(0);
      }
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepIndex(0);
  };

  const toggleFavourite = (id: string) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isFav = favourites.includes(currentTopic.id);

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
          setSelectedProblem(prob);
          handleSelectTopic(prob.topicId);
        }}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
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
        />

        {/* Main Workspace */}
        <main className="flex-1 min-w-0 p-4 sm:p-5 lg:p-6 space-y-4">
          {/* 1. Topic Header & Breadcrumb Section */}
          <div className="space-y-1.5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <span>{currentTopic.pillar}</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
                {currentTopic.title}
              </span>
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

              {/* Right Controls: Add to Favourites + Top Step Counter */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => toggleFavourite(currentTopic.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
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
                    className="px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 transition-colors"
                    aria-label="Previous step"
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
                    className="px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 transition-colors"
                    aria-label="Next step"
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
                  className="px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35"
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
                  className="px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleRunToggle}
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

            {/* Right: Demo Algorithm Mode Selector */}
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
                  if (e.target.value === 'Step 1 Start') setStepIndex(0);
                  else if (e.target.value === 'Final Result') setStepIndex(totalSteps - 1);
                  else setStepIndex(currentTopic.defaultStep ? currentTopic.defaultStep - 1 : 0);
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
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 -ml-3 pointer-events-none" />
            </div>
          </div>

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

          {/* 4. Bottom Workspace: Problems List + Question Details / Code Explorer */}
          <BottomWorkspace
            problems={PRACTICE_PROBLEMS}
            selectedProblem={selectedProblem}
            onSelectProblem={(prob) => setSelectedProblem(prob)}
            onStartSolving={(prob) => {
              setSelectedProblem(prob);
              handleSelectTopic(prob.topicId);
              setStepIndex(0);
              setIsPlaying(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            currentTopic={currentTopic}
            currentStep={currentStep}
            darkMode={darkMode}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
