import { references, type CaseId, type RefId } from "../content";
import RefFlash from "../patterns/RefFlash";

/** The study's numbered references. Source tags across the page jump to #ref-<id>, and that row blinks. */
export default function References({ ids, caseId, note }: { ids: RefId[]; caseId: CaseId; note?: string }) {
  const list = ids.map((id) => references.find((r) => r.id === id)).filter((r) => r !== undefined);
  return (
    <section id="references" data-case={caseId} aria-labelledby="references-h" className="border-t border-rule px-4 py-24 sm:px-8 lg:pr-24">
      <RefFlash />
      <div className="mx-auto max-w-7xl">
        <h2 id="references-h" className="font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-none">
          References
        </h2>
        {list.length > 0 && (
          <ol className="mt-10 border-t border-rule">
            {list.map((r, i) => (
              <li key={r.id} id={`ref-${r.id}`} data-anchor className="-mx-3 grid grid-cols-[3rem_1fr] gap-4 border-b border-rule px-3 py-4 sm:grid-cols-[3rem_16rem_1fr]">
                <span className="font-mono text-sm text-dim">[{i + 1}]</span>
                <span className="font-serif text-xl">{r.outlet}</span>
                <span className="col-start-2 sm:col-start-3">
                  <a href={r.href} target="_blank" rel="noreferrer" className="underline decoration-rule underline-offset-4 hover:decoration-ivory">
                    {r.title} ↗
                  </a>
                  {r.date && <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">{r.date}</span>}
                  {r.todo && <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.14em] text-amber">TODO: add exact article URL and date</span>}
                </span>
              </li>
            ))}
          </ol>
        )}
        {note && <p className="mt-6 max-w-2xl border-l border-amber pl-4 text-sm text-dim">{note}</p>}
        <p className="mt-10 max-w-2xl text-sm text-dim">
          Educational case study. No exploit code, malware samples or technical attack detail is included. All visuals are made in code; no logos or photographs are used.
        </p>
      </div>
    </section>
  );
}
