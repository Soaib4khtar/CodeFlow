import React, { useState, useEffect } from 'react';
import { Language } from '../../types/visualizer';
import { Code2, Play, RotateCcw, Terminal, CheckCircle2, AlertTriangle } from 'lucide-react';

interface CodeAndSandboxPanelProps {
  codeMap: Record<Language, string>;
  activeLines: Record<Language, number[]>;
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  liveSandboxCode: string;
}

export const CodeAndSandboxPanel: React.FC<CodeAndSandboxPanelProps> = ({
  codeMap,
  activeLines,
  selectedLanguage,
  onSelectLanguage,
  liveSandboxCode
}) => {
  const [mode, setMode] = useState<'trace' | 'sandbox'>('trace');
  const [sandboxSource, setSandboxSource] = useState(liveSandboxCode);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSandboxSource(liveSandboxCode);
    setLogs([]);
    setError(null);
  }, [liveSandboxCode]);

  const runSandboxCode = () => {
    setError(null);
    const capturedLogs: string[] = [];
    const customConsole = {
      log: (...args: unknown[]) => {
        capturedLogs.push(
          args
            .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
            .join(' ')
        );
      }
    };

    try {
      const fn = new Function('console', sandboxSource);
      fn(customConsole);
      setLogs(capturedLogs.length > 0 ? capturedLogs : ['(Executed successfully with no console.log output)']);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const lines = codeMap[selectedLanguage].split('\n');
  const highlightedLines = activeLines[selectedLanguage] || [];

  return (
    <div className="bg-slate-900/70 border border-slate-800/90 rounded-xl overflow-hidden flex flex-col h-full">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-950/90 border-b border-slate-800">
        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setMode('trace')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
              mode === 'trace'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Step-by-Step Code Trace
          </button>
          <button
            onClick={() => {
              setMode('sandbox');
              if (logs.length === 0) runSandboxCode();
            }}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
              mode === 'sandbox'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Live JS Sandbox
          </button>
        </div>

        {/* Language Tabs (when in trace mode) */}
        {mode === 'trace' ? (
          <div className="flex items-center gap-1">
            {(['typescript', 'python', 'cpp'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onSelectLanguage(lang)}
                className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-all ${
                  selectedLanguage === lang
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'typescript' ? 'TS / JS' : lang === 'python' ? 'Python' : 'C++'}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSandboxSource(liveSandboxCode)}
              className="px-2.5 py-1 rounded text-xs font-mono text-slate-400 hover:text-slate-200 border border-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
            <button
              onClick={runSandboxCode}
              className="px-3 py-1 rounded text-xs font-mono font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1 shadow"
            >
              <Play className="w-3 h-3 fill-current" /> Run Code
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      {mode === 'trace' ? (
        <div className="p-3 overflow-x-auto font-mono text-xs leading-relaxed flex-1 bg-slate-950/50">
          {lines.map((lineText, idx) => {
            const lineNumber = idx + 1;
            const isActive = highlightedLines.includes(lineNumber);
            return (
              <div
                key={lineNumber}
                className={`flex items-start px-2 py-0.5 rounded transition-colors ${
                  isActive
                    ? 'bg-indigo-500/25 border-l-2 border-indigo-400 text-indigo-100 font-semibold'
                    : 'text-slate-300 hover:bg-slate-900/50'
                }`}
              >
                <span className="w-7 shrink-0 text-right pr-3 select-none text-slate-600 text-[11px]">
                  {lineNumber}
                </span>
                <pre className="whitespace-pre overflow-x-auto">{lineText || ' '}</pre>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col flex-1 divide-y divide-slate-800">
          <textarea
            value={sandboxSource}
            onChange={(e) => setSandboxSource(e.target.value)}
            spellCheck={false}
            className="w-full h-56 p-3.5 bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed focus:outline-none resize-y"
          />
          <div className="p-3.5 bg-slate-950/90 flex-1 font-mono text-xs space-y-1.5">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Live Browser Execution Output
              </span>
              <span className="text-slate-500">Edit code above & click Run!</span>
            </div>
            {error ? (
              <div className="p-2.5 rounded bg-rose-950/50 border border-rose-500/40 text-rose-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            ) : (
              <div className="space-y-1 max-h-44 overflow-y-auto pt-1">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-emerald-300 whitespace-pre-wrap"
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
