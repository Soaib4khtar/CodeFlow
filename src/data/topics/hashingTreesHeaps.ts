import { TopicDefinition } from '../../types/visualizer';

export const hashingTreesHeapsTopics: TopicDefinition[] = [
  {
    id: 'hash-tables-collisions-internals',
    title: 'Hash Tables: Hash Functions, Modulo Buckets & Collision Resolution',
    shortTitle: 'Hash Tables',
    category: 'hashing-trees-heaps',
    difficulty: 'Intermediate',
    summary: 'See how keys are hashed into numeric bucket indices, what happens when two keys collide in the same bucket, and how load factor triggers rehashing.',
    intuitionOverview: 'A Hash Table is a giant filing cabinet with numbered drawers (buckets). Instead of searching every drawer to find `"alice"`, a Hash Function turns the letters `"alice"` into a number (like `1042`), divides by the number of drawers (`1042 % 4 = 2`), and opens Drawer #2 immediately! If two keys land in Drawer #2 (a collision), we chain them together inside that drawer.',
    internalsOverview: 'Under the hood, a Hash Map allocates an array of `M` buckets. `index = hash(key) & (M - 1)` (when `M` is a power of 2). Separate Chaining stores colliding `<key, value, hash>` nodes in a linked list (or red-black tree in Java 8+ when chain length > 8). When `size / M > 0.75` (Load Factor), the bucket array doubles to `2M` and rehashes all entries.',
    realWorldUseCases: [
      'Redis in-memory key-value store & database Hash Indexes',
      'JavaScript V8 Objects / ES6 `Map`, Python `dict`, C++ `std::unordered_map`',
      'Caching API responses, deduplication, and O(1) frequency counting'
    ],
    keyInvariants: [
      'Deterministic Hashing: Equal keys (`k1 === k2`) MUST always produce the exact same hash and bucket index.',
      'Load Factor Bound: Keeping `α = N / M <= 0.75` ensures average chain length stays O(1).'
    ],
    complexity: {
      timeBest: 'O(1) Direct Bucket Hit',
      timeAverage: 'O(1) Amortized',
      timeWorst: 'O(n) Hash Collision DoS',
      space: 'O(n + m) Buckets & Entries',
      note: 'Worst-case O(n) occurs only if all keys collide into a single bucket; cryptographic/salted SipHash prevents this.'
    },
    code: {
      typescript: `class HashMap {
  buckets: Array<Array<[string, number]>> = [[], [], [], []];

  private hash(key: string): number {
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return h % this.buckets.length; // Modulo maps hash -> bucket [0..3]
  }

  set(key: string, val: number): void {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    for (const pair of bucket) {
      if (pair[0] === key) { pair[1] = val; return; } // Update existing
    }
    bucket.push([key, val]); // Append to collision chain
  }
}`,
      python: `class HashMap:
    def __init__(self):
        self.buckets = [[], [], [], []]

    def _hash(self, key: str) -> int:
        h = 0
        for ch in key:
            h = (h * 31 + ord(ch)) & 0xFFFFFFFF
        return h % len(self.buckets)

    def set(self, key: str, val: int) -> None:
        idx = self._hash(key)
        bucket = self.buckets[idx]
        for pair in bucket:
            if pair[0] == key:
                pair[1] = val
                return
        bucket.append([key, val])  # Collision chain`,
      cpp: `class HashMap {
    vector<list<pair<string, int>>> buckets{4};
    size_t hashIdx(const string& key) {
        size_t h = 0;
        for (char c : key) h = h * 31 + c;
        return h % buckets.size();
    }
public:
    void set(const string& key, int val) {
        size_t idx = hashIdx(key);
        for (auto& kv : buckets[idx]) {
            if (kv.first == key) { kv.second = val; return; }
        }
        buckets[idx].push_back({key, val});
    }
};`
    },
    liveSandboxCode: `// Test polynomial rolling hash and bucket collisions!
const NUM_BUCKETS = 4;
const buckets = Array.from({ length: NUM_BUCKETS }, () => []);

function hashKey(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return { rawHash: h, bucketIdx: h % NUM_BUCKETS };
}

for (const [k, v] of [["api_key", 101], ["user_id", 42], ["session", 99], ["token", 77]]) {
  const { rawHash, bucketIdx } = hashKey(k);
  buckets[bucketIdx].push({ key: k, val: v, hash: rawHash });
  console.log(\`Key "\${k}" -> rawHash=\${rawHash} -> Bucket #\${bucketIdx}\`);
}

console.log("Final Bucket Chains:", JSON.stringify(buckets, null, 2));`,
    steps: [
      {
        stepNumber: 1,
        title: 'Hash "alice" -> Bucket #1 & "bob" -> Bucket #3',
        intuitionExplanation: 'We insert `("alice", 95)` and `("bob", 88)`. The hash function turns `"alice"` into `hash = 92903141`, and `92903141 % 4 = 1`. So `"alice"` goes straight into Bucket #1 in O(1) time!',
        internalsExplanation: 'Polynomial rolling hash `h = h * 31 + charCode` computes 32-bit unsigned integer. Modulo `M = 4` maps `"alice"` to `buckets[1]` and `"bob"` to `buckets[3]`.',
        codeLines: { typescript: [4, 6, 7, 11, 16], python: [5, 8, 9, 12, 18], cpp: [3, 5, 6, 10, 14] },
        timeDelta: 'O(1) hash + insert',
        spaceDelta: 'Load Factor: 2/4 (0.50)',
        hashBuckets: [
          { bucketIndex: 0, entries: [] },
          { bucketIndex: 1, entries: [{ key: 'alice', value: 95, hash: 'h%4=1', state: 'active' }] },
          { bucketIndex: 2, entries: [] },
          { bucketIndex: 3, entries: [{ key: 'bob', value: 88, hash: 'h%4=3', state: 'active' }] }
        ],
        callStack: [{ funcName: 'HashMap.set', args: 'key="bob", val=88', locals: { idx: 3, loadFactor: 0.5 }, status: 'active' }],
        heap: [{ address: '0x6000', type: 'Bucket[4]', label: 'buckets', value: '[ [], [(alice:95)], [], [(bob:88)] ]', highlight: true }],
        variables: { lastKey: 'bob', computedBucket: 3, totalEntries: 2, loadFactor: '0.50' }
      },
      {
        stepNumber: 2,
        title: 'Hash Collision! "dave" Also Hashes to Bucket #1',
        intuitionExplanation: 'Now we insert `("dave", 72)`. Its hash modulo 4 is ALSO `1`! Bucket #1 already has `"alice"`. Instead of overwriting `"alice"`, Separate Chaining appends `("dave", 72)` as the second node in Bucket #1’s list.',
        internalsExplanation: 'Hash collision at `buckets[1]`. We traverse the bucket chain (`"alice" !== "dave"`) and append `["dave", 72]` to the tail of `buckets[1]`.',
        codeLines: { typescript: [11, 12, 13, 14, 16], python: [12, 13, 14, 15, 18], cpp: [10, 11, 12, 14] },
        timeDelta: 'O(1) chain append',
        spaceDelta: 'Load Factor: 3/4 (0.75)',
        hashBuckets: [
          { bucketIndex: 0, entries: [] },
          {
            bucketIndex: 1,
            entries: [
              { key: 'alice', value: 95, hash: 'h%4=1', state: 'default' },
              { key: 'dave', value: 72, hash: 'h%4=1 (COLLISION)', state: 'collision' }
            ]
          },
          { bucketIndex: 2, entries: [] },
          { bucketIndex: 3, entries: [{ key: 'bob', value: 88, hash: 'h%4=3', state: 'default' }] }
        ],
        callStack: [{ funcName: 'HashMap.set', args: 'key="dave", val=72', locals: { idx: 1, collisionWith: 'alice', chainLen: 2 }, status: 'active' }],
        heap: [{ address: '0x6000', type: 'Bucket[4]', label: 'buckets', value: '[ [], [(alice:95)->(dave:72)], [], [(bob:88)] ]', highlight: true }],
        variables: { lastKey: 'dave', computedBucket: 1, bucket1ChainLength: 2, loadFactor: '0.75 (Threshold)' }
      },
      {
        stepNumber: 3,
        title: 'O(1) Lookup of Colliding Key "dave" in Bucket #1',
        intuitionExplanation: 'When we look up `get("dave")`, we hash `"dave"` -> Bucket #1, skip `"alice"` (`"alice" !== "dave"`), and immediately match `"dave" -> 72`. Even with a small collision, we only checked 2 items instead of scanning the whole database!',
        internalsExplanation: 'Lookup computes `idx = 1`, inspects `buckets[1][0]` (`"alice"`), advances to `buckets[1][1]` (`"dave"`), and returns `72`.',
        codeLines: { typescript: [11, 13, 14], python: [12, 14, 15], cpp: [10, 11, 12] },
        timeDelta: '2 key checks (O(1))',
        spaceDelta: '3 keys stored',
        hashBuckets: [
          { bucketIndex: 0, entries: [] },
          {
            bucketIndex: 1,
            entries: [
              { key: 'alice', value: 95, hash: 'checked != dave', state: 'default' },
              { key: 'dave', value: 72, hash: 'MATCH!', state: 'found' }
            ]
          },
          { bucketIndex: 2, entries: [] },
          { bucketIndex: 3, entries: [{ key: 'bob', value: 88, hash: 'h%4=3', state: 'default' }] }
        ],
        callStack: [{ funcName: 'HashMap.get', args: 'key="dave"', locals: { idx: 1, foundValue: 72 }, status: 'returning' }],
        heap: [{ address: '0x6000', type: 'Bucket[4]', label: 'buckets', value: 'Hit at buckets[1][1] -> 72', highlight: true }],
        variables: { lookupKey: 'dave', bucketIndex: 1, probesRequired: 2, returnedValue: 72 }
      }
    ]
  },
  {
    id: 'binary-trees-bst-operations',
    title: 'Trees & Binary Search Trees (BST): Search, Insert & Traversals',
    shortTitle: 'Trees & BST',
    category: 'hashing-trees-heaps',
    difficulty: 'Intermediate',
    summary: 'Visualize the BST ordering invariant (Left < Node < Right) and see how each comparison eliminates half the remaining tree in O(log n) time.',
    intuitionOverview: 'A Binary Search Tree (BST) is a decision tree where every node follows one strict rule: everything in its LEFT subtree is smaller, and everything in its RIGHT subtree is larger. When searching or inserting `25`, each comparison acts like a railroad switch—sending you left or right and throwing away half the tree at every level!',
    internalsOverview: 'Each `TreeNode` holds `{ val, left*, right* }`. In a balanced BST of height `h = log₂(n)`, search and insertion traverse a root-to-leaf path of length at most `h`. In-order traversal (`Left -> Node -> Right`) visits BST nodes in strictly sorted ascending order.',
    realWorldUseCases: [
      'Database B-Trees / B+ Trees for range queries (`WHERE price BETWEEN 20 AND 50`)',
      'C++ `std::map` / `std::set` and Linux kernel Totally Fair Scheduler (Red-Black Trees)',
      'DOM hierarchy, Abstract Syntax Trees (AST), and file system directories'
    ],
    keyInvariants: [
      'BST Ordering Invariant: For every node `u`, `max(u.left) < u.val < min(u.right)`.',
      'In-Order Property: An in-order DFS traversal of any valid BST yields a sorted sequence.'
    ],
    complexity: {
      timeBest: 'O(1) Root Hit',
      timeAverage: 'O(log n) Balanced',
      timeWorst: 'O(n) Skewed Chain',
      space: 'O(h) Recursion Stack',
      note: 'Self-balancing trees (AVL, Red-Black) guarantee h = O(log n) even on sorted insertions.'
    },
    code: {
      typescript: `function insertBST(root: TreeNode | null, val: number): TreeNode {
  if (root === null) {
    return new TreeNode(val); // Base case: attach new leaf here!
  }
  if (val < root.val) {
    root.left = insertBST(root.left, val);  // Go Left (<)
  } else if (val > root.val) {
    root.right = insertBST(root.right, val); // Go Right (>)
  }
  return root;
}`,
      python: `def insert_bst(root: Optional[TreeNode], val: int) -> TreeNode:
    if root is None:
        return TreeNode(val)  # Base case: attach new leaf!
    if val < root.val:
        root.left = insert_bst(root.left, val)   # Go Left (<)
    elif val > root.val:
        root.right = insert_bst(root.right, val)  # Go Right (>)
    return root`,
      cpp: `TreeNode* insertBST(TreeNode* root, int val) {
    if (!root) return new TreeNode(val); // Base case: new leaf
    if (val < root->val) {
        root->left = insertBST(root->left, val);  // Go Left (<)
    } else if (val > root->val) {
        root->right = insertBST(root->right, val); // Go Right (>)
    }
    return root;
}`
    },
    liveSandboxCode: `class TreeNode {
  constructor(val) { this.val = val; this.left = null; this.right = null; }
}

function insertBST(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = insertBST(root.left, val);
  else if (val > root.val) root.right = insertBST(root.right, val);
  return root;
}

function inOrder(root, out = []) {
  if (!root) return out;
  inOrder(root.left, out);
  out.push(root.val);
  inOrder(root.right, out);
  return out;
}

let root = null;
for (const v of [20, 10, 30, 5, 15, 25]) root = insertBST(root, v);
console.log("In-Order Traversal (Always Sorted!):", inOrder(root));`,
    steps: [
      {
        stepNumber: 1,
        title: 'Compare val = 25 with Root (20): 25 > 20 -> Go Right',
        intuitionExplanation: 'We want to insert `25` into our BST rooted at `20`. Since `25 > 20`, the BST rule guarantees `25` MUST belong in the right subtree. We immediately ignore the entire left subtree (`10, 5, 15`)!',
        internalsExplanation: 'At root `0xT20` (`val = 20`), `25 > 20` evaluates true. Recursive call `insertBST(root.right, 25)` descends to `Node(30)`.',
        codeLines: { typescript: [1, 7, 8], python: [1, 6, 7], cpp: [1, 5, 6] },
        timeDelta: '1 comparison',
        spaceDelta: 'Stack Depth: 1',
        tree: [
          { id: 'n20', val: 20, x: 50, y: 16, leftId: 'n10', rightId: 'n30', state: 'active', badge: '25 > 20 -> Right' },
          { id: 'n10', val: 10, x: 25, y: 48, leftId: 'n5', rightId: 'n15', state: 'default', badge: 'Pruned' },
          { id: 'n30', val: 30, x: 75, y: 48, leftId: null, rightId: 'n40', state: 'path' },
          { id: 'n5', val: 5, x: 13, y: 80, state: 'default' },
          { id: 'n15', val: 15, x: 37, y: 80, state: 'default' },
          { id: 'n40', val: 40, x: 87, y: 80, state: 'default' }
        ],
        callStack: [{ funcName: 'insertBST', args: 'root=Node(20), val=25', locals: { 'root.val': 20, branch: 'right' }, status: 'active' }],
        heap: [{ address: '0xT20', type: 'TreeNode', label: 'Root(20)', value: '{ val: 20, left: Node(10), right: Node(30) }', highlight: true }],
        variables: { targetVal: 25, currentNode: 20, comparison: '25 > 20 (Go Right)' }
      },
      {
        stepNumber: 2,
        title: 'Compare val = 25 with Node(30): 25 < 30 -> Go Left',
        intuitionExplanation: 'Now we are at `Node(30)`. Since `25 < 30`, we branch LEFT (`root.left`). Notice `Node(30).left` is currently `null`—we found the exact empty spot where `25` belongs!',
        internalsExplanation: 'At `Node(30)`, `25 < 30` is true. Recursive call `insertBST(nullptr, 25)` is invoked for `Node(30)->left`.',
        codeLines: { typescript: [1, 5, 6], python: [1, 4, 5], cpp: [1, 3, 4] },
        timeDelta: '2 comparisons',
        spaceDelta: 'Stack Depth: 2',
        tree: [
          { id: 'n20', val: 20, x: 50, y: 16, leftId: 'n10', rightId: 'n30', state: 'visited' },
          { id: 'n10', val: 10, x: 25, y: 48, leftId: 'n5', rightId: 'n15', state: 'default' },
          { id: 'n30', val: 30, x: 75, y: 48, leftId: null, rightId: 'n40', state: 'active', badge: '25 < 30 -> Left' },
          { id: 'n5', val: 5, x: 13, y: 80, state: 'default' },
          { id: 'n15', val: 15, x: 37, y: 80, state: 'default' },
          { id: 'n40', val: 40, x: 87, y: 80, state: 'default' }
        ],
        callStack: [
          { funcName: 'insertBST', args: 'root=Node(30), val=25', locals: { 'root.val': 30, branch: 'left (null)' }, status: 'active' },
          { funcName: 'insertBST', args: 'root=Node(20), val=25', locals: { 'root.val': 20 }, status: 'waiting' }
        ],
        heap: [{ address: '0xT30', type: 'TreeNode', label: 'Node(30)', value: '{ val: 30, left: null, right: Node(40) }', highlight: true }],
        variables: { targetVal: 25, currentNode: 30, comparison: '25 < 30 (Go Left)' }
      },
      {
        stepNumber: 3,
        title: 'Base Case: Allocate New TreeNode(25) & Link to Node(30).left',
        intuitionExplanation: '`root === null` triggers the base case! We allocate `new TreeNode(25)` on the Heap and return its pointer back to `Node(30).left`. In just 2 comparisons (`O(log n)`), `25` is linked in its exact sorted position!',
        internalsExplanation: 'Heap allocates `0xT25` (`val = 25`). Unwinding recursion assigns `Node(30)->left = 0xT25`. In-order sequence is now `[5, 10, 15, 20, 25, 30, 40]`.',
        codeLines: { typescript: [2, 3, 6, 10], python: [2, 3, 5, 8], cpp: [2, 4, 8] },
        timeDelta: 'Total: O(log n)',
        spaceDelta: '+1 TreeNode (0xT25)',
        tree: [
          { id: 'n20', val: 20, x: 50, y: 16, leftId: 'n10', rightId: 'n30', state: 'visited' },
          { id: 'n10', val: 10, x: 25, y: 48, leftId: 'n5', rightId: 'n15', state: 'default' },
          { id: 'n30', val: 30, x: 75, y: 48, leftId: 'n25', rightId: 'n40', state: 'modified' },
          { id: 'n5', val: 5, x: 13, y: 80, state: 'default' },
          { id: 'n15', val: 15, x: 37, y: 80, state: 'default' },
          { id: 'n25', val: 25, x: 63, y: 80, state: 'found', badge: 'Inserted Leaf!' },
          { id: 'n40', val: 40, x: 87, y: 80, state: 'default' }
        ],
        callStack: [{ funcName: 'insertBST', args: 'root=Node(20), val=25', locals: { insertedAt: 'Node(30).left' }, status: 'returning' }],
        heap: [
          { address: '0xT30', type: 'TreeNode', label: 'Node(30)', value: '{ val: 30, left: 0xT25, right: Node(40) }' },
          { address: '0xT25', type: 'TreeNode', label: 'Node(25)', value: '{ val: 25, left: null, right: null }', highlight: true }
        ],
        variables: { newNodeAddr: '0xT25', parentNode: 30, treeHeight: 3 }
      }
    ]
  },
  {
    id: 'heaps-priority-queue',
    title: 'Binary Heaps & Priority Queues: Dual Array-Tree Representation & Sift-Up',
    shortTitle: 'Heaps & Priority Queue',
    category: 'hashing-trees-heaps',
    difficulty: 'Intermediate',
    summary: 'See how a Binary Min-Heap is stored inside a flat Array without pointers (`left = 2i+1, right = 2i+2`) and bubbles new elements up in O(log n).',
    intuitionOverview: 'A Min-Heap is a tournament bracket where the smallest number is ALWAYS crowned at the very top (index 0). Secretly, it doesn’t even use tree pointers—it’s packed tightly inside a normal Array! When we insert a tiny number like `2` at the bottom, it challenges its parent (`Math.floor((i-1)/2)`) and swaps upward until the Heap rule is restored.',
    internalsOverview: 'Complete binary tree mapped to a 0-indexed contiguous array: `parent(i) = (i - 1) >> 1`, `left(i) = 2i + 1`, `right(i) = 2i + 2`. Zero pointer overhead and high CPU cache locality.',
    realWorldUseCases: [
      'Dijkstra’s Shortest Path & A* Search Priority Queues',
      'OS Process Schedulers, timers, and Top-K streaming analytics (`Kth Largest Element`)',
      'Median of Data Stream (Two Heaps: Max-Heap + Min-Heap)'
    ],
    keyInvariants: [
      'Min-Heap Property: Every parent is smaller than or equal to both of its children (`heap[parent(i)] <= heap[i]`).',
      'Complete Tree Shape: All levels are completely filled except possibly the last, which is filled strictly left-to-right.'
    ],
    complexity: {
      timeBest: 'O(1) Peek Min',
      timeAverage: 'O(log n) Push / Pop',
      timeWorst: 'O(log n) Sift-Up/Down',
      space: 'O(n) Compact Array',
      note: 'Building a heap from n items bottom-up (heapify) runs in linear O(n) time!'
    },
    code: {
      typescript: `function heapPush(heap: number[], val: number): void {
  heap.push(val); // 1. Append at end of array (next leaf slot)
  let i = heap.length - 1;
  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);
    if (heap[parent] <= heap[i]) break; // Min-Heap property satisfied!
    [heap[parent], heap[i]] = [heap[i], heap[parent]]; // Swap with parent
    i = parent; // Move up to parent index
  }
}`,
      python: `def heap_push(heap: list[int], val: int) -> None:
    heap.append(val)  # 1. Append at end of array
    i = len(heap) - 1
    while i > 0:
        parent = (i - 1) // 2
        if heap[parent] <= heap[i]:
            break  # Min-Heap invariant satisfied!
        heap[parent], heap[i] = heap[i], heap[parent]
        i = parent`,
      cpp: `void heapPush(vector<int>& heap, int val) {
    heap.push_back(val);
    int i = heap.size() - 1;
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (heap[parent] <= heap[i]) break;
        swap(heap[parent], heap[i]);
        i = parent;
    }
}`
    },
    liveSandboxCode: `const heap = [5, 8, 12, 15, 20];
console.log("Initial Min-Heap Array:", [...heap]);

function pushMinHeap(h, val) {
  h.push(val);
  let i = h.length - 1;
  while (i > 0) {
    const p = Math.floor((i - 1) / 2);
    if (h[p] <= h[i]) break;
    console.log(\`Sift-Up Swap: child h[\${i}]=\${h[i]} <-> parent h[\${p}]=\${h[p]}\`);
    [h[p], h[i]] = [h[i], h[p]];
    i = p;
  }
}

pushMinHeap(heap, 2);
console.log("Final Min-Heap Array (Root is new Min!):", heap);`,
    steps: [
      {
        stepNumber: 1,
        title: 'Append val = 2 at Index 5 (Left Child of 12)',
        intuitionExplanation: 'We push `2` into our Min-Heap `[5, 8, 12, 15, 20]`. First, `2` is placed at the end of the array (`index 5`), which corresponds to the left child of `12` (`parent = Math.floor((5-1)/2) = 2`).',
        internalsExplanation: '`heap.push(2)` writes at index `i = 5`. Parent index is `(5 - 1) >> 1 = 2` (`heap[2] = 12`). Since `12 > 2`, the Min-Heap invariant is violated.',
        codeLines: { typescript: [2, 3, 5, 6], python: [2, 3, 5, 6], cpp: [2, 3, 5, 6] },
        timeDelta: 'O(1) append',
        spaceDelta: 'Heap size: 6',
        array: [
          { index: 0, value: 5, state: 'default', subLabel: 'Root' },
          { index: 1, value: 8, state: 'default', subLabel: 'p=0' },
          { index: 2, value: 12, state: 'comparing', subLabel: 'Parent (p=2)' },
          { index: 3, value: 15, state: 'default', subLabel: 'p=1' },
          { index: 4, value: 20, state: 'default', subLabel: 'p=1' },
          { index: 5, value: 2, state: 'active', subLabel: 'New (i=5)' }
        ],
        tree: [
          { id: 'h0', val: 5, x: 50, y: 16, leftId: 'h1', rightId: 'h2', state: 'default', badge: 'idx 0' },
          { id: 'h1', val: 8, x: 25, y: 48, leftId: 'h3', rightId: 'h4', state: 'default', badge: 'idx 1' },
          { id: 'h2', val: 12, x: 75, y: 48, leftId: 'h5', rightId: null, state: 'visited', badge: 'idx 2 (Parent)' },
          { id: 'h3', val: 15, x: 13, y: 80, state: 'default', badge: 'idx 3' },
          { id: 'h4', val: 20, x: 37, y: 80, state: 'default', badge: 'idx 4' },
          { id: 'h5', val: 2, x: 63, y: 80, state: 'active', badge: 'idx 5 (2 < 12!)' }
        ],
        callStack: [{ funcName: 'heapPush', args: 'heap, val=2', locals: { i: 5, parent: 2, 'heap[2]': 12, 'heap[5]': 2 }, status: 'active' }],
        heap: [{ address: '0xH100', type: 'Int32[6]', label: 'heap', value: '[5, 8, 12, 15, 20, 2]', highlight: true }],
        variables: { i: 5, parentIdx: 2, childVal: 2, parentVal: 12 }
      },
      {
        stepNumber: 2,
        title: 'Sift-Up Swap #1: Swap 2 (idx 5) <-> 12 (idx 2)',
        intuitionExplanation: 'Because `2 < 12`, we swap them! Now `2` sits at `index 2`, and `12` moves down to `index 5`. Next, `2` checks its new parent at `Math.floor((2-1)/2) = index 0` (the root `5`).',
        internalsExplanation: 'Swapped `heap[2]` and `heap[5]`. Updated `i = 2`. Next parent is `(2 - 1) >> 1 = 0` (`heap[0] = 5`). Since `5 > 2`, another swap is needed.',
        codeLines: { typescript: [7, 8, 5, 6], python: [8, 9, 5, 6], cpp: [7, 8, 5, 6] },
        timeDelta: '1 swap',
        spaceDelta: 'O(1) in-place',
        array: [
          { index: 0, value: 5, state: 'comparing', subLabel: 'Parent (p=0)' },
          { index: 1, value: 8, state: 'default' },
          { index: 2, value: 2, state: 'active', subLabel: 'Bubbled (i=2)' },
          { index: 3, value: 15, state: 'default' },
          { index: 4, value: 20, state: 'default' },
          { index: 5, value: 12, state: 'swapped', subLabel: 'Swapped down' }
        ],
        tree: [
          { id: 'h0', val: 5, x: 50, y: 16, leftId: 'h1', rightId: 'h2', state: 'visited', badge: 'idx 0 (5 > 2!)' },
          { id: 'h1', val: 8, x: 25, y: 48, leftId: 'h3', rightId: 'h4', state: 'default', badge: 'idx 1' },
          { id: 'h2', val: 2, x: 75, y: 48, leftId: 'h5', rightId: null, state: 'active', badge: 'idx 2' },
          { id: 'h3', val: 15, x: 13, y: 80, state: 'default', badge: 'idx 3' },
          { id: 'h4', val: 20, x: 37, y: 80, state: 'default', badge: 'idx 4' },
          { id: 'h5', val: 12, x: 63, y: 80, state: 'modified', badge: 'idx 5' }
        ],
        callStack: [{ funcName: 'heapPush', args: 'heap, val=2', locals: { i: 2, parent: 0, 'heap[0]': 5, 'heap[2]': 2 }, status: 'active' }],
        heap: [{ address: '0xH100', type: 'Int32[6]', label: 'heap', value: '[5, 8, 2, 15, 20, 12]', highlight: true }],
        variables: { i: 2, parentIdx: 0, childVal: 2, parentVal: 5 }
      },
      {
        stepNumber: 3,
        title: 'Sift-Up Swap #2: 2 Reaches Root (idx 0) -> Min-Heap Restored!',
        intuitionExplanation: 'Since `2 < 5`, we swap `2` with the root `5`! Now `i = 0`, the loop finishes, and `2` is the new minimum at `heap[0]`, ready for O(1) peek in just 2 swaps (`O(log n)`).',
        internalsExplanation: 'Swapped `heap[0]` and `heap[2]`. `i = 0` terminates `while (i > 0)`. Total swaps: `2 <= log₂(6)`.',
        codeLines: { typescript: [7, 8, 4], python: [8, 9, 4], cpp: [7, 8, 4] },
        timeDelta: 'Total: 2 swaps (O(log n))',
        spaceDelta: 'O(1) aux',
        array: [
          { index: 0, value: 2, state: 'found', subLabel: 'New Min Root!' },
          { index: 1, value: 8, state: 'default' },
          { index: 2, value: 5, state: 'swapped', subLabel: 'Swapped down' },
          { index: 3, value: 15, state: 'default' },
          { index: 4, value: 20, state: 'default' },
          { index: 5, value: 12, state: 'default' }
        ],
        tree: [
          { id: 'h0', val: 2, x: 50, y: 16, leftId: 'h1', rightId: 'h2', state: 'found', badge: 'idx 0 (New Min!)' },
          { id: 'h1', val: 8, x: 25, y: 48, leftId: 'h3', rightId: 'h4', state: 'default', badge: 'idx 1' },
          { id: 'h2', val: 5, x: 75, y: 48, leftId: 'h5', rightId: null, state: 'modified', badge: 'idx 2' },
          { id: 'h3', val: 15, x: 13, y: 80, state: 'default', badge: 'idx 3' },
          { id: 'h4', val: 20, x: 37, y: 80, state: 'default', badge: 'idx 4' },
          { id: 'h5', val: 12, x: 63, y: 80, state: 'default', badge: 'idx 5' }
        ],
        callStack: [{ funcName: 'heapPush', args: 'heap, val=2', locals: { i: 0, newMin: 2 }, status: 'returning' }],
        heap: [{ address: '0xH100', type: 'Int32[6]', label: 'heap', value: '[2, 8, 5, 15, 20, 12]', highlight: true }],
        variables: { i: 0, minRoot: 2, swapsPerformed: 2 }
      }
    ]
  },
  {
    id: 'tries-prefix-trees',
    title: 'Tries (Prefix Trees): Autocomplete & O(L) Prefix Search',
    shortTitle: 'Tries (Prefix Trees)',
    category: 'hashing-trees-heaps',
    difficulty: 'Intermediate',
    summary: 'See how words sharing prefixes ("cat", "car", "cart") share tree nodes so autocomplete lookups depend only on word length O(L), even across millions of dictionary words.',
    intuitionOverview: 'If you have 1,000,000 words in a dictionary and a user types `"ca"`, scanning all 1,000,000 words is way too slow. A Trie stores words character-by-character down a tree where words starting with `"ca"` (`"cat"`, `"car"`, `"cart"`) share the exact same `root -> c -> a` path! Checking if `"ca"` exists takes just 2 steps (`O(L)`), regardless of how many million words are in the Trie.',
    internalsOverview: 'Each `TrieNode` contains a fixed array of 26 child pointers (`children[26]`) or a compact hash map, plus a boolean `isEndOfWord` flag. Prefix search traverses `L` pointers in `O(L)` time.',
    realWorldUseCases: [
      'Search bar instant Autocomplete & Typeahead suggestions',
      'IP Routing Tables (Longest Prefix Matching in network routers)',
      'Spell checkers, Boggle/Wordle solvers, and T9 predictive text'
    ],
    keyInvariants: [
      'Shared Prefix Path: All strings with common prefix `P` share the exact same ancestor path of length `|P|` from `root`.',
      '`isEnd` Marker: Distinguishes complete words (e.g., `"car"`) from mere prefixes of longer words (e.g., `"ca"` or `"cart"`).'
    ],
    complexity: {
      timeBest: 'O(1) First Char Miss',
      timeAverage: 'O(L) Word Length',
      timeWorst: 'O(L) Independent of N',
      space: 'O(ALPHABET * TotalChars)',
      note: 'L is the length of the query string (typically L <= 20), making Trie lookup practically O(1) with respect to dictionary size N.'
    },
    code: {
      typescript: `class TrieNode {
  children: Record<string, TrieNode> = {};
  isEnd: boolean = false;
}

function insertWord(root: TrieNode, word: string): void {
  let curr = root;
  for (const ch of word) {
    if (!curr.children[ch]) {
      curr.children[ch] = new TrieNode(); // Create missing character edge
    }
    curr = curr.children[ch]; // Step down to child
  }
  curr.isEnd = true; // Mark complete word!
}`,
      python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

def insert_word(root: TrieNode, word: str) -> None:
    curr = root
    for ch in word:
        if ch not in curr.children:
            curr.children[ch] = TrieNode()
        curr = curr.children[ch]
    curr.is_end = True`,
      cpp: `struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};

void insertWord(TrieNode* root, const string& word) {
    TrieNode* curr = root;
    for (char ch : word) {
        if (!curr->children.count(ch))
            curr->children[ch] = new TrieNode();
        curr = curr->children[ch];
    }
    curr->isEnd = true;
}`
    },
    liveSandboxCode: `class Trie {
  constructor() { this.root = { children: {}, isEnd: false }; }
  insert(word) {
    let curr = this.root;
    for (const ch of word) {
      if (!curr.children[ch]) curr.children[ch] = { children: {}, isEnd: false };
      curr = curr.children[ch];
    }
    curr.isEnd = true;
  }
  autocomplete(prefix) {
    let curr = this.root;
    for (const ch of prefix) {
      if (!curr.children[ch]) return [];
      curr = curr.children[ch];
    }
    const results = [];
    const dfs = (node, path) => {
      if (node.isEnd) results.push(path);
      for (const [k, child] of Object.entries(node.children)) dfs(child, path + k);
    };
    dfs(curr, prefix);
    return results;
  }
}

const trie = new Trie();
["cat", "car", "cart", "dog"].forEach(w => trie.insert(w));
console.log("Autocomplete for 'ca':", trie.autocomplete("ca"));`,
    steps: [
      {
        stepNumber: 1,
        title: 'Existing Trie with "cat" and "car" Sharing Prefix "c -> a"',
        intuitionExplanation: 'Our Trie already stores `"cat"` and `"car"`. Notice how they share the `root -> c -> a` path, branching only at `t` and `r`. Now let’s insert `"cart"`!',
        internalsExplanation: 'Root holds child `c`, which holds `a`, which branches to `t (isEnd=true)` and `r (isEnd=true)`.',
        codeLines: { typescript: [6, 7, 8], python: [6, 7, 8], cpp: [6, 7, 8] },
        timeDelta: '0 ops',
        spaceDelta: '5 TrieNodes',
        tree: [
          { id: 'root', val: 'ROOT', x: 50, y: 12, leftId: 'c', rightId: 'd', state: 'active' },
          { id: 'c', val: 'c', x: 30, y: 36, leftId: 'a', state: 'default' },
          { id: 'd', val: 'd', x: 75, y: 36, state: 'default' },
          { id: 'a', val: 'a', x: 30, y: 60, leftId: 't1', rightId: 'r', state: 'default', badge: 'Shared "ca"' },
          { id: 't1', val: 't*', x: 15, y: 84, state: 'visited', badge: 'isEnd ("cat")' },
          { id: 'r', val: 'r*', x: 45, y: 84, state: 'visited', badge: 'isEnd ("car")' }
        ],
        callStack: [{ funcName: 'insertWord', args: 'word="cart"', locals: { curr: 'ROOT', ch: 'c' }, status: 'active' }],
        heap: [{ address: '0xTR00', type: 'TrieNode', label: 'Node("a")', value: '{ children: { t, r }, isEnd: false }', highlight: true }],
        variables: { word: 'cart', sharedPrefix: 'car', status: 'Starting at ROOT' }
      },
      {
        stepNumber: 2,
        title: 'Reuse Existing Prefix Path "c -> a -> r" in 3 Pointer Steps',
        intuitionExplanation: 'For `"c"`, `"a"`, and `"r"`, the nodes already exist! We simply follow the existing pointers down `root -> c -> a -> r` without allocating any new memory.',
        internalsExplanation: '`curr.children[ch]` hits existing nodes for `c`, `a`, and `r`. Zero allocations needed for the shared 3-char prefix.',
        codeLines: { typescript: [8, 9, 12], python: [8, 9, 11], cpp: [8, 9, 11] },
        timeDelta: '3 O(1) steps',
        spaceDelta: '+0 allocations',
        tree: [
          { id: 'root', val: 'ROOT', x: 50, y: 12, leftId: 'c', rightId: 'd', state: 'visited' },
          { id: 'c', val: 'c', x: 30, y: 36, leftId: 'a', state: 'path' },
          { id: 'd', val: 'd', x: 75, y: 36, state: 'default' },
          { id: 'a', val: 'a', x: 30, y: 60, leftId: 't1', rightId: 'r', state: 'path' },
          { id: 't1', val: 't*', x: 15, y: 84, state: 'default', badge: '"cat"' },
          { id: 'r', val: 'r*', x: 45, y: 84, state: 'active', badge: 'Reused "car"!' }
        ],
        callStack: [{ funcName: 'insertWord', args: 'word="cart"', locals: { curr: 'Node(r)', nextChar: 't' }, status: 'active' }],
        heap: [{ address: '0xTR04', type: 'TrieNode', label: 'Node("r")', value: '{ children: {}, isEnd: true }', highlight: true }],
        variables: { word: 'cart', matchedPrefix: 'car', remainingChar: 't' }
      },
      {
        stepNumber: 3,
        title: 'Allocate Only Final Child "t*" Under "r*" -> "cart" Complete!',
        intuitionExplanation: 'At `Node("r*")`, there is no `"t"` child yet, so we create `new TrieNode("t")` and set `isEnd = true`. Notice both `"car"` (`r*`) and `"cart"` (`t*`) are marked as valid words along the same branch!',
        internalsExplanation: 'Allocates single `TrieNode` for `"t"` under `Node("r")` and sets `isEnd = true`. Total time `O(L) = 4` steps.',
        codeLines: { typescript: [10, 12, 14], python: [10, 11, 12], cpp: [10, 11, 13] },
        timeDelta: 'Total: L=4 steps',
        spaceDelta: '+1 TrieNode ("t*")',
        tree: [
          { id: 'root', val: 'ROOT', x: 50, y: 10, leftId: 'c', rightId: 'd', state: 'visited' },
          { id: 'c', val: 'c', x: 30, y: 32, leftId: 'a', state: 'visited' },
          { id: 'd', val: 'd', x: 75, y: 32, state: 'default' },
          { id: 'a', val: 'a', x: 30, y: 54, leftId: 't1', rightId: 'r', state: 'visited' },
          { id: 't1', val: 't*', x: 15, y: 76, state: 'default', badge: '"cat"' },
          { id: 'r', val: 'r*', x: 45, y: 76, rightId: 't2', state: 'visited', badge: '"car"' },
          { id: 't2', val: 't*', x: 62, y: 92, state: 'found', badge: 'New! ("cart")' }
        ],
        callStack: [{ funcName: 'insertWord', args: 'word="cart"', locals: { curr: 'Node(t*)', isEnd: true }, status: 'returning' }],
        heap: [{ address: '0xTR05', type: 'TrieNode', label: 'Node("t")', value: '{ children: {}, isEnd: true }', highlight: true }],
        variables: { word: 'cart', newNodesCreated: 1, reusedPrefixNodes: 3 }
      }
    ]
  }
];
