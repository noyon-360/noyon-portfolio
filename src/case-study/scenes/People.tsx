import { people } from "../content";
import { Pill } from "../patterns/Editorial";

// Stylised silhouettes only — never photos. Each card varies the hatch so they read as distinct.
function Silhouette({ i }: { i: number }) {
  const id = `hatch-${i}`;
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full" aria-hidden="true">
      <defs>
        <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform={`rotate(${i * 35})`}>
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-dim)" strokeWidth="1.2" />
        </pattern>
      </defs>
      <circle cx="80" cy="58" r="28" fill={`url(#${id})`} />
      <path d="M26,160 C26,112 50,92 80,92 C110,92 134,112 134,160 Z" fill={`url(#${id})`} />
    </svg>
  );
}

/** The people behind it: magazine profile cards. */
export default function People() {
  return (
    <section id="people" data-case="c2" aria-labelledby="people-h" className="border-t border-rule px-4 py-24 sm:px-8 md:py-32 lg:pr-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim">({people.label})</p>
        <h2 id="people-h" className="mt-6 font-serif text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[0.95]">
          {people.title}
        </h2>
        <ul className="mt-14 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {people.cards.map((c, i) => (
            <li key={c.name} className="flex flex-col bg-paper p-6 sm:p-8">
              <div className="flex items-start justify-between">
                <div className="h-28 w-28 border border-rule bg-ivory/[0.02]">
                  <Silhouette i={i} />
                </div>
                <Pill>{c.role}</Pill>
              </div>
              <h3 className="mt-8 font-serif text-3xl leading-tight">{c.name}</h3>
              <p className="mt-3 text-dim">{c.body}</p>
              {"link" in c && c.link && (
                <a href={c.link.href} target="_blank" rel="noreferrer" className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ivory underline decoration-rule underline-offset-4 hover:text-acc">
                  {c.link.label} ↗
                </a>
              )}
            </li>
          ))}
          {/* Fills the last grid cell so the 1px rule background doesn't show through. */}
          <li aria-hidden="true" className="hidden bg-paper lg:block" />
        </ul>
      </div>
    </section>
  );
}
