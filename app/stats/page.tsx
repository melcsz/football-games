"use client";

import { useEffect, useMemo, useState } from "react";
import type { GameStats } from "@/lib/core/storage";
import { loadStats } from "@/lib/core/storage";

export default function StatsPage() {
  const [stats, setStats] = useState<GameStats | null>(null);

  useEffect(() => {
    const refresh = () => setStats(loadStats());
    refresh();
    window.addEventListener("bk-storage", refresh);
    return () => window.removeEventListener("bk-storage", refresh);
  }, []);

  const breakdown = useMemo(() => {
    if (!stats) return null;
    const scores = Object.values(stats.byPuzzle).map((p) => p.rawFound);
    const dist = new Map<number, number>();
    for (const s of scores) {
      dist.set(s, (dist.get(s) ?? 0) + 1);
    }
    return Array.from(dist.entries()).sort((a, b) => b[0] - a[0]);
  }, [stats]);

  if (!stats) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-[var(--foreground-muted)]">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div>
        <h1 className="font-display text-3xl font-black text-foreground">
          Your numbers
        </h1>
        <p className="mt-2 text-[var(--foreground-muted)]">
          Stats stay in this browser only — nothing is sent to a server.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Current streak" value={`${stats.streak} days`} />
        <StatCard label="Best streak" value={`${stats.maxStreak} days`} />
        <StatCard
          label="Total score logged"
          value={stats.totalScore.toFixed(1)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Puzzles cleared" value={`${stats.played.length}`} />
        <StatCard
          label="Modes played"
          value={`Casual ${stats.chillGames} · Ranked ${stats.pressureGames}`}
        />
      </div>

      <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-sm">
        <h2 className="font-display text-lg font-black text-foreground">
          Score distribution (raw /10)
        </h2>
        {breakdown && breakdown.length > 0 ? (
          <ul className="mt-4 space-y-2 font-mono text-sm">
            {breakdown.map(([score, count]) => (
              <li
                key={score}
                className="flex items-center justify-between border-b border-[var(--border-subtle)] py-2 text-foreground"
              >
                <span>{score}/10</span>
                <span className="text-[var(--foreground-muted)]">{count}×</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-[var(--foreground-muted)]">
            Play a board — your histogram shows up here.
          </p>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 shadow-sm">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--foreground-muted)]">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-black text-foreground">
        {value}
      </p>
    </div>
  );
}
