import { CardGrid } from "../../patterns/Blocks";
import { MetaLine } from "../../patterns/Editorial";
import { mongoLessons } from "../../studies/mongodb-ransomware-attack";

/** The nine controls as a numbered table, then the three that matter most, then a note for small teams. */
export default function Lessons() {
  const l = mongoLessons;
  return (
    <section id={l.id} data-case="c4" aria-labelledby={`${l.id}-h`} className="border-t border-rule px-4 py-24 sm:px-8 md:py-32 lg:pr-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim">({l.label})</p>
        <h2 id={`${l.id}-h`} className="mt-6 max-w-4xl text-balance font-serif text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[0.95]">
          {l.title}
        </h2>
        <MetaLine meta={l.meta} className="mt-8" />
        <p className="mt-8 max-w-2xl text-lg text-dim">{l.intro}</p>

        <ol className="mt-12 border-t border-rule">
          {l.controls.map(([control, effect], i) => (
            <li key={control} className="grid gap-2 border-b border-rule py-5 md:grid-cols-[4rem_minmax(0,6fr)_minmax(0,5fr)] md:items-baseline md:gap-8">
              <span aria-hidden="true" className="cs-outline font-serif text-4xl leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-serif text-2xl leading-tight sm:text-3xl">{control}</span>
              <span className="text-dim">{effect}</span>
            </li>
          ))}
        </ol>

        <p className="mb-6 mt-20 font-mono text-xs uppercase tracking-[0.22em] text-dim">(The three that matter most)</p>
        <CardGrid cards={l.topThree} />

        <div className="mt-16 border-l-2 border-acc pl-6 sm:pl-10">
          <h3 className="font-serif text-3xl leading-tight sm:text-4xl">For small teams</h3>
          <p className="mt-4 max-w-3xl text-lg text-dim">{l.smallTeams}</p>
        </div>
      </div>
    </section>
  );
}
