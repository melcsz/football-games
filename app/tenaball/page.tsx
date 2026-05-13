import { Game } from "@/components/games/tenaball/Game";
import { getUtcDateString } from "@/lib/core/date";
import {
  getTenaBallPuzzleForUtcDate,
  isTenaBallDailyForUtcDate,
} from "@/lib/games/tenaball/puzzles";

export const dynamic = "force-dynamic";

export default function TenaballDailyPage() {
  const utcToday = getUtcDateString();
  const puzzle = getTenaBallPuzzleForUtcDate(utcToday);
  const isTodaysDaily = isTenaBallDailyForUtcDate(puzzle, utcToday);

  return (
    <Game
      puzzle={puzzle}
      persistProgress
      isTodaysDaily={isTodaysDaily}
    />
  );
}
