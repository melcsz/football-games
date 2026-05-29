export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 text-[var(--foreground-muted)]">
      <h1 className="font-display text-3xl font-black text-foreground">
        WeKnowBall · Top 10
      </h1>
      <p className="text-lg font-medium leading-relaxed text-foreground/90">
        One daily top-ten board. Pick every answer from the pool — no spelling
        lottery. More games land here soon.
      </p>
      <section className="space-y-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-sm">
        <h2 className="font-display text-xl font-black text-[var(--primary)]">
          How to play
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed">
          <li>
            <strong className="text-foreground">Casual Mode</strong> — no timer.
            Work through the board at your pace.
          </li>
          <li>
            <strong className="text-foreground">Ranked Mode</strong> — 90 seconds.
            Clear the board for a score multiplier on your final tally.
          </li>
          <li>
            Search and pick from suggestions — correct picks lock into their
            ranked slot.
          </li>
          <li>
            Wrong answers don&apos;t end the run; you can keep searching.
          </li>
          <li>Share your line like Wordle when you&apos;re done.</li>
        </ol>
      </section>
      <p className="text-sm">
        Built as an MVP for people who like football trivia. More modes and
        games ship as we go.
      </p>
    </div>
  );
}
