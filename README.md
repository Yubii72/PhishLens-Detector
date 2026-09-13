# PhishLens

![PhishLens logo](client/public/logo.png)

A calm, explainable first pass between "looks odd" and "clicked it." Paste raw email source (or upload a `.eml`) and get a risk score, a breakdown of the signals found, and an annotated view of the suspicious parts — before you ever click a link.

Built with React + TypeScript and delivered as a clean, dark navy/teal/amber workspace.

## Features

- **Paste or upload** — paste raw email source or drop in a `.eml` file.
- **Risk score (0–100)** with a Likely Safe / Suspicious / Likely Phishing verdict.
- **Signal breakdown** — reasoning-based flags from headers, links, and wording, including domain lookalike (word-segmentation) detection for typosquat names like `micr0soft-security.com`.
- **Annotated preview** — the original email body with suspicious links highlighted.
- **Scan history** — previous scans stored locally in your browser, with the ability to pick two previous scans and compare them side by side.
- **Fully responsive** — hamburger navigation on mobile, centered workspace layout, dark theme throughout.

## Tech stack

- **Frontend:** React 19, TypeScript, Vite 7, wouter (routing), lucide-react (icons)
- **Styling:** Tailwind CSS 4 + hand-written CSS with a dark navy/teal/amber flat palette, Manrope + DM Mono
- **Backend:** Minimal Express static server for production hosting
- **Tests:** Vitest (unit tests for the analyzer)
- **Tooling:** pnpm, ESLint-free tsc typecheck, Prettier

## Getting started

Requires Node 20.19+ / 22.12+ and pnpm.

```bash
pnpm install     # install dependencies
pnpm dev         # start the Vite dev server (http://localhost:3000)
```

## Scripts

| Script            | What it does                                            |
| ----------------- | ------------------------------------------------------- |
| `pnpm dev`        | Start the Vite dev server with hot reload               |
| `pnpm check`      | Typecheck the whole project (`tsc --noEmit`)            |
| `pnpm test`       | Run the Vitest unit tests                              |
| `pnpm build`      | Build the client bundle + the production server         |
| `pnpm start`      | Serve the production build                              |
| `pnpm format`     | Format code with Prettier                               |

### Production build & serve

```bash
pnpm build
# POSIX:  NODE_ENV=production node dist/index.js
# Windows PowerShell:  $env:NODE_ENV="production"; node dist/index.js
```

The app is served at `http://localhost:3000`.

## Environment variables

Optional analytics placeholders are referenced in `index.html` and are replaced by Vite at build time. Set them in `.env` / `.env.local` (never committed):

| Variable                  | Purpose                          |
| ------------------------- | -------------------------------- |
| `VITE_ANALYTICS_ENDPOINT` | Umami analytics endpoint         |
| `VITE_ANALYTICS_WEBSITE_ID` | Umami website/analytics ID       |

## How the analyzer works

The heuristic engine in `client/src/lib/analysis.ts`:

1. Parses sender, subject, and header timestamps.
2. Extracts all URLs from the message body.
3. Checks for brand lookalikes using word segmentation (e.g., `micr0soft`, `microsoft` variants) and suspicious TLDs / domain patterns.
4. Flags urgency language, credential/keyword themes, mismatch between display names and real domains, and risky link types.
5. Produces a weighted 0–100 risk score, a category verdict, and an ordered list of flags (critical / warning / info), plus the annotated preview.

> **Heuristic, not a verdict.** This is a fast explainable first pass. A low score does not guarantee an email is safe.

## Pages

| Route       | Page                                        |
| ----------- | ------------------------------------------- |
| `/`         | Scan dashboard (paste/upload + results)     |
| `/history`  | Scan history + side-by-side comparison      |
| `/about`    | About, methodology, and FAQ                 |

## Project structure

```
client/
  public/          # Static assets (logo.png served at /logo.png)
  src/
    components/    # Header, InputPanel, results, history, etc.
    pages/         # ScanPage, HistoryPage, AboutPage, router
    lib/           # analysis.ts (engine), history.ts (local persistence)
    index.css      # Palette + layout
server/            # Production static server
shared/            # Shared types/constants
```

Scan history is persisted to each browser's `localStorage` under the `phishlens_history_v1` key. Nothing leaves the browser — scans are not sent to any server.