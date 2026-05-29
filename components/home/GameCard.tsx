import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Game } from "@/types/game";

export function GameCard({
  title,
  href,
  image,
  accent,
  tag,
  description,
  sticker,
}: Game) {
  const style = { "--game-accent": accent } as CSSProperties;

  return (
    <Link
      href={href}
      style={style}
      className="group relative flex aspect-[6/7] min-h-[10rem] overflow-hidden rounded-md border border-white/10 bg-[#111827] shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--game-accent)]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--game-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#020617] sm:aspect-[4/5] lg:aspect-[5/6]"
    >
      <Image
        src={image}
        alt={`${title} game preview`}
        fill
        sizes="(min-width: 1024px) 22vw, 46vw"
        unoptimized
        className="object-cover opacity-85 transition-transform duration-300 group-hover:scale-105"
      />

      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/35 to-[#020617]"
        aria-hidden
      />
      <div
        className="absolute left-4 top-7 h-20 w-20 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 h-1 bg-[var(--game-accent)]"
        aria-hidden
      />

      <span className="absolute right-2 top-2 rounded bg-[var(--game-accent)] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#020617] sm:px-2 sm:py-1 sm:text-[10px]">
        {tag}
      </span>

      <div className="absolute inset-x-0 top-1 flex justify-center px-3 transition-transform duration-300 group-hover:-translate-y-1 sm:top-7">
        <div className="scale-[0.44] sm:scale-90">{sticker}</div>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-black leading-tight text-white sm:text-base">
              {title}
            </h2>
            <p className="mt-0.5 line-clamp-2 text-[11px] font-medium leading-snug text-white/72 sm:text-xs">
              {description}
            </p>
          </div>
          <span className="hidden shrink-0 rounded border border-white/15 bg-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white backdrop-blur transition-colors group-hover:border-[var(--game-accent)]/50 group-hover:bg-[var(--game-accent)] group-hover:text-[#020617] sm:inline">
            Play
          </span>
        </div>
      </div>
    </Link>
  );
}
