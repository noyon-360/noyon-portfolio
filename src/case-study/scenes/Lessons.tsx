import { c2Lessons } from "../content";

/** Lessons for individuals and organisations, as a two-column card grid. */
export default function Lessons() {
  const cols = [
    ["Individuals", c2Lessons.individuals],
    ["Organizations", c2Lessons.organizations],
  ] as const;
  return (
    <section id="lessons" data-case="c2" aria-labelledby="lessons-h" className="border-t border-rule px-4 py-24 sm:px-8 md:py-32 lg:pr-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim">({c2Lessons.label})</p>
        <h2 id="lessons-h" className="mt-6 max-w-4xl text-balance font-serif text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[0.95]">
          {c2Lessons.title}
        </h2>
        <div className="mt-14 grid gap-px border border-rule bg-rule md:grid-cols-2">
          {cols.map(([head, items]) => (
            <div key={head} className="bg-paper p-6 sm:p-10">
              <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-acc">{head}</h3>
              <ol className="mt-6">
                {items.map((item, i) => (
                  <li key={item} className="flex gap-5 border-t border-rule py-4">
                    <span aria-hidden="true" className="cs-outline w-10 shrink-0 font-serif text-3xl leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg leading-snug">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
