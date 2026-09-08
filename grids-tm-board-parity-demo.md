# GRIDS TM board parity (MVP)

Activates when **Scope: Phase 1 MVP** + **Posted in: Heritage+** or **GRIDS+ only**.

## Elements matched from screenshot

| GRIDS element | Prototype |
|---|---|
| GRIDS **G** logo + TM toolbar | Impersonate user · contractor filter · impersonate contractor |
| **Collapse** | Hides impersonation row |
| Orange-outline **Search** + **Submit Request** | Toolbar |
| Account: Hello, {name}! | Persona name from demo switcher |
| **List View** · **Board View** | Toggle (Board default) |
| **All Templates** filter | Global + per-column on New Leads |
| **New Leads** · **Requires Attention** · **In Progress** · **Complete** | Four kanban columns |
| **All Phases** + **View Archive** on Complete | Column header controls |
| Public card (blue spine, open lock) | New Leads public projects |
| Private card (red spine, closed lock) | In Progress / Complete |
| Project name + # · address · contractor · bid · created · status · template | Card body |
| **Archive** · **Invite** (public leads, TM) | Circular action buttons |
| **Request Submittal** (some Complete) | Chain icon on committed rows |

## Statuses in demo data

- **ACTIVE OPPORTUNITY** (In Progress)
- **COMMITTED** (Complete)
- **LOST BY CUSTOMER** (Complete)

## Demo projects (from capture)

| Column | Projects |
|---|---|
| New Leads (2) | Garrett Public Library · Syracuse Public Library |
| Requires Attention (0) | — |
| In Progress (1) | Apply Changes - Test 04-17 - CC |
| Complete (4) | 15 Progress Place · Wings Credit Union · Chick-fil-A FSU · Home Depot LAA |

Data: `src/data/gridsTmProjects.ts`

## Presenter path

1. **Phase 1 MVP** + **Heritage+** (or GRIDS+ only)
2. Open Commercial / dashboard (TM persona recommended)
3. **Board View** — walk columns left to right
4. Click **Invite** on a public New Lead → project detail

TED (RoofHub) parity is separate — see `ted-roofing-parity-demo.md`.
