import { requireEntity } from "@/data/index";
import type { EntityKind } from "@/data/schema";
import j0001 from "./puzzles/0001.json";
import j0002 from "./puzzles/0002.json";
import j0003 from "./puzzles/0003.json";
import j0004 from "./puzzles/0004.json";
import j0005 from "./puzzles/0005.json";
import j0006 from "./puzzles/0006.json";
import j0007 from "./puzzles/0007.json";
import j0008 from "./puzzles/0008.json";
import j0009 from "./puzzles/0009.json";
import j0010 from "./puzzles/0010.json";
import j0011 from "./puzzles/0011.json";
import j0012 from "./puzzles/0012.json";
import j0013 from "./puzzles/0013.json";
import j0014 from "./puzzles/0014.json";
import {
  parseTenaBallPuzzleJson,
  type TenaBallPuzzle,
} from "@/content/games/tenaball/schema";

const raw = [
  j0001,
  j0002,
  j0003,
  j0004,
  j0005,
  j0006,
  j0007,
  j0008,
  j0009,
  j0010,
  j0011,
  j0012,
  j0013,
  j0014,
];

function validateReferences(p: TenaBallPuzzle): void {
  const kinds = new Set<EntityKind>(p.validKinds);
  for (const a of p.answers) {
    let e;
    try {
      e = requireEntity(a.entityId);
    } catch {
      const hint = a.entityId.startsWith("pl_")
        ? "Missing player id. Ensure it exists in data/generated/players.generated.json (or regenerate via the Wikidata pipeline)."
        : "Missing entity id. Ensure it exists in the canonical datasets under data/ (countries/leagues/clubs/managers/players).";
      throw new Error(`Puzzle ${p.id}: unknown entityId '${a.entityId}'. ${hint}`);
    }
    if (!kinds.has(e.kind)) {
      throw new Error(
        `Puzzle ${p.id}: entity ${e.id} has kind ${e.kind} not in validKinds ${p.validKinds.join(",")}`,
      );
    }
  }
}

export const ALL_TENABALL_PUZZLES: TenaBallPuzzle[] = raw.map((r) => {
  const p = parseTenaBallPuzzleJson(r);
  validateReferences(p);
  return p;
});
