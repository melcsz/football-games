# WeKnowBall — Project Status (living doc)

Update this file whenever we change architecture, data contracts, or pipelines.

## Stack

- **Next.js** 14 (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** + **Framer Motion**
- **Zod** for build-time validation
- **Vitest** for tests
- **Storage**: browser `localStorage` only (anonymous)
- **No backend / DB** (by design)

## App routes

- `/`: landing page (game picker)
- `/tenaball`: daily TenaBall
- `/tenaball/[id]`: replay a specific board
- `/tenaball/archive`: archive
- `/stats`: anonymous stats
- `/about`: how to play
- **Redirects**: `/archive` → `/tenaball/archive`, `/puzzle/:id` → `/tenaball/:id`

## Game: TenaBall (today)

- **Strict pick** UX: users choose an entity from autocomplete (no free-typing guesses).
- **Puzzle answers** are `entityId`s (players/clubs/etc).
- **Matching** is **ID equality** (no fuzzy matcher).
- **Modes**: Chill (untimed) / Pressure (timed, score multiplier).

## Data model

### Canonical entities (`data/`)

The canonical datasets live under `data/` and are validated at build time:

- `data/schema.ts`: Zod + types for `player | club | manager | country | league`
- `data/index.ts`: loads JSON, validates unique IDs + `countryId` referential integrity
- `data/search.ts`: normalization + in-memory ranking used by autocomplete

### Puzzles (`content/`)

- `content/games/tenaball/puzzles/*.json`: each answer is `{ rank, entityId, meta? }`
- `content/games/tenaball/registry.ts`: **permissive validation right now**\n+  - if an `entityId` exists in the dataset, we enforce it matches `validKinds`\n+  - if it does **not** exist yet, we do **not** fail the build (we’re iterating on datasets / puzzles later)

## Persistence (localStorage)

- Key: `weknowball:v1` (root storage v2)
- Shape: `StoredRoot { version: 2, games: { tenaball: GameStats } }`
- One-time migration from legacy key `ballknowledge-tenaball-v1`

## Player dataset strategy (current)

Runtime uses the **generated** player dataset:

- `data/generated/players.generated.json` (produced by the Wikidata pipeline)

This means the autocomplete pool can grow quickly. When we start authoring new puzzles again, we’ll likely re-introduce a strict “puzzle IDs must exist” check (or add a small puzzle-required overlay dataset).

## Wikidata import pipeline (v1)

Docs: `scripts/README.md`

- Group imports to `data/raw/players/<groupId>.json` (gitignored)
- Combine → `data/raw/wikidata-players.json` (gitignored)
- Score → `data/raw/scored-players.json` (gitignored)
- Promote → `data/generated/players.generated.json` (committable snapshot)

Current import groups live in `scripts/data-import/player-import-groups.ts`:\n+ - `premier-league-current`\n+ - `la-liga-current`\n+ - `serie-a-current`\n+ - `bundesliga-current`\n+ - `ligue-1-current`\n+ - `global-legends`

Reliability features in importer:\n+- POST requests + descriptive `User-Agent`\n+- retries with backoff on 429/5xx\n+- small batch size + per-batch delay\n+- partial checkpointing per group (resumable)

## Known gaps / next work

- **Wikidata endpoint reliability**: WDQS can time out / 502 / 504; importer is retrying + resumable, but imports may still require reruns.
- **League group heuristic quality**: “current league” groups depend on Wikidata club→league data quality (`P118`), so coverage isn’t perfect.
- **Puzzle/entity strictness is currently relaxed**: we’ll tighten this again once we resume puzzle authoring against the generated datasets.

