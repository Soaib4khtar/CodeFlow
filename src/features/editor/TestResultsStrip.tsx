import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { TestCaseResult } from '@/lib/liveCodeVisualizer';

interface TestResultsStripProps {
  executionError?: string | null;
  testResults?: TestCaseResult[] | null;
}

/**
 * Displays runtime syntax/execution errors or the compact test case pass/fail strip
 * at the bottom of the Main Code Editor card.
 */
export const TestResultsStrip: React.FC<TestResultsStripProps> = ({
  executionError,
  testResults
}) => {
  if (executionError) {
    return (
      <div className="mt-2.5 px-3 py-2 rounded-lg bg-rose-950/90 border border-rose-800 font-mono text-[11.5px] text-rose-200 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
        <span className="truncate">Error: {executionError}</span>
      </div>
    );
  }

  if (!testResults || testResults.length === 0) {
    return null;
  }

  const passedCount = testResults.filter((t) => t.passed).length;

  return (
    <div className="mt-2.5 p-2.5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-1.5">
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="text-slate-300">
          Test Cases ({passedCount}/{testResults.length} Passed)
        </span>
        {passedCount === testResults.length ? (
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Tests Passed!
          </span>
        ) : (
          <span className="text-amber-400">
            {testResults.length - passedCount} test(s) failed
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
        {testResults.map((tr, i) => (
          <div
            key={i}
            className={`px-2 py-1 rounded border text-[10.5px] font-mono truncate ${
              tr.passed
                ? 'bg-emerald-950/40 border-emerald-800/70 text-emerald-300'
                : 'bg-rose-950/40 border-rose-800/70 text-rose-300'
            }`}
            title={`${tr.label} -> Output: ${tr.actual} (Expected: ${tr.expected})`}
          >
            <div className="flex items-center gap-1 font-bold">
              {tr.passed ? (
                <CheckCircle2 className="w-3 h-3 shrink-0" />
              ) : (
                <XCircle className="w-3 h-3 shrink-0" />
              )}
              <span className="truncate">
                Case {i + 1}: {tr.actual}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
