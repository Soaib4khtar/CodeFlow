import React, { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { ACCOUNT_STORAGE_PREFIX } from '../useAccount';
import { secondaryBtn } from '../AccountFieldControls';

interface PrivacyPanelProps {
  darkMode: boolean;
  onResetProgress: () => void;
}

export const PrivacyPanel: React.FC<PrivacyPanelProps> = ({ darkMode, onResetProgress }) => {
  const [confirmMode, setConfirmMode] = useState<'progress' | 'all' | null>(null);
  const [message, setMessage] = useState('');

  const exportLocalData = () => {
    const exported: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(ACCOUNT_STORAGE_PREFIX)) {
        try {
          exported[key] = JSON.parse(localStorage.getItem(key) as string);
        } catch {
          exported[key] = localStorage.getItem(key);
        }
      }
    }
    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'codeflow-data.json';
    link.click();
    URL.revokeObjectURL(url);
    setMessage('Your data was exported to codeflow-data.json.');
  };

  const eraseAllLocalData = () => {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(ACCOUNT_STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  };

  return (
    <div className="space-y-3 text-xs">
      <p className="text-slate-500 dark:text-slate-400">
        CodeFlow has no server: your code, progress and profile never leave this browser.
      </p>

      <button
        type="button"
        onClick={exportLocalData}
        className={`${secondaryBtn(darkMode)} w-full flex items-center gap-2`}
      >
        <Download className="w-3.5 h-3.5" /> Export my data (JSON)
      </button>

      {confirmMode === null ? (
        <>
          <button
            type="button"
            onClick={() => setConfirmMode('progress')}
            className={`${secondaryBtn(darkMode)} w-full flex items-center gap-2`}
          >
            <Trash2 className="w-3.5 h-3.5" /> Reset learning progress
          </button>
          <button
            type="button"
            onClick={() => setConfirmMode('all')}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Erase all local data
          </button>
        </>
      ) : (
        <div className="rounded-lg border border-rose-300 dark:border-rose-800 p-3 space-y-2">
          <div className="font-semibold text-rose-600 dark:text-rose-400">
            {confirmMode === 'progress'
              ? 'Reset solved problems and mastered topics?'
              : 'Erase progress, favourites, profile and preferences?'}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirmMode(null)}
              className={secondaryBtn(darkMode)}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirmMode === 'progress') {
                  onResetProgress();
                  setConfirmMode(null);
                  setMessage('Learning progress was reset.');
                } else {
                  eraseAllLocalData();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {message && <div className="text-emerald-600 dark:text-emerald-400">{message}</div>}
    </div>
  );
};
