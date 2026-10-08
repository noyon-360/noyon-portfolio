import { projects } from "@/data/content";
import { Section, Tag } from "./Section";

export default function Projects() {
  const [feature, ...rest] = projects;

  return (
    <Section
      id="work"
      index="05"
      eyebrow="Project details"
      title="Every project, in detail."
      intro="A backend I wrote solo, an offline tour guide for sightseeing flights, live bus booking, a client's own TV app, a space-learning game, a calorie app for two, an e-commerce app I took to both stores, and a streaming client that runs on a TV remote."
    >
      <article className="overflow-hidden rounded-2xl border border-line bg-panel">
        <div className="grid lg:grid-cols-5">
          <div className="p-6 sm:p-10 lg:col-span-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-server">
              {feature.kind} · {feature.category}
            </p>
            <h3 className="mt-3 font-display text-4xl font-semibold">{feature.title}</h3>
            <p className="mt-4 text-muted">{feature.summary}</p>
            <div className="mt-6 flex flex-wrap gap-1.5">{feature.stack.map((t) => <Tag key={t}>{t}</Tag>)}</div>
          </div>
          <div className="border-t border-line bg-panel-2 p-6 sm:p-10 lg:col-span-2 lg:border-l lg:border-t-0">
            <dl className="space-y-6">
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted">The problem</dt>
                <dd className="mt-2">{feature.challenge}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted">What I did</dt>
                <dd className="mt-2">{feature.solution}</dd>
              </div>
            </dl>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-display text-lg">
              {feature.facts.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        </div>
      </article>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <article key={p.slug} className="flex flex-col rounded-2xl border border-line bg-panel p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-client">
              {p.kind} · {p.category}
            </p>
            <h3 className="mt-3 font-display text-3xl font-semibold">{p.title}</h3>
            <p className="mt-3 text-muted">{p.summary}</p>
            <p className="mt-4 text-sm">
              <span className="text-muted">How: </span>
              {p.solution}
            </p>
            <div className="mt-6 flex flex-wrap gap-1.5">{p.stack.map((t) => <Tag key={t}>{t}</Tag>)}</div>
            <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-6 font-mono text-xs uppercase tracking-widest text-muted">
              {p.links.length
                ? p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-text hover:underline">
                      {l.label} ↗
                    </a>
                  ))
                : p.facts.map((f) => <span key={f}>{f}</span>)}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
