import { TopicDefinition } from '../../types/visualizer';

export const foundationsAndLinearTopics: TopicDefinition[] = [
  {
    id: 'memory-callstack-recursion',
    title: 'Variables, Memory Management, Call Stack & Recursion',
    shortTitle: 'Call Stack & Memory',
    category: 'foundations-memory',
    difficulty: 'Beginner',
    summary: 'See how variables live in Stack Frames vs. Heap Memory, and how recursive function calls allocate and unwind stack frames step-by-step.',
    intuitionOverview: 'Think of the Call Stack like a stack of sticky notes on your desk. Every time a function is called, you place a new note on top with its own local variables. When the function finishes (`return`), you rip off the top note and hand its answer back to the note underneath.',
    internalsOverview: 'In modern runtimes (V8, CPython, JVM, or native x86-64), each thread has a contiguous Call Stack growing downward in memory. A function invocation pushes a Stack Frame containing parameters, local primitives, and the Instruction Pointer (return address). Reference objects are allocated dynamically on the Heap, with 64-bit pointers stored in the stack frame.',
    realWorldUseCases: [
      'Debugging StackOverflowError in deep recursive tree/DOM traversals',
      'Understanding pass-by-value vs. pass-by-reference (shallow vs. deep copy bugs)',
      'Preventing memory leaks from dangling closures or uncleaned Heap references'
    ],
    keyInvariants: [
      'LIFO (Last-In, First-Out): Only the top-most stack frame is actively executing at any CPU cycle.',
      'Base Case Guarantee: Every recursive function must progress toward a base case before exhausting stack space.'
    ],
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(n) Stack Frames',
      note: 'Each recursive call consumes O(1) stack frame memory, totaling O(n) call stack depth.'
    },
    code: {
      typescript: `function factorial(n: number, memoRef: { calls: number }): number {
  memoRef.calls += 1; // Mutates Heap object via pointer
  if (n <= 1) {
    return 1; // Base case reached: start unwinding stack
  }
  const subResult = factorial(n - 1, memoRef);
  const result = n * subResult;
  return result;
}

const stats = { calls: 0 }; // Allocated on Heap (0x7F01)
const ans = factorial(3, stats);`,
      python: `def factorial(n: int, memo_ref: dict) -> int:
    memo_ref["calls"] += 1  # Mutates Heap dict via reference
    if n <= 1:
        return 1  # Base case reached: start unwinding
    sub_result = factorial(n - 1, memo_ref)
    result = n * sub_result
    return result

stats = {"calls": 0}  # Allocated on Heap (0x7F01)
ans = factorial(3, stats)`,
      cpp: `struct Stats { int calls = 0; };

int factorial(int n, Stats* memoRef) {
    memoRef->calls += 1; // Dereferences Heap pointer 0x7F01
    if (n <= 1) {
        return 1; // Base case: pop stack frame
    }
    int subResult = factorial(n - 1, memoRef);
    int result = n * subResult;
    return result;
}

Stats* stats = new Stats(); // Heap allocation at 0x7F01
int ans = factorial(3, stats);`
    },
    liveSandboxCode: `// Modify 'n' or inspect how Stack & Heap interact!
const stats = { calls: 0, trace: [] };

function factorial(n, ref) {
  ref.calls += 1;
  ref.trace.push(\`Push frame: factorial(\${n})\`);
  if (n <= 1) {
    ref.trace.push(\`Base case at n=\${n} -> return 1\`);
    return 1;
  }
  const sub = factorial(n - 1, ref);
  const res = n * sub;
  ref.trace.push(\`Pop frame: factorial(\${n}) = \${n} * \${sub} = \${res}\`);
  return res;
}

const answer = factorial(4, stats);
console.log("Final Answer:", answer);
console.log("Heap Object Mutated Across Frames:", JSON.stringify(stats, null, 2));`,
    steps: [
      {
        stepNumber: 1,
        title: 'Heap Allocation & Initial Entry Frame',
        intuitionExplanation: 'Before calling `factorial`, we create a `stats` object. Because objects can grow or be shared, it is stored in the Heap, and our variable `stats` holds its memory address (`0x7F01`).',
        internalsExplanation: 'Global/Module frame `<main>` allocates 16 bytes on the Heap at `0x7F01` for `{ calls: 0 }`. Local variable `stats` on the stack holds pointer `0x7F01`.',
        codeLines: { typescript: [11, 12], python: [9, 10], cpp: [13, 14] },
        timeDelta: 'O(1)',
        spaceDelta: '+1 Stack Frame, +1 Heap Object',
        array: [
          { index: 3, value: 'n = 3', state: 'active', subLabel: 'Frame #1' },
          { index: 2, value: '—', state: 'default', subLabel: 'Frame #2' },
          { index: 1, value: '—', state: 'default', subLabel: 'Frame #3' }
        ],
        callStack: [
          { funcName: '<main>', args: '', returnAddr: '0x0010', locals: { stats: '-> 0x7F01' }, status: 'active' }
        ],
        heap: [
          { address: '0x7F01', type: 'Object (Stats)', label: 'stats', value: '{ calls: 0 }', highlight: true, refCount: 1 }
        ],
        variables: { n: 3, 'stats.calls': 0 },
        consoleOutput: ['Allocated stats object at Heap 0x7F01']
      },
      {
        stepNumber: 2,
        title: 'Push Frame: factorial(3, 0x7F01)',
        intuitionExplanation: 'We call `factorial(3)`. A new stack frame is pushed on top of `<main>`. Inside it, `memoRef` points to the exact same `stats` object in the Heap, incrementing `calls` to 1.',
        internalsExplanation: 'CPU pushes return address `0x0048` and allocates stack frame `factorial(n=3)`. `memoRef` copies pointer `0x7F01` (pass-by-sharing). Since `n=3 > 1`, execution proceeds to line 6.',
        codeLines: { typescript: [1, 2, 3, 6], python: [1, 2, 3, 5], cpp: [3, 4, 5, 8] },
        timeDelta: '+1 op',
        spaceDelta: 'Stack Depth: 2',
        array: [
          { index: 3, value: 'n = 3 (waiting)', state: 'comparing', subLabel: 'Frame #1' },
          { index: 2, value: 'calling n=2...', state: 'active', subLabel: 'Frame #2' },
          { index: 1, value: '—', state: 'default', subLabel: 'Frame #3' }
        ],
        callStack: [
          { funcName: 'factorial', args: 'n=3, memoRef=0x7F01', returnAddr: '0x0048', locals: { n: 3, subResult: 'pending' }, status: 'active' },
          { funcName: '<main>', args: '', returnAddr: '0x0010', locals: { stats: '-> 0x7F01' }, status: 'waiting' }
        ],
        heap: [
          { address: '0x7F01', type: 'Object (Stats)', label: 'stats', value: '{ calls: 1 }', highlight: true, refCount: 2 }
        ],
        variables: { currentFrame: 'factorial(3)', n: 3, 'heap[0x7F01].calls': 1 },
        consoleOutput: ['Push factorial(3) -> stats.calls = 1']
      },
      {
        stepNumber: 3,
        title: 'Push Frame: factorial(2, 0x7F01)',
        intuitionExplanation: '`factorial(3)` pauses at line 6 waiting for `factorial(2)` to finish. A new frame for `n = 2` is pushed on top, with its own separate `n` variable!',
        internalsExplanation: 'Frame `factorial(n=3)` is suspended at instruction offset `0x0024`. New frame `factorial(n=2)` is pushed on top of the stack. Heap `0x7F01` is mutated to `calls: 2`.',
        codeLines: { typescript: [1, 2, 3, 6], python: [1, 2, 3, 5], cpp: [3, 4, 5, 8] },
        timeDelta: '+1 op',
        spaceDelta: 'Stack Depth: 3',
        array: [
          { index: 3, value: 'n = 3 (paused)', state: 'default', subLabel: 'Frame #1' },
          { index: 2, value: 'n = 2 (waiting)', state: 'comparing', subLabel: 'Frame #2' },
          { index: 1, value: 'calling n=1...', state: 'active', subLabel: 'Frame #3' }
        ],
        callStack: [
          { funcName: 'factorial', args: 'n=2, memoRef=0x7F01', returnAddr: '0x0024', locals: { n: 2, subResult: 'pending' }, status: 'active' },
          { funcName: 'factorial', args: 'n=3, memoRef=0x7F01', returnAddr: '0x0048', locals: { n: 3, subResult: 'waiting' }, status: 'waiting' },
          { funcName: '<main>', args: '', returnAddr: '0x0010', locals: { stats: '-> 0x7F01' }, status: 'waiting' }
        ],
        heap: [
          { address: '0x7F01', type: 'Object (Stats)', label: 'stats', value: '{ calls: 2 }', highlight: true, refCount: 3 }
        ],
        variables: { currentFrame: 'factorial(2)', n: 2, 'heap[0x7F01].calls': 2 },
        consoleOutput: ['Push factorial(2) -> stats.calls = 2']
      },
      {
        stepNumber: 4,
        title: 'Base Case Hit: factorial(1, 0x7F01) Returns 1',
        intuitionExplanation: 'Now `n = 1` hits the base case `if (n <= 1) return 1`. No more recursive calls are made! The stack reaches its maximum height and begins to unwind.',
        internalsExplanation: 'Peak stack memory reached (4 frames). Condition `n <= 1` evaluates `true`. Return register `RAX` is loaded with `1`, and stack pointer `RSP` prepares to pop `factorial(1)`.',
        codeLines: { typescript: [3, 4], python: [3, 4], cpp: [5, 6] },
        timeDelta: '+1 op',
        spaceDelta: 'Peak Stack Depth: 4',
        array: [
          { index: 3, value: 'n = 3 (paused)', state: 'default', subLabel: 'Frame #1' },
          { index: 2, value: 'n = 2 (paused)', state: 'default', subLabel: 'Frame #2' },
          { index: 1, value: 'Base Case: return 1', state: 'found', subLabel: 'Frame #3' }
        ],
        callStack: [
          { funcName: 'factorial', args: 'n=1, memoRef=0x7F01', returnAddr: '0x0024', locals: { n: 1, returnVal: 1 }, status: 'returning' },
          { funcName: 'factorial', args: 'n=2, memoRef=0x7F01', returnAddr: '0x0024', locals: { n: 2, subResult: 'waiting' }, status: 'waiting' },
          { funcName: 'factorial', args: 'n=3, memoRef=0x7F01', returnAddr: '0x0048', locals: { n: 3, subResult: 'waiting' }, status: 'waiting' },
          { funcName: '<main>', args: '', returnAddr: '0x0010', locals: { stats: '-> 0x7F01' }, status: 'waiting' }
        ],
        heap: [
          { address: '0x7F01', type: 'Object (Stats)', label: 'stats', value: '{ calls: 3 }', highlight: false, refCount: 4 }
        ],
        variables: { currentFrame: 'factorial(1)', n: 1, returnValue: 1, 'heap[0x7F01].calls': 3 },
        consoleOutput: ['Push factorial(1) -> Base case hit! Returning 1']
      },
      {
        stepNumber: 5,
        title: 'Unwind Stack: factorial(2) Computes 2 * 1 = 2',
        intuitionExplanation: '`factorial(1)` is popped off the stack. Control returns to `factorial(2)`, which receives `subResult = 1`, multiplies `2 * 1 = 2`, and returns `2` down to `factorial(3)`.',
        internalsExplanation: 'Frame `factorial(1)` is deallocated (`RSP += frame_size`). Execution resumes in `factorial(2)` at `0x0024`. `result = 2 * 1 = 2` is computed and returned.',
        codeLines: { typescript: [6, 7, 8], python: [5, 6, 7], cpp: [8, 9, 10] },
        timeDelta: '+1 op',
        spaceDelta: 'Stack Depth: 3 (-1 popped)',
        array: [
          { index: 3, value: 'n = 3 (paused)', state: 'default', subLabel: 'Frame #1' },
          { index: 2, value: '2 * 1 = 2 (return)', state: 'sorted', subLabel: 'Frame #2' },
          { index: 1, value: 'Popped (1)', state: 'discarded', subLabel: 'Freed' }
        ],
        callStack: [
          { funcName: 'factorial', args: 'n=2, memoRef=0x7F01', returnAddr: '0x0024', locals: { n: 2, subResult: 1, result: 2 }, status: 'returning' },
          { funcName: 'factorial', args: 'n=3, memoRef=0x7F01', returnAddr: '0x0048', locals: { n: 3, subResult: 'waiting' }, status: 'waiting' },
          { funcName: '<main>', args: '', returnAddr: '0x0010', locals: { stats: '-> 0x7F01' }, status: 'waiting' }
        ],
        heap: [
          { address: '0x7F01', type: 'Object (Stats)', label: 'stats', value: '{ calls: 3 }', highlight: false, refCount: 3 }
        ],
        variables: { currentFrame: 'factorial(2)', n: 2, subResult: 1, result: 2 },
        consoleOutput: ['Pop factorial(1) -> factorial(2) computes 2 * 1 = 2']
      },
      {
        stepNumber: 6,
        title: 'Final Unwind: factorial(3) Returns 6 to <main>',
        intuitionExplanation: 'Finally, `factorial(3)` receives `subResult = 2`, computes `3 * 2 = 6`, and pops off the stack. Only `<main>` remains with `ans = 6` and `stats.calls = 3`!',
        internalsExplanation: 'All recursive stack frames are reclaimed in O(1) pointer movement. The Heap object at `0x7F01` persists with `{ calls: 3 }` because `<main>` still holds a root reference.',
        codeLines: { typescript: [7, 8, 12], python: [6, 7, 10], cpp: [9, 10, 14] },
        timeDelta: 'Total: 3 calls',
        spaceDelta: 'Stack Restored to Depth 1',
        array: [
          { index: 3, value: '3 * 2 = 6 (done)', state: 'found', subLabel: 'Result = 6' },
          { index: 2, value: 'Popped (2)', state: 'discarded', subLabel: 'Freed' },
          { index: 1, value: 'Popped (1)', state: 'discarded', subLabel: 'Freed' }
        ],
        callStack: [
          { funcName: '<main>', args: '', returnAddr: '0x0010', locals: { stats: '-> 0x7F01', ans: 6 }, status: 'active' }
        ],
        heap: [
          { address: '0x7F01', type: 'Object (Stats)', label: 'stats', value: '{ calls: 3 }', highlight: true, refCount: 1 }
        ],
        variables: { ans: 6, 'stats.calls': 3 },
        consoleOutput: ['Pop factorial(3) -> Final Answer ans = 6, stats.calls = 3']
      }
    ],
    quiz: {
      question: 'When factorial(3, stats) finishes and all recursive stack frames are popped, why is stats.calls equal to 3 instead of resetting to 0?',
      options: [
        'Because primitive numbers are stored on the Heap',
        'Because each stack frame received a pointer/reference (0x7F01) to the same Heap object and mutated it in-place',
        'Because the Call Stack automatically merges local variables when unwinding',
        'Because recursion creates a deep copy of the Heap on return'
      ],
      correctIndex: 1,
      explanation: 'While each recursive invocation gets its own isolated stack frame for local primitives like `n`, `memoRef` holds the memory address (`0x7F01`) of the shared Heap object. Mutating `memoRef.calls` modifies the single Heap allocation directly.'
    }
  },
  {
    id: 'big-o-complexity-analyzer',
    title: 'Time & Space Complexity, Big O & Memory Trade-offs',
    shortTitle: 'Big O & Complexity',
    category: 'foundations-memory',
    difficulty: 'Beginner',
    summary: 'Compare how O(n²) Nested Loops vs. O(n) Hash Set Lookup execute on the same input, tracking exact CPU operations and memory growth.',
    intuitionOverview: 'Big O notation isn’t about measuring milliseconds—it measures how the number of steps scales when your data grows from 10 items to 1,000,000 items. Trading a tiny bit of memory (a Hash Set) often turns a slow O(n²) nested loop into a single fast O(n) pass.',
    internalsOverview: 'An O(n²) pair scan performs `n(n-1)/2` comparisons with O(1) auxiliary space. At `n = 10^5`, that is ~5 billion CPU cycles (~5 seconds). By allocating an O(n) hash table in RAM, each lookup takes O(1) amortized time, reducing total operations to `10^5` (~2 milliseconds).',
    realWorldUseCases: [
      'Eliminating N+1 query bottlenecks in backend API endpoints',
      'Choosing between in-place sorting O(n log n) vs. hash-based indexing O(n)',
      'Preventing event-loop blocking in Node.js and UI frame drops in React'
    ],
    keyInvariants: [
      'Time-Space Trade-off: Storing precomputed results in memory avoids redundant CPU scans.',
      'Asymptotic Dominance: Lower-order terms and constants drop as n approaches infinity.'
    ],
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(n) with Hash Set',
      timeWorst: 'O(n²) Brute Force',
      space: 'O(n) vs O(1)',
      note: 'Trading O(n) auxiliary Heap memory reduces time complexity from quadratic O(n²) to linear O(n).'
    },
    code: {
      typescript: `// Goal: Find if any two numbers sum to target = 9
function hasPairWithSum(nums: number[], target: number): boolean {
  const seen = new Set<number>(); // O(n) Space on Heap
  for (let i = 0; i < nums.length; i++) { // O(n) Time
    const complement = target - nums[i];
    if (seen.has(complement)) { // O(1) Hash Lookup!
      return true;
    }
    seen.add(nums[i]);
  }
  return false;
}`,
      python: `def has_pair_with_sum(nums: list[int], target: int) -> bool:
    seen = set()  # O(n) Space on Heap
    for i, num in enumerate(nums):  # O(n) Time
        complement = target - num
        if complement in seen:  # O(1) Hash Lookup!
            return True
        seen.add(num)
    return False`,
      cpp: `bool hasPairWithSum(const vector<int>& nums, int target) {
    unordered_set<int> seen; // O(n) Space on Heap
    for (int i = 0; i < nums.size(); i++) { // O(n) Time
        int complement = target - nums[i];
        if (seen.count(complement)) { // O(1) Hash Lookup!
            return true;
        }
        seen.insert(nums[i]);
    }
    return false;
}`
    },
    liveSandboxCode: `// Compare O(n^2) Brute Force vs O(n) Hash Set operation counts!
const nums = [11, 15, 2, 19, 7, 4];
const target = 9;

function bruteForceCount(arr, tgt) {
  let ops = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      ops++;
      if (arr[i] + arr[j] === tgt) return { found: [arr[i], arr[j]], ops };
    }
  }
  return { found: null, ops };
}

function optimalHashCount(arr, tgt) {
  let ops = 0;
  const seen = new Set();
  for (let i = 0; i < arr.length; i++) {
    ops++;
    const comp = tgt - arr[i];
    if (seen.has(comp)) return { found: [comp, arr[i]], ops, memoryUsed: seen.size };
    seen.add(arr[i]);
  }
  return { found: null, ops, memoryUsed: seen.size };
}

console.log("O(n²) Brute Force:", bruteForceCount(nums, target));
console.log("O(n) Optimal Set :", optimalHashCount(nums, target));`,
    steps: [
      {
        stepNumber: 1,
        title: 'Initialize Empty Hash Set (i = 0, val = 11)',
        intuitionExplanation: 'We want two numbers that add up to `9`. Instead of comparing `11` with every other number (which takes O(n²) work), we ask: "Have we seen `9 - 11 = -2` yet?" Not yet, so we remember `11` in our `seen` set.',
        internalsExplanation: 'Hash Set `seen` allocated at Heap `0x8A00`. For `nums[0] = 11`, `complement = -2`. `seen.has(-2)` computes hash in O(1) and misses. `11` is inserted into `seen`.',
        codeLines: { typescript: [3, 4, 5, 6, 9], python: [2, 3, 4, 5, 7], cpp: [2, 3, 4, 5, 8] },
        timeDelta: '1 op (vs 4 in O(n²))',
        spaceDelta: 'Set size: 1',
        array: [
          { index: 0, value: 11, state: 'active', subLabel: 'need -2' },
          { index: 1, value: 15, state: 'default' },
          { index: 2, value: 2, state: 'default' },
          { index: 3, value: 19, state: 'default' },
          { index: 4, value: 7, state: 'default' }
        ],
        pointers: [{ name: 'i', index: 0, color: 'indigo' }],
        callStack: [{ funcName: 'hasPairWithSum', args: 'nums, target=9', locals: { i: 0, 'nums[i]': 11, complement: -2 }, status: 'active' }],
        heap: [{ address: '0x8A00', type: 'Set<number>', label: 'seen', value: '{ 11 }', highlight: true }],
        variables: { i: 0, current: 11, complement: -2, opsCount: 1, bruteForceEquivalentOps: 4 }
      },
      {
        stepNumber: 2,
        title: 'Step i = 1 (val = 15) & i = 2 (val = 2)',
        intuitionExplanation: 'At `15`, we need `-6` (not in set, add `15`). At `2`, we need `9 - 2 = 7`. Is `7` in `seen`? Not yet! So we add `2` to `seen`. Each check takes just 1 instant operation.',
        internalsExplanation: 'Single-pass iteration continues. `seen` now stores `{ 11, 15, 2 }`. Total hash probes: 3. An O(n²) nested loop would have already executed `4 + 3 + 2 = 9` comparisons.',
        codeLines: { typescript: [4, 5, 6, 9], python: [3, 4, 5, 7], cpp: [3, 4, 5, 8] },
        timeDelta: '3 ops total',
        spaceDelta: 'Set size: 3',
        array: [
          { index: 0, value: 11, state: 'visited', subLabel: 'in Set' },
          { index: 1, value: 15, state: 'visited', subLabel: 'in Set' },
          { index: 2, value: 2, state: 'active', subLabel: 'need 7 -> add 2' },
          { index: 3, value: 19, state: 'default' },
          { index: 4, value: 7, state: 'default' }
        ],
        pointers: [{ name: 'i', index: 2, color: 'indigo' }],
        callStack: [{ funcName: 'hasPairWithSum', args: 'nums, target=9', locals: { i: 2, 'nums[i]': 2, complement: 7 }, status: 'active' }],
        heap: [{ address: '0x8A00', type: 'Set<number>', label: 'seen', value: '{ 11, 15, 2 }', highlight: true }],
        variables: { i: 2, current: 2, complement: 7, opsCount: 3, bruteForceEquivalentOps: 9 }
      },
      {
        stepNumber: 3,
        title: 'O(1) Complement Match at i = 4 (val = 7)',
        intuitionExplanation: 'After skipping `19`, we reach `nums[4] = 7`. Its complement is `9 - 7 = 2`. We check `seen.has(2)`—and it’s an instant hit! We return `true` in a single pass.',
        internalsExplanation: '`complement = 2` hashes directly to the bucket containing `2` at `0x8A00`. Total time: 5 operations (O(n)) instead of scanning all pairs.',
        codeLines: { typescript: [5, 6, 7], python: [4, 5, 6], cpp: [4, 5, 6] },
        timeDelta: '5 ops total (O(n))',
        spaceDelta: 'Set size: 4 (O(n))',
        array: [
          { index: 0, value: 11, state: 'visited', subLabel: 'in Set' },
          { index: 1, value: 15, state: 'visited', subLabel: 'in Set' },
          { index: 2, value: 2, state: 'found', subLabel: 'Matched!' },
          { index: 3, value: 19, state: 'visited', subLabel: 'in Set' },
          { index: 4, value: 7, state: 'found', subLabel: '2 + 7 = 9' }
        ],
        pointers: [{ name: 'i', index: 4, color: 'emerald' }],
        callStack: [{ funcName: 'hasPairWithSum', args: 'nums, target=9', locals: { i: 4, 'nums[i]': 7, complement: 2, returnVal: true }, status: 'returning' }],
        heap: [{ address: '0x8A00', type: 'Set<number>', label: 'seen', value: '{ 11, 15, 2, 19 }', highlight: true }],
        variables: { i: 4, current: 7, complement: 2, foundMatch: true, opsCount: 5 }
      }
    ]
  },
  {
    id: 'arrays-strings-contiguous-memory',
    title: 'Arrays, Dynamic Resizing & String Immutability',
    shortTitle: 'Arrays & Strings',
    category: 'linear-ds',
    difficulty: 'Beginner',
    summary: 'Inspect how contiguous RAM addresses give Arrays O(1) random access, why inserting in the middle costs O(n) shifts, and how Dynamic Arrays double capacity.',
    intuitionOverview: 'An Array is like a row of numbered lockers welded together in a single metal frame. Because every locker is the exact same width, jumping to locker #500 is instant math (`start + 500 * width`). But if the frame is full and you want to add one more locker, you have to buy a brand-new frame twice as big and move every item over!',
    internalsOverview: 'Contiguous memory layout stores elements at `BaseAddr + index * sizeof(T)`. CPU hardware prefetcher loads adjacent elements into L1/L2 cache lines (64 bytes), making sequential array traversal drastically faster than pointer-chasing data structures.',
    realWorldUseCases: [
      'High-frequency financial tick buffers and TypedArrays (`Float64Array`) in WebGL/Canvas',
      'Avoiding O(n²) string concatenation inside loops by using array `.join()` or `StringBuilder`',
      'Understanding why `.unshift()` / `insert(0, x)` degrades performance on large arrays'
    ],
    keyInvariants: [
      'Address Formula: `Address(A[i]) = BaseAddress + i * ElementSize` gives O(1) access.',
      'Amortized Doubling: Resizing from capacity C to 2C copies C elements, costing O(1) amortized time per `push`.'
    ],
    complexity: {
      timeBest: 'O(1) Access / Push',
      timeAverage: 'O(1) Amortized Push',
      timeWorst: 'O(n) Shift / Resize',
      space: 'O(n) Contiguous RAM',
      note: 'Random access is always O(1); middle insertion/deletion shifts O(n) trailing bytes.'
    },
    code: {
      typescript: `function insertAndPush(arr: number[], insertIdx: number, val: number): number[] {
  // 1. O(1) Random Access via BaseAddr + idx * 4 bytes
  const first = arr[0];
  
  // 2. O(n) Insertion at index 1: must shift elements right!
  for (let i = arr.length; i > insertIdx; i--) {
    arr[i] = arr[i - 1];
  }
  arr[insertIdx] = val;
  return arr;
}`,
      python: `def insert_and_push(arr: list[int], insert_idx: int, val: int) -> list[int]:
    # 1. O(1) Random Access via pointer array offset
    first = arr[0]
    
    # 2. O(n) Insertion at index 1: shifts trailing elements right
    arr.append(0)
    for i in range(len(arr) - 1, insert_idx, -1):
        arr[i] = arr[i - 1]
    arr[insert_idx] = val
    return arr`,
      cpp: `void insertAtIndex(vector<int>& arr, int insertIdx, int val) {
    // 1. O(1) Random Access: *(arr.data() + 0)
    int first = arr[0];
    
    // 2. O(n) Shift right to open slot at insertIdx
    arr.push_back(0); // May trigger 2x capacity reallocation
    for (int i = arr.size() - 1; i > insertIdx; i--) {
        arr[i] = arr[i - 1];
    }
    arr[insertIdx] = val;
}`
    },
    liveSandboxCode: `// Experiment with Contiguous Array addressing and O(n) shift costs
const arr = [10, 20, 30, 40];
const baseAddr = 0x1000;

console.log("Initial Contiguous Memory Map (4-byte integers):");
arr.forEach((v, i) => {
  console.log(\`Index \${i}: Addr 0x\${(baseAddr + i * 4).toString(16)} -> Value \${v}\`);
});

// Insert 99 at index 1 and track every shift operation
let shifts = 0;
for (let i = arr.length; i > 1; i--) {
  arr[i] = arr[i - 1];
  shifts++;
}
arr[1] = 99;
console.log(\`After inserting 99 at index 1 (\${shifts} shifts):\`, arr);`,
    steps: [
      {
        stepNumber: 1,
        title: 'Contiguous Memory Layout & O(1) Address Calculation',
        intuitionExplanation: 'Our array `[10, 20, 30, 40]` sits in consecutive 4-byte memory slots starting at `0x1000`. Accessing `arr[2]` doesn’t scan `0` and `1`—the CPU jumps straight to `0x1000 + 2 * 4 = 0x1008`!',
        internalsExplanation: 'Base pointer `0x1000` is stored in register. `arr[i]` compiles to a single assembly load `MOV EAX, [RBX + RCX*4]`, executing in 1 L1 cache hit.',
        codeLines: { typescript: [2, 3], python: [2, 3], cpp: [2, 3] },
        timeDelta: 'O(1) CPU instruction',
        spaceDelta: 'Capacity: 5, Length: 4',
        array: [
          { index: 0, value: 10, state: 'active', memoryAddr: '0x1000', subLabel: 'Base+0' },
          { index: 1, value: 20, state: 'default', memoryAddr: '0x1004', subLabel: 'Base+4' },
          { index: 2, value: 30, state: 'default', memoryAddr: '0x1008', subLabel: 'Base+8' },
          { index: 3, value: 40, state: 'default', memoryAddr: '0x100C', subLabel: 'Base+12' },
          { index: 4, value: 'free', state: 'discarded', memoryAddr: '0x1010', subLabel: 'Cap Slot' }
        ],
        callStack: [{ funcName: 'insertAndPush', args: 'insertIdx=1, val=99', locals: { first: 10, baseAddr: '0x1000' }, status: 'active' }],
        heap: [{ address: '0x1000..0x1014', type: 'Int32[5]', label: 'Contiguous Buffer', value: '[10, 20, 30, 40, _]', highlight: true }],
        variables: { baseAddr: '0x1000', elementBytes: 4, 'addr(arr[2])': '0x1008' }
      },
      {
        stepNumber: 2,
        title: 'O(n) Right-Shift to Open Index 1',
        intuitionExplanation: 'To insert `99` at index `1` without overwriting `20`, we must slide `40`, `30`, and `20` one slot to the right (`i = 4` down to `2`). This is why inserting at the front of an array costs O(n) time!',
        internalsExplanation: '`memmove` / backward loop shifts 3 elements (`40 -> idx 4`, `30 -> idx 3`, `20 -> idx 2`) across contiguous addresses `0x1008..0x1010`.',
        codeLines: { typescript: [6, 7, 8], python: [7, 8], cpp: [7, 8, 9] },
        timeDelta: '3 shifts (O(n))',
        spaceDelta: 'Length: 5 / Cap: 5',
        array: [
          { index: 0, value: 10, state: 'default', memoryAddr: '0x1000', subLabel: 'Unchanged' },
          { index: 1, value: 20, state: 'comparing', memoryAddr: '0x1004', subLabel: 'Slot Opening' },
          { index: 2, value: 20, state: 'swapped', memoryAddr: '0x1008', subLabel: 'Shifted ->' },
          { index: 3, value: 30, state: 'swapped', memoryAddr: '0x100C', subLabel: 'Shifted ->' },
          { index: 4, value: 40, state: 'swapped', memoryAddr: '0x1010', subLabel: 'Shifted ->' }
        ],
        pointers: [{ name: 'insertIdx', index: 1, color: 'amber' }, { name: 'i', index: 2, color: 'indigo' }],
        callStack: [{ funcName: 'insertAndPush', args: 'insertIdx=1, val=99', locals: { insertIdx: 1, shifts: 3 }, status: 'active' }],
        heap: [{ address: '0x1000..0x1014', type: 'Int32[5]', label: 'Contiguous Buffer', value: '[10, 20, 20, 30, 40]', highlight: true }],
        variables: { insertIdx: 1, shiftedElements: 3, valToInsert: 99 }
      },
      {
        stepNumber: 3,
        title: 'Write Value 99 at Index 1 (Addr 0x1004)',
        intuitionExplanation: 'Now that `20, 30, 40` have shifted right, we write `99` into `arr[1]` at `0x1004`. If we push one more item now that Capacity (5) is full, the runtime allocates a new 10-slot block on the Heap and copies all 5 items.',
        internalsExplanation: 'Store `99` at `0x1004`. Buffer is now at 100% capacity (`length === capacity === 5`). Next `push()` will trigger a 2x geometric reallocation.',
        codeLines: { typescript: [9, 10], python: [9, 10], cpp: [10] },
        timeDelta: '+1 write',
        spaceDelta: '5/5 Full',
        array: [
          { index: 0, value: 10, state: 'sorted', memoryAddr: '0x1000', subLabel: 'Base+0' },
          { index: 1, value: 99, state: 'found', memoryAddr: '0x1004', subLabel: 'Inserted!' },
          { index: 2, value: 20, state: 'sorted', memoryAddr: '0x1008', subLabel: 'Base+8' },
          { index: 3, value: 30, state: 'sorted', memoryAddr: '0x100C', subLabel: 'Base+12' },
          { index: 4, value: 40, state: 'sorted', memoryAddr: '0x1010', subLabel: 'Base+16' }
        ],
        pointers: [{ name: 'insertIdx', index: 1, color: 'emerald' }],
        callStack: [{ funcName: 'insertAndPush', args: 'insertIdx=1, val=99', locals: { result: '[10, 99, 20, 30, 40]' }, status: 'returning' }],
        heap: [{ address: '0x1000..0x1014', type: 'Int32[5]', label: 'Contiguous Buffer', value: '[10, 99, 20, 30, 40]', highlight: true }],
        variables: { 'arr[1]': 99, length: 5, capacity: 5 }
      }
    ]
  },
  {
    id: 'linked-lists-pointer-manipulation',
    title: 'Linked Lists: Non-Contiguous Nodes & In-Place Pointer Reversal',
    shortTitle: 'Linked Lists',
    category: 'linear-ds',
    difficulty: 'Beginner',
    summary: 'Watch how nodes scattered across Heap addresses link via pointers, and trace the classic 3-pointer in-place Linked List Reversal without losing the tail.',
    intuitionOverview: 'Unlike an array where items sit side-by-side, a Linked List is a treasure hunt. Each node can live anywhere in memory and holds a clue (`next` pointer) telling you the exact memory address of the next node. To reverse the list, we walk forward while flipping each arrow backward—carefully saving `nextTemp` first so we don’t lose the rest of the chain!',
    internalsOverview: 'Each `ListNode` is a separate Heap allocation (`16 bytes`: `val` + `8-byte next*`). Reversing in-place achieves O(n) time and O(1) space by mutating the `next` pointer fields across `prev`, `curr`, and `nextTemp` registers.',
    realWorldUseCases: [
      'LRU Cache doubly-linked list eviction queues (O(1) node removal/promotion)',
      'Operating system kernel free-memory block lists and I/O request queues',
      'Undo/Redo history chains and React Fiber reconciliation work-loop linked nodes'
    ],
    keyInvariants: [
      'Never overwrite `curr.next` before saving `const nextTemp = curr.next`!',
      'At the start of each iteration, `prev` points to the head of the already-reversed prefix, and `curr` points to the head of the unreversed suffix.'
    ],
    complexity: {
      timeBest: 'O(1) Head Insert',
      timeAverage: 'O(n) Search / Reverse',
      timeWorst: 'O(n)',
      space: 'O(1) In-Place Reversal',
      note: 'Pointer updates take O(1) per node with zero extra heap allocations.'
    },
    code: {
      typescript: `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;
  while (curr !== null) {
    const nextTemp = curr.next; // 1. Save next node address
    curr.next = prev;           // 2. Flip arrow backward!
    prev = curr;                // 3. Advance prev to curr
    curr = nextTemp;            // 4. Advance curr to saved next
  }
  return prev; // New head!
}`,
      python: `def reverse_list(head: Optional[ListNode]) -> Optional[ListNode]:
    prev = None
    curr = head
    while curr is not None:
        next_temp = curr.next  # 1. Save next node address
        curr.next = prev       # 2. Flip arrow backward!
        prev = curr            # 3. Advance prev
        curr = next_temp       # 4. Advance curr
    return prev  # New head!`,
      cpp: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nextTemp = curr->next; // 1. Save next address
        curr->next = prev;               // 2. Flip pointer backward
        prev = curr;                     // 3. Advance prev
        curr = nextTemp;                 // 4. Advance curr
    }
    return prev;
}`
    },
    liveSandboxCode: `// Trace Linked List creation and 3-pointer in-place reversal
function createList(values) {
  let head = null, tail = null;
  for (const val of values) {
    const node = { val, next: null };
    if (!head) head = tail = node;
    else { tail.next = node; tail = node; }
  }
  return head;
}

function toArray(head) {
  const out = [];
  while (head) { out.push(head.val); head = head.next; }
  return out;
}

let head = createList([10, 20, 30]);
console.log("Before Reversal:", toArray(head).join(" -> ") + " -> null");

let prev = null, curr = head;
while (curr !== null) {
  const nextTemp = curr.next;
  curr.next = prev;
  prev = curr;
  curr = nextTemp;
}
console.log("After Reversal :", toArray(prev).join(" -> ") + " -> null");`,
    steps: [
      {
        stepNumber: 1,
        title: 'Initial Non-Contiguous Heap Nodes',
        intuitionExplanation: 'Look at the memory addresses: Node `10` is at `0x40A0`, Node `20` is at `0x91C0`, and Node `30` is at `0x22F0`. They are scattered in the Heap, connected only by their `next` pointers. `prev` starts at `null` and `curr` starts at `0x40A0`.',
        internalsExplanation: 'Registers initialized: `prev = nullptr (0x0)`, `curr = 0x40A0`. Each node’s `next` field points to the next Heap block.',
        codeLines: { typescript: [2, 3], python: [2, 3], cpp: [2, 3] },
        timeDelta: 'O(1)',
        spaceDelta: 'O(1) pointers',
        linkedList: [
          { id: 'n1', addr: '0x40A0', val: 10, nextAddr: '0x91C0', state: 'active', pointerLabel: 'curr / head' },
          { id: 'n2', addr: '0x91C0', val: 20, nextAddr: '0x22F0', state: 'default' },
          { id: 'n3', addr: '0x22F0', val: 30, nextAddr: null, state: 'default' }
        ],
        callStack: [{ funcName: 'reverseList', args: 'head=0x40A0', locals: { prev: 'null', curr: '0x40A0 (10)' }, status: 'active' }],
        heap: [
          { address: '0x40A0', type: 'ListNode', label: 'Node(10)', value: '{ val: 10, next: 0x91C0 }', highlight: true },
          { address: '0x91C0', type: 'ListNode', label: 'Node(20)', value: '{ val: 20, next: 0x22F0 }' },
          { address: '0x22F0', type: 'ListNode', label: 'Node(30)', value: '{ val: 30, next: null }' }
        ],
        variables: { prev: 'null', curr: '0x40A0 (10)', nextTemp: 'unset' }
      },
      {
        stepNumber: 2,
        title: 'Iteration 1: Flip Node(10).next -> null',
        intuitionExplanation: 'First, we save `nextTemp = 0x91C0 (Node 20)` so we don’t lose the list! Then we flip `Node(10).next = null`, move `prev` to `Node(10)`, and step `curr` to `Node(20)`.',
        internalsExplanation: '`0x40A0->next` is mutated from `0x91C0` to `nullptr`. `prev` becomes `0x40A0`, `curr` becomes `0x91C0`.',
        codeLines: { typescript: [5, 6, 7, 8], python: [5, 6, 7, 8], cpp: [5, 6, 7, 8] },
        timeDelta: '+4 pointer ops',
        spaceDelta: 'O(1)',
        linkedList: [
          { id: 'n1', addr: '0x40A0', val: 10, nextAddr: null, state: 'modified', pointerLabel: 'prev' },
          { id: 'n2', addr: '0x91C0', val: 20, nextAddr: '0x22F0', state: 'active', pointerLabel: 'curr / nextTemp' },
          { id: 'n3', addr: '0x22F0', val: 30, nextAddr: null, state: 'default' }
        ],
        callStack: [{ funcName: 'reverseList', args: 'head=0x40A0', locals: { prev: '0x40A0 (10)', curr: '0x91C0 (20)', nextTemp: '0x91C0' }, status: 'active' }],
        heap: [
          { address: '0x40A0', type: 'ListNode', label: 'Node(10)', value: '{ val: 10, next: null }', highlight: true },
          { address: '0x91C0', type: 'ListNode', label: 'Node(20)', value: '{ val: 20, next: 0x22F0 }', highlight: true },
          { address: '0x22F0', type: 'ListNode', label: 'Node(30)', value: '{ val: 30, next: null }' }
        ],
        variables: { prev: '0x40A0 (10)', curr: '0x91C0 (20)', nextTemp: '0x91C0 (20)' }
      },
      {
        stepNumber: 3,
        title: 'Iteration 2: Flip Node(20).next -> Node(10)',
        intuitionExplanation: 'Now at `Node(20)`, we save `nextTemp = 0x22F0 (Node 30)`, point `Node(20).next` backward to `0x40A0 (Node 10)`, and advance `prev` and `curr`.',
        internalsExplanation: '`0x91C0->next` is mutated to `0x40A0`. Prefix `20 -> 10 -> null` is now reversed.',
        codeLines: { typescript: [5, 6, 7, 8], python: [5, 6, 7, 8], cpp: [5, 6, 7, 8] },
        timeDelta: '+4 pointer ops',
        spaceDelta: 'O(1)',
        linkedList: [
          { id: 'n1', addr: '0x40A0', val: 10, nextAddr: null, state: 'visited' },
          { id: 'n2', addr: '0x91C0', val: 20, nextAddr: '0x40A0', state: 'modified', pointerLabel: 'prev' },
          { id: 'n3', addr: '0x22F0', val: 30, nextAddr: null, state: 'active', pointerLabel: 'curr / nextTemp' }
        ],
        callStack: [{ funcName: 'reverseList', args: 'head=0x40A0', locals: { prev: '0x91C0 (20)', curr: '0x22F0 (30)', nextTemp: '0x22F0' }, status: 'active' }],
        heap: [
          { address: '0x40A0', type: 'ListNode', label: 'Node(10)', value: '{ val: 10, next: null }' },
          { address: '0x91C0', type: 'ListNode', label: 'Node(20)', value: '{ val: 20, next: 0x40A0 }', highlight: true },
          { address: '0x22F0', type: 'ListNode', label: 'Node(30)', value: '{ val: 30, next: null }', highlight: true }
        ],
        variables: { prev: '0x91C0 (20)', curr: '0x22F0 (30)', nextTemp: '0x22F0 (30)' }
      },
      {
        stepNumber: 4,
        title: 'Iteration 3 & Return New Head (0x22F0)',
        intuitionExplanation: 'Finally, `Node(30).next` flips to `Node(20)`. `curr` advances to `null`, ending the loop! `prev` (`0x22F0`, value `30`) is returned as the new head of `30 -> 20 -> 10 -> null`.',
        internalsExplanation: '`0x22F0->next = 0x91C0`. Loop terminates as `curr == nullptr`. Zero nodes were copied or reallocated—only 3 8-byte pointers changed.',
        codeLines: { typescript: [6, 7, 8, 10], python: [6, 7, 8, 9], cpp: [6, 7, 8, 10] },
        timeDelta: 'Total: O(n)',
        spaceDelta: 'O(1) Auxiliary Space',
        linkedList: [
          { id: 'n3', addr: '0x22F0', val: 30, nextAddr: '0x91C0', state: 'new', pointerLabel: 'prev (New Head)' },
          { id: 'n2', addr: '0x91C0', val: 20, nextAddr: '0x40A0', state: 'visited' },
          { id: 'n1', addr: '0x40A0', val: 10, nextAddr: null, state: 'visited', pointerLabel: 'Tail -> null' }
        ],
        callStack: [{ funcName: 'reverseList', args: 'head=0x40A0', locals: { prev: '0x22F0 (30)', curr: 'null' }, status: 'returning' }],
        heap: [
          { address: '0x22F0', type: 'ListNode', label: 'Node(30)', value: '{ val: 30, next: 0x91C0 }', highlight: true },
          { address: '0x91C0', type: 'ListNode', label: 'Node(20)', value: '{ val: 20, next: 0x40A0 }' },
          { address: '0x40A0', type: 'ListNode', label: 'Node(10)', value: '{ val: 10, next: null }' }
        ],
        variables: { newHead: '0x22F0 (30)', curr: 'null', reversedOrder: '30 -> 20 -> 10 -> null' }
      }
    ]
  },
  {
    id: 'stacks-queues-lifo-fifo',
    title: 'Stacks (LIFO) & Queues (FIFO): Valid Parentheses & Circular Buffer',
    shortTitle: 'Stacks & Queues',
    category: 'linear-ds',
    difficulty: 'Beginner',
    summary: 'See how a LIFO Stack validates nested syntax brackets and how a FIFO Queue processes tasks in arrival order.',
    intuitionOverview: 'A Stack is a spring-loaded plate dispenser (Last-In, First-Out): the most recently opened bracket must be closed first. A Queue is a checkout line (First-In, First-Out): requests are served in the exact order they arrive.',
    internalsOverview: 'Stacks push and pop from the tail of a dynamic array in O(1) time. Queues use a Doubly Linked List or Circular Ring Buffer (`head = (head + 1) % cap`) so `dequeue()` never shifts elements.',
    realWorldUseCases: [
      'Compilers & JSON parsers validating nested brackets/JSX tags with a Stack',
      'Browser Back/Forward navigation stacks and Undo history',
      'Task queues, BFS graph traversal, and Kafka/RabbitMQ message brokers'
    ],
    keyInvariants: [
      'Stack Bracket Invariant: Every closing delimiter must match the most recently unclosed opening delimiter at the top of the stack.',
      'At end of input, the stack must be completely empty (`stack.length === 0`).'
    ],
    complexity: {
      timeBest: 'O(1) Push / Pop / Enqueue / Dequeue',
      timeAverage: 'O(n) Sequence Validation',
      timeWorst: 'O(n)',
      space: 'O(n) Stack Depth',
      note: 'All core Stack and Circular Queue operations run in O(1) time.'
    },
    code: {
      typescript: `function isValidBrackets(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch); // LIFO Push opening bracket
    } else {
      if (stack.pop() !== pairs[ch]) return false; // LIFO Pop & match
    }
  }
  return stack.length === 0;
}`,
      python: `def is_valid_brackets(s: str) -> bool:
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in '([{':
            stack.append(ch)  # LIFO Push
        else:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return len(stack) == 0`,
      cpp: `bool isValidBrackets(string s) {
    stack<char> st;
    unordered_map<char, char> pairs = {{')','('}, {']','['}, {'}','{'}};
    for (char ch : s) {
        if (ch == '(' || ch == '[' || ch == '{') {
            st.push(ch);
        } else {
            if (st.empty() || st.top() != pairs[ch]) return false;
            st.pop();
        }
    }
    return st.empty();
}`
    },
    liveSandboxCode: `function validateWithTrace(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if ('([{'.includes(ch)) {
      stack.push(ch);
      console.log(\`Step \${i+1}: Push '\${ch}' -> Stack: [\${stack.join(', ')}]\`);
    } else {
      const top = stack.pop();
      console.log(\`Step \${i+1}: See '\${ch}', Pop '\${top}' -> Match: \${top === pairs[ch]}\`);
      if (top !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}

console.log("Result for '{[()]}':", validateWithTrace("{[()]}"));`,
    steps: [
      {
        stepNumber: 1,
        title: 'Push Opening Brackets "{", "[", "(" onto LIFO Stack',
        intuitionExplanation: 'As we read `{`, `[`, and `(`, each one opens a new nested scope. We push them onto our Stack in order: `["{", "[", "("]`. Because `(` was opened last, it sits on top and MUST be closed first!',
        internalsExplanation: 'Three O(1) `stack.push()` operations append characters to the contiguous stack buffer at indices 0, 1, and 2 (`top = 2`).',
        codeLines: { typescript: [4, 5, 6], python: [4, 5, 6], cpp: [4, 5, 6] },
        timeDelta: '3 O(1) pushes',
        spaceDelta: 'Stack Size: 3',
        array: [
          { index: 0, value: '{', state: 'visited', subLabel: 'pushed' },
          { index: 1, value: '[', state: 'visited', subLabel: 'pushed' },
          { index: 2, value: '(', state: 'active', subLabel: 'pushed (TOP)' },
          { index: 3, value: ')', state: 'default' },
          { index: 4, value: ']', state: 'default' },
          { index: 5, value: '}', state: 'default' }
        ],
        auxiliaryArray: {
          label: 'LIFO Stack (Bottom -> Top)',
          cells: [
            { index: 0, value: '{', state: 'default', subLabel: 'Bottom' },
            { index: 1, value: '[', state: 'default' },
            { index: 2, value: '(', state: 'active', subLabel: 'TOP' }
          ]
        },
        callStack: [{ funcName: 'isValidBrackets', args: 's="{[()]}"', locals: { i: 2, ch: '(', stackTop: '(' }, status: 'active' }],
        heap: [{ address: '0x3100', type: 'Array<char>', label: 'stack', value: '["{", "[", "("]', highlight: true }],
        variables: { index: 2, currentChar: '(', stackDepth: 3, topOfStack: '(' }
      },
      {
        stepNumber: 2,
        title: 'Encounter ")" and "]": LIFO Pop & Match',
        intuitionExplanation: 'Next we see `)`. We pop the top of the stack (`(`)—it matches! Then we see `]`, and the new top of the stack is `[`—another match! LIFO order naturally mirrors nested scopes.',
        internalsExplanation: '`stack.pop()` decrements `length` in O(1) and compares against `pairs[ch]`. Both `(` and `[` match and are popped.',
        codeLines: { typescript: [7, 8], python: [7, 8], cpp: [7, 8, 9] },
        timeDelta: '2 O(1) pops',
        spaceDelta: 'Stack Size: 1',
        array: [
          { index: 0, value: '{', state: 'visited' },
          { index: 1, value: '[', state: 'sorted', subLabel: 'matched' },
          { index: 2, value: '(', state: 'sorted', subLabel: 'matched' },
          { index: 3, value: ')', state: 'sorted', subLabel: 'matched' },
          { index: 4, value: ']', state: 'active', subLabel: 'popped [' },
          { index: 5, value: '}', state: 'default' }
        ],
        auxiliaryArray: {
          label: 'LIFO Stack (Bottom -> Top)',
          cells: [
            { index: 0, value: '{', state: 'active', subLabel: 'TOP' }
          ]
        },
        callStack: [{ funcName: 'isValidBrackets', args: 's="{[()]}"', locals: { i: 4, ch: ']', popped: '[' }, status: 'active' }],
        heap: [{ address: '0x3100', type: 'Array<char>', label: 'stack', value: '["{"]', highlight: true }],
        variables: { index: 4, currentChar: ']', poppedChar: '[', stackDepth: 1 }
      },
      {
        stepNumber: 3,
        title: 'Final Pop "}" & Empty Stack Check -> Valid!',
        intuitionExplanation: 'The last character `}` pops `{`. Now the loop finishes and `stack.length === 0`, confirming every opening bracket was properly closed in LIFO order!',
        internalsExplanation: 'Final `pop()` leaves `stack.length == 0`. Returns `true` in O(n) total time.',
        codeLines: { typescript: [8, 11], python: [8, 10], cpp: [8, 9, 12] },
        timeDelta: 'Total: 6 ops (O(n))',
        spaceDelta: 'Stack Size: 0',
        array: [
          { index: 0, value: '{', state: 'found' },
          { index: 1, value: '[', state: 'found' },
          { index: 2, value: '(', state: 'found' },
          { index: 3, value: ')', state: 'found' },
          { index: 4, value: ']', state: 'found' },
          { index: 5, value: '}', state: 'found', subLabel: 'All Matched!' }
        ],
        auxiliaryArray: {
          label: 'LIFO Stack (Empty)',
          cells: [{ index: 0, value: 'EMPTY (len=0)', state: 'found', subLabel: 'Valid!' }]
        },
        callStack: [{ funcName: 'isValidBrackets', args: 's="{[()]}"', locals: { isValid: true }, status: 'returning' }],
        heap: [{ address: '0x3100', type: 'Array<char>', label: 'stack', value: '[]', highlight: false }],
        variables: { stackLength: 0, returnValue: true }
      }
    ]
  },
  {
    id: 'monotonic-stack-queue',
    title: 'Monotonic Stack & Queue: Next Greater Element & Sliding Window Max',
    shortTitle: 'Monotonic Stack/Queue',
    category: 'linear-ds',
    difficulty: 'Intermediate',
    summary: 'Discover how keeping a stack strictly decreasing solves "Next Greater Element / Daily Temperatures" in O(n) instead of O(n²).',
    intuitionOverview: 'Imagine people standing in a line, and each person wants to know the first taller person to their right. As we walk through the line, we keep a stack of "waiting" people in decreasing height order. The moment a taller person arrives, they immediately answer the question for everyone shorter than them on top of the stack!',
    internalsOverview: 'A Monotonic Decreasing Stack maintains the invariant `nums[stack[k]] >= nums[stack[k+1]]`. Although there is a `while` loop inside the `for` loop, each index is pushed once and popped at most once, guaranteeing amortized O(1) work per element and strict O(n) total time.',
    realWorldUseCases: [
      'Stock span analysis, candlestick chart resistance peaks, and Daily Temperatures',
      'Largest Rectangle in Histogram & Trapping Rain Water',
      'Monotonic Deque for real-time O(n) Sliding Window Maximum in streaming telemetry'
    ],
    keyInvariants: [
      'Monotonicity Invariant: Indices in the stack always have strictly decreasing values `T[stack[0]] > T[stack[1]] > ...`.',
      'Amortized Bound: Each index enters the stack once and leaves at most once -> maximum `2n` stack operations.'
    ],
    complexity: {
      timeBest: 'O(n)',
      timeAverage: 'O(n) Amortized',
      timeWorst: 'O(n) (At most 2n ops)',
      space: 'O(n) Stack Indices',
      note: 'Inner while loop runs at most n times across the entire execution, not n times per step!'
    },
    code: {
      typescript: `function nextGreaterElements(temps: number[]): number[] {
  const res = new Array(temps.length).fill(-1);
  const stack: number[] = []; // Stores indices in decreasing temp order
  for (let i = 0; i < temps.length; i++) {
    while (stack.length > 0 && temps[i] > temps[stack[stack.length - 1]]) {
      const prevIdx = stack.pop()!;
      res[prevIdx] = temps[i]; // temps[i] is the Next Greater for prevIdx!
    }
    stack.push(i);
  }
  return res;
}`,
      python: `def next_greater_elements(temps: list[int]) -> list[int]:
    res = [-1] * len(temps)
    stack = []  # Stores indices in decreasing temp order
    for i, t in enumerate(temps):
        while stack and t > temps[stack[-1]]:
            prev_idx = stack.pop()
            res[prev_idx] = t  # Found Next Greater for prev_idx!
        stack.append(i)
    return res`,
      cpp: `vector<int> nextGreaterElements(const vector<int>& temps) {
    vector<int> res(temps.size(), -1);
    stack<int> st; // Stores indices in decreasing order
    for (int i = 0; i < temps.size(); i++) {
        while (!st.empty() && temps[i] > temps[st.top()]) {
            int prevIdx = st.top(); st.pop();
            res[prevIdx] = temps[i];
        }
        st.push(i);
    }
    return res;
}`
    },
    liveSandboxCode: `const temps = [73, 71, 69, 75, 72];
const res = new Array(temps.length).fill(-1);
const stack = [];

for (let i = 0; i < temps.length; i++) {
  while (stack.length > 0 && temps[i] > temps[stack[stack.length - 1]]) {
    const idx = stack.pop();
    res[idx] = temps[i];
    console.log(\`Temp \${temps[i]} at idx \${i} resolves waiting temp \${temps[idx]} (idx \${idx})!\`);
  }
  stack.push(i);
  console.log(\`After i=\${i} (\${temps[i]}°): Stack = [\${stack.map(k => temps[k]).join(', ')}]\`);
}
console.log("Next Greater Temperatures:", res);`,
    steps: [
      {
        stepNumber: 1,
        title: 'Push Decreasing Sequence: 73°, 71°, 69° (i = 0, 1, 2)',
        intuitionExplanation: 'For `73°`, `71°`, and `69°`, each day is cooler than the previous one. None of them has found a warmer day yet, so all three indices wait in our Monotonic Decreasing Stack: `[73°, 71°, 69°]`.',
        internalsExplanation: 'Condition `temps[i] > temps[stack.top()]` is false for `i=1 (71 < 73)` and `i=2 (69 < 71)`. Stack holds indices `[0, 1, 2]`.',
        codeLines: { typescript: [4, 5, 9], python: [4, 5, 8], cpp: [4, 5, 9] },
        timeDelta: '3 pushes',
        spaceDelta: 'Stack: [0, 1, 2]',
        array: [
          { index: 0, value: 73, state: 'window', subLabel: 'Wait in Stack' },
          { index: 1, value: 71, state: 'window', subLabel: 'Wait in Stack' },
          { index: 2, value: 69, state: 'active', subLabel: 'Top of Stack' },
          { index: 3, value: 75, state: 'default' },
          { index: 4, value: 72, state: 'default' }
        ],
        auxiliaryArray: {
          label: 'Monotonic Decreasing Stack (Values)',
          cells: [
            { index: 0, value: '73° (idx 0)', state: 'default' },
            { index: 1, value: '71° (idx 1)', state: 'default' },
            { index: 2, value: '69° (idx 2)', state: 'active', subLabel: 'TOP' }
          ]
        },
        pointers: [{ name: 'i', index: 2, color: 'indigo' }],
        callStack: [{ funcName: 'nextGreaterElements', args: 'temps=[73,71,69,75,72]', locals: { i: 2, 'temps[i]': 69 }, status: 'active' }],
        heap: [{ address: '0x5200', type: 'Int32[5]', label: 'res', value: '[-1, -1, -1, -1, -1]' }],
        variables: { i: 2, currentTemp: 69, stackValues: '[73, 71, 69]' }
      },
      {
        stepNumber: 2,
        title: '75° Arrives at i = 3: Cascade Pops Resolve 69°, 71°, and 73°!',
        intuitionExplanation: 'Suddenly `75°` arrives! Because `75°` is warmer than `69°` (top), we pop `69°` and record `75°` as its answer. Then `75° > 71°`—pop and record! Then `75° > 73°`—pop and record! One single warmer day resolved all 3 waiting days at once!',
        internalsExplanation: 'The `while` loop executes 3 times, popping indices `2, 1, 0` and setting `res[2]=75, res[1]=75, res[0]=75`. Then index `3 (75°)` is pushed onto the now-empty stack.',
        codeLines: { typescript: [5, 6, 7, 9], python: [5, 6, 7, 8], cpp: [5, 6, 7, 9] },
        timeDelta: '3 pops + 1 push',
        spaceDelta: 'Stack: [3]',
        array: [
          { index: 0, value: 73, state: 'found', subLabel: 'Next > is 75' },
          { index: 1, value: 71, state: 'found', subLabel: 'Next > is 75' },
          { index: 2, value: 69, state: 'found', subLabel: 'Next > is 75' },
          { index: 3, value: 75, state: 'active', subLabel: 'Popped 3!' },
          { index: 4, value: 72, state: 'default' }
        ],
        auxiliaryArray: {
          label: 'Monotonic Decreasing Stack (Values)',
          cells: [
            { index: 0, value: '75° (idx 3)', state: 'active', subLabel: 'New TOP' }
          ]
        },
        pointers: [{ name: 'i', index: 3, color: 'emerald' }],
        callStack: [{ funcName: 'nextGreaterElements', args: 'temps=[73,71,69,75,72]', locals: { i: 3, 'temps[i]': 75, poppedCount: 3 }, status: 'active' }],
        heap: [{ address: '0x5200', type: 'Int32[5]', label: 'res', value: '[75, 75, 75, -1, -1]', highlight: true }],
        variables: { i: 3, currentTemp: 75, resolvedIndices: '2, 1, 0', stackValues: '[75]' }
      },
      {
        stepNumber: 3,
        title: 'Final Step i = 4 (72°): Push & Complete in O(n)',
        intuitionExplanation: 'At `i = 4`, `72°` is smaller than `75°`, so it pushes onto the stack `[75°, 72°]`. The loop ends, and anything still in the stack keeps its default `-1` (no warmer day to its right).',
        internalsExplanation: 'Total stack operations: 5 pushes + 3 pops = 8 operations for `n = 5` elements. Strict O(n) time complexity.',
        codeLines: { typescript: [9, 11], python: [8, 9], cpp: [9, 11] },
        timeDelta: 'Total: 8 ops (O(n))',
        spaceDelta: 'Stack: [3, 4]',
        array: [
          { index: 0, value: 73, state: 'sorted', subLabel: '-> 75' },
          { index: 1, value: 71, state: 'sorted', subLabel: '-> 75' },
          { index: 2, value: 69, state: 'sorted', subLabel: '-> 75' },
          { index: 3, value: 75, state: 'visited', subLabel: '-> -1' },
          { index: 4, value: 72, state: 'visited', subLabel: '-> -1' }
        ],
        auxiliaryArray: {
          label: 'Final Result Array (res)',
          cells: [
            { index: 0, value: 75, state: 'found' },
            { index: 1, value: 75, state: 'found' },
            { index: 2, value: 75, state: 'found' },
            { index: 3, value: -1, state: 'default' },
            { index: 4, value: -1, state: 'default' }
          ]
        },
        callStack: [{ funcName: 'nextGreaterElements', args: 'temps', locals: { res: '[75, 75, 75, -1, -1]' }, status: 'returning' }],
        heap: [{ address: '0x5200', type: 'Int32[5]', label: 'res', value: '[75, 75, 75, -1, -1]', highlight: true }],
        variables: { totalPushes: 5, totalPops: 3, finalOutput: '[75, 75, 75, -1, -1]' }
      }
    ]
  }
];
