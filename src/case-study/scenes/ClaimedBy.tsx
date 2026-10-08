import { c1Claim, type GroupProfile } from "../content";
import { MetaLine, NextLine, SourceTags } from "../patterns/Editorial";

const c = c1Claim;

/** Abstract stand-ins for the groups — no logos, no people. Both read as "a service with many affiliates". */
function GroupIcon({ kind }: { kind: GroupProfile["icon"] }) {
  if (kind === "grid") {
    const cells = [0, 1, 2].flatMap((r) => [0, 1, 2].map((col) => [52 + col * 48, 52 + r * 48] as const));
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full" fill="none" aria-hidden="true">
        <rect x="22" y="22" width="156" height="156" stroke="var(--color-dim)" strokeDasharray="4 5" />
        {cells.map(([x, y], i) =>
          i === 4 ? (
            <g key={i}>
              <rect x={x - 14} y={y - 14} width="28" height="28" fill="var(--color-paper)" stroke="var(--color-acc)" strokeWidth="1.5" />
              <rect x={x - 5} y={y - 5} width="10" height="10" fill="var(--color-acc)" />
            </g>
          ) : (
            <g key={i}>
              <line x1="100" y1="100" x2={x} y2={y} stroke="var(--color-rule)" strokeWidth="1.5" />
              <rect x={x - 7} y={y - 7} width="14" height="14" fill="var(--color-paper)" stroke="var(--color-dim)" />
            </g>
          ),
        )}
      </svg>
    );
  }
  const nodes: [number, number][] = [
    [100, 52], [141, 76], [141, 124], [100, 148], [59, 124], [59, 76],
  ];
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" fill="none" aria-hidden="true">
      <path d="M100,18 L171,59 L171,141 L100,182 L29,141 L29,59 Z" stroke="var(--color-dim)" strokeDasharray="4 5" />
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <line x1="100" y1="100" x2={x} y2={y} stroke="var(--color-rule)" strokeWidth="1.5" />
          <circle cx={x} cy={y} r="7" fill="var(--color-paper)" stroke="var(--color-dim)" />
        </g>
      ))}
      <circle cx="100" cy="100" r="16" fill="var(--color-paper)" stroke="var(--color-acc)" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="5" fill="var(--color-acc)" />
    </svg>
  );
}

function ProfileCard({ profile, index }: { profile: GroupProfile; index: number }) {
  const hid = `${c.id}-profile-${index}`;
  return (
    <article className="relative flex flex-col border border-rule bg-ivory/[0.025] p-6 sm:p-8" aria-labelledby={hid}>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">Profile · claimant {String(index + 1).padStart(2, "0")}</p>
      <div className="mt-5 flex items-center gap-6">
        <figure role="img" aria-label={profile.alt} className="m-0 h-24 w-24 shrink-0 border border-rule">
          <GroupIcon kind={profile.icon} />
        </figure>
        <h3 id={hid} className="font-serif text-5xl leading-none sm:text-6xl">
          {profile.name}
        </h3>
      </div>
      <p
        className="mt-6 inline-block self-start -rotate-6 border-2 border-signal px-2 py-1 font-mono text-[11px] font-semibold tracking-[0.14em] text-signal sm:absolute sm:right-8 sm:top-8 sm:mt-0 sm:text-xs"
        aria-label="Status: claimed, unverified"
      >
        {c.stamp}
      </p>
      <dl className="mt-8 border-t border-rule">
        {profile.facts.map(([k, v]) => (
          <div key={k} className="grid gap-1 border-b border-rule py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
            <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">{k}</dt>
            <dd className="text-[15px] leading-snug">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto pt-5">
        <SourceTags refs={profile.refs} />
      </div>
    </article>
  );
}

/** Feature between questions 07 and 08: the two groups that claimed the attack. Claims only — no verdict. */
export default function ClaimedBy() {
  return (
    <section id={c.id} data-case="c1" aria-labelledby={`${c.id}-h`} className="relative border-t border-rule px-4 py-24 sm:px-8 md:py-32 lg:pr-24">
      <div className="mx-auto max-w-7xl">
        <header>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim">({c.label})</p>
          <h2 id={`${c.id}-h`} className="mt-6 max-w-4xl text-balance font-serif text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[0.95] tracking-[-0.01em]">
            {c.title}
          </h2>
          <MetaLine meta={c.meta} className="mt-8" />
        </header>

        {/* 01 — The claims */}
        <div className="mt-14 grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-acc">01 — {c.claims.kicker}</p>
            {c.claims.body.map((p) => (
              <p key={p} className="mt-4 text-xl leading-snug md:text-2xl md:leading-[1.3]">
                {p}
              </p>
            ))}
          </div>
          <div className="md:col-span-5 md:self-end">
            <p className="border-l-2 border-signal bg-signal/[0.06] px-5 py-4 text-base leading-relaxed">
              <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.16em] text-signal">Unverified</span>
              {c.claims.caveat}
            </p>
            <div className="mt-6">
              <SourceTags refs={c.claims.refs} />
            </div>
          </div>
        </div>

        {/* Two equal profile cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {c.profiles.map((p, i) => (
            <ProfileCard key={p.name} profile={p} index={i} />
          ))}
        </div>

        {/* 02 — Why two groups? */}
        <div className="mt-10 border border-dashed border-rule p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-acc">02 — {c.twoGroups.kicker}</p>
            <span className="rounded-full border border-dim/60 px-3 py-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">{c.twoGroups.label}</span>
          </div>
          {c.twoGroups.body.map((p) => (
            <p key={p} className="mt-4 max-w-3xl text-lg leading-snug">
              {p}
            </p>
          ))}
          <div className="mt-5">
            <SourceTags refs={c.twoGroups.refs} />
          </div>
        </div>

        {/* 03 — The pattern */}
        <div className="mt-20">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-acc">03 — {c.pattern.kicker}</p>
          <p className="mt-4 max-w-2xl text-xl leading-snug">{c.pattern.intro}</p>
          <ol aria-label={c.pattern.alt} className="mt-10 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
            {c.pattern.steps.flatMap((s, i) => [
              <li key={s.title} className="flex flex-col border border-rule p-6">
                <span className="cs-outline font-serif text-5xl leading-none" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-6 font-serif text-3xl leading-tight">{s.title}</span>
                <span className="mt-auto border-t border-rule pt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">
                  <span className="text-acc">Shwapno · </span>
                  {s.shwapno}
                </span>
              </li>,
              i < c.pattern.steps.length - 1 && (
                <li key={`arrow-${i}`} aria-hidden="true" className="flex items-center justify-center text-2xl text-acc">
                  <span className="rotate-90 md:rotate-0">→</span>
                </li>
              ),
            ])}
          </ol>
        </div>

        {/* 04 — Why it matters */}
        <div className="mt-20 md:w-2/3">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-acc">04 — {c.why.kicker}</p>
          <p className="mt-4 font-serif text-3xl leading-tight md:text-4xl">{c.why.body}</p>
        </div>

        <footer className="mt-16 flex justify-end border-t border-rule pt-6">
          <NextLine>{c.next}</NextLine>
        </footer>
      </div>
    </section>
  );
}
