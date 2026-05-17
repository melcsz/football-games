import type { Top10Puzzle } from "@/content/games/top10/schema";
import type { EntityId } from "@/data/schema";

/** Strict pick: entity id must match an answer row. */
export function rankForEntityId(
  puzzle: Top10Puzzle,
  entityId: EntityId,
): number | null {
  const row = puzzle.answers.find((a) => a.entityId === entityId);
  return row ? row.rank : null;
}
