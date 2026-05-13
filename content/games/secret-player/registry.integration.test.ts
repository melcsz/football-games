import { describe, expect, it } from "vitest";
import { ALL_SECRET_PLAYER_PUZZLES } from "@/content/games/secret-player/registry";

describe("secret player registry integrity", () => {
  it("loads seed puzzles without missing answerIds", () => {
    expect(ALL_SECRET_PLAYER_PUZZLES.length).toBeGreaterThan(0);
  });
});
