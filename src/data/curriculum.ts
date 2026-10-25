import { CategoryId, TopicDefinition } from '../types/visualizer';
import { foundationsAndLinearTopics } from './topics/foundationsAndLinear';
import { hashingTreesHeapsTopics } from './topics/hashingTreesHeaps';
import { graphsAndAdvancedTreesTopics } from './topics/graphsAndAdvancedTrees';
import { sortingPatternsDpTopics } from './topics/sortingPatternsDp';
import { backendArchitectureTopics } from './topics/backendArchitecture';

export interface CategoryMeta {
  id: CategoryId;
  title: string;
  badge: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'foundations-memory',
    title: '1. Execution Flow, Memory & Big O',
    badge: 'Foundations',
    description: 'Call Stack frames, Heap pointers, Recursion unwinding, and Time/Space Complexity.'
  },
  {
    id: 'linear-ds',
    title: '2. Linear Data Structures',
    badge: 'Arrays • Lists • Stacks',
    description: 'Contiguous Arrays, Dynamic Resizing, Linked List pointers, Stacks, Queues & Monotonic Deques.'
  },
  {
    id: 'hashing-trees-heaps',
    title: '3. Hash Tables, Trees, Heaps & Tries',
    badge: 'Non-Linear DS',
    description: 'Hash functions & collision chains, Binary Search Trees, Priority Queue Heaps, and Prefix Tries.'
  },
  {
    id: 'graphs-advanced-trees',
    title: '4. Graphs & Advanced Trees',
    badge: 'BFS • Dijkstra • SegTree',
    description: 'BFS/DFS, Dijkstra Shortest Path, Topological Sort, Union-Find MST, Segment & Fenwick Trees.'
  },
  {
    id: 'sorting-searching',
    title: '5. Sorting & Searching Algorithms',
    badge: 'O(n log n) & O(log n)',
    description: 'QuickSort partitioning, MergeSort divide & conquer, and Binary Search halving.'
  },
  {
    id: 'algorithmic-patterns',
    title: '6. Problem-Solving Patterns & Bitwise',
    badge: 'Patterns',
    description: 'Two Pointers, Sliding Window, Prefix Sums, Interval Merging, and Bit Manipulation.'
  },
  {
    id: 'dp-greedy-backtracking',
    title: '7. DP, Greedy & Backtracking',
    badge: 'Optimization',
    description: '2D Dynamic Programming Tabulation, Memoization, Greedy choices, and Backtracking pruning.'
  },
  {
    id: 'backend-architecture',
    title: '8. Backend Systems, APIs & Databases',
    badge: 'Backend Visuals',
    description: 'HTTP Request/Response packets, Express Middleware, JWT Auth, Redis Caching & PostgreSQL B-Trees.'
  }
];

export const ALL_TOPICS: TopicDefinition[] = [
  ...foundationsAndLinearTopics,
  ...hashingTreesHeapsTopics,
  ...graphsAndAdvancedTreesTopics,
  ...sortingPatternsDpTopics,
  ...backendArchitectureTopics
];
