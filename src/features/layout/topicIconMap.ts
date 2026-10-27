import React from 'react';
import {
  Grid,
  Type,
  Link2,
  Layers,
  Hash,
  GitFork,
  GitBranch,
  Triangle,
  Share2,
  Network,
  ArrowUpDown,
  Search,
  MoveHorizontal,
  Maximize2,
  Sigma,
  SearchCode,
  Undo2,
  Zap,
  Table,
  Split,
  Binary,
  Compass,
  Route,
  GitMerge,
  ListOrdered,
  Combine,
  BarChart2,
  Calendar,
  Clock,
  Sparkles,
  Server,
  Cpu,
  Code2,
  Database,
  Globe,
  FolderGit2,
  ShieldCheck
} from 'lucide-react';
import { PillarId } from '@/types/codeflow';

export const TOPIC_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Grid,
  Type,
  Link: Link2,
  Layers,
  Hash,
  GitFork,
  GitBranch,
  Triangle,
  Share2,
  Network,
  ArrowUpDown,
  Search,
  MoveHorizontal,
  Maximize2,
  Sigma,
  SearchCode,
  Undo2,
  Zap,
  Table,
  Split,
  Binary,
  Compass,
  Route,
  GitMerge,
  ListOrdered,
  Combine,
  BarChart2,
  Calendar,
  Clock,
  Sparkles,
  Globe,
  Database,
  FolderGit2,
  Code2,
  ShieldCheck,
  Server,
  Cpu
};

export const PILLARS: {
  id: PillarId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'DSA', label: 'DSA (Structured Path)', icon: Share2 },
  { id: 'Backend', label: 'Backend', icon: Server },
  { id: 'System Design', label: 'System Design', icon: Cpu },
  { id: 'Web Dev', label: 'Web Dev', icon: Code2 }
];
