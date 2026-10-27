import { TopicStep, VisualBox, VisualPointer } from '@/types/codeflow';

const POINTER_CANDIDATES: {
  names: string[];
  color: VisualPointer['color'];
}[] = [
  {
    names: ['left', 'l', 'start', 'low', 'slow', 'write', 'writeIdx', 'bottom'],
    color: 'green'
  },
  { names: ['mid', 'm', 'i', 'curr', 'read', 'top', 'idx', 'index'], color: 'blue' },
  { names: ['right', 'r', 'end', 'high', 'fast'], color: 'purple' },
  { names: ['j', 'k', 'next', 'targetIdx', 'bound'], color: 'amber' }
];

/**
 * Converts a live variable snapshot from an executed line of code into a
 * structured `TopicStep` with `VisualBox[]` and `VisualPointer[]`.
 */
export function buildStepFromSnapshot(
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
      variables[key] = val.length <= 8 ? `[${val.join(', ')}]` : `Array(${val.length})`;
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

  let boxes: VisualBox[] | undefined;
  let pointers: VisualPointer[] | undefined;

  if (primaryArray && primaryArray.length > 0) {
    const len = primaryArray.length;
    pointers = [];
    const usedLabels = new Set<string>();

    for (const group of POINTER_CANDIDATES) {
      for (const candidate of group.names) {
        const rawVal = snapshot[candidate];
        if (
          typeof rawVal === 'number' &&
          Number.isInteger(rawVal) &&
          rawVal >= 0 &&
          rawVal < len &&
          !usedLabels.has(candidate)
        ) {
          usedLabels.add(candidate);
          pointers.push({
            label: candidate,
            index: rawVal,
            color: group.color
          });
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

      return { index: idx, value: val, state };
    });
  }

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
