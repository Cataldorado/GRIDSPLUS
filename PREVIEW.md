# Preview GRIDS+ prototype (no local Node install)

**Project root:** `grids-plus-prototype/` (not nested — run commands from this folder).

Do **not** copy `node_modules` between machines — reinstall on each OS.

## Option A — StackBlitz (best for work PC, nothing to install)

1. Zip the project **without** `node_modules` (source + config only).
2. Open [https://stackblitz.com](https://stackblitz.com) → **Upload project**.
3. StackBlitz runs `npm install` in the cloud and starts the dev server in your browser.

## Option B — MacBook

```bash
cd grids-plus-prototype
npm install
npm run dev
```

Open `http://localhost:5173`.

## Option C — Deploy once, open a URL anywhere (steering link)

```bash
cd grids-plus-prototype
npm install
npm run build
npx vercel deploy --prod
```

Share the Vercel URL — no install needed on the work PC.

## WQ-1 Decision Demo (Open vs Closed Door)

Separate presenter view for **Q-001 / WQ-1** — not part of the main tour.

- **How to open:** Click **"WQ-1 Decision Demo →"** in the bottom-left demo control bar.
- **Docs:** `grids-plus-prototype/docs/wq1-decision-demo.md`
- **Tracks to:** `track-b/implementation/open-questions/Q-001-open-vs-closed-door.md`
