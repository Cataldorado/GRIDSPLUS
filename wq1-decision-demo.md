# WQ-1 Decision Demo — Open Door vs. Closed Door

An interactive, standalone decision demo built for a business-stakeholder walkthrough
(Aaron, Nick, Steering) of one discovery question: **who can open GRIDS+ at all, and
what do not-rostered users see?** It is not part of the main GRIDS+ Phase 0 tour — it's
a separate view a presenter toggles live.

## How to open it

Click the **"WQ-1 Decision Demo →"** chip in the bottom-left demo control bar (next to
"Reset demo"), visible on every screen of the main prototype. It's wired up in
`src/components/layout/AppShell.tsx`, which calls `setView('decision-demo')`.

`App.tsx` special-cases this view — it renders `<DecisionDemo />` **outside** the normal
`<AppShell>` wrapper, because the demo owns its own chrome (it needs to show Heritage+
chrome on one screen and GRIDS+ chrome on another, not the standard app header). An
"← Exit demo" link inside the demo calls `setView('home')` to return to the main tour.

## Files

- `src/data/decisionDemoData.ts` — all content/config: the 3 sample personas, business-risk
  copy, and the 6 walkthrough-step definitions. Edit this file to change wording, add a
  persona, or adjust risk callouts — no JSX changes needed.
- `src/pages/decision-demo/screens.tsx` — the actual screen components (Heritage+ entry,
  GRIDS+ chrome, the 4 body states, the decision-summary footer, the signed-out gate).
- `src/pages/decision-demo/DecisionDemo.tsx` — the control panel (all the toggles) plus
  the logic that picks which screen(s) to render from the current toggle state.

## The mental model

Three independent toggles decide what's on screen:

1. **Door model** — `open` or `closed`. Open Door means any authenticated Heritage+/RoofHub
   user can launch GRIDS+ (the roster only controls what they see once inside). Closed Door
   means only commercially-rostered users can enter at all.
2. **User type** — one of three sample people, all at "Brightview Landscape":
   - **Jake Porter** — not on the commercial roster
   - **Maria Estimator** — rostered, has 2 sample projects (Riverside Phase 2 · Active · 3
     quotes, Office Park Irrigation · Draft)
   - **Pat Chen** — rostered, but zero projects yet (tests "rostered ≠ has work" — an
     intentionally separate case from "not rostered")
3. **Entry path** — `from-h+` (start on a Heritage+ screen, click through into GRIDS+) or
   `direct` (skip straight to GRIDS+, like a bookmark or typed URL).

There's also a **Session** toggle (Logged in / Not logged in) that overrides everything
else — an anonymous visitor always sees a "Sign in to continue" gate regardless of door or
roster, since neither applies before authentication.

Given door + user type, `annotationFor()` in `decisionDemoData.ts` picks which of 4 body
screens renders inside the GRIDS+ chrome:

| Door | User type | Screen shown |
|---|---|---|
| Open | Not rostered | Encouraging "commercial design lives here" empty state — informational, not a wall |
| Open | Rostered, has projects | Full project dashboard |
| Open | Rostered, empty | "Start your first project" empty state |
| Closed | Not rostered | Hard "You don't have access to GRIDS+" denial — no project data, no CTA to browse |
| Closed | Rostered, has projects | Same dashboard as Open — door model doesn't affect already-rostered users |
| Closed | Rostered, empty | Same empty state as Open |

The takeaway baked into all of this (and spelled out on the demo's Summary screen): **door
model only changes who gets in and what a not-rostered user sees. It does not change
anything for already-rostered users, and rostered-but-empty is a distinct case from
not-rostered** — those two get conflated in casual conversation but the demo deliberately
keeps them separate.

## Compare mode

Toggling "Compare" on renders two of the above screens side by side instead of one, so a
presenter doesn't have to toggle back and forth from memory. The comparison axis is either:
- **vs. Door** — same user type, Open Door on the left / Closed Door on the right
- **vs. Roster** — same door, Jake (not rostered) on the left / Maria (rostered) on the right

## Walkthrough steps

The 6 numbered chips under the toggles are one-click presets — each sets door/user
type/entry/compare to reproduce one specific comparison from the original spec, so a
presenter can hit all 6 required talking points in order without hand-driving every
toggle live. Step 6 replaces the screen with a plain summary slide (the takeaway line
above). The step definitions (label + description shown on hover) live in
`WALKTHROUGH_STEPS` in `decisionDemoData.ts`.

## Decision summary footer

Every GRIDS+-chrome screen has a collapsible "Decision summary" strip at the bottom
showing: door model, roster status, "Can open app? Y/N", "Sees projects? Y/N", and a
one-line business-risk callout (from `BUSINESS_RISK` in `decisionDemoData.ts`). This is
what actually answers "so what" for each toggle combination — useful if a stakeholder
asks "wait, why does that matter?" mid-demo.

## Guardrails / what's deliberately NOT built here

- No real SSO, auth, or backend — every toggle just swaps static React state, nothing is
  persisted or fetched.
- RoofHub doesn't get its own entry-path screen (out of scope per the original spec) — the
  "Sign in with RoofHub" button on the signed-out gate just drops the user straight into
  GRIDS+ instead of an H+-style intermediate screen.
- Employee/Okta paths, P5 invite-accept, quote audience/impersonation are all explicitly
  out of scope — this demo only answers the one entry/roster question.
