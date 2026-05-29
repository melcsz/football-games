import { notFound } from "next/navigation";
import { Game } from "@/components/games/top10/Game";
import { getUtcDateString } from "@/lib/core/date";
import {
  getTop10PuzzleById,
  isTop10DailyForUtcDate,
} from "@/lib/games/top10/puzzles";

type Props = { params: { id: string } };

export function generateStaticParams() {
  return Array.from({ length: 14 }, (_, i) => ({
    id: String(i + 1).padStart(4, "0"),
  }));
}

export default function Top10PuzzlePage({ params }: Props) {
  const puzzle = getTop10PuzzleById(params.id);
  if (!puzzle) notFound();

  const utcToday = getUtcDateString();
  const isTodaysDaily = isTop10DailyForUtcDate(puzzle, utcToday);

  return (
    <Game
      puzzle={puzzle}
      persistProgress={false}
      isTodaysDaily={isTodaysDaily}
    />
  );
}
