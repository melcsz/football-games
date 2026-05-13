import { notFound } from "next/navigation";
import { Game } from "@/components/games/tenaball/Game";
import { getUtcDateString } from "@/lib/core/date";
import {
  getTenaBallPuzzleById,
  isTenaBallDailyForUtcDate,
} from "@/lib/games/tenaball/puzzles";

type Props = { params: { id: string } };

export function generateStaticParams() {
  return Array.from({ length: 14 }, (_, i) => ({
    id: String(i + 1).padStart(4, "0"),
  }));
}

export default function TenaballPuzzlePage({ params }: Props) {
  const puzzle = getTenaBallPuzzleById(params.id);
  if (!puzzle) notFound();

  const utcToday = getUtcDateString();
  const isTodaysDaily = isTenaBallDailyForUtcDate(puzzle, utcToday);

  return (
    <Game
      puzzle={puzzle}
      persistProgress={false}
      isTodaysDaily={isTodaysDaily}
    />
  );
}
