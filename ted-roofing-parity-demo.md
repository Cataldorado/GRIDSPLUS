# TED roofing list parity (MVP)

Activates when **Scope: Phase 1 MVP** + **Posted in: RoofHub** — replaces the GRIDS kanban with the **SRS TED** project home captured Sep 2026.

## Elements matched from screenshot

| TED element | Prototype |
|---|---|
| SRS Distribution header | Maroon brand bar + user menu |
| **List View** · **Calendar View** · **Board View** | Three-way toggle (List default) |
| Search by Project Name/Number | Toolbar search |
| **Advanced** | Toggles stub filter row |
| **Date Created (Newest First)** | Sort dropdown (4 options) |
| **My Projects Only** | Checkbox filter |
| **Submit Design Request** | Opens intake wizard |
| Table: # · Project · Location · Bidders · Status · Bid Date | `TedListTable` |
| **Public** badge on rows | Red badge column |
| Project / Bidder links (red) | Clickable — opens project detail |
| **+ Bidder** row action | Grey button per row |
| Footer SRS · giddyup · © CutterCroix | Bottom bar |

## TED statuses (roofing only)

- **Design In Progress**
- **Awaiting Designer**
- **Branch Review and Price** (extra row for pipeline depth)

## Demo data

`src/data/tedRoofingProjects.ts` — 12 projects; IDs **2613042**–**2613025** mirror the walkthrough capture.

## Presenter path

1. Bottom bar → **Phase 1 MVP** + **RoofHub**
2. Open **Roof Hub Estimator** (nav) or land on dashboard
3. Walk List → Calendar (shell) → Board (grouped by status)
4. Click **+ Bidder** or project name → TED project detail with **+ Bidder** CTA

GRIDS (Heritage) parity is separate — share GRIDS screenshot next.
