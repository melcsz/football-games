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
      className={`flex items-center justify-center gap-3 rounded-2xl border px-5 py-3 font-mono text-2xl font-black tabular-nums tracking-widest shadow-sm transition-colors ${
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
