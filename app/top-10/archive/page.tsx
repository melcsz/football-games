import Link from "next/link";
import { getSortedTop10Puzzles } from "@/lib/games/top10/puzzles";

export const metadata = {
  title: "Top 10 · Archive",
};

export default function Top10ArchivePage() {
  const puzzles = getSortedTop10Puzzles();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-black text-foreground">
        Top 10 archive
      </h1>
      <p className="mt-2 text-[var(--foreground-muted)]">
        Replay older boards — the daily rotation on the home game still advances
        on UTC midnight.
      </p>
      <ul className="mt-8 space-y-3">
        {puzzles.map((p) => (
          <li key={p.id}>
            <Link
              href={`/top-10/${p.id}`}
              className="flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-3 shadow-sm transition hover:border-[var(--primary)]/35 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-display text-lg font-bold text-foreground">
                #{p.id} · {p.question}
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--foreground-muted)]">
                {p.publishDate} · {p.category}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
