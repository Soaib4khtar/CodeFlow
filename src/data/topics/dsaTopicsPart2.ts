import { TopicData } from '../types/codeflow';

export const dsaTopicsPart2: TopicData[] = [
  {
    id: 'backtracking',
    title: 'Backtracking',
    pillar: 'DSA',
    difficulty: 'Medium',
    iconName: 'Undo2',
    description:
      'Explore all valid candidate solutions systematically using the Choose → Explore → Unchoose (Backtrack) recursion pattern.',
    timeComplexity: 'O(2^n)',
    spaceComplexity: 'O(n) Recursion Stack',
    intuition:
      'Backtracking builds a decision tree one choice at a time. Whenever a branch finishes or hits a dead end, it pops the last choice and tries the next branch.',
    internals:
      'Reuses a single path array across all recursive calls by pushing before recursion and popping immediately on return.',
    traceSummary: 'Generated all 8 subsets of [1, 2, 3]',
    code: {
      javascript: `function subsets(nums) {
  const res = [], path = [];

  function backtrack(idx) {
    res.push([...path]);
    for (let i = idx; i < nums.length; i++) {
      path.push(nums[i]);      // 1. Choose
      backtrack(i + 1);        // 2. Explore
      path.pop();              // 3. Backtrack (Unchoose)
    }
  }
  backtrack(0);
  return res;
}`,
      typescript: `function subsets(nums: number[]): number[][] {
  const res: number[][] = [], path: number[] = [];
  function backtrack(idx: number) {
    res.push([...path]);
    for (let i = idx; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  }
  backtrack(0);
  return res;
}`,
      python: `def subsets(nums: list[int]) -> list[list[int]]:
    res, path = [], []
    def backtrack(idx: int):
        res.append(path[:])
        for i in range(idx, len(nums)):
            path.append(nums[i])
            backtrack(i + 1)
            path.pop()
    backtrack(0)
    return res`,
      cpp: `void backtrack(int idx, vector<int>& nums, vector<int>& path, vector<vector<int>>& res) {
    res.push_back(path);
    for (int i = idx; i < nums.size(); i++) {
        path.push_back(nums[i]);
        backtrack(i + 1, nums, path, res);
        path.pop_back();
    }
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 7,
        explanation: 'Choose 1, then Choose 2, then Choose 3 → path = [1, 2, 3]',
        boxes: [
          { index: 0, value: 1, state: 'visited' },
          { index: 1, value: 2, state: 'visited' },
          { index: 2, value: 3, state: 'active', subText: 'push(3)' }
        ],
        pointers: [{ label: 'i', index: 2, color: 'blue' }],
        variables: { idx: 2, path: '[1, 2, 3]', subsetsCount: 4 }
      },
      {
        stepNumber: 2,
        activeLine: 9,
        explanation: 'Base reached → path.pop() removes 3 and 2 to backtrack and try [1, 3]',
        boxes: [
          { index: 0, value: 1, state: 'found' },
          { index: 1, value: 2, state: 'discarded', subText: 'popped' },
          { index: 2, value: 3, state: 'found', subText: 'explore [1,3]' }
        ],
        pointers: [
          { label: 'keep', index: 0, color: 'green' },
          { label: 'next', index: 2, color: 'purple' }
        ],
        variables: { idx: 2, path: '[1, 3]', subsetsCount: 8 }
      }
    ]
  },
  {
    id: 'greedy-algorithms',
    title: 'Greedy Algorithms',
    pillar: 'DSA',
    difficulty: 'Medium',
    iconName: 'Zap',
    description:
      'Make the locally optimal choice at each step (such as picking the earliest-finishing interval or tracking max jump reach) to achieve a global optimum.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    intuition:
      'In Jump Game, instead of trying every jump combination recursively, we greedily track the farthest index reachable so far: maxReach = Math.max(maxReach, i + nums[i]).',
    internals:
      'Runs in a single O(n) pass with O(1) registers.',
    traceSummary: 'Reached final index 4 with maxReach = 4',
    code: {
      javascript: `function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}`,
      typescript: `function canJump(nums: number[]): boolean {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}`,
      python: `def can_jump(nums: list[int]) -> bool:
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + jump)
    return True`,
      cpp: `bool canJump(const vector<int>& nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.size(); i++) {
        if (i > maxReach) return false;
        maxReach = max(maxReach, i + nums[i]);
    }
    return true;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 5,
        explanation: 'i = 0 (jump = 2): maxReach = Math.max(0, 0 + 2) = 2',
        boxes: [
          { index: 0, value: 2, state: 'active' },
          { index: 1, value: 3, state: 'window' },
          { index: 2, value: 1, state: 'window' },
          { index: 3, value: 1 },
          { index: 4, value: 4 }
        ],
        pointers: [
          { label: 'i', index: 0, color: 'green' },
          { label: 'maxReach', index: 2, color: 'blue' }
        ],
        variables: { i: 0, 'nums[i]': 2, maxReach: 2 }
      },
      {
        stepNumber: 2,
        activeLine: 5,
        explanation: 'i = 1 (jump = 3): maxReach = Math.max(2, 1 + 3) = 4 → Reaches end index 4!',
        boxes: [
          { index: 0, value: 2, state: 'visited' },
          { index: 1, value: 3, state: 'active' },
          { index: 2, value: 1, state: 'window' },
          { index: 3, value: 1, state: 'window' },
          { index: 4, value: 4, state: 'found' }
        ],
        pointers: [
          { label: 'i', index: 1, color: 'green' },
          { label: 'maxReach', index: 4, color: 'blue' }
        ],
        variables: { i: 1, 'nums[i]': 3, maxReach: 4, result: 'true' }
      }
    ]
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    pillar: 'DSA',
    difficulty: 'Medium',
    iconName: 'Table',
    description:
      'Break complex problems into overlapping subproblems and cache intermediate states in a DP table so each subproblem is computed only once.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n) or O(1)',
    intuition:
      'Instead of recomputing dp[i-1] and dp[i-2] exponentially in recursion, Bottom-Up Tabulation fills dp[0..n] left-to-right in a single pass.',
    internals:
      'House Robber recurrence: dp[i] = Math.max(dp[i - 1], nums[i] + dp[i - 2]).',
    traceSummary: 'Optimal non-adjacent sum = 12 (2 + 9 + 1)',
    code: {
      javascript: `function rob(nums) {
  const dp = new Array(nums.length).fill(0);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);

  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1], nums[i] + dp[i - 2]);
  }
  return dp[nums.length - 1];
}`,
      typescript: `function rob(nums: number[]): number {
  const dp = new Array(nums.length).fill(0);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);
  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1], nums[i] + dp[i - 2]);
  }
  return dp[nums.length - 1];
}`,
      python: `def rob(nums: list[int]) -> int:
    dp = [0] * len(nums)
    dp[0], dp[1] = nums[0], max(nums[0], nums[1])
    for i in range(2, len(nums)):
        dp[i] = max(dp[i - 1], nums[i] + dp[i - 2])
    return dp[-1]`,
      cpp: `int rob(const vector<int>& nums) {
    vector<int> dp(nums.size());
    dp[0] = nums[0]; dp[1] = max(nums[0], nums[1]);
    for (size_t i = 2; i < nums.size(); i++)
        dp[i] = max(dp[i - 1], nums[i] + dp[i - 2]);
    return dp.back();
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 7,
        explanation: 'At i = 2 (val = 9): dp[2] = Math.max(dp[1]=7, 9 + dp[0]=2) = 11',
        boxes: [
          { index: 0, value: 2, state: 'visited', subText: 'dp[0]=2' },
          { index: 1, value: 7, state: 'visited', subText: 'dp[1]=7' },
          { index: 2, value: 11, state: 'active', subText: '9 + 2 = 11' },
          { index: 3, value: 3 },
          { index: 4, value: 1 }
        ],
        pointers: [
          { label: 'dp[i-2]', index: 0, color: 'green' },
          { label: 'dp[i]', index: 2, color: 'blue' }
        ],
        variables: { i: 2, 'dp[0]': 2, 'dp[1]': 7, 'dp[2]': 11 }
      },
      {
        stepNumber: 2,
        activeLine: 9,
        explanation: 'At i = 4 (val = 1): dp[4] = Math.max(11, 1 + 11) = 12 → Optimal = 12!',
        boxes: [
          { index: 0, value: 2, state: 'visited' },
          { index: 1, value: 7, state: 'visited' },
          { index: 2, value: 11, state: 'visited' },
          { index: 3, value: 11, state: 'visited' },
          { index: 4, value: 12, state: 'found', subText: 'Max = 12' }
        ],
        pointers: [{ label: 'optimal', index: 4, color: 'blue' }],
        variables: { i: 4, 'dp[4]': 12 }
      }
    ]
  },
  {
    id: 'divide-and-conquer',
    title: 'Divide and Conquer',
    pillar: 'DSA',
    difficulty: 'Medium',
    iconName: 'Split',
    description:
      'Split a problem into independent halves, solve each half recursively, and merge the sorted results in O(n log n) time.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    intuition:
      'MergeSort recursively halves the array until single-element arrays remain, then merges pairs of sorted halves using two pointers.',
    internals:
      'Recurrence T(n) = 2T(n/2) + O(n) evaluates to O(n log₂ n) by the Master Theorem.',
    traceSummary: 'Merged sorted halves [1, 4] and [2, 6] → [1, 2, 4, 6]',
    code: {
      javascript: `function merge(left, right) {
  const res = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) res.push(left[i++]);
    else res.push(right[j++]);
  }
  return [...res, ...left.slice(i), ...right.slice(j)];
}`,
      typescript: `function merge(left: number[], right: number[]): number[] {
  const res: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    res.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return [...res, ...left.slice(i), ...right.slice(j)];
}`,
      python: `def merge(left: list[int], right: list[int]) -> list[int]:
    res, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i]); i += 1
        else:
            res.append(right[j]); j += 1
    return res + left[i:] + right[j:]`,
      cpp: `vector<int> merge(const vector<int>& L, const vector<int>& R) {
    vector<int> res; int i = 0, j = 0;
    while (i < L.size() && j < R.size())
        res.push_back(L[i] <= R[j] ? L[i++] : R[j++]);
    while (i < L.size()) res.push_back(L[i++]);
    while (j < R.size()) res.push_back(R[j++]);
    return res;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 5,
        explanation: 'Compare left = [1, 4] and right = [2, 6] → pick 1, then 2, then 4, then 6',
        boxes: [
          { index: 0, value: 1, state: 'visited', subText: 'Left[0]' },
          { index: 1, value: 4, state: 'active', subText: 'Left[1]' },
          { index: 2, value: 2, state: 'visited', subText: 'Right[0]' },
          { index: 3, value: 6, state: 'active', subText: 'Right[1]' }
        ],
        pointers: [
          { label: 'i', index: 1, color: 'green' },
          { label: 'j', index: 3, color: 'purple' }
        ],
        variables: { left: '[1, 4]', right: '[2, 6]', mergedSoFar: '[1, 2]' }
      },
      {
        stepNumber: 2,
        activeLine: 8,
        explanation: 'Both halves merged into sorted output [1, 2, 4, 6]',
        boxes: [
          { index: 0, value: 1, state: 'found' },
          { index: 1, value: 2, state: 'found' },
          { index: 2, value: 4, state: 'found' },
          { index: 3, value: 6, state: 'found' }
        ],
        pointers: [{ label: 'sorted', index: 3, color: 'blue' }],
        variables: { result: '[1, 2, 4, 6]' }
      }
    ]
  },
  {
    id: 'bit-manipulation',
    title: 'Bit Manipulation',
    pillar: 'DSA',
    difficulty: 'Easy',
    iconName: 'Binary',
    description:
      'Use hardware-level bitwise operators (XOR ^, AND &, OR |, shifts << >>) to cancel duplicates and manipulate binary masks in O(1) space.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    intuition:
      'Because x ^ x = 0 and x ^ 0 = x, XORing all numbers in an array where every number appears twice except one cancels out all pairs and leaves the unique number!',
    internals:
      'Executes directly in CPU ALU registers in 1 clock cycle per instruction.',
    traceSummary: 'XOR accumulator isolated unique value 4',
    code: {
      javascript: `function singleNumber(nums) {
  let ans = 0;
  for (const num of nums) {
    ans ^= num; // Duplicate pairs cancel to 0!
  }
  return ans;
}`,
      typescript: `function singleNumber(nums: number[]): number {
  let ans = 0;
  for (const num of nums) ans ^= num;
  return ans;
}`,
      python: `def single_number(nums: list[int]) -> int:
    ans = 0
    for num in nums:
        ans ^= num
    return ans`,
      cpp: `int singleNumber(const vector<int>& nums) {
    int ans = 0;
    for (int num : nums) ans ^= num;
    return ans;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 4,
        explanation: 'XOR 4 ^ 1 ^ 2 → ans = 7 (binary 0111₂)',
        boxes: [
          { index: 0, value: 4, state: 'visited', subText: '0100₂' },
          { index: 1, value: 1, state: 'visited', subText: '0001₂' },
          { index: 2, value: 2, state: 'active', subText: '0010₂' },
          { index: 3, value: 1, subText: '0001₂' },
          { index: 4, value: 2, subText: '0010₂' }
        ],
        pointers: [{ label: 'i', index: 2, color: 'blue' }],
        variables: { ans: 7, binary: '0111₂' }
      },
      {
        stepNumber: 2,
        activeLine: 6,
        explanation: 'XOR remaining 1 and 2 → pairs cancel out, leaving ans = 4 (0100₂)!',
        boxes: [
          { index: 0, value: 4, state: 'found', subText: 'Unique!' },
          { index: 1, value: 1, state: 'discarded', subText: 'canceled' },
          { index: 2, value: 2, state: 'discarded', subText: 'canceled' },
          { index: 3, value: 1, state: 'discarded', subText: 'canceled' },
          { index: 4, value: 2, state: 'discarded', subText: 'canceled' }
        ],
        pointers: [{ label: 'unique', index: 0, color: 'green' }],
        variables: { ans: 4, binary: '0100₂' }
      }
    ]
  },
  {
    id: 'graph-traversal',
    title: 'Graph Traversal (BFS & DFS)',
    pillar: 'DSA',
    difficulty: 'Medium',
    iconName: 'Compass',
    description:
      'Explore graphs level-by-level with Breadth-First Search (Queue) for shortest unweighted paths or branch-by-branch with Depth-First Search (Stack).',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    intuition:
      'BFS expands in concentric distance ripples using a FIFO Queue. DFS plunges deep along one path using recursion or a LIFO Stack before backtracking.',
    internals:
      'Marking nodes visited upon enqueueing prevents duplicate queue entries on cyclic graphs.',
    traceSummary: 'BFS visited all 5 nodes in level order: A → B → C → D → E',
    code: {
      javascript: `function bfs(adj, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  while (queue.length > 0) {
    const u = queue.shift();
    order.push(u);
    for (const v of adj[u]) {
      if (!visited.has(v)) {
        visited.add(v);
        queue.push(v);
      }
    }
  }
  return order;
}`,
      typescript: `function bfs(adj: Record<string, string[]>, start: string): string[] {
  const visited = new Set([start]);
  const queue = [start], order: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    for (const v of adj[u]) {
      if (!visited.has(v)) { visited.add(v); queue.push(v); }
    }
  }
  return order;
}`,
      python: `def bfs(adj: dict[str, list[str]], start: str) -> list[str]:
    visited, queue, order = {start}, deque([start]), []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in adj[u]:
            if v not in visited:
                visited.add(v); queue.append(v)
    return order`,
      cpp: `vector<string> bfs(unordered_map<string,vector<string>>& adj, string start) {
    unordered_set<string> vis = {start}; queue<string> q; q.push(start);
    vector<string> order;
    while (!q.empty()) {
        string u = q.front(); q.pop(); order.push_back(u);
        for (auto& v : adj[u]) if (!vis.count(v)) { vis.insert(v); q.push(v); }
    }
    return order;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 7,
        explanation: 'Dequeue A (d=0) and enqueue its Distance-1 neighbors B and C',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 50, y: 18, state: 'visited', badge: 'd=0' },
            { id: 'B', label: 'B', x: 25, y: 52, state: 'active', badge: 'd=1' },
            { id: 'C', label: 'C', x: 75, y: 52, state: 'active', badge: 'd=1' },
            { id: 'D', label: 'D', x: 25, y: 85, state: 'default' },
            { id: 'E', label: 'E', x: 75, y: 85, state: 'default' }
          ],
          edges: [
            { from: 'A', to: 'B', state: 'active' },
            { from: 'A', to: 'C', state: 'active' },
            { from: 'B', to: 'D', state: 'default' },
            { from: 'C', to: 'E', state: 'default' }
          ],
          auxQueue: ['B', 'C']
        },
        variables: { current: 'A', queue: '[B, C]' }
      },
      {
        stepNumber: 2,
        activeLine: 16,
        explanation: 'Process B and C → Enqueue Distance-2 nodes D and E → Complete!',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 50, y: 18, state: 'found', badge: 'd=0' },
            { id: 'B', label: 'B', x: 25, y: 52, state: 'found', badge: 'd=1' },
            { id: 'C', label: 'C', x: 75, y: 52, state: 'found', badge: 'd=1' },
            { id: 'D', label: 'D', x: 25, y: 85, state: 'found', badge: 'd=2' },
            { id: 'E', label: 'E', x: 75, y: 85, state: 'found', badge: 'd=2' }
          ],
          edges: [
            { from: 'A', to: 'B', state: 'path' },
            { from: 'A', to: 'C', state: 'path' },
            { from: 'B', to: 'D', state: 'path' },
            { from: 'C', to: 'E', state: 'path' }
          ],
          auxQueue: []
        },
        variables: { order: 'A → B → C → D → E' }
      }
    ]
  },
  {
    id: 'shortest-path',
    title: 'Shortest Path Algorithms',
    pillar: 'DSA',
    difficulty: 'Hard',
    iconName: 'Route',
    description:
      "Find the minimum-weight path in a weighted graph using Dijkstra's Min-Heap Priority Queue and Edge Relaxation.",
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    intuition:
      'Always expand the closest unvisited node from the Min-Heap and check if going through u offers a shorter route to v: dist[u] + w < dist[v].',
    internals:
      'Requires non-negative edge weights (w >= 0).',
    traceSummary: 'Shortcut A → B → C (cost 5) beat direct A → C (cost 10)',
    code: {
      javascript: `function relaxEdges(dist, u, neighbors) {
  for (const [v, weight] of neighbors) {
    if (dist[u] + weight < dist[v]) {
      dist[v] = dist[u] + weight;
    }
  }
  return dist;
}`,
      typescript: `function relaxEdges(dist: Record<string, number>, u: string, neighbors: [string, number][]) {
  for (const [v, weight] of neighbors) {
    if (dist[u] + weight < dist[v]) dist[v] = dist[u] + weight;
  }
  return dist;
}`,
      python: `def relax_edges(dist: dict[str, int], u: str, neighbors: list[tuple[str, int]]):
    for v, weight in neighbors:
        if dist[u] + weight < dist[v]:
            dist[v] = dist[u] + weight
    return dist`,
      cpp: `void relaxEdges(unordered_map<char,int>& dist, char u, vector<pair<char,int>>& nb) {
    for (auto [v, w] : nb)
        if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 3,
        explanation: 'From A (dist=0): direct edge to B costs 2, direct edge to C costs 10',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 20, y: 50, state: 'visited', badge: 'd=0' },
            { id: 'B', label: 'B', x: 55, y: 22, state: 'active', badge: 'd=2' },
            { id: 'C', label: 'C', x: 55, y: 80, state: 'default', badge: 'd=10' }
          ],
          edges: [
            { from: 'A', to: 'B', weight: 2, state: 'active' },
            { from: 'A', to: 'C', weight: 10, state: 'default' },
            { from: 'B', to: 'C', weight: 3, state: 'default' }
          ]
        },
        variables: { 'dist[A]': 0, 'dist[B]': 2, 'dist[C]': 10 }
      },
      {
        stepNumber: 2,
        activeLine: 4,
        explanation: 'Relax edge B → C (weight 3): dist[B] + 3 = 5 < 10 → Update dist[C] = 5!',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 20, y: 50, state: 'found', badge: 'd=0' },
            { id: 'B', label: 'B', x: 55, y: 22, state: 'found', badge: 'd=2' },
            { id: 'C', label: 'C', x: 55, y: 80, state: 'found', badge: 'd=5!' }
          ],
          edges: [
            { from: 'A', to: 'B', weight: 2, state: 'path' },
            { from: 'A', to: 'C', weight: 10, state: 'default' },
            { from: 'B', to: 'C', weight: 3, state: 'path' }
          ]
        },
        variables: { 'dist[A]': 0, 'dist[B]': 2, 'dist[C]': 5 }
      }
    ]
  },
  {
    id: 'minimum-spanning-trees',
    title: 'Minimum Spanning Trees',
    pillar: 'DSA',
    difficulty: 'Hard',
    iconName: 'GitMerge',
    description:
      "Connect all V vertices at minimum total edge weight without cycles using Kruskal's or Prim's MST algorithm.",
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(V)',
    intuition:
      'Sort all edges from cheapest to most expensive and greedily add each edge unless its endpoints are already in the same connected component.',
    internals:
      'A Spanning Tree on V vertices always contains exactly V - 1 edges.',
    traceSummary: 'Built MST with V-1 = 3 edges and total cost 6',
    code: {
      javascript: `function kruskalMST(n, edges, uf) {
  edges.sort((a, b) => a.w - b.w);
  let cost = 0;
  for (const { u, v, w } of edges) {
    if (uf.union(u, v)) cost += w;
  }
  return cost;
}`,
      typescript: `function kruskalMST(edges: { u: number; v: number; w: number }[], uf: any): number {
  edges.sort((a, b) => a.w - b.w);
  let cost = 0;
  for (const { u, v, w } of edges) if (uf.union(u, v)) cost += w;
  return cost;
}`,
      python: `def kruskal_mst(edges: list[tuple[int, int, int]], uf) -> int:
    edges.sort(key=lambda e: e[2])
    return sum(w for u, v, w in edges if uf.union(u, v))`,
      cpp: `int kruskalMST(vector<Edge>& edges, UnionFind& uf) {
    sort(edges.begin(), edges.end());
    int cost = 0;
    for (auto& e : edges) if (uf.unite(e.u, e.v)) cost += e.w;
    return cost;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 5,
        explanation: 'Pick cheapest edges (0-1, w=1), (1-2, w=2), and (2-3, w=3); skip cycle edge (0-2, w=4)',
        graph: {
          nodes: [
            { id: '0', label: '0', x: 20, y: 28, state: 'found' },
            { id: '1', label: '1', x: 75, y: 28, state: 'found' },
            { id: '2', label: '2', x: 20, y: 78, state: 'found' },
            { id: '3', label: '3', x: 75, y: 78, state: 'found' }
          ],
          edges: [
            { from: '0', to: '1', weight: 1, state: 'path' },
            { from: '1', to: '2', weight: 2, state: 'path' },
            { from: '2', to: '3', weight: 3, state: 'path' },
            { from: '0', to: '2', weight: 4, state: 'default' }
          ]
        },
        variables: { edgesAccepted: 3, mstCost: 6 }
      }
    ]
  },
  {
    id: 'topological-sorting',
    title: 'Topological Sorting',
    pillar: 'DSA',
    difficulty: 'Medium',
    iconName: 'ListOrdered',
    description:
      "Order tasks in a Directed Acyclic Graph (DAG) so every prerequisite appears before its dependents using Kahn's Indegree Queue.",
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    intuition:
      'Nodes with indegree === 0 have no unmet prerequisites and can execute immediately. Finishing them decrements their dependents’ indegrees.',
    internals:
      'If the output order contains fewer than V nodes, the graph contains a cycle.',
    traceSummary: 'Valid topological order: 0 → 1 → 2 → 3',
    code: {
      javascript: `function topoSort(adj, indegree) {
  const queue = [];
  indegree.forEach((deg, i) => { if (deg === 0) queue.push(i); });
  const order = [];
  while (queue.length > 0) {
    const u = queue.shift();
    order.push(u);
    for (const v of adj[u]) {
      if (--indegree[v] === 0) queue.push(v);
    }
  }
  return order;
}`,
      typescript: `function topoSort(adj: number[][], indegree: number[]): number[] {
  const queue = indegree.map((d, i) => d === 0 ? i : -1).filter(i => i !== -1);
  const order: number[] = [];
  while (queue.length) {
    const u = queue.shift()!;
    order.push(u);
    for (const v of adj[u]) if (--indegree[v] === 0) queue.push(v);
  }
  return order;
}`,
      python: `def topo_sort(adj: list[list[int]], indegree: list[int]) -> list[int]:
    q = deque([i for i, d in enumerate(indegree) if d == 0])
    order = []
    while q:
        u = q.popleft(); order.append(u)
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0: q.append(v)
    return order`,
      cpp: `vector<int> topoSort(vector<vector<int>>& adj, vector<int>& indeg) {
    queue<int> q; for(int i=0;i<indeg.size();i++) if(!indeg[i]) q.push(i);
    vector<int> order;
    while(!q.empty()){
        int u=q.front(); q.pop(); order.push_back(u);
        for(int v:adj[u]) if(--indeg[v]==0) q.push(v);
    }
    return order;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 9,
        explanation: 'Dequeue 0 (indegree 0) → unlocks 1 and 2 → unlocks 3',
        boxes: [
          { index: 0, value: 'Task 0', state: 'found', subText: 'in: 0' },
          { index: 1, value: 'Task 1', state: 'found', subText: 'in: 1→0' },
          { index: 2, value: 'Task 2', state: 'found', subText: 'in: 1→0' },
          { index: 3, value: 'Task 3', state: 'found', subText: 'in: 2→0' }
        ],
        pointers: [{ label: 'order', index: 3, color: 'blue' }],
        variables: { topologicalOrder: '[0, 1, 2, 3]' }
      }
    ]
  },
  {
    id: 'disjoint-set-union',
    title: 'Disjoint Set Union (Union-Find)',
    pillar: 'DSA',
    difficulty: 'Medium',
    iconName: 'Combine',
    description:
      'Track connected components and detect cycles in near-constant O(α(n)) time using Path Compression and Union by Rank.',
    timeComplexity: 'O(α(n)) ≈ O(1)',
    spaceComplexity: 'O(n)',
    intuition:
      'Each component elects a root representative (parent[r] === r). Path compression flattens trees by pointing every visited node directly to the root.',
    internals:
      'Inverse Ackermann function α(n) <= 4 for all practical n.',
    traceSummary: 'Merged components {0,1} and {2,3} under root 0',
    code: {
      javascript: `function find(parent, x) {
  if (parent[x] !== x) {
    parent[x] = find(parent, parent[x]); // Path Compression
  }
  return parent[x];
}`,
      typescript: `function find(parent: number[], x: number): number {
  if (parent[x] !== x) parent[x] = find(parent, parent[x]);
  return parent[x];
}`,
      python: `def find(parent: list[int], x: int) -> int:
    if parent[x] != x:
        parent[x] = find(parent, parent[x])
    return parent[x]`,
      cpp: `int find(vector<int>& parent, int x) {
    return parent[x] == x ? x : parent[x] = find(parent, parent[x]);
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 3,
        explanation: 'Path Compression flattens parent pointers so all nodes point directly to Root 0',
        boxes: [
          { index: 0, value: 0, state: 'found', subText: 'Root' },
          { index: 1, value: 0, state: 'visited', subText: 'parent=0' },
          { index: 2, value: 0, state: 'visited', subText: 'parent=0' },
          { index: 3, value: 0, state: 'active', subText: 'compressed→0' }
        ],
        pointers: [
          { label: 'root', index: 0, color: 'green' },
          { label: 'x=3', index: 3, color: 'blue' }
        ],
        variables: { 'find(3)': 0, parentArray: '[0, 0, 0, 0]' }
      }
    ]
  },
  {
    id: 'segment-fenwick-trees',
    title: 'Segment Trees & Fenwick Trees',
    pillar: 'DSA',
    difficulty: 'Hard',
    iconName: 'Binary',
    description:
      'Perform both Range Sum/Min/Max Queries and Point Updates in O(log n) time using hierarchical interval trees.',
    timeComplexity: 'O(log n) Query & Update',
    spaceComplexity: 'O(n)',
    intuition:
      'Each node in a Segment Tree caches the aggregate sum of a contiguous range [L..R], allowing any range query to combine at most 2 log₂(n) precomputed nodes.',
    internals:
      'Stored in a 1-indexed array of size 4n where children of node are 2*node and 2*node + 1.',
    traceSummary: 'Range query [1..3] combined canonical nodes 5 + 5 = 10',
    code: {
      javascript: `function query(tree, node, l, r, ql, qr) {
  if (ql > r || qr < l) return 0;
  if (ql <= l && r <= qr) return tree[node];
  const mid = (l + r) >> 1;
  return query(tree, node * 2, l, mid, ql, qr) +
         query(tree, node * 2 + 1, mid + 1, r, ql, qr);
}`,
      typescript: `function query(tree: number[], node: number, l: number, r: number, ql: number, qr: number): number {
  if (ql > r || qr < l) return 0;
  if (ql <= l && r <= qr) return tree[node];
  const mid = (l + r) >> 1;
  return query(tree, node*2, l, mid, ql, qr) + query(tree, node*2+1, mid+1, r, ql, qr);
}`,
      python: `def query(tree: list[int], node: int, l: int, r: int, ql: int, qr: int) -> int:
    if ql > r or qr < l: return 0
    if ql <= l and r <= qr: return tree[node]
    mid = (l + r) // 2
    return query(tree, node*2, l, mid, ql, qr) + query(tree, node*2+1, mid+1, r, ql, qr)`,
      cpp: `int query(vector<int>& tree, int node, int l, int r, int ql, int qr) {
    if (ql > r || qr < l) return 0;
    if (ql <= l && r <= qr) return tree[node];
    int mid = (l + r) / 2;
    return query(tree, node*2, l, mid, ql, qr) + query(tree, node*2+1, mid+1, r, ql, qr);
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 3,
        explanation: 'Query [1..3] hits canonical intervals [1..1] (5) and [2..3] (5) → returns 10',
        treeNodes: [
          { id: '1', label: '12 [0..3]', x: 50, y: 18, leftId: '2', rightId: '3', state: 'visited' },
          { id: '2', label: '7 [0..1]', x: 25, y: 52, leftId: '4', rightId: '5', state: 'active' },
          { id: '3', label: '5 [2..3]', x: 75, y: 52, state: 'found', note: '+5 Hit' },
          { id: '4', label: '2 [0]', x: 12, y: 84, state: 'default' },
          { id: '5', label: '5 [1]', x: 38, y: 84, state: 'found', note: '+5 Hit' }
        ],
        variables: { queryRange: '[1..3]', sum: 10 }
      }
    ]
  },
  {
    id: 'monotonic-stacks-queues',
    title: 'Monotonic Stacks & Queues',
    pillar: 'DSA',
    difficulty: 'Medium',
    iconName: 'BarChart2',
    description:
      'Maintain elements in strictly increasing or decreasing order inside a Stack/Deque to solve Next Greater Element and Sliding Window Maximum in O(n).',
    timeComplexity: 'O(n) Amortized',
    spaceComplexity: 'O(n)',
    intuition:
      'When a larger element arrives, it pops and resolves all smaller waiting elements on top of the decreasing stack at once.',
    internals:
      'Each index is pushed once and popped at most once (<= 2n total operations).',
    traceSummary: 'Resolved Next Greater Element for all indices in 1 pass',
    code: {
      javascript: `function nextGreater(nums) {
  const res = new Array(nums.length).fill(-1);
  const stack = [];
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      res[stack.pop()] = nums[i];
    }
    stack.push(i);
  }
  return res;
}`,
      typescript: `function nextGreater(nums: number[]): number[] {
  const res = new Array(nums.length).fill(-1), stack: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      res[stack.pop()!] = nums[i];
    }
    stack.push(i);
  }
  return res;
}`,
      python: `def next_greater(nums: list[int]) -> list[int]:
    res, stack = [-1] * len(nums), []
    for i, x in enumerate(nums):
        while stack and x > nums[stack[-1]]:
            res[stack.pop()] = x
        stack.append(i)
    return res`,
      cpp: `vector<int> nextGreater(const vector<int>& nums) {
    vector<int> res(nums.size(), -1); stack<int> st;
    for (int i = 0; i < nums.size(); i++) {
        while (!st.empty() && nums[i] > nums[st.top()]) {
            res[st.top()] = nums[i]; st.pop();
        }
        st.push(i);
    }
    return res;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 6,
        explanation: 'At i = 3 (75): pops waiting 69, 71, 73 from monotonic stack and sets their Next Greater to 75',
        boxes: [
          { index: 0, value: 73, state: 'found', subText: '→ 75' },
          { index: 1, value: 71, state: 'found', subText: '→ 75' },
          { index: 2, value: 69, state: 'found', subText: '→ 75' },
          { index: 3, value: 75, state: 'active', subText: 'Resolver' },
          { index: 4, value: 72, subText: '→ -1' }
        ],
        pointers: [{ label: 'i', index: 3, color: 'blue' }],
        variables: { current: 75, poppedCount: 3 }
      }
    ]
  },
  {
    id: 'interval-problems',
    title: 'Interval Problems',
    pillar: 'DSA',
    difficulty: 'Medium',
    iconName: 'Calendar',
    description:
      'Sort intervals by start time to detect and merge overlapping ranges ([start, end]) in O(n log n) time.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    intuition:
      'Once sorted by start time, two intervals overlap if and only if next.start <= current.end.',
    internals:
      'Merges in-place by updating prev[1] = Math.max(prev[1], curr[1]).',
    traceSummary: 'Merged [1, 4] and [2, 6] into [1, 6]',
    code: {
      javascript: `function mergeIntervals(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const prev = merged[merged.length - 1];
    if (intervals[i][0] <= prev[1]) {
      prev[1] = Math.max(prev[1], intervals[i][1]);
    } else {
      merged.push(intervals[i]);
    }
  }
  return merged;
}`,
      typescript: `function mergeIntervals(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const prev = merged[merged.length - 1];
    if (intervals[i][0] <= prev[1]) prev[1] = Math.max(prev[1], intervals[i][1]);
    else merged.push(intervals[i]);
  }
  return merged;
}`,
      python: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for s, e in intervals[1:]:
        if s <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], e)
        else:
            merged.append([s, e])
    return merged`,
      cpp: `vector<vector<int>> mergeIntervals(vector<vector<int>>& iv) {
    sort(iv.begin(), iv.end());
    vector<vector<int>> res = {iv[0]};
    for (size_t i = 1; i < iv.size(); i++) {
        if (iv[i][0] <= res.back()[1]) res.back()[1] = max(res.back()[1], iv[i][1]);
        else res.push_back(iv[i]);
    }
    return res;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 7,
        explanation: 'Compare [1, 4] and [2, 6]: since 2 <= 4, merge into [1, 6]; keep disjoint [8, 10]',
        boxes: [
          { index: 0, value: '[1, 6]', state: 'found', subText: 'Merged' },
          { index: 1, value: '[8, 10]', state: 'visited', subText: 'Disjoint' }
        ],
        pointers: [{ label: 'merged', index: 0, color: 'green' }],
        variables: { mergedIntervals: '[[1, 6], [8, 10]]' }
      }
    ]
  },
  {
    id: 'time-space-complexity',
    title: 'Time & Space Complexity',
    pillar: 'DSA',
    difficulty: 'Easy',
    iconName: 'Clock',
    description:
      'Analyze how execution time and memory usage scale with input size n using Big O notation (O(1), O(log n), O(n), O(n log n), O(n²)).',
    timeComplexity: 'O(1) → O(2^n)',
    spaceComplexity: 'Auxiliary RAM & Stack',
    intuition:
      'Trading O(n) memory (like a Hash Set) often eliminates an inner O(n) loop, speeding up an algorithm from quadratic O(n²) to linear O(n).',
    internals:
      'At n = 100,000, O(n²) is 10 billion ops (~10 sec) while O(n) is 100,000 ops (~1 ms).',
    traceSummary: 'Reduced 10,000 nested operations to 100 linear steps',
    code: {
      javascript: `// O(1) Mathematical Formula vs O(n) Loop
function sumToN(n) {
  return (n * (n + 1)) / 2; // Instant O(1) time & O(1) space!
}`,
      typescript: `function sumToN(n: number): number {
  return (n * (n + 1)) / 2;
}`,
      python: `def sum_to_n(n: int) -> int:
    return (n * (n + 1)) // 2`,
      cpp: `long long sumToN(long long n) {
    return (n * (n + 1)) / 2;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 3,
        explanation: 'Compare growth rates at n = 1,000: O(1)=1 op, O(log n)=10 ops, O(n)=1,000 ops, O(n²)=1,000,000 ops',
        boxes: [
          { index: 0, value: 'O(1)', state: 'found', subText: '1 op' },
          { index: 1, value: 'O(log n)', state: 'found', subText: '10 ops' },
          { index: 2, value: 'O(n)', state: 'active', subText: '1,000 ops' },
          { index: 3, value: 'O(n log n)', subText: '10,000 ops' },
          { index: 4, value: 'O(n²)', state: 'discarded', subText: '1,000,000 ops' }
        ],
        pointers: [{ label: 'optimal', index: 0, color: 'green' }],
        variables: { n: 1000, 'O(log n)': 10, 'O(n)': 1000 }
      }
    ]
  },
  {
    id: 'problem-solving-patterns',
    title: 'Problem Solving Patterns',
    pillar: 'DSA',
    difficulty: 'Medium',
    iconName: 'Sparkles',
    description:
      'Map any coding problem constraint to the right algorithmic pattern: Sorted Array → Binary Search / Two Pointers; Subarrays → Sliding Window / Prefix Sum.',
    timeComplexity: 'Pattern Selection',
    spaceComplexity: 'Optimal Trade-off',
    intuition:
      'Instead of memorizing hundreds of problems, recognize the 8 core patterns from the input structure and constraints.',
    internals:
      'Constraint n <= 20 hints Backtracking/Bitmask DP; n <= 10^5 requires O(n) or O(n log n).',
    traceSummary: 'Matched constraint n = 10^5 Sorted Array → O(log n) Binary Search',
    code: {
      javascript: `function selectPattern(inputType, constraintN) {
  if (inputType === 'sorted_array') return 'Binary Search or Two Pointers';
  if (inputType === 'subarray_range') return 'Sliding Window or Prefix Sum';
  if (inputType === 'shortest_unweighted') return 'BFS Queue';
  if (constraintN <= 20) return 'Backtracking / Bitmask DP';
  return 'Hash Map / Monotonic Stack';
}`,
      typescript: `function selectPattern(inputType: string, constraintN: number): string {
  if (inputType === 'sorted_array') return 'Binary Search or Two Pointers';
  if (inputType === 'subarray_range') return 'Sliding Window or Prefix Sum';
  return 'Hash Map / Monotonic Stack';
}`,
      python: `def select_pattern(input_type: str, n: int) -> str:
    if input_type == "sorted_array":
        return "Binary Search or Two Pointers"
    return "Sliding Window or Hash Map"`,
      cpp: `string selectPattern(string type, int n) {
    if (type == "sorted_array") return "Binary Search / Two Pointers";
    return "Sliding Window / Hash Map";
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 2,
        explanation: 'Identify pattern from problem signature: Sorted input → Binary Search / Two Pointers',
        boxes: [
          { index: 0, value: 'Two Pointers', state: 'found', subText: 'Sorted Pairs' },
          { index: 1, value: 'Sliding Window', state: 'active', subText: 'Subarrays' },
          { index: 2, value: 'Fast & Slow', subText: 'Cycles' },
          { index: 3, value: 'Top-K Heap', subText: 'Priority' }
        ],
        pointers: [
          { label: 'pairs', index: 0, color: 'green' },
          { label: 'window', index: 1, color: 'blue' }
        ],
        variables: { patternCount: 8, complexityTarget: 'O(n) or O(log n)' }
      }
    ]
  }
];
