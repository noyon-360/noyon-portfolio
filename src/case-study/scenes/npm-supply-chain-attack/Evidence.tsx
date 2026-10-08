import { references } from "../../content";
import { npmEvidence } from "../../studies/npm-supply-chain-attack";

/** Recreated, anonymised exhibits. Evidence tags across the page jump to #ev-<id>, and that block blinks. */
export default function Evidence() {
  return (
    <section id={npmEvidence.id} data-case="c3c" aria-labelledby={`${npmEvidence.id}-h`} className="border-t border-rule px-4 py-24 sm:px-8 lg:pr-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim">({npmEvidence.label})</p>
        <h2 id={`${npmEvidence.id}-h`} className="mt-6 font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-none">
          {npmEvidence.title}
        </h2>
        <p className="mt-6 max-w-2xl text-dim">{npmEvidence.note}</p>
        <ol className="mt-12 space-y-12">
          {npmEvidence.items.map((ev) => (
            <li key={ev.id} id={`ev-${ev.id}`} data-anchor className="-mx-3 px-3 py-2">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-mono text-sm text-acc">{ev.id.toUpperCase()}</span>
                <h3 className="font-serif text-3xl">{ev.title}</h3>
                <span className="text-sm text-dim">{ev.caption}</span>
              </div>
              <div className="mt-4 overflow-x-auto border border-rule">
                <table className="w-full min-w-[32rem] border-collapse text-left font-mono text-xs sm:text-sm">
                  <caption className="sr-only">
                    {ev.title}: {ev.caption}
                  </caption>
                  <thead>
                    <tr className="border-b border-rule bg-ivory/[0.04]">
                      {ev.columns.map((c) => (
                        <th key={c} scope="col" className="px-4 py-3 font-normal uppercase tracking-[0.14em] text-dim">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ev.rows.map((row, r) => (
                      <tr key={r} className="border-b border-rule last:border-0">
                        {row.map((cell, c) => (
                          <td key={c} className={`px-4 py-3 ${cell.startsWith("TODO") ? "text-amber" : "text-ivory"}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {ev.refs?.map((id) => (
                <a key={id} href={`#ref-${id}`} className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-dim hover:text-ivory">
                  Source: {references.find((r) => r.id === id)?.outlet} →
                </a>
              ))}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
