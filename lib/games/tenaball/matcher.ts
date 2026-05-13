import type { TenaBallPuzzle } from "@/content/games/tenaball/schema";
import type { EntityId } from "@/data/schema";

/** Strict pick: entity id must match an answer row. */
export function rankForEntityId(
  puzzle: TenaBallPuzzle,
  entityId: EntityId,
): number | null {
  const row = puzzle.answers.find((a) => a.entityId === entityId);
  return row ? row.rank : null;
}
