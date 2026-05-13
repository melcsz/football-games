"use client";

import { motion } from "framer-motion";
import type { TenaBallPuzzle } from "@/content/games/tenaball/schema";
import { getEntity } from "@/data/index";
import type { Entity } from "@/data/schema";

type Props = {
  puzzle: TenaBallPuzzle;
  foundRanks: number[];
  showMeta?: boolean;
};

function statsLine(entity: Entity | undefined): string | null {
  if (!entity) return null;
  if (entity.kind === "player") {
    const bits: string[] = [];
    if (entity.position) bits.push(entity.position);
    if (entity.countryId) {
      const c = getEntity(entity.countryId);
      if (c?.kind === "country") {
        if (c.iso2) bits.push(c.iso2);
        else bits.push(c.name.slice(0, 3).toUpperCase());
      }
    }
    return bits.length ? bits.join(" · ") : null;
  }
  if (entity.kind === "club" && entity.countryId) {
    const c = getEntity(entity.countryId);
    if (c?.kind === "country" && c.iso2) return c.iso2;
  }
  return null;
}

export function AnswerList({ puzzle, foundRanks, showMeta }: Props) {
  const foundSet = new Set(foundRanks);
  const sorted = [...puzzle.answers].sort((a, b) => a.rank - b.rank);

  return (
    <ol className="grid grid-cols-1 gap-3 md:grid-flow-col md:grid-cols-2 md:grid-rows-5">
      {sorted.map((a) => {
        const got = foundSet.has(a.rank);
        const entity = getEntity(a.entityId);
        const label = entity?.name ?? a.entityId;
        const reveal = got || showMeta;
        const stats = statsLine(entity);
        const spring = {
          type: "spring" as const,
          stiffness: 320,
          damping: 26,
          mass: 0.85,
        };

        return (
          <li
            key={a.rank}
            className="list-none"
            style={{ perspective: "1000px" }}
          >
            <div className="relative h-[4.5rem] sm:h-[5rem]">
              <motion.div
                className="preserve-3d relative h-full w-full"
                initial={false}
                animate={{ rotateY: reveal ? 180 : 0 }}
                transition={{
                  ...spring,
                  delay: reveal && showMeta && !got ? a.rank * 0.045 : 0,
                }}
              >
                {/* Card back — hidden slot */}
                <div
                  className="backface-hidden absolute inset-0 flex items-center gap-3 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 shadow-sm sm:px-4"
                  style={{ transform: "rotateY(0deg)" }}
                >
                  <span className="w-8 shrink-0 font-mono text-xs tabular-nums text-[var(--foreground-muted)]">
                    {String(a.rank).padStart(2, "0")}
                  </span>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-[var(--foreground-muted)]">
                      Hidden
                    </span>
                    <div
                      aria-hidden
                      className="h-8 w-14 rounded-lg border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--surface-elevated)] to-transparent"
                    />
                  </div>
                </div>

                {/* Card front — revealed answer */}
                <div
                  className="backface-hidden absolute inset-0 flex flex-col justify-center overflow-hidden rounded-2xl border px-3 py-2 shadow-sm sm:px-4"
                  style={{
                    transform: "rotateY(180deg)",
                    borderColor: got
                      ? "rgba(34, 197, 94, 0.4)"
                      : "var(--border-subtle)",
                    backgroundColor: got
                      ? "var(--pitch-green-dim)"
                      : "var(--surface-elevated)",
                    boxShadow: got
                      ? "0 2px 14px rgba(34, 197, 94, 0.12), inset 0 1px 0 rgba(255,255,255,0.06)"
                      : "inset 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-8 shrink-0 pt-0.5 font-mono text-xs font-bold tabular-nums ${
                        got
                          ? "text-[var(--primary)]"
                          : "text-[var(--foreground-muted)]"
                      }`}
                    >
                      {String(a.rank).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate font-sans text-base font-black uppercase leading-none tracking-tight sm:text-lg ${
                          got ? "text-[var(--primary)]" : "text-foreground"
                        }`}
                      >
                        {label}
                      </p>
                      {stats ? (
                        <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--foreground-muted)]">
                          {stats}
                        </p>
                      ) : null}
                      {showMeta && a.meta ? (
                        <p className="mt-0.5 truncate font-mono text-[10px] text-[var(--foreground-muted)]">
                          {a.meta}
                        </p>
                      ) : null}
                    </div>
                    {got ? (
                      <span className="shrink-0 rounded-md border border-[var(--primary)]/30 bg-[var(--primary-muted)] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[var(--primary)]">
                        Found
                      </span>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
