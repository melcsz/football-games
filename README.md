# WeKnowBall

Football quiz games platform — **Next.js 14** (App Router), **Tailwind**, **Framer Motion**, **Vitest**.

## Games

| Route | Game |
| ----- | ---- |
| `/` | Landing — pick a game |
| `/tenaball` | **TenaBall** — daily top-10 (Chill / Pressure) |
| `/tenaball/archive` | Replay past boards |
| `/stats` | Anonymous stats (localStorage) |
| `/about` | How to play |

Legacy URLs **`/archive`** and **`/puzzle/[id]`** redirect to **`/tenaball/archive`** and **`/tenaball/[id]`**.

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
- **TenaBall puzzles**: [`content/games/tenaball/puzzles/`](content/games/tenaball/puzzles/) — each answer references an **`entityId`**. Registry + integrity checks: [`content/games/tenaball/registry.ts`](content/games/tenaball/registry.ts).

Answers are **picked from a searchable combobox** (strict selection — no free typing).

## Player data

Player entities currently come from the generated dataset: `data/generated/players.generated.json` (produced by the scripts in `scripts/`).

## Project status / progress

See [`docs/STATUS.md`](docs/STATUS.md) (living doc: current architecture, data flow, and pipeline state).

## Adding a TenaBall puzzle

1. Ensure every answer exists in the appropriate `data/**/\*.json` with a stable id (`pl_*`, `cl_*`, `mg_*`, `co_*`, `lg_*`).
2. Add `content/games/tenaball/puzzles/XXXX.json` with `game: "tenaball"`, `validKinds`, and `answers[].entityId`.
3. Import the JSON in [`content/games/tenaball/registry.ts`](content/games/tenaball/registry.ts).
4. Run `npm run build` — validation runs at compile time.

## Adding another game later

1. Add a folder under `content/games/<game>/` and `components/games/<game>/`.
2. Extend `GameId` and `StoredRoot.games` in [`lib/core/storage.ts`](lib/core/storage.ts).
3. Add a card + route from the landing page.

## Environment

Copy `.env.example` → `.env.local`. Set `NEXT_PUBLIC_SITE_URL` to your production URL for Open Graph and share links.

## Licence

Private — yours to extend.
