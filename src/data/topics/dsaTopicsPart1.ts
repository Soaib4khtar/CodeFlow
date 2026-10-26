import { TopicData } from '@/types/codeflow';

export const dsaTopicsPart1: TopicData[] = [
  {
    id: 'arrays',
    title: 'Arrays',
    pillar: 'DSA',
    difficulty: 'Easy',
    iconName: 'Grid',
    description:
      'Given a contiguous array of integers, access elements in O(1) time via index offset or shift elements to insert/delete in O(n) time.',
    timeComplexity: 'O(1) Access / O(n) Insert',
    spaceComplexity: 'O(n) Contiguous Memory',
    intuition:
      'An Array stores elements side-by-side in a single unbroken block of memory. Jumping to any index is instant arithmetic (BaseAddress + index × 4 bytes), while inserting in the middle shifts trailing items right.',
    internals:
      'Hardware prefetcher loads 64-byte L1 cache lines of adjacent array cells. Dynamic arrays (JS Array, Python list, C++ std::vector) double capacity when full, giving O(1) amortized push.',
    traceSummary: 'Inserted 99 at index 2 (shifted 2 elements right)',
    code: {
      javascript: `function insertAt(arr, index, value) {
  // Shift elements right from the end down to index
  for (let i = arr.length; i > index; i--) {
    arr[i] = arr[i - 1];
  }

  // Write new value into opened slot
  arr[index] = value;
  return arr;
}

const nums = [10, 20, 30, 40];
const result = insertAt(nums, 2, 99);
console.log(result);`,
      typescript: `function insertAt(arr: number[], index: number, value: number): number[] {
  for (let i = arr.length; i > index; i--) {
    arr[i] = arr[i - 1];
  }
  arr[index] = value;
  return arr;
}

const result = insertAt([10, 20, 30, 40], 2, 99);
console.log(result);`,
      python: `def insert_at(arr: list[int], index: int, value: int) -> list[int]:
    arr.append(0)
    for i in range(len(arr) - 1, index, -1):
        arr[i] = arr[i - 1]
    arr[index] = value
    return arr

result = insert_at([10, 20, 30, 40], 2, 99)
print(result)`,
      cpp: `vector<int> insertAt(vector<int> arr, int index, int value) {
    arr.push_back(0);
    for (int i = arr.size() - 1; i > index; i--) {
        arr[i] = arr[i - 1];
    }
    arr[index] = value;
    return arr;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 1,
        explanation: 'Initialize contiguous array [10, 20, 30, 40]; target insertion index = 2, value = 99',
        boxes: [
          { index: 0, value: 10 },
          { index: 1, value: 20 },
          { index: 2, value: 30, state: 'active' },
          { index: 3, value: 40 },
          { index: 4, value: '—', state: 'discarded' }
        ],
        pointers: [
          { label: 'index', index: 2, color: 'blue' },
          { label: 'i', index: 4, color: 'purple' }
        ],
        variables: { index: 2, value: 99, length: 4 },
        callStack: ['insertAt(arr, index=2, value=99)']
      },
      {
        stepNumber: 2,
        activeLine: 4,
        explanation: 'Shift arr[3] (40) right into arr[4] → [10, 20, 30, 40, 40]',
        boxes: [
          { index: 0, value: 10 },
          { index: 1, value: 20 },
          { index: 2, value: 30 },
          { index: 3, value: 40, state: 'visited' },
          { index: 4, value: 40, state: 'active' }
        ],
        pointers: [
          { label: 'index', index: 2, color: 'green' },
          { label: 'i', index: 4, color: 'blue' }
        ],
        variables: { i: 4, 'arr[4]': 40 },
        callStack: ['insertAt(arr, index=2, value=99)']
      },
      {
        stepNumber: 3,
        activeLine: 4,
        explanation: 'Shift arr[2] (30) right into arr[3] → slot 2 is now open',
        boxes: [
          { index: 0, value: 10 },
          { index: 1, value: 20 },
          { index: 2, value: 30, state: 'visited' },
          { index: 3, value: 30, state: 'active' },
          { index: 4, value: 40 }
        ],
        pointers: [
          { label: 'index', index: 2, color: 'green' },
          { label: 'i', index: 3, color: 'blue' }
        ],
        variables: { i: 3, 'arr[3]': 30 },
        callStack: ['insertAt(arr, index=2, value=99)']
      },
      {
        stepNumber: 4,
        activeLine: 8,
        explanation: 'Write value = 99 into arr[2] → [10, 20, 99, 30, 40]',
        boxes: [
          { index: 0, value: 10 },
          { index: 1, value: 20 },
          { index: 2, value: 99, state: 'found' },
          { index: 3, value: 30 },
          { index: 4, value: 40 }
        ],
        pointers: [{ label: 'inserted', index: 2, color: 'green' }],
        variables: { 'arr[2]': 99, newLength: 5 },
        callStack: ['insertAt(arr, index=2, value=99) -> return']
      }
    ]
  },
  {
    id: 'strings',
    title: 'Strings',
    pillar: 'DSA',
    difficulty: 'Easy',
    iconName: 'Type',
    description:
      'Given a string s, determine if it is a palindrome or transform characters using two converging pointers in O(n) time.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    intuition:
      'Strings are arrays of characters (UTF-16/UTF-8 code units). Because strings are immutable in JS/Python/Java, modifying a character allocates a new string unless you convert to a character array or read with pointers.',
    internals:
      'Comparing characters from both ends (left = 0, right = n - 1) verifies symmetry in n/2 comparisons without allocating a reversed copy.',
    traceSummary: 'Verified palindrome "racecar" in 3 comparisons',
    code: {
      javascript: `function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    if (s[left] !== s[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}

const result = isPalindrome("racecar");
console.log(result);`,
      typescript: `function isPalindrome(s: string): boolean {
  let left = 0, right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
      python: `def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True`,
      cpp: `bool isPalindrome(const string& s) {
    int left = 0, right = (int)s.size() - 1;
    while (left < right) {
        if (s[left] != s[right]) return false;
        left++; right--;
    }
    return true;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 6,
        explanation: 'Compare s[0] ("r") === s[6] ("r") → Match! Move left=1, right=5',
        boxes: [
          { index: 0, value: 'r', state: 'active' },
          { index: 1, value: 'a' },
          { index: 2, value: 'c' },
          { index: 3, value: 'e' },
          { index: 4, value: 'c' },
          { index: 5, value: 'a' },
          { index: 6, value: 'r', state: 'active' }
        ],
        pointers: [
          { label: 'left', index: 0, color: 'green' },
          { label: 'right', index: 6, color: 'purple' }
        ],
        variables: { left: 0, right: 6, match: 'true' }
      },
      {
        stepNumber: 2,
        activeLine: 6,
        explanation: 'Compare s[1] ("a") === s[5] ("a") and s[2] ("c") === s[4] ("c") → Match!',
        boxes: [
          { index: 0, value: 'r', state: 'visited' },
          { index: 1, value: 'a', state: 'visited' },
          { index: 2, value: 'c', state: 'active' },
          { index: 3, value: 'e' },
          { index: 4, value: 'c', state: 'active' },
          { index: 5, value: 'a', state: 'visited' },
          { index: 6, value: 'r', state: 'visited' }
        ],
        pointers: [
          { label: 'left', index: 2, color: 'green' },
          { label: 'right', index: 4, color: 'purple' }
        ],
        variables: { left: 2, right: 4, match: 'true' }
      },
      {
        stepNumber: 3,
        activeLine: 12,
        explanation: 'Pointers meet at center index 3 ("e"): left === right → Return true!',
        boxes: [
          { index: 0, value: 'r', state: 'visited' },
          { index: 1, value: 'a', state: 'visited' },
          { index: 2, value: 'c', state: 'visited' },
          { index: 3, value: 'e', state: 'found' },
          { index: 4, value: 'c', state: 'visited' },
          { index: 5, value: 'a', state: 'visited' },
          { index: 6, value: 'r', state: 'visited' }
        ],
        pointers: [{ label: 'center', index: 3, color: 'blue' }],
        variables: { left: 3, right: 3, result: 'true' }
      }
    ]
  },
  {
    id: 'linked-lists',
    title: 'Linked Lists',
    pillar: 'DSA',
    difficulty: 'Easy',
    iconName: 'Link',
    description:
      'Given the head of a singly linked list, reverse the list in-place by flipping next pointers using prev, curr, and nextTemp.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) In-Place',
    intuition:
      'Each node lives anywhere in Heap memory and holds a next pointer to the following node. Reversing the list only requires flipping each arrow backward while saving nextTemp first.',
    internals:
      'Mutates 8-byte next pointers in-place without allocating new ListNode objects on the Heap.',
    traceSummary: 'Reversed 10 → 20 → 30 into 30 → 20 → 10 → null',
    code: {
      javascript: `function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr !== null) {
    const nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }

  return prev;
}`,
      typescript: `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;
  while (curr !== null) {
    const nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
      python: `def reverse_list(head: Optional[ListNode]) -> Optional[ListNode]:
    prev, curr = None, head
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    return prev`,
      cpp: `ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *curr = head;
    while (curr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 6,
        explanation: 'Start at head (10): save nextTemp = Node(20), flip Node(10).next → null',
        boxes: [
          { index: 0, value: '10 → null', state: 'active', subText: '0x40A0' },
          { index: 1, value: '20 → 30', state: 'default', subText: '0x91C0' },
          { index: 2, value: '30 → null', state: 'default', subText: '0x22F0' }
        ],
        pointers: [
          { label: 'prev', index: 0, color: 'green' },
          { label: 'curr', index: 1, color: 'blue' }
        ],
        variables: { prev: 'Node(10)', curr: 'Node(20)', nextTemp: 'Node(20)' }
      },
      {
        stepNumber: 2,
        activeLine: 7,
        explanation: 'At Node(20): save nextTemp = Node(30), flip Node(20).next → Node(10)',
        boxes: [
          { index: 0, value: '10 → null', state: 'visited', subText: '0x40A0' },
          { index: 1, value: '20 → 10', state: 'active', subText: '0x91C0' },
          { index: 2, value: '30 → null', state: 'default', subText: '0x22F0' }
        ],
        pointers: [
          { label: 'prev', index: 1, color: 'green' },
          { label: 'curr', index: 2, color: 'blue' }
        ],
        variables: { prev: 'Node(20)', curr: 'Node(30)', nextTemp: 'Node(30)' }
      },
      {
        stepNumber: 3,
        activeLine: 12,
        explanation: 'At Node(30): flip Node(30).next → Node(20). curr = null → Return prev (Node 30)!',
        boxes: [
          { index: 0, value: '30 → 20', state: 'found', subText: 'New Head' },
          { index: 1, value: '20 → 10', state: 'visited', subText: '0x91C0' },
          { index: 2, value: '10 → null', state: 'visited', subText: 'Tail' }
        ],
        pointers: [{ label: 'newHead', index: 0, color: 'blue' }],
        variables: { newHead: 'Node(30)', curr: 'null' }
      }
    ]
  },
  {
    id: 'stacks-queues',
    title: 'Stacks & Queues',
    pillar: 'DSA',
    difficulty: 'Easy',
    iconName: 'Layers',
    description:
      'Use a LIFO Stack to validate nested parentheses and a FIFO Queue to process items in exact arrival order in O(1) per operation.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    intuition:
      'A Stack is Last-In, First-Out (the most recently opened bracket must be closed first). A Queue is First-In, First-Out (like a checkout line).',
    internals:
      'Stack push/pop operate on the array tail in O(1). Circular queues use head and tail modulo pointers so dequeue never shifts elements.',
    traceSummary: 'All brackets matched — Stack empty at completion',
    code: {
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else if (stack.pop() !== map[ch]) {
      return false;
    }
  }
  return stack.length === 0;
}`,
      typescript: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if (ch in map) {
      if (stack.pop() !== map[ch]) return false;
    } else stack.push(ch);
  }
  return stack.length === 0;
}`,
      python: `def is_valid(s: str) -> bool:
    stack = []
    mp = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in mp:
            if not stack or stack.pop() != mp[ch]:
                return False
        else:
            stack.append(ch)
    return len(stack) == 0`,
      cpp: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char,char> mp = {{')','('},{']','['},{'}','{'}};
    for (char c : s) {
        if (mp.count(c)) {
            if (st.empty() || st.top() != mp[c]) return false;
            st.pop();
        } else st.push(c);
    }
    return st.empty();
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 7,
        explanation: 'Read "{", "[", "(" → Push all 3 opening brackets onto LIFO Stack',
        boxes: [
          { index: 0, value: '{', state: 'visited' },
          { index: 1, value: '[', state: 'visited' },
          { index: 2, value: '(', state: 'active', subText: 'TOP' }
        ],
        pointers: [{ label: 'top', index: 2, color: 'blue' }],
        variables: { currentChar: '(', stackSize: 3 }
      },
      {
        stepNumber: 2,
        activeLine: 8,
        explanation: 'Read ")" and "]" → Pop "(" then "[" from top of stack — both match!',
        boxes: [
          { index: 0, value: '{', state: 'active', subText: 'TOP' },
          { index: 1, value: '[ (popped)', state: 'discarded' },
          { index: 2, value: '( (popped)', state: 'discarded' }
        ],
        pointers: [{ label: 'top', index: 0, color: 'green' }],
        variables: { currentChar: ']', popped: '[', stackSize: 1 }
      },
      {
        stepNumber: 3,
        activeLine: 12,
        explanation: 'Read "}" → Pops "{". Stack length is 0 → Return true!',
        boxes: [{ index: 0, value: 'EMPTY (Valid)', state: 'found' }],
        pointers: [{ label: 'empty', index: 0, color: 'blue' }],
        variables: { stackLength: 0, valid: 'true' }
      }
    ]
  },
  {
    id: 'hash-tables',
    title: 'Hash Tables',
    pillar: 'DSA',
    difficulty: 'Easy',
    iconName: 'Hash',
    description:
      'Use a Hash Table (Map) to store key-value pairs in O(1) average time by mapping keys through a hash function into bucket indices.',
    timeComplexity: 'O(1) Average',
    spaceComplexity: 'O(n)',
    intuition:
      'Instead of scanning an array in O(n) to find a complement, a Hash Map computes bucket = hash(key) % buckets and jumps straight to the answer in O(1).',
    internals:
      'Handles hash collisions via Separate Chaining or Open Addressing (Linear/Quadratic Probing) and rehashes when Load Factor > 0.75.',
    traceSummary: 'Found complement 2 in Hash Map at index 0 → [0, 2]',
    code: {
      javascript: `function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) {
      return [seen.get(need), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}

const result = twoSum([2, 11, 7, 15], 9);`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need)!, i];
    seen.set(nums[i], i);
  }
  return [];
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        need = target - num
        if need in seen:
            return [seen[need], i]
        seen[num] = i
    return []`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int need = target - nums[i];
        if (seen.count(need)) return {seen[need], i};
        seen[nums[i]] = i;
    }
    return {};
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 9,
        explanation: 'i = 0 (val = 2): need = 9 - 2 = 7 (not in Map) → store seen.set(2, 0)',
        boxes: [
          { index: 0, value: 2, state: 'active', subText: 'seen[2]=0' },
          { index: 1, value: 11 },
          { index: 2, value: 7 },
          { index: 3, value: 15 }
        ],
        pointers: [{ label: 'i', index: 0, color: 'blue' }],
        variables: { i: 0, num: 2, need: 7, map: '{ 2: 0 }' }
      },
      {
        stepNumber: 2,
        activeLine: 9,
        explanation: 'i = 1 (val = 11): need = 9 - 11 = -2 (not in Map) → store seen.set(11, 1)',
        boxes: [
          { index: 0, value: 2, state: 'visited', subText: 'seen[2]=0' },
          { index: 1, value: 11, state: 'active', subText: 'seen[11]=1' },
          { index: 2, value: 7 },
          { index: 3, value: 15 }
        ],
        pointers: [{ label: 'i', index: 1, color: 'blue' }],
        variables: { i: 1, num: 11, need: -2, map: '{ 2: 0, 11: 1 }' }
      },
      {
        stepNumber: 3,
        activeLine: 7,
        explanation: 'i = 2 (val = 7): need = 9 - 7 = 2 → O(1) Hit in seen! Return [0, 2]',
        boxes: [
          { index: 0, value: 2, state: 'found', subText: 'Match idx 0' },
          { index: 1, value: 11, state: 'visited' },
          { index: 2, value: 7, state: 'found', subText: 'Match idx 2' },
          { index: 3, value: 15 }
        ],
        pointers: [
          { label: 'seen[2]', index: 0, color: 'green' },
          { label: 'i', index: 2, color: 'blue' }
        ],
        variables: { i: 2, num: 7, need: 2, result: '[0, 2]' }
      }
    ]
  },
  {
    id: 'trees',
    title: 'Trees',
    pillar: 'DSA',
    difficulty: 'Easy',
    iconName: 'GitFork',
    description:
      'Traverse hierarchical Binary Trees using Pre-order, In-order, Post-order DFS, or Level-order BFS to inspect every node in O(n) time.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) Recursion Stack',
    intuition:
      'A Tree organizes data hierarchically from a Root node down to Leaf nodes. Recursive DFS naturally explores left and right subtrees and combines their results.',
    internals:
      'Maximum call stack depth equals the height h of the tree (O(log n) for balanced trees, O(n) for skewed chains).',
    traceSummary: 'Computed max tree depth = 3 across all branches',
    code: {
      javascript: `function maxDepth(root) {
  if (root === null) {
    return 0;
  }
  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);
  return 1 + Math.max(leftDepth, rightDepth);
}`,
      typescript: `function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      python: `def max_depth(root: Optional[TreeNode]) -> int:
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
      cpp: `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 5,
        explanation: 'Start at Root (3): recurse left to Node (9) → leaf returns depth = 1',
        treeNodes: [
          { id: '3', label: 3, x: 50, y: 18, leftId: '9', rightId: '20', state: 'active', note: 'Root' },
          { id: '9', label: 9, x: 25, y: 52, state: 'found', note: 'depth = 1' },
          { id: '20', label: 20, x: 75, y: 52, leftId: '15', rightId: '7', state: 'default' },
          { id: '15', label: 15, x: 60, y: 84, state: 'default' },
          { id: '7', label: 7, x: 88, y: 84, state: 'default' }
        ],
        variables: { node: 3, leftDepth: 1 }
      },
      {
        stepNumber: 2,
        activeLine: 6,
        explanation: 'Recurse right to Node (20) and its leaves (15, 7) → rightDepth = 2',
        treeNodes: [
          { id: '3', label: 3, x: 50, y: 18, leftId: '9', rightId: '20', state: 'visited' },
          { id: '9', label: 9, x: 25, y: 52, state: 'visited', note: 'd = 1' },
          { id: '20', label: 20, x: 75, y: 52, leftId: '15', rightId: '7', state: 'active', note: 'd = 2' },
          { id: '15', label: 15, x: 60, y: 84, state: 'found', note: 'd = 1' },
          { id: '7', label: 7, x: 88, y: 84, state: 'found', note: 'd = 1' }
        ],
        variables: { node: 20, leftDepth: 1, rightDepth: 2 }
      },
      {
        stepNumber: 3,
        activeLine: 7,
        explanation: 'Root (3) computes 1 + Math.max(1, 2) = 3 → Return 3!',
        treeNodes: [
          { id: '3', label: 3, x: 50, y: 18, leftId: '9', rightId: '20', state: 'found', note: 'Max Depth = 3' },
          { id: '9', label: 9, x: 25, y: 52, state: 'visited' },
          { id: '20', label: 20, x: 75, y: 52, leftId: '15', rightId: '7', state: 'visited' },
          { id: '15', label: 15, x: 60, y: 84, state: 'visited' },
          { id: '7', label: 7, x: 88, y: 84, state: 'visited' }
        ],
        variables: { maxDepth: 3 }
      }
    ]
  },
  {
    id: 'binary-search-trees',
    title: 'Binary Search Trees',
    pillar: 'DSA',
    difficulty: 'Medium',
    iconName: 'GitBranch',
    description:
      'Search and insert into a Binary Search Tree (BST) in O(log n) time using the strict ordering property: Left Subtree < Node < Right Subtree.',
    timeComplexity: 'O(log n) Balanced',
    spaceComplexity: 'O(h)',
    intuition:
      'Every comparison at a BST node acts like a railway switch: if target < node.val, you go Left and discard the entire Right subtree immediately.',
    internals:
      'In-order traversal of any valid BST visits nodes in sorted ascending order.',
    traceSummary: 'Found target 15 at depth 2 in 3 comparisons',
    code: {
      javascript: `function searchBST(root, target) {
  let curr = root;
  while (curr !== null) {
    if (target === curr.val) return curr;
    if (target < curr.val) {
      curr = curr.left;
    } else {
      curr = curr.right;
    }
  }
  return null;
}`,
      typescript: `function searchBST(root: TreeNode | null, target: number): TreeNode | null {
  let curr = root;
  while (curr) {
    if (target === curr.val) return curr;
    curr = target < curr.val ? curr.left : curr.right;
  }
  return null;
}`,
      python: `def search_bst(root: Optional[TreeNode], target: int) -> Optional[TreeNode]:
    curr = root
    while curr:
        if target == curr.val:
            return curr
        curr = curr.left if target < curr.val else curr.right
    return None`,
      cpp: `TreeNode* searchBST(TreeNode* root, int target) {
    while (root && root->val != target) {
        root = target < root->val ? root->left : root->right;
    }
    return root;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 5,
        explanation: 'At Root (20): target 15 < 20 → branch Left to Node (10), pruning Right subtree',
        treeNodes: [
          { id: '20', label: 20, x: 50, y: 18, leftId: '10', rightId: '30', state: 'active', note: '15 < 20 → Left' },
          { id: '10', label: 10, x: 25, y: 52, leftId: '5', rightId: '15', state: 'default' },
          { id: '30', label: 30, x: 75, y: 52, state: 'default', note: 'Pruned' },
          { id: '5', label: 5, x: 12, y: 84, state: 'default' },
          { id: '15', label: 15, x: 38, y: 84, state: 'default' }
        ],
        variables: { curr: 20, target: 15, direction: 'left' }
      },
      {
        stepNumber: 2,
        activeLine: 8,
        explanation: 'At Node (10): target 15 > 10 → branch Right to Node (15)',
        treeNodes: [
          { id: '20', label: 20, x: 50, y: 18, leftId: '10', rightId: '30', state: 'visited' },
          { id: '10', label: 10, x: 25, y: 52, leftId: '5', rightId: '15', state: 'active', note: '15 > 10 → Right' },
          { id: '30', label: 30, x: 75, y: 52, state: 'default' },
          { id: '5', label: 5, x: 12, y: 84, state: 'default' },
          { id: '15', label: 15, x: 38, y: 84, state: 'default' }
        ],
        variables: { curr: 10, target: 15, direction: 'right' }
      },
      {
        stepNumber: 3,
        activeLine: 4,
        explanation: 'At Node (15): target 15 === curr.val → Match found in O(log n)!',
        treeNodes: [
          { id: '20', label: 20, x: 50, y: 18, leftId: '10', rightId: '30', state: 'visited' },
          { id: '10', label: 10, x: 25, y: 52, leftId: '5', rightId: '15', state: 'visited' },
          { id: '30', label: 30, x: 75, y: 52, state: 'default' },
          { id: '5', label: 5, x: 12, y: 84, state: 'default' },
          { id: '15', label: 15, x: 38, y: 84, state: 'found', note: 'Found 15!' }
        ],
        variables: { curr: 15, target: 15, found: 'true' }
      }
    ]
  },
  {
    id: 'heaps',
    title: 'Heaps',
    pillar: 'DSA',
    difficulty: 'Medium',
    iconName: 'Triangle',
    description:
      'Maintain the minimum or maximum element at index 0 in O(1) peek time and O(log n) push/pop time using an array-backed Binary Heap.',
    timeComplexity: 'O(1) Peek / O(log n) Push',
    spaceComplexity: 'O(n)',
    intuition:
      'A Min-Heap packs a complete binary tree into a flat array where every parent (Math.floor((i-1)/2)) is smaller than its children (2i+1 and 2i+2).',
    internals:
      'Inserting appends at the end of the array and sifts up in at most log₂(n) swaps.',
    traceSummary: 'Sifted value 2 up to Root index 0 in 2 swaps',
    code: {
      javascript: `function heapPush(heap, val) {
  heap.push(val);
  let i = heap.length - 1;

  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);
    if (heap[parent] <= heap[i]) break;
    [heap[parent], heap[i]] = [heap[i], heap[parent]];
    i = parent;
  }
  return heap;
}`,
      typescript: `function heapPush(heap: number[], val: number): number[] {
  heap.push(val);
  let i = heap.length - 1;
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (heap[p] <= heap[i]) break;
    [heap[p], heap[i]] = [heap[i], heap[p]];
    i = p;
  }
  return heap;
}`,
      python: `def heap_push(heap: list[int], val: int) -> list[int]:
    heap.append(val)
    i = len(heap) - 1
    while i > 0:
        p = (i - 1) // 2
        if heap[p] <= heap[i]:
            break
        heap[p], heap[i] = heap[i], heap[p]
        i = p
    return heap`,
      cpp: `void heapPush(vector<int>& heap, int val) {
    heap.push_back(val);
    int i = heap.size() - 1;
    while (i > 0) {
        int p = (i - 1) / 2;
        if (heap[p] <= heap[i]) break;
        swap(heap[p], heap[i]);
        i = p;
    }
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 2,
        explanation: 'Append val = 2 at index 4; parent index = Math.floor((4 - 1) / 2) = 1 (val = 8)',
        boxes: [
          { index: 0, value: 5 },
          { index: 1, value: 8, state: 'visited', subText: 'parent' },
          { index: 2, value: 12 },
          { index: 3, value: 15 },
          { index: 4, value: 2, state: 'active', subText: 'new' }
        ],
        pointers: [
          { label: 'parent', index: 1, color: 'green' },
          { label: 'i', index: 4, color: 'blue' }
        ],
        variables: { i: 4, parent: 1, 'heap[i]': 2 }
      },
      {
        stepNumber: 2,
        activeLine: 8,
        explanation: 'Since 2 < 8, swap heap[4] and heap[1]; next compare with root index 0 (val = 5)',
        boxes: [
          { index: 0, value: 5, state: 'visited', subText: 'root' },
          { index: 1, value: 2, state: 'active', subText: 'sifted up' },
          { index: 2, value: 12 },
          { index: 3, value: 15 },
          { index: 4, value: 8 }
        ],
        pointers: [
          { label: 'parent', index: 0, color: 'green' },
          { label: 'i', index: 1, color: 'blue' }
        ],
        variables: { i: 1, parent: 0, 'heap[i]': 2 }
      },
      {
        stepNumber: 3,
        activeLine: 11,
        explanation: 'Since 2 < 5, swap with root index 0 → New Min-Heap Root is 2!',
        boxes: [
          { index: 0, value: 2, state: 'found', subText: 'Min Root' },
          { index: 1, value: 5, state: 'visited' },
          { index: 2, value: 12 },
          { index: 3, value: 15 },
          { index: 4, value: 8 }
        ],
        pointers: [{ label: 'minRoot', index: 0, color: 'blue' }],
        variables: { i: 0, minElement: 2 }
      }
    ]
  },
  {
    id: 'graphs',
    title: 'Graphs',
    pillar: 'DSA',
    difficulty: 'Medium',
    iconName: 'Share2',
    description:
      'Represent networks of vertices and edges using an Adjacency List to model social connections, road maps, and dependencies in O(V + E) space.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    intuition:
      'A Graph connects arbitrary nodes (vertices) with links (edges) that can be directed or undirected, weighted or unweighted.',
    internals:
      'Adjacency lists store only existing edges O(V + E), making traversal vastly faster than an O(V²) matrix on sparse graphs.',
    traceSummary: 'Visited all 4 connected vertices via Adjacency List',
    code: {
      javascript: `function buildAdjacencyList(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  return adj;
}`,
      typescript: `function buildAdjacencyList(n: number, edges: [number, number][]): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  return adj;
}`,
      python: `def build_adjacency_list(n: int, edges: list[tuple[int, int]]) -> list[list[int]]:
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    return adj`,
      cpp: `vector<vector<int>> buildAdj(int n, vector<pair<int,int>>& edges) {
    vector<vector<int>> adj(n);
    for (auto [u, v] : edges) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    return adj;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 4,
        explanation: 'Add undirected edges (0, 1) and (0, 2) into Adjacency List',
        graph: {
          nodes: [
            { id: '0', label: '0', x: 25, y: 28, state: 'active', badge: 'adj: [1,2]' },
            { id: '1', label: '1', x: 75, y: 28, state: 'visited', badge: 'adj: [0]' },
            { id: '2', label: '2', x: 25, y: 78, state: 'visited', badge: 'adj: [0]' },
            { id: '3', label: '3', x: 75, y: 78, state: 'default', badge: 'adj: []' }
          ],
          edges: [
            { from: '0', to: '1', state: 'active' },
            { from: '0', to: '2', state: 'active' }
          ]
        },
        variables: { u: 0, neighbors: '[1, 2]' }
      },
      {
        stepNumber: 2,
        activeLine: 7,
        explanation: 'Add edges (1, 3) and (2, 3) → Complete 4-node graph constructed in O(V + E)',
        graph: {
          nodes: [
            { id: '0', label: '0', x: 25, y: 28, state: 'found', badge: '[1, 2]' },
            { id: '1', label: '1', x: 75, y: 28, state: 'found', badge: '[0, 3]' },
            { id: '2', label: '2', x: 25, y: 78, state: 'found', badge: '[0, 3]' },
            { id: '3', label: '3', x: 75, y: 78, state: 'found', badge: '[1, 2]' }
          ],
          edges: [
            { from: '0', to: '1', state: 'path' },
            { from: '0', to: '2', state: 'path' },
            { from: '1', to: '3', state: 'active' },
            { from: '2', to: '3', state: 'active' }
          ]
        },
        variables: { vertices: 4, edges: 4 }
      }
    ]
  },
  {
    id: 'tries',
    title: 'Tries',
    pillar: 'DSA',
    difficulty: 'Medium',
    iconName: 'Network',
    description:
      'Store strings character-by-character along shared prefix paths so autocomplete and prefix lookups run in O(L) word length time.',
    timeComplexity: 'O(L) Word Length',
    spaceComplexity: 'O(Alphabet × Nodes)',
    intuition:
      'Words starting with "ca" ("cat", "car", "cart") share the exact same root → c → a nodes, making prefix search independent of dictionary size.',
    internals:
      'Each TrieNode holds a child map and boolean isEnd flag marking complete dictionary words.',
    traceSummary: 'Matched prefix "ca" in 2 steps → ["cat", "car"]',
    code: {
      javascript: `function startsWith(root, prefix) {
  let curr = root;
  for (const ch of prefix) {
    if (!curr.children[ch]) {
      return false;
    }
    curr = curr.children[ch];
  }
  return true;
}`,
      typescript: `function startsWith(root: TrieNode, prefix: string): boolean {
  let curr = root;
  for (const ch of prefix) {
    if (!curr.children[ch]) return false;
    curr = curr.children[ch];
  }
  return true;
}`,
      python: `def starts_with(root: TrieNode, prefix: str) -> bool:
    curr = root
    for ch in prefix:
        if ch not in curr.children:
            return False
        curr = curr.children[ch]
    return True`,
      cpp: `bool startsWith(TrieNode* root, const string& prefix) {
    TrieNode* curr = root;
    for (char ch : prefix) {
        if (!curr->children.count(ch)) return false;
        curr = curr->children[ch];
    }
    return true;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 3,
        explanation: 'Step 1: Follow child "c" from ROOT',
        treeNodes: [
          { id: 'root', label: 'ROOT', x: 50, y: 15, leftId: 'c', rightId: 'd', state: 'visited' },
          { id: 'c', label: 'c', x: 30, y: 45, leftId: 'a', state: 'active', note: 'ch = "c"' },
          { id: 'd', label: 'd', x: 75, y: 45, state: 'default' },
          { id: 'a', label: 'a', x: 30, y: 76, leftId: 't', rightId: 'r', state: 'default' },
          { id: 't', label: 't*', x: 16, y: 92, state: 'default' },
          { id: 'r', label: 'r*', x: 44, y: 92, state: 'default' }
        ],
        variables: { prefix: 'ca', currentChar: 'c' }
      },
      {
        stepNumber: 2,
        activeLine: 9,
        explanation: 'Step 2: Follow child "a" from "c" → Prefix "ca" found with completions "cat" & "car"!',
        treeNodes: [
          { id: 'root', label: 'ROOT', x: 50, y: 15, leftId: 'c', rightId: 'd', state: 'visited' },
          { id: 'c', label: 'c', x: 30, y: 45, leftId: 'a', state: 'visited' },
          { id: 'd', label: 'd', x: 75, y: 45, state: 'default' },
          { id: 'a', label: 'a', x: 30, y: 76, leftId: 't', rightId: 'r', state: 'found', note: 'Prefix Hit!' },
          { id: 't', label: 't*', x: 16, y: 92, state: 'found', note: 'cat' },
          { id: 'r', label: 'r*', x: 44, y: 92, state: 'found', note: 'car' }
        ],
        variables: { prefix: 'ca', matched: 'true', completions: 'cat, car' }
      }
    ]
  },
  {
    id: 'sorting-algorithms',
    title: 'Sorting Algorithms',
    pillar: 'DSA',
    difficulty: 'Medium',
    iconName: 'ArrowUpDown',
    description:
      'Rearrange elements into ascending order using QuickSort Pivot Partitioning or MergeSort in O(n log n) time.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    intuition:
      'QuickSort picks a pivot and partitions smaller items to the left and larger items to the right in a single linear sweep, locking the pivot into its final sorted index.',
    internals:
      'Lomuto partition maintains boundary i for elements <= pivot while j scans from low to high - 1.',
    traceSummary: 'Partitioned around pivot 5 → locked at index 2',
    code: {
      javascript: `function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[high]] = [arr[high], arr[i]];
  return i;
}`,
      typescript: `function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[high]] = [arr[high], arr[i]];
  return i;
}`,
      python: `def partition(arr: list[int], low: int, high: int) -> int:
    pivot = arr[high]
    i = low
    for j in range(low, high):
        if arr[j] <= pivot:
            arr[i], arr[j] = arr[j], arr[i]
            i += 1
    arr[i], arr[high] = arr[high], arr[i]
    return i`,
      cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high], i = low;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) swap(arr[i++], arr[j]);
    }
    swap(arr[i], arr[high]);
    return i;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 2,
        explanation: 'Select last element as pivot = 5; initialize i = 0, j = 0',
        boxes: [
          { index: 0, value: 8 },
          { index: 1, value: 2 },
          { index: 2, value: 9 },
          { index: 3, value: 1 },
          { index: 4, value: 5, state: 'active', subText: 'pivot' }
        ],
        pointers: [
          { label: 'i', index: 0, color: 'green' },
          { label: 'j', index: 0, color: 'blue' },
          { label: 'pivot', index: 4, color: 'purple' }
        ],
        variables: { pivot: 5, i: 0, j: 0 }
      },
      {
        stepNumber: 2,
        activeLine: 7,
        explanation: 'Scan j: swap elements <= 5 (2 and 1) into left zone [0..1]; i advances to 2',
        boxes: [
          { index: 0, value: 2, state: 'visited' },
          { index: 1, value: 1, state: 'visited' },
          { index: 2, value: 9, state: 'active' },
          { index: 3, value: 8 },
          { index: 4, value: 5, state: 'active', subText: 'pivot' }
        ],
        pointers: [
          { label: 'i', index: 2, color: 'green' },
          { label: 'j', index: 3, color: 'blue' },
          { label: 'pivot', index: 4, color: 'purple' }
        ],
        variables: { pivot: 5, i: 2, j: 3 }
      },
      {
        stepNumber: 3,
        activeLine: 11,
        explanation: 'Swap pivot 5 into index i = 2 → [2, 1, 5, 8, 9]. Pivot 5 is now locked!',
        boxes: [
          { index: 0, value: 2, state: 'visited' },
          { index: 1, value: 1, state: 'visited' },
          { index: 2, value: 5, state: 'found', subText: 'locked' },
          { index: 3, value: 8 },
          { index: 4, value: 9 }
        ],
        pointers: [{ label: 'pivotIdx', index: 2, color: 'blue' }],
        variables: { pivotIdx: 2, array: '[2, 1, 5, 8, 9]' }
      }
    ]
  },
  {
    id: 'searching-algorithms',
    title: 'Searching Algorithms',
    pillar: 'DSA',
    difficulty: 'Easy',
    iconName: 'Search',
    description:
      'Compare Linear Scan O(n) on unsorted data against Binary / Jump / Interpolation Search on sorted data.',
    timeComplexity: 'O(n) Linear / O(log n) Sorted',
    spaceComplexity: 'O(1)',
    intuition:
      'When data is unsorted, you must inspect elements sequentially until finding the target. Once sorted, you can jump and eliminate blocks.',
    internals:
      'Sequential scan benefits from L1 hardware prefetching, while Binary Search minimizes comparisons on large datasets.',
    traceSummary: 'Found target 42 at index 3',
    code: {
      javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`,
      typescript: `function linearSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
      python: `def linear_search(arr: list[int], target: int) -> int:
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1`,
      cpp: `int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 3,
        explanation: 'Check index 0 (14 !== 42) and index 1 (29 !== 42)',
        boxes: [
          { index: 0, value: 14, state: 'visited' },
          { index: 1, value: 29, state: 'active' },
          { index: 2, value: 7 },
          { index: 3, value: 42 },
          { index: 4, value: 18 }
        ],
        pointers: [{ label: 'i', index: 1, color: 'blue' }],
        variables: { i: 1, current: 29, target: 42 }
      },
      {
        stepNumber: 2,
        activeLine: 4,
        explanation: 'Check index 3: arr[3] === 42 → Target found at index 3!',
        boxes: [
          { index: 0, value: 14, state: 'visited' },
          { index: 1, value: 29, state: 'visited' },
          { index: 2, value: 7, state: 'visited' },
          { index: 3, value: 42, state: 'found' },
          { index: 4, value: 18 }
        ],
        pointers: [{ label: 'found', index: 3, color: 'green' }],
        variables: { i: 3, current: 42, returnIdx: 3 }
      }
    ]
  },
  {
    id: 'two-pointers',
    title: 'Two Pointers',
    pillar: 'DSA',
    difficulty: 'Easy',
    iconName: 'MoveHorizontal',
    description:
      'Use two converging or parallel pointers (left and right) on a sorted array to find target pairs in O(n) time and O(1) space.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    intuition:
      'In a sorted array, if arr[left] + arr[right] is too small, moving left++ increases the sum. If the sum is too large, moving right-- decreases the sum.',
    internals:
      'Eliminates O(n²) nested loops with zero extra Heap memory.',
    traceSummary: 'Found pair 2 + 7 = 9 at indices [0, 3]',
    code: {
      javascript: `function twoSumSorted(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}`,
      typescript: `function twoSumSorted(arr: number[], target: number): [number, number] {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}`,
      python: `def two_sum_sorted(arr: list[int], target: int) -> list[int]:
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return [left, right]
        if s < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]`,
      cpp: `pair<int,int> twoSumSorted(const vector<int>& arr, int target) {
    int left = 0, right = (int)arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return {left, right};
        if (sum < target) left++;
        else right--;
    }
    return {-1, -1};
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 6,
        explanation: 'left = 0 (2), right = 4 (11) → sum = 13 > 9, so decrement right = 3',
        boxes: [
          { index: 0, value: 2, state: 'active' },
          { index: 1, value: 3 },
          { index: 2, value: 5 },
          { index: 3, value: 7 },
          { index: 4, value: 11, state: 'active' }
        ],
        pointers: [
          { label: 'left', index: 0, color: 'green' },
          { label: 'right', index: 4, color: 'purple' }
        ],
        variables: { left: 0, right: 4, sum: 13, target: 9 }
      },
      {
        stepNumber: 2,
        activeLine: 7,
        explanation: 'left = 0 (2), right = 3 (7) → sum = 2 + 7 = 9 === target! Return [0, 3]',
        boxes: [
          { index: 0, value: 2, state: 'found' },
          { index: 1, value: 3 },
          { index: 2, value: 5 },
          { index: 3, value: 7, state: 'found' },
          { index: 4, value: 11, state: 'discarded' }
        ],
        pointers: [
          { label: 'left', index: 0, color: 'green' },
          { label: 'right', index: 3, color: 'blue' }
        ],
        variables: { left: 0, right: 3, sum: 9, result: '[0, 3]' }
      }
    ]
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    pillar: 'DSA',
    difficulty: 'Medium',
    iconName: 'Maximize2',
    description:
      'Maintain a dynamic window [left..right] over an array or string to find optimal subarrays in O(n) time instead of O(n²).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    intuition:
      'Expand the window by advancing right, and shrink from left only when the window constraint is violated. Each element enters and leaves the window at most once.',
    internals:
      'Total pointer movements across the entire loop are bounded by 2n.',
    traceSummary: 'Max window sum of size k=3 is 12 ([5, 1, 6])',
    code: {
      javascript: `function maxWindowSum(arr, k) {
  let windowSum = 0, maxSum = 0, left = 0;

  for (let right = 0; right < arr.length; right++) {
    windowSum += arr[right];
    if (right - left + 1 === k) {
      maxSum = Math.max(maxSum, windowSum);
      windowSum -= arr[left];
      left++;
    }
  }
  return maxSum;
}`,
      typescript: `function maxWindowSum(arr: number[], k: number): number {
  let windowSum = 0, maxSum = 0, left = 0;
  for (let right = 0; right < arr.length; right++) {
    windowSum += arr[right];
    if (right - left + 1 === k) {
      maxSum = Math.max(maxSum, windowSum);
      windowSum -= arr[left++];
    }
  }
  return maxSum;
}`,
      python: `def max_window_sum(arr: list[int], k: int) -> int:
    window_sum = max_sum = left = 0
    for right, val in enumerate(arr):
        window_sum += val
        if right - left + 1 == k:
            max_sum = max(max_sum, window_sum)
            window_sum -= arr[left]
            left += 1
    return max_sum`,
      cpp: `int maxWindowSum(const vector<int>& arr, int k) {
    int windowSum = 0, maxSum = 0, left = 0;
    for (int right = 0; right < arr.size(); right++) {
        windowSum += arr[right];
        if (right - left + 1 == k) {
            maxSum = max(maxSum, windowSum);
            windowSum -= arr[left++];
        }
    }
    return maxSum;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 7,
        explanation: 'First window [0..2] = [2, 5, 1] → windowSum = 8, maxSum = 8',
        boxes: [
          { index: 0, value: 2, state: 'window' },
          { index: 1, value: 5, state: 'window' },
          { index: 2, value: 1, state: 'active' },
          { index: 3, value: 6 },
          { index: 4, value: 3 }
        ],
        pointers: [
          { label: 'left', index: 0, color: 'green' },
          { label: 'right', index: 2, color: 'blue' }
        ],
        variables: { left: 0, right: 2, windowSum: 8, maxSum: 8 }
      },
      {
        stepNumber: 2,
        activeLine: 7,
        explanation: 'Slide window to [1..3] = [5, 1, 6] (subtract 2, add 6) → windowSum = 12 (New Max!)',
        boxes: [
          { index: 0, value: 2, state: 'discarded' },
          { index: 1, value: 5, state: 'found' },
          { index: 2, value: 1, state: 'found' },
          { index: 3, value: 6, state: 'found' },
          { index: 4, value: 3 }
        ],
        pointers: [
          { label: 'left', index: 1, color: 'green' },
          { label: 'right', index: 3, color: 'blue' }
        ],
        variables: { left: 1, right: 3, windowSum: 12, maxSum: 12 }
      }
    ]
  },
  {
    id: 'prefix-sums',
    title: 'Prefix Sums',
    pillar: 'DSA',
    difficulty: 'Easy',
    iconName: 'Sigma',
    description:
      'Precompute cumulative sums P[i] so that any subarray sum sum(L..R) can be answered in O(1) constant time via P[R + 1] - P[L].',
    timeComplexity: 'O(n) Build / O(1) Query',
    spaceComplexity: 'O(n)',
    intuition:
      'Instead of looping from L to R on every query, subtract the prefix sum before L from the prefix sum at R.',
    internals:
      'P[0] = 0 avoids boundary branches when L = 0.',
    traceSummary: 'Range sum [1..3] = P[4] (15) - P[1] (2) = 13 in O(1)',
    code: {
      javascript: `function rangeSum(nums, left, right) {
  const prefix = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  return prefix[right + 1] - prefix[left];
}`,
      typescript: `function rangeSum(nums: number[], left: number, right: number): number {
  const prefix = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) prefix[i + 1] = prefix[i] + nums[i];
  return prefix[right + 1] - prefix[left];
}`,
      python: `def range_sum(nums: list[int], left: int, right: int) -> int:
    prefix = [0] * (len(nums) + 1)
    for i, x in enumerate(nums):
        prefix[i + 1] = prefix[i] + x
    return prefix[right + 1] - prefix[left]`,
      cpp: `int rangeSum(const vector<int>& nums, int left, int right) {
    vector<int> prefix(nums.size() + 1, 0);
    for (size_t i = 0; i < nums.size(); i++) prefix[i + 1] = prefix[i] + nums[i];
    return prefix[right + 1] - prefix[left];
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 4,
        explanation: 'Build prefix sum array for [2, 4, 1, 8] → prefix = [0, 2, 6, 7, 15]',
        boxes: [
          { index: 0, value: 0, subText: 'P[0]' },
          { index: 1, value: 2, subText: 'P[1]' },
          { index: 2, value: 6, subText: 'P[2]' },
          { index: 3, value: 7, subText: 'P[3]' },
          { index: 4, value: 15, state: 'active', subText: 'P[4]' }
        ],
        pointers: [
          { label: 'P[left]', index: 1, color: 'green' },
          { label: 'P[right+1]', index: 4, color: 'blue' }
        ],
        variables: { left: 1, right: 3, 'P[4]': 15, 'P[1]': 2 }
      },
      {
        stepNumber: 2,
        activeLine: 6,
        explanation: 'Query [1..3] in O(1): prefix[4] (15) - prefix[1] (2) = 13',
        boxes: [
          { index: 0, value: 0 },
          { index: 1, value: 2, state: 'visited', subText: '- 2' },
          { index: 2, value: 6 },
          { index: 3, value: 7 },
          { index: 4, value: 15, state: 'found', subText: '15 - 2 = 13' }
        ],
        pointers: [
          { label: 'left=1', index: 1, color: 'green' },
          { label: 'right+1=4', index: 4, color: 'blue' }
        ],
        variables: { formula: '15 - 2', result: 13 }
      }
    ]
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    pillar: 'DSA',
    difficulty: 'Easy',
    iconName: 'SearchCode',
    defaultStep: 3,
    description:
      'Given a sorted array of integers and a target value, return the index of the target if it exists. If the target is not found, return -1.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    intuition:
      'Because the array is sorted, comparing the middle element (mid) with target lets us eliminate half of the remaining search range [left, right] on every single step.',
    internals:
      'Computes mid = Math.floor((left + right) / 2) (or left + ((right - left) >> 1) to avoid 32-bit integer overflow) and halves the search interval in O(log₂ n) steps.',
    traceSummary: 'Found in index 2',
    code: {
      javascript: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    }

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

const result = binarySearch([1, 3, 5, 7, 9], 7);
console.log(result);`,
      typescript: `function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    }

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

const result = binarySearch([1, 3, 5, 7, 9], 7);
console.log(result);`,
      python: `def binary_search(arr: list[int], target: int) -> int:
    left = 0
    right = len(arr) - 1

    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid

        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1

result = binary_search([1, 3, 5, 7, 9], 7)
print(result)`,
      cpp: `int binarySearch(const vector<int>& arr, int target) {
    int left = 0;
    int right = (int)arr.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            return mid;
        }
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 2,
        explanation: 'Initialize left = 0 and right = arr.length - 1 (4) on sorted array [1, 3, 5, 7, 9]',
        boxes: [
          { index: 0, value: 1 },
          { index: 1, value: 3 },
          { index: 2, value: 5 },
          { index: 3, value: 7 },
          { index: 4, value: 9 }
        ],
        pointers: [
          { label: 'left', index: 0, color: 'green' },
          { label: 'right', index: 4, color: 'purple' }
        ],
        variables: { left: 0, right: 4, target: 7 },
        callStack: ['binarySearch([1, 3, 5, 7, 9], target=7)']
      },
      {
        stepNumber: 2,
        activeLine: 5,
        explanation: 'Check loop condition: left (0) <= right (4) is true → enter while loop',
        boxes: [
          { index: 0, value: 1 },
          { index: 1, value: 3 },
          { index: 2, value: 5 },
          { index: 3, value: 7 },
          { index: 4, value: 9 }
        ],
        pointers: [
          { label: 'left', index: 0, color: 'green' },
          { label: 'right', index: 4, color: 'purple' }
        ],
        variables: { left: 0, right: 4, target: 7 },
        callStack: ['binarySearch([1, 3, 5, 7, 9], target=7)']
      },
      {
        stepNumber: 3,
        activeLine: 6,
        explanation: 'mid = Math.floor((0 + 4) / 2) → 2   (value = 5)',
        boxes: [
          { index: 0, value: 1 },
          { index: 1, value: 3 },
          { index: 2, value: 5, state: 'active' },
          { index: 3, value: 7 },
          { index: 4, value: 9 }
        ],
        pointers: [
          { label: 'left', index: 0, color: 'green' },
          { label: 'mid', index: 2, color: 'blue' },
          { label: 'right', index: 4, color: 'purple' }
        ],
        variables: { left: 0, mid: 2, right: 4, 'arr[mid]': 5, target: 7 },
        callStack: ['binarySearch([1, 3, 5, 7, 9], target=7)']
      },
      {
        stepNumber: 4,
        activeLine: 11,
        explanation: 'Compare 7 with 5 → 7 > 5, so move left = mid + 1',
        boxes: [
          { index: 0, value: 1, state: 'discarded' },
          { index: 1, value: 3, state: 'discarded' },
          { index: 2, value: 5, state: 'active' },
          { index: 3, value: 7 },
          { index: 4, value: 9 }
        ],
        pointers: [
          { label: 'left', index: 0, color: 'green' },
          { label: 'mid', index: 2, color: 'blue' },
          { label: 'right', index: 4, color: 'purple' }
        ],
        variables: { left: 3, mid: 2, right: 4, comparison: '5 < 7' },
        callStack: ['binarySearch([1, 3, 5, 7, 9], target=7)']
      },
      {
        stepNumber: 5,
        activeLine: 12,
        explanation: 'New range: [3, 4] after discarding indices 0..2',
        boxes: [
          { index: 0, value: 1, state: 'discarded' },
          { index: 1, value: 3, state: 'discarded' },
          { index: 2, value: 5, state: 'discarded' },
          { index: 3, value: 7, state: 'window' },
          { index: 4, value: 9, state: 'window' }
        ],
        pointers: [
          { label: 'left', index: 3, color: 'green' },
          { label: 'right', index: 4, color: 'purple' }
        ],
        variables: { left: 3, right: 4, range: '[3, 4]' },
        callStack: ['binarySearch([1, 3, 5, 7, 9], target=7)']
      },
      {
        stepNumber: 6,
        activeLine: 6,
        explanation: 'mid = Math.floor((3 + 4) / 2) → 3   (value = 7)',
        boxes: [
          { index: 0, value: 1, state: 'discarded' },
          { index: 1, value: 3, state: 'discarded' },
          { index: 2, value: 5, state: 'discarded' },
          { index: 3, value: 7, state: 'active' },
          { index: 4, value: 9 }
        ],
        pointers: [
          { label: 'left', index: 3, color: 'green' },
          { label: 'mid', index: 3, color: 'blue' },
          { label: 'right', index: 4, color: 'purple' }
        ],
        variables: { left: 3, mid: 3, right: 4, 'arr[mid]': 7 },
        callStack: ['binarySearch([1, 3, 5, 7, 9], target=7)']
      },
      {
        stepNumber: 7,
        activeLine: 7,
        explanation: 'Compare 7 with 7 → arr[mid] === target is true!',
        boxes: [
          { index: 0, value: 1, state: 'discarded' },
          { index: 1, value: 3, state: 'discarded' },
          { index: 2, value: 5, state: 'discarded' },
          { index: 3, value: 7, state: 'found' },
          { index: 4, value: 9 }
        ],
        pointers: [
          { label: 'left', index: 3, color: 'green' },
          { label: 'mid', index: 3, color: 'blue' },
          { label: 'right', index: 4, color: 'purple' }
        ],
        variables: { left: 3, mid: 3, right: 4, match: 'true' },
        callStack: ['binarySearch([1, 3, 5, 7, 9], target=7)']
      },
      {
        stepNumber: 8,
        activeLine: 8,
        explanation: 'Return mid (index 3) — Binary Search completed in O(log n) steps!',
        boxes: [
          { index: 0, value: 1, state: 'discarded' },
          { index: 1, value: 3, state: 'discarded' },
          { index: 2, value: 5, state: 'discarded' },
          { index: 3, value: 7, state: 'found' },
          { index: 4, value: 9, state: 'discarded' }
        ],
        pointers: [{ label: 'found', index: 3, color: 'blue' }],
        variables: { returnIndex: 3, comparisons: 2 },
        callStack: ['binarySearch -> returns 3']
      }
    ]
  }
];
