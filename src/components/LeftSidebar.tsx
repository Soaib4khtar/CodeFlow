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
  PanelLeftOpen,
  CheckCircle2,
  Star
} from 'lucide-react';
import { LearningPhase, PillarId, TopicData } from '../types/codeflow';

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
                    ? 'bg-blue-950/60 border-blue-800 text-blue-300'
                    : 'bg-[#E8F0FE] border-[#C6DAFC] text-[#1E40AF]'
                  : darkMode
                  ? 'bg-slate-800/70 border-slate-700/80 text-slate-200 hover:bg-slate-800'
                  : 'bg-[#EEF3FA] border-[#DCE5F2] text-[#1E293B] hover:bg-[#E4ECF7]'
              }`}
            >
              <span className="flex items-center gap-2">
                <PillarIcon className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <span>{pillar.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isExpanded
                      ? darkMode
                        ? 'bg-blue-900/60 text-blue-200'
                        : 'bg-blue-200/70 text-[#1E40AF]'
                      : darkMode
                      ? 'bg-slate-700 text-slate-400'
                      : 'bg-slate-200/80 text-slate-500'
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
                                darkMode ? 'text-blue-400/90' : 'text-[#2563EB]'
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
                                  ? 'bg-blue-600/25 text-blue-300 font-semibold'
                                  : 'bg-[#DCE8FF] text-[#1D4ED8] font-semibold'
                                : darkMode
                                ? 'text-slate-300 hover:bg-slate-800/70'
                                : 'text-[#334155] hover:bg-slate-200/60'
                            }`}
                          >
                            <span className="flex items-center gap-2 min-w-0">
                              {topic.learningOrder !== undefined && (
                                <span
                                  className={`text-[10px] font-mono w-4 shrink-0 ${
                                    isSelected
                                      ? 'text-[#2563EB] font-bold'
                                      : 'text-slate-400'
                                  }`}
                                >
                                  {String(topic.learningOrder).padStart(2, '0')}
                                </span>
                              )}
                              <Icon
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isSelected
                                    ? 'text-[#2563EB]'
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
      {/* Quick Floating Restore Pill when Desktop Sidebar is hidden */}
      {!sidebarVisible && (
        <button
          onClick={onToggleSidebar}
          title="Expand Topics Sidebar"
          className={`hidden lg:flex fixed bottom-5 left-4 z-30 items-center gap-2 px-3 py-2 rounded-full border shadow-md text-xs font-bold transition-all cursor-pointer ${
            darkMode
              ? 'bg-slate-900 border-slate-700 text-blue-300 hover:bg-slate-800'
              : 'bg-white border-[#BFDBFE] text-[#2563EB] hover:bg-blue-50'
          }`}
        >
          <PanelLeftOpen className="w-4 h-4" />
          <span>Topics</span>
        </button>
      )}

      {/* Desktop Left Sidebar with Smooth Collapse/Expand Transition */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 border-r select-none transition-all duration-300 ease-in-out overflow-hidden ${
          sidebarVisible
            ? 'w-[264px] opacity-100'
            : 'w-0 opacity-0 border-r-0 pointer-events-none'
        } ${
          darkMode
            ? 'bg-slate-900/60 border-slate-800'
            : 'bg-[#F5F8FC] border-[#E4EAF3]'
        }`}
      >
        <div className="w-[264px] p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between px-1 pb-1">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Structured Learning Path
            </span>
            <button
              onClick={onToggleSidebar}
              className="text-[11px] font-medium text-slate-400 hover:text-[#2563EB] transition-colors cursor-pointer"
              title="Collapse Sidebar"
            >
              Hide
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
              darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F5F8FC] text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between px-1 pb-1">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                Structured Learning Path
              </span>
              <button
                onClick={onCloseMobile}
                className="text-xs font-medium text-slate-400 hover:text-slate-600"
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
