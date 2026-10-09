import { portalLine } from "../../studies/academic-portal-disclosure";

/** Un-numbered feature: what was done beside what was deliberately not done. */
export default function TheLine() {
  const l = portalLine;
  return (
    <section id={l.id} data-case="c5" aria-labelledby={`${l.id}-h`} className="border-t border-rule px-4 py-24 sm:px-8 md:py-32 lg:pr-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim">({l.label})</p>
        <h2 id={`${l.id}-h`} className="mt-6 max-w-4xl text-balance font-serif text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[0.95]">
          {l.title}
        </h2>
        <p className="mt-8 max-w-2xl text-lg text-dim">{l.intro}</p>

        <div className="mt-12 grid gap-px border border-rule bg-rule md:grid-cols-2">
          {[l.did, l.didnt].map((col, c) => (
            <div key={col.title} className="bg-paper p-6 sm:p-10">
              <h3 className={`font-mono text-xs uppercase tracking-[0.22em] ${c ? "text-signal" : "text-acc"}`}>{col.title}</h3>
              <ul className="mt-6">
                {col.items.map((item) => (
                  <li key={item} className="flex items-baseline gap-4 border-t border-rule py-4 font-serif text-2xl leading-tight sm:text-3xl">
                    <span aria-hidden="true" className={`font-mono text-sm ${c ? "text-signal" : "text-acc"}`}>
                      {c ? "×" : "✓"}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
