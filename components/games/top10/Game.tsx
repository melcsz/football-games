"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Top10Puzzle } from "@/content/games/top10/schema";
import type { Entity } from "@/data/schema";
import { rankForEntityId } from "@/lib/games/top10/matcher";
import type { PlayMode } from "@/lib/core/score";
import { computeFinalScore } from "@/lib/core/score";
import { getUtcDateString } from "@/lib/core/date";
import {
  clearInProgress,
  loadStats,
  saveStats,
  updateStreakAfterDailyComplete,
} from "@/lib/core/storage";
import { PRESSURE_SECONDS } from "@/lib/core/constants";
import { ModePicker } from "@/components/games/top10/ModePicker";
import { EntityPicker } from "@/components/games/top10/EntityPicker";
import { AnswerList } from "@/components/games/top10/AnswerList";
import { Timer } from "@/components/games/top10/Timer";
import { ResultModal } from "@/components/games/top10/ResultModal";

type Phase = "idle" | "ready" | "playing" | "done";

export type GameProps = {
  puzzle: Top10Puzzle;
  persistProgress: boolean;
  isTodaysDaily: boolean;
};

const btnGhost =
  "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground-muted)] shadow-sm transition-transform duration-150 hover:scale-[1.02] hover:border-[var(--primary)]/25 hover:text-foreground active:scale-[0.99]";

const btnPrimary =
  "rounded-xl border border-[var(--primary)]/40 bg-[var(--primary)] px-4 py-2.5 text-sm font-black uppercase tracking-wide text-[var(--primary-foreground)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.99] btn-primary-glow";

const btnStart =
  "w-full rounded-2xl border border-[var(--primary)]/35 bg-[var(--primary)] py-4 text-base font-black uppercase tracking-[0.2em] text-[var(--primary-foreground)] shadow-sm transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] btn-primary-glow sm:py-5 sm:text-lg";

export function Game({ puzzle, persistProgress, isTodaysDaily }: GameProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [mode, setMode] = useState<PlayMode | null>(null);
  const [foundRanks, setFoundRanks] = useState<number[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [deadlineMs, setDeadlineMs] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [pickerReset, setPickerReset] = useState(0);

  const foundRef = useRef(foundRanks);
  const modeRef = useRef<PlayMode | null>(null);

  useEffect(() => {
    foundRef.current = foundRanks;
  }, [foundRanks]);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const excludeEntityIds = useMemo(() => {
    const s = new Set<string>();
    for (const r of foundRanks) {
      const row = puzzle.answers.find((a) => a.rank === r);
      if (row) s.add(row.entityId);
    }
    return s;
  }, [foundRanks, puzzle.answers]);

  const flashToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const finishGame = useCallback(
    (ranks: number[]) => {
      setPhase("done");
      setShowResult(true);
      setDeadlineMs(null);

      const m = modeRef.current;
      if (!m) return;

      let stats = loadStats();
      stats = clearInProgress(stats);
      const rawFound = ranks.length;
      const finalScore = computeFinalScore(rawFound, m);
      stats.byPuzzle[puzzle.id] = {
        score: finalScore,
        rawFound,
        mode: m,
        foundRanks: ranks,
        completedAt: new Date().toISOString(),
      };
      if (!stats.played.includes(puzzle.id)) {
        stats.played.push(puzzle.id);
      }
      stats.totalScore += finalScore;
      if (m === "chill") stats.chillGames += 1;
      else stats.pressureGames += 1;
      if (isTodaysDaily) {
        stats = updateStreakAfterDailyComplete(stats, getUtcDateString());
      }
      saveStats(stats);
    },
    [isTodaysDaily, puzzle.id],
  );

  const handleExpire = useCallback(() => {
    if (modeRef.current !== "pressure") return;
    finishGame(foundRef.current);
  }, [finishGame]);

  useEffect(() => {
    if (!persistProgress || phase !== "playing" || !mode) return;

    const stats = loadStats();
    const timeRemainingMs =
      mode === "pressure" && deadlineMs
        ? Math.max(0, deadlineMs - Date.now())
        : undefined;

    const startedAt =
      stats.inProgress?.puzzleId === puzzle.id && stats.inProgress.startedAt
        ? stats.inProgress.startedAt
        : new Date().toISOString();

    saveStats({
      ...stats,
      inProgress: {
        puzzleId: puzzle.id,
        mode,
        foundRanks,
        wrongGuesses,
        startedAt,
        utcDate: getUtcDateString(),
        timeRemainingMs,
      },
    });
  }, [
    deadlineMs,
    foundRanks,
    mode,
    persistProgress,
    phase,
    puzzle.id,
    wrongGuesses,
  ]);

  useEffect(() => {
    if (!persistProgress) return;
    const stats = loadStats();
    const ip = stats.inProgress;
    if (!ip || ip.puzzleId !== puzzle.id) return;
    const today = getUtcDateString();
    if (ip.utcDate !== today) return;

    setMode(ip.mode);
    setFoundRanks(ip.foundRanks);
    setWrongGuesses(ip.wrongGuesses ?? []);
    setPhase("playing");

    if (ip.mode === "pressure") {
      if (
        ip.timeRemainingMs !== undefined &&
        ip.timeRemainingMs > 0 &&
        ip.startedAt
      ) {
        setDeadlineMs(Date.now() + ip.timeRemainingMs);
      } else if (ip.startedAt) {
        const elapsed = Date.now() - new Date(ip.startedAt).getTime();
        const left = PRESSURE_SECONDS * 1000 - elapsed;
        setDeadlineMs(Date.now() + Math.max(0, left));
      }
    }
  }, [persistProgress, puzzle.id]);

  function selectMode(selected: PlayMode) {
    setMode(selected);
    setPhase("ready");
    setFoundRanks([]);
    setWrongGuesses([]);
    setToast(null);
    setDeadlineMs(null);
    setPickerReset((k) => k + 1);
  }

  function beginGame() {
    const selected = mode;
    if (!selected || phase !== "ready") return;

    setFoundRanks([]);
    setWrongGuesses([]);
    setPhase("playing");
    setToast(null);
    setPickerReset((k) => k + 1);

    const stats = loadStats();
    const startedAt = new Date().toISOString();
    if (selected === "pressure") {
      const dl = Date.now() + PRESSURE_SECONDS * 1000;
      setDeadlineMs(dl);
      if (persistProgress) {
        saveStats({
          ...stats,
          inProgress: {
            puzzleId: puzzle.id,
            mode: selected,
            foundRanks: [],
            wrongGuesses: [],
            startedAt,
            utcDate: getUtcDateString(),
            timeRemainingMs: PRESSURE_SECONDS * 1000,
          },
        });
      }
    } else {
      setDeadlineMs(null);
      if (persistProgress) {
        saveStats({
          ...stats,
          inProgress: {
            puzzleId: puzzle.id,
            mode: selected,
            foundRanks: [],
            wrongGuesses: [],
            startedAt,
            utcDate: getUtcDateString(),
          },
        });
      }
    }
  }

  function onPickEntity(entity: Entity) {
    if (phase !== "playing" || !mode) return;

    const rank = rankForEntityId(puzzle, entity.id);
    if (rank === null) {
      setWrongGuesses((w) => [...w, entity.name]);
      flashToast("Not in the top ten.");
      setPickerReset((k) => k + 1);
      return;
    }
    if (foundRanks.includes(rank)) {
      flashToast("Already found.");
      setPickerReset((k) => k + 1);
      return;
    }
    const next = [...foundRanks, rank].sort((a, b) => a - b);
    setFoundRanks(next);
    setPickerReset((k) => k + 1);
    if (next.length === 10) {
      finishGame(next);
    }
  }

  function giveUp() {
    if (phase !== "playing") return;
    finishGame(foundRanks);
  }

  const showMeta = phase === "done";
  const modeLabel =
    mode === "pressure" ? "Ranked Mode" : mode === "chill" ? "Casual Mode" : null;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:space-y-8 sm:py-10">
      <header className="space-y-3 border-b border-[var(--border-subtle)] pb-6 sm:pb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-[var(--primary)]">
          Top 10 · {puzzle.category} · #{puzzle.id}
        </p>
        <h1 className="font-sans text-2xl font-black leading-[1.1] tracking-tight text-foreground sm:text-4xl sm:leading-[1.08]">
          {puzzle.question}
        </h1>
        {puzzle.subtitle ? (
          <p className="max-w-2xl text-sm leading-relaxed text-[var(--foreground-muted)]">
            {puzzle.subtitle}
          </p>
        ) : null}
      </header>

      {phase === "idle" || phase === "ready" ? (
        <div className="space-y-6">
          <ModePicker
            selectedMode={mode}
            onSelect={selectMode}
          />
          {phase === "ready" && mode ? (
            <div className="space-y-3">
              <p className="text-center text-sm text-[var(--foreground-muted)]">
                {modeLabel}
              </p>
              <button type="button" onClick={beginGame} className={btnStart}>
                Start game
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {phase === "playing" || phase === "done" ? (
        <>
          {phase === "playing" && mode ? (
            <div className="sticky top-14 z-30 -mx-4 border-b border-[var(--border-subtle)] bg-[var(--background)]/95 px-4 py-3 shadow-sm backdrop-blur-md sm:top-16">
              <EntityPicker
                puzzle={puzzle}
                excludeIds={excludeEntityIds}
                disabled={phase !== "playing"}
                resetSignal={pickerReset}
                onPick={onPickEntity}
              />
            </div>
          ) : null}

          {phase === "playing" && mode === "pressure" && deadlineMs ? (
            <Timer deadlineMs={deadlineMs} onExpire={handleExpire} />
          ) : null}

          <section aria-label="Top ten board">
            <AnswerList
              puzzle={puzzle}
              foundRanks={foundRanks}
              showMeta={showMeta}
            />
          </section>

          {phase === "playing" && mode ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button type="button" onClick={giveUp} className={btnGhost}>
                End game &amp; show results
              </button>
              <p className="font-mono text-xs tabular-nums text-[var(--foreground-muted)]">
                <span className="font-semibold text-[var(--primary)]">
                  {foundRanks.length}
                </span>
                /10 found
              </p>
            </div>
          ) : null}
        </>
      ) : null}

      {wrongGuesses.length > 0 && phase === "playing" ? (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--foreground-muted)]">
            Misses
          </p>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            {wrongGuesses.slice(-8).join(" · ")}
          </p>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-5 py-2.5 text-center text-sm font-semibold text-foreground shadow-lg">
          {toast}
        </div>
      ) : null}

      {phase === "done" && mode && showResult ? (
        <ResultModal
          puzzle={puzzle}
          foundRanks={foundRanks}
          mode={mode}
          onClose={() => setShowResult(false)}
        />
      ) : null}

      {phase === "done" && !showResult && mode ? (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 text-center shadow-sm">
          <p className="text-sm text-[var(--foreground-muted)]">
            Results hidden — open the summary when you&apos;re ready.
          </p>
          <button
            type="button"
            onClick={() => setShowResult(true)}
            className={`mt-4 ${btnPrimary}`}
          >
            Show results
          </button>
        </div>
      ) : null}
    </div>
  );
}
