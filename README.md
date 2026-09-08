# GRIDS+ Phase 0 Prototype

Clickable UX vision prototype for GRIDS+ Phase 0 steering demos. **Not production
code** — fake data, no APIs, no auth. Built to walk stakeholders through one sample
project (Riverside Office Park · Irrigation package) across three personas.

Source spec: `grids-plus-prototype-spec.md` (approved 2026-08-17) and the Claude
Code handoff pack it references.

## Run it

```bash
npm install
npm run dev
```

Open the printed localhost URL (default `http://localhost:5173`).

## WQ-1 Decision Demo (Open vs Closed Door)

Interactive walkthrough for **Q-001** — who can enter GRIDS+ and what not-rostered users see.

- **Open in app:** bottom-left chip **"WQ-1 Decision Demo →"** (on any main-tour screen)
- **Presenter guide:** `docs/wq1-decision-demo.md`
- **Discovery record:** `track-b/implementation/open-questions/Q-001-open-vs-closed-door.md`

## What's here

- **Posted-in chrome** — bottom-left bar toggles **Heritage+**, **RoofHub**, or **GRIDS+ only** (standalone GRIDS+ header with no host-platform branding).
- **Demo scope** — **Vision** (full concept) vs **Phase 1 MVP** (GRIDS/TED parity slice). See `docs/mvp-parity-demo.md`.
- **13-step linear tour** — the numbered dots at the bottom are a step picker; Back/Next
  or arrow keys ← → move linearly. Keys `1`/`2`/`3` jump personas.
- **Present mode** — hides the step picker for a cleaner demo view (bottom-right toggle).
- **GiddyUp** appears only as a status card — never a full UI, per spec.
- **Public projects are out of scope** — only the private project path is built.
- Customer-facing screens never show cost or GM% — that's TM/estimator-only (see the
  "TM prep & share" screen vs. "Customer review quote").

## Structure

```
src/
  data/sampleData.ts       Riverside Office Park project, personas, quote data, AI findings
  state/tourStore.ts       zustand store: step, persona, present mode, intake/quote state
  components/layout/       TourShell, PersonaTabs, StepControls, HeritageChrome, PhaseBanner
  components/ui/           Card, Badge, Button primitives
  screens/                 One file per tour step (01-Entry.tsx … 13-Review.tsx)
```

## Deploy

No environment variables required.

```bash
npm run build
npx vercel deploy --prod
```
