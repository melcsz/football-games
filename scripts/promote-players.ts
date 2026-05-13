/**
 * Stage 3: promote top N scored players → runtime-shaped JSON (does not replace data/players/players.json).
 */
import { z } from "zod";
import { readJson, writeJsonPretty } from "@/scripts/lib/io";
import { playerEntityId } from "@/scripts/lib/slug";
import { dedupeStrings } from "@/scripts/lib/text";
import type { ScoredPlayer } from "@/scripts/lib/raw-player";
import { playerSchema, type Country } from "@/data/schema";

const SCORED_PATH = "data/raw/scored-players.json";
const COUNTRIES_PATH = "data/countries/countries.json";
const OUT_PATH = "data/generated/players.generated.json";
const PUZZLE_PLAYERS_PATH = "data/players/puzzle-players.json";

function parseLimit(argv: string[]): number {
  // Default high enough to keep the generated dataset broad.
  // This file is used at runtime, so missing puzzle ids would break builds.
  const def = 5000;
  const idx = argv.indexOf("--limit");
  if (idx === -1 || argv[idx + 1] === undefined) return def;
  const n = Number.parseInt(argv[idx + 1], 10);
  if (!Number.isFinite(n) || n < 1) return def;
  return n;
}

function normKey(s: string): string {
  return s.trim().toLowerCase();
}

/** Map normalized country label → co_* id from existing countries.json */
function buildCountryIdLookup(countries: Country[]): Map<string, string> {
  const m = new Map<string, string>();
  for (const e of countries) {
    const keys = [e.name, ...(e.aliases ?? [])];
    for (const k of keys) {
      const nk = normKey(k);
      if (nk && !m.has(nk)) m.set(nk, e.id);
    }
  }
  return m;
}

function resolveCountryId(
  countryName: string | undefined,
  lookup: Map<string, string>,
): string | undefined {
  if (!countryName?.trim()) return undefined;
  return lookup.get(normKey(countryName));
}

function parseBirthYear(dateOfBirth?: string): number | undefined {
  if (!dateOfBirth) return undefined;
  const y = Number.parseInt(dateOfBirth.slice(0, 4), 10);
  if (!Number.isFinite(y) || y < 1800 || y > 2100) return undefined;
  return y;
}

/** Map English Wikidata position label → app enum; omit if unknown. */
function mapWikidataPosition(
  positionName?: string,
): "GK" | "DF" | "MF" | "FW" | undefined {
  if (!positionName?.trim()) return undefined;
  const t = positionName.toLowerCase();
  if (/goalkeeper|goal keeper/.test(t)) return "GK";
  if (
    /defender|full-back|fullback|centre-back|center back|wing-back|wing back|left-back|right-back/.test(
      t,
    )
  ) {
    return "DF";
  }
  if (/midfield|midfielder/.test(t)) return "MF";
  if (/forward|striker|winger|attacker/.test(t)) return "FW";
  return undefined;
}

function toPlayerRecord(
  row: ScoredPlayer,
  countryLookup: Map<string, string>,
): ReturnType<typeof playerSchema.parse> {
  const aliases = dedupeStrings(row.aliases).filter((a) => a !== row.name);
  const countryId = resolveCountryId(row.countryName, countryLookup);
  const birthYear = parseBirthYear(row.dateOfBirth);
  const position = mapWikidataPosition(row.positionName);

  const base = {
    id: playerEntityId(row.name),
    kind: "player" as const,
    name: row.name.trim(),
    wikidataQid: row.wikidataQid,
    ...(aliases.length ? { aliases } : {}),
    ...(countryId ? { countryId } : {}),
    ...(birthYear !== undefined ? { birthYear } : {}),
    ...(position ? { position } : {}),
  };

  return playerSchema.parse(base);
}

async function main(): Promise<void> {
  const limit = parseLimit(process.argv);
  const scored = readJson<ScoredPlayer[]>(SCORED_PATH);
  const countries = readJson<Country[]>(COUNTRIES_PATH);
  const countryLookup = buildCountryIdLookup(countries);

  const takenIds = new Set<string>();
  const out: ReturnType<typeof playerSchema.parse>[] = [];

  for (const row of scored) {
    if (out.length >= limit) break;
    const id = playerEntityId(row.name);
    if (takenIds.has(id)) continue;
    try {
      const rec = toPlayerRecord(row, countryLookup);
      takenIds.add(rec.id);
      out.push(rec);
    } catch (err) {
      console.warn(`Skipping invalid row ${row.wikidataQid}:`, err);
    }
  }

  z.array(playerSchema).parse(out);

  // Ensure any puzzle-required players are present in the generated dataset.
  // This keeps builds strict even if Wikidata imports are flaky.
  try {
    const puzzlePlayers = readJson<unknown[]>(PUZZLE_PLAYERS_PATH).map((x) =>
      playerSchema.parse(x),
    );
    for (const p of puzzlePlayers) {
      if (takenIds.has(p.id)) continue;
      takenIds.add(p.id);
      out.push(p);
    }
  } catch (e) {
    console.warn(
      `Warning: could not load/parse ${PUZZLE_PLAYERS_PATH}.`,
      e instanceof Error ? e.message : e,
    );
  }

  z.array(playerSchema).parse(out);

  writeJsonPretty(OUT_PATH, out);

  const withCountry = out.filter((p) => "countryId" in p && p.countryId).length;
  const withPos = out.filter((p) => "position" in p && p.position).length;
  const withYear = out.filter((p) => "birthYear" in p && p.birthYear).length;

  console.log(
    `Generated ${out.length} players → ${OUT_PATH} (countryId: ${withCountry}, position: ${withPos}, birthYear: ${withYear})`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
