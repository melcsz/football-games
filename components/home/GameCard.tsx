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
  playLabel,
  description,
  sticker,
}: Game) {
  const style = { "--game-accent": accent } as CSSProperties;

  return (
    <Link
      href={href}
      style={style}
      className="group flex aspect-[3/4] flex-col overflow-hidden rounded-md border border-[#263244] bg-[#1E293B] transition-colors hover:border-[var(--game-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--game-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#020617]"
    >
      <div className="relative min-h-0 flex-[3] overflow-hidden">
        <Image
          src={image}
          alt={`${title} game preview`}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-black/35" aria-hidden />

        <span className="absolute right-2 top-2 rounded bg-[var(--game-accent)] px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#020617]">
          {tag}
        </span>

        <div className="absolute inset-0 flex items-center justify-center p-5">
          {sticker}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-[#1E293B]">
        <div className="flex flex-1 items-center justify-center bg-[#334155] px-3 text-sm font-black uppercase tracking-[0.12em] text-white transition-colors group-hover:bg-[#3F5068]">
          {playLabel}
        </div>

        <div className="flex flex-col items-center justify-center gap-1 px-3 py-3 text-center">

          <p className="line-clamp-2 text-[11px] font-medium leading-snug text-white/65">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}