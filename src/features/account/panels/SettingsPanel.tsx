import React from 'react';
import { ChevronDown } from 'lucide-react';
import { AccountApi, PlaybackSpeed } from '../useAccount';
import { CodeLanguage } from '@/types/codeflow';
import { fieldClass, Label, secondaryBtn, Segmented, Toggle } from '../AccountFieldControls';

const LANGUAGES: { id: CodeLanguage; label: string }[] = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'cpp', label: 'C++' }
];

interface SettingsPanelProps {
  account: AccountApi;
  darkMode: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ account, darkMode }) => {
  const prefs = account.preferences;

  return (
    <div className="space-y-4">
      <div>
        <Label>Playback speed</Label>
        <Segmented<PlaybackSpeed>
          darkMode={darkMode}
          value={prefs.playbackSpeed}
          onChange={(speed) => account.updatePreferences({ playbackSpeed: speed })}
          options={[
            { id: 'slow', label: 'Slow' },
            { id: 'normal', label: 'Normal' },
            { id: 'fast', label: 'Fast' }
          ]}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold">Auto-play after Run & Visualize</div>
          <div className="text-[11px] text-slate-400">
            Start stepping through the trace automatically.
          </div>
        </div>
        <Toggle
          checked={prefs.autoPlay}
          label="Auto-play"
          onChange={(autoPlay) => account.updatePreferences({ autoPlay })}
        />
      </div>

      <div>
        <Label>Default language</Label>
        <div className="relative">
          <select
            value={prefs.defaultLanguage}
            onChange={(e) =>
              account.updatePreferences({ defaultLanguage: e.target.value as CodeLanguage })
            }
            className={`${fieldClass(darkMode)} appearance-none pr-8 cursor-pointer`}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id} className="text-slate-900">
                {lang.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button onClick={account.resetPreferences} className={secondaryBtn(darkMode)}>
          Restore defaults
        </button>
      </div>
    </div>
  );
};
