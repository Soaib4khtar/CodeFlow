/**
 * Utilities for stripping TypeScript annotations, extracting variable identifiers,
 * and instrumenting user code with step-by-step snapshot trace callbacks.
 */

export function extractTrackedIdentifiers(code: string): string[] {
  const ids = new Set<string>();

  // 1. Function parameters: function foo(a, b)
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

export function stripTypeScriptAnnotations(code: string): string {
  return code
    .replace(/:\s*(?:number|string|boolean|any|void|unknown)\s*(\[\])?/g, '')
    .replace(/:\s*Record<[^>]+>/g, '')
    .replace(/:\s*Map<[^>]+>/g, '')
    .replace(/:\s*Set<[^>]+>/g, '')
    .replace(/:\s*list\[[^\]]+\]/g, '')
    .replace(/\s+as\s+[a-zA-Z0-9_$\[\]<>]+/g, '');
}

export function instrumentCode(cleanCode: string, trackedIds: string[]): string {
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

    if (
      !trimmed ||
      trimmed.startsWith('//') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*')
    ) {
      instrumentedLines.push(rawLine);
      continue;
    }

    // Handle single-line return statements
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

    // Handle loop headers ending with `{`
    if (/^(?:while|for)\s*\(.*\)\s*\{\s*$/.test(trimmed)) {
      instrumentedLines.push(`${rawLine} __trace(${lineNo}, () => (${snapshotExpr}));`);
      continue;
    }

    // Handle standard single-line statements ending with `;`
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
