import { describe, expect, it } from "vitest";
import { normalizeSearchToken, rankEntities } from "@/data/search";
import type { Entity } from "@/data/schema";

const messi: Entity = {
  id: "pl_lionel_messi",
  kind: "player",
  name: "Lionel Messi",
  aliases: ["messi", "leo messi"],
  countryId: "co_argentina",
};

const cr7: Entity = {
  id: "pl_cristiano_ronaldo",
  kind: "player",
  name: "Cristiano Ronaldo",
  aliases: ["cr7"],
  countryId: "co_portugal",
};

const aguero: Entity = {
  id: "pl_sergio_aguero",
  kind: "player",
  name: "Sergio Agüero",
  aliases: ["kun", "kun aguero"],
  countryId: "co_argentina",
};

const kunPlayer: Entity = {
  id: "pl_kun_player",
  kind: "player",
  name: "Kun Player",
  aliases: ["not relevant"],
};

describe("normalizeSearchToken", () => {
  it("strips accents", () => {
    expect(normalizeSearchToken("Mbappé")).toBe("mbappe");
  });
});

describe("rankEntities", () => {
  it("ranks prefix matches", () => {
    const hits = rankEntities([messi, cr7], "mess", undefined, 8);
    expect(hits[0]?.entity.id).toBe("pl_lionel_messi");
  });

  it("matches aliases but prioritizes name ties", () => {
    // Alias-only query should still find Aguero.
    const hits = rankEntities([aguero], "kun", undefined, 8);
    expect(hits[0]?.entity.id).toBe("pl_sergio_aguero");

    // If query matches name on one entity and alias on another with same token,
    // the name match should rank higher.
    const hits2 = rankEntities([aguero, kunPlayer], "kun", undefined, 8);
    expect(hits2[0]?.entity.id).toBe("pl_kun_player");
  });

  it("respects excludeIds", () => {
    const ex = new Set(["pl_lionel_messi"]);
    const hits = rankEntities([messi, cr7], "mess", ex, 8);
    expect(hits.every((h) => h.entity.id !== "pl_lionel_messi")).toBe(true);
  });
});
