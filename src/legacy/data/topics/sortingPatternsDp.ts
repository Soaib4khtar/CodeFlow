import { TopicDefinition } from '../../types/visualizer';

export const sortingPatternsDpTopics: TopicDefinition[] = [
  {
    id: 'sorting-quicksort-mergesort',
    title: 'Sorting Algorithms & Divide and Conquer: QuickSort Partition & MergeSort',
    shortTitle: 'Sorting & Divide/Conquer',
    category: 'sorting-searching',
    difficulty: 'Intermediate',
    summary: 'Watch Lomuto/Hoare Pivot Partitioning place elements in-place around a pivot in O(n log n) time, and compare with MergeSort stability.',
    intuitionOverview: 'Instead of comparing every item with every other item (`O(n²)` Bubble/Insertion Sort), QuickSort picks one element as a "Pivot" and partitions the array in a single sweep: everything smaller goes left of the pivot, and everything larger goes right. Now the pivot is locked in its permanent sorted spot, and we recursively sort the two halves in `O(n log n)`!',
    internalsOverview: 'Lomuto Partition maintains boundary pointer `i` for elements `<= pivot`. Scanning `j` from `low` to `high - 1` swaps `arr[j]` into `arr[i++]` whenever `arr[j] <= pivot`. MergeSort guarantees worst-case `O(n log n)` and stability by merging sorted halves via an `O(n)` auxiliary buffer.',
    realWorldUseCases: [
      'V8 `Array.prototype.sort` and Python `Timsort` (hybrid MergeSort + Insertion Sort)',
      'C++ `std::sort` (`Introsort`: QuickSort + HeapSort fallback + Insertion Sort)',
      'Database `ORDER BY` external merge-sort passes on disk pages'
    ],
    keyInvariants: [
      'Partition Invariant: At every step of `j`, `arr[low..i-1] <= pivot` and `arr[i..j-1] > pivot`.',
      'Final Pivot Placement: After swapping `pivot` into index `i`, `arr[i]` is at its exact final sorted index.'
    ],
    complexity: {
      timeBest: 'O(n log n)',
      timeAverage: 'O(n log n)',
      timeWorst: 'O(n²) Unbalanced Pivot / O(n log n) MergeSort',
      space: 'O(log n) Stack (QuickSort) / O(n) (MergeSort)',
      note: 'Randomized or median-of-three pivot selection makes O(n²) virtually impossible in practice.'
    },
    code: {
      typescript: `function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high]; // Pick last element as Pivot
  let i = low;             // Boundary for elements <= pivot
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap smaller item into left zone
      i++;
    }
  }
  [arr[i], arr[high]] = [arr[high], arr[i]]; // Lock pivot into index i!
  return i;
}`,
      python: `def partition(arr: list[int], low: int, high: int) -> int:
    pivot = arr[high]  # Pick last element as Pivot
    i = low            # Boundary for elements <= pivot
    for j in range(low, high):
        if arr[j] <= pivot:
            arr[i], arr[j] = arr[j], arr[i]
            i += 1
    arr[i], arr[high] = arr[high], arr[i]  # Lock pivot into index i!
    return i`,
      cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            swap(arr[i], arr[j]);
            i++;
        }
    }
    swap(arr[i], arr[high]);
    return i;
}`
    },
    liveSandboxCode: `const arr = [8, 3, 1, 7, 0, 10, 2];

function quickSort(a, low = 0, high = a.length - 1) {
  if (low >= high) return;
  const pivot = a[high];
  let i = low;
  for (let j = low; j < high; j++) {
    if (a[j] <= pivot) {
      [a[i], a[j]] = [a[j], a[i]];
      i++;
    }
  }
  [a[i], a[high]] = [a[high], a[i]];
  console.log(\`Pivot \${pivot} locked at idx \${i}: [\${a.join(', ')}]\`);
  quickSort(a, low, i - 1);
  quickSort(a, i + 1, high);
}

quickSort(arr);
console.log("Sorted Array:", arr);`,
    steps: [
      {
        stepNumber: 1,
        title: 'Choose Pivot = 4 (arr[4]) & Initialize Partition Pointers i=0, j=0',
        intuitionExplanation: 'We want to partition `[7, 2, 8, 1, 4]` around the last element `pivot = 4`. Pointer `j` scans every number, while `i` marks the boundary where the next number `<= 4` should be swapped.',
        internalsExplanation: '`pivot = arr[4] = 4`, `i = 0`, `j = 0`. Since `arr[0] = 7 > 4`, `i` stays at `0` while `j` advances.',
        codeLines: { typescript: [2, 3, 4, 5], python: [2, 3, 4, 5], cpp: [2, 3, 4, 5] },
        timeDelta: '1 comparison',
        spaceDelta: 'O(1) in-place',
        array: [
          { index: 0, value: 7, state: 'comparing', subLabel: '7 > 4 (skip)' },
          { index: 1, value: 2, state: 'default' },
          { index: 2, value: 8, state: 'default' },
          { index: 3, value: 1, state: 'default' },
          { index: 4, value: 4, state: 'pivot', subLabel: 'PIVOT' }
        ],
        pointers: [{ name: 'i', index: 0, color: 'indigo' }, { name: 'j', index: 0, color: 'amber' }],
        callStack: [{ funcName: 'partition', args: 'low=0, high=4', locals: { pivot: 4, i: 0, j: 0 }, status: 'active' }],
        heap: [{ address: '0xQS00', type: 'Int32[5]', label: 'arr', value: '[7, 2, 8, 1, 4]', highlight: true }],
        variables: { pivot: 4, i: 0, j: 0, 'arr[j]': 7 }
      },
      {
        stepNumber: 2,
        title: 'Sweep j=1 (val=2) and j=3 (val=1): Swap Elements <= 4 into Left Zone',
        intuitionExplanation: 'At `j = 1`, `2 <= 4`, so we swap `2` into `arr[i=0]` and advance `i=1`. At `j = 2`, `8 > 4` is skipped. At `j = 3`, `1 <= 4`, so we swap `1` into `arr[i=1]` and advance `i=2`. Now `[2, 1]` are gathered on the left and `[8, 7]` on the right!',
        internalsExplanation: 'Two swaps executed: `swap(arr[0], arr[1])` and `swap(arr[1], arr[3])`. Boundary `i` is now `2`.',
        codeLines: { typescript: [5, 6, 7], python: [5, 6, 7], cpp: [5, 6, 7] },
        timeDelta: '3 comparisons, 2 swaps',
        spaceDelta: 'O(1)',
        array: [
          { index: 0, value: 2, state: 'window', subLabel: '<= 4 zone' },
          { index: 1, value: 1, state: 'window', subLabel: '<= 4 zone' },
          { index: 2, value: 8, state: 'comparing', subLabel: '> 4 zone' },
          { index: 3, value: 7, state: 'comparing', subLabel: '> 4 zone' },
          { index: 4, value: 4, state: 'pivot', subLabel: 'PIVOT' }
        ],
        pointers: [{ name: 'i', index: 2, color: 'indigo' }, { name: 'j', index: 3, color: 'amber' }],
        callStack: [{ funcName: 'partition', args: 'low=0, high=4', locals: { pivot: 4, i: 2, j: 3 }, status: 'active' }],
        heap: [{ address: '0xQS00', type: 'Int32[5]', label: 'arr', value: '[2, 1, 8, 7, 4]', highlight: true }],
        variables: { pivot: 4, i: 2, j: 3, leftZone: '[2, 1]', rightZone: '[8, 7]' }
      },
      {
        stepNumber: 3,
        title: 'Final Swap: Place Pivot 4 at Index i = 2 -> Permanently Sorted!',
        intuitionExplanation: 'Finally, we swap `pivot (4)` with `arr[i=2] (8)`. Now `4` sits at index `2`: everything to its left (`[2, 1]`) is smaller, and everything to its right (`[7, 8]`) is larger! Index `2` is `4`’s permanent sorted home.',
        internalsExplanation: '`swap(arr[2], arr[4])` places `4` at index `2` and returns `2`. Divide-and-conquer now recurses on `[0..1]` and `[3..4]`.',
        codeLines: { typescript: [10, 11], python: [8, 9], cpp: [10, 11] },
        timeDelta: 'O(n) partition pass',
        spaceDelta: 'Pivot locked at idx 2',
        array: [
          { index: 0, value: 2, state: 'window', subLabel: '< 4' },
          { index: 1, value: 1, state: 'window', subLabel: '< 4' },
          { index: 2, value: 4, state: 'found', subLabel: 'LOCKED PIVOT!' },
          { index: 3, value: 7, state: 'visited', subLabel: '> 4' },
          { index: 4, value: 8, state: 'visited', subLabel: '> 4' }
        ],
        pointers: [{ name: 'pivotIdx', index: 2, color: 'emerald' }],
        callStack: [{ funcName: 'partition', args: 'low=0, high=4', locals: { pivotIndex: 2 }, status: 'returning' }],
        heap: [{ address: '0xQS00', type: 'Int32[5]', label: 'arr', value: '[2, 1, 4, 7, 8]', highlight: true }],
        variables: { lockedPivotIndex: 2, pivotValue: 4, partitionedArray: '[2, 1, | 4 |, 7, 8]' }
      }
    ]
  },
  {
    id: 'binary-search-monotonic-space',
    title: 'Searching Algorithms & Binary Search: Halving Search Space in O(log n)',
    shortTitle: 'Binary Search',
    category: 'sorting-searching',
    difficulty: 'Beginner',
    summary: 'Watch L, Mid, and R pointers cut the search interval in half at every step—finding a target in 1,000,000 items in at most 20 comparisons.',
    intuitionOverview: 'If someone picks a secret number between 1 and 100, you don’t guess 1, 2, 3... You guess `50`! If they say "Higher", you instantly throw away `1..50` and guess `75`. Binary Search works on any sorted array or monotonic condition, cutting the remaining search space in half every single step (`O(log₂ n)`).',
    internalsOverview: 'Uses `mid = low + ((high - low) >> 1)` to prevent 32-bit signed integer overflow (`(low + high)` can overflow when `low + high > 2^31 - 1`). At each step, the active interval `[low..high]` shrinks by half.',
    realWorldUseCases: [
      'Git `git bisect` to pinpoint which commit introduced a bug in O(log N) tests',
      'Database B-Tree page directory lookups & timestamp log searching',
      'Binary Search on Answer (e.g., Koko Eating Bananas, Capacity to Ship Packages)'
    ],
    keyInvariants: [
      'Search Space Invariant: If `target` exists in the array, it is guaranteed to lie within the closed interval `[low..high]`.',
      'Overflow-Safe Midpoint: Always compute `mid = low + Math.floor((high - low) / 2)`.'
    ],
    complexity: {
      timeBest: 'O(1) Mid Hit',
      timeAverage: 'O(log n)',
      timeWorst: 'O(log n)',
      space: 'O(1) Iterative',
      note: 'For n = 1,000,000,000 (1 billion items), log₂(n) is at most 30 comparisons!'
    },
    code: {
      typescript: `function binarySearch(nums: number[], target: number): number {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    const mid = low + ((high - low) >> 1); // Overflow-safe midpoint
    if (nums[mid] === target) return mid;  // Target found!
    if (nums[mid] < target) {
      low = mid + 1;  // Discard left half [low..mid]
    } else {
      high = mid - 1; // Discard right half [mid..high]
    }
  }
  return -1;
}`,
      python: `def binary_search(nums: list[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1   # Discard left half
        else:
            high = mid - 1  # Discard right half
    return -1`,
      cpp: `int binarySearch(const vector<int>& nums, int target) {
    int low = 0, high = (int)nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2; // Prevents int overflow
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`
    },
    liveSandboxCode: `const nums = [2, 5, 8, 12, 16, 23, 38, 56, 72];
const target = 23;

let low = 0, high = nums.length - 1, step = 1;
while (low <= high) {
  const mid = low + ((high - low) >> 1);
  console.log(\`Step \${step++}: [low=\${low}, high=\${high}] -> mid=\${mid} (val=\${nums[mid]})\`);
  if (nums[mid] === target) {
    console.log(\`Found target \${target} at index \${mid}!\`);
    break;
  }
  if (nums[mid] < target) low = mid + 1;
  else high = mid - 1;
}`,
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Search [0..6] for target = 23 -> Mid is Index 3 (val = 12)',
        intuitionExplanation: 'We want to find `23` in `[2, 5, 8, 12, 16, 23, 38]`. `low = 0`, `high = 6`, so `mid = 3` (`nums[3] = 12`). Since `12 < 23` and the array is sorted, `23` CANNOT be at index `0, 1, 2, or 3`! We discard the entire left half in 1 step.',
        internalsExplanation: '`mid = 0 + (6 - 0) >> 1 = 3`. `nums[3] = 12 < 23`, so `low` jumps to `mid + 1 = 4`.',
        codeLines: { typescript: [2, 3, 4, 6, 7], python: [2, 3, 4, 7, 8], cpp: [2, 3, 4, 6] },
        timeDelta: '1 comparison',
        spaceDelta: 'O(1)',
        array: [
          { index: 0, value: 2, state: 'window' },
          { index: 1, value: 5, state: 'window' },
          { index: 2, value: 8, state: 'window' },
          { index: 3, value: 12, state: 'active', subLabel: '12 < 23 (Go Right)' },
          { index: 4, value: 16, state: 'window' },
          { index: 5, value: 23, state: 'window' },
          { index: 6, value: 38, state: 'window' }
        ],
        pointers: [
          { name: 'low', index: 0, color: 'indigo' },
          { name: 'mid', index: 3, color: 'amber' },
          { name: 'high', index: 6, color: 'rose' }
        ],
        callStack: [{ funcName: 'binarySearch', args: 'target=23', locals: { low: 0, mid: 3, high: 6, 'nums[mid]': 12 }, status: 'active' }],
        heap: [{ address: '0xBS00', type: 'Int32[7]', label: 'nums', value: '[2, 5, 8, 12, 16, 23, 38]', highlight: true }],
        variables: { target: 23, low: 0, mid: 3, high: 6, comparison: '12 < 23 -> low = 4' }
      },
      {
        stepNumber: 2,
        title: 'Step 2: Left Half Discarded! Search [4..6] -> Mid is Index 5 (val = 23) -> Match!',
        intuitionExplanation: 'With `low = 4` and `high = 6`, our new midpoint is `mid = 4 + Math.floor((6 - 4) / 2) = 5`. We check `nums[5]`—and it is `23`! We found our target in just 2 comparisons!',
        internalsExplanation: 'Indices `0..3` are pruned. New `mid = 5`. `nums[5] === 23` matches `target`, returning index `5` immediately.',
        codeLines: { typescript: [4, 5], python: [4, 5, 6], cpp: [4, 5] },
        timeDelta: 'Total: 2 comparisons (O(log n))',
        spaceDelta: 'O(1)',
        array: [
          { index: 0, value: 2, state: 'discarded', subLabel: 'Pruned' },
          { index: 1, value: 5, state: 'discarded', subLabel: 'Pruned' },
          { index: 2, value: 8, state: 'discarded', subLabel: 'Pruned' },
          { index: 3, value: 12, state: 'discarded', subLabel: 'Pruned' },
          { index: 4, value: 16, state: 'window' },
          { index: 5, value: 23, state: 'found', subLabel: 'MATCH! (idx 5)' },
          { index: 6, value: 38, state: 'window' }
        ],
        pointers: [
          { name: 'low', index: 4, color: 'indigo' },
          { name: 'mid', index: 5, color: 'emerald' },
          { name: 'high', index: 6, color: 'rose' }
        ],
        callStack: [{ funcName: 'binarySearch', args: 'target=23', locals: { low: 4, mid: 5, high: 6, returnVal: 5 }, status: 'returning' }],
        heap: [{ address: '0xBS00', type: 'Int32[7]', label: 'nums', value: 'Hit at nums[5] = 23', highlight: true }],
        variables: { target: 23, low: 4, mid: 5, high: 6, foundIndex: 5 }
      }
    ]
  },
  {
    id: 'two-pointers-sliding-window-prefix-sum',
    title: 'Two Pointers, Sliding Window & Prefix Sums: Subarray Optimization Patterns',
    shortTitle: 'Two Pointers & Sliding Window',
    category: 'algorithmic-patterns',
    difficulty: 'Intermediate',
    summary: 'Master the 3 core linear-time array patterns: converging Two Pointers, expanding/shrinking Sliding Window, and O(1) Prefix Sum range queries.',
    intuitionOverview: 'Why recompute a window’s sum from scratch when sliding one step right only adds 1 new number on the right (`R`) and drops 1 old number on the left (`L`)? Sliding Window, Two Pointers, and Prefix Sums turn slow `O(n²)` subarray loops into a single `O(n)` caterpillar crawl!',
    internalsOverview: 'In Variable-Size Sliding Window, `R` increments `n` times and `L` increments at most `n` times (`<= 2n` pointer moves total). Prefix Sums precompute `P[i+1] = P[i] + nums[i]` so any subarray sum `sum(L..R)` is computed in O(1) via `P[R+1] - P[L]`.',
    realWorldUseCases: [
      'API Rate Limiting (Sliding Window Counter for max requests per 60 seconds)',
      'TCP Sliding Window flow control & network packet congestion control',
      'Time-series moving averages and Prefix Sum range analytics'
    ],
    keyInvariants: [
      'Sliding Window Invariant: The active window `[L..R]` always maintains the validity constraint after the inner `while` shrink loop completes.',
      'Prefix Sum Identity: `sum(nums[L..R]) === prefix[R + 1] - prefix[L]`.'
    ],
    complexity: {
      timeBest: 'O(n)',
      timeAverage: 'O(n) (At most 2n steps)',
      timeWorst: 'O(n)',
      space: 'O(1) Window / O(n) Prefix Sum',
      note: 'Both L and R only move forward (0 -> n), never backward!'
    },
    code: {
      typescript: `// Longest Subarray with Sum <= k (Sliding Window)
function maxSubarrayLen(nums: number[], k: number): number {
  let L = 0, windowSum = 0, maxLen = 0;
  for (let R = 0; R < nums.length; R++) {
    windowSum += nums[R]; // 1. Expand window right
    while (windowSum > k) {
      windowSum -= nums[L]; // 2. Shrink window from left until valid
      L++;
    }
    maxLen = Math.max(maxLen, R - L + 1);
  }
  return maxLen;
}`,
      python: `def max_subarray_len(nums: list[int], k: int) -> int:
    L = window_sum = max_len = 0
    for R, val in enumerate(nums):
        window_sum += val  # 1. Expand window right
        while window_sum > k:
            window_sum -= nums[L]  # 2. Shrink window from left
            L += 1
        max_len = max(max_len, R - L + 1)
    return max_len`,
      cpp: `int maxSubarrayLen(const vector<int>& nums, int k) {
    int L = 0, windowSum = 0, maxLen = 0;
    for (int R = 0; R < nums.size(); R++) {
        windowSum += nums[R];
        while (windowSum > k) {
            windowSum -= nums[L++];
        }
        maxLen = max(maxLen, R - L + 1);
    }
    return maxLen;
}`
    },
    liveSandboxCode: `const nums = [3, 1, 2, 7, 4, 2];
const k = 8;

let L = 0, sum = 0, best = 0;
for (let R = 0; R < nums.length; R++) {
  sum += nums[R];
  while (sum > k) {
    console.log(\`  Window [\${L}..\${R}] sum=\${sum} > \${k} -> shrink L=\${L} (drop \${nums[L]})\`);
    sum -= nums[L++];
  }
  best = Math.max(best, R - L + 1);
  console.log(\`Valid Window [\${L}..\${R}] = [\${nums.slice(L, R+1)}] (sum=\${sum}, len=\${R-L+1})\`);
}
console.log("Max Valid Window Length:", best);`,
    steps: [
      {
        stepNumber: 1,
        title: 'Expand Window Right: [L=0..R=2] -> [3, 1, 2] (windowSum = 6 <= 8)',
        intuitionExplanation: 'We want the longest subarray with sum `<= 8`. Expanding `R` from `0` to `2` includes `[3, 1, 2]`. Its sum is `3 + 1 + 2 = 6 <= 8`, which is valid! `maxLen` becomes `3`.',
        internalsExplanation: '`L = 0, R = 2`. `windowSum = 6 <= k (8)`. Auxiliary Prefix Sum array `P = [0, 3, 4, 6, 13, 17]` also confirms `P[3] - P[0] = 6`.',
        codeLines: { typescript: [4, 5, 10], python: [3, 4, 8], cpp: [3, 4, 8] },
        timeDelta: '3 R expansions',
        spaceDelta: 'O(1) window state',
        array: [
          { index: 0, value: 3, state: 'window', subLabel: 'In Window' },
          { index: 1, value: 1, state: 'window', subLabel: 'In Window' },
          { index: 2, value: 2, state: 'active', subLabel: 'R (sum=6)' },
          { index: 3, value: 7, state: 'default' },
          { index: 4, value: 4, state: 'default' }
        ],
        auxiliaryArray: {
          label: 'Prefix Sums P[i] (O(1) Range Sum = P[R+1] - P[L])',
          cells: [
            { index: 0, value: 0, state: 'active', subLabel: 'P[0]' },
            { index: 1, value: 3, state: 'default', subLabel: 'P[1]' },
            { index: 2, value: 4, state: 'default', subLabel: 'P[2]' },
            { index: 3, value: 6, state: 'found', subLabel: 'P[3]-P[0]=6' },
            { index: 4, value: 13, state: 'default', subLabel: 'P[4]' },
            { index: 5, value: 17, state: 'default', subLabel: 'P[5]' }
          ]
        },
        pointers: [{ name: 'L', index: 0, color: 'indigo' }, { name: 'R', index: 2, color: 'emerald' }],
        callStack: [{ funcName: 'maxSubarrayLen', args: 'nums, k=8', locals: { L: 0, R: 2, windowSum: 6, maxLen: 3 }, status: 'active' }],
        heap: [{ address: '0xSW00', type: 'WindowState', label: 'Active [0..2]', value: '[3, 1, 2] -> sum = 6 <= 8', highlight: true }],
        variables: { L: 0, R: 2, windowSum: 6, k: 8, maxLen: 3 }
      },
      {
        stepNumber: 2,
        title: 'R=3 Adds 7 (windowSum = 13 > 8) -> Shrink Left Until Valid!',
        intuitionExplanation: 'When `R` steps to index `3` (`val = 7`), `windowSum` jumps to `6 + 7 = 13 > 8` (invalid!). The `while` loop shrinks `L` forward: dropping `3`, `1`, and `2` until `L = 3`, leaving `[7]` (`windowSum = 7 <= 8`). Notice we never moved `R` backward!',
        internalsExplanation: '`windowSum = 13 > 8`. `L` advances `0 -> 1 -> 2 -> 3`, subtracting `3, 1, 2` in O(1) each. Window `[3..3]` has `windowSum = 7 <= 8`.',
        codeLines: { typescript: [5, 6, 7, 8], python: [4, 5, 6, 7], cpp: [4, 5, 6] },
        timeDelta: '1 R step + 3 L steps',
        spaceDelta: 'O(1)',
        array: [
          { index: 0, value: 3, state: 'discarded', subLabel: 'Dropped (-3)' },
          { index: 1, value: 1, state: 'discarded', subLabel: 'Dropped (-1)' },
          { index: 2, value: 2, state: 'discarded', subLabel: 'Dropped (-2)' },
          { index: 3, value: 7, state: 'found', subLabel: 'L=R=3 (sum=7)' },
          { index: 4, value: 4, state: 'default' }
        ],
        pointers: [{ name: 'L', index: 3, color: 'amber' }, { name: 'R', index: 3, color: 'emerald' }],
        callStack: [{ funcName: 'maxSubarrayLen', args: 'nums, k=8', locals: { L: 3, R: 3, windowSum: 7, maxLen: 3 }, status: 'returning' }],
        heap: [{ address: '0xSW00', type: 'WindowState', label: 'Active [3..3]', value: '[7] -> sum = 7 <= 8', highlight: true }],
        variables: { L: 3, R: 3, windowSum: 7, k: 8, maxLen: 3 }
      }
    ]
  },
  {
    id: 'intervals-bit-manipulation',
    title: 'Interval Merging & Bit Manipulation Tricks (XOR, Masks & Lowest Set Bit)',
    shortTitle: 'Intervals & Bitwise Ops',
    category: 'algorithmic-patterns',
    difficulty: 'Intermediate',
    summary: 'See how sorting intervals by start time merges overlaps in O(n log n), and how CPU bitwise gates (XOR, n & (n-1)) solve problems in 1 cycle.',
    intuitionOverview: 'When calendar meetings overlap (`[1, 4]` and `[2, 6]`), sorting by start time guarantees that any overlapping intervals sit right next to each other (`next.start <= curr.end`)! Meanwhile, Bit Manipulation operates directly on binary 0s and 1s in CPU registers—like using `a ^ a = 0` (XOR) to cancel out duplicate numbers in O(1) space.',
    internalsOverview: 'Interval merging sorts by `a[0] - b[0]` in `O(n log n)` and merges adjacent intervals when `curr[0] <= prev[1]` via `prev[1] = Math.max(prev[1], curr[1])`. Bitwise `n & (n - 1)` clears the lowest set bit in 1 ALU clock cycle.',
    realWorldUseCases: [
      'Google Calendar / Outlook busy-slot consolidation & meeting room scheduling',
      'Unix file permission bitmasks (`chmod 755`, `READ | WRITE | EXEC`)',
      'Cryptography, RAID parity recovery (`A ^ B = Parity`), and network subnet masks'
    ],
    keyInvariants: [
      'Sorted Overlap Condition: After sorting by `start`, `B` overlaps `A` if and only if `B.start <= A.end`.',
      'XOR Self-Inverse Identity: `x ^ x = 0` and `x ^ 0 = x` (commutative & associative).'
    ],
    complexity: {
      timeBest: 'O(1) Bitwise / O(n log n) Intervals',
      timeAverage: 'O(n log n)',
      timeWorst: 'O(n log n)',
      space: 'O(1) Bitwise / O(n) Merged Output',
      note: 'Bitwise operations execute in a single CPU clock cycle with zero heap allocation.'
    },
    code: {
      typescript: `// 1. Merge Overlapping Intervals
function mergeIntervals(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]); // Sort by start time
  const merged: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const prev = merged[merged.length - 1];
    if (intervals[i][0] <= prev[1]) {
      prev[1] = Math.max(prev[1], intervals[i][1]); // Overlap! Extend end
    } else {
      merged.push(intervals[i]); // Disjoint interval
    }
  }
  return merged;
}`,
      python: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)  # Overlap!
        else:
            merged.append([start, end])
    return merged`,
      cpp: `vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged = {intervals[0]};
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] <= merged.back()[1])
            merged.back()[1] = max(merged.back()[1], intervals[i][1]);
        else
            merged.push_back(intervals[i]);
    }
    return merged;
}`
    },
    liveSandboxCode: `// 1. Interval Merging
const meetings = [[1, 4], [2, 6], [8, 10], [9, 12]];
meetings.sort((a, b) => a[0] - b[0]);
const merged = [meetings[0]];
for (let i = 1; i < meetings.length; i++) {
  const prev = merged[merged.length - 1];
  if (meetings[i][0] <= prev[1]) prev[1] = Math.max(prev[1], meetings[i][1]);
  else merged.push(meetings[i]);
}
console.log("Merged Meetings:", JSON.stringify(merged));

// 2. Bitwise XOR Single Number & Brian Kernighan's Set Bit Count
const nums = [4, 1, 2, 1, 2];
const unique = nums.reduce((acc, x) => acc ^ x, 0);
console.log("XOR Unique Number in [4,1,2,1,2]:", unique, "(binary:", unique.toString(2) + ")");`,
    steps: [
      {
        stepNumber: 1,
        title: 'Sort Intervals & Detect Overlap: [1, 4] and [2, 6] -> 2 <= 4!',
        intuitionExplanation: 'Sorted intervals: `[1, 4], [2, 6], [8, 10]`. Comparing `[2, 6]` with `prev = [1, 4]`: since `2 <= 4`, the second meeting starts before the first ends! We merge them into `[1, max(4, 6)] = [1, 6]`.',
        internalsExplanation: '`intervals[1][0] (2) <= prev[1] (4)` is true. Mutates `prev[1] = Math.max(4, 6) = 6` in-place.',
        codeLines: { typescript: [3, 4, 6, 7, 8], python: [2, 3, 4, 5, 6], cpp: [2, 3, 4, 5, 6] },
        timeDelta: 'O(n log n) sort + O(1) merge',
        spaceDelta: 'merged: [[1, 6]]',
        array: [
          { index: 0, value: '[1, 4]', state: 'window', subLabel: 'prev' },
          { index: 1, value: '[2, 6]', state: 'active', subLabel: '2 <= 4 (Overlap!)' },
          { index: 2, value: '[8, 10]', state: 'default', subLabel: '8 > 6 (Disjoint)' }
        ],
        auxiliaryArray: {
          label: 'Bitwise Register Demo: XOR Cancellation (4 ^ 1 ^ 2 ^ 1 ^ 2 = 4)',
          cells: [
            { index: 0, value: '0100₂ (4)', state: 'active', subLabel: 'acc=4' },
            { index: 1, value: '^ 0001₂ (1)', state: 'window', subLabel: 'acc=5' },
            { index: 2, value: '^ 0001₂ (1)', state: 'sorted', subLabel: '1^1 cancels!' },
            { index: 3, value: '= 0100₂ (4)', state: 'found', subLabel: 'Unique = 4' }
          ]
        },
        callStack: [{ funcName: 'mergeIntervals', args: '[[1,4],[2,6],[8,10]]', locals: { prev: '[1, 6]', curr: '[2, 6]' }, status: 'active' }],
        heap: [{ address: '0xIN00', type: 'Interval[]', label: 'merged', value: '[ [1, 6], [8, 10] ]', highlight: true }],
        variables: { mergedInterval: '[1, 6]', disjointNext: '[8, 10]', xorResult: '4 (0100₂)' }
      }
    ]
  },
  {
    id: 'dp-greedy-backtracking',
    title: 'Dynamic Programming, Memoization, Tabulation, Greedy & Backtracking',
    shortTitle: 'DP, Greedy & Backtracking',
    category: 'dp-greedy-backtracking',
    difficulty: 'Advanced',
    summary: 'See how DP Tabulation eliminates exponential overlapping subproblems in a 2D state table, and compare with Backtracking state-space pruning.',
    intuitionOverview: 'Recursion without memory solves the exact same subproblems over and over (`O(2^n)`). Dynamic Programming (DP) stores the answer to each subproblem in a table so we never compute it twice! At each cell `(item, capacity)`, we make one simple choice: exclude the item (copy row above) or include it (`val + dp[i-1][w - weight]`).',
    internalsOverview: '0/1 Knapsack DP transition: `dp[i][w] = Math.max(dp[i-1][w], val[i] + dp[i-1][w - wt[i]])`. Converts `O(2^n)` brute-force subset backtracking into `O(n * W)` pseudo-polynomial time.',
    realWorldUseCases: [
      'Git diff / React Virtual DOM reconciliation (Longest Common Subsequence / Edit Distance DP)',
      'Resource allocation, cloud VM bin packing, and financial portfolio optimization',
      'Constraint satisfaction solvers (Sudoku, N-Queens, Router PCB layout via Backtracking)'
    ],
    keyInvariants: [
      'Optimal Substructure: An optimal solution to `(i, w)` is constructed from optimal solutions to smaller subproblems `(i-1, w)` and `(i-1, w-wt)`.',
      'Backtracking Triad: `1. Choose -> 2. Explore(recurse) -> 3. Unchoose (undo mutation)`.'
    ],
    complexity: {
      timeBest: 'O(n * W) DP',
      timeAverage: 'O(n * W) vs O(2^n) Brute Force',
      timeWorst: 'O(n * W)',
      space: 'O(n * W) 2D Table (or O(W) 1D Row)',
      note: 'Memoization (Top-Down) and Tabulation (Bottom-Up) compute the same state transitions.'
    },
    code: {
      typescript: `// 0/1 Knapsack Bottom-Up DP Tabulation
function knapsackDP(weights: number[], values: number[], W: number): number {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    const wt = weights[i - 1], val = values[i - 1];
    for (let w = 1; w <= W; w++) {
      if (wt <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], val + dp[i - 1][w - wt]); // Max(Skip, Take)
      } else {
        dp[i][w] = dp[i - 1][w]; // Too heavy: must skip
      }
    }
  }
  return dp[n][W];
}`,
      python: `def knapsack_dp(weights: list[int], values: list[int], W: int) -> int:
    n = len(weights)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        wt, val = weights[i - 1], values[i - 1]
        for w in range(1, W + 1):
            if wt <= w:
                dp[i][w] = max(dp[i - 1][w], val + dp[i - 1][w - wt])
            else:
                dp[i][w] = dp[i - 1][w]
    return dp[n][W]`,
      cpp: `int knapsackDP(const vector<int>& wt, const vector<int>& val, int W) {
    int n = wt.size();
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            dp[i][w] = dp[i-1][w];
            if (wt[i-1] <= w)
                dp[i][w] = max(dp[i][w], val[i-1] + dp[i-1][w - wt[i-1]]);
        }
    }
    return dp[n][W];
}`
    },
    liveSandboxCode: `const weights = [1, 2, 3];
const values  = [6, 10, 12];
const W = 4;

const dp = Array.from({ length: weights.length + 1 }, () => new Array(W + 1).fill(0));
for (let i = 1; i <= weights.length; i++) {
  const wt = weights[i - 1], val = values[i - 1];
  for (let w = 1; w <= W; w++) {
    dp[i][w] = wt <= w ? Math.max(dp[i - 1][w], val + dp[i - 1][w - wt]) : dp[i - 1][w];
  }
  console.log(\`Row i=\${i} (wt=\${wt}, val=\${val}): [\${dp[i].join(', ')}]\`);
}
console.log("Optimal Max Value for Capacity 4:", dp[weights.length][W]);`,
    steps: [
      {
        stepNumber: 1,
        title: 'Fill Row 1 (Item 1: wt=1, val=6) & Row 2 (Item 2: wt=2, val=10)',
        intuitionExplanation: 'With Item 1 (`wt=1, val=6`), any capacity `w >= 1` can hold it for value `6`. In Row 2 (`wt=2, val=10`), at capacity `w = 3`, we take Item 2 (`val=10`) PLUS the best from remaining capacity `3 - 2 = 1` in Row 1 (`dp[1][1] = 6`), giving `10 + 6 = 16`!',
        internalsExplanation: '`dp[2][3] = max(dp[1][3]=6, 10 + dp[1][3-2]=16) = 16`. Subproblem `dp[1][1]` is looked up in O(1) from the table.',
        codeLines: { typescript: [5, 6, 7, 8, 9], python: [4, 5, 6, 7, 8], cpp: [4, 5, 6, 7, 8] },
        timeDelta: 'O(1) cell transition',
        spaceDelta: '4x5 DP Matrix',
        matrix: {
          rowHeaders: ['0: None', '1: (w=1,v=6)', '2: (w=2,v=10)', '3: (w=3,v=12)'],
          colHeaders: ['w=0', 'w=1', 'w=2', 'w=3', 'w=4'],
          cells: [
            [
              { row: 0, col: 0, value: 0 }, { row: 0, col: 1, value: 0 }, { row: 0, col: 2, value: 0 }, { row: 0, col: 3, value: 0 }, { row: 0, col: 4, value: 0 }
            ],
            [
              { row: 1, col: 0, value: 0 }, { row: 1, col: 1, value: 6, state: 'lookup' }, { row: 1, col: 2, value: 6 }, { row: 1, col: 3, value: 6, state: 'lookup' }, { row: 1, col: 4, value: 6 }
            ],
            [
              { row: 2, col: 0, value: 0 }, { row: 2, col: 1, value: 6 }, { row: 2, col: 2, value: 10 }, { row: 2, col: 3, value: 16, state: 'active' }, { row: 2, col: 4, value: 16, state: 'computed' }
            ],
            [
              { row: 3, col: 0, value: 0 }, { row: 3, col: 1, value: 0 }, { row: 3, col: 2, value: 0 }, { row: 3, col: 3, value: 0 }, { row: 3, col: 4, value: 0 }
            ]
          ]
        },
        callStack: [{ funcName: 'knapsackDP', args: 'W=4', locals: { i: 2, w: 3, skip: 6, take: '10 + dp[1][1] = 16' }, status: 'active' }],
        heap: [{ address: '0xDP00', type: 'Int32[4][5]', label: 'dp', value: 'Row 2 computed: [0, 6, 10, 16, 16]', highlight: true }],
        variables: { item: '2 (wt=2, val=10)', capacityW: 3, formula: 'max(6, 10 + 6) = 16' }
      },
      {
        stepNumber: 2,
        title: 'Compute Final Optimal Cell dp[3][4] = max(16, 12 + dp[2][1]) = 18!',
        intuitionExplanation: 'At the bottom-right cell `dp[3][4]` (Item 3: `wt=3, val=12`, capacity `w=4`), we compare skipping Item 3 (`dp[2][4] = 16`) vs. taking Item 3 (`12 + dp[2][4 - 3] = 12 + 6 = 18`). `18 > 16`, so the optimal value is `18`!',
        internalsExplanation: '`dp[3][4] = Math.max(dp[2][4] (16), 12 + dp[2][1] (6)) = 18`. Completed in `3 * 4 = 12` table lookups.',
        codeLines: { typescript: [8, 9, 15], python: [7, 8, 11], cpp: [7, 8, 11] },
        timeDelta: 'Total: O(n * W)',
        spaceDelta: 'Optimal = 18',
        matrix: {
          rowHeaders: ['0: None', '1: (w=1,v=6)', '2: (w=2,v=10)', '3: (w=3,v=12)'],
          colHeaders: ['w=0', 'w=1', 'w=2', 'w=3', 'w=4'],
          cells: [
            [
              { row: 0, col: 0, value: 0 }, { row: 0, col: 1, value: 0 }, { row: 0, col: 2, value: 0 }, { row: 0, col: 3, value: 0 }, { row: 0, col: 4, value: 0 }
            ],
            [
              { row: 1, col: 0, value: 0 }, { row: 1, col: 1, value: 6 }, { row: 1, col: 2, value: 6 }, { row: 1, col: 3, value: 6 }, { row: 1, col: 4, value: 6 }
            ],
            [
              { row: 2, col: 0, value: 0 }, { row: 2, col: 1, value: 6, state: 'lookup' }, { row: 2, col: 2, value: 10 }, { row: 2, col: 3, value: 16 }, { row: 2, col: 4, value: 16, state: 'lookup' }
            ],
            [
              { row: 3, col: 0, value: 0 }, { row: 3, col: 1, value: 6 }, { row: 3, col: 2, value: 10 }, { row: 3, col: 3, value: 16 }, { row: 3, col: 4, value: 18, state: 'optimal' }
            ]
          ]
        },
        callStack: [{ funcName: 'knapsackDP', args: 'W=4', locals: { i: 3, w: 4, optimalAnswer: 18 }, status: 'returning' }],
        heap: [{ address: '0xDP00', type: 'Int32[4][5]', label: 'dp[3][4]', value: '18 (Item 1 + Item 3)', highlight: true }],
        variables: { optimalValue: 18, chosenItems: 'Item 1 (w=1,v=6) + Item 3 (w=3,v=12)', totalWeight: 4 }
      }
    ]
  }
];
