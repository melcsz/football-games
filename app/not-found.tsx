import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--primary)]">
        404
      </p>
      <h1 className="mt-4 font-display text-4xl font-black text-foreground">
        Page not found
      </h1>
      <p className="mt-4 text-[var(--foreground-muted)]">
        That URL isn&apos;t part of this site. Head back to the home pitch.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-[var(--primary)] px-6 py-3 font-display font-black uppercase tracking-wide text-[var(--primary-foreground)] shadow-sm btn-primary-glow"
      >
        Home
      </Link>
    </div>
  );
}
