import React, { useState, useEffect } from 'react';
import { Code2, Copy, Check, Play, Edit3, Eye } from 'lucide-react';

interface CodeEditorCardProps {
  code: string;
  activeLine: number;
  darkMode: boolean;
  onCustomCodeChange?: (newCode: string) => void;
}

// Lightweight syntax tokenizer to match the dark editor styling in the reference image
function highlightSyntax(line: string): React.ReactNode {
  if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
    return <span className="text-slate-500 italic">{line}</span>;
  }

  const tokens = line.split(
    /(\b(?:function|let|const|while|for|if|else|return|async|await|def|class|int|bool|void|auto|true|false|null|None|nullptr)\b|\b\d+\b|"[^"]*"|'[^']*'|\b(?:Math|floor|console|log|binarySearch|arr|left|right|mid|target)\b)/g
  );

  const keywords = new Set([
    'function',
    'let',
    'const',
    'while',
    'for',
    'if',
    'else',
    'return',
    'async',
    'await',
    'def',
    'class',
    'int',
    'bool',
    'void',
    'auto'
  ]);

  const builtins = new Set(['Math', 'floor', 'console', 'log', 'binarySearch']);
  const literals = new Set(['true', 'false', 'null', 'None', 'nullptr']);

  return tokens.map((tok, i) => {
    if (!tok) return null;
    if (keywords.has(tok)) {
      return (
        <span key={i} className="text-[#C084FC] font-medium">
          {tok}
        </span>
      );
    }
    if (builtins.has(tok)) {
      return (
        <span key={i} className="text-[#60A5FA]">
          {tok}
        </span>
      );
    }
    if (literals.has(tok) || /^\d+$/.test(tok)) {
      return (
        <span key={i} className="text-[#FBBF24]">
          {tok}
        </span>
      );
    }
    if ((tok.startsWith('"') && tok.endsWith('"')) || (tok.startsWith("'") && tok.endsWith("'"))) {
      return (
        <span key={i} className="text-[#34D399]">
          {tok}
        </span>
      );
    }
    return <span key={i}>{tok}</span>;
  });
}

export const CodeEditorCard: React.FC<CodeEditorCardProps> = ({
  code,
  activeLine,
  darkMode
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableCode, setEditableCode] = useState(code);
  const [liveOutput, setLiveOutput] = useState<string | null>(null);

  useEffect(() => {
    setEditableCode(code);
    setLiveOutput(null);
    setIsEditing(false);
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleRunLive = () => {
    const logs: string[] = [];
    const customConsole = {
      log: (...args: unknown[]) =>
        logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '))
    };
    try {
      const fn = new Function('console', editableCode);
      fn(customConsole);
      setLiveOutput(logs.length > 0 ? logs.join('\n') : 'Executed successfully (no console output)');
    } catch (e: unknown) {
      setLiveOutput(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const lines = editableCode.split('\n');

  return (
    <div
      className={`rounded-xl border p-4 flex flex-col justify-between transition-colors ${
        darkMode
          ? 'bg-slate-900 border-slate-800'
          : 'bg-white border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.03)]'
      }`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#2563EB]" />
            <h2
              className={`text-[13.5px] font-bold ${
                darkMode ? 'text-slate-100' : 'text-[#1E293B]'
              }`}
            >
              Main Code
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1 transition-colors ${
                isEditing
                  ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300'
                  : darkMode
                  ? 'border-slate-700 text-slate-400 hover:text-slate-200'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
              title="Toggle Live Code Editor"
            >
              {isEditing ? (
                <>
                  <Eye className="w-3 h-3" /> Trace View
                </>
              ) : (
                <>
                  <Edit3 className="w-3 h-3" /> Edit
                </>
              )}
            </button>

            {isEditing && (
              <button
                onClick={handleRunLive}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-2xs"
              >
                <Play className="w-3 h-3 fill-current" /> Execute
              </button>
            )}

            <button
              onClick={handleCopy}
              title="Copy code"
              className={`p-1.5 rounded-md transition-colors ${
                darkMode
                  ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Dark Code Window */}
        <div className="bg-[#0F172A] rounded-xl py-3.5 px-2 font-mono text-[12px] leading-[1.68] text-slate-200 overflow-x-auto border border-slate-800/80 shadow-inner min-h-[340px]">
          {isEditing ? (
            <textarea
              value={editableCode}
              onChange={(e) => setEditableCode(e.target.value)}
              spellCheck={false}
              className="w-full h-[325px] bg-transparent text-slate-100 font-mono text-[12px] leading-[1.68] px-3 focus:outline-none resize-none"
            />
          ) : (
            lines.map((line, index) => {
              const lineNum = index + 1;
              const isHighlighted = lineNum === activeLine;
              return (
                <div
                  key={lineNum}
                  className={`flex items-center px-2 rounded-sm transition-colors ${
                    isHighlighted
                      ? 'bg-[#1D4ED8]/35 border-l-2 border-[#60A5FA] text-white'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <span
                    className={`w-6 shrink-0 text-right pr-3 select-none text-[11px] ${
                      isHighlighted ? 'text-blue-300 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {lineNum}
                  </span>
                  <pre className="whitespace-pre">{highlightSyntax(line)}</pre>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Optional Console Output when user runs edited code */}
      {liveOutput && (
        <div className="mt-2.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11.5px] text-emerald-400 flex items-center justify-between">
          <span>Output: {liveOutput}</span>
          <button
            onClick={() => setLiveOutput(null)}
            className="text-[10px] text-slate-400 hover:text-slate-200"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
