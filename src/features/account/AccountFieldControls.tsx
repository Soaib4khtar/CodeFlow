import React from 'react';

/** Shared input / select styling for account dialog forms. */
export const fieldClass = (darkMode: boolean) =>
  `w-full px-3 py-1.5 rounded-lg border text-xs bg-transparent focus:outline-none focus:ring-2 ${
    darkMode
      ? 'border-slate-700 focus:ring-amber-400/30 focus:border-amber-400'
      : 'border-[#D8D0C0] focus:ring-blue-500/20 focus:border-[#2563EB]'
  }`;

/** Primary action button styling (blue in Light mode, amber in Dark mode). */
export const primaryBtn =
  'px-4 py-1.5 rounded-lg bg-[#2563EB] dark:bg-amber-500 hover:bg-[#1D4ED8] dark:hover:bg-amber-600 text-white dark:text-slate-950 text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

/** Neutral secondary button styling. */
export const secondaryBtn = (darkMode: boolean) =>
  `px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
    darkMode
      ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
      : 'border-[#D8D0C0] text-slate-700 hover:bg-[#EFECE4]'
  }`;

/** Small form field label. */
export const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-[11px] font-semibold text-slate-400 mb-1">{children}</label>
);

/** Segmented button group for mutually exclusive options (e.g. Slow / Normal / Fast). */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  darkMode
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  darkMode: boolean;
}) {
  return (
    <div className="flex gap-1.5">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
            value === option.id
              ? darkMode
                ? 'bg-amber-500 border-amber-500 text-slate-950'
                : 'bg-[#2563EB] border-[#2563EB] text-white'
              : darkMode
              ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
              : 'border-[#D8D0C0] text-slate-700 hover:bg-[#EFECE4]'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** Accessible boolean switch toggle. */
export const Toggle: React.FC<{
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${
      checked ? 'bg-[#2563EB] dark:bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
        checked ? 'translate-x-4' : ''
      }`}
    />
  </button>
);
