/** Strip accents, lowercase, keep only [a-z0-9] — matches search normalization spirit. */
export function normalizeName(raw: string): string {
  const lower = raw.trim().toLowerCase();
  const noDiacritics = lower
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return noDiacritics.replace(/[^a-z0-9]/g, "");
}

export function dedupeStrings(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of items) {
    const t = s.trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}
