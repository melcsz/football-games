import type { Top10Puzzle } from "@/content/games/top10/schema";
import { ALL_TOP10_PUZZLES } from "@/content/games/top10/registry";
import { diffDaysUtc } from "@/lib/core/date";

export function getSortedTop10Puzzles(): Top10Puzzle[] {
  return [...ALL_TOP10_PUZZLES].sort((a, b) =>
    a.publishDate.localeCompare(b.publishDate),
  );
}

export function getTop10PuzzleForUtcDate(isoDate: string): Top10Puzzle {
  const sorted = getSortedTop10Puzzles();
  const launch = sorted[0].publishDate;
  const delta = diffDaysUtc(launch, isoDate);
  const idx = delta >= 0 ? delta % sorted.length : 0;
  return sorted[idx];
}

export function getTop10PuzzleById(id: string): Top10Puzzle | undefined {
  return ALL_TOP10_PUZZLES.find((p) => p.id === id);
}

export function isTop10DailyForUtcDate(
  puzzle: Top10Puzzle,
  utcIsoDate: string,
): boolean {
  return getTop10PuzzleForUtcDate(utcIsoDate).id === puzzle.id;
}
