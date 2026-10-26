import { TopicDefinition } from '../../types/visualizer';

export const graphsAndAdvancedTreesTopics: TopicDefinition[] = [
  {
    id: 'graphs-bfs-dfs-traversal',
    title: 'Graphs, Adjacency Lists & BFS vs. DFS Traversal',
    shortTitle: 'Graphs: BFS & DFS',
    category: 'graphs-advanced-trees',
    difficulty: 'Intermediate',
    summary: 'Watch Breadth-First Search (Queue ripples) explore level-by-level for unweighted shortest paths while Depth-First Search (Stack plunges) explores deep branches.',
    intuitionOverview: 'Imagine dropping a pebble into a pond: Breadth-First Search (BFS) expands outward in concentric rings using a FIFO Queue—visiting all distance-1 neighbors before any distance-2 neighbors. Depth-First Search (DFS) is like exploring a maze by walking as deep as possible down one corridor before backtracking.',
    internalsOverview: 'Graphs are represented in memory as an Adjacency List (`Map<Vertex, Vertex[]>`), which uses `O(V + E)` space—far more memory-efficient than an `O(V²)` Adjacency Matrix for sparse graphs. A `visited` Set prevents infinite loops on cycles.',
    realWorldUseCases: [
      'LinkedIn 1st/2nd/3rd-degree connection distance (BFS Shortest Unweighted Path)',
      'Garbage Collection Mark-and-Sweep reachability from root pointers (DFS/BFS)',
      'Web crawlers, network broadcast routing, and connected components'
    ],
    keyInvariants: [
      'BFS Level Invariant: In an unweighted graph, the first time a node is dequeued/visited in BFS is guaranteed to be via the shortest path from the source.',
      'Visited Guard: Mark nodes `visited` the moment they are enqueued (not when dequeued!) to avoid duplicate queue entries.'
    ],
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(V + E)',
      timeWorst: 'O(V + E)',
      space: 'O(V) Queue & Visited Set',
      note: 'Every vertex is enqueued once O(V) and every edge is inspected once O(E).'
    },
    code: {
      typescript: `function bfsShortestReach(adj: Record<string, string[]>, start: string): string[] {
  const visited = new Set<string>([start]);
  const queue: string[] = [start]; // FIFO Queue for level-order ripples
  const order: string[] = [];

  while (queue.length > 0) {
    const curr = queue.shift()!; // Dequeue front vertex
    order.push(curr);
    for (const neighbor of adj[curr]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);   // Mark visited BEFORE enqueueing!
        queue.push(neighbor);
      }
    }
  }
  return order;
}`,
      python: `from collections import deque

def bfs_shortest_reach(adj: dict[str, list[str]], start: str) -> list[str]:
    visited = {start}
    queue = deque([start])  # O(1) FIFO Deque
    order = []
    while queue:
        curr = queue.popleft()
        order.append(curr)
        for neighbor in adj[curr]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order`,
      cpp: `vector<string> bfsShortestReach(unordered_map<string, vector<string>>& adj, string start) {
    unordered_set<string> visited = {start};
    queue<string> q; q.push(start);
    vector<string> order;
    while (!q.empty()) {
        string curr = q.front(); q.pop();
        order.push_back(curr);
        for (const string& nb : adj[curr]) {
            if (!visited.count(nb)) {
                visited.insert(nb);
                q.push(nb);
            }
        }
    }
    return order;
}`
    },
    liveSandboxCode: `const adj = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "F"],
  D: ["B"],
  E: ["B", "F"],
  F: ["C", "E"]
};

function runBFS(start) {
  const visited = new Set([start]);
  const dist = { [start]: 0 };
  const queue = [start];
  const order = [];
  while (queue.length > 0) {
    const u = queue.shift();
    order.push(\`\${u}(d=\${dist[u]})\`);
    for (const v of adj[u]) {
      if (!visited.has(v)) {
        visited.add(v);
        dist[v] = dist[u] + 1;
        queue.push(v);
      }
    }
  }
  return order;
}

console.log("BFS Level-Order with Distances:", runBFS("A").join(" -> "));`,
    steps: [
      {
        stepNumber: 1,
        title: 'Distance 0: Enqueue Source Vertex "A" & Mark Visited',
        intuitionExplanation: 'We start BFS at node `A` (Distance 0). We place `A` into our FIFO Queue `[A]` and immediately mark `A` in `visited` so we never process it twice.',
        internalsExplanation: 'Queue initialized with `["A"]`. `visited` hash set contains `{"A"}`. Adjacency list stored on Heap.',
        codeLines: { typescript: [2, 3, 4], python: [4, 5, 6], cpp: [2, 3, 4] },
        timeDelta: 'O(1)',
        spaceDelta: 'Queue: [A]',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 50, y: 15, state: 'current', distance: 0 },
            { id: 'B', label: 'B', x: 25, y: 48, state: 'default', distance: '∞' },
            { id: 'C', label: 'C', x: 75, y: 48, state: 'default', distance: '∞' },
            { id: 'D', label: 'D', x: 15, y: 82, state: 'default', distance: '∞' },
            { id: 'E', label: 'E', x: 45, y: 82, state: 'default', distance: '∞' },
            { id: 'F', label: 'F', x: 80, y: 82, state: 'default', distance: '∞' }
          ],
          edges: [
            { from: 'A', to: 'B', state: 'default' },
            { from: 'A', to: 'C', state: 'default' },
            { from: 'B', to: 'D', state: 'default' },
            { from: 'B', to: 'E', state: 'default' },
            { from: 'C', to: 'F', state: 'default' },
            { from: 'E', to: 'F', state: 'default' }
          ],
          queueOrStack: { label: 'FIFO Queue', items: ['A (d=0)'] }
        },
        callStack: [{ funcName: 'bfsShortestReach', args: 'start="A"', locals: { queue: '[A]', visited: '{A}' }, status: 'active' }],
        heap: [{ address: '0xG100', type: 'AdjacencyList', label: 'adj', value: 'A:[B,C], B:[A,D,E], C:[A,F]...' }],
        variables: { current: 'A', level: 0, queue: '[A]', visitedCount: 1 }
      },
      {
        stepNumber: 2,
        title: 'Distance 1 Ripple: Dequeue "A", Enqueue Neighbors "B" & "C"',
        intuitionExplanation: 'We pop `A` from the front of the Queue and inspect its neighbors `B` and `C`. Both are unvisited, so they enter the Queue `[B, C]` at Distance 1!',
        internalsExplanation: '`A` dequeued. Edges `(A,B)` and `(A,C)` traversed. `B` and `C` added to `visited` and pushed to `queue`.',
        codeLines: { typescript: [7, 8, 9, 10, 11, 12], python: [8, 9, 10, 11, 12, 13], cpp: [6, 7, 8, 9, 10, 11] },
        timeDelta: '+2 edges',
        spaceDelta: 'Queue: [B, C]',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 50, y: 15, state: 'visited', distance: 0 },
            { id: 'B', label: 'B', x: 25, y: 48, state: 'queued', distance: 1 },
            { id: 'C', label: 'C', x: 75, y: 48, state: 'queued', distance: 1 },
            { id: 'D', label: 'D', x: 15, y: 82, state: 'default', distance: '∞' },
            { id: 'E', label: 'E', x: 45, y: 82, state: 'default', distance: '∞' },
            { id: 'F', label: 'F', x: 80, y: 82, state: 'default', distance: '∞' }
          ],
          edges: [
            { from: 'A', to: 'B', state: 'active' },
            { from: 'A', to: 'C', state: 'active' },
            { from: 'B', to: 'D', state: 'default' },
            { from: 'B', to: 'E', state: 'default' },
            { from: 'C', to: 'F', state: 'default' },
            { from: 'E', to: 'F', state: 'default' }
          ],
          queueOrStack: { label: 'FIFO Queue', items: ['B (d=1)', 'C (d=1)'] }
        },
        callStack: [{ funcName: 'bfsShortestReach', args: 'start="A"', locals: { curr: 'A', order: '[A]', queue: '[B, C]' }, status: 'active' }],
        heap: [{ address: '0xG100', type: 'Set', label: 'visited', value: '{ A, B, C }', highlight: true }],
        variables: { current: 'A', level: 1, queue: '[B, C]', visitedCount: 3 }
      },
      {
        stepNumber: 3,
        title: 'Distance 2 Ripple: Process "B" & "C", Enqueue "D", "E", "F"',
        intuitionExplanation: 'Because `B` and `C` were at the front of the FIFO Queue, we finish ALL Distance-1 nodes before touching Distance-2 nodes `D`, `E`, and `F`! That yields the exact level-by-level order: `A -> B -> C -> D -> E -> F`.',
        internalsExplanation: 'Dequeueing `B` enqueues `D, E`; dequeueing `C` enqueues `F`. When `E` later sees `F`, `visited.has("F")` is already true, avoiding duplicate work on the cycle `A-B-E-F-C-A`.',
        codeLines: { typescript: [6, 7, 8, 9, 10, 16], python: [7, 8, 9, 10, 11, 14], cpp: [5, 6, 7, 8, 9, 14] },
        timeDelta: 'Total: O(V + E)',
        spaceDelta: 'All 6 visited',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 50, y: 15, state: 'visited', distance: 0 },
            { id: 'B', label: 'B', x: 25, y: 48, state: 'visited', distance: 1 },
            { id: 'C', label: 'C', x: 75, y: 48, state: 'visited', distance: 1 },
            { id: 'D', label: 'D', x: 15, y: 82, state: 'shortest-path', distance: 2 },
            { id: 'E', label: 'E', x: 45, y: 82, state: 'shortest-path', distance: 2 },
            { id: 'F', label: 'F', x: 80, y: 82, state: 'shortest-path', distance: 2 }
          ],
          edges: [
            { from: 'A', to: 'B', state: 'relaxed' },
            { from: 'A', to: 'C', state: 'relaxed' },
            { from: 'B', to: 'D', state: 'active' },
            { from: 'B', to: 'E', state: 'active' },
            { from: 'C', to: 'F', state: 'active' },
            { from: 'E', to: 'F', state: 'discarded' }
          ],
          queueOrStack: { label: 'Final Level Order', items: ['A(0)', 'B(1)', 'C(1)', 'D(2)', 'E(2)', 'F(2)'] }
        },
        callStack: [{ funcName: 'bfsShortestReach', args: 'start="A"', locals: { order: '[A, B, C, D, E, F]' }, status: 'returning' }],
        heap: [{ address: '0xG100', type: 'Set', label: 'visited', value: '{ A, B, C, D, E, F }', highlight: true }],
        variables: { finalOrder: 'A -> B -> C -> D -> E -> F', maxDistance: 2, cycleAvoided: 'Edge E-F skipped' }
      }
    ]
  },
  {
    id: 'shortest-path-dijkstra',
    title: "Shortest-Path Algorithms: Dijkstra's Algorithm & Edge Relaxation",
    shortTitle: "Dijkstra's Shortest Path",
    category: 'graphs-advanced-trees',
    difficulty: 'Advanced',
    summary: 'See how a Min-Heap Priority Queue greedily locks in the closest unvisited node and relaxes weighted edges to find optimal routes.',
    intuitionOverview: 'When roads have different travel times (weights), normal BFS doesn’t work because a 2-hop highway might be faster than a 1-hop traffic jam! Dijkstra’s Algorithm uses a Min-Heap Priority Queue to always expand the closest known city next, checking if going through that city offers a shorter detour ("Edge Relaxation": `dist[u] + weight < dist[v]`).',
    internalsOverview: 'Maintains `dist[]` initialized to `∞` (`dist[src] = 0`) and a Min-Priority Queue of `(distance, vertex)`. Assuming non-negative edge weights (`w >= 0`), the first time a vertex `u` is popped from the Min-Heap, `dist[u]` is provably optimal.',
    realWorldUseCases: [
      'Google Maps / Waze GPS navigation and airline flight routing',
      'OSPF (Open Shortest Path First) internet packet routing protocol',
      'Network latency minimization across cloud availability zones'
    ],
    keyInvariants: [
      'Non-Negative Weights Requirement: All edge weights must be `>= 0` so adding an edge never shrinks a path retroactively.',
      'Edge Relaxation Condition: `if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; pq.push([dist[v], v]); }`'
    ],
    complexity: {
      timeBest: 'O(V + E)',
      timeAverage: 'O((V + E) log V)',
      timeWorst: 'O((V + E) log V)',
      space: 'O(V) Dist Table + Heap',
      note: 'Each edge relaxation may push to the Min-Heap in O(log V) time.'
    },
    code: {
      typescript: `function dijkstra(adj: Record<string, [string, number][]>, src: string) {
  const dist: Record<string, number> = { A: 0, B: Infinity, C: Infinity, D: Infinity };
  const pq: [number, string][] = [[0, src]]; // [distance, node] Min-Heap

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]); // Pop minimum distance node
    const [d, u] = pq.shift()!;
    if (d > dist[u]) continue;      // Skip stale heap entry

    for (const [v, weight] of adj[u]) {
      if (dist[u] + weight < dist[v]) { // Edge Relaxation!
        dist[v] = dist[u] + weight;
        pq.push([dist[v], v]);
      }
    }
  }
  return dist;
}`,
      python: `import heapq

def dijkstra(adj: dict[str, list[tuple[str, int]]], src: str) -> dict[str, int]:
    dist = {"A": 0, "B": float("inf"), "C": float("inf"), "D": float("inf")}
    pq = [(0, src)]  # Min-Heap of (distance, vertex)
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, weight in adj[u]:
            if dist[u] + weight < dist[v]:  # Edge Relaxation!
                dist[v] = dist[u] + weight
                heapq.heappush(pq, (dist[v], v))
    return dist`,
      cpp: `unordered_map<char, int> dijkstra( AdjList& adj, char src) {
    unordered_map<char, int> dist = {{'A',0}, {'B',1e9}, {'C',1e9}, {'D',1e9}};
    priority_queue<pair<int,char>, vector<pair<int,char>>, greater<>> pq;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) { // Edge Relaxation!
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`
    },
    liveSandboxCode: `// Notice how direct edge A->C costs 10, but A->B->C costs 2 + 3 = 5!
const adj = {
  A: [["B", 2], ["C", 10]],
  B: [["C", 3], ["D", 8]],
  C: [["D", 1]],
  D: []
};

const dist = { A: 0, B: Infinity, C: Infinity, D: Infinity };
const parent = { A: null };
const pq = [[0, "A"]];

while (pq.length > 0) {
  pq.sort((a, b) => a[0] - b[0]);
  const [d, u] = pq.shift();
  if (d > dist[u]) continue;
  for (const [v, w] of adj[u]) {
    if (dist[u] + w < dist[v]) {
      console.log(\`Relax (\${u}->\${v}, w=\${w}): dist[\${v}] improves from \${dist[v]} to \${dist[u] + w}\`);
      dist[v] = dist[u] + w;
      parent[v] = u;
      pq.push([dist[v], v]);
    }
  }
}
console.log("Optimal Distances from A:", dist);`,
    steps: [
      {
        stepNumber: 1,
        title: 'Pop Source "A" (dist=0): Relax A->B (cost 2) and A->C (cost 10)',
        intuitionExplanation: 'Starting at `A (dist=0)`, we see two roads: `A -> B` (weight 2) and `A -> C` (weight 10). We update `dist[B] = 2` and `dist[C] = 10` and push both into the Min-Heap. Notice `B` is much closer (`2 < 10`), so the Min-Heap puts `(2, B)` at the front!',
        internalsExplanation: 'Popped `(0, A)`. Relaxed `(A,B,2)` -> `dist[B]=2` and `(A,C,10)` -> `dist[C]=10`. Min-Heap state: `[(2, B), (10, C)]`.',
        codeLines: { typescript: [6, 7, 10, 11, 12, 13], python: [7, 10, 11, 12, 13], cpp: [6, 8, 9, 10, 11] },
        timeDelta: '2 relaxations',
        spaceDelta: 'PQ: [(2,B), (10,C)]',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 18, y: 50, state: 'visited', distance: 0 },
            { id: 'B', label: 'B', x: 50, y: 20, state: 'queued', distance: 2 },
            { id: 'C', label: 'C', x: 50, y: 80, state: 'queued', distance: 10 },
            { id: 'D', label: 'D', x: 84, y: 50, state: 'default', distance: '∞' }
          ],
          edges: [
            { from: 'A', to: 'B', weight: 2, directed: true, state: 'active' },
            { from: 'A', to: 'C', weight: 10, directed: true, state: 'active' },
            { from: 'B', to: 'C', weight: 3, directed: true, state: 'default' },
            { from: 'B', to: 'D', weight: 8, directed: true, state: 'default' },
            { from: 'C', to: 'D', weight: 1, directed: true, state: 'default' }
          ],
          queueOrStack: { label: 'Min-Heap Priority Queue', items: ['(2, B)', '(10, C)'] }
        },
        callStack: [{ funcName: 'dijkstra', args: 'src="A"', locals: { u: 'A', 'dist[B]': 2, 'dist[C]': 10 }, status: 'active' }],
        heap: [{ address: '0xDJ00', type: 'DistMap', label: 'dist', value: '{ A: 0, B: 2, C: 10, D: ∞ }', highlight: true }],
        variables: { poppedNode: 'A', 'dist[B]': 2, 'dist[C]': 10, 'dist[D]': '∞' }
      },
      {
        stepNumber: 2,
        title: 'Pop Closest "B" (dist=2): Edge Relaxation Finds Shortcut B->C (2 + 3 = 5 < 10)!',
        intuitionExplanation: 'We pop `(2, B)` from the Min-Heap. From `B`, there is a road `B -> C` of weight `3`. Total cost `A -> B -> C` is `2 + 3 = 5`, which beats our old direct route `A -> C (10)`! We relax `dist[C] = 5` and also set `dist[D] = 2 + 8 = 10`.',
        internalsExplanation: '`dist[B] + 3 = 5 < dist[C] (10)` triggers Edge Relaxation! `dist[C]` is updated to `5`, and `(5, C)` is pushed to the Min-Heap.',
        codeLines: { typescript: [6, 7, 10, 11, 12, 13], python: [7, 10, 11, 12, 13], cpp: [6, 8, 9, 10, 11] },
        timeDelta: '+2 relaxations',
        spaceDelta: 'PQ: [(5,C), (10,C), (10,D)]',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 18, y: 50, state: 'visited', distance: 0 },
            { id: 'B', label: 'B', x: 50, y: 20, state: 'current', distance: 2 },
            { id: 'C', label: 'C', x: 50, y: 80, state: 'queued', distance: 5 },
            { id: 'D', label: 'D', x: 84, y: 50, state: 'queued', distance: 10 }
          ],
          edges: [
            { from: 'A', to: 'B', weight: 2, directed: true, state: 'relaxed' },
            { from: 'A', to: 'C', weight: 10, directed: true, state: 'discarded' },
            { from: 'B', to: 'C', weight: 3, directed: true, state: 'active' },
            { from: 'B', to: 'D', weight: 8, directed: true, state: 'active' },
            { from: 'C', to: 'D', weight: 1, directed: true, state: 'default' }
          ],
          queueOrStack: { label: 'Min-Heap Priority Queue', items: ['(5, C)', '(10, D)', '(10, C stale)'] }
        },
        callStack: [{ funcName: 'dijkstra', args: 'src="A"', locals: { u: 'B', 'dist[C]': '10 -> 5!', 'dist[D]': 10 }, status: 'active' }],
        heap: [{ address: '0xDJ00', type: 'DistMap', label: 'dist', value: '{ A: 0, B: 2, C: 5, D: 10 }', highlight: true }],
        variables: { poppedNode: 'B', shortcutFound: 'A->B->C = 5 (was 10)', 'dist[C]': 5, 'dist[D]': 10 }
      },
      {
        stepNumber: 3,
        title: 'Pop "C" (dist=5): Relax C->D (5 + 1 = 6 < 10) -> Optimal Path A->B->C->D = 6!',
        intuitionExplanation: 'Next we pop `(5, C)`. From `C`, edge `C -> D` has weight `1`, improving `dist[D]` from `10` down to `5 + 1 = 6`! Even though `A -> B -> C -> D` takes 3 hops, its total weight `2 + 3 + 1 = 6` beats every 1-hop and 2-hop alternative!',
        internalsExplanation: 'Edge `(C,D,1)` relaxes `dist[D]` from `10` to `6`. Subsequent stale heap entries `(10, C)` and `(10, D)` are skipped via `if (d > dist[u]) continue`.',
        codeLines: { typescript: [8, 10, 11, 12, 17], python: [8, 9, 10, 11, 12, 14], cpp: [7, 8, 9, 10, 14] },
        timeDelta: 'Total: O((V+E) log V)',
        spaceDelta: 'Optimal Tree Found',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 18, y: 50, state: 'shortest-path', distance: 0 },
            { id: 'B', label: 'B', x: 50, y: 20, state: 'shortest-path', distance: 2 },
            { id: 'C', label: 'C', x: 50, y: 80, state: 'shortest-path', distance: 5 },
            { id: 'D', label: 'D', x: 84, y: 50, state: 'shortest-path', distance: 6 }
          ],
          edges: [
            { from: 'A', to: 'B', weight: 2, directed: true, state: 'relaxed' },
            { from: 'A', to: 'C', weight: 10, directed: true, state: 'discarded' },
            { from: 'B', to: 'C', weight: 3, directed: true, state: 'relaxed' },
            { from: 'B', to: 'D', weight: 8, directed: true, state: 'discarded' },
            { from: 'C', to: 'D', weight: 1, directed: true, state: 'relaxed' }
          ],
          queueOrStack: { label: 'Shortest Distances Locked', items: ['A: 0', 'B: 2 (A->B)', 'C: 5 (A->B->C)', 'D: 6 (A->B->C->D)'] }
        },
        callStack: [{ funcName: 'dijkstra', args: 'src="A"', locals: { finalDist: '{A:0, B:2, C:5, D:6}' }, status: 'returning' }],
        heap: [{ address: '0xDJ00', type: 'DistMap', label: 'dist', value: '{ A: 0, B: 2, C: 5, D: 6 }', highlight: true }],
        variables: { optimalPathToD: 'A -> B -> C -> D (cost 6)', 'dist[D]': 6 }
      }
    ]
  },
  {
    id: 'topological-sort-kahn',
    title: "Topological Sorting (Kahn's Indegree Algorithm & Dependency Resolution)",
    shortTitle: 'Topological Sort',
    category: 'graphs-advanced-trees',
    difficulty: 'Intermediate',
    summary: 'Resolve build dependencies and course prerequisites in a Directed Acyclic Graph (DAG) by peeling off 0-indegree nodes.',
    intuitionOverview: 'How does `npm`, `webpack`, or `cargo` know which package to compile first? Every package with `0` prerequisites (`indegree === 0`) can be built immediately! Once it finishes, we cross it off as a prerequisite for its dependents—unlocking the next wave of `indegree === 0` tasks.',
    internalsOverview: 'Kahn’s Algorithm computes `indegree[v]` for all vertices in `O(V + E)`, enqueues all `v` with `indegree[v] == 0`, and repeatedly dequeues `u`, decrements `indegree[v]` for each outgoing edge `u -> v`, and enqueues `v` when `indegree[v]` reaches `0`. If `order.length < V`, the graph contains a cycle (circular dependency)!',
    realWorldUseCases: [
      'Build systems (Webpack, Vite, Bazel, Make) and CI/CD pipeline task scheduling',
      'University course prerequisite validation & spreadsheet formula evaluation order',
      'Detecting circular dependency deadlocks (`order.length < numNodes`)'
    ],
    keyInvariants: [
      'Zero-Indegree Readiness: A node enters the queue if and only if all of its incoming dependencies have already been output.',
      'Cycle Detection: A valid topological order exists if and only if the directed graph is acyclic (a DAG).'
    ],
    complexity: {
      timeBest: 'O(V + E)',
      timeAverage: 'O(V + E)',
      timeWorst: 'O(V + E)',
      space: 'O(V) Indegree + Queue',
      note: 'Linear in the number of tasks (V) and dependency links (E).'
    },
    code: {
      typescript: `function topoSortKahn(adj: Record<string, string[]>, indegree: Record<string, number>): string[] {
  const queue: string[] = [];
  for (const [node, deg] of Object.entries(indegree)) {
    if (deg === 0) queue.push(node); // Start with 0-prerequisite nodes
  }
  const order: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    for (const v of adj[u]) {
      indegree[v]--; // Unlock dependent v
      if (indegree[v] === 0) queue.push(v);
    }
  }
  return order;
}`,
      python: `from collections import deque

def topo_sort_kahn(adj: dict[str, list[str]], indegree: dict[str, int]) -> list[str]:
    queue = deque([u for u, deg in indegree.items() if deg == 0])
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)
    return order`,
      cpp: `vector<string> topoSortKahn(unordered_map<string, vector<string>>& adj,
                            unordered_map<string, int>& indegree) {
    queue<string> q;
    for (auto& [u, deg] : indegree) if (deg == 0) q.push(u);
    vector<string> order;
    while (!q.empty()) {
        string u = q.front(); q.pop();
        order.push_back(u);
        for (auto& v : adj[u]) {
            if (--indegree[v] == 0) q.push(v);
        }
    }
    return order;
}`
    },
    liveSandboxCode: `// Build dependency DAG: Auth & DB must build before API, which builds before UI
const adj = {
  DB: ["API"],
  Auth: ["API", "UI"],
  API: ["UI"],
  UI: []
};
const indegree = { DB: 0, Auth: 0, API: 2, UI: 2 };

const queue = Object.keys(indegree).filter(k => indegree[k] === 0);
const order = [];
while (queue.length > 0) {
  const u = queue.shift();
  order.push(u);
  for (const v of adj[u]) {
    indegree[v]--;
    console.log(\`Built \${u} -> decremented indegree[\${v}] to \${indegree[v]}\`);
    if (indegree[v] === 0) queue.push(v);
  }
}
console.log("Valid Topological Build Order:", order.join(" -> "));`,
    steps: [
      {
        stepNumber: 1,
        title: 'Compute Indegrees & Enqueue 0-Indegree Roots ("DB", "Auth")',
        intuitionExplanation: '`DB` and `Auth` have `0` incoming arrows (`indegree = 0`), meaning they don’t depend on anything! `API` needs both `DB` and `Auth` (`indegree = 2`), and `UI` needs `Auth` and `API` (`indegree = 2`). So `DB` and `Auth` enter the Ready Queue first.',
        internalsExplanation: 'Initial indegrees: `{ DB: 0, Auth: 0, API: 2, UI: 2 }`. Queue initialized with `["DB", "Auth"]`.',
        codeLines: { typescript: [2, 3, 4], python: [4], cpp: [4] },
        timeDelta: 'O(V + E)',
        spaceDelta: 'Queue: [DB, Auth]',
        graph: {
          nodes: [
            { id: 'DB', label: 'DB', x: 22, y: 25, state: 'queued', distance: 'in:0' },
            { id: 'Auth', label: 'Auth', x: 22, y: 75, state: 'queued', distance: 'in:0' },
            { id: 'API', label: 'API', x: 56, y: 35, state: 'default', distance: 'in:2' },
            { id: 'UI', label: 'UI', x: 84, y: 65, state: 'default', distance: 'in:2' }
          ],
          edges: [
            { from: 'DB', to: 'API', directed: true, state: 'default' },
            { from: 'Auth', to: 'API', directed: true, state: 'default' },
            { from: 'Auth', to: 'UI', directed: true, state: 'default' },
            { from: 'API', to: 'UI', directed: true, state: 'default' }
          ],
          queueOrStack: { label: 'Ready Queue (indegree = 0)', items: ['DB', 'Auth'] }
        },
        callStack: [{ funcName: 'topoSortKahn', args: 'adj, indegree', locals: { queue: '[DB, Auth]', order: '[]' }, status: 'active' }],
        heap: [{ address: '0xTP00', type: 'Map', label: 'indegree', value: '{ DB: 0, Auth: 0, API: 2, UI: 2 }', highlight: true }],
        variables: { readyQueue: '[DB, Auth]', 'indegree[API]': 2, 'indegree[UI]': 2 }
      },
      {
        stepNumber: 2,
        title: 'Pop "DB" & "Auth": Decrement Dependents -> "API" Hits Indegree 0!',
        intuitionExplanation: 'We build `DB` and `Auth`. Removing their outgoing arrows drops `API`’s indegree from `2 -> 1 -> 0`! Now `API` has all its prerequisites satisfied and enters the Ready Queue. `UI` drops from `2 -> 1` (still waiting on `API`).',
        internalsExplanation: 'Dequeue `DB` (`indegree[API]` becomes 1). Dequeue `Auth` (`indegree[API]` becomes 0 -> enqueue `API`; `indegree[UI]` becomes 1).',
        codeLines: { typescript: [8, 9, 10, 11, 12], python: [7, 8, 9, 10, 11, 12], cpp: [7, 8, 9, 10] },
        timeDelta: '+3 edges',
        spaceDelta: 'Queue: [API]',
        graph: {
          nodes: [
            { id: 'DB', label: 'DB', x: 22, y: 25, state: 'visited', distance: 'done' },
            { id: 'Auth', label: 'Auth', x: 22, y: 75, state: 'visited', distance: 'done' },
            { id: 'API', label: 'API', x: 56, y: 35, state: 'queued', distance: 'in:0!' },
            { id: 'UI', label: 'UI', x: 84, y: 65, state: 'default', distance: 'in:1' }
          ],
          edges: [
            { from: 'DB', to: 'API', directed: true, state: 'relaxed' },
            { from: 'Auth', to: 'API', directed: true, state: 'relaxed' },
            { from: 'Auth', to: 'UI', directed: true, state: 'relaxed' },
            { from: 'API', to: 'UI', directed: true, state: 'active' }
          ],
          queueOrStack: { label: 'Ready Queue (indegree = 0)', items: ['API'] }
        },
        callStack: [{ funcName: 'topoSortKahn', args: 'adj, indegree', locals: { order: '[DB, Auth]', unlocked: 'API' }, status: 'active' }],
        heap: [{ address: '0xTP00', type: 'Map', label: 'indegree', value: '{ DB: 0, Auth: 0, API: 0, UI: 1 }', highlight: true }],
        variables: { completed: 'DB, Auth', newlyUnlocked: 'API', 'indegree[UI]': 1 }
      },
      {
        stepNumber: 3,
        title: 'Pop "API" -> Unlocks "UI" -> Complete Topological Order!',
        intuitionExplanation: 'Building `API` decrements `UI`’s indegree from `1` to `0`. `UI` is dequeued last, producing the valid build order: `DB -> Auth -> API -> UI`. Since all 4 nodes were output (`4 === V`), there are zero circular dependencies!',
        internalsExplanation: 'Dequeue `API` -> `indegree[UI]` becomes 0 -> enqueue & dequeue `UI`. `order.length === 4 === V` confirms DAG validity.',
        codeLines: { typescript: [8, 9, 11, 12, 15], python: [7, 8, 10, 11, 13], cpp: [7, 8, 10, 13] },
        timeDelta: 'Total: O(V + E)',
        spaceDelta: '4/4 Resolved',
        graph: {
          nodes: [
            { id: 'DB', label: 'DB', x: 22, y: 25, state: 'shortest-path', distance: '#1' },
            { id: 'Auth', label: 'Auth', x: 22, y: 75, state: 'shortest-path', distance: '#2' },
            { id: 'API', label: 'API', x: 56, y: 35, state: 'shortest-path', distance: '#3' },
            { id: 'UI', label: 'UI', x: 84, y: 65, state: 'shortest-path', distance: '#4' }
          ],
          edges: [
            { from: 'DB', to: 'API', directed: true, state: 'relaxed' },
            { from: 'Auth', to: 'API', directed: true, state: 'relaxed' },
            { from: 'Auth', to: 'UI', directed: true, state: 'relaxed' },
            { from: 'API', to: 'UI', directed: true, state: 'relaxed' }
          ],
          queueOrStack: { label: 'Topological Order', items: ['1. DB', '2. Auth', '3. API', '4. UI'] }
        },
        callStack: [{ funcName: 'topoSortKahn', args: 'adj, indegree', locals: { order: '[DB, Auth, API, UI]' }, status: 'returning' }],
        heap: [{ address: '0xTP00', type: 'Array', label: 'order', value: '["DB", "Auth", "API", "UI"]', highlight: true }],
        variables: { topologicalOrder: 'DB -> Auth -> API -> UI', hasCycle: false }
      }
    ]
  },
  {
    id: 'union-find-mst-kruskal',
    title: 'Disjoint Set Union (Union-Find) & Minimum Spanning Trees (Kruskal)',
    shortTitle: 'Union-Find & MST',
    category: 'graphs-advanced-trees',
    difficulty: 'Advanced',
    summary: 'See how Path Compression and Union by Rank merge connected components and build a Minimum Spanning Tree in near-constant O(α(V)) time.',
    intuitionOverview: 'Imagine islands that want to build bridges to connect everyone at the lowest cost. How do we quickly check if two islands are ALREADY connected so we don’t waste money building a redundant cycle bridge? Disjoint Set Union (Union-Find) gives each connected group a single "boss" (root parent) and flattens trees via Path Compression so checking connectivity is practically instantaneous!',
    internalsOverview: '`find(x)` recursively sets `parent[x] = find(parent[x])` (Path Compression), while `union(a, b)` attaches the shorter root under the taller root (Union by Rank). Together, `M` operations on `V` elements run in `O(M * α(V))`, where the Inverse Ackermann function `α(V) <= 4` for all practical inputs.',
    realWorldUseCases: [
      'Kruskal’s Minimum Spanning Tree (laying fiber-optic cables at minimum total cost)',
      'Dynamic network connectivity, cycle detection in undirected graphs, and percolation',
      'Image segmentation and connected component labeling'
    ],
    keyInvariants: [
      'Representative Root: `parent[r] === r` uniquely identifies the root representative of a component.',
      'Cycle Detection: Adding an undirected edge `(u, v)` creates a cycle if and only if `find(u) === find(v)`.'
    ],
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(α(V)) ≈ O(1) Union/Find',
      timeWorst: 'O(E log E) Kruskal MST',
      space: 'O(V) Parent & Rank Arrays',
      note: 'α(V) is the Inverse Ackermann function, which is <= 4 even if V = 10^80.'
    },
    code: {
      typescript: `class UnionFind {
  parent: number[];
  rank: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }
  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path Compression!
    }
    return this.parent[x];
  }
  union(a: number, b: number): boolean {
    const rootA = this.find(a), rootB = this.find(b);
    if (rootA === rootB) return false; // Already connected (Cycle!)
    if (this.rank[rootA] < this.rank[rootB]) this.parent[rootA] = rootB;
    else if (this.rank[rootA] > this.rank[rootB]) this.parent[rootB] = rootA;
    else { this.parent[rootB] = rootA; this.rank[rootA]++; }
    return true;
  }
}`,
      python: `class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path Compression!
        return self.parent[x]

    def union(self, a: int, b: int) -> bool:
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False  # Cycle detected!
        if self.rank[ra] < self.rank[rb]:
            self.parent[ra] = rb
        elif self.rank[ra] > self.rank[rb]:
            self.parent[rb] = ra
        else:
            self.parent[rb] = ra
            self.rank[ra] += 1
        return True`,
      cpp: `struct UnionFind {
    vector<int> parent, rank;
    UnionFind(int n) : parent(n), rank(n, 0) { iota(parent.begin(), parent.end(), 0); }
    int find(int x) {
        return parent[x] == x ? x : parent[x] = find(parent[x]); // Path Compression
    }
    bool unite(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false; // Cycle!
        if (rank[ra] < rank[rb]) swap(ra, rb);
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
        return true;
    }
};`
    },
    liveSandboxCode: `// Kruskal's MST using Union-Find on weighted edges
const edges = [
  { u: 0, v: 1, w: 1 },
  { u: 1, v: 2, w: 2 },
  { u: 0, v: 2, w: 4 }, // Forms cycle 0-1-2!
  { u: 2, v: 3, w: 3 }
].sort((a, b) => a.w - b.w);

const parent = [0, 1, 2, 3];
const find = x => (parent[x] === x ? x : (parent[x] = find(parent[x])));

let mstCost = 0;
for (const e of edges) {
  const ra = find(e.u), rb = find(e.v);
  if (ra !== rb) {
    parent[rb] = ra;
    mstCost += e.w;
    console.log(\`Accept Edge (\${e.u}-\${e.v}, w=\${e.w}) -> parent array: [\${parent}]\`);
  } else {
    console.log(\`Reject Edge (\${e.u}-\${e.v}, w=\${e.w}) -> CYCLE DETECTED (root=\${ra})!\`);
  }
}
console.log("Total Minimum Spanning Tree Cost:", mstCost);`,
    steps: [
      {
        stepNumber: 1,
        title: 'Unite Cheapest Edges (0-1, w=1) and (1-2, w=2)',
        intuitionExplanation: 'We sort edges by weight. First we pick `(0, 1, w=1)` and `(1, 2, w=2)`. Because their roots differ, `union` merges `{0, 1, 2}` into a single component with root `0`, and Path Compression points both `1` and `2` directly to `0`!',
        internalsExplanation: '`union(0, 1)` sets `parent[1] = 0`. `union(1, 2)` finds `find(1) = 0` and sets `parent[2] = 0`. `parent[]` is now `[0, 0, 0, 3]`.',
        codeLines: { typescript: [8, 9, 10, 14, 15, 19], python: [6, 7, 8, 11, 12, 19], cpp: [4, 5, 7, 8, 11] },
        timeDelta: '2 O(α(V)) unions',
        spaceDelta: 'parent: [0, 0, 0, 3]',
        array: [
          { index: 0, value: 0, state: 'found', subLabel: 'Root of {0,1,2}' },
          { index: 1, value: 0, state: 'active', subLabel: 'parent[1]=0' },
          { index: 2, value: 0, state: 'active', subLabel: 'parent[2]=0' },
          { index: 3, value: 3, state: 'default', subLabel: 'Isolated Root' }
        ],
        graph: {
          nodes: [
            { id: '0', label: '0', x: 20, y: 25, state: 'visited', distance: 'root:0' },
            { id: '1', label: '1', x: 55, y: 25, state: 'visited', distance: 'root:0' },
            { id: '2', label: '2', x: 40, y: 75, state: 'visited', distance: 'root:0' },
            { id: '3', label: '3', x: 82, y: 75, state: 'default', distance: 'root:3' }
          ],
          edges: [
            { from: '0', to: '1', weight: 1, state: 'mst' },
            { from: '1', to: '2', weight: 2, state: 'mst' },
            { from: '0', to: '2', weight: 4, state: 'default' },
            { from: '2', to: '3', weight: 3, state: 'default' }
          ]
        },
        callStack: [{ funcName: 'UnionFind.union', args: 'a=1, b=2', locals: { rootA: 0, rootB: 2, merged: true }, status: 'active' }],
        heap: [{ address: '0xUF00', type: 'Int32[4]', label: 'parent', value: '[0, 0, 0, 3]', highlight: true }],
        variables: { mstWeight: 3, componentsCount: 2, 'find(2)': 0 }
      },
      {
        stepNumber: 2,
        title: 'Accept Edge (2-3, w=3) & Reject Cycle Edge (0-2, w=4)!',
        intuitionExplanation: 'Next cheapest edge is `(2, 3, w=3)`. Since `find(2) = 0` and `find(3) = 3`, they are in different sets—so we merge `3` under root `0`! Then we inspect `(0, 2, w=4)`: `find(0) === find(2) === 0`! Union-Find instantly detects a cycle and rejects it!',
        internalsExplanation: '`union(2, 3)` sets `parent[3] = 0` (`mstCost = 6`). Next, `union(0, 2)` sees `rootA == rootB == 0` and returns `false` in O(1) time.',
        codeLines: { typescript: [15, 16], python: [12, 13, 14], cpp: [8, 9] },
        timeDelta: 'Total: O(E log E)',
        spaceDelta: '1 Connected Component',
        array: [
          { index: 0, value: 0, state: 'found', subLabel: 'Global Root' },
          { index: 1, value: 0, state: 'sorted', subLabel: '-> Root 0' },
          { index: 2, value: 0, state: 'sorted', subLabel: '-> Root 0' },
          { index: 3, value: 0, state: 'found', subLabel: 'Compressed -> 0' }
        ],
        graph: {
          nodes: [
            { id: '0', label: '0', x: 20, y: 25, state: 'shortest-path', distance: 'root:0' },
            { id: '1', label: '1', x: 55, y: 25, state: 'shortest-path', distance: 'root:0' },
            { id: '2', label: '2', x: 40, y: 75, state: 'shortest-path', distance: 'root:0' },
            { id: '3', label: '3', x: 82, y: 75, state: 'shortest-path', distance: 'root:0' }
          ],
          edges: [
            { from: '0', to: '1', weight: 1, state: 'mst' },
            { from: '1', to: '2', weight: 2, state: 'mst' },
            { from: '2', to: '3', weight: 3, state: 'mst' },
            { from: '0', to: '2', weight: 4, state: 'discarded' }
          ]
        },
        callStack: [{ funcName: 'UnionFind.union', args: 'a=0, b=2', locals: { rootA: 0, rootB: 0, cycleDetected: true }, status: 'returning' }],
        heap: [{ address: '0xUF00', type: 'Int32[4]', label: 'parent', value: '[0, 0, 0, 0] (Fully Compressed)', highlight: true }],
        variables: { mstTotalWeight: 6, rejectedCycleEdge: '(0-2, w=4)', componentsCount: 1 }
      }
    ]
  },
  {
    id: 'segment-fenwick-trees',
    title: 'Segment Trees & Fenwick Trees (Binary Indexed Trees): O(log n) Range Queries & Updates',
    shortTitle: 'Segment & Fenwick Trees',
    category: 'graphs-advanced-trees',
    difficulty: 'Advanced',
    summary: 'Understand why Prefix Sums fail on frequent array mutations, and how a Segment Tree answers Range Sums AND Point Updates in O(log n) both.',
    intuitionOverview: 'A normal array updates a cell in O(1) but takes O(n) to sum a range. A Prefix Sum array sums a range in O(1) but takes O(n) to update! A Segment Tree splits the difference: each parent node caches the sum of a sub-interval (`[L..R]`). Updating 1 number only touches its `O(log n)` ancestors, and any range query combines at most `O(log n)` pre-summed blocks!',
    internalsOverview: 'Stored as a `4n` flat array (`tree[1]` is root `[0..n-1]`, left child `2*node`, right child `2*node + 1`). A Fenwick Tree (BIT) achieves the same `O(log n)` prefix sum and point update in just `1n` space by indexing intervals via lowest set bit `i & -i`.',
    realWorldUseCases: [
      'Real-time analytics dashboards with live streaming updates & arbitrary time-window aggregations',
      'Order book depth volume aggregation in financial exchanges',
      'Computational geometry range counting and competitive programming interval queries'
    ],
    keyInvariants: [
      'Parent Aggregation Invariant: `tree[node] = tree[2 * node] + tree[2 * node + 1]`.',
      'Decomposition Bound: Any query interval `[qL, qR]` decomposes into at most `2 * log₂(n)` disjoint canonical tree nodes.'
    ],
    complexity: {
      timeBest: 'O(1) Full Root Hit',
      timeAverage: 'O(log n) Query & Update',
      timeWorst: 'O(log n)',
      space: 'O(n) (4n Segment / 1n Fenwick)',
      note: 'Both range queries and point/lazy updates run in O(log n) time.'
    },
    code: {
      typescript: `function querySegTree(tree: number[], node: number, l: number, r: number, ql: number, qr: number): number {
  if (ql > r || qr < l) return 0;          // 1. Disjoint interval: contribute 0
  if (ql <= l && r <= qr) return tree[node]; // 2. Fully covered: return cached sum!
  const mid = (l + r) >> 1;
  return (
    querySegTree(tree, node * 2, l, mid, ql, qr) +
    querySegTree(tree, node * 2 + 1, mid + 1, r, ql, qr)
  );
}`,
      python: `def query_seg_tree(tree: list[int], node: int, l: int, r: int, ql: int, qr: int) -> int:
    if ql > r or qr < l:
        return 0  # 1. Disjoint interval
    if ql <= l and r <= qr:
        return tree[node]  # 2. Fully covered: return cached sum!
    mid = (l + r) // 2
    return (
        query_seg_tree(tree, node * 2, l, mid, ql, qr) +
        query_seg_tree(tree, node * 2 + 1, mid + 1, r, ql, qr)
    )`,
      cpp: `int querySegTree(const vector<int>& tree, int node, int l, int r, int ql, int qr) {
    if (ql > r || qr < l) return 0;          // Disjoint
    if (ql <= l && r <= qr) return tree[node]; // Canonical hit
    int mid = (l + r) / 2;
    return querySegTree(tree, node*2, l, mid, ql, qr)
         + querySegTree(tree, node*2+1, mid+1, r, ql, qr);
}`
    },
    liveSandboxCode: `// Build a Segment Tree over [2, 5, 1, 4] and run O(log n) range query + update!
const nums = [2, 5, 1, 4];
const tree = new Array(16).fill(0);

function build(node, l, r) {
  if (l === r) { tree[node] = nums[l]; return; }
  const mid = (l + r) >> 1;
  build(node * 2, l, mid);
  build(node * 2 + 1, mid + 1, r);
  tree[node] = tree[node * 2] + tree[node * 2 + 1];
}

function query(node, l, r, ql, qr) {
  if (ql > r || qr < l) return 0;
  if (ql <= l && r <= qr) return tree[node];
  const mid = (l + r) >> 1;
  return query(node * 2, l, mid, ql, qr) + query(node * 2 + 1, mid + 1, r, ql, qr);
}

build(1, 0, 3);
console.log("Root [0..3] sum:", tree[1]);
console.log("Range Sum Query [1..3] (5 + 1 + 4):", query(1, 0, 3, 1, 3));`,
    steps: [
      {
        stepNumber: 1,
        title: 'Segment Tree Built Over nums = [2, 5, 1, 4]',
        intuitionExplanation: 'Our base array `[2, 5, 1, 4]` sits at the leaves. Internal nodes store range sums: `[0..1] = 2 + 5 = 7`, `[2..3] = 1 + 4 = 5`, and the Root `[0..3] = 7 + 5 = 12`. Now let’s query the range sum `query([1..3])`!',
        internalsExplanation: '1-indexed `tree` array holds `[_, 12, 7, 5, 2, 5, 1, 4]`. Query `ql=1, qr=3` starts at root `node=1 ([0..3])`.',
        codeLines: { typescript: [1, 4, 5], python: [1, 6, 7], cpp: [1, 4, 5] },
        timeDelta: 'O(1) root start',
        spaceDelta: 'Tree size: 4n',
        tree: [
          { id: 's1', val: '12 [0..3]', x: 50, y: 15, leftId: 's2', rightId: 's3', state: 'active', badge: 'Split [1..3]' },
          { id: 's2', val: '7 [0..1]', x: 25, y: 48, leftId: 's4', rightId: 's5', state: 'default' },
          { id: 's3', val: '5 [2..3]', x: 75, y: 48, leftId: 's6', rightId: 's7', state: 'default' },
          { id: 's4', val: '2 [0]', x: 12, y: 82, state: 'default' },
          { id: 's5', val: '5 [1]', x: 36, y: 82, state: 'default' },
          { id: 's6', val: '1 [2]', x: 64, y: 82, state: 'default' },
          { id: 's7', val: '4 [3]', x: 88, y: 82, state: 'default' }
        ],
        callStack: [{ funcName: 'querySegTree', args: 'node=1 [0..3], q=[1..3]', locals: { mid: 1 }, status: 'active' }],
        heap: [{ address: '0xSG00', type: 'Int32[8]', label: 'tree', value: '[_, 12, 7, 5, 2, 5, 1, 4]', highlight: true }],
        variables: { queryRange: '[1..3]', currentNodeRange: '[0..3]', action: 'Partial overlap -> split' }
      },
      {
        stepNumber: 2,
        title: 'Combine Canonical Nodes [1..1] (=5) + [2..3] (=5) = 10 in O(log n)!',
        intuitionExplanation: 'Look at the right child `[2..3]`: it is COMPLETELY inside our query `[1..3]`, so we grab its cached sum `5` immediately without visiting leaves `[2]` and `[3]`! On the left `[0..1]`, we skip `[0]` (outside range) and grab `[1] = 5`. Total: `5 + 5 = 10`!',
        internalsExplanation: 'Node `s3 ([2..3])` satisfies `ql <= l && r <= qr` (`1 <= 2 && 3 <= 3`), returning `5` in O(1). Left branch returns `tree[5] = 5`. Total sum `10`.',
        codeLines: { typescript: [2, 3, 6, 7], python: [2, 3, 4, 5, 8], cpp: [2, 3, 5, 6] },
        timeDelta: 'O(log n) canonical hits',
        spaceDelta: 'Stack depth: 3',
        tree: [
          { id: 's1', val: '12 [0..3]', x: 50, y: 15, leftId: 's2', rightId: 's3', state: 'visited', badge: '5 + 5 = 10' },
          { id: 's2', val: '7 [0..1]', x: 25, y: 48, leftId: 's4', rightId: 's5', state: 'path' },
          { id: 's3', val: '5 [2..3]', x: 75, y: 48, leftId: 's6', rightId: 's7', state: 'found', badge: 'Full Hit! (+5)' },
          { id: 's4', val: '2 [0]', x: 12, y: 82, state: 'default', badge: 'Out (+0)' },
          { id: 's5', val: '5 [1]', x: 36, y: 82, state: 'found', badge: 'Full Hit! (+5)' },
          { id: 's6', val: '1 [2]', x: 64, y: 82, state: 'default', badge: 'Skipped!' },
          { id: 's7', val: '4 [3]', x: 88, y: 82, state: 'default', badge: 'Skipped!' }
        ],
        callStack: [{ funcName: 'querySegTree', args: 'q=[1..3]', locals: { leftRes: 5, rightRes: 5, total: 10 }, status: 'returning' }],
        heap: [{ address: '0xSG00', type: 'Int32[8]', label: 'tree', value: 'Canonical nodes hit: s5(5) + s3(5) = 10', highlight: true }],
        variables: { queryRange: '[1..3]', canonicalNodesUsed: '[1..1] + [2..3]', answer: 10 }
      }
    ]
  }
];
