export const metadata = {
  title: "Career Path",
};

export default function CareerPathPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl flex-col justify-center px-4 py-16">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--primary)]">
        Beta
      </p>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
        Career Path
      </h1>
      <p className="mt-5 text-lg font-medium leading-8 text-[var(--foreground-muted)]">
        Identify the player from their club history. This route is ready for the
        next game engine.
      </p>
    </div>
  );
}
