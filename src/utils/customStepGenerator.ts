import { TopicStep, VisualTreeNode } from '../types/codeflow';

export interface CustomRunResult {
  steps: TopicStep[];
  traceSummary: string;
}

export function getCustomInputMeta(topicId: string): {
  arrayLabel: string;
  targetLabel: string;
  defaultArray: string;
  defaultTarget: string;
  presets: { label: string; arr: string; target: string }[];
} {
  if (topicId === 'sorting-algorithms' || topicId === 'divide-and-conquer') {
    return {
      arrayLabel: 'Unsorted Array:',
      targetLabel: 'Highlight Value:',
      defaultArray: '14, 5, 9, 2, 11, 7',
      defaultTarget: '9',
      presets: [
        { label: 'Random 6', arr: '14, 5, 9, 2, 11, 7', target: '9' },
        { label: 'Reverse Sorted', arr: '20, 15, 12, 8, 4, 1', target: '8' },
        { label: 'Nearly Sorted', arr: '2, 5, 4, 8, 12, 10', target: '10' }
      ]
    };
  }

  if (topicId === 'sliding-window' || topicId === 'prefix-sums') {
    return {
      arrayLabel: 'Array Elements:',
      targetLabel: 'Window Size (k):',
      defaultArray: '2, 1, 5, 1, 3, 2, 6',
      defaultTarget: '3',
      presets: [
        { label: 'Max Sum (k=3)', arr: '2, 1, 5, 1, 3, 2, 6', target: '3' },
        { label: 'Window k=2', arr: '4, 8, 1, 9, 3, 7', target: '2' },
        { label: 'Window k=4', arr: '1, 4, 2, 10, 2, 3, 1, 0, 20', target: '4' }
      ]
    };
  }

  if (
    topicId === 'stacks-queues' ||
    topicId === 'stacks-and-queues' ||
    topicId === 'monotonic-stacks-queues' ||
    topicId === 'monotonic-stack-queue' ||
    topicId === 'linked-lists'
  ) {
    return {
      arrayLabel: 'Stream Values:',
      targetLabel: 'Search / Threshold:',
      defaultArray: '4, 2, 6, 1, 8, 5',
      defaultTarget: '6',
      presets: [
        { label: 'Next Greater [4,2,6,1,8,5]', arr: '4, 2, 6, 1, 8, 5', target: '6' },
        { label: 'Increasing [1,3,5,7,9]', arr: '1, 3, 5, 7, 9', target: '7' },
        { label: 'Decreasing [9,7,5,3,1]', arr: '9, 7, 5, 3, 1', target: '5' }
      ]
    };
  }

  if (
    topicId === 'binary-search-trees' ||
    topicId === 'trees' ||
    topicId === 'trees-and-traversal' ||
    topicId === 'heaps' ||
    topicId === 'heaps-priority-queue' ||
    topicId === 'tries' ||
    topicId === 'segment-fenwick-trees'
  ) {
    return {
      arrayLabel: 'Tree Node Keys:',
      targetLabel: 'Search / Insert Key:',
      defaultArray: '15, 8, 22, 4, 12, 18, 26',
      defaultTarget: '12',
      presets: [
        { label: 'Balanced BST (find 12)', arr: '15, 8, 22, 4, 12, 18, 26', target: '12' },
        { label: 'Search Right (find 26)', arr: '15, 8, 22, 4, 12, 18, 26', target: '26' },
        { label: 'Unfound Key (find 19)', arr: '15, 8, 22, 4, 12, 18, 26', target: '19' }
      ]
    };
  }

  return {
    arrayLabel: 'Array Values:',
    targetLabel: 'Target / Param:',
    defaultArray: '1, 3, 5, 7, 9, 11, 15',
    defaultTarget: '11',
    presets: [
      { label: 'Sorted [1..15] (find 11)', arr: '1, 3, 5, 7, 9, 11, 15', target: '11' },
      { label: 'Two Sum [2, 7, 11, 15]', arr: '2, 7, 11, 15', target: '9' },
      { label: 'Not Found Target', arr: '2, 4, 8, 16, 32, 64', target: '15' }
    ]
  };
}

export function generateCustomSteps(
  topicId: string,
  rawArrayInput: string,
  rawTargetInput: string
): CustomRunResult | null {
  const nums = rawArrayInput
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n))
    .slice(0, 10); // Keep visual stage crisp

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

  // 4. Dynamic Sorting Animator (Sorting Algorithms & Divide and Conquer)
  if (topicId === 'sorting-algorithms' || topicId === 'divide-and-conquer') {
    const arr = [...nums];
    const steps: TopicStep[] = [];
    let stepNum = 1;
    let swapCount = 0;

    steps.push({
      stepNumber: stepNum++,
      activeLine: 1,
      explanation: `Initial unsorted array: [${arr.join(', ')}]`,
      boxes: arr.map((v, i) => ({ index: i, value: v })),
      pointers: [
        { label: 'start', index: 0, color: 'green' },
        { label: 'end', index: arr.length - 1, color: 'purple' }
      ],
      variables: { length: arr.length, swaps: 0 }
    });

    for (let i = 0; i < arr.length - 1; i++) {
      let swappedInPass = false;
      for (let j = 0; j < arr.length - 1 - i; j++) {
        const leftVal = arr[j];
        const rightVal = arr[j + 1];
        const willSwap = leftVal > rightVal;

        if (willSwap) {
          arr[j] = rightVal;
          arr[j + 1] = leftVal;
          swapCount++;
          swappedInPass = true;
        }

        // Keep step count manageable (cap at 14 steps)
        if (steps.length < 13) {
          steps.push({
            stepNumber: stepNum++,
            activeLine: willSwap ? 6 : 4,
            explanation: willSwap
              ? `Compare ${leftVal} > ${rightVal} at [${j}, ${j + 1}] → Swap! Array is now [${arr.join(', ')}]`
              : `Compare ${leftVal} <= ${rightVal} at [${j}, ${j + 1}] → Already in order`,
            boxes: arr.map((v, idx) => ({
              index: idx,
              value: v,
              state:
                idx === j || idx === j + 1
                  ? 'active'
                  : idx >= arr.length - i
                  ? 'found'
                  : 'default'
            })),
            pointers: [
              { label: 'j', index: j, color: 'blue' },
              { label: 'j+1', index: j + 1, color: 'amber' }
            ],
            variables: { pass: i + 1, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1], swaps: swapCount }
          });
        }
      }
      if (!swappedInPass) break;
    }

    steps.push({
      stepNumber: stepNum++,
      activeLine: 10,
      explanation: `Sorting complete! Final sorted array: [${arr.join(', ')}] (${swapCount} swaps)`,
      boxes: arr.map((v, idx) => ({
        index: idx,
        value: v,
        state: 'found'
      })),
      pointers: [{ label: 'sorted', index: 0, color: 'green' }],
      variables: { swaps: swapCount, status: 'Sorted' }
    });

    return {
      steps,
      traceSummary: `Sorted [${arr.join(', ')}] in ${swapCount} swaps`
    };
  }

  // 5. Dynamic Sliding Window & Prefix Sums Animator
  if (topicId === 'sliding-window' || topicId === 'prefix-sums') {
    const k = Math.max(1, Math.min(nums.length, Math.floor(safeTarget) || 3));
    const steps: TopicStep[] = [];
    let stepNum = 1;

    let windowSum = 0;
    for (let i = 0; i < k; i++) windowSum += nums[i];
    let maxSum = windowSum;
    let bestStart = 0;

    steps.push({
      stepNumber: stepNum++,
      activeLine: 3,
      explanation: `Initialize first window [0..${k - 1}] of size k = ${k} → windowSum = ${windowSum}`,
      boxes: nums.map((v, idx) => ({
        index: idx,
        value: v,
        state: idx < k ? 'window' : 'default',
        subText: idx < k ? 'in win' : undefined
      })),
      pointers: [
        { label: 'left', index: 0, color: 'green' },
        { label: 'right', index: k - 1, color: 'blue' }
      ],
      variables: { k, left: 0, right: k - 1, windowSum, maxSum }
    });

    for (let right = k; right < nums.length; right++) {
      const left = right - k + 1;
      const leaving = nums[right - k];
      const entering = nums[right];
      windowSum = windowSum - leaving + entering;
      if (windowSum > maxSum) {
        maxSum = windowSum;
        bestStart = left;
      }

      steps.push({
        stepNumber: stepNum++,
        activeLine: 6,
        explanation: `Slide window to [${left}..${right}]: subtract arr[${right - k}] (${leaving}), add arr[${right}] (${entering}) → windowSum = ${windowSum}, maxSum = ${maxSum}`,
        boxes: nums.map((v, idx) => ({
          index: idx,
          value: v,
          state:
            idx === right
              ? 'active'
              : idx >= left && idx <= right
              ? 'window'
              : 'discarded',
          subText: idx >= left && idx <= right ? 'win' : undefined
        })),
        pointers: [
          { label: 'left', index: left, color: 'green' },
          { label: 'right', index: right, color: 'blue' }
        ],
        variables: { k, left, right, leaving, entering, windowSum, maxSum }
      });
    }

    steps.push({
      stepNumber: stepNum++,
      activeLine: 9,
      explanation: `Maximum sum subarray of size k = ${k} is [${nums
        .slice(bestStart, bestStart + k)
        .join(', ')}] at indices [${bestStart}..${bestStart + k - 1}] with sum = ${maxSum}`,
      boxes: nums.map((v, idx) => ({
        index: idx,
        value: v,
        state: idx >= bestStart && idx < bestStart + k ? 'found' : 'discarded'
      })),
      pointers: [
        { label: 'bestL', index: bestStart, color: 'green' },
        { label: 'bestR', index: bestStart + k - 1, color: 'blue' }
      ],
      variables: { k, maxSum, bestRange: `[${bestStart}..${bestStart + k - 1}]` }
    });

    return {
      steps,
      traceSummary: `Max window sum (k=${k}) is ${maxSum} at [${bestStart}..${bestStart + k - 1}]`
    };
  }

  // 6. Dynamic Stack / Monotonic Stack / Queue Animator
  if (
    topicId === 'stacks-queues' ||
    topicId === 'stacks-and-queues' ||
    topicId === 'monotonic-stacks-queues' ||
    topicId === 'monotonic-stack-queue' ||
    topicId === 'linked-lists'
  ) {
    const steps: TopicStep[] = [];
    const stack: number[] = [];
    let stepNum = 1;

    for (let i = 0; i < nums.length; i++) {
      const val = nums[i];
      const popped: number[] = [];
      if (
        topicId === 'monotonic-stacks-queues' ||
        topicId === 'monotonic-stack-queue'
      ) {
        while (stack.length > 0 && stack[stack.length - 1] < val) {
          popped.push(stack.pop()!);
        }
      }
      stack.push(val);

      steps.push({
        stepNumber: stepNum++,
        activeLine: popped.length > 0 ? 5 : 7,
        explanation:
          popped.length > 0
            ? `Inspect ${val}: pop smaller [${popped.join(', ')}] to preserve monotonic order, then push(${val}). Stack: [${stack.join(', ')}]`
            : `Push ${val} onto structure. Active elements: [${stack.join(', ')}]`,
        boxes: nums.map((v, idx) => ({
          index: idx,
          value: v,
          state:
            idx === i
              ? v === safeTarget
                ? 'found'
                : 'active'
              : stack.includes(v) && idx < i
              ? 'window'
              : idx < i
              ? 'discarded'
              : 'default',
          subText: idx === i ? 'top' : stack.includes(v) && idx < i ? 'in stack' : undefined
        })),
        pointers: [
          { label: 'bottom', index: 0, color: 'green' },
          { label: 'top', index: i, color: 'blue' }
        ],
        variables: {
          current: val,
          stackSize: stack.length,
          stackTop: stack[stack.length - 1],
          stack: `[${stack.join(', ')}]`
        }
      });
    }

    return {
      steps,
      traceSummary: `Final Stack state: [${stack.join(', ')}] (top = ${stack[stack.length - 1]})`
    };
  }

  // 7. Dynamic Binary Search Tree (BST) Builder & Search Animator
  if (
    topicId === 'binary-search-trees' ||
    topicId === 'trees' ||
    topicId === 'trees-and-traversal' ||
    topicId === 'heaps' ||
    topicId === 'heaps-priority-queue' ||
    topicId === 'tries' ||
    topicId === 'segment-fenwick-trees'
  ) {
    interface BSTInternal {
      id: string;
      val: number;
      x: number;
      y: number;
      left?: BSTInternal;
      right?: BSTInternal;
    }

    const uniqueNums = Array.from(new Set(nums)).slice(0, 7);
    let root: BSTInternal | undefined;

    const insertNode = (
      node: BSTInternal | undefined,
      val: number,
      depth: number,
      x: number,
      spread: number
    ): BSTInternal => {
      if (!node) {
        return {
          id: `n-${val}`,
          val,
          x: Math.max(10, Math.min(90, x)),
          y: 18 + depth * 32
        };
      }
      if (val < node.val) {
        node.left = insertNode(node.left, val, depth + 1, x - spread, spread * 0.55);
      } else if (val > node.val) {
        node.right = insertNode(node.right, val, depth + 1, x + spread, spread * 0.55);
      }
      return node;
    };

    uniqueNums.forEach((v) => {
      root = insertNode(root, v, 0, 50, 24);
    });

    const serializeTree = (
      activeId: string | null,
      foundId: string | null,
      noteMap: Record<string, string>
    ): VisualTreeNode[] => {
      const list: VisualTreeNode[] = [];
      const dfs = (n?: BSTInternal) => {
        if (!n) return;
        list.push({
          id: n.id,
          label: String(n.val),
          x: n.x,
          y: n.y,
          leftId: n.left?.id,
          rightId: n.right?.id,
          state: n.id === foundId ? 'found' : n.id === activeId ? 'active' : 'default',
          note: noteMap[n.id]
        });
        dfs(n.left);
        dfs(n.right);
      };
      dfs(root);
      return list;
    };

    const steps: TopicStep[] = [];
    let stepNum = 1;

    steps.push({
      stepNumber: stepNum++,
      activeLine: 1,
      explanation: `Constructed BST from keys [${uniqueNums.join(', ')}]. Now searching for target ${safeTarget} starting at root (${root?.val}).`,
      treeNodes: serializeTree(root?.id || null, null, root ? { [root.id]: 'root' } : {}),
      variables: { root: root?.val ?? 'null', target: safeTarget, depth: 0 }
    });

    let curr = root;
    let depth = 0;
    let found = false;

    while (curr) {
      if (curr.val === safeTarget) {
        found = true;
        steps.push({
          stepNumber: stepNum++,
          activeLine: 4,
          explanation: `Node ${curr.val} === target ${safeTarget} at depth ${depth} → Target found in BST!`,
          treeNodes: serializeTree(null, curr.id, { [curr.id]: `Found (${safeTarget})` }),
          variables: { currentNode: curr.val, target: safeTarget, depth, status: 'FOUND' }
        });
        break;
      } else if (safeTarget < curr.val) {
        const nextNode = curr.left;
        steps.push({
          stepNumber: stepNum++,
          activeLine: 6,
          explanation: `target (${safeTarget}) < node (${curr.val}) → Traverse left subtree ${
            nextNode ? `to node ${nextNode.val}` : '(null leaf)'
          }`,
          treeNodes: serializeTree(curr.id, null, { [curr.id]: `${safeTarget} < ${curr.val} (go L)` }),
          variables: { currentNode: curr.val, target: safeTarget, branch: 'left', depth }
        });
        curr = nextNode;
      } else {
        const nextNode = curr.right;
        steps.push({
          stepNumber: stepNum++,
          activeLine: 8,
          explanation: `target (${safeTarget}) > node (${curr.val}) → Traverse right subtree ${
            nextNode ? `to node ${nextNode.val}` : '(null leaf)'
          }`,
          treeNodes: serializeTree(curr.id, null, { [curr.id]: `${safeTarget} > ${curr.val} (go R)` }),
          variables: { currentNode: curr.val, target: safeTarget, branch: 'right', depth }
        });
        curr = nextNode;
      }
      depth++;
    }

    if (!found) {
      steps.push({
        stepNumber: stepNum++,
        activeLine: 10,
        explanation: `Reached null child pointer at depth ${depth} → Key ${safeTarget} does not exist in BST.`,
        treeNodes: serializeTree(null, null, {}),
        variables: { currentNode: 'null', target: safeTarget, status: 'NOT_FOUND' }
      });
    }

    return {
      steps,
      traceSummary: found
        ? `Found key ${safeTarget} in BST at depth ${depth}`
        : `Key ${safeTarget} not found in BST (insert position at depth ${depth})`
    };
  }

  // 8. Generic Custom Array Walkthrough (Linear Scan / DP / Greedy)
  let runningBest = nums[0];
  const steps: TopicStep[] = nums.map((val, idx) => {
    runningBest = Math.max(runningBest, val);
    return {
      stepNumber: idx + 1,
      activeLine: 3,
      explanation: `Step ${idx + 1}: Inspect index ${idx} (value = ${val}), compare with target ${safeTarget} (running max = ${runningBest})`,
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
            : 'default',
        subText: j === idx ? `i=${idx}` : undefined
      })),
      pointers: [
        { label: 'start', index: 0, color: 'green' },
        { label: 'curr', index: idx, color: 'blue' },
        { label: 'end', index: nums.length - 1, color: 'purple' }
      ],
      variables: { index: idx, value: val, target: safeTarget, runningMax: runningBest }
    };
  });

  return {
    steps,
    traceSummary: `Processed ${nums.length} custom elements (max = ${runningBest})`
  };
}
