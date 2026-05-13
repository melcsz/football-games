/**
 * Stage 2: score imported raw players, write data/raw/scored-players.json
 */
import { readJson, writeJsonPretty } from "@/scripts/lib/io";
import type { RawWikidataPlayer, ScoredPlayer } from "@/scripts/lib/raw-player";

const IN_PATH = "data/raw/wikidata-players.json";
const OUT_PATH = "data/raw/scored-players.json";

export type { ScoredPlayer } from "@/scripts/lib/raw-player";

function scorePlayer(p: RawWikidataPlayer): number {
  let score = 0;
  const groups = new Set(p.importGroups ?? []);
  const top5 = [
    "premier-league-current",
    "la-liga-current",
    "serie-a-current",
    "bundesliga-current",
    "ligue-1-current",
  ];
  if (top5.some((g) => groups.has(g))) score += 150;
  if (groups.has("global-legends")) score += 100;

  const sl = p.wikipediaSitelinks ?? 0;
  if (sl >= 30) score += 60;
  else if (sl >= 10) score += 40;
  if (p.hasImage) score += 30;
  if (p.currentClubName) score += 20;
  if (p.countryName) score += 20;
  const name = (p.name ?? "").trim();
  if (!name || name.length < 3) score -= 50;
  return score;
}

async function main(): Promise<void> {
  const raw = readJson<RawWikidataPlayer[]>(IN_PATH);
  const scored: ScoredPlayer[] = raw.map((p) => ({
    ...p,
    relevanceScore: scorePlayer(p),
  }));
  scored.sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    return a.name.localeCompare(b.name);
  });
  writeJsonPretty(OUT_PATH, scored);
  console.log(`Scored ${scored.length} players → ${OUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
