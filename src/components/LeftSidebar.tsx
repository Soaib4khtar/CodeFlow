import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronRight,
  ChevronDown,
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
  FolderGit2
} from 'lucide-react';
import { PillarId, TopicData } from '../types/codeflow';

interface LeftSidebarProps {
  topics: TopicData[];
  selectedTopicId: string;
  onSelectTopic: (id: string) => void;
  darkMode: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
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
  Code2
};

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  topics,
  selectedTopicId,
  onSelectTopic,
  darkMode,
  mobileOpen,
  onCloseMobile
}) => {
  const [expandedPillar, setExpandedPillar] = useState<PillarId | null>('DSA');

  const dsaTopics = topics.filter((t) => t.pillar === 'DSA');
  const bottomPillars: { id: PillarId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'Backend', label: 'Backend', icon: Server },
    { id: 'System Design', label: 'System Design', icon: Cpu },
    { id: 'Web Dev', label: 'Web Dev', icon: Code2 }
  ];

  const handleTopicClick = (id: string, pillar: PillarId) => {
    setExpandedPillar(pillar);
    onSelectTopic(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div
      className={`w-[248px] shrink-0 flex flex-col justify-between border-r select-none h-[calc(100vh-3.5rem)] overflow-y-auto px-3 py-3.5 transition-colors ${
        darkMode
          ? 'bg-slate-900 border-slate-800 text-slate-200'
          : 'bg-[#F8FAFC] border-[#E5EAF2] text-slate-700'
      }`}
    >
      {/* Top DSA Section */}
      <div>
        <button
          onClick={() => setExpandedPillar(expandedPillar === 'DSA' ? null : 'DSA')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-bold transition-all mb-2 ${
            expandedPillar === 'DSA'
              ? darkMode
                ? 'bg-blue-950/60 border-blue-800 text-blue-300'
                : 'bg-[#E8F0FE] border-[#C6DAFC] text-[#1E40AF]'
              : darkMode
              ? 'bg-slate-800/70 border-slate-700 text-slate-200'
              : 'bg-[#EEF3FA] border-[#DCE5F2] text-slate-700 hover:bg-[#E5EDF8]'
          }`}
        >
          <span className="flex items-center gap-2">
            <Share2 className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>DSA</span>
          </span>
          {expandedPillar === 'DSA' ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        {expandedPillar === 'DSA' && (
          <div className="space-y-0.5 mb-3">
            {dsaTopics.map((topic) => {
              const Icon = iconMap[topic.iconName] || Grid;
              const isSelected = topic.id === selectedTopicId;
              return (
                <button
                  key={topic.id}
                  onClick={() => handleTopicClick(topic.id, 'DSA')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-[5px] rounded-md text-[12px] transition-colors text-left ${
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
        )}
      </div>

      {/* Bottom 3 Pillar Accordion Buttons: Backend, System Design, Web Dev */}
      <div className="space-y-1.5 pt-2 border-t border-slate-200/70 dark:border-slate-800">
        {bottomPillars.map((pillar) => {
          const PillarIcon = pillar.icon;
          const isOpen = expandedPillar === pillar.id;
          const subTopics = topics.filter((t) => t.pillar === pillar.id);

          return (
            <div key={pillar.id} className="space-y-1">
              <button
                onClick={() => {
                  const next = isOpen ? 'DSA' : pillar.id;
                  setExpandedPillar(next);
                  if (!isOpen && subTopics.length > 0) {
                    onSelectTopic(subTopics[0].id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                  isOpen
                    ? darkMode
                      ? 'bg-blue-950/60 border-blue-800 text-blue-300'
                      : 'bg-[#E8F0FE] border-[#C6DAFC] text-[#1E40AF]'
                    : darkMode
                    ? 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800'
                    : 'bg-[#EEF3FA] border-[#DCE5F2] text-[#1E293B] hover:bg-[#E4ECF7]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <PillarIcon className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>{pillar.label}</span>
                </span>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>

              {isOpen && (
                <div className="pl-2 space-y-0.5 py-1">
                  {subTopics.map((topic) => {
                    const SubIcon = iconMap[topic.iconName] || Code2;
                    const isSelected = topic.id === selectedTopicId;
                    return (
                      <button
                        key={topic.id}
                        onClick={() => handleTopicClick(topic.id, pillar.id)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-left transition-colors ${
                          isSelected
                            ? darkMode
                              ? 'bg-blue-600/25 text-blue-300 font-semibold'
                              : 'bg-[#DCE8FF] text-[#1D4ED8] font-semibold'
                            : darkMode
                            ? 'text-slate-300 hover:bg-slate-800'
                            : 'text-slate-600 hover:bg-slate-200/60'
                        }`}
                      >
                        <SubIcon className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                        <span className="truncate">{topic.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block sticky top-14 h-[calc(100vh-3.5rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
