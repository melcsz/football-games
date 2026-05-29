import { Game } from "@/components/games/top10/Game";
import { getUtcDateString } from "@/lib/core/date";
import {
  getTop10PuzzleForUtcDate,
  isTop10DailyForUtcDate,
} from "@/lib/games/top10/puzzles";

export const dynamic = "force-dynamic";

export default function Top10DailyPage() {
  const utcToday = getUtcDateString();
  const puzzle = getTop10PuzzleForUtcDate(utcToday);
  const isTodaysDaily = isTop10DailyForUtcDate(puzzle, utcToday);

  return (
    <Game
      puzzle={puzzle}
      persistProgress
      isTodaysDaily={isTodaysDaily}
    />
  );
}
