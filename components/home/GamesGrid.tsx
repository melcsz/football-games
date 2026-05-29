import type { Game } from "@/types/game";
import { GameCard } from "./GameCard";

type GamesGridProps = {
  games: Game[];
};

export function GamesGrid({ games }: GamesGridProps) {
  return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {games.map((game) => (
          <GameCard key={game.title} {...game} />
      ))}
    </div>
  );
}