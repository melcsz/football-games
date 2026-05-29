"use client";

import { PRESSURE_SECONDS } from "@/lib/core/constants";
import type { PlayMode } from "@/lib/core/score";
import { pressureMultiplier } from "@/lib/core/score";

type Props = {
  selectedMode: PlayMode | null;
  onSelect: (mode: PlayMode) => void;
};

const baseCard =
  "rounded-2xl border px-4 py-4 text-left shadow-sm transition-transform duration-150 hover:scale-[1.02] active:scale-[0.99] sm:px-5 sm:py-6";

export function ModePicker({ selectedMode, onSelect }: Props) {
  const mult = pressureMultiplier();
  const chillSelected = selectedMode === "chill";
  const rankedSelected = selectedMode === "pressure";

  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
      <button
        type="button"
        onClick={() => onSelect("chill")}
        className={`${baseCard} border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--primary)]/20 ${
          chillSelected
            ? "ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--background)]"
            : ""
        }`}
      >
        <span className="font-sans text-lg font-black tracking-tight text-foreground sm:text-xl">
          Casual Mode
        </span>
        <p className="mt-1.5 text-xs leading-relaxed text-[var(--foreground-muted)] sm:mt-2 sm:text-sm">
          No timer. Work through the board at your own pace.
        </p>
        <p className="mt-3 font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--foreground-muted)] sm:mt-4 sm:text-[10px] sm:tracking-[0.3em]">
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
        <span className="font-sans text-lg font-black tracking-tight text-[var(--ranked)] sm:text-xl">
          Ranked Mode
        </span>
        <p className="mt-1.5 text-xs leading-relaxed text-[var(--foreground-muted)] sm:mt-2 sm:text-sm">
          {PRESSURE_SECONDS} seconds on the clock. Clear the board for a ×{mult}{" "}
          score boost.
        </p>
        <p className="mt-3 font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--ranked)] sm:mt-4 sm:text-[10px] sm:tracking-[0.3em]">
          Timed · ranked multiplier on a full clear
        </p>
      </button>
    </div>
  );
}
