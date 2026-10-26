import { LearningPhase, PracticeProblem, TopicData } from '@/types/codeflow';
import { dsaTopicsPart1 } from '@/data/topics/dsaTopicsPart1';
import { dsaTopicsPart2 } from '@/data/topics/dsaTopicsPart2';
import { pillarsTopics } from '@/data/topics/pillarsTopics';

const rawDsaTopics: TopicData[] = [...dsaTopicsPart1, ...dsaTopicsPart2];

// Optimal Beginner -> Intermediate -> Advanced Pedagogical Learning Roadmap for all 31 DSA Topics
export const DSA_ROADMAP_ORDER: {
  id: string;
  phase: LearningPhase;
}[] = [
  // Phase 1: Beginner Foundations & Linear Structures (Topics 1 - 13)
  { id: 'time-space-complexity', phase: 'Phase 1: Beginner Foundations' },
  { id: 'arrays', phase: 'Phase 1: Beginner Foundations' },
  { id: 'strings', phase: 'Phase 1: Beginner Foundations' },
  { id: 'searching-algorithms', phase: 'Phase 1: Beginner Foundations' },
  { id: 'binary-search', phase: 'Phase 1: Beginner Foundations' },
  { id: 'two-pointers', phase: 'Phase 1: Beginner Foundations' },
  { id: 'prefix-sums', phase: 'Phase 1: Beginner Foundations' },
  { id: 'sliding-window', phase: 'Phase 1: Beginner Foundations' },
  { id: 'sorting-algorithms', phase: 'Phase 1: Beginner Foundations' },
  { id: 'hash-tables', phase: 'Phase 1: Beginner Foundations' },
  { id: 'linked-lists', phase: 'Phase 1: Beginner Foundations' },
  { id: 'stacks-queues', phase: 'Phase 1: Beginner Foundations' },
  { id: 'bit-manipulation', phase: 'Phase 1: Beginner Foundations' },

  // Phase 2: Intermediate Algorithmic Patterns & Trees (Topics 14 - 23)
  { id: 'monotonic-stacks-queues', phase: 'Phase 2: Intermediate Patterns & Trees' },
  { id: 'interval-problems', phase: 'Phase 2: Intermediate Patterns & Trees' },
  { id: 'divide-and-conquer', phase: 'Phase 2: Intermediate Patterns & Trees' },
  { id: 'trees', phase: 'Phase 2: Intermediate Patterns & Trees' },
  { id: 'binary-search-trees', phase: 'Phase 2: Intermediate Patterns & Trees' },
  { id: 'heaps', phase: 'Phase 2: Intermediate Patterns & Trees' },
  { id: 'tries', phase: 'Phase 2: Intermediate Patterns & Trees' },
  { id: 'backtracking', phase: 'Phase 2: Intermediate Patterns & Trees' },
  { id: 'greedy-algorithms', phase: 'Phase 2: Intermediate Patterns & Trees' },
  { id: 'problem-solving-patterns', phase: 'Phase 2: Intermediate Patterns & Trees' },

  // Phase 3: Advanced Graphs, Dynamic Programming & Range Trees (Topics 24 - 31)
  { id: 'graphs', phase: 'Phase 3: Advanced Graphs, DP & Trees' },
  { id: 'graph-traversal', phase: 'Phase 3: Advanced Graphs, DP & Trees' },
  { id: 'topological-sorting', phase: 'Phase 3: Advanced Graphs, DP & Trees' },
  { id: 'disjoint-set-union', phase: 'Phase 3: Advanced Graphs, DP & Trees' },
  { id: 'dynamic-programming', phase: 'Phase 3: Advanced Graphs, DP & Trees' },
  { id: 'shortest-path', phase: 'Phase 3: Advanced Graphs, DP & Trees' },
  { id: 'minimum-spanning-trees', phase: 'Phase 3: Advanced Graphs, DP & Trees' },
  { id: 'segment-fenwick-trees', phase: 'Phase 3: Advanced Graphs, DP & Trees' }
];

const orderedDsaTopics: TopicData[] = DSA_ROADMAP_ORDER.map((entry, idx) => {
  const found = rawDsaTopics.find((t) => t.id === entry.id);
  if (!found) {
    throw new Error(`Missing DSA topic id: ${entry.id}`);
  }
  return {
    ...found,
    learningOrder: idx + 1,
    learningPhase: entry.phase
  };
});

export const ALL_CODEFLOW_TOPICS: TopicData[] = [
  ...orderedDsaTopics,
  ...pillarsTopics
];

// Curated Multi-Difficulty Problem Sets for High-Frequency Topics (Easy -> Medium -> Hard)
const CURATED_TOPIC_PROBLEMS: Record<string, PracticeProblem[]> = {
  'binary-search': [
    {
      id: 'bs-1-classic',
      number: 1,
      title: 'Binary Search (Exact Target Lookup)',
      difficulty: 'Easy',
      topicId: 'binary-search',
      progressionStage: 'Stage 1: Concept Warmup',
      recommendedFirst: true,
      logicHint:
        'Start here! Maintain [left, right] bounds. Compute mid = Math.floor((left + right) / 2). If nums[mid] < target, discard the left half (left = mid + 1); if nums[mid] > target, discard the right half (right = mid - 1).',
      description:
        'Given a sorted array of integers and a target value, return the index of the target if it exists in O(log n) time. If the target is not found, return -1.',
      example1: { input: 'nums = [1, 3, 5, 7, 9], target = 7', output: '3' },
      example2: { input: 'nums = [1, 3, 5, 7, 9], target = 2', output: '-1' },
      functionName: 'binarySearch',
      starterCode: `function binarySearch(nums, target) {\n  let left = 0;\n  let right = nums.length - 1;\n\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`,
      solutionCode: `function binarySearch(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`,
      testCases: [
        { label: 'Found at index 3: [1,3,5,7,9], target=7', args: [[1, 3, 5, 7, 9], 7], expected: 3 },
        { label: 'Not found: [1,3,5,7,9], target=2', args: [[1, 3, 5, 7, 9], 2], expected: -1 },
        { label: 'First element: [1,3,5,7,9], target=1', args: [[1, 3, 5, 7, 9], 1], expected: 0 }
      ]
    },
    {
      id: 'bs-2-insert-pos',
      number: 2,
      title: 'Search Insert Position (Lower Bound)',
      difficulty: 'Easy',
      topicId: 'binary-search',
      progressionStage: 'Stage 2: Boundary Invariant',
      logicHint:
        'When the while (left <= right) loop finishes without finding target, the pointer `left` naturally lands on the exact index where `target` belongs to keep the array sorted!',
      description:
        'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.',
      example1: { input: 'nums = [1, 3, 5, 6], target = 5', output: '2' },
      example2: { input: 'nums = [1, 3, 5, 6], target = 2', output: '1' },
      functionName: 'searchInsert',
      starterCode: `function searchInsert(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return left;\n}`,
      solutionCode: `function searchInsert(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return left;\n}`,
      testCases: [
        { label: 'Existing target 5 in [1,3,5,6]', args: [[1, 3, 5, 6], 5], expected: 2 },
        { label: 'Insert 2 into [1,3,5,6]', args: [[1, 3, 5, 6], 2], expected: 1 },
        { label: 'Insert 7 at end of [1,3,5,6]', args: [[1, 3, 5, 6], 7], expected: 4 }
      ]
    },
    {
      id: 'bs-3-first-last',
      number: 3,
      title: 'Find First and Last Position in Sorted Array',
      difficulty: 'Medium',
      topicId: 'binary-search',
      progressionStage: 'Stage 3: Core Pattern Variation',
      logicHint:
        'Run Binary Search twice: once that continues searching left (right = mid - 1) even after finding target to locate the first occurrence, and once that continues searching right (left = mid + 1) for the last occurrence.',
      description:
        'Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value in O(log n) time. Return [-1, -1] if not found.',
      example1: { input: 'nums = [5, 7, 7, 8, 8, 10], target = 8', output: '[3, 4]' },
      example2: { input: 'nums = [5, 7, 7, 8, 8, 10], target = 6', output: '[-1, -1]' },
      functionName: 'searchRange',
      starterCode: `function searchRange(nums, target) {\n  const findBound = (isFirst) => {\n    let left = 0, right = nums.length - 1, bound = -1;\n    while (left <= right) {\n      const mid = Math.floor((left + right) / 2);\n      if (nums[mid] === target) {\n        bound = mid;\n        if (isFirst) right = mid - 1;\n        else left = mid + 1;\n      } else if (nums[mid] < target) left = mid + 1;\n      else right = mid - 1;\n    }\n    return bound;\n  };\n  return [findBound(true), findBound(false)];\n}`,
      solutionCode: `function searchRange(nums, target) {\n  const findBound = (isFirst) => {\n    let left = 0, right = nums.length - 1, bound = -1;\n    while (left <= right) {\n      const mid = Math.floor((left + right) / 2);\n      if (nums[mid] === target) {\n        bound = mid;\n        if (isFirst) right = mid - 1;\n        else left = mid + 1;\n      } else if (nums[mid] < target) left = mid + 1;\n      else right = mid - 1;\n    }\n    return bound;\n  };\n  return [findBound(true), findBound(false)];\n}`,
      testCases: [
        { label: 'Range of 8 in [5,7,7,8,8,10]', args: [[5, 7, 7, 8, 8, 10], 8], expected: [3, 4] },
        { label: 'Missing 6 in [5,7,7,8,8,10]', args: [[5, 7, 7, 8, 8, 10], 6], expected: [-1, -1] },
        { label: 'Single element [1], target=1', args: [[1], 1], expected: [0, 0] }
      ]
    },
    {
      id: 'bs-4-rotated',
      number: 4,
      title: 'Search in Rotated Sorted Array',
      difficulty: 'Medium',
      topicId: 'binary-search',
      progressionStage: 'Stage 4: Non-Uniform Monotonicity',
      logicHint:
        'At any midpoint in a rotated sorted array, at least ONE half (left..mid or mid..right) is guaranteed to be strictly sorted. Check which half is sorted, then check if target lies within that sorted half!',
      description:
        'Given a sorted array that has been rotated at an unknown pivot (e.g., [4,5,6,7,0,1,2]) and a target value, return its index in O(log n) time, or -1 if absent.',
      example1: { input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 0', output: '4' },
      example2: { input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 3', output: '-1' },
      functionName: 'searchRotated',
      starterCode: `function searchRotated(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[left] <= nums[mid]) {\n      if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n      else left = mid + 1;\n    } else {\n      if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n      else right = mid - 1;\n    }\n  }\n  return -1;\n}`,
      solutionCode: `function searchRotated(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[left] <= nums[mid]) {\n      if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n      else left = mid + 1;\n    } else {\n      if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n      else right = mid - 1;\n    }\n  }\n  return -1;\n}`,
      testCases: [
        { label: 'Find 0 in [4,5,6,7,0,1,2]', args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
        { label: 'Missing 3 in [4,5,6,7,0,1,2]', args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
        { label: 'Find 5 in [4,5,6,7,0,1,2]', args: [[4, 5, 6, 7, 0, 1, 2], 5], expected: 1 }
      ]
    },
    {
      id: 'bs-5-answer-space',
      number: 5,
      title: 'Split Array Largest Sum (Binary Search on Answer)',
      difficulty: 'Hard',
      topicId: 'binary-search',
      progressionStage: 'Stage 5: Advanced Mastery',
      logicHint:
        'Instead of searching array indices, binary search the ANSWER space between left = max(nums) and right = sum(nums). Write a greedy helper canSplit(maxAllowed) to test if <= k subarrays suffice.',
      description:
        'Given an integer array nums and an integer k, split nums into k non-empty continuous subarrays such that the largest sum among these k subarrays is minimized. Return the minimized largest sum.',
      example1: { input: 'nums = [7, 2, 5, 10, 8], k = 2', output: '18' },
      example2: { input: 'nums = [1, 2, 3, 4, 5], k = 2', output: '9' },
      functionName: 'splitArray',
      starterCode: `function splitArray(nums, k) {\n  let left = Math.max(...nums);\n  let right = nums.reduce((a, b) => a + b, 0);\n\n  const canSplit = (limit) => {\n    let parts = 1, curr = 0;\n    for (const n of nums) {\n      if (curr + n > limit) { parts++; curr = n; }\n      else curr += n;\n    }\n    return parts <= k;\n  };\n\n  while (left < right) {\n    const mid = Math.floor((left + right) / 2);\n    if (canSplit(mid)) right = mid;\n    else left = mid + 1;\n  }\n  return left;\n}`,
      solutionCode: `function splitArray(nums, k) {\n  let left = Math.max(...nums);\n  let right = nums.reduce((a, b) => a + b, 0);\n  const canSplit = (limit) => {\n    let parts = 1, curr = 0;\n    for (const n of nums) {\n      if (curr + n > limit) { parts++; curr = n; }\n      else curr += n;\n    }\n    return parts <= k;\n  };\n  while (left < right) {\n    const mid = Math.floor((left + right) / 2);\n    if (canSplit(mid)) right = mid;\n    else left = mid + 1;\n  }\n  return left;\n}`,
      testCases: [
        { label: 'Split [7,2,5,10,8] into k=2', args: [[7, 2, 5, 10, 8], 2], expected: 18 },
        { label: 'Split [1,2,3,4,5] into k=2', args: [[1, 2, 3, 4, 5], 2], expected: 9 },
        { label: 'Split [1,4,4] into k=3', args: [[1, 4, 4], 3], expected: 4 }
      ]
    }
  ],

  'time-space-complexity': [
    {
      id: 'tsc-1-constant-sum',
      number: 1,
      title: 'O(1) Gauss Formula vs O(n) Loop Sum',
      difficulty: 'Easy',
      topicId: 'time-space-complexity',
      progressionStage: 'Stage 1: Concept Warmup',
      recommendedFirst: true,
      logicHint:
        'Start here! A loop from 1 to n performs n additions (O(n) time). The mathematical identity n * (n + 1) / 2 computes the exact same answer in 3 arithmetic operations—O(1) constant time and O(1) space!',
      description:
        'Given a positive integer n, return the sum of all integers from 1 to n in O(1) constant time complexity without using a loop.',
      example1: { input: 'n = 10', output: '55' },
      example2: { input: 'n = 100', output: '5050' },
      functionName: 'sumToN',
      starterCode: `function sumToN(n) {\n  return (n * (n + 1)) / 2;\n}`,
      solutionCode: `function sumToN(n) {\n  return (n * (n + 1)) / 2;\n}`,
      testCases: [
        { label: 'n = 10 -> 55', args: [10], expected: 55 },
        { label: 'n = 100 -> 5050', args: [100], expected: 5050 },
        { label: 'n = 1 -> 1', args: [1], expected: 1 }
      ]
    },
    {
      id: 'tsc-2-linear-max',
      number: 2,
      title: 'Single-Pass Peak Difference (O(n) Time, O(1) Space)',
      difficulty: 'Easy',
      topicId: 'time-space-complexity',
      progressionStage: 'Stage 2: Eliminate Nested Loops',
      logicHint:
        'A naive nested loop checks all (i, j) pairs in O(n^2) time. By tracking `minSoFar` in a single pass, you reduce time complexity from O(n^2) to O(n) while keeping O(1) auxiliary memory.',
      description:
        'Given an array of numbers, find the maximum difference nums[j] - nums[i] such that j >= i in a single O(n) pass and O(1) space.',
      example1: { input: 'nums = [7, 1, 5, 3, 6, 4]', output: '5' },
      example2: { input: 'nums = [9, 7, 4, 2]', output: '0' },
      functionName: 'maxDiffSinglePass',
      starterCode: `function maxDiffSinglePass(nums) {\n  let minSoFar = Infinity, maxDiff = 0;\n  for (const x of nums) {\n    minSoFar = Math.min(minSoFar, x);\n    maxDiff = Math.max(maxDiff, x - minSoFar);\n  }\n  return maxDiff;\n}`,
      solutionCode: `function maxDiffSinglePass(nums) {\n  let minSoFar = Infinity, maxDiff = 0;\n  for (const x of nums) {\n    minSoFar = Math.min(minSoFar, x);\n    maxDiff = Math.max(maxDiff, x - minSoFar);\n  }\n  return maxDiff;\n}`,
      testCases: [
        { label: 'nums = [7,1,5,3,6,4] -> 5', args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
        { label: 'Decreasing [9,7,4,2] -> 0', args: [[9, 7, 4, 2]], expected: 0 },
        { label: 'nums = [2, 10] -> 8', args: [[2, 10]], expected: 8 }
      ]
    },
    {
      id: 'tsc-3-space-time-tradeoff',
      number: 3,
      title: 'Contains Duplicate (Time-Space Trade-Off)',
      difficulty: 'Medium',
      topicId: 'time-space-complexity',
      progressionStage: 'Stage 3: O(n) Space for O(n) Time',
      logicHint:
        'Comparing every pair takes O(n^2) time and O(1) space. Trading O(n) extra memory for a Hash Set drops lookup time to O(1) per element, achieving O(n) total time.',
      description:
        'Given an integer array nums, return true if any value appears at least twice in the array, and false if every element is distinct, in O(n) time.',
      example1: { input: 'nums = [1, 2, 3, 1]', output: 'true' },
      example2: { input: 'nums = [1, 2, 3, 4]', output: 'false' },
      functionName: 'containsDuplicate',
      starterCode: `function containsDuplicate(nums) {\n  const seen = new Set();\n  for (const n of nums) {\n    if (seen.has(n)) return true;\n    seen.add(n);\n  }\n  return false;\n}`,
      solutionCode: `function containsDuplicate(nums) {\n  return new Set(nums).size !== nums.length;\n}`,
      testCases: [
        { label: 'Duplicate 1 in [1,2,3,1]', args: [[1, 2, 3, 1]], expected: true },
        { label: 'All unique [1,2,3,4]', args: [[1, 2, 3, 4]], expected: false },
        { label: 'Multiple duplicates [1,1,1,3,3]', args: [[1, 1, 1, 3, 3]], expected: true }
      ]
    },
    {
      id: 'tsc-4-in-place-constant-space',
      number: 4,
      title: 'First Missing Positive (O(n) Time & O(1) Auxiliary Space)',
      difficulty: 'Hard',
      topicId: 'time-space-complexity',
      progressionStage: 'Stage 4: Advanced Mastery',
      logicHint:
        'To achieve O(1) extra space without a external Set, use the input array itself as a hash table by cyclic-swapping each value x (1 <= x <= n) into index x - 1!',
      description:
        'Given an unsorted integer array nums, return the smallest missing positive integer. You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.',
      example1: { input: 'nums = [3, 4, -1, 1]', output: '2' },
      example2: { input: 'nums = [1, 2, 0]', output: '3' },
      functionName: 'firstMissingPositive',
      starterCode: `function firstMissingPositive(nums) {\n  const n = nums.length;\n  for (let i = 0; i < n; i++) {\n    while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {\n      const targetIdx = nums[i] - 1;\n      [nums[i], nums[targetIdx]] = [nums[targetIdx], nums[i]];\n    }\n  }\n  for (let i = 0; i < n; i++) {\n    if (nums[i] !== i + 1) return i + 1;\n  }\n  return n + 1;\n}`,
      solutionCode: `function firstMissingPositive(nums) {\n  const n = nums.length;\n  for (let i = 0; i < n; i++) {\n    while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {\n      const idx = nums[i] - 1;\n      [nums[i], nums[idx]] = [nums[idx], nums[i]];\n    }\n  }\n  for (let i = 0; i < n; i++) if (nums[i] !== i + 1) return i + 1;\n  return n + 1;\n}`,
      testCases: [
        { label: '[3, 4, -1, 1] -> 2', args: [[3, 4, -1, 1]], expected: 2 },
        { label: '[1, 2, 0] -> 3', args: [[1, 2, 0]], expected: 3 },
        { label: '[7, 8, 9, 11] -> 1', args: [[7, 8, 9, 11]], expected: 1 }
      ]
    }
  ],

  arrays: [
    {
      id: 'arr-1-move-zeroes',
      number: 1,
      title: 'Move Zeroes In-Place',
      difficulty: 'Easy',
      topicId: 'arrays',
      progressionStage: 'Stage 1: Concept Warmup',
      recommendedFirst: true,
      logicHint:
        'Start here! Maintain a `writeIdx` pointer at 0. Scan through the array: whenever you see a non-zero number, write it to `nums[writeIdx++]`. Fill the remaining indices with 0.',
      description:
        'Given an integer array nums, move all 0s to the end of it while maintaining the relative order of the non-zero elements. Return the modified array.',
      example1: { input: 'nums = [0, 1, 0, 3, 12]', output: '[1, 3, 12, 0, 0]' },
      example2: { input: 'nums = [0, 0, 1]', output: '[1, 0, 0]' },
      functionName: 'moveZeroes',
      starterCode: `function moveZeroes(nums) {\n  let writeIdx = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] !== 0) {\n      [nums[writeIdx], nums[i]] = [nums[i], nums[writeIdx]];\n      writeIdx++;\n    }\n  }\n  return nums;\n}`,
      solutionCode: `function moveZeroes(nums) {\n  let writeIdx = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] !== 0) {\n      [nums[writeIdx], nums[i]] = [nums[i], nums[writeIdx]];\n      writeIdx++;\n    }\n  }\n  return nums;\n}`,
      testCases: [
        { label: '[0, 1, 0, 3, 12] -> [1, 3, 12, 0, 0]', args: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
        { label: '[0, 0, 1] -> [1, 0, 0]', args: [[0, 0, 1]], expected: [1, 0, 0] },
        { label: '[4, 2] -> [4, 2]', args: [[4, 2]], expected: [4, 2] }
      ]
    },
    {
      id: 'arr-2-rotate',
      number: 2,
      title: 'Rotate Array by K Steps (3-Reverse Trick)',
      difficulty: 'Medium',
      topicId: 'arrays',
      progressionStage: 'Stage 2: Core In-Place Pattern',
      logicHint:
        'To rotate right by k in O(1) space: 1) Reverse the whole array, 2) Reverse the first k elements, 3) Reverse the remaining n - k elements!',
      description:
        'Given an integer array nums, rotate the array to the right by k steps, where k is non-negative, and return the rotated array.',
      example1: { input: 'nums = [1, 2, 3, 4, 5, 6, 7], k = 3', output: '[5, 6, 7, 1, 2, 3, 4]' },
      example2: { input: 'nums = [-1, -100, 3, 99], k = 2', output: '[3, 99, -1, -100]' },
      functionName: 'rotateArray',
      starterCode: `function rotateArray(nums, k) {\n  k = k % nums.length;\n  const rev = (l, r) => {\n    while (l < r) { [nums[l], nums[r]] = [nums[r], nums[l]]; l++; r--; }\n  };\n  rev(0, nums.length - 1);\n  rev(0, k - 1);\n  rev(k, nums.length - 1);\n  return nums;\n}`,
      solutionCode: `function rotateArray(nums, k) {\n  k %= nums.length;\n  const rev = (l, r) => { while (l < r) { [nums[l], nums[r]] = [nums[r], nums[l]]; l++; r--; } };\n  rev(0, nums.length - 1);\n  rev(0, k - 1);\n  rev(k, nums.length - 1);\n  return nums;\n}`,
      testCases: [
        { label: 'Rotate [1..7] by k=3', args: [[1, 2, 3, 4, 5, 6, 7], 3], expected: [5, 6, 7, 1, 2, 3, 4] },
        { label: 'Rotate [-1,-100,3,99] by k=2', args: [[-1, -100, 3, 99], 2], expected: [3, 99, -1, -100] },
        { label: 'k larger than length: [1,2], k=3', args: [[1, 2], 3], expected: [2, 1] }
      ]
    },
    {
      id: 'arr-3-product-except-self',
      number: 3,
      title: 'Product of Array Except Self',
      difficulty: 'Medium',
      topicId: 'arrays',
      progressionStage: 'Stage 3: Prefix & Suffix Pass',
      logicHint:
        'Without using division, each output[i] is (product of all elements to the left of i) * (product of all elements to the right of i). Compute left products in pass 1, and multiply by right products in pass 2!',
      description:
        'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i], in O(n) time without using division.',
      example1: { input: 'nums = [1, 2, 3, 4]', output: '[24, 12, 8, 6]' },
      example2: { input: 'nums = [2, 3, 4, 5]', output: '[60, 40, 30, 24]' },
      functionName: 'productExceptSelf',
      starterCode: `function productExceptSelf(nums) {\n  const res = new Array(nums.length).fill(1);\n  let prefix = 1;\n  for (let i = 0; i < nums.length; i++) {\n    res[i] = prefix;\n    prefix *= nums[i];\n  }\n  let suffix = 1;\n  for (let i = nums.length - 1; i >= 0; i--) {\n    res[i] *= suffix;\n    suffix *= nums[i];\n  }\n  return res;\n}`,
      solutionCode: `function productExceptSelf(nums) {\n  const res = new Array(nums.length).fill(1);\n  let prefix = 1;\n  for (let i = 0; i < nums.length; i++) { res[i] = prefix; prefix *= nums[i]; }\n  let suffix = 1;\n  for (let i = nums.length - 1; i >= 0; i--) { res[i] *= suffix; suffix *= nums[i]; }\n  return res;\n}`,
      testCases: [
        { label: '[1, 2, 3, 4] -> [24, 12, 8, 6]', args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
        { label: '[2, 3, 4, 5] -> [60, 40, 30, 24]', args: [[2, 3, 4, 5]], expected: [60, 40, 30, 24] },
        { label: '[0, 4, 2] -> [8, 0, 0]', args: [[0, 4, 2]], expected: [8, 0, 0] }
      ]
    },
    {
      id: 'arr-4-rain-water',
      number: 4,
      title: 'Trapping Rain Water',
      difficulty: 'Hard',
      topicId: 'arrays',
      progressionStage: 'Stage 4: Advanced Mastery',
      logicHint:
        'Water trapped above bar i is determined by Math.min(maxLeft, maxRight) - height[i]. Use two pointers inward from both ends, always advancing the side with the smaller boundary max.',
      description:
        'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
      example1: { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
      example2: { input: 'height = [4,2,0,3,2,5]', output: '9' },
      functionName: 'trap',
      starterCode: `function trap(height) {\n  let left = 0, right = height.length - 1;\n  let leftMax = 0, rightMax = 0, water = 0;\n  while (left < right) {\n    if (height[left] < height[right]) {\n      leftMax = Math.max(leftMax, height[left]);\n      water += leftMax - height[left];\n      left++;\n    } else {\n      rightMax = Math.max(rightMax, height[right]);\n      water += rightMax - height[right];\n      right--;\n    }\n  }\n  return water;\n}`,
      solutionCode: `function trap(height) {\n  let l = 0, r = height.length - 1, lMax = 0, rMax = 0, water = 0;\n  while (l < r) {\n    if (height[l] < height[r]) { lMax = Math.max(lMax, height[l]); water += lMax - height[l++]; }\n    else { rMax = Math.max(rMax, height[r]); water += rMax - height[r--]; }\n  }\n  return water;\n}`,
      testCases: [
        { label: 'Standard elevation map -> 6', args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
        { label: '[4, 2, 0, 3, 2, 5] -> 9', args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
        { label: 'Flat [2, 2, 2] -> 0', args: [[2, 2, 2]], expected: 0 }
      ]
    }
  ],

  'hash-tables': [
    {
      id: 'ht-1-two-sum',
      number: 1,
      title: 'Two Sum (Complement Hash Map)',
      difficulty: 'Easy',
      topicId: 'hash-tables',
      progressionStage: 'Stage 1: Concept Warmup',
      recommendedFirst: true,
      logicHint:
        'Start here! As you iterate through nums[i], compute the needed complement `need = target - nums[i]`. Check if `need` is already in your Map in O(1) time; if not, store `seen.set(nums[i], i)`.',
      description:
        'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      example1: { input: 'nums = [2, 11, 7, 15], target = 9', output: '[0, 2]' },
      example2: { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]' },
      functionName: 'twoSum',
      starterCode: `function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}`,
      solutionCode: `function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}`,
      testCases: [
        { label: 'nums = [2, 11, 7, 15], target = 9', args: [[2, 11, 7, 15], 9], expected: [0, 2] },
        { label: 'nums = [3, 2, 4], target = 6', args: [[3, 2, 4], 6], expected: [1, 2] },
        { label: 'Duplicates [3, 3], target = 6', args: [[3, 3], 6], expected: [0, 1] }
      ]
    },
    {
      id: 'ht-2-first-unique',
      number: 2,
      title: 'First Unique Character in a String',
      difficulty: 'Easy',
      topicId: 'hash-tables',
      progressionStage: 'Stage 2: Frequency Counting',
      logicHint:
        'Pass 1: Build a frequency map `freq[ch] = (freq[ch] || 0) + 1`. Pass 2: Scan the string left-to-right and return the first index `i` where `freq[s[i]] === 1`.',
      description:
        'Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.',
      example1: { input: 's = "codeflow"', output: '0' },
      example2: { input: 's = "loveleetcode"', output: '2' },
      functionName: 'firstUniqChar',
      starterCode: `function firstUniqChar(s) {\n  const freq = {};\n  for (const ch of s) freq[ch] = (freq[ch] || 0) + 1;\n  for (let i = 0; i < s.length; i++) {\n    if (freq[s[i]] === 1) return i;\n  }\n  return -1;\n}`,
      solutionCode: `function firstUniqChar(s) {\n  const freq = {};\n  for (const ch of s) freq[ch] = (freq[ch] || 0) + 1;\n  for (let i = 0; i < s.length; i++) if (freq[s[i]] === 1) return i;\n  return -1;\n}`,
      testCases: [
        { label: '"codeflow" -> 0', args: ['codeflow'], expected: 0 },
        { label: '"loveleetcode" -> 2', args: ['loveleetcode'], expected: 2 },
        { label: '"aabb" -> -1', args: ['aabb'], expected: -1 }
      ]
    },
    {
      id: 'ht-3-longest-consecutive',
      number: 3,
      title: 'Longest Consecutive Sequence (O(n) Set Lookup)',
      difficulty: 'Medium',
      topicId: 'hash-tables',
      progressionStage: 'Stage 3: Sequence Start Detection',
      logicHint:
        'Insert all numbers into a Set. Only start counting a streak from `n` if `n - 1` is NOT in the Set (meaning `n` is the true start of a sequence). This guarantees each number is visited at most twice -> O(n)!',
      description:
        'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence in O(n) time.',
      example1: { input: 'nums = [100, 4, 200, 1, 3, 2]', output: '4' },
      example2: { input: 'nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]', output: '9' },
      functionName: 'longestConsecutive',
      starterCode: `function longestConsecutive(nums) {\n  const set = new Set(nums);\n  let best = 0;\n  for (const n of set) {\n    if (!set.has(n - 1)) {\n      let curr = n, streak = 1;\n      while (set.has(curr + 1)) { curr++; streak++; }\n      best = Math.max(best, streak);\n    }\n  }\n  return best;\n}`,
      solutionCode: `function longestConsecutive(nums) {\n  const set = new Set(nums);\n  let best = 0;\n  for (const n of set) {\n    if (!set.has(n - 1)) {\n      let curr = n, streak = 1;\n      while (set.has(curr + 1)) { curr++; streak++; }\n      best = Math.max(best, streak);\n    }\n  }\n  return best;\n}`,
      testCases: [
        { label: '[100, 4, 200, 1, 3, 2] -> 4', args: [[100, 4, 200, 1, 3, 2]], expected: 4 },
        { label: '[0,3,7,2,5,8,4,6,0,1] -> 9', args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
        { label: 'Empty [] -> 0', args: [[]], expected: 0 }
      ]
    },
    {
      id: 'ht-4-subarray-sum-k',
      number: 4,
      title: 'Subarray Sum Equals K (Prefix Hash Map)',
      difficulty: 'Hard',
      topicId: 'hash-tables',
      progressionStage: 'Stage 4: Advanced Mastery',
      logicHint:
        'Maintain running `prefixSum` and a Map of `{ previousPrefixSum: count }`. If `prefixSum - k` exists in the Map, add its count to `total` because the subarray between those points sums to `k`!',
      description:
        'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k in O(n) time.',
      example1: { input: 'nums = [1, 1, 1], k = 2', output: '2' },
      example2: { input: 'nums = [1, 2, 3], k = 3', output: '2' },
      functionName: 'subarraySum',
      starterCode: `function subarraySum(nums, k) {\n  const prefixCounts = new Map([[0, 1]]);\n  let sum = 0, count = 0;\n  for (const n of nums) {\n    sum += n;\n    if (prefixCounts.has(sum - k)) count += prefixCounts.get(sum - k);\n    prefixCounts.set(sum, (prefixCounts.get(sum) || 0) + 1);\n  }\n  return count;\n}`,
      solutionCode: `function subarraySum(nums, k) {\n  const prefixCounts = new Map([[0, 1]]);\n  let sum = 0, count = 0;\n  for (const n of nums) {\n    sum += n;\n    if (prefixCounts.has(sum - k)) count += prefixCounts.get(sum - k);\n    prefixCounts.set(sum, (prefixCounts.get(sum) || 0) + 1);\n  }\n  return count;\n}`,
      testCases: [
        { label: '[1, 1, 1], k = 2 -> 2', args: [[1, 1, 1], 2], expected: 2 },
        { label: '[1, 2, 3], k = 3 -> 2', args: [[1, 2, 3], 3], expected: 2 },
        { label: 'Negative values [1, -1, 0], k = 0 -> 3', args: [[1, -1, 0], 0], expected: 3 }
      ]
    }
  ],

  strings: [
    {
      id: 'str-1-valid-palindrome',
      number: 1,
      title: 'Valid Palindrome (Two-Pointer Character Scan)',
      difficulty: 'Easy',
      topicId: 'strings',
      progressionStage: 'Stage 1: Concept Warmup',
      recommendedFirst: true,
      logicHint:
        'Start here! Normalize the string to lowercase alphanumeric characters, then place `left = 0` and `right = s.length - 1` and verify `s[left] === s[right]` moving inward.',
      description:
        'Given a string s, return true if it is a palindrome after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters.',
      example1: { input: 's = "A man, a plan, a canal: Panama"', output: 'true' },
      example2: { input: 's = "race a car"', output: 'false' },
      functionName: 'isPalindrome',
      starterCode: `function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let l = 0, r = clean.length - 1;\n  while (l < r) {\n    if (clean[l] !== clean[r]) return false;\n    l++; r--;\n  }\n  return true;\n}`,
      solutionCode: `function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let l = 0, r = clean.length - 1;\n  while (l < r) {\n    if (clean[l++] !== clean[r--]) return false;\n  }\n  return true;\n}`,
      testCases: [
        { label: '"A man, a plan, a canal: Panama" -> true', args: ['A man, a plan, a canal: Panama'], expected: true },
        { label: '"race a car" -> false', args: ['race a car'], expected: false },
        { label: 'Empty space " " -> true', args: [' '], expected: true }
      ]
    },
    {
      id: 'str-2-valid-anagram',
      number: 2,
      title: 'Valid Anagram (Character Frequency Array)',
      difficulty: 'Easy',
      topicId: 'strings',
      progressionStage: 'Stage 2: Core Pattern',
      logicHint:
        'Two strings are anagrams if and only if they have the exact same length and identical character counts across all 26 lowercase letters.',
      description:
        'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
      example1: { input: 's = "anagram", t = "nagaram"', output: 'true' },
      example2: { input: 's = "rat", t = "car"', output: 'false' },
      functionName: 'isAnagram',
      starterCode: `function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const counts = {};\n  for (const ch of s) counts[ch] = (counts[ch] || 0) + 1;\n  for (const ch of t) {\n    if (!counts[ch]) return false;\n    counts[ch]--;\n  }\n  return true;\n}`,
      solutionCode: `function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const counts = {};\n  for (const ch of s) counts[ch] = (counts[ch] || 0) + 1;\n  for (const ch of t) { if (!counts[ch]) return false; counts[ch]--; }\n  return true;\n}`,
      testCases: [
        { label: '"anagram", "nagaram" -> true', args: ['anagram', 'nagaram'], expected: true },
        { label: '"rat", "car" -> false', args: ['rat', 'car'], expected: false },
        { label: '"listen", "silent" -> true', args: ['listen', 'silent'], expected: true }
      ]
    },
    {
      id: 'str-3-longest-palindromic-substring',
      number: 3,
      title: 'Longest Palindromic Substring (Expand Around Center)',
      difficulty: 'Medium',
      topicId: 'strings',
      progressionStage: 'Stage 3: Pattern Variation',
      logicHint:
        'Every palindrome mirrors around a center (either a single character like "aba" or between two characters like "abba"). Expand outward from all 2n - 1 possible centers!',
      description:
        'Given a string s, return the length of the longest palindromic substring in s.',
      example1: { input: 's = "babad"', output: '3' },
      example2: { input: 's = "cbbd"', output: '2' },
      functionName: 'longestPalindromeLen',
      starterCode: `function longestPalindromeLen(s) {\n  let maxLen = 0;\n  const expand = (l, r) => {\n    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }\n    return r - l - 1;\n  };\n  for (let i = 0; i < s.length; i++) {\n    maxLen = Math.max(maxLen, expand(i, i), expand(i, i + 1));\n  }\n  return maxLen;\n}`,
      solutionCode: `function longestPalindromeLen(s) {\n  let maxLen = 0;\n  const expand = (l, r) => {\n    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }\n    return r - l - 1;\n  };\n  for (let i = 0; i < s.length; i++) maxLen = Math.max(maxLen, expand(i, i), expand(i, i + 1));\n  return maxLen;\n}`,
      testCases: [
        { label: '"babad" -> 3 ("bab")', args: ['babad'], expected: 3 },
        { label: '"cbbd" -> 2 ("bb")', args: ['cbbd'], expected: 2 },
        { label: '"racecar" -> 7', args: ['racecar'], expected: 7 }
      ]
    },
    {
      id: 'str-4-min-window-substring',
      number: 4,
      title: 'Minimum Window Substring Length',
      difficulty: 'Hard',
      topicId: 'strings',
      progressionStage: 'Stage 4: Advanced Mastery',
      logicHint:
        'Expand `right` until your window satisfies all required character frequencies of `t`, then shrink `left` as much as possible while keeping the window valid to record the minimum length.',
      description:
        'Given two strings s and t, return the length of the minimum window substring of s such that every character in t (including duplicates) is included in the window, or 0 if none exists.',
      example1: { input: 's = "ADOBECODEBANC", t = "ABC"', output: '4' },
      example2: { input: 's = "a", t = "aa"', output: '0' },
      functionName: 'minWindowLength',
      starterCode: `function minWindowLength(s, t) {\n  const need = {};\n  for (const c of t) need[c] = (need[c] || 0) + 1;\n  let missing = t.length, l = 0, best = Infinity;\n  for (let r = 0; r < s.length; r++) {\n    if (need[s[r]] > 0) missing--;\n    need[s[r]] = (need[s[r]] || 0) - 1;\n    while (missing === 0) {\n      best = Math.min(best, r - l + 1);\n      need[s[l]]++;\n      if (need[s[l]] > 0) missing++;\n      l++;\n    }\n  }\n  return best === Infinity ? 0 : best;\n}`,
      solutionCode: `function minWindowLength(s, t) {\n  const need = {};\n  for (const c of t) need[c] = (need[c] || 0) + 1;\n  let missing = t.length, l = 0, best = Infinity;\n  for (let r = 0; r < s.length; r++) {\n    if (need[s[r]] > 0) missing--;\n    need[s[r]] = (need[s[r]] || 0) - 1;\n    while (missing === 0) {\n      best = Math.min(best, r - l + 1);\n      need[s[l]]++;\n      if (need[s[l]] > 0) missing++;\n      l++;\n    }\n  }\n  return best === Infinity ? 0 : best;\n}`,
      testCases: [
        { label: '"ADOBECODEBANC", "ABC" -> 4 ("BANC")', args: ['ADOBECODEBANC', 'ABC'], expected: 4 },
        { label: '"a", "aa" -> 0', args: ['a', 'aa'], expected: 0 },
        { label: '"ab", "b" -> 1', args: ['ab', 'b'], expected: 1 }
      ]
    }
  ],

  'two-pointers': [
    {
      id: 'tp-1-two-sum-sorted',
      number: 1,
      title: 'Two Sum II — Input Array Is Sorted',
      difficulty: 'Easy',
      topicId: 'two-pointers',
      progressionStage: 'Stage 1: Concept Warmup',
      recommendedFirst: true,
      logicHint:
        'Start here! Place `left = 0` (smallest) and `right = nums.length - 1` (largest). If `nums[left] + nums[right] < target`, increment `left` to increase the sum; if `> target`, decrement `right` to decrease the sum.',
      description:
        'Given a 0-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number and return their indices [left, right].',
      example1: { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]' },
      example2: { input: 'nums = [2, 3, 4], target = 6', output: '[0, 2]' },
      functionName: 'twoSumSorted',
      starterCode: `function twoSumSorted(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left < right) {\n    const sum = nums[left] + nums[right];\n    if (sum === target) return [left, right];\n    if (sum < target) left++;\n    else right--;\n  }\n  return [-1, -1];\n}`,
      solutionCode: `function twoSumSorted(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left < right) {\n    const sum = nums[left] + nums[right];\n    if (sum === target) return [left, right];\n    if (sum < target) left++;\n    else right--;\n  }\n  return [-1, -1];\n}`,
      testCases: [
        { label: '[2, 7, 11, 15], target = 9 -> [0, 1]', args: [[2, 7, 11, 15], 9], expected: [0, 1] },
        { label: '[2, 3, 4], target = 6 -> [0, 2]', args: [[2, 3, 4], 6], expected: [0, 2] },
        { label: '[-1, 0], target = -1 -> [0, 1]', args: [[-1, 0], -1], expected: [0, 1] }
      ]
    },
    {
      id: 'tp-2-remove-duplicates',
      number: 2,
      title: 'Remove Duplicates from Sorted Array (Fast/Slow Pointers)',
      difficulty: 'Easy',
      topicId: 'two-pointers',
      progressionStage: 'Stage 2: Same-Direction Pointers',
      logicHint:
        'Use a slow pointer `write = 1` and a fast pointer `read = 1`. Whenever `nums[read] !== nums[read - 1]`, copy `nums[read]` to `nums[write++]`.',
      description:
        'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once and return the number of unique elements.',
      example1: { input: 'nums = [1, 1, 2]', output: '2' },
      example2: { input: 'nums = [0,0,1,1,1,2,2,3,3,4]', output: '5' },
      functionName: 'removeDuplicatesCount',
      starterCode: `function removeDuplicatesCount(nums) {\n  if (nums.length === 0) return 0;\n  let write = 1;\n  for (let read = 1; read < nums.length; read++) {\n    if (nums[read] !== nums[read - 1]) {\n      nums[write++] = nums[read];\n    }\n  }\n  return write;\n}`,
      solutionCode: `function removeDuplicatesCount(nums) {\n  if (nums.length === 0) return 0;\n  let write = 1;\n  for (let read = 1; read < nums.length; read++) {\n    if (nums[read] !== nums[read - 1]) nums[write++] = nums[read];\n  }\n  return write;\n}`,
      testCases: [
        { label: '[1, 1, 2] -> 2', args: [[1, 1, 2]], expected: 2 },
        { label: '[0,0,1,1,1,2,2,3,3,4] -> 5', args: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: 5 },
        { label: '[1, 2, 3] -> 3', args: [[1, 2, 3]], expected: 3 }
      ]
    },
    {
      id: 'tp-3-container-most-water',
      number: 3,
      title: 'Container With Most Water',
      difficulty: 'Medium',
      topicId: 'two-pointers',
      progressionStage: 'Stage 3: Greedy Pointer Pruning',
      logicHint:
        'Area is `(right - left) * Math.min(height[left], height[right])`. Since width shrinks on every step, the only way to potentially find a taller area is to move the shorter wall inward!',
      description:
        'Given an integer array height of length n, find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum area.',
      example1: { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
      example2: { input: 'height = [1, 1]', output: '1' },
      functionName: 'maxArea',
      starterCode: `function maxArea(height) {\n  let l = 0, r = height.length - 1, best = 0;\n  while (l < r) {\n    const area = (r - l) * Math.min(height[l], height[r]);\n    best = Math.max(best, area);\n    if (height[l] < height[r]) l++;\n    else r--;\n  }\n  return best;\n}`,
      solutionCode: `function maxArea(height) {\n  let l = 0, r = height.length - 1, best = 0;\n  while (l < r) {\n    best = Math.max(best, (r - l) * Math.min(height[l], height[r]));\n    if (height[l] < height[r]) l++; else r--;\n  }\n  return best;\n}`,
      testCases: [
        { label: '[1,8,6,2,5,4,8,3,7] -> 49', args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
        { label: '[1, 1] -> 1', args: [[1, 1]], expected: 1 },
        { label: '[4, 3, 2, 1, 4] -> 16', args: [[4, 3, 2, 1, 4]], expected: 16 }
      ]
    },
    {
      id: 'tp-4-three-sum-count',
      number: 4,
      title: '3Sum Unique Triplets Count',
      difficulty: 'Hard',
      topicId: 'two-pointers',
      progressionStage: 'Stage 4: Advanced Mastery',
      logicHint:
        'Sort the array first. Fix `nums[i]` in an outer loop (skipping duplicate `nums[i]` values), then run converging `left = i + 1` and `right = n - 1` pointers to find pairs summing to `-nums[i]`.',
      description:
        'Given an integer array nums, return the number of unique triplets [nums[i], nums[j], nums[k]] such that i != j != k and nums[i] + nums[j] + nums[k] === 0.',
      example1: { input: 'nums = [-1, 0, 1, 2, -1, -4]', output: '2' },
      example2: { input: 'nums = [0, 1, 1]', output: '0' },
      functionName: 'threeSumCount',
      starterCode: `function threeSumCount(nums) {\n  nums.sort((a, b) => a - b);\n  let count = 0;\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let l = i + 1, r = nums.length - 1;\n    while (l < r) {\n      const sum = nums[i] + nums[l] + nums[r];\n      if (sum === 0) {\n        count++;\n        while (l < r && nums[l] === nums[l + 1]) l++;\n        while (l < r && nums[r] === nums[r - 1]) r--;\n        l++; r--;\n      } else if (sum < 0) l++;\n      else r--;\n    }\n  }\n  return count;\n}`,
      solutionCode: `function threeSumCount(nums) {\n  nums.sort((a, b) => a - b);\n  let count = 0;\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let l = i + 1, r = nums.length - 1;\n    while (l < r) {\n      const sum = nums[i] + nums[l] + nums[r];\n      if (sum === 0) {\n        count++;\n        while (l < r && nums[l] === nums[l + 1]) l++;\n        while (l < r && nums[r] === nums[r - 1]) r--;\n        l++; r--;\n      } else if (sum < 0) l++; else r--;\n    }\n  }\n  return count;\n}`,
      testCases: [
        { label: '[-1, 0, 1, 2, -1, -4] -> 2 triplets', args: [[-1, 0, 1, 2, -1, -4]], expected: 2 },
        { label: '[0, 1, 1] -> 0', args: [[0, 1, 1]], expected: 0 },
        { label: '[0, 0, 0] -> 1', args: [[0, 0, 0]], expected: 1 }
      ]
    }
  ]
};

// Build a complete 4-tier progressive problem bank (Easy -> Medium -> Hard) for every topic
function buildProblemsForTopic(topic: TopicData): PracticeProblem[] {
  if (CURATED_TOPIC_PROBLEMS[topic.id]) {
    return CURATED_TOPIC_PROBLEMS[topic.id];
  }

  const fnBase = topic.id
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr: string) => chr.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');

  const fn1 = `${fnBase}Warmup`;
  const fn2 = `${fnBase}Core`;
  const fn3 = `${fnBase}Variation`;
  const fn4 = `${fnBase}Mastery`;

  return [
    {
      id: `${topic.id}-prob-1`,
      number: 1,
      title: `${topic.title} — Foundation Warmup`,
      difficulty: 'Easy',
      topicId: topic.id,
      progressionStage: 'Stage 1: Concept Warmup',
      recommendedFirst: true,
      logicHint: `Start here! Focus on the core mental model of ${topic.title}: ${topic.intuition} Walk through a small input of 4–5 elements and verify how the state updates on each step.`,
      description: `Apply the foundational mechanics of ${topic.title}: given an input array of numbers and a target parameter, return the count of elements that satisfy the condition val <= target in optimal ${topic.timeComplexity} time.`,
      example1: { input: 'nums = [2, 4, 6, 8, 10], target = 6', output: '3' },
      example2: { input: 'nums = [5, 12, 18], target = 4', output: '0' },
      functionName: fn1,
      starterCode: `function ${fn1}(nums, target) {\n  // Stage 1 Warmup: Count elements <= target\n  let count = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] <= target) count++;\n  }\n  return count;\n}`,
      solutionCode: `function ${fn1}(nums, target) {\n  let count = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] <= target) count++;\n  }\n  return count;\n}`,
      testCases: [
        { label: 'nums = [2, 4, 6, 8, 10], target = 6', args: [[2, 4, 6, 8, 10], 6], expected: 3 },
        { label: 'nums = [5, 12, 18], target = 4', args: [[5, 12, 18], 4], expected: 0 },
        { label: 'All match: [1, 2, 3], target = 5', args: [[1, 2, 3], 5], expected: 3 }
      ]
    },
    {
      id: `${topic.id}-prob-2`,
      number: 2,
      title: `${topic.title} — Core Pattern Application`,
      difficulty: 'Easy',
      topicId: topic.id,
      progressionStage: 'Stage 2: Core Pattern',
      logicHint: `Now build on Stage 1 by maintaining an invariant across iterations. Remember how ${topic.title} works internally: ${topic.internals}`,
      description: `Use the core ${topic.title} pattern to find the index of the first element equal to target, or return the maximum value if target is -1.`,
      example1: { input: 'nums = [3, 7, 11, 15], target = 11', output: '2' },
      example2: { input: 'nums = [4, 9, 2], target = -1', output: '9' },
      functionName: fn2,
      starterCode: `function ${fn2}(nums, target) {\n  if (target === -1) return Math.max(...nums);\n  return nums.indexOf(target);\n}`,
      solutionCode: `function ${fn2}(nums, target) {\n  if (target === -1) return Math.max(...nums);\n  return nums.indexOf(target);\n}`,
      testCases: [
        { label: 'Find 11 in [3, 7, 11, 15]', args: [[3, 7, 11, 15], 11], expected: 2 },
        { label: 'Max mode target = -1 on [4, 9, 2]', args: [[4, 9, 2], -1], expected: 9 },
        { label: 'Missing target = 99', args: [[3, 7, 11], 99], expected: -1 }
      ]
    },
    {
      id: `${topic.id}-prob-3`,
      number: 3,
      title: `${topic.title} — Boundary & Window Optimization`,
      difficulty: 'Medium',
      topicId: topic.id,
      progressionStage: 'Stage 3: Pattern Variation',
      logicHint: `Transition from Easy to Medium: avoid redundant recomputation by carrying state forward from step i-1 to step i, preserving ${topic.timeComplexity} efficiency.`,
      description: `Given an array of integers nums and window/group parameter k, compute the maximum contiguous sum of up to k elements using ${topic.title} principles.`,
      example1: { input: 'nums = [2, 1, 5, 1, 3, 2], k = 3', output: '9' },
      example2: { input: 'nums = [4, 2, 10, 3], k = 2', output: '13' },
      functionName: fn3,
      starterCode: `function ${fn3}(nums, k) {\n  let windowSum = 0;\n  for (let i = 0; i < Math.min(k, nums.length); i++) windowSum += nums[i];\n  let maxSum = windowSum;\n  for (let r = k; r < nums.length; r++) {\n    windowSum += nums[r] - nums[r - k];\n    maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum;\n}`,
      solutionCode: `function ${fn3}(nums, k) {\n  let windowSum = 0;\n  for (let i = 0; i < Math.min(k, nums.length); i++) windowSum += nums[i];\n  let maxSum = windowSum;\n  for (let r = k; r < nums.length; r++) {\n    windowSum += nums[r] - nums[r - k];\n    maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum;\n}`,
      testCases: [
        { label: 'nums = [2, 1, 5, 1, 3, 2], k = 3 -> 9', args: [[2, 1, 5, 1, 3, 2], 3], expected: 9 },
        { label: 'nums = [4, 2, 10, 3], k = 2 -> 13', args: [[4, 2, 10, 3], 2], expected: 13 },
        { label: 'Single element window k = 1 on [3, 8, 5]', args: [[3, 8, 5], 1], expected: 8 }
      ]
    },
    {
      id: `${topic.id}-prob-4`,
      number: 4,
      title: `${topic.title} — Production Scale & Edge-Case Mastery`,
      difficulty: 'Hard',
      topicId: topic.id,
      progressionStage: 'Stage 4: Advanced Mastery',
      logicHint: `Advanced Mastery: combine ${topic.title} with prefix/state tracking to handle negative values, empty ranges, and strict ${topic.spaceComplexity} memory limits.`,
      description: `Given an array of integers nums (which may include negative values), find the maximum possible sum of any non-empty contiguous subarray in O(n) time and O(1) space.`,
      example1: { input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6' },
      example2: { input: 'nums = [5, 4, -1, 7, 8]', output: '23' },
      functionName: fn4,
      starterCode: `function ${fn4}(nums) {\n  let curr = nums[0], best = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    curr = Math.max(nums[i], curr + nums[i]);\n    best = Math.max(best, curr);\n  }\n  return best;\n}`,
      solutionCode: `function ${fn4}(nums) {\n  let curr = nums[0], best = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    curr = Math.max(nums[i], curr + nums[i]);\n    best = Math.max(best, curr);\n  }\n  return best;\n}`,
      testCases: [
        { label: '[-2,1,-3,4,-1,2,1,-5,4] -> 6', args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
        { label: '[5, 4, -1, 7, 8] -> 23', args: [[5, 4, -1, 7, 8]], expected: 23 },
        { label: 'All negative [-5, -2, -9] -> -2', args: [[-5, -2, -9]], expected: -2 }
      ]
    }
  ];
}

export const PRACTICE_PROBLEMS: PracticeProblem[] = ALL_CODEFLOW_TOPICS.flatMap((topic) =>
  buildProblemsForTopic(topic)
);

export function getProblemsForTopic(topicId: string): PracticeProblem[] {
  return PRACTICE_PROBLEMS.filter((p) => p.topicId === topicId);
}
