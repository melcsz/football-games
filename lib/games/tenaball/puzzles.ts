import type { TenaBallPuzzle } from "@/content/games/tenaball/schema";
import { ALL_TENABALL_PUZZLES } from "@/content/games/tenaball/registry";
import { diffDaysUtc } from "@/lib/core/date";

export function getSortedTenaBallPuzzles(): TenaBallPuzzle[] {
  return [...ALL_TENABALL_PUZZLES].sort((a, b) =>
    a.publishDate.localeCompare(b.publishDate),
  );
}

export function getTenaBallPuzzleForUtcDate(isoDate: string): TenaBallPuzzle {
  const sorted = getSortedTenaBallPuzzles();
  const launch = sorted[0].publishDate;
  const delta = diffDaysUtc(launch, isoDate);
  const idx = delta >= 0 ? delta % sorted.length : 0;
  return sorted[idx];
}

export function getTenaBallPuzzleById(id: string): TenaBallPuzzle | undefined {
  return ALL_TENABALL_PUZZLES.find((p) => p.id === id);
}

export function isTenaBallDailyForUtcDate(
  puzzle: TenaBallPuzzle,
  utcIsoDate: string,
): boolean {
  return getTenaBallPuzzleForUtcDate(utcIsoDate).id === puzzle.id;
}
