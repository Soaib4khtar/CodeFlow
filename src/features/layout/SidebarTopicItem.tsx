import React from 'react';
import { Grid, Star, CheckCircle2 } from 'lucide-react';
import { TopicData } from '@/types/codeflow';
import { TOPIC_ICON_MAP } from './topicIconMap';

interface SidebarTopicItemProps {
  topic: TopicData;
  isSelected: boolean;
  isCompleted: boolean;
  isFavourite: boolean;
  showPhaseHeader: boolean;
  darkMode: boolean;
  onSelect: (topicId: string) => void;
}

export const SidebarTopicItem: React.FC<SidebarTopicItemProps> = ({
  topic,
  isSelected,
  isCompleted,
  isFavourite,
  showPhaseHeader,
  darkMode,
  onSelect
}) => {
  const Icon = TOPIC_ICON_MAP[topic.iconName] || Grid;

  return (
    <>
      {showPhaseHeader && topic.learningPhase && (
        <div
          className={`px-2 pt-2.5 pb-1 text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-between ${
            darkMode ? 'text-amber-400' : 'text-[#854D0E]'
          }`}
        >
          <span>{topic.learningPhase}</span>
        </div>
      )}

      <button
        onClick={() => onSelect(topic.id)}
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
          {isFavourite && (
            <Star className="w-3 h-3 fill-amber-400 text-amber-500 shrink-0" />
          )}
          {isCompleted && (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
          )}
        </span>
      </button>
    </>
  );
};
