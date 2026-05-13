"use client";

import { useEffect, useState } from "react";
import { loadStats } from "@/lib/core/storage";

export function StatsBadge() {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    const refresh = () => setStreak(loadStats().streak);
    refresh();
    window.addEventListener("bk-storage", refresh);
    return () => window.removeEventListener("bk-storage", refresh);
  }, []);

  if (streak === null) return null;

  return (
    <span className="rounded-sm border border-white/10 bg-[var(--surface)] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      Streak {streak}
    </span>
  );
}
