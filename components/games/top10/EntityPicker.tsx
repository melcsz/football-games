"use client";

import { useMemo } from "react";
import type { Top10Puzzle } from "@/content/games/top10/schema";
import type { Entity, EntityKind } from "@/data/schema";
import { allEntities } from "@/data/index";
import { entitiesMatchingKinds } from "@/data/search";
import { Combobox } from "@/components/ui/Combobox";

type Props = {
  puzzle: Top10Puzzle;
  excludeIds: Set<string>;
  disabled?: boolean;
  resetSignal: number;
  onPick: (entity: Entity) => void;
};

export function EntityPicker({
  puzzle,
  excludeIds,
  disabled,
  resetSignal,
  onPick,
}: Props) {
  const kinds: EntityKind[] = puzzle.validKinds;

  const pool = useMemo(() => {
    return entitiesMatchingKinds(allEntities(), kinds);
  }, [kinds]);

  return (
    <div className="w-full space-y-2">
      <Combobox
        entities={pool}
        excludeIds={excludeIds}
        disabled={disabled}
        resetSignal={resetSignal}
        placeholder="Type to search roster…"
        onSelect={onPick}
      />
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--foreground-muted)]">
        Pick from list · ↑↓ enter
      </p>
    </div>
  );
}
