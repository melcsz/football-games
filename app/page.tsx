import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

const games = [
  {
    title: "Tenable",
    href: "/tenaball",
    image: "/api/placeholder/400/320?theme=tenable",
    accent: "#22C55E",
    tag: "LIVE",
    sticker: <TenableSticker />,
  },
  {
    title: "Secret Player",
    href: "/secret-player",
    image: "/api/placeholder/400/320?theme=secret",
    accent: "#F59E0B",
    tag: "NEW",
    sticker: <SecretPlayerSticker />,
  },
  {
    title: "Career Path",
    href: "/career-path",
    image: "/api/placeholder/400/320?theme=career",
    accent: "#3B82F6",
    tag: "NEW",
    sticker: <CareerPathSticker />,
  },
  {
    title: "Footy Wordle",
    href: "/footy-wordle",
    image: "/api/placeholder/400/320?theme=wordle",
    accent: "#FACC15",
    tag: "NEW",
    sticker: <WordleSticker />,
  },
];

export default function HomePage() {
  return (
    <section className="pb-10 text-[#F8FAFC]">
      <DailyDebate />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {games.map((game) => (
          <GameCard key={game.title} {...game} />
        ))}
      </div>
    </section>
  );
}

function DailyDebate() {
  return (
    <section className="mb-4 rounded-md border border-white/10 bg-[#1E293B] p-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FACC15]">
          Daily Debate
        </p>
        <h1 className="mt-1 text-sm font-black text-white sm:text-base">
          Who is the GOAT?
        </h1>
      </div>

      <div className="mt-3 grid gap-2 sm:mt-0 sm:w-[26rem] sm:grid-cols-2">
        <DebateOption name="Messi" percent={58} />
        <DebateOption name="Ronaldo" percent={42} />
      </div>
    </section>
  );
}

function DebateOption({ name, percent }: { name: string; percent: number }) {
  return (
    <button
      type="button"
      className="group rounded bg-[#0F172A] px-3 py-2 text-left transition-colors hover:bg-[#172338]"
    >
      <div className="flex items-center justify-between gap-3 text-xs font-black text-white">
        <span>{name}</span>
        <span className="text-[#FACC15]">{percent}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <span
          className="block h-full rounded-full bg-[#FACC15] transition-colors group-hover:bg-[#FDE047]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </button>
  );
}

function GameCard({
  title,
  href,
  image,
  accent,
  tag,
  sticker,
}: {
  title: string;
  href: string;
  image: string;
  accent: string;
  tag: string;
  sticker: ReactNode;
}) {
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
          alt=""
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
        <div className="flex flex-1 items-center justify-center bg-[#334155] px-3 text-sm font-black uppercase tracking-[0.16em] text-white transition-colors group-hover:bg-[#3F5068]">
          PLAY
        </div>
        <div className="flex min-h-10 items-center justify-center px-3 text-center text-sm font-black uppercase tracking-tight text-white">
          {title}
        </div>
      </div>
    </Link>
  );
}

function StickerShell({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border-4 border-white bg-[#020617]/80 p-3 shadow-[0_8px_18px_rgba(0,0,0,0.35)]">
      {children}
    </div>
  );
}

function TenableSticker() {
  return (
    <StickerShell>
      <div className="w-24 space-y-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-4 text-[10px] font-black text-[#22C55E]">
              {index + 1}
            </span>
            <span
              className="h-2 rounded-full bg-[#22C55E]"
              style={{ width: `${64 - index * 7}%` }}
            />
          </div>
        ))}
      </div>
    </StickerShell>
  );
}

function SecretPlayerSticker() {
  return (
    <div className="text-7xl font-black leading-none text-[#F59E0B] drop-shadow-[0_4px_0_rgba(0,0,0,0.35)]">
      ?
    </div>
  );
}

function CareerPathSticker() {
  return (
    <StickerShell>
      <svg
        className="h-20 w-24 text-[#3B82F6]"
        viewBox="0 0 96 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M10 62c12-36 58 8 76-44"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {[{ x: 10, y: 62 }, { x: 35, y: 42 }, { x: 61, y: 43 }, { x: 86, y: 18 }].map(
          (node) => (
            <circle
              key={`${node.x}-${node.y}`}
              cx={node.x}
              cy={node.y}
              r="6"
              fill="#020617"
              stroke="currentColor"
              strokeWidth="4"
            />
          ),
        )}
      </svg>
    </StickerShell>
  );
}

function WordleSticker() {
  return (
    <StickerShell>
      <div className="grid w-24 grid-cols-3 gap-1.5">
        {Array.from({ length: 9 }).map((_, index) => {
          const green = [0, 4, 7].includes(index);
          const yellow = [2, 5].includes(index);
          return (
            <span
              key={index}
              className={`aspect-square rounded-sm ${
                green
                  ? "bg-[#22C55E]"
                  : yellow
                    ? "bg-[#FACC15]"
                    : "bg-white"
              }`}
            />
          );
        })}
      </div>
    </StickerShell>
  );
}
