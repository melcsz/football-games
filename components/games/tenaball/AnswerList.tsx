"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { TenaBallPuzzle } from "@/content/games/tenaball/schema";
import { getEntity } from "@/data/index";

type Props = {
  puzzle: TenaBallPuzzle;
  foundRanks: number[];
  showMeta?: boolean;
};

const BURST_PARTICLES = [
  { x: "14%", y: "22%", dx: -14, dy: -12, delay: 0 },
  { x: "28%", y: "78%", dx: -20, dy: 10, delay: 0.04 },
  { x: "48%", y: "16%", dx: 4, dy: -16, delay: 0.08 },
  { x: "70%", y: "28%", dx: 18, dy: -10, delay: 0.02 },
  { x: "84%", y: "68%", dx: 22, dy: 12, delay: 0.06 },
  { x: "56%", y: "82%", dx: 8, dy: 16, delay: 0.1 },
];

export function AnswerList({ puzzle, foundRanks, showMeta }: Props) {
  const [freshRanks, setFreshRanks] = useState<Set<number>>(() => new Set());
  const previousFoundRef = useRef<Set<number>>(new Set(foundRanks));

  useEffect(() => {
    const previousFound = previousFoundRef.current;
    const addedRanks = foundRanks.filter((rank) => !previousFound.has(rank));
    previousFoundRef.current = new Set(foundRanks);

    if (addedRanks.length === 0) return;

    setFreshRanks((current) => {
      const next = new Set(current);
      for (const rank of addedRanks) next.add(rank);
      return next;
    });

    const timers = addedRanks.map((rank) =>
      window.setTimeout(() => {
        setFreshRanks((current) => {
          const next = new Set(current);
          next.delete(rank);
          return next;
        });
      }, 1500),
    );

    return () => {
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [foundRanks]);

  const foundSet = new Set(foundRanks);
  const sorted = [...puzzle.answers].sort((a, b) => a.rank - b.rank);

  return (
    <ol className="grid grid-cols-2 gap-1.5 sm:gap-1.5 md:grid-flow-col md:grid-cols-2 md:grid-rows-5">
      {sorted.map((a) => {
        const got = foundSet.has(a.rank);
        const entity = getEntity(a.entityId);
        const label = entity?.name ?? a.entityId;
        const reveal = got || showMeta;
        const fresh = got && freshRanks.has(a.rank);
        const accent = a.rank <= 3 ? "#facc15" : "#22c55e";
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
            <div className="relative h-[3.25rem] sm:h-[3.35rem] lg:h-[3.55rem]">
              <AnimatePresence>
                {fresh ? (
                  <motion.div
                    className="pointer-events-none absolute -inset-1 rounded-xl"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{
                      opacity: [0, 0.95, 0],
                      scale: [0.94, 1.05, 1.14],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.95, ease: "easeOut" }}
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${accent}55, transparent 64%)`,
                      boxShadow: `0 0 0 1px ${accent}66, 0 0 30px ${accent}55`,
                    }}
                  />
                ) : null}
              </AnimatePresence>

              <motion.div
                className="preserve-3d relative z-10 h-full w-full"
                initial={false}
                animate={{ rotateY: reveal ? 180 : 0 }}
                transition={{
                  ...spring,
                  delay: reveal && showMeta && !got ? a.rank * 0.045 : 0,
                }}
              >
                {/* Card back — hidden slot */}
                <div
                  className="backface-hidden absolute inset-0 flex items-center gap-2 overflow-hidden rounded-xl border px-2 py-1.5 shadow-sm sm:rounded-lg sm:px-3 sm:py-1.5 lg:rounded-xl"
                  style={{
                    transform: "rotateY(0deg)",
                    borderTopColor: "rgba(34, 197, 94, 0.32)",
                    borderRightColor: "rgba(34, 197, 94, 0.32)",
                    borderBottomColor: "rgba(34, 197, 94, 0.32)",
                    borderLeftColor: accent,
                    borderLeftWidth: 4,
                    background:
                      "linear-gradient(90deg, rgba(34, 197, 94, 0.16) 0%, rgba(30, 41, 59, 0.94) 36%, rgba(15, 23, 42, 0.95) 100%)",
                  }}
                >
                  <span className="w-6 shrink-0 font-mono text-[11px] font-black tabular-nums text-white sm:w-7 sm:text-[11px]">
                    {String(a.rank).padStart(2, "0")}
                  </span>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                    <span className="truncate text-xs font-black uppercase tracking-[0.08em] text-white/70 sm:text-[11px]">
                      <span className="sm:hidden">Open</span>
                      <span className="hidden sm:inline">Open slot</span>
                    </span>
                    <div
                      aria-hidden
                      className="h-7 w-2 shrink-0 rounded-full sm:h-6"
                      style={{
                        backgroundColor: accent,
                      }}
                    />
                  </div>
                </div>

                {/* Card front — revealed answer */}
                <div
                  className="backface-hidden absolute inset-0 flex flex-col justify-center overflow-hidden rounded-xl border px-2 py-1.5 shadow-sm sm:rounded-lg sm:px-3 sm:py-1.5 lg:rounded-xl"
                  style={{
                    transform: "rotateY(180deg)",
                    borderTopColor: got
                      ? "rgba(34, 197, 94, 0.72)"
                      : "var(--border-subtle)",
                    borderRightColor: got
                      ? "rgba(34, 197, 94, 0.72)"
                      : "var(--border-subtle)",
                    borderBottomColor: got
                      ? "rgba(34, 197, 94, 0.72)"
                      : "var(--border-subtle)",
                    borderLeftColor: accent,
                    borderLeftWidth: 4,
                    background: got
                      ? "linear-gradient(90deg, rgba(34, 197, 94, 0.26) 0%, rgba(15, 23, 42, 0.96) 42%)"
                      : "var(--surface-elevated)",
                    boxShadow: got
                      ? "0 2px 14px rgba(34, 197, 94, 0.16), inset 0 1px 0 rgba(255,255,255,0.06)"
                      : "inset 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                >
                  <AnimatePresence>
                    {fresh ? (
                      <motion.div
                        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-white/30 blur-[1px]"
                        initial={{ x: "-80%" }}
                        animate={{ x: "430%" }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.55,
                          delay: 0.16,
                          ease: "easeOut",
                        }}
                      />
                    ) : null}
                  </AnimatePresence>

                  <AnimatePresence>
                    {fresh ? (
                      <div className="pointer-events-none absolute inset-0">
                        {BURST_PARTICLES.map((particle) => (
                          <motion.span
                            key={`${a.rank}-${particle.x}-${particle.y}`}
                            className="absolute h-1.5 w-1.5 rounded-full"
                            style={{
                              left: particle.x,
                              top: particle.y,
                              backgroundColor: accent,
                            }}
                            initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0.4, 1.15, 0.2],
                              x: particle.dx,
                              y: particle.dy,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 0.8,
                              delay: 0.24 + particle.delay,
                              ease: "easeOut",
                            }}
                          />
                        ))}
                      </div>
                    ) : null}
                  </AnimatePresence>

                  <div className="flex items-start gap-2 sm:gap-3">
                    <span
                      className={`w-6 shrink-0 pt-0.5 font-mono text-[11px] font-bold tabular-nums sm:w-7 sm:text-[11px] ${
                        got
                          ? "text-white"
                          : "text-[var(--foreground-muted)]"
                      }`}
                    >
                      {String(a.rank).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <motion.p
                        className={`truncate font-sans text-xs font-black leading-none tracking-tight sm:text-sm lg:text-base ${
                          got ? "text-white" : "text-foreground"
                        }`}
                        animate={fresh ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                        transition={{ duration: 0.42, delay: 0.34 }}
                      >
                        {label}
                      </motion.p>
                    </div>
                    {got ? (
                      <motion.span
                        className="hidden shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider text-[#020617] sm:inline"
                        style={{
                          backgroundColor: accent,
                        }}
                        initial={fresh ? { opacity: 0, scale: 0.7, y: 4 } : false}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 520,
                          damping: 20,
                          delay: fresh ? 0.3 : 0,
                        }}
                      >
                        Found
                      </motion.span>
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
