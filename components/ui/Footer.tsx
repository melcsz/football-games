import Link from "next/link";

const footerColumns = [
  {
    title: "Games",
    links: [
      { label: "Top10", href: "/top-10" },
      { label: "Secret Player", href: "/secret-player" },
      { label: "Career Path", href: "/career-path" },
      { label: "Footy Wordle", href: "/footy-wordle" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Ball Knowledge", href: "/about" },
      { label: "Stats", href: "/stats" },
      { label: "Archive", href: "/top-10/archive" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "X / Twitter", href: "https://x.com" },
      { label: "Instagram", href: "https://instagram.com" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#020617]">
      <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5F5F5]">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-3 text-sm font-medium text-[#A3A3A3]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-[#F5F5F5]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-10 border-t border-white/10 pt-6 text-sm font-medium text-[#A3A3A3]">
          The ultimate test of ball knowledge.
          <div className="flex justify-end items-center gap-2 text-[#94A3B8]">
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
      </div>
    </footer>
  );
}
