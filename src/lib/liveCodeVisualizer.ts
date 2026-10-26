import { PracticeProblem, TopicStep, VisualBox, VisualPointer } from '@/types/codeflow';

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

const POINTER_CANDIDATES: {
  names: string[];
  color: VisualPointer['color'];
}[] = [
  { names: ['left', 'l', 'start', 'low', 'slow', 'write', 'writeIdx', 'bottom'], color: 'green' },
  { names: ['mid', 'm', 'i', 'curr', 'read', 'top', 'idx', 'index'], color: 'blue' },
  { names: ['right', 'r', 'end', 'high', 'fast'], color: 'purple' },
  { names: ['j', 'k', 'next', 'targetIdx', 'bound'], color: 'amber' }
];

// Extract all identifier names that might be local variables or parameters in user code
function extractTrackedIdentifiers(code: string): string[] {
  const ids = new Set<string>();

  // 1. Function parameters: function foo(a, b) or (a, b) =>
  const fnParamMatches = code.matchAll(/function\s+[a-zA-Z0-9_$]*\s*\(([^)]*)\)/g);
  for (const m of fnParamMatches) {
    m[1]
      .split(',')
      .map((s) => s.trim().replace(/=.*$/, '').trim())
      .filter((s) => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(s))
      .forEach((id) => ids.add(id));
  }

  // 2. Variable declarations: let, const, var
  const declMatches = code.matchAll(/\b(?:let|const|var)\s+([^;=\n]+)/g);
  for (const m of declMatches) {
    m[1]
      .split(',')
      .map((s) => s.trim())
      .filter((s) => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(s))
      .forEach((id) => ids.add(id));
  }

  // 3. Common algorithmic variable names
  [
    'nums',
    'arr',
    'target',
    'k',
    'n',
    's',
    't',
    'height',
    'left',
    'right',
    'mid',
    'l',
    'r',
    'i',
    'j',
    'sum',
    'maxSum',
    'windowSum',
    'count',
    'best',
    'maxLen',
    'water',
    'write',
    'read',
    'writeIdx',
    'prefix',
    'suffix',
    'curr',
    'minSoFar',
    'maxDiff',
    'res',
    'stack'
  ].forEach((name) => ids.add(name));

  return Array.from(ids);
}

// Strip basic TypeScript type annotations so TS code can run in the JS VM
function stripTypeScriptAnnotations(code: string): string {
  return code
    .replace(/:\s*(?:number|string|boolean|any|void|unknown)\s*(\[\])?/g, '')
    .replace(/:\s*Record<[^>]+>/g, '')
    .replace(/:\s*Map<[^>]+>/g, '')
    .replace(/:\s*Set<[^>]+>/g, '')
    .replace(/:\s*list\[[^\]]+\]/g, '')
    .replace(/\s+as\s+[a-zA-Z0-9_$\[\]<>]+/g, '');
}

// Instrument JS code line-by-line to capture execution steps and variable snapshots
function instrumentCode(cleanCode: string, trackedIds: string[]): string {
  const snapshotExpr = `{ ${trackedIds
    .map(
      (id) =>
        `${JSON.stringify(id)}: (typeof ${id} !== "undefined" && typeof ${id} !== "function" ? __clone(${id}) : undefined)`
    )
    .join(', ')} }`;

  const lines = cleanCode.split('\n');
  const instrumentedLines: string[] = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const lineNo = idx + 1;
    const rawLine = lines[idx];
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      instrumentedLines.push(rawLine);
      continue;
    }

    // Handle single-line return statements: `return expr;` or `if (...) return expr;`
    if (/^return\b/.test(trimmed)) {
      const returnExpr = trimmed.replace(/^return\b\s*/, '').replace(/;$/, '');
      instrumentedLines.push(
        `return __traceReturn(${lineNo}, (${returnExpr || 'undefined'}), () => (${snapshotExpr}));`
      );
      continue;
    }

    if (/^if\s*\((.+)\)\s*return\s+([^;]+);?$/.test(trimmed)) {
      const m = trimmed.match(/^if\s*\((.+)\)\s*return\s+([^;]+);?$/);
      if (m) {
        instrumentedLines.push(
          `if (__traceCond(${lineNo}, (${m[1]}), () => (${snapshotExpr}))) return __traceReturn(${lineNo}, (${m[2]}), () => (${snapshotExpr}));`
        );
        continue;
      }
    }

    // Handle loop headers ending with `{`: inject a trace right at the start of the loop body
    if (/^(?:while|for)\s*\(.*\)\s*\{\s*$/.test(trimmed)) {
      instrumentedLines.push(`${rawLine} __trace(${lineNo}, () => (${snapshotExpr}));`);
      continue;
    }

    // Handle standard complete single-line statements ending with `;`
    if (
      trimmed.endsWith(';') &&
      !trimmed.startsWith('function ') &&
      !trimmed.startsWith('return ') &&
      !trimmed.includes('=>')
    ) {
      instrumentedLines.push(`${rawLine} __trace(${lineNo}, () => (${snapshotExpr}));`);
      continue;
    }

    instrumentedLines.push(rawLine);
  }

  return instrumentedLines.join('\n');
}

function buildStepFromSnapshot(
  stepNumber: number,
  lineNo: number,
  codeLineText: string,
  snapshot: Record<string, unknown>,
  fallbackArray: unknown[] | null,
  isReturnStep?: boolean,
  returnValue?: unknown
): TopicStep {
  const variables: Record<string, string | number> = {};
  let primaryArray: (string | number)[] | null = null;

  // Find primary array and scalar variables
  for (const [key, val] of Object.entries(snapshot)) {
    if (val === undefined) continue;

    if (Array.isArray(val)) {
      if (
        !primaryArray &&
        val.length > 0 &&
        val.length <= 16 &&
        val.every((item) => typeof item === 'number' || typeof item === 'string')
      ) {
        primaryArray = val as (string | number)[];
      }
      if (val.length <= 8) {
        variables[key] = `[${val.join(', ')}]`;
      } else {
        variables[key] = `Array(${val.length})`;
      }
    } else if (typeof val === 'number' || typeof val === 'boolean') {
      variables[key] = String(val);
    } else if (typeof val === 'string') {
      if (!primaryArray && val.length > 0 && val.length <= 12) {
        primaryArray = val.split('');
      }
      variables[key] = val.length <= 16 ? `"${val}"` : `"${val.slice(0, 13)}..."`;
    } else if (val && typeof val === 'object') {
      const entries = Object.entries(val as Record<string, unknown>);
      if (entries.length <= 5) {
        variables[key] = `{${entries.map(([k, v]) => `${k}:${v}`).join(', ')}}`;
      }
    }
  }

  if (!primaryArray && fallbackArray && fallbackArray.length <= 16) {
    primaryArray = fallbackArray.map((x) =>
      typeof x === 'number' || typeof x === 'string' ? x : JSON.stringify(x)
    );
  }

  if (isReturnStep) {
    variables['return'] =
      typeof returnValue === 'object' ? JSON.stringify(returnValue) : String(returnValue);
  }

  // Construct visual boxes and pointers if we have a primary array
  let boxes: VisualBox[] | undefined;
  let pointers: VisualPointer[] | undefined;

  if (primaryArray && primaryArray.length > 0) {
    const len = primaryArray.length;
    pointers = [];
    const usedLabels = new Set<string>();

    for (const group of POINTER_CANDIDATES) {
      for (const candidate of group.names) {
        const rawVal = snapshot[candidate];
        if (typeof rawVal === 'number' && Number.isInteger(rawVal) && rawVal >= 0 && rawVal < len) {
          if (!usedLabels.has(candidate)) {
            usedLabels.add(candidate);
            pointers.push({
              label: candidate,
              index: rawVal,
              color: group.color
            });
          }
        }
      }
    }

    const leftBound =
      typeof snapshot.left === 'number'
        ? snapshot.left
        : typeof snapshot.l === 'number'
        ? snapshot.l
        : undefined;
    const rightBound =
      typeof snapshot.right === 'number'
        ? snapshot.right
        : typeof snapshot.r === 'number'
        ? snapshot.r
        : undefined;
    const activeIdx =
      typeof snapshot.mid === 'number'
        ? snapshot.mid
        : typeof snapshot.i === 'number'
        ? snapshot.i
        : typeof snapshot.read === 'number'
        ? snapshot.read
        : undefined;

    boxes = primaryArray.map((val, idx) => {
      let state: VisualBox['state'] = 'default';

      if (isReturnStep) {
        if (typeof returnValue === 'number' && returnValue === idx) {
          state = 'found';
        } else if (
          Array.isArray(returnValue) &&
          returnValue.length === 2 &&
          (returnValue[0] === idx || returnValue[1] === idx)
        ) {
          state = 'found';
        } else {
          state = 'visited';
        }
      } else if (activeIdx !== undefined && idx === activeIdx) {
        state = 'active';
      } else if (
        leftBound !== undefined &&
        rightBound !== undefined &&
        (idx < leftBound || idx > rightBound)
      ) {
        state = 'discarded';
      } else if (
        leftBound !== undefined &&
        rightBound !== undefined &&
        idx >= leftBound &&
        idx <= rightBound
      ) {
        state = 'window';
      }

      return {
        index: idx,
        value: val,
        state
      };
    });
  }

  // Build concise step explanation
  const cleanStmt = codeLineText.trim();
  const varSummary = Object.entries(variables)
    .filter(([k]) => !['nums', 'arr', 'height', 's', 't'].includes(k))
    .slice(0, 4)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ');

  const explanation = isReturnStep
    ? `Line ${lineNo}: Return ${
        typeof returnValue === 'object' ? JSON.stringify(returnValue) : String(returnValue)
      }${varSummary ? `  (${varSummary})` : ''}`
    : `Line ${lineNo}: ${cleanStmt}${varSummary ? `  →  ${varSummary}` : ''}`;

  return {
    stepNumber,
    activeLine: lineNo,
    explanation,
    boxes,
    pointers,
    variables
  };
}

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

  // Detect any function name in the user's code (either problem.functionName or first declared function)
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

  const cloneVal = (v: unknown): unknown => {
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
  };

  const recordTrace = (lineNo: number, getSnap: () => Record<string, unknown>) => {
    if (steps.length >= 60) return; // Cap visual steps so UI stays snappy
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
    finalReturnVal = cloneVal(retVal);
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

  // 1. Try running instrumented code for rich step-by-step visualization
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
      cloneVal,
      firstTestCaseArgs
    );
    if (!hasReturned && result !== undefined) {
      finalReturnVal = result;
      hasReturned = true;
    }
  } catch {
    // If instrumentation hit an edge-case syntax structure, fall back to direct execution below
  }

  // 2. Run un-instrumented code to verify syntax/runtime validity and evaluate all problem test cases
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

  // 3. If user wrote valid code that didn't trigger statement instrumentation (e.g. single-line arrow or non-JS snippet), synthesize visual steps from lines
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
