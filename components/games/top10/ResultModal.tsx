"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Top10Puzzle } from "@/content/games/top10/schema";
import type { PlayMode } from "@/lib/core/score";
import { computeFinalScore } from "@/lib/core/score";
import { buildShareText } from "@/lib/core/share";
import { AnswerList } from "@/components/games/top10/AnswerList";

type Props = {
  puzzle: Top10Puzzle;
  foundRanks: number[];
  mode: PlayMode;
  onClose: () => void;
};

function flavorLine(count: number): string {
  if (count === 10) return "Perfect board — full marks.";
  if (count >= 7) return "Strong round. Most of the list locked in.";
  if (count >= 4) return "Solid effort — a few slots left for next time.";
  if (count >= 1) return "Good start — keep building from here.";
  return "Tough board — reset and try another puzzle when you’re ready.";
}

export function ResultModal({ puzzle, foundRanks, mode, onClose }: Props) {
  const count = foundRanks.length;
  const finalScore = computeFinalScore(count, mode);

  async function copyShare() {
    const text = buildShareText({ puzzle, foundRanks, mode });
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* noop */
    }
  }

  async function nativeShare() {
    const text = buildShareText({ puzzle, foundRanks, mode });
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: "WeKnowBall Top 10",
        text,
      });
    } catch {
      /* cancelled */
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0b0e14]/78 p-4 backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 shadow-xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--primary)]">
              Results
            </p>
            <h2 className="font-sans text-3xl font-black tracking-tight text-foreground">
              {count}/10
              {mode === "pressure" ? (
                <span className="text-lg font-bold text-[var(--ranked)]">
                  {" "}
                  ({finalScore} pts)
                </span>
              ) : null}
            </h2>
            <p className="mt-2 text-sm font-medium text-[var(--foreground-muted)]">
              {flavorLine(count)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-sm text-[var(--foreground-muted)] transition-transform hover:scale-105 hover:border-[var(--primary)]/25 hover:text-foreground"
          >
            Close
          </button>
        </div>

        <div className="mb-6">
          <AnswerList puzzle={puzzle} foundRanks={foundRanks} showMeta />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => void copyShare()}
            className="flex-1 rounded-xl border border-[var(--primary)]/35 bg-[var(--primary)] px-4 py-3 font-sans text-sm font-black uppercase tracking-wide text-[var(--primary-foreground)] transition-transform hover:scale-[1.02] active:scale-[0.99] btn-primary-glow"
          >
            Copy result
          </button>
          <button
            type="button"
            onClick={() => void nativeShare()}
            className="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3 font-semibold text-foreground shadow-sm transition-transform hover:scale-[1.02] hover:border-[var(--primary)]/20 active:scale-[0.99]"
          >
            Share…
          </button>
          <Link
            href="/top-10/archive"
            className="flex flex-1 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3 text-center text-sm font-semibold text-foreground shadow-sm transition-transform hover:scale-[1.02] hover:border-[var(--primary)]/20 active:scale-[0.99]"
          >
            Archive
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
