# CodeFlow `src/` architecture

Imports use the `@/` alias (`@/foo` → `src/foo`), configured in `vite.config.ts` and `tsconfig.app.json`.

```
src/
├── main.tsx                 Entry point (mounts <App />)
├── index.css                Tailwind layers + global styles
├── app/
│   └── App.tsx              Composition root: owns page state, wires features together
├── features/                One folder per product feature (UI + feature-specific logic)
│   ├── layout/              TopNavbar, LeftSidebar
│   ├── editor/              CodeEditorCard (syntax-highlighted editor)
│   ├── visualizer/          ExecutionVisualizerCard (step-by-step trace view)
│   ├── problems/            BottomWorkspace (problem list + question details)
│   └── account/             AccountMenu, useAccount (profile, preferences, login/logout)
├── hooks/                   Reusable, feature-agnostic React hooks (useLocalStorage)
├── lib/                     Pure logic with no React (liveCodeVisualizer, problemHelpers)
├── data/                    Static content
│   ├── problemsData.ts      Topic ordering + practice problem bank (public data API)
│   └── topics/              Per-pillar topic definitions consumed by problemsData
├── types/                   Shared TypeScript types (codeflow.ts)
└── legacy/                  Earlier prototype code that is NOT imported by the app
```

## Data / code flow

`data/*` → `app/App.tsx` (state) → `features/*` (props) ; `lib/*` is called from `App.tsx` to execute and
visualize code; `hooks/*` persist state to `localStorage`.

## Conventions

- Features never import from each other's internals; share via `types/`, `lib/`, `hooks/` or props from `App`.
- Put new static content in `data/`, new pure helpers in `lib/`, new UI in the relevant `features/<name>/`.
- `legacy/` is kept for reference only; delete it once nothing there is needed.
