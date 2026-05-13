import type { Entity, EntityKind } from "@/data/schema";

/** Same normalization idea as legacy matcher — strip accents, lowercase alnum. */
export function normalizeSearchToken(raw: string): string {
  const lower = raw.trim().toLowerCase();
  const noDiacritics = lower
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return noDiacritics.replace(/[^a-z0-9]/g, "");
}

export type SearchHit = {
  entity: Entity;
  score: number;
};

function tokensFromString(s: string): string[] {
  const out = new Set<string>();
  const n = normalizeSearchToken(s);
  if (n.length) out.add(n);
  for (const part of s.split(/[\s.-]+/).filter(Boolean)) {
    const p = normalizeSearchToken(part);
    if (p.length >= 3) out.add(p);
  }
  return Array.from(out);
}

function scoreToken(tokenNorm: string, candidateNorm: string): number {
  if (!tokenNorm || !candidateNorm) return 0;
  if (candidateNorm === tokenNorm) return 100;
  if (candidateNorm.startsWith(tokenNorm)) return 80;
  if (candidateNorm.includes(tokenNorm)) return 50;
  return 0;
}

/** Search within a pre-filtered entity list (by kind). */
export function rankEntities(
  entities: Entity[],
  query: string,
  excludeIds?: Set<string>,
  limit = 8,
): SearchHit[] {
  const token = normalizeSearchToken(query);
  if (token.length === 0) return [];
  const exclude = excludeIds ?? new Set<string>();

  const hits: SearchHit[] = [];

  for (const entity of entities) {
    if (exclude.has(entity.id)) continue;
    // Prioritize matches on canonical name, then fall back to aliases.
    let bestName = 0;
    for (const cand of tokensFromString(entity.name)) {
      bestName = Math.max(bestName, scoreToken(token, cand));
    }
    let bestAlias = 0;
    for (const alias of entity.aliases ?? []) {
      for (const cand of tokensFromString(alias)) {
        bestAlias = Math.max(bestAlias, scoreToken(token, cand));
      }
    }
    // Name wins ties; alias matches remain valid and can win if stronger.
    const best = Math.max(bestName, bestAlias - 1);
    if (best > 0) hits.push({ entity, score: best });
  }

  hits.sort(
    (a, b) =>
      b.score - a.score || a.entity.name.localeCompare(b.entity.name),
  );
  return hits.slice(0, limit);
}

export function entitiesMatchingKinds(
  all: readonly Entity[],
  kinds: EntityKind[],
): Entity[] {
  const set = new Set(kinds);
  return all.filter((e) => set.has(e.kind));
}
