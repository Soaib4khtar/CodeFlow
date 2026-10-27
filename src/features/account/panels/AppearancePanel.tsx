import React from 'react';
import { Sun, Moon, Check } from 'lucide-react';
import { AccountApi, DEFAULT_PREFERENCES } from '../useAccount';
import { Label, secondaryBtn } from '../AccountFieldControls';

interface AppearancePanelProps {
  account: AccountApi;
  darkMode: boolean;
}

export const AppearancePanel: React.FC<AppearancePanelProps> = ({ account, darkMode }) => {
  const prefs = account.preferences;

  return (
    <div className="space-y-4">
      <div>
        <Label>Theme</Label>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { id: 'light', label: 'Light (Beige)', Icon: Sun },
              { id: 'dark', label: 'Dark (Amber)', Icon: Moon }
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => account.updatePreferences({ theme: id })}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                prefs.theme === id
                  ? darkMode
                    ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                    : 'border-[#2563EB] bg-[#EFECE4] text-[#1E293B]'
                  : darkMode
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                  : 'border-[#D8D0C0] text-slate-700 hover:bg-[#EFECE4]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1 text-left">{label}</span>
              {prefs.theme === id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Editor font size: {prefs.editorFontSize}px</Label>
        <input
          type="range"
          min={11}
          max={18}
          step={0.5}
          value={prefs.editorFontSize}
          onChange={(e) =>
            account.updatePreferences({ editorFontSize: Number(e.target.value) })
          }
          className="w-full accent-[#2563EB] dark:accent-amber-500 cursor-pointer"
        />
        <pre
          className="mt-2 rounded-lg bg-[#0D1117] text-slate-200 px-3 py-2 font-mono leading-[1.68]"
          style={{ fontSize: prefs.editorFontSize }}
        >
          <span className="text-[#C084FC]">const</span> mid ={' '}
          <span className="text-[#60A5FA]">Math</span>.floor(
          <span className="text-[#FBBF24]">4</span> / <span className="text-[#FBBF24]">2</span>);
        </pre>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={() =>
            account.updatePreferences({
              theme: DEFAULT_PREFERENCES.theme,
              editorFontSize: DEFAULT_PREFERENCES.editorFontSize
            })
          }
          className={secondaryBtn(darkMode)}
        >
          Reset appearance
        </button>
      </div>
    </div>
  );
};
