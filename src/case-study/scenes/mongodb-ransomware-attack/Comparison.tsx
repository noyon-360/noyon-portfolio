import Link from "next/link";
import { MetaLine, SourceTags } from "../../patterns/Editorial";
import { mongoComparison } from "../../studies/mongodb-ransomware-attack";

/** The Shwapno breach side by side: a comparison table, what the pairing shows, and a link to that study. */
export default function Comparison() {
  const c = mongoComparison;
  return (
    <section id={c.id} data-case="c4" aria-labelledby={`${c.id}-h`} className="border-t border-rule px-4 py-24 sm:px-8 md:py-32 lg:pr-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim">({c.label})</p>
        <h2 id={`${c.id}-h`} className="mt-6 max-w-4xl text-balance font-serif text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[0.95]">
          {c.title}
        </h2>
        <MetaLine meta={c.meta} className="mt-8" />
        <p className="mt-8 max-w-3xl text-lg leading-relaxed">{c.intro}</p>

        <div className="mt-12 overflow-x-auto border border-rule">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <caption className="sr-only">This incident compared with the Shwapno breach.</caption>
            <thead>
              <tr className="border-b border-rule bg-ivory/[0.04] font-mono text-[11px] uppercase tracking-[0.14em]">
                {c.columns.map((h, i) => (
                  <th key={i} scope="col" className={`px-4 py-3 font-normal ${i === 1 ? "text-acc" : i === 2 ? "text-amber" : "text-dim"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.rows.map(([k, a, b]) => (
                <tr key={k} className="border-b border-rule last:border-0">
                  <th scope="row" className="px-4 py-4 font-mono text-xs font-normal uppercase tracking-[0.14em] text-dim">{k}</th>
                  <td className="px-4 py-4 text-lg">{a}</td>
                  <td className="px-4 py-4 text-lg">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-16 grid gap-px border border-rule bg-rule md:grid-cols-2">
          <div className="bg-paper p-6 sm:p-10">
            <h3 className="font-serif text-3xl leading-tight sm:text-4xl">{c.shows.head}</h3>
            <p className="mt-4 text-lg text-dim">{c.shows.body}</p>
          </div>
          <div className="bg-paper p-6 sm:p-10">
            <h3 className="font-serif text-3xl leading-tight sm:text-4xl">The shared lesson</h3>
            <p className="mt-4 text-lg text-dim">{c.shared}</p>
          </div>
        </div>

        <footer className="mt-12 flex flex-col gap-6 border-t border-rule pt-6 md:flex-row md:items-baseline md:justify-between">
          <SourceTags refs={c.refs} />
          <Link href={c.link.href} className="font-mono text-xs uppercase tracking-[0.18em] text-ivory hover:text-acc">
            {c.link.label} <span aria-hidden="true">→</span>
          </Link>
        </footer>
      </div>
    </section>
  );
}
