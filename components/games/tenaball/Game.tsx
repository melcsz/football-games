"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { TenaBallPuzzle } from "@/content/games/tenaball/schema";
import type { Entity } from "@/data/schema";
import { rankForEntityId } from "@/lib/games/tenaball/matcher";
import type { PlayMode } from "@/lib/core/score";
import { computeFinalScore } from "@/lib/core/score";
import { getUtcDateString } from "@/lib/core/date";
import {
  clearInProgress,
  type InProgressState,
  loadStats,
  saveStats,
  updateStreakAfterDailyComplete,
} from "@/lib/core/storage";
import { PRESSURE_SECONDS } from "@/lib/core/constants";
import { ModePicker } from "@/components/games/tenaball/ModePicker";
import { EntityPicker } from "@/components/games/tenaball/EntityPicker";
import { AnswerList } from "@/components/games/tenaball/AnswerList";
import { Timer } from "@/components/games/tenaball/Timer";

type Phase = "idle" | "ready" | "playing" | "done";

export type GameProps = {
  puzzle: TenaBallPuzzle;
  persistProgress: boolean;
  isTodaysDaily: boolean;
};

const btnGhost =
  "rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--foreground-muted)] shadow-sm transition-transform duration-150 hover:scale-[1.02] hover:border-[var(--primary)]/25 hover:text-foreground active:scale-[0.99] sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm";

const btnStart =
  "w-full rounded-2xl border border-[var(--primary)]/35 bg-[var(--primary)] py-4 text-base font-black uppercase tracking-[0.2em] text-[var(--primary-foreground)] shadow-sm transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] btn-primary-glow sm:py-5 sm:text-lg";

export function Game({ puzzle, persistProgress, isTodaysDaily }: GameProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [mode, setMode] = useState<PlayMode | null>(null);
  const [foundRanks, setFoundRanks] = useState<number[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [deadlineMs, setDeadlineMs] = useState<number | null>(null);
  const [pickerReset, setPickerReset] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
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
    const isPressure = mode === "pressure" && deadlineMs;
    const timeRemainingMs = isPressure
      ? Math.max(0, deadlineMs - Date.now())
      : undefined;
    const deadlineAt = isPressure
      ? new Date(deadlineMs).toISOString()
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
        deadlineAt,
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

    modeRef.current = ip.mode;
    setMode(ip.mode);
    setFoundRanks(ip.foundRanks);
    setWrongGuesses(ip.wrongGuesses ?? []);
    setPhase("playing");

    if (ip.mode === "pressure") {
      const left = pressureTimeLeft(ip);
      setDeadlineMs(Date.now() + left);
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
    window.requestAnimationFrame(() => {
      stageRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
    });

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
            deadlineAt: new Date(dl).toISOString(),
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
  const isGameScreen = phase === "playing" || phase === "done";
  const modeLabel =
    mode === "pressure" ? "Ranked Mode" : mode === "chill" ? "Casual Mode" : null;

  return (
    <div
      ref={stageRef}
      className={`relative mx-auto w-full px-3 sm:px-4 ${
        isGameScreen
          ? "tenaball-play-surface max-w-4xl space-y-3 overflow-visible rounded-none border-0 py-0 sm:max-w-4xl sm:space-y-2.5 sm:px-0 lg:max-w-[68rem]"
          : "tenaball-stage-bg max-w-4xl space-y-5 overflow-hidden rounded-2xl border border-white/5 py-6 sm:space-y-8 sm:py-10"
      }`}
    >
      <header
        className={`border-b border-[var(--border-subtle)] ${
          isGameScreen
            ? "space-y-1 pb-3 sm:pb-2"
            : "space-y-2 pb-5 sm:space-y-3 sm:pb-8"
        }`}
      >
        <p className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] sm:text-[9px]">
          <span className="rounded bg-[#22c55e] px-1.5 py-0.5 font-black text-[#03130a]">
            TenaBall
          </span>
          <span className="text-[#facc15]">{puzzle.category}</span>
          <span className="text-white/60">#{puzzle.id}</span>
        </p>
        <h1
          className={`font-sans font-black leading-[1.1] tracking-tight text-foreground ${
            isGameScreen ? "text-lg sm:text-[1.35rem]" : "text-xl sm:text-4xl"
          }`}
        >
          {puzzle.question}
        </h1>
        {puzzle.subtitle && !isGameScreen ? (
          <p className="max-w-2xl text-xs leading-relaxed text-[var(--foreground-muted)] sm:text-sm">
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
          {phase === "playing" && mode === "pressure" && deadlineMs ? (
            <div className="ml-auto max-w-48">
              <Timer deadlineMs={deadlineMs} onExpire={handleExpire} />
            </div>
          ) : null}

          <section aria-label="Top ten board" className="relative z-0">
            <AnswerList
              puzzle={puzzle}
              foundRanks={foundRanks}
              showMeta={showMeta}
            />
          </section>

          {phase === "playing" && mode ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button type="button" onClick={giveUp} className={btnGhost}>
                  Reveal answers
                </button>
                <p className="font-mono text-xs tabular-nums text-[var(--foreground-muted)]">
                  <span className="font-semibold text-[var(--primary)]">
                    {foundRanks.length}
                  </span>
                  /10 found
                </p>
              </div>
              <div className="relative z-50 rounded-lg border border-white/10 bg-[#07111f]/92 p-2 shadow-sm backdrop-blur-md">
                <EntityPicker
                  puzzle={puzzle}
                  excludeIds={excludeEntityIds}
                  disabled={phase !== "playing"}
                  resetSignal={pickerReset}
                  onPick={onPickEntity}
                />
              </div>
            </>
          ) : null}
        </>
      ) : null}

      {wrongGuesses.length > 0 && phase === "playing" ? (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 shadow-sm">
          <p className="truncate text-xs text-[var(--foreground-muted)]">
            Misses: {wrongGuesses.slice(-5).join(" · ")}
          </p>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-5 py-2.5 text-center text-sm font-semibold text-foreground shadow-lg">
          {toast}
        </div>
      ) : null}

      {phase === "done" && mode ? (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--foreground-muted)] shadow-sm">
          Final score:{" "}
          <span className="text-[var(--primary)]">
            {computeFinalScore(foundRanks.length, mode)}
          </span>
        </div>
      ) : null}
    </div>
  );
}

function pressureTimeLeft(ip: InProgressState): number {
  if (ip.deadlineAt) {
    return Math.max(0, new Date(ip.deadlineAt).getTime() - Date.now());
  }
  if (ip.startedAt) {
    const duration = ip.timeRemainingMs ?? PRESSURE_SECONDS * 1000;
    const deadline = new Date(ip.startedAt).getTime() + duration;
    return Math.max(0, deadline - Date.now());
  }
  return ip.timeRemainingMs ?? PRESSURE_SECONDS * 1000;
}
