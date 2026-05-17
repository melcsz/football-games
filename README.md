# WeKnowBall

Football quiz games platform — **Next.js 14** (App Router), **Tailwind**, **Framer Motion**, **Vitest**.

## Games

| Route | Game |
| ----- | ---- |
| `/` | Landing — pick a game |
| `/top-10` | **Top 10** — daily top-10 (Chill / Pressure) |
| `/top-10/archive` | Replay past boards |
| `/stats` | Anonymous stats (localStorage) |
| `/about` | How to play |

Legacy URLs **`/archive`** and **`/puzzle/[id]`** redirect to **`/top-10/archive`** and **`/top-10/[id]`**.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm test` | Vitest |
| `npm run lint` | ESLint |

## Data layout

- **Canonical entities** (players, clubs, managers, countries, leagues): [`data/`](data/) — JSON + Zod in [`data/schema.ts`](data/schema.ts). Loaded by [`data/index.ts`](data/index.ts).
- **Top 10 puzzles**: [`content/games/top-10/puzzles/`](content/games/top-10/puzzles/) — each answer references an **`entityId`**. Registry + integrity checks: [`content/games/top-10/registry.ts`](content/games/top-10/registry.ts).

Answers are **picked from a searchable combobox** (strict selection — no free typing).

## Player data

Player entities currently come from the generated dataset: `data/generated/players.generated.json` (produced by the scripts in `scripts/`).

## Project status / progress

See [`docs/STATUS.md`](docs/STATUS.md) (living doc: current architecture, data flow, and pipeline state).

## Adding a Top 10 puzzle

1. Ensure every answer exists in the appropriate `data/**/\*.json` with a stable id (`pl_*`, `cl_*`, `mg_*`, `co_*`, `lg_*`).
2. Add `content/games/top-10/puzzles/XXXX.json` with `game: "Top 10"`, `validKinds`, and `answers[].entityId`.
3. Import the JSON in [`content/games/top-10/registry.ts`](content/games/top-10/registry.ts).
4. Run `npm run build` — validation runs at compile time.

## Adding another game later

1. Add a folder under `content/games/<game>/` and `components/games/<game>/`.
2. Extend `GameId` and `StoredRoot.games` in [`lib/core/storage.ts`](lib/core/storage.ts).
3. Add a card + route from the landing page.

## Environment

Copy `.env.example` → `.env.local`. Set `NEXT_PUBLIC_SITE_URL` to your production URL for Open Graph and share links.

## Licence

Private — yours to extend.
