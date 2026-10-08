import { profile, stats } from "@/data/content";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-client/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 top-40 h-[28rem] w-[28rem] rounded-full bg-server/15 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-4 pb-16 pt-28 sm:px-6">
        <div>
          <div className="rise flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span className="text-text">01</span>
            <span>{profile.location}</span>
            <span>{profile.timezone}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 normal-case tracking-normal text-text">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Open to freelance &amp; remote
            </span>
          </div>

          <h1 className="rise mt-8 font-display text-5xl font-semibold leading-[1.02] tracking-tight [animation-delay:80ms] sm:text-7xl lg:text-[5.25rem]">
            I build the <span className="text-client">app</span>
            <br />
            and the <span className="text-server">server</span>
            <br />
            behind it.
          </h1>

          <p className="rise mt-8 font-mono text-sm text-text [animation-delay:160ms]">
            {profile.name} — {profile.title} · {profile.roles.join(" · ")}
          </p>
          <p className="rise mt-4 max-w-2xl text-muted md:text-lg [animation-delay:200ms]">{profile.summary}</p>

          <div className="rise mt-10 flex flex-wrap gap-3 [animation-delay:260ms]">
            <a href="#skills" className="rounded-full bg-text px-6 py-3 font-medium text-ink transition-opacity hover:opacity-85">
              Explore my skills in 3D ↓
            </a>
            <a href={`mailto:${profile.email}`} className="rounded-full border border-line-strong px-6 py-3 font-medium transition-colors hover:bg-panel-2">
              Email me
            </a>
          </div>
        </div>

        <dl className="rise mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line [animation-delay:340ms] md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-ink p-5">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="font-display text-3xl font-semibold sm:text-4xl">{s.value}</span>
                <span className="mt-1 block text-sm text-muted">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
