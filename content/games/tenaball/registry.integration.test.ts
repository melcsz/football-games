import { describe, expect, it } from "vitest";
import { ALL_TENABALL_PUZZLES } from "@/content/games/tenaball/registry";

describe("tenaball registry integrity", () => {
  it("loads all puzzles without missing entityIds", () => {
    expect(ALL_TENABALL_PUZZLES.length).toBeGreaterThan(0);
  });
});

