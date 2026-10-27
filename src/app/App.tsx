import { useState, useEffect, useCallback } from 'react';
import { PanelLeftOpen } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useExecutionKeyboardShortcuts } from '@/hooks/useExecutionKeyboardShortcuts';
import { useAccount, PLAYBACK_MS } from '@/features/account/useAccount';
import {
  ALL_CODEFLOW_TOPICS,
  PRACTICE_PROBLEMS,
  getProblemsForTopic
} from '@/data/problemsData';
import { CodeLanguage, PracticeProblem, TopicData } from '@/types/codeflow';
import { TopNavbar } from '@/features/layout/TopNavbar';
import { LeftSidebar } from '@/features/layout/LeftSidebar';
import { TopicHeaderBar } from '@/features/layout/TopicHeaderBar';
import { ExecutionToolbar } from '@/features/layout/ExecutionToolbar';
import { CodeEditorCard } from '@/features/editor/CodeEditorCard';
import { ExecutionVisualizerCard } from '@/features/visualizer/ExecutionVisualizerCard';
import { BottomWorkspace } from '@/features/problems/BottomWorkspace';
import { getBlankStarterCode } from '@/lib/problemHelpers';
import {
  executeAndVisualizeCode,
  LiveExecutionResult
} from '@/lib/liveCodeVisualizer';

const LS_FAV_KEY = 'codeflow_favourites_v1';
const LS_COMPLETED_TOPICS_KEY = 'codeflow_completed_topics_v1';
const LS_SOLVED_PROBLEMS_KEY = 'codeflow_solved_problems_v1';

export function App() {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('binary-search');
  const [stepIndex, setStepIndex] = useState<number>(2);
  const account = useAccount();
  const { preferences } = account;
  const [language, setLanguage] = useState<CodeLanguage>(preferences.defaultLanguage);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Persistent Progress & Favourites in localStorage
  const [favourites, setFavourites] = useLocalStorage<string[]>(LS_FAV_KEY, []);
  const [completedTopics, setCompletedTopics] = useLocalStorage<string[]>(
    LS_COMPLETED_TOPICS_KEY,
    []
  );
  const [solvedProblems, setSolvedProblems] = useLocalStorage<string[]>(
    LS_SOLVED_PROBLEMS_KEY,
    []
  );

  const [searchQuery, setSearchQuery] = useState<string>('');
  const darkMode = preferences.theme === 'dark';
  const setDarkMode = (dark: boolean) =>
    account.updatePreferences({ theme: dark ? 'dark' : 'light' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

  const [selectedProblem, setSelectedProblem] = useState<PracticeProblem>(
    () => getProblemsForTopic('binary-search')[0] || PRACTICE_PROBLEMS[0]
  );

  const baseTopic =
    ALL_CODEFLOW_TOPICS.find((t) => t.id === selectedTopicId) || ALL_CODEFLOW_TOPICS[0];

  const [editorCode, setEditorCode] = useState<string>(
    () => baseTopic.code[preferences.defaultLanguage]
  );
  const [liveResult, setLiveResult] = useState<LiveExecutionResult | null>(null);
  const [showPseudocode, setShowPseudocode] = useState<boolean>(false);

  // Synchronize darkMode class on document root
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

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

  const markTopicCompleted = useCallback(
    (id: string) => {
      setCompletedTopics((prev) => (prev.includes(id) ? prev : [...prev, id]));
    },
    [setCompletedTopics]
  );

  const markProblemSolved = useCallback(
    (id: string) => {
      setSolvedProblems((prev) => (prev.includes(id) ? prev : [...prev, id]));
    },
    [setSolvedProblems]
  );

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
        setIsPlaying(preferences.autoPlay);

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
    [
      baseTopic,
      solvedProblems,
      markProblemSolved,
      markTopicCompleted,
      preferences.autoPlay
    ]
  );

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

  const handleLanguageChange = (newLang: CodeLanguage) => {
    setLanguage(newLang);
    setLiveResult(null);
    setEditorCode(baseTopic.code[newLang]);
  };

  const handleOpenProblemInEditor = (prob: PracticeProblem) => {
    setIsPlaying(false);
    setSelectedProblem(prob);
    setEditorCode(getBlankStarterCode(prob));
    setShowPseudocode(false);
    setLiveResult(null);
    setStepIndex(0);

    const editorEl = document.getElementById('main-code-editor-card');
    if (editorEl) {
      editorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleShowAnswer = () => {
    const finalSolution = selectedProblem.solutionCode;
    setShowPseudocode(false);
    setEditorCode(finalSolution);
    runAndVisualizeEditorCode(finalSolution, selectedProblem);
  };

  // Auto-step playback timer
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
    }, PLAYBACK_MS[preferences.playbackSpeed]);
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps, preferences.playbackSpeed]);

  const handleRunToggle = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

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

  useExecutionKeyboardShortcuts({
    totalSteps,
    setIsPlaying,
    setStepIndex,
    onRunToggle: handleRunToggle
  });

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

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#F5F2EB] text-[#1E293B]'
      }`}
    >
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
        favourites={favourites}
        onToggleFavourite={toggleFavourite}
        onResetProgress={handleResetProgress}
        account={account}
      />

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

        <main className="flex-1 min-w-0 w-full max-w-[1600px] mx-auto p-4 sm:p-5 lg:p-6 space-y-4 transition-all duration-300 ease-in-out">
          {/* Collapsed Sidebar Toggle Button (icon-only, directly below main header under CodeFlow logo) */}
          {!sidebarVisible && (
            <div className="hidden lg:flex items-center -mt-1 mb-1">
              <button
                onClick={() => setSidebarVisible(true)}
                title="Show Sidebar"
                aria-label="Show Sidebar"
                className={`flex items-center justify-center p-1.5 rounded-lg border transition-all cursor-pointer shadow-2xs ${
                  darkMode
                    ? 'border-slate-700 bg-slate-900 text-amber-400 hover:bg-slate-800 hover:text-amber-300'
                    : 'border-[#E0D9CB] bg-[#FAF8F5] text-slate-700 hover:bg-[#F2EEE5] hover:text-[#2563EB]'
                }`}
              >
                <PanelLeftOpen className="w-4 h-4 text-[#2563EB] dark:text-amber-400" />
              </button>
            </div>
          )}

          <TopicHeaderBar
            topic={currentTopic}
            darkMode={darkMode}
            isCompleted={completedTopics.includes(currentTopic.id)}
            isFavourite={favourites.includes(currentTopic.id)}
            onToggleCompleted={() => toggleCompletedTopic(currentTopic.id)}
            onToggleFavourite={() => toggleFavourite(currentTopic.id)}
          />

          <ExecutionToolbar
            language={language}
            onLanguageChange={handleLanguageChange}
            stepIndex={safeStepIndex}
            totalSteps={totalSteps}
            isPlaying={isPlaying}
            onStepPrev={() => {
              setIsPlaying(false);
              setStepIndex((s) => Math.max(0, s - 1));
            }}
            onStepNext={() => {
              setIsPlaying(false);
              setStepIndex((s) => Math.min(totalSteps - 1, s + 1));
            }}
            onRunToggle={handleRunToggle}
            onReset={handleReset}
            showPseudocode={showPseudocode}
            onTogglePseudocode={() => setShowPseudocode((p) => !p)}
            onShowAnswer={handleShowAnswer}
            selectedProblem={selectedProblem}
            darkMode={darkMode}
          />

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
              fontSize={preferences.editorFontSize}
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
