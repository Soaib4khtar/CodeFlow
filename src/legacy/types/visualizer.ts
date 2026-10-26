export type Language = 'typescript' | 'python' | 'cpp';

export type DepthLevel = 'intuition' | 'internals';

export type CategoryId =
  | 'foundations-memory'
  | 'linear-ds'
  | 'hashing-trees-heaps'
  | 'graphs-advanced-trees'
  | 'sorting-searching'
  | 'algorithmic-patterns'
  | 'dp-greedy-backtracking'
  | 'backend-architecture'
  | 'codebase-explorer'
  | 'modern-tech-roadmap';

export interface StackFrame {
  funcName: string;
  args: string;
  returnAddr?: string;
  locals: Record<string, string | number | boolean>;
  status?: 'active' | 'waiting' | 'returning';
}

export interface HeapBlock {
  address: string;
  type: string;
  label: string;
  value: string;
  highlight?: boolean;
  refCount?: number;
}

export interface ArrayCell {
  index: number;
  value: number | string;
  state?: 'default' | 'active' | 'comparing' | 'swapped' | 'sorted' | 'window' | 'found' | 'discarded' | 'pivot' | 'visited';
  subLabel?: string;
  memoryAddr?: string;
}

export interface PointerMarker {
  name: string;
  index: number;
  color: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'purple';
}

export interface LinkedNodeVisual {
  id: string;
  addr: string;
  val: string | number;
  nextAddr: string | null;
  prevAddr?: string | null;
  state?: 'default' | 'active' | 'visited' | 'modified' | 'new';
  pointerLabel?: string;
}

export interface TreeNodeVisual {
  id: string;
  val: string | number;
  x: number; // percentage 0..100
  y: number; // percentage 0..100
  leftId?: string | null;
  rightId?: string | null;
  childrenIds?: string[];
  state?: 'default' | 'active' | 'visited' | 'found' | 'path' | 'modified';
  badge?: string;
}

export interface GraphNodeVisual {
  id: string;
  label: string;
  x: number; // percentage 0..100
  y: number; // percentage 0..100
  state?: 'default' | 'current' | 'visited' | 'queued' | 'shortest-path';
  distance?: number | string;
  parent?: string | null;
}

export interface GraphEdgeVisual {
  from: string;
  to: string;
  weight?: number;
  directed?: boolean;
  state?: 'default' | 'active' | 'relaxed' | 'mst' | 'discarded';
}

export interface HashBucketVisual {
  bucketIndex: number;
  entries: {
    key: string;
    value: string | number;
    hash: string;
    state?: 'default' | 'active' | 'collision' | 'found';
  }[];
}

export interface BackendFlowNode {
  id: string;
  title: string;
  subtitle: string;
  layer: 'client' | 'gateway' | 'middleware' | 'controller' | 'service' | 'cache' | 'database';
  state: 'idle' | 'active' | 'success' | 'error' | 'bypassed';
  payload?: string;
  latencyMs?: number;
}

export interface MatrixCell {
  row: number;
  col: number;
  value: string | number;
  state?: 'default' | 'active' | 'computed' | 'lookup' | 'optimal';
}

export interface ExecutionStep {
  stepNumber: number;
  title: string;
  intuitionExplanation: string;
  internalsExplanation: string;
  codeLines: Record<Language, number[]>;
  timeDelta?: string;
  spaceDelta?: string;
  // Visual states (a topic can combine any of these!)
  array?: ArrayCell[];
  auxiliaryArray?: { label: string; cells: ArrayCell[] };
  pointers?: PointerMarker[];
  linkedList?: LinkedNodeVisual[];
  tree?: TreeNodeVisual[];
  graph?: {
    nodes: GraphNodeVisual[];
    edges: GraphEdgeVisual[];
    queueOrStack?: { label: string; items: string[] };
  };
  hashBuckets?: HashBucketVisual[];
  matrix?: {
    rowHeaders: string[];
    colHeaders: string[];
    cells: MatrixCell[][];
  };
  backendFlow?: {
    nodes: BackendFlowNode[];
    activePacket?: { fromId: string; toId: string; label: string; status: 'req' | 'res' | 'err' };
    httpInspector?: {
      method: string;
      url: string;
      status?: number;
      headers: Record<string, string>;
      body: string;
    };
    dbQuery?: {
      sql: string;
      plan: string;
      rowsAffected: number;
    };
  };
  // Synchronized Memory & Variable Debugger
  callStack: StackFrame[];
  heap: HeapBlock[];
  variables: Record<string, string | number | boolean>;
  consoleOutput?: string[];
}

export interface TopicComplexity {
  timeBest: string;
  timeAverage: string;
  timeWorst: string;
  space: string;
  note: string;
}

export interface TopicDefinition {
  id: string;
  title: string;
  shortTitle: string;
  category: CategoryId;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Production';
  summary: string;
  intuitionOverview: string;
  internalsOverview: string;
  realWorldUseCases: string[];
  keyInvariants: string[];
  complexity: TopicComplexity;
  code: Record<Language, string>;
  liveSandboxCode: string; // Executable JS/TS code for interactive playground
  steps: ExecutionStep[];
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}
