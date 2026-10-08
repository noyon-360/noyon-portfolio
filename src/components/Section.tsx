export function Section({
  id,
  index,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        <span className="text-text">{index}</span> / {eyebrow}
      </p>
      <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
      {intro && <p className="mt-4 max-w-2xl text-muted md:text-lg">{intro}</p>}
      <div className="mt-12">{children}</div>
    </section>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-line bg-panel px-2 py-0.5 font-mono text-[11px] text-muted">{children}</span>
  );
}
