import type { Top10Puzzle } from "@/content/games/top10/schema";
import type { PlayMode } from "@/lib/core/score";
import { computeFinalScore, pressureMultiplier } from "@/lib/core/score";

const SITE_NAME = "WeKnowBall";
const GAME_NAME = "Top 10";

function baseUrl(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return "https://weknowball.com";
}

export function buildShareText(params: {
  puzzle: Top10Puzzle;
  foundRanks: number[];
  mode: PlayMode;
}): string {
  const { puzzle, foundRanks, mode } = params;
  const count = foundRanks.length;
  const finalScore = computeFinalScore(count, mode);
  const modeBit =
    mode === "pressure"
      ? ` (Ranked ×${pressureMultiplier()} = ${finalScore})`
      : "";

  const lines: string[] = [];
  lines.push(
    `${SITE_NAME} ${GAME_NAME} #${puzzle.id} — ${count}/10${modeBit}`,
  );

  const row = Array.from({ length: 10 }, (_, i) => {
    const rank = i + 1;
    return foundRanks.includes(rank) ? "🟢" : "⚪";
  }).join("");
  lines.push(row);
  lines.push(`${baseUrl()}/top-10/${puzzle.id}`);
  return lines.join("\n");
}

export function shareTitle(puzzle: Top10Puzzle): string {
  return `${GAME_NAME} · ${puzzle.question}`;
}
