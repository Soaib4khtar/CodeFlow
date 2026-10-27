import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronRight, PanelLeftClose } from 'lucide-react';
import { LearningPhase, PillarId, TopicData } from '@/types/codeflow';
import { PILLARS } from './topicIconMap';
import { SidebarTopicItem } from './SidebarTopicItem';

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
  const [expandedMap, setExpandedMap] = useState<Record<PillarId, boolean>>({
    DSA: true,
    Backend: false,
    'System Design': false,
    'Web Dev': false
  });

  // Automatically expand the active topic's pillar when selected via search/problems
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
                      const showPhaseHeader =
                        pillar.id === 'DSA' &&
                        Boolean(topic.learningPhase) &&
                        topic.learningPhase !== lastPhase;

                      if (topic.learningPhase) {
                        lastPhase = topic.learningPhase;
                      }

                      return (
                        <SidebarTopicItem
                          key={topic.id}
                          topic={topic}
                          isSelected={topic.id === selectedTopicId}
                          isCompleted={completedTopics.includes(topic.id)}
                          isFavourite={favourites.includes(topic.id)}
                          showPhaseHeader={showPhaseHeader}
                          darkMode={darkMode}
                          onSelect={handleTopicClick}
                        />
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
