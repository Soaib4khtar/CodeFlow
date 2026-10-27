# CodeFlow — Modular Architecture & Development Guide

This document defines the folder structure, data flow, and ongoing development rules for **CodeFlow** so that junior, mid-level, and senior developers can easily navigate, understand, and extend the codebase.

---

## 1. Core Architectural & Coding Rules

1. **Modular Architecture**: Every folder and file is broken down into small, reusable components or utilities with a **single clear purpose**.
2. **Minimal & Clean Files**: Keep every UI component and helper utility short (~40–220 lines), readable, and free of unnecessary complexity.
3. **Beginner/Intermediate Friendly**: Write straightforward, self-explanatory TypeScript and React code. Avoid overly clever abstractions so any developer can trace the flow from top to bottom.
4. **Consistent Future Updates**: All upcoming features, changes, and bug fixes must follow this exact domain-driven structure (`src/features/<domain>/`, `src/hooks/`, `src/lib/`, `src/data/`, `src/types/`).

---

## 2. Directory Structure

```text
src/
├── main.tsx                                    # Application bootstrap entry
├── index.css                                   # Global Tailwind & scrollbar styles
├── app/
│   └── App.tsx                                 # Root application state & layout composition
├── types/
│   └── codeflow.ts                             # Shared TypeScript interfaces (TopicData, PracticeProblem, TopicStep)
├── hooks/
│   ├── useLocalStorage.ts                      # Generic JSON localStorage state hook
│   └── useExecutionKeyboardShortcuts.ts        # Global keyboard shortcuts (←, →, Space) for trace playback
├── lib/
│   ├── cn.ts                                   # Tailwind className merger utility
│   ├── problemHelpers.ts                       # Blank starter code & pseudocode generators
│   ├── codeInstrumentor.ts                     # TypeScript stripping, variable extraction & code instrumentation
│   ├── snapshotStepBuilder.ts                  # Converts runtime variable snapshots into VisualBox[] & VisualPointer[]
│   └── liveCodeVisualizer.ts                   # Sandboxed code execution & test case evaluator
├── data/
│   ├── codeflowData.ts                         # Core DSA topic definitions & default walkthrough steps
│   ├── extendedTopicsData.ts                   # Additional structured roadmap topics (Big O -> DP)
│   └── problemsData.ts                         # Comprehensive Easy/Medium/Hard problem bank per topic
└── features/
    ├── account/                                # User Account menu, state hook & sub-panels
    │   ├── useAccount.ts                       # Account profile, authentication & editor preferences state
    │   ├── AccountMenu.tsx                     # Top-right User Account dropdown & panel router
    │   ├── AccountFieldControls.tsx            # Reusable ToggleRow, PanelHeader & FieldInput controls
    │   └── panels/
    │       ├── LoginPanel.tsx                  # Sign-in / Sign-up form panel
    │       ├── ProfilePanel.tsx                # Editable profile & avatar hue selector
    │       ├── SettingsPanel.tsx               # Default language, playback speed & auto-run settings
    │       ├── AppearancePanel.tsx             # Warm Beige Light / Amber Gold Dark theme & font size
    │       ├── PrivacyPanel.tsx                # JSON backup export/import & progress reset
    │       └── HelpPanel.tsx                   # Quick-start guide & learning resources
    ├── layout/                                 # Application shell, navigation & toolbars
    │   ├── TopNavbar.tsx                       # Main top header bar
    │   ├── GlobalSearchBar.tsx                 # Search input + autocomplete dropdown for topics & problems
    │   ├── FavouritesDropdown.tsx              # Starred topics quick-access dropdown
    │   ├── LeftSidebar.tsx                     # Independent scrolling Structured Learning Path sidebar
    │   ├── SidebarTopicItem.tsx                # Single topic button row inside LeftSidebar
    │   ├── topicIconMap.ts                     # Maps topic IDs to Lucide icons
    │   ├── TopicHeaderBar.tsx                  # Breadcrumb, topic title, difficulty badge & Mastered/Favourite buttons
    │   └── ExecutionToolbar.tsx                # Language selector, Step/Run/Reset controls, Pseudocode & Show Answer
    ├── editor/                                 # Live syntax-highlighted code editor
    │   ├── CodeEditorCard.tsx                  # Main Code editor card with synchronized line numbers
    │   ├── syntaxHighlighter.tsx               # Live tokenizer keeping syntax colors active while typing
    │   └── TestResultsStrip.tsx                # Runtime error banner & test case pass/fail verification strip
    ├── visualizer/                             # Step-by-step code flow & memory visualizer
    │   ├── ExecutionVisualizerCard.tsx         # Visualizer card container
    │   ├── ArrayBoxesStage.tsx                 # Visual array boxes & animated colored pointer arrows
    │   ├── WhyItWorksCallout.tsx               # Collapsible "Why It Works" inspector & live memory registers
    │   └── ExecutionTraceList.tsx              # Clickable step-by-step execution trace list
    └── problems/                               # Topic-filtered problem set & guided onboarding
        ├── BottomWorkspace.tsx                 # Bottom workspace container & Concept Guide toggle
        ├── ConceptPrimerBanner.tsx             # 3-column Guided Mastery Path concept primer
        ├── TopicProblemsList.tsx               # Topic question list with search & Easy/Medium/Hard filters
        └── ProblemDetailsCard.tsx              # Problem statement, underlying logic hint & input/output examples
```

---

## 3. Data & Code Flow Overview

1. **Topic & Problem Selection (`App.tsx`)**:
   - Selecting a topic in `LeftSidebar` or `GlobalSearchBar` loads the topic's default code and filters `BottomWorkspace` to display only that topic's problems.
   - Clicking any problem in `TopicProblemsList` loads a blank starter function (`getBlankStarterCode`) into `CodeEditorCard` and scrolls smoothly to the editor.
   - Clicking **Show Answer** in `ExecutionToolbar` loads `selectedProblem.solutionCode` and immediately runs and visualizes all test cases.

2. **Live Code Execution & Visualization (`src/lib/`)**:
   - When the user clicks **Run & Visualize** (or **Run**), `executeAndVisualizeCode` strips TypeScript types (`codeInstrumentor.ts`), instruments statements with `__trace` callbacks, and converts each step's variable state into `VisualBox[]` and `VisualPointer[]` (`snapshotStepBuilder.ts`).
   - Test cases are verified against `selectedProblem.testCases`, updating `TestResultsStrip` and automatically marking the problem as solved when all cases pass.
