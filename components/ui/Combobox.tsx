"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { Entity } from "@/data/schema";
import { rankEntities } from "@/data/search";

type Props = {
  entities: Entity[];
  excludeIds?: Set<string>;
  disabled?: boolean;
  placeholder?: string;
  onSelect: (entity: Entity) => void;
  /** After a successful pick, parent may reset key to clear input */
  resetSignal?: number;
};

export function Combobox({
  entities,
  excludeIds,
  disabled,
  placeholder = "Search…",
  onSelect,
  resetSignal = 0,
}: Props) {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const hits = useMemo(
    () => rankEntities(entities, query, excludeIds, 12),
    [entities, query, excludeIds],
  );

  useEffect(() => {
    setHighlight(0);
  }, [query, hits.length]);

  useEffect(() => {
    setQuery("");
    setOpen(false);
  }, [resetSignal]);

  const pick = useCallback(
    (entity: Entity) => {
      onSelect(entity);
      setQuery("");
      setOpen(false);
      inputRef.current?.focus();
    },
    [onSelect],
  );

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || hits.length === 0) {
      if (e.key === "ArrowDown" && hits.length > 0) setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(hits.length - 1, h + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = hits[highlight];
      if (hit) pick(hit.entity);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative w-full">
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-1.5 shadow-sm">
        <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-elevated)]/60 px-3 py-1">
          <span className="select-none font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">
            Search
          </span>
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            disabled={disabled}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={placeholder}
            className="min-h-[2.75rem] flex-1 border-0 bg-transparent py-2 text-base text-foreground outline-none ring-0 placeholder:text-[var(--foreground-muted)] focus:ring-0 disabled:opacity-50 sm:min-h-[3rem] sm:text-[15px]"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 120)}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
      {open && hits.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 z-40 mt-2 max-h-64 overflow-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] py-1 shadow-lg"
        >
          {hits.map((h, i) => (
            <li key={h.entity.id} role="option" aria-selected={i === highlight}>
              <button
                type="button"
                className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
                  i === highlight
                    ? "bg-[var(--primary-muted)] text-[var(--primary)]"
                    : "text-foreground hover:bg-[var(--surface-elevated)]"
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(h.entity)}
              >
                <span className="truncate font-semibold">{h.entity.name}</span>
                <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-[var(--foreground-muted)]">
                  {h.entity.kind}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
