import { TopicStep } from '../types/codeflow';

export interface CustomRunResult {
  steps: TopicStep[];
  traceSummary: string;
}

export function generateCustomSteps(
  topicId: string,
  rawArrayInput: string,
  rawTargetInput: string
): CustomRunResult | null {
  const nums = rawArrayInput
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n));

  if (nums.length === 0) return null;
  const target = Number(rawTargetInput.trim());
  const safeTarget = Number.isNaN(target) ? 7 : target;

  // 1. Dynamic Binary Search Step Generator
  if (topicId === 'binary-search') {
    const sorted = [...nums].sort((a, b) => a - b);
    const steps: TopicStep[] = [];
    let left = 0;
    let right = sorted.length - 1;
    let stepNum = 1;

    steps.push({
      stepNumber: stepNum++,
      activeLine: 2,
      explanation: `Initialize left = 0, right = ${right} on sorted array [${sorted.join(', ')}]`,
      boxes: sorted.map((val, idx) => ({ index: idx, value: val })),
      pointers: [
        { label: 'left', index: left, color: 'green' },
        { label: 'right', index: right, color: 'purple' }
      ],
      variables: { left, right, target: safeTarget }
    });

    let foundIdx = -1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midVal = sorted[mid];

      steps.push({
        stepNumber: stepNum++,
        activeLine: 6,
        explanation: `mid = Math.floor((${left} + ${right}) / 2) → ${mid}   (value = ${midVal})`,
        boxes: sorted.map((val, idx) => ({
          index: idx,
          value: val,
          state:
            idx === mid
              ? 'active'
              : idx < left || idx > right
              ? 'discarded'
              : 'default'
        })),
        pointers: [
          { label: 'left', index: left, color: 'green' },
          { label: 'mid', index: mid, color: 'blue' },
          { label: 'right', index: right, color: 'purple' }
        ],
        variables: { left, mid, right, 'arr[mid]': midVal, target: safeTarget }
      });

      if (midVal === safeTarget) {
        foundIdx = mid;
        steps.push({
          stepNumber: stepNum++,
          activeLine: 8,
          explanation: `Compare ${safeTarget} with ${midVal} → Match found at index ${mid}!`,
          boxes: sorted.map((val, idx) => ({
            index: idx,
            value: val,
            state: idx === mid ? 'found' : 'discarded'
          })),
          pointers: [{ label: 'found', index: mid, color: 'blue' }],
          variables: { left, mid, right, returnIndex: mid }
        });
        break;
      } else if (midVal < safeTarget) {
        steps.push({
          stepNumber: stepNum++,
          activeLine: 12,
          explanation: `Compare ${safeTarget} with ${midVal} → ${safeTarget} > ${midVal}, so move left = ${mid + 1}`,
          boxes: sorted.map((val, idx) => ({
            index: idx,
            value: val,
            state: idx <= mid ? 'discarded' : idx <= right ? 'window' : 'discarded'
          })),
          pointers: [
            { label: 'left', index: Math.min(sorted.length - 1, mid + 1), color: 'green' },
            { label: 'right', index: right, color: 'purple' }
          ],
          variables: { left: mid + 1, right, target: safeTarget }
        });
        left = mid + 1;
      } else {
        steps.push({
          stepNumber: stepNum++,
          activeLine: 14,
          explanation: `Compare ${safeTarget} with ${midVal} → ${safeTarget} < ${midVal}, so move right = ${mid - 1}`,
          boxes: sorted.map((val, idx) => ({
            index: idx,
            value: val,
            state: idx >= mid ? 'discarded' : idx >= left ? 'window' : 'discarded'
          })),
          pointers: [
            { label: 'left', index: left, color: 'green' },
            { label: 'right', index: Math.max(0, mid - 1), color: 'purple' }
          ],
          variables: { left, right: mid - 1, target: safeTarget }
        });
        right = mid - 1;
      }
    }

    if (foundIdx === -1) {
      steps.push({
        stepNumber: stepNum++,
        activeLine: 18,
        explanation: `left (${left}) > right (${right}) → Target ${safeTarget} not in array, return -1`,
        boxes: sorted.map((val, idx) => ({ index: idx, value: val, state: 'discarded' })),
        pointers: [],
        variables: { returnIndex: -1 }
      });
    }

    return {
      steps,
      traceSummary:
        foundIdx !== -1
          ? `Found in index ${foundIdx}`
          : `Target ${safeTarget} not found (returned -1)`
    };
  }

  // 2. Dynamic Two Pointers (Sorted Pair Sum)
  if (topicId === 'two-pointers') {
    const sorted = [...nums].sort((a, b) => a - b);
    const steps: TopicStep[] = [];
    let left = 0;
    let right = sorted.length - 1;
    let stepNum = 1;
    let matched: [number, number] | null = null;

    while (left < right) {
      const sum = sorted[left] + sorted[right];
      if (sum === safeTarget) {
        matched = [left, right];
        steps.push({
          stepNumber: stepNum++,
          activeLine: 7,
          explanation: `arr[${left}] (${sorted[left]}) + arr[${right}] (${sorted[right]}) = ${sum} === ${safeTarget} → Match!`,
          boxes: sorted.map((v, i) => ({
            index: i,
            value: v,
            state: i === left || i === right ? 'found' : 'default'
          })),
          pointers: [
            { label: 'left', index: left, color: 'green' },
            { label: 'right', index: right, color: 'blue' }
          ],
          variables: { left, right, sum, target: safeTarget }
        });
        break;
      }
      steps.push({
        stepNumber: stepNum++,
        activeLine: 6,
        explanation: `arr[${left}] (${sorted[left]}) + arr[${right}] (${sorted[right]}) = ${sum} ${
          sum < safeTarget ? `< ${safeTarget} → increment left` : `> ${safeTarget} → decrement right`
        }`,
        boxes: sorted.map((v, i) => ({
          index: i,
          value: v,
          state: i === left || i === right ? 'active' : 'default'
        })),
        pointers: [
          { label: 'left', index: left, color: 'green' },
          { label: 'right', index: right, color: 'purple' }
        ],
        variables: { left, right, sum, target: safeTarget }
      });
      if (sum < safeTarget) left++;
      else right--;
    }

    return {
      steps:
        steps.length > 0
          ? steps
          : [
              {
                stepNumber: 1,
                activeLine: 11,
                explanation: 'No pair found',
                boxes: sorted.map((v, i) => ({ index: i, value: v }))
              }
            ],
      traceSummary: matched
        ? `Found pair at indices [${matched[0]}, ${matched[1]}]`
        : `No pair sums to ${safeTarget}`
    };
  }

  // 3. Dynamic Hash Table (Two Sum)
  if (topicId === 'hash-tables') {
    const steps: TopicStep[] = [];
    const seen = new Map<number, number>();
    let foundPair: [number, number] | null = null;

    for (let i = 0; i < nums.length; i++) {
      const need = safeTarget - nums[i];
      if (seen.has(need)) {
        const prevIdx = seen.get(need)!;
        foundPair = [prevIdx, i];
        steps.push({
          stepNumber: i + 1,
          activeLine: 7,
          explanation: `i = ${i} (val = ${nums[i]}): need = ${safeTarget} - ${nums[i]} = ${need} → Found in Map at index ${prevIdx}!`,
          boxes: nums.map((v, idx) => ({
            index: idx,
            value: v,
            state: idx === prevIdx || idx === i ? 'found' : idx < i ? 'visited' : 'default'
          })),
          pointers: [
            { label: 'match', index: prevIdx, color: 'green' },
            { label: 'i', index: i, color: 'blue' }
          ],
          variables: { i, current: nums[i], need, result: `[${prevIdx}, ${i}]` }
        });
        break;
      } else {
        seen.set(nums[i], i);
        steps.push({
          stepNumber: i + 1,
          activeLine: 9,
          explanation: `i = ${i} (val = ${nums[i]}): need = ${need} (not in Map) → store seen.set(${nums[i]}, ${i})`,
          boxes: nums.map((v, idx) => ({
            index: idx,
            value: v,
            state: idx === i ? 'active' : idx < i ? 'visited' : 'default',
            subText: idx <= i ? `idx:${idx}` : undefined
          })),
          pointers: [{ label: 'i', index: i, color: 'blue' }],
          variables: { i, current: nums[i], need }
        });
      }
    }

    return {
      steps,
      traceSummary: foundPair
        ? `Found Two Sum indices [${foundPair[0]}, ${foundPair[1]}]`
        : `No pair found summing to ${safeTarget}`
    };
  }

  // 4. Generic Custom Array Walkthrough (Linear Scan / Sliding Window / Sorting)
  const steps: TopicStep[] = nums.map((val, idx) => ({
    stepNumber: idx + 1,
    activeLine: 3,
    explanation: `Inspect index ${idx} (value = ${val}) against parameter ${safeTarget}`,
    boxes: nums.map((v, j) => ({
      index: j,
      value: v,
      state:
        j === idx
          ? v === safeTarget
            ? 'found'
            : 'active'
          : j < idx
          ? 'visited'
          : 'default'
    })),
    pointers: [
      { label: 'left', index: 0, color: 'green' },
      { label: 'curr', index: idx, color: 'blue' },
      { label: 'right', index: nums.length - 1, color: 'purple' }
    ],
    variables: { index: idx, value: val, parameter: safeTarget }
  }));

  return {
    steps,
    traceSummary: `Processed ${nums.length} custom elements`
  };
}
