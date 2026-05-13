"use client";

import { PRESSURE_SECONDS } from "@/lib/core/constants";
import type { PlayMode } from "@/lib/core/score";
import { pressureMultiplier } from "@/lib/core/score";

type Props = {
  selectedMode: PlayMode | null;
  onSelect: (mode: PlayMode) => void;
};

const baseCard =
  "rounded-2xl border px-5 py-6 text-left shadow-sm transition-transform duration-150 hover:scale-[1.02] active:scale-[0.99]";

export function ModePicker({ selectedMode, onSelect }: Props) {
  const mult = pressureMultiplier();
  const chillSelected = selectedMode === "chill";
  const rankedSelected = selectedMode === "pressure";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => onSelect("chill")}
        className={`${baseCard} border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--primary)]/20 ${
          chillSelected
            ? "ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--background)]"
            : ""
        }`}
      >
        <span className="font-sans text-xl font-black tracking-tight text-foreground">
          Casual Mode
        </span>
        <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
          No timer. Work through the board at your own pace.
        </p>
        <p className="mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--foreground-muted)]">
          Score = answers found
        </p>
      </button>
      <button
        type="button"
        onClick={() => onSelect("pressure")}
        className={`${baseCard} border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--ranked)]/30 ${
          rankedSelected
            ? "border-[var(--ranked)]/35 bg-[var(--ranked-muted)] ring-2 ring-[var(--ranked)] ring-offset-2 ring-offset-[var(--background)]"
            : ""
        }`}
      >
        <span className="font-sans text-xl font-black tracking-tight text-[var(--ranked)]">
          Ranked Mode
        </span>
        <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
          {PRESSURE_SECONDS} seconds on the clock. Clear the board for a ×{mult}{" "}
          score boost.
        </p>
        <p className="mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--ranked)]">
          Timed · ranked multiplier on a full clear
        </p>
      </button>
    </div>
  );
}
