import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronUp,
  ChevronRight,
  Grid,
  Type,
  Link2,
  Layers,
  Hash,
  GitFork,
  GitBranch,
  Triangle,
  Share2,
  Network,
  ArrowUpDown,
  Search,
  MoveHorizontal,
  Maximize2,
  Sigma,
  SearchCode,
  Undo2,
  Zap,
  Table,
  Split,
  Binary,
  Compass,
  Route,
  GitMerge,
  ListOrdered,
  Combine,
  BarChart2,
  Calendar,
  Clock,
  Sparkles,
  Server,
  Cpu,
  Code2,
  Database,
  Globe,
  FolderGit2,
  ShieldCheck,
  PanelLeftClose,
  CheckCircle2,
  Star
} from 'lucide-react';
import { LearningPhase, PillarId, TopicData } from '@/types/codeflow';

interface LeftSidebarProps {
  topics: TopicData[];
  selectedTopicId: string;
  onSelectTopic: (id: string) => void;
  darkMode: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  sidebarVisible: boolean;
  onToggleSidebar: () => void;
  completedTopics: string[];
  favourites: string[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Grid,
  Type,
  Link: Link2,
  Layers,
  Hash,
  GitFork,
  GitBranch,
  Triangle,
  Share2,
  Network,
  ArrowUpDown,
  Search,
  MoveHorizontal,
  Maximize2,
  Sigma,
  SearchCode,
  Undo2,
  Zap,
  Table,
  Split,
  Binary,
  Compass,
  Route,
  GitMerge,
  ListOrdered,
  Combine,
  BarChart2,
  Calendar,
  Clock,
  Sparkles,
  Globe,
  Database,
  FolderGit2,
  Code2,
  ShieldCheck,
  Server,
  Cpu
};

const PILLARS: {
  id: PillarId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'DSA', label: 'DSA (Structured Path)', icon: Share2 },
  { id: 'Backend', label: 'Backend', icon: Server },
  { id: 'System Design', label: 'System Design', icon: Cpu },
  { id: 'Web Dev', label: 'Web Dev', icon: Code2 }
];

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  topics,
  selectedTopicId,
  onSelectTopic,
  darkMode,
  mobileOpen,
  onCloseMobile,
  sidebarVisible,
  onToggleSidebar,
  completedTopics,
  favourites
}) => {
  // Track which subjects are expanded; default to {'DSA': true}
  const [expandedMap, setExpandedMap] = useState<Record<PillarId, boolean>>({
    DSA: true,
    Backend: false,
    'System Design': false,
    'Web Dev': false
  });

  // Automatically ensure the active topic's pillar is expanded when selected via search/problems
  useEffect(() => {
    const activeTopic = topics.find((t) => t.id === selectedTopicId);
    if (activeTopic) {
      setExpandedMap((prev) => ({
        ...prev,
        [activeTopic.pillar]: true
      }));
    }
  }, [selectedTopicId, topics]);

  const togglePillar = (pillarId: PillarId) => {
    setExpandedMap((prev) => ({
      ...prev,
      [pillarId]: !prev[pillarId]
    }));
  };

  const handleTopicClick = (id: string) => {
    onSelectTopic(id);
    onCloseMobile();
  };

  const renderSubjectsList = () => (
    <div className="flex flex-col gap-2">
      {PILLARS.map((pillar) => {
        const PillarIcon = pillar.icon;
        const isExpanded = expandedMap[pillar.id];
        const pillarTopics = topics.filter((t) => t.pillar === pillar.id);
        const completedInPillar = pillarTopics.filter((t) =>
          completedTopics.includes(t.id)
        ).length;

        let lastPhase: LearningPhase | undefined;

        return (
          <div key={pillar.id} className="flex flex-col">
            {/* Subject Header Button */}
            <button
              onClick={() => togglePillar(pillar.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                isExpanded
                  ? darkMode
                    ? 'bg-amber-950/60 border-amber-700/60 text-amber-300'
                    : 'bg-[#FAF8F5] border-[#D8D0C0] text-[#1E293B]'
                  : darkMode
                  ? 'bg-slate-800/80 border-slate-700/80 text-slate-200 hover:bg-slate-800'
                  : 'bg-[#E7E2D6] border-[#DCD5C5] text-[#334155] hover:bg-[#DDD5C3]'
              }`}
            >
              <span className="flex items-center gap-2">
                <PillarIcon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    darkMode ? 'text-amber-400' : 'text-[#2563EB]'
                  }`}
                />
                <span>{pillar.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isExpanded
                      ? darkMode
                        ? 'bg-amber-900/60 text-amber-200'
                        : 'bg-[#EFECE4] text-[#1E293B]'
                      : darkMode
                      ? 'bg-slate-700 text-slate-400'
                      : 'bg-[#DCD5C5] text-slate-600'
                  }`}
                >
                  {completedInPillar > 0
                    ? `${completedInPillar}/${pillarTopics.length}`
                    : pillarTopics.length}
                </span>
              </span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              )}
            </button>

            {/* Collapsible Topics List directly underneath */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  key={`${pillar.id}-list`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pt-1.5 pb-1 space-y-0.5">
                    {pillarTopics.map((topic) => {
                      const Icon = iconMap[topic.iconName] || Grid;
                      const isSelected = topic.id === selectedTopicId;
                      const isCompleted = completedTopics.includes(topic.id);
                      const isFav = favourites.includes(topic.id);
                      const showPhaseHeader =
                        pillar.id === 'DSA' &&
                        topic.learningPhase &&
                        topic.learningPhase !== lastPhase;

                      if (topic.learningPhase) {
                        lastPhase = topic.learningPhase;
                      }

                      return (
                        <React.Fragment key={topic.id}>
                          {showPhaseHeader && (
                            <div
                              className={`px-2 pt-2.5 pb-1 text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-between ${
                                darkMode ? 'text-amber-400' : 'text-[#854D0E]'
                              }`}
                            >
                              <span>{topic.learningPhase}</span>
                            </div>
                          )}

                          <button
                            onClick={() => handleTopicClick(topic.id)}
                            className={`w-full flex items-center justify-between gap-1.5 px-2.5 py-[5.5px] rounded-md text-[12px] transition-colors text-left cursor-pointer ${
                              isSelected
                                ? darkMode
                                  ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold'
                                  : 'bg-[#FAF8F5] border border-[#D8D0C0] text-[#1E293B] font-bold shadow-2xs'
                                : darkMode
                                ? 'text-slate-300 hover:bg-slate-800/70 border border-transparent'
                                : 'text-[#334155] hover:bg-[#E7E2D6] border border-transparent'
                            }`}
                          >
                            <span className="flex items-center gap-2 min-w-0">
                              {topic.learningOrder !== undefined && (
                                <span
                                  className={`text-[10px] font-mono w-4 shrink-0 ${
                                    isSelected
                                      ? darkMode
                                        ? 'text-amber-400 font-bold'
                                        : 'text-[#2563EB] font-bold'
                                      : 'text-slate-400'
                                  }`}
                                >
                                  {String(topic.learningOrder).padStart(2, '0')}
                                </span>
                              )}
                              <Icon
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isSelected
                                    ? darkMode
                                      ? 'text-amber-400'
                                      : 'text-[#2563EB]'
                                    : darkMode
                                    ? 'text-slate-400'
                                    : 'text-slate-500'
                                }`}
                              />
                              <span className="truncate">{topic.title}</span>
                            </span>

                            <span className="flex items-center gap-1 shrink-0">
                              {topic.learningOrder === 1 && !isCompleted && (
                                <span className="px-1.5 py-[1px] rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[9px] font-bold">
                                  Start
                                </span>
                              )}
                              {isFav && (
                                <Star className="w-3 h-3 fill-amber-400 text-amber-500 shrink-0" />
                              )}
                              {isCompleted && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                              )}
                            </span>
                          </button>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Left Sidebar:
          - Fills the empty gap along the left edge of the screen
          - Scrolls independently with sticky top-14 h-[calc(100vh-3.5rem)]
          - When collapsed, sidebar width becomes 0 with no border and floating button removed
      */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 border-r select-none sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto transition-all duration-300 ease-in-out ${
          sidebarVisible
            ? 'w-[264px] opacity-100'
            : 'w-0 opacity-0 border-r-0 pointer-events-none overflow-hidden'
        } ${
          darkMode
            ? 'bg-slate-900 border-slate-800'
            : 'bg-[#EFECE4] border-[#E2DCD0]'
        }`}
      >
        <div className="w-[264px] p-3 flex flex-col gap-2 min-h-full">
          {/* Header: Structured Learning Path + Repositioned Hide/Show Sidebar Button */}
          <div className="flex items-center justify-between px-1 pb-1">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Structured Learning Path
            </span>
            <button
              onClick={onToggleSidebar}
              className={`p-1 rounded-md border transition-all cursor-pointer ${
                darkMode
                  ? 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-amber-400'
                  : 'border-[#E2DCD0] bg-[#FAF8F5] text-slate-500 hover:bg-[#EAE4D8] hover:text-[#2563EB]'
              }`}
              title="Hide Sidebar"
              aria-label="Hide Sidebar"
            >
              <PanelLeftClose className="w-3.5 h-3.5" />
            </button>
          </div>

          {renderSubjectsList()}
        </div>
      </aside>

      {/* Mobile Drawer Sidebar (< lg) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <aside
            className={`relative w-72 max-w-[85vw] h-full overflow-y-auto p-3 flex flex-col gap-2 z-10 ${
              darkMode
                ? 'bg-slate-900 text-slate-100 border-r border-slate-800'
                : 'bg-[#EFECE4] text-slate-800 border-r border-[#E2DCD0]'
            }`}
          >
            <div className="flex items-center justify-between px-1 pb-1">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                Structured Learning Path
              </span>
              <button
                onClick={onCloseMobile}
                className="text-xs font-medium text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Close
              </button>
            </div>
            {renderSubjectsList()}
          </aside>
        </div>
      )}
    </>
  );
};
