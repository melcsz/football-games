export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" />;
}

function LegalPage({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-6">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--primary)]">
        Legal
      </p>
      <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-4 text-sm leading-7 text-[var(--foreground-muted)]">
        This page is a placeholder while the full policy is prepared.
      </p>
    </div>
  );
}
