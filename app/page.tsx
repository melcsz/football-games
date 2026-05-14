import { DailyDebate } from "@/components/home/DailyDebate";
import { GamesGrid } from "@/components/home/GamesGrid";
import { games } from "@/data/games";

export default function HomePage() {
  return (
    <section className="pb-10 text-[#F8FAFC]">
      <DailyDebate />
      <GamesGrid games={games} />
    </section>
  );
}