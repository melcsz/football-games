/** yyyy-mm-dd in UTC for "today" */
export function getUtcDateString(d: Date = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Whole-day difference in UTC between two ISO date strings (yyyy-mm-dd). */
export function diffDaysUtc(fromIso: string, toIso: string): number {
  const a = Date.parse(`${fromIso}T00:00:00.000Z`);
  const b = Date.parse(`${toIso}T00:00:00.000Z`);
  return Math.floor((b - a) / 86_400_000);
}
