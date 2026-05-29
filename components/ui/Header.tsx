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
      </div>
    </header>
  );
}
