import { requireEntity } from "@/data/index";
import j0001 from "./puzzles/0001.json";
import {
  parseSecretPlayerPuzzleJson,
  type SecretPlayerPuzzle,
} from "@/content/games/secret-player/schema";

const raw = [j0001];

function validateReferences(p: SecretPlayerPuzzle): void {
  const answer = requireEntity(p.answerId);
  if (answer.kind !== "player") {
    throw new Error(
      `Secret Player puzzle ${p.id}: answerId '${p.answerId}' must reference a player.`,
    );
  }
}

export const ALL_SECRET_PLAYER_PUZZLES: SecretPlayerPuzzle[] = raw.map((r) => {
  const p = parseSecretPlayerPuzzleJson(r);
  validateReferences(p);
  return p;
});
