# Data import scripts (Wikidata → inspectable JSON)

Pipeline. **Runtime app code is unchanged**; `data/players/players.json` is not modified by these scripts.

| Stage | Command | Input | Output |
| ----- | ------- | ----- | ------ |
| 1a | `npm run data:import:players -- --group <id>` | Wikidata SPARQL | `data/raw/players/<id>.json` |
| 1b | `npm run data:import:players -- --all` | Wikidata SPARQL | `data/raw/players/*.json` |
| 1c | `npm run data:combine:players` | per-group raw | `data/raw/wikidata-players.json` |
| 2 | `npm run data:score:players` | combined raw | `data/raw/scored-players.json` |
| 3 | `npm run data:promote:players` | scored (top N) | `data/generated/players.generated.json` |

`data/raw/` is gitignored (regenerable). Commit `data/generated/players.generated.json` when you want to snapshot promoted rows.

### Examples

```bash
npm run data:import:players -- --group premier-league-current
npm run data:import:players -- --group la-liga-current
npm run data:import:players -- --group serie-a-current
npm run data:import:players -- --group bundesliga-current
npm run data:import:players -- --group ligue-1-current
npm run data:import:players -- --group global-legends --limit 300

npm run data:combine:players
npm run data:score:players
npm run data:promote:players -- --limit 500
```

Override promote limit (default 500 via npm script; use `--` to pass flags):

```bash
npm run data:promote:players -- --limit 200
```

Requires network access for stage 1 (Wikidata). Uses a descriptive `User-Agent` and retries on 429/5xx.

### Notes on OpenFootball

OpenFootball is usually a better fit later for **clubs/leagues/seasons/fixtures/results**. For players, Wikidata gives broader coverage and stable QIDs.
