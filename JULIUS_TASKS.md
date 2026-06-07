# Julius Tasks — Seamless Universe

**Agent:** Jules (Google AI Coding Agent)  
**Repo:** raisingh-boy/cloud-code  
**Branch:** develop from `main`, PR to `main`  
**Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Three.js + @react-three/fiber

---

## 🔴 SPRINT 1 — Critical Path (блокируют v1)

### TASK-01: Google OAuth (Auth)
**Priority:** Critical  
**Estimated:** 1 day

Implement Google Sign-In using the `@react-oauth/google` package.

**What to do:**
1. `npm install @react-oauth/google`
2. In `src/main.tsx` wrap `<App>` with `<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>`
3. In `src/App.tsx` replace the hardcoded `userEmail` state with real Google auth:
   - Add `useGoogleLogin()` hook
   - On login success: set `userEmail` + `userProfile.name` from credential payload
   - On logout: clear both + redirect to Atlas (read-only)
4. Add a real "Sign in with Google" button replacing the simulated `handleGoogleAuthSimulation` in the auth modal
5. Add `.env.example` with `VITE_GOOGLE_CLIENT_ID=your_client_id_here`
6. Atlas is readable without auth; Field/My World actions show auth modal if not logged in

**Files to edit:** `src/main.tsx`, `src/App.tsx`  
**Guard:** Before any `handleCarryOver`, `handleNodeResonated`, `handleAddObservation` — check `userEmail !== null`, show auth modal if not.

---

### TASK-02: All 66 Stories in stories.ts
**Priority:** Critical  
**Estimated:** 2 days

Currently `src/data/stories.ts` has 17 stories. The full set of 66 must be added.

**What to do:**
1. Read `universe_full.json` (in repo root or available via admin) — stories array
2. Map each story to the `Story` interface in `src/types.ts`:
   ```ts
   { id, edgeId, titleRu, titleEn, textRu, textEn, figureA?, figureB?, year?, resonances, verified }
   ```
3. Replace or extend the `STORIES` export in `src/data/stories.ts`
4. Verify all `edgeId` references exist in `EDGES_PART1` or `EDGES_PART2`
5. Fix `NodeCard.tsx` Stories tab — currently renders stories filtered by `node.id`, but architecture requires filtering by edges connected to that node:
   ```ts
   // Find edges connected to this node
   const connectedEdgeIds = links
     .filter(l => l.source === node.id || l.target === node.id)
     .map(l => l.id);
   const nodeStories = stories.filter(s => connectedEdgeIds.includes(s.edgeId));
   ```

**Files to edit:** `src/data/stories.ts`, `src/components/NodeCard.tsx`

---

### TASK-03: Mobile safe-area + bottom sheet NodeCard
**Priority:** Critical  
**Estimated:** 1 day

**What to do:**
1. Add to `src/index.css`:
   ```css
   :root {
     --sab: env(safe-area-inset-bottom, 0px);
     --sat: env(safe-area-inset-top, 0px);
   }
   ```
2. In `src/App.tsx` footer: add `pb-[var(--sab)]` to footer element
3. Mobile bottom tab bar world switcher: add `pb-[var(--sab)]` padding
4. `NodeCard.tsx` — convert to bottom sheet on mobile:
   - On mobile (`< md`): render as `fixed bottom-0 left-0 right-0 rounded-t-3xl` panel, height starts at `60vh`, swipe-up to `95vh`
   - On desktop (`md:`): keep as current side sheet
   - Use a simple `useState` for `sheetHeight: 'half' | 'full'` toggled by chevron button or drag handle
5. Add drag handle pill at top of mobile NodeCard: `<div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-1" />`

**Files to edit:** `src/index.css`, `src/App.tsx`, `src/components/NodeCard.tsx`

---

### TASK-04: LOD — Node size by level + edge visual types
**Priority:** Critical  
**Estimated:** 1 day

**What to do:**

**Node sizes** — in `src/components/MyceliumGraph.tsx`, in the `useEffect` that sets `baseRadius`:
```ts
// Replace current baseRadius logic:
const levelRadius = { macro: 18, meso: 12, micro: 8 };
baseRadius: n.id === 'central-me' ? 22 : (levelRadius[n.level] || 10),
currentRadius: ex?.currentRadius ?? (levelRadius[n.level] || 10),
```

**Edge visual types** — in `MyceliumEdge` component, use `link.type` to vary appearance:
```ts
// Pass `type` prop to MyceliumEdge
const edgeStyles = {
  historical:   { opacity: 0.7, dashSize: 0,    dashGap: 0    },
  conceptual:   { opacity: 0.5, dashSize: 0.3,  dashGap: 0.15 }, // dashed
  practical:    { opacity: 0.6, dashSize: 0.15, dashGap: 0.08 }, // dotted
  opposition:   { opacity: 0.9, dashSize: 0,    dashGap: 0    }, // red pulse
  resonance:    { opacity: 0.3, dashSize: 0,    dashGap: 0    }, // thin, transparent
};
```
Use `LineDashedMaterial` for conceptual/practical edges. Use red color (`#E85C4A`) for opposition.

**Files to edit:** `src/components/MyceliumGraph.tsx`

---

### TASK-05: frameloop="demand" + invalidate()
**Priority:** Critical  
**Estimated:** 2 hours

**What to do:**
1. In `src/components/MyceliumGraph.tsx` Canvas: add `frameloop="demand"`
2. In `GraphScene` `useFrame` callback: after updating positions, call `invalidate()` if any node moved more than 0.01 units
3. On `OrbitControls` add `onChange={() => invalidate()}` so camera movement triggers rerender
4. On pointer events (hover, click) call `invalidate()` via `useThree(state => state.invalidate)`

This reduces battery drain from ~100% GPU to ~10% when idle.

**Files to edit:** `src/components/MyceliumGraph.tsx`

---

## 🟡 SPRINT 2 — Nice to Have (v1, но не блокирует)

### TASK-06: Connection-first onboarding (3 steps)
**Priority:** High  
**Estimated:** 1 day

Replace the current 4-step tour in `src/components/PhilosophyOnboarding.tsx` with a 3-step connection-first flow:

**Step 1:** Show Atlas in background, overlay with: "Это живая карта смыслов. 170 идей, 376 связей, постоянно растёт." → button "Исследовать"  
**Step 2:** Pulse-highlight 2 random nodes, show: "Кликни на любую ноду, чтобы узнать её историю" → wait for click, then auto-advance  
**Step 3:** Show "+" button pulsing: "Добавь свой первый резонанс — идею, которая тебя затронула" → button "Начать"

Remove step 4 (registration wall) from onboarding — auth is only triggered when user tries to do an action.

**Files to edit:** `src/components/PhilosophyOnboarding.tsx`

---

### TASK-07: Admin panel at /admin
**Priority:** High  
**Estimated:** 2 days

Create a hidden admin panel route accessible only when `userEmail` matches a hardcoded admin list.

**What to do:**
1. Create `src/components/AdminPanel.tsx`
2. Add route detection: if `window.location.pathname === '/admin'` and user is admin, show AdminPanel instead of App
3. Admin features:
   - **Export JSON**: button downloads all `nodes + links + stories` as `universe_export_${date}.json`
   - **Export TXT**: plain text version for AI agent analysis (one node per line: `ID | nameRu | domain | level | status | descriptionRu`)
   - **Import JSON**: file upload, parse and replace `INITIAL_NODES + INITIAL_LINKS` (in localStorage, reloaded on next visit)
   - **Node count stats**: table showing counts by world/domain/status
   - **Activity log viewer**: last 50 `ActivityNotification` entries
4. Admin check: `const ADMIN_EMAILS = ['vologdin.roman@gmail.com']`

**Files to create:** `src/components/AdminPanel.tsx`  
**Files to edit:** `src/main.tsx` (or `src/App.tsx` for route detection)

---

### TASK-08: Web Audio API — Звук сфер
**Priority:** Medium  
**Estimated:** 1 day

Restore the "sound of spheres" feature that was lost in a git reset.

**What to do:**
1. Add a toggle button in the options menu (or top-right HUD): "🔊 Звук сфер"
2. When enabled: create `AudioContext` + one `OscillatorNode` per visible node
3. Frequency mapping by domain:
   ```ts
   const domainFreq = { body: 110, science: 220, philosophy: 174, movement: 330, cognition: 440, hybrid: 264 }
   ```
4. Frequency by level: `macro * 1.0`, `meso * 1.5`, `micro * 2.0`
5. Volume by distance from camera: nodes closer = louder (use `GainNode`)
6. Cleanup: disconnect all oscillators when toggle off or component unmounts

**Files to edit:** `src/components/MyceliumGraph.tsx`

---

### TASK-09: Supabase integration (Field + User data)
**Priority:** High (needed for real users)  
**Estimated:** 3 days

**What to do:**
1. `npm install @supabase/supabase-js`
2. Create `src/lib/supabase.ts` with client initialization
3. Add `.env.example`: `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
4. Create Supabase tables (SQL in `supabase/migrations/001_initial.sql`):
   ```sql
   CREATE TABLE users (id uuid PRIMARY KEY, email text, name text, domains text[], created_at timestamptz DEFAULT now());
   CREATE TABLE field_nodes (id text PRIMARY KEY, name_ru text, name_en text, domain text, level text, status text, description_ru text, description_en text, added_by text, created_at timestamptz DEFAULT now(), is_private boolean DEFAULT false);
   CREATE TABLE resonances (user_id uuid REFERENCES users(id), node_id text, created_at timestamptz DEFAULT now(), PRIMARY KEY (user_id, node_id));
   CREATE TABLE carried_nodes (user_id uuid REFERENCES users(id), node_id text, created_at timestamptz DEFAULT now(), PRIMARY KEY (user_id, node_id));
   CREATE TABLE personal_links (id text PRIMARY KEY, source text, target text, type text, user_id uuid REFERENCES users(id), created_at timestamptz DEFAULT now());
   ```
5. In `src/App.tsx`:
   - On login: fetch user's resonances and carried_nodes from Supabase, merge with local Set state
   - On `handleNodeResonated`: write to `resonances` table
   - On `handleCarryOver`: write to `carried_nodes` table
   - On `handleAddObservation`: write to `field_nodes` table (if not private)
6. Atlas nodes + stories: stay in static JSON (no Supabase)

**Files to create:** `src/lib/supabase.ts`, `supabase/migrations/001_initial.sql`  
**Files to edit:** `src/App.tsx`

---

### TASK-10: Camera fly-to on node click (TheBrain Plex style)
**Priority:** Medium  
**Estimated:** half day

**What to do:**
In `src/components/MyceliumGraph.tsx` `GraphScene`, when a node is selected:
1. Get target position: `{ x: node.x * SCALE, y: node.y * SCALE, z: node.z * SCALE }`
2. Use `useThree(state => state.camera)` ref
3. In `useFrame`: lerp camera position toward `selectedPos + cameraOffset` (where offset = 5 units toward camera's current direction from node)
4. Lerp `OrbitControls` target toward `selectedPos` using `controlsRef.current.target.lerp()`
5. Only trigger when `selectedNodeId` changes (track with `prevSelectedRef`)
6. Speed: `lerpFactor = 0.08` for smooth fly-to over ~0.5s

**Files to edit:** `src/components/MyceliumGraph.tsx`

---

### TASK-11: Impact notifications ("твоя нода добавлена в N созвездий")
**Priority:** Medium  
**Estimated:** half day

Replace generic flash messages with specific impact-oriented messages.

**What to do:**
In `src/App.tsx`:
1. When `handleNodeResonated(nodeId)`: count how many atlas nodes are linked to this node → "♦ Резонанс записан. Эта идея связана с N атласными нодами."
2. When `handleCarryOver(nodeId)`: check if this creates a bridge between 2 different domains → "↗ Мост между [domain1] и [domain2] через тебя"
3. When `handleAddConnection`: check if it links 2 different domains → "✦ Связь создала мост между [domainA] и [domainB]"

Use the existing `showFlash()` mechanism.

**Files to edit:** `src/App.tsx`

---

## 🟢 SPRINT 3 — v2 (не в v1)

These are explicitly deferred. Do NOT implement in v1:

- **TASK-20:** Dilts Logical Levels as a lens (v2)
- **TASK-21:** People Graph (v2)
- **TASK-22:** T/P/I/E lens (v2)
- **TASK-23:** Questions as first-class nodes (v2)
- **TASK-24:** Multiple personal graphs per user (v2)
- **TASK-25:** Follow / subscriptions (v2)
- **TASK-26:** AI recommendations (v2)
- **TASK-27:** InstancedMesh optimization (when nodes >500)
- **TASK-28:** Busybody/Hunter/Dancer navigation modes (v2)

---

## 📐 Architecture Decisions (locked)

| Decision | Choice |
|----------|--------|
| Worlds in v1 | 3: Atlas / Living Field / My World |
| Auth | Google OAuth only |
| Data | Hybrid: Atlas+Stories in JSON, Field+Users in Supabase |
| Hosting | Vercel (GitHub auto-deploy) |
| Domain | universe.seamless.club |
| Gamification | No likes/streaks/badges/leaderboards |
| AI in v1 | Translation RU/EN only |
| Onboarding | 3 steps, connection-first |
| Membership | €15/month, Universe = free entry point with limits |
| Questions | v2 |
| Dilts | v2 |

---

## 🔧 Code conventions

- **TypeScript**: strict mode, no `any` except `as any` for Three.js types where unavoidable
- **Tailwind v4**: use `@tailwind` syntax, not `@import "tailwindcss"` (already configured)
- **Physics in refs**: all Three.js animation runs in `useFrame` with `useRef`, NOT `useState`
- **Translations**: every user-facing string has `language === 'ru' ? '...' : '...'`
- **Node IDs**: Atlas nodes use semantic IDs (e.g., `soma-hanna`), user-created nodes use `node-user-{timestamp}`
- **Edge IDs**: `lnk-{source}-{target}` for atlas, `lnk-user-{timestamp}` for user-created, `lnk-me-{nodeId}-{timestamp}` for personal

## 🚫 Do NOT touch

- `src/data/nodes-part1.ts`, `nodes-part2.ts`, `nodes-part3.ts` (170 atlas nodes, curated)
- `src/data/edges-part1.ts`, `edges-part2.ts` (376 edges, curated)
- Physics constants in `MyceliumGraph.tsx` (`gravityStrength`, `damping`) — already tuned
- `SCALE = 0.045` constant — physics ↔ WebGL coordinate conversion
