import React from 'react';
import { ChevronRight, CheckCircle2, Star } from 'lucide-react';
import { TopicData } from '@/types/codeflow';

interface TopicHeaderBarProps {
  topic: TopicData;
  isCompleted: boolean;
  isFavourite: boolean;
  onToggleCompleted: () => void;
  onToggleFavourite: () => void;
  darkMode: boolean;
}

export const TopicHeaderBar: React.FC<TopicHeaderBarProps> = ({
  topic,
  isCompleted,
  isFavourite,
  onToggleCompleted,
  onToggleFavourite,
  darkMode
}) => {
  const difficultyBadgeStyle =
    topic.difficulty === 'Easy'
      ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]'
      : topic.difficulty === 'Hard'
      ? 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]'
      : 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE] dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800';

  return (
    <div className="space-y-1.5">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-400">
        <div className="flex items-center gap-1.5">
          <span>{topic.pillar}</span>
          {topic.learningPhase && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span
                className={`font-semibold ${
                  darkMode ? 'text-amber-400' : 'text-[#2563EB]'
                }`}
              >
                {topic.learningPhase}
              </span>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
            {topic.learningOrder ? `#${topic.learningOrder}. ${topic.title}` : topic.title}
          </span>
        </div>
      </div>

      {/* Title + Difficulty + Mastered & Favourite Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1
            className={`text-xl sm:text-[24px] font-extrabold tracking-tight ${
              darkMode ? 'text-white' : 'text-[#0F172A]'
            }`}
          >
            {topic.title}
          </h1>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${difficultyBadgeStyle}`}
          >
            {topic.difficulty}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onToggleCompleted}
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
            onClick={onToggleFavourite}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              isFavourite
                ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/50 dark:border-amber-700 dark:text-amber-300'
                : darkMode
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-[#FAF8F5] border-[#E0D9CB] text-[#334155] hover:bg-[#F2EEE5] shadow-2xs'
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                isFavourite ? 'fill-amber-400 text-amber-500' : 'text-slate-400'
              }`}
            />
            <span>{isFavourite ? 'Added to Favourites' : 'Add to Favourites'}</span>
          </button>
        </div>
      </div>

      {/* Topic Description */}
      <p
        className={`text-xs sm:text-[13px] max-w-2xl leading-relaxed ${
          darkMode ? 'text-slate-400' : 'text-[#475569]'
        }`}
      >
        {topic.description}
      </p>
    </div>
  );
};
