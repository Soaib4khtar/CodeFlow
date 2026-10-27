import React, { useState, useRef } from 'react';
import { Code2, Copy, Check, Play } from 'lucide-react';
import { PracticeProblem } from '@/types/codeflow';
import { TestCaseResult } from '@/lib/liveCodeVisualizer';
import { highlightSyntax } from './syntaxHighlighter';
import { TestResultsStrip } from './TestResultsStrip';

interface CodeEditorCardProps {
  code: string;
  onCodeChange: (newCode: string) => void;
  onRunAndVisualize: () => void;
  activeLine: number;
  darkMode: boolean;
  activeProblem?: PracticeProblem;
  executionError?: string | null;
  testResults?: TestCaseResult[] | null;
  /** Editor font size in px (user preference). */
  fontSize?: number;
}

/**
 * Interactive syntax-highlighted code editor card with synchronized line numbers
 * and active execution line highlighting.
 */
export const CodeEditorCard: React.FC<CodeEditorCardProps> = ({
  code,
  onCodeChange,
  onRunAndVisualize,
  activeLine,
  darkMode,
  activeProblem,
  executionError,
  testResults,
  fontSize = 12.5
}) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLDivElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget;
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const nextCode = code.substring(0, start) + '  ' + code.substring(end);
      onCodeChange(nextCode);
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  };

  const lines = code.split('\n');

  return (
    <div
      id="main-code-editor-card"
      className={`rounded-xl border p-4 flex flex-col justify-between transition-colors ${
        darkMode
          ? 'bg-slate-900 border-slate-800'
          : 'bg-[#FAF8F5] border-[#E6E0D4] shadow-[0_1px_3px_rgba(40,30,20,0.04)]'
      }`}
    >
      <div>
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <Code2
              className={`w-4 h-4 shrink-0 ${
                darkMode ? 'text-amber-400' : 'text-[#2563EB]'
              }`}
            />
            <h2
              className={`text-[13.5px] font-bold truncate ${
                darkMode ? 'text-slate-100' : 'text-[#1E293B]'
              }`}
            >
              Main Code
            </h2>
            {activeProblem && (
              <span
                className={`px-2 py-0.5 rounded-md text-[10.5px] font-semibold border truncate max-w-[230px] sm:max-w-[280px] ${
                  darkMode
                    ? 'bg-amber-950/60 border-amber-700/60 text-amber-300'
                    : 'bg-[#F2EEE5] border-[#E0D9CB] text-slate-800'
                }`}
                title={`Active Problem: #${activeProblem.number}. ${activeProblem.title}`}
              >
                #{activeProblem.number}. {activeProblem.title}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRunAndVisualize}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#16A34A] hover:bg-[#15803D] text-white flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
              title="Execute code in the editor, run test cases, and visualize step-by-step"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run & Visualize</span>
            </button>

            <button
              onClick={handleCopy}
              title="Copy code"
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                darkMode
                  ? 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  : 'border-[#E2DCD0] bg-[#FAF8F5] text-slate-500 hover:bg-[#EAE4D8] hover:text-slate-700'
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

        {/* Live Syntax-Highlighted Editable Code Window */}
        <div
          style={{ fontSize }}
          className="bg-[#0D1117] rounded-xl py-3 px-1 font-mono border border-slate-800/80 shadow-inner min-h-[350px] flex overflow-hidden"
        >
          {/* Synchronized Line Numbers Gutter */}
          <div
            ref={gutterRef}
            className="select-none pr-3 pl-2.5 text-right text-slate-500 leading-[1.68] border-r border-slate-800/80 shrink-0 overflow-hidden"
          >
            {lines.map((_, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = lineNum === activeLine;
              return (
                <div
                  key={lineNum}
                  className={`h-[1.68em] flex items-center justify-end ${
                    isHighlighted
                      ? darkMode
                        ? 'text-amber-400 font-bold'
                        : 'text-blue-400 font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  {lineNum}
                </div>
              );
            })}
          </div>

          {/* Code Typing & Highlight Stage */}
          <div className="relative flex-1 min-w-0 overflow-hidden">
            {/* Background Syntax Highlighting Layer */}
            <div
              ref={preRef}
              aria-hidden="true"
              className="absolute inset-0 px-3 pointer-events-none select-none overflow-hidden whitespace-pre font-mono leading-[1.68]"
            >
              {lines.map((line, idx) => {
                const lineNum = idx + 1;
                const isHighlighted = lineNum === activeLine;
                return (
                  <div
                    key={lineNum}
                    className={`h-[1.68em] flex items-center whitespace-pre ${
                      isHighlighted
                        ? darkMode
                          ? 'bg-amber-500/20 -mx-3 px-3 rounded-xs border-l-2 border-amber-400'
                          : 'bg-blue-500/25 -mx-3 px-3 rounded-xs border-l-2 border-blue-400'
                        : ''
                    }`}
                  >
                    {highlightSyntax(line)}
                  </div>
                );
              })}
            </div>

            {/* Foreground Live Transparent Input Layer */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              onScroll={handleScroll}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              wrap="off"
              placeholder="Write your code here..."
              className={`relative z-10 w-full h-full min-h-[330px] bg-transparent text-transparent font-mono leading-[1.68] px-3 focus:outline-none resize-none overflow-auto whitespace-pre selection:bg-blue-500/30 selection:text-transparent ${
                darkMode ? 'caret-amber-400' : 'caret-blue-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Execution Error Banner or Test Case Verification Strip */}
      <TestResultsStrip executionError={executionError} testResults={testResults} />
    </div>
  );
};
