/**
 * Combine per-group raw player files into a single deduped file:
 * - reads data/raw/players/*.json
 * - dedupes by wikidataQid
 * - merges aliases + importGroups
 * - best-effort merges other fields
 * - writes data/raw/wikidata-players.json
 */
import fs from "node:fs";
import path from "node:path";
import { dedupeStrings } from "@/scripts/lib/text";
import { readJson, writeJsonPretty } from "@/scripts/lib/io";
import type { RawWikidataPlayer } from "@/scripts/lib/raw-player";

const IN_DIR = "data/raw/players";
const OUT_PATH = "data/raw/wikidata-players.json";

function merge(a: RawWikidataPlayer, b: RawWikidataPlayer): RawWikidataPlayer {
  const aliases = dedupeStrings([...(a.aliases ?? []), ...(b.aliases ?? [])]).filter(
    (x) => x !== a.name && x !== b.name,
  );
  const importGroups = dedupeStrings([
    ...(a.importGroups ?? []),
    ...(b.importGroups ?? []),
  ]);
  return {
    wikidataQid: a.wikidataQid,
    name: a.name.length >= b.name.length ? a.name : b.name,
    aliases,
    countryName: a.countryName ?? b.countryName,
    dateOfBirth: a.dateOfBirth ?? b.dateOfBirth,
    positionName: a.positionName ?? b.positionName,
    currentClubName: a.currentClubName ?? b.currentClubName,
    wikipediaSitelinks: Math.max(a.wikipediaSitelinks ?? 0, b.wikipediaSitelinks ?? 0),
    hasImage: Boolean(a.hasImage || b.hasImage),
    importGroups,
  };
}

async function main(): Promise<void> {
  if (!fs.existsSync(IN_DIR)) {
    throw new Error(`Missing ${IN_DIR} (run imports first).`);
  }
  const files = fs
    .readdirSync(IN_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();
  if (files.length === 0) {
    throw new Error(`No group files found in ${IN_DIR}.`);
  }

  const byQid = new Map<string, RawWikidataPlayer>();
  let readCount = 0;

  for (const f of files) {
    const full = path.join(IN_DIR, f);
    const rows = readJson<RawWikidataPlayer[]>(full);
    readCount += rows.length;
    for (const r of rows) {
      const prev = byQid.get(r.wikidataQid);
      if (!prev) byQid.set(r.wikidataQid, r);
      else byQid.set(r.wikidataQid, merge(prev, r));
    }
  }

  const out = Array.from(byQid.values()).sort((a, b) => a.name.localeCompare(b.name));
  writeJsonPretty(OUT_PATH, out);
  console.log(
    `Combined ${files.length} group files, read ${readCount} rows, deduped to ${out.length} → ${OUT_PATH}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

