import Link from "next/link";

export function Header() {
  return (
    <header className="bg-[#020617]">
      <div className="relative mx-auto flex h-16 max-w-[1200px] items-center justify-center px-4 sm:px-6">
        <Link
          href="/"
          className="font-sans text-2xl font-black uppercase tracking-tight text-[#FACC15] transition-colors hover:text-[#FDE68A] sm:text-3xl"
        >
          WE KNOW BALL
        </Link>

        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-[#94A3B8] sm:right-6">
          <span
            className="flex h-7 w-7 items-center justify-center rounded border border-white/10 text-[10px] font-black transition-colors hover:border-[#FACC15]/50 hover:text-[#FACC15]"
            aria-label="X social placeholder"
            role="img"
          >
            X
          </span>
          <span
            className="flex h-7 w-7 items-center justify-center rounded border border-white/10 text-[10px] font-black transition-colors hover:border-[#FACC15]/50 hover:text-[#FACC15]"
            aria-label="Instagram social placeholder"
            role="img"
          >
            IG
          </span>
        </div>
      </div>
    </header>
  );
}
