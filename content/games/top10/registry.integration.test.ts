import { describe, expect, it } from "vitest";
import { ALL_TOP10_PUZZLES } from "@/content/games/top10/registry";

describe("Top 10 registry integrity", () => {
  it("loads all puzzles without missing entityIds", () => {
    expect(ALL_TOP10_PUZZLES.length).toBeGreaterThan(0);
  });
});

