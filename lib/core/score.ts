export type PlayMode = "chill" | "pressure";

const PRESSURE_MULTIPLIER = 1.5;

/** Final score: chill = raw count; pressure = count * 1.5 (one decimal). */
export function computeFinalScore(foundCount: number, mode: PlayMode): number {
  if (mode === "chill") return foundCount;
  return Math.round(foundCount * PRESSURE_MULTIPLIER * 10) / 10;
}

export function pressureMultiplier(): number {
  return PRESSURE_MULTIPLIER;
}
