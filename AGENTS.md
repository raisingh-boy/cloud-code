# AGENTS.md — Seamless Universe

This file is for AI coding agents (Jules, Claude Code, etc.) working on this repository.

## Project Overview

**Seamless Universe** — a living 3D knowledge graph app. Users explore 170 interconnected ideas (nodes) and 376 connections (edges) across philosophy, movement science, cognitive science, body practices, and more. Built as a mobile-first progressive web app.

**Live:** universe.seamless.club  
**Offer page:** seamless.club/offer/  

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript + Vite |
| 3D | Three.js + @react-three/fiber + @react-three/drei |
| Styling | Tailwind CSS v4 (with @tailwindcss/vite plugin) |
| Icons | Lucide React |
| Animation | motion/react (Framer Motion v11) |
| Data | Static JSON (Atlas) + localStorage (user state) |
| Auth | Google OAuth (VITE_GOOGLE_CLIENT_ID) |
| DB | Supabase (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY) |

---

## Project Structure

```
src/
├── App.tsx                    # Root component, all state, all handlers
├── types.ts                   # TypeScript interfaces (SomaticNode, SomaticLink, etc.)
├── main.tsx                   # Entry point
├── index.css                  # Global styles + Tailwind
├── components/
│   ├── MyceliumGraph.tsx      # 3D canvas + physics simulation (THE BIG ONE)
│   ├── NodeCard.tsx           # Side sheet for node details (4 tabs)
│   ├── AudioPlayer.tsx        # Audio player (mini + maximized)
│   ├── AddSenseModal.tsx      # Modal for adding nodes/connections/stories/questions
│   ├── PhilosophyOnboarding.tsx  # 3-step onboarding tour
│   └── AgendaPanel.tsx        # Questions/agenda side panel
└── data/
    ├── nodesData.ts           # Combiner + INITIAL_NODES, INITIAL_LINKS, SAMPLE_AUDIO, etc.
    ├── nodes-part1.ts         # Atlas nodes batch 1 (DO NOT EDIT without Neo approval)
    ├── nodes-part2.ts         # Atlas nodes batch 2
    ├── nodes-part3.ts         # Atlas nodes batch 3
    ├── edges-part1.ts         # Atlas edges batch 1
    ├── edges-part2.ts         # Atlas edges batch 2
    └── stories.ts             # 66 stories (currently 17, rest TBD)
```

---

## Core Concepts

### Three Worlds
- **Atlas** — curated knowledge graph (170 nodes, admin-only write)
- **Living Field** — community knowledge graph (user-generated, shared)
- **My World (Я)** — personal graph (private, orbits around central `Я` node)

### Physics Simulation
- All 3D animation runs in `useFrame` with `useRef` — **never in React state**
- `SCALE = 0.045` converts physics coordinates → WebGL coordinates
- Physics constants are tuned — do not change `gravityStrength`, `damping`, `repulsionStrength` without testing

### Node Statuses (lifecycle)
`seed` → `sprout` → `alive` → `rooted` → `atlas`
- Seed: new, low engagement (labels hidden by default)
- Atlas: curated, always shown

### Key IDs
- `central-me` — synthetic "Я" node in My World (not in data files, injected at runtime)
- Atlas nodes: semantic IDs like `soma-hanna`, `pattern-bateson`
- User nodes: `node-user-{timestamp}`
- Personal links: `lnk-me-{nodeId}-{timestamp}`

---

## Running Locally

```bash
npm install
npm run dev         # http://localhost:3000
npm run build       # production build → dist/
```

### Environment Variables (create `.env`)
```
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## Active Branch

All development: `claude/final-polish-mobile-design-9cR4h`  
PR target: `main`

---

## Task Backlog

See `JULIUS_TASKS.md` for prioritized task list with implementation details.

**Sprint 1 (Critical):**
1. Google OAuth (TASK-01)
2. All 66 stories (TASK-02)
3. Mobile safe-area + NodeCard bottom sheet (TASK-03)
4. LOD node sizes + edge visual types (TASK-04)
5. frameloop="demand" + invalidate() (TASK-05)

---

## Code Conventions

- Every user-facing string: `language === 'ru' ? 'рус' : 'eng'`
- TypeScript strict — avoid `any` except for Three.js geometry refs
- No comments explaining WHAT the code does; only WHY if non-obvious
- Each task = one PR, one focused commit message

## DO NOT TOUCH

- `src/data/nodes-part1/2/3.ts` and `edges-part1/2.ts` — curated data, requires Neo approval
- `SCALE = 0.045` — hardcoded physics↔WebGL conversion
- Physics constants in `MyceliumGraph.tsx` `useFrame` — already tuned
