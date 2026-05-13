export const metadata = {
  title: "The Secret Player",
};

export default function SecretPlayerPage() {
  return (
    <ComingSoonGamePage
      eyebrow="New Game"
      title="The Secret Player"
      description="Guess the mystery footballer from three admin hints. The schema is seeded; the game engine comes next."
    />
  );
}

function ComingSoonGamePage({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl flex-col justify-center px-4 py-16">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--primary)]">
        {eyebrow}
      </p>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 text-lg font-medium leading-8 text-[var(--foreground-muted)]">
        {description}
      </p>
    </div>
  );
}
