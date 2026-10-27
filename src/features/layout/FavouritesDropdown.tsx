import React, { useState, useRef, useEffect } from 'react';
import { Bell, Star, Trash2, X } from 'lucide-react';
import { TopicData } from '@/types/codeflow';

interface FavouritesDropdownProps {
  allTopics: TopicData[];
  favourites: string[];
  onSelectTopic: (topicId: string) => void;
  onToggleFavourite: (topicId: string) => void;
  darkMode: boolean;
}

export const FavouritesDropdown: React.FC<FavouritesDropdownProps> = ({
  allTopics,
  favourites,
  onSelectTopic,
  onToggleFavourite,
  darkMode
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const favouriteTopics = allTopics.filter((t) => favourites.includes(t.id));

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        title="Saved Favourites"
        className={`p-2 rounded-lg transition-colors relative cursor-pointer ${
          open
            ? 'bg-[#EFECE4] text-[#2563EB] dark:bg-slate-800 dark:text-amber-400'
            : darkMode
            ? 'text-slate-300 hover:bg-slate-800'
            : 'text-slate-500 hover:bg-[#EFECE4] hover:text-slate-700'
        }`}
      >
        <Bell className="w-4 h-4" />
        {favourites.length > 0 && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-amber-400 absolute top-2 right-2" />
        )}
      </button>

      {open && (
        <div
          className={`absolute right-0 top-11 w-80 rounded-xl border shadow-xl p-3.5 z-50 space-y-3 ${
            darkMode
              ? 'bg-slate-900 border-slate-700 text-slate-100'
              : 'bg-[#FAF8F5] border-[#E2DCD0] text-[#1E293B]'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>Saved Favourites ({favouriteTopics.length})</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {favouriteTopics.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-400">
              No favourite topics saved yet. Click <strong>"Add to Favourites"</strong> on any
              topic to bookmark it here!
            </div>
          ) : (
            <div className="max-h-56 overflow-y-auto space-y-1.5">
              {favouriteTopics.map((t) => (
                <div
                  key={t.id}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs ${
                    darkMode
                      ? 'bg-slate-950/60 border-slate-800'
                      : 'bg-[#F2EEE5] border-[#E0D9CB]'
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectTopic(t.id);
                      setOpen(false);
                    }}
                    className="text-left font-semibold hover:text-[#2563EB] dark:hover:text-amber-400 truncate flex-1 cursor-pointer"
                  >
                    {t.title}
                    <span className="ml-1.5 text-[10px] font-normal text-slate-400">
                      ({t.pillar})
                    </span>
                  </button>
                  <button
                    onClick={() => onToggleFavourite(t.id)}
                    title="Remove from Favourites"
                    className="text-slate-400 hover:text-rose-500 ml-2 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
