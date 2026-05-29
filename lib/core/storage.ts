import type { PlayMode } from "@/lib/core/score";

/** Cross-game storage v2 (extend `games` when adding new titles). */
export type GameId = "tenaball";

const STORAGE_KEY = "weknowball:v1";
const LEGACY_KEY = "ballknowledge-tenaball-v1";

export type PuzzleCompletion = {
  score: number;
  rawFound: number;
  mode: PlayMode;
  foundRanks: number[];
  completedAt: string;
};

export type InProgressState = {
  puzzleId: string;
  mode: PlayMode;
  foundRanks: number[];
  wrongGuesses: string[];
  timeRemainingMs?: number;
  deadlineAt?: string;
  startedAt: string;
  utcDate: string;
};

export type GameStats = {
  played: string[];
  streak: number;
  maxStreak: number;
  lastDailyUtcDate: string | null;
  totalScore: number;
  chillGames: number;
  pressureGames: number;
  byPuzzle: Record<string, PuzzleCompletion>;
  inProgress?: InProgressState;
};

export type StoredRoot = {
  version: 2;
  games: Partial<Record<GameId, GameStats>>;
};

const defaultGameStats = (): GameStats => ({
  played: [],
  streak: 0,
  maxStreak: 0,
  lastDailyUtcDate: null,
  totalScore: 0,
  chillGames: 0,
  pressureGames: 0,
  byPuzzle: {},
});

function mergeGameStats(partial?: Partial<GameStats>): GameStats {
  const d = defaultGameStats();
  if (!partial) return d;
  return {
    ...d,
    ...partial,
    played: Array.isArray(partial.played) ? partial.played : d.played,
    byPuzzle:
      partial.byPuzzle && typeof partial.byPuzzle === "object"
        ? partial.byPuzzle
        : d.byPuzzle,
    chillGames:
      typeof partial.chillGames === "number" ? partial.chillGames : d.chillGames,
    pressureGames:
      typeof partial.pressureGames === "number"
        ? partial.pressureGames
        : d.pressureGames,
    streak: typeof partial.streak === "number" ? partial.streak : d.streak,
    maxStreak:
      typeof partial.maxStreak === "number" ? partial.maxStreak : d.maxStreak,
    totalScore:
      typeof partial.totalScore === "number" ? partial.totalScore : d.totalScore,
    lastDailyUtcDate:
      typeof partial.lastDailyUtcDate === "string" ||
      partial.lastDailyUtcDate === null
        ? partial.lastDailyUtcDate
        : d.lastDailyUtcDate,
    inProgress: partial.inProgress,
  };
}

/** Legacy v1 shape (single-game). */
type LegacyV1 = GameStats;

function migrateLegacyV1(raw: string): StoredRoot {
  const v = JSON.parse(raw) as LegacyV1;
  return {
    version: 2,
    games: { tenaball: mergeGameStats(v) },
  };
}

function parseRoot(raw: string | null): StoredRoot {
  if (!raw) {
    return { version: 2, games: {} };
  }
  try {
    const v = JSON.parse(raw) as StoredRoot & { version?: number };
    if (v.version === 2 && v.games && typeof v.games === "object") {
      const games: Partial<Record<GameId, GameStats>> = { ...v.games };
      if (v.games.tenaball) {
        games.tenaball = mergeGameStats(v.games.tenaball);
      }
      return {
        version: 2,
        games,
      };
    }
  } catch {
    /* fall through */
  }
  return { version: 2, games: {} };
}

function loadRoot(): StoredRoot {
  if (typeof window === "undefined") {
    return { version: 2, games: {} };
  }

  const cur = window.localStorage.getItem(STORAGE_KEY);
  if (cur) {
    return parseRoot(cur);
  }

  const legacy = window.localStorage.getItem(LEGACY_KEY);
  if (legacy) {
    const migrated = migrateLegacyV1(legacy);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    window.localStorage.removeItem(LEGACY_KEY);
    return migrated;
  }

  return { version: 2, games: {} };
}

function saveRoot(root: StoredRoot): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(root));
  window.dispatchEvent(new Event("bk-storage"));
}

export function loadGameStats(gameId: GameId): GameStats {
  const root = loadRoot();
  return mergeGameStats(root.games[gameId]);
}

export function saveGameStats(gameId: GameId, stats: GameStats): void {
  const root = loadRoot();
  root.games[gameId] = stats;
  saveRoot(root);
}

/** @deprecated prefer loadGameStats — kept for incremental refactor */
export function loadStats(): GameStats {
  return loadGameStats("tenaball");
}

/** @deprecated prefer saveGameStats */
export function saveStats(stats: GameStats): void {
  saveGameStats("tenaball", stats);
}

export function clearInProgress(stats: GameStats): GameStats {
  const next = { ...stats };
  delete next.inProgress;
  return next;
}

export function updateStreakAfterDailyComplete(
  stats: GameStats,
  completedUtcDate: string,
): GameStats {
  const next = { ...stats };
  const prev = next.lastDailyUtcDate;

  if (prev === completedUtcDate) {
    return next;
  }

  if (!prev) {
    next.streak = 1;
  } else {
    const gap = diffUtcDays(prev, completedUtcDate);
    if (gap === 1) {
      next.streak = next.streak + 1;
    } else if (gap === 0) {
      /* noop */
    } else {
      next.streak = 1;
    }
  }

  next.lastDailyUtcDate = completedUtcDate;
  next.maxStreak = Math.max(next.maxStreak, next.streak);
  return next;
}

function diffUtcDays(a: string, b: string): number {
  const d = Date.parse(`${b}T00:00:00.000Z`) - Date.parse(`${a}T00:00:00.000Z`);
  return Math.round(d / 86_400_000);
}
