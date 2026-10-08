import { mongoEvidence } from "../../studies/mongodb-ransomware-attack";

/** Evidence held (tags across the page jump to #ev-<id>, and that row blinks), then the questions still open. */
export default function Evidence() {
  const e = mongoEvidence;
  return (
    <section id={e.id} data-case="c4" aria-labelledby={`${e.id}-h`} className="border-t border-rule px-4 py-24 sm:px-8 lg:pr-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim">({e.label})</p>
        <h2 id={`${e.id}-h`} className="mt-6 max-w-4xl font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-none">
          {e.title}
        </h2>
        <p className="mt-6 max-w-2xl text-dim">{e.note}</p>

        <ol className="mt-12 border-t border-rule">
          {e.items.map((ev) => (
            <li key={ev.id} id={`ev-${ev.id}`} data-anchor className="-mx-3 grid grid-cols-[3rem_1fr] gap-4 border-b border-rule px-3 py-4 sm:grid-cols-[3rem_18rem_1fr]">
              <span className="font-mono text-sm text-acc">{ev.id.toUpperCase()}</span>
              <span className="font-serif text-2xl leading-tight">{ev.title}</span>
              <span className="col-start-2 text-dim sm:col-start-3">{ev.supports}</span>
            </li>
          ))}
        </ol>

        <h3 className="mt-20 font-mono text-xs uppercase tracking-[0.22em] text-dim">({e.openTitle})</h3>
        <ol className="mt-6 border-t border-rule">
          {e.open.map(([q, a], i) => (
            <li key={q} className="grid gap-2 border-b border-rule py-5 md:grid-cols-[4rem_minmax(0,6fr)_minmax(0,6fr)] md:items-baseline md:gap-8">
              <span aria-hidden="true" className="cs-outline font-serif text-4xl leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-serif text-2xl leading-tight">{q}</span>
              <span className="text-dim">{a}</span>
            </li>
          ))}
        </ol>

        <div className="mt-16 border-l-2 border-acc pl-6 sm:pl-10">
          <h3 className="font-serif text-3xl leading-tight sm:text-4xl">A note on method</h3>
          <p className="mt-4 max-w-3xl text-lg text-dim">{e.method}</p>
        </div>
      </div>
    </section>
  );
}
