import { PracticeProblem, TopicStep, VisualBox } from '@/types/codeflow';
import {
  extractTrackedIdentifiers,
  stripTypeScriptAnnotations,
  instrumentCode
} from './codeInstrumentor';
import { buildStepFromSnapshot } from './snapshotStepBuilder';

export interface TestCaseResult {
  label: string;
  passed: boolean;
  actual: string;
  expected: string;
}

export interface LiveExecutionResult {
  steps: TopicStep[];
  traceSummary: string;
  testResults: TestCaseResult[];
  consoleLogs: string[];
  error: string | null;
}

function cloneSnapshotValue(v: unknown): unknown {
  if (v === null || v === undefined) return v;
  if (typeof v === 'number' || typeof v === 'string' || typeof v === 'boolean') return v;
  if (Array.isArray(v)) return [...v];
  if (v instanceof Map) return Object.fromEntries(v.entries());
  if (v instanceof Set) return Array.from(v.values());
  if (typeof v === 'object') {
    try {
      return JSON.parse(JSON.stringify(v));
    } catch {
      return undefined;
    }
  }
  return undefined;
}

/**
 * Executes user code in a sandboxed Function runner, records step-by-step
 * variable/array snapshots for the visualizer, and verifies all problem test cases.
 */
export function executeAndVisualizeCode(
  userCode: string,
  problem: PracticeProblem,
  fallbackBoxes?: VisualBox[]
): LiveExecutionResult {
  const consoleLogs: string[] = [];
  const customConsole = {
    log: (...args: unknown[]) => {
      consoleLogs.push(
        args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')
      );
    }
  };

  const cleanCode = stripTypeScriptAnnotations(userCode);
  const codeLines = userCode.split('\n');
  const trackedIds = extractTrackedIdentifiers(cleanCode);

  const declaredFnMatch = cleanCode.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
  const targetFnName =
    declaredFnMatch && !cleanCode.includes(`function ${problem.functionName}`)
      ? declaredFnMatch[1]
      : problem.functionName;

  const firstTestCaseArgs =
    problem.testCases && problem.testCases.length > 0
      ? JSON.parse(JSON.stringify(problem.testCases[0].args))
      : [[1, 3, 5, 7, 9], 7];

  const fallbackArr = Array.isArray(firstTestCaseArgs[0])
    ? (firstTestCaseArgs[0] as unknown[])
    : typeof firstTestCaseArgs[0] === 'string'
    ? firstTestCaseArgs[0].split('')
    : fallbackBoxes
    ? fallbackBoxes.map((b) => b.value)
    : [1, 3, 5, 7, 9];

  const steps: TopicStep[] = [];
  let stepCounter = 1;
  let finalReturnVal: unknown = undefined;
  let hasReturned = false;

  const recordTrace = (lineNo: number, getSnap: () => Record<string, unknown>) => {
    if (steps.length >= 60) return;
    try {
      const snap = getSnap();
      const lineText = codeLines[lineNo - 1] || '';
      steps.push(
        buildStepFromSnapshot(stepCounter++, lineNo, lineText, snap, fallbackArr, false)
      );
    } catch {
      // ignore snapshot errors
    }
  };

  const recordCond = (
    lineNo: number,
    condVal: boolean,
    getSnap: () => Record<string, unknown>
  ): boolean => {
    recordTrace(lineNo, getSnap);
    return condVal;
  };

  const recordReturn = <T>(
    lineNo: number,
    retVal: T,
    getSnap: () => Record<string, unknown>
  ): T => {
    finalReturnVal = cloneSnapshotValue(retVal);
    hasReturned = true;
    if (steps.length < 65) {
      try {
        const snap = getSnap();
        const lineText = codeLines[lineNo - 1] || '';
        steps.push(
          buildStepFromSnapshot(
            stepCounter++,
            lineNo,
            lineText,
            snap,
            fallbackArr,
            true,
            finalReturnVal
          )
        );
      } catch {
        // ignore
      }
    }
    return retVal;
  };

  // 1. Run instrumented code for step-by-step visualization
  try {
    const instrumented = instrumentCode(cleanCode, trackedIds);
    const runnerFactory = new Function(
      'console',
      '__trace',
      '__traceCond',
      '__traceReturn',
      '__clone',
      '__args',
      `${instrumented}\n` +
        `if (typeof ${targetFnName} === "function") {\n` +
        `  return ${targetFnName}(...__args);\n` +
        `}\n` +
        `return undefined;`
    );

    const result = runnerFactory(
      customConsole,
      recordTrace,
      recordCond,
      recordReturn,
      cloneSnapshotValue,
      firstTestCaseArgs
    );
    if (!hasReturned && result !== undefined) {
      finalReturnVal = result;
      hasReturned = true;
    }
  } catch {
    // Fall back to direct execution below if instrumentation hits an unusual syntax pattern
  }

  // 2. Run un-instrumented code to verify syntax/runtime validity and evaluate test cases
  const testResults: TestCaseResult[] = [];
  try {
    const directFactory = new Function(
      'console',
      `${cleanCode}\nreturn typeof ${targetFnName} === "function" ? ${targetFnName} : null;`
    );
    const userFn = directFactory(customConsole);

    if (typeof userFn === 'function' && problem.testCases) {
      for (const tc of problem.testCases) {
        const clonedArgs = JSON.parse(JSON.stringify(tc.args));
        const out = userFn(...clonedArgs);
        if (!hasReturned) {
          finalReturnVal = out;
          hasReturned = true;
        }
        const actualStr = JSON.stringify(out);
        const expectedStr = JSON.stringify(tc.expected);
        testResults.push({
          label: tc.label,
          passed: actualStr === expectedStr,
          actual: actualStr ?? 'undefined',
          expected: expectedStr
        });
      }
    }
  } catch (err: unknown) {
    return {
      steps: [],
      traceSummary: 'Execution stopped due to error',
      testResults: [],
      consoleLogs,
      error: err instanceof Error ? err.message : String(err)
    };
  }

  // 3. Synthesize visual steps if valid code didn't trigger statement instrumentation
  if (steps.length === 0) {
    const nonEmptyLines = codeLines
      .map((text, idx) => ({ text: text.trim(), lineNo: idx + 1 }))
      .filter((l) => l.text.length > 0 && !l.text.startsWith('//') && !l.text.startsWith('#'));

    nonEmptyLines.slice(0, 12).forEach((lineObj, idx) => {
      steps.push(
        buildStepFromSnapshot(
          idx + 1,
          lineObj.lineNo,
          lineObj.text,
          { step: idx + 1 },
          fallbackArr,
          idx === nonEmptyLines.length - 1 && hasReturned,
          finalReturnVal
        )
      );
    });
  }

  const passedCount = testResults.filter((t) => t.passed).length;
  const traceSummary =
    testResults.length > 0
      ? `Output: ${JSON.stringify(finalReturnVal)} · Tests Passed: ${passedCount}/${testResults.length}`
      : hasReturned
      ? `Execution Complete · Returned ${JSON.stringify(finalReturnVal)}`
      : consoleLogs.length > 0
      ? `Console Output: ${consoleLogs[consoleLogs.length - 1]}`
      : 'Execution Complete (0 errors)';

  return {
    steps,
    traceSummary,
    testResults,
    consoleLogs,
    error: null
  };
}
