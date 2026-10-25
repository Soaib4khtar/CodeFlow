export type PillarId = 'DSA' | 'Backend' | 'System Design' | 'Web Dev';

export type CodeLanguage = 'javascript' | 'typescript' | 'python' | 'cpp';

export type DifficultyBadge = 'Easy' | 'Medium' | 'Hard';

export interface VisualPointer {
  label: string;
  index: number;
  color: 'green' | 'blue' | 'purple' | 'amber' | 'rose';
}

export interface VisualBox {
  index: number;
  value: string | number;
  state?: 'default' | 'active' | 'found' | 'visited' | 'discarded' | 'window' | 'swap';
  subText?: string;
}

export interface VisualTreeNode {
  id: string;
  label: string | number;
  x: number; // 0..100
  y: number; // 0..100
  leftId?: string;
  rightId?: string;
  state?: 'default' | 'active' | 'visited' | 'found';
  note?: string;
}

export interface VisualGraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  state?: 'default' | 'active' | 'visited' | 'found';
  badge?: string;
}

export interface VisualGraphEdge {
  from: string;
  to: string;
  weight?: string | number;
  directed?: boolean;
  state?: 'default' | 'active' | 'path';
}

export interface VisualArchitectureStage {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  state: 'idle' | 'active' | 'done';
}

export interface TraceItem {
  step: number;
  text: string;
  status?: 'active' | 'completed' | 'pending';
}

export interface TopicStep {
  stepNumber: number;
  activeLine: number;
  explanation: string;
  // Visual representations
  boxes?: VisualBox[];
  pointers?: VisualPointer[];
  secondaryBoxes?: { title: string; items: VisualBox[] };
  treeNodes?: VisualTreeNode[];
  graph?: {
    nodes: VisualGraphNode[];
    edges: VisualGraphEdge[];
    auxQueue?: string[];
  };
  architecture?: {
    stages: VisualArchitectureStage[];
    packetLabel?: string;
    inspectorText?: string;
  };
  // Synchronized memory / variables for Explorer tab
  variables?: Record<string, string | number>;
  callStack?: string[];
  outputSummary?: string;
}

export interface AlgorithmPreset {
  id: string;
  label: string;
  steps?: TopicStep[];
}

export interface TopicData {
  id: string;
  title: string;
  pillar: PillarId;
  difficulty: DifficultyBadge;
  description: string;
  iconName: string;
  defaultStep?: number; // 1-indexed
  code: Record<CodeLanguage, string>;
  steps: TopicStep[];
  traceSummary: string;
  presets?: AlgorithmPreset[];
  timeComplexity: string;
  spaceComplexity: string;
  intuition: string;
  internals: string;
  relatedProblemIds?: string[];
}

export interface ProblemTestCase {
  label: string;
  args: unknown[];
  expected: unknown;
}

export interface PracticeProblem {
  id: string;
  number: number;
  title: string;
  difficulty: DifficultyBadge;
  topicId: string;
  description: string;
  example1: {
    input: string;
    output: string;
  };
  example2: {
    input: string;
    output: string;
  };
  functionName: string;
  starterCode: string;
  solutionCode: string;
  testCases: ProblemTestCase[];
}
