"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  deadlineMs: number;
  onExpire: () => void;
};

export function Timer({ deadlineMs, onExpire }: Props) {
  const fired = useRef(false);
  const [left, setLeft] = useState(() =>
    Math.max(0, deadlineMs - Date.now()),
  );

  useEffect(() => {
    fired.current = false;
    const tick = () => {
      const next = Math.max(0, deadlineMs - Date.now());
      setLeft(next);
      if (next <= 0) {
        if (!fired.current) {
          fired.current = true;
          onExpire();
        }
      }
    };
    tick();
    const id = window.setInterval(tick, 100);
    return () => window.clearInterval(id);
  }, [deadlineMs, onExpire]);

  const secs = Math.ceil(left / 1000);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const urgent = secs <= 15;

  return (
    <div
      className={`flex min-h-[3.35rem] items-center justify-center gap-2 rounded-xl border px-3 py-2 font-mono text-lg font-black tabular-nums tracking-widest shadow-sm transition-colors sm:min-h-0 sm:gap-2 sm:rounded-lg sm:px-4 sm:py-1.5 sm:text-xl md:h-full ${
        urgent
          ? "border-[var(--ranked)]/45 bg-[var(--ranked-muted)] text-[var(--ranked)] shadow-md"
          : "border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--caution)]"
      }`}
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--foreground-muted)]">
        Time
      </span>
      <span>
        {mm}:{ss}
      </span>
    </div>
  );
}
