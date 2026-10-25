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
  PanelLeftOpen
} from 'lucide-react';
import { PillarId, TopicData } from '../types/codeflow';

interface LeftSidebarProps {
  topics: TopicData[];
  selectedTopicId: string;
  onSelectTopic: (id: string) => void;
  darkMode: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  sidebarVisible: boolean;
  onToggleSidebar: () => void;
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
  { id: 'DSA', label: 'DSA', icon: Share2 },
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
  onToggleSidebar
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
                  {pillarTopics.length}
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
                      return (
                        <button
                          key={topic.id}
                          onClick={() => handleTopicClick(topic.id)}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-[5.5px] rounded-md text-[12px] transition-colors text-left cursor-pointer ${
                            isSelected
                              ? darkMode
                                ? 'bg-blue-600/25 text-blue-300 font-semibold'
                                : 'bg-[#DCE8FF] text-[#1D4ED8] font-semibold'
                              : darkMode
                              ? 'text-slate-300 hover:bg-slate-800/70'
                              : 'text-[#334155] hover:bg-slate-200/60'
                          }`}
                        >
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
                        </button>
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
          title="Restore Sidebar"
          className={`hidden lg:flex fixed left-3 bottom-5 z-30 items-center gap-1.5 px-3 py-2 rounded-full border shadow-md text-xs font-semibold transition-all cursor-pointer ${
            darkMode
              ? 'bg-slate-900 border-slate-700 text-blue-300 hover:bg-slate-800'
              : 'bg-white border-[#CBD5E1] text-[#2563EB] hover:bg-blue-50'
          }`}
        >
          <PanelLeftOpen className="w-3.5 h-3.5" />
          <span>Topics</span>
        </button>
      )}

      {/* Desktop Sidebar with smooth width & opacity transition */}
      <aside
        className={`hidden lg:block sticky top-14 h-[calc(100vh-3.5rem)] shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
          sidebarVisible ? 'w-[252px] opacity-100' : 'w-0 opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`w-[252px] h-full overflow-y-auto border-r select-none px-3 py-3.5 transition-colors ${
            darkMode
              ? 'bg-slate-900 border-slate-800 text-slate-200'
              : 'bg-[#F8FAFC] border-[#E5EAF2] text-slate-700'
          }`}
        >
          {renderSubjectsList()}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div
            className={`relative z-10 w-[260px] h-full overflow-y-auto border-r px-3 py-3.5 ${
              darkMode
                ? 'bg-slate-900 border-slate-800 text-slate-200'
                : 'bg-[#F8FAFC] border-[#E5EAF2] text-slate-700'
            }`}
          >
            {renderSubjectsList()}
          </div>
        </div>
      )}
    </>
  );
};
