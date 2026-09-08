# Phase 1 MVP demo scope

Toggle **Scope: Phase 1 MVP** in the bottom demo bar to show a stripped-down experience aligned with **existing GRIDS/TED parity** (not the full vision).

Config lives in `src/config/demoScope.ts` — extend flags there as we narrow more screens.

## Project dashboard (MVP vs Vision)

| Element | Vision | Phase 1 MVP |
|---|---|---|
| Sidebar **Needs a decision** queues | Shown | **Hidden** |
| **Triage** view (tiered urgency groups) | Shown | **Hidden** |
| **List** view (project table) | Hidden | **Shown** — default |
| View toggle | Triage · Board | **List · Board** |
| **Board** columns | New leads · Needs you · In progress · Complete | New leads · In progress · Complete |
| **New leads** (public discovery) | Same card actions | **Interested** · **Not interested** (customer) · **Invite** · **Archive** (TM) |
| Demo content | Mixed workflow projects | **Heritage:** GRIDS TM board · **RoofHub:** TED roofing list |
| Pressure chips / urgency headline | Shown | **Hidden** |
| Recommended next call | Shown | **Hidden** |
| Cleared today progress | Shown | **Hidden** |
| Search + Submit Request + Narrow by filters | Shown | Shown |

## Presenter tip

Use **Vision** for steering narrative (what GRIDS+ could be). Switch to **Phase 1 MVP** when Aaron/Nick ask “what ships first?” or when comparing to today’s GRIDS board.

## Related workspace docs

- `docs/grids-tm-board-parity-demo.md` — GRIDS TM board (Heritage + MVP)
- `docs/ted-roofing-parity-demo.md` — TED list (RoofHub + MVP)
- `track-b/discovery/cross-cutting/grids-ted-vertical-deltas.md`
