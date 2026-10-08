import { SceneFooter, SceneHeader } from "../../patterns/Scene";
import { npmLessons } from "../../studies/npm-supply-chain-attack";

/** 17 — lessons for developers and for agencies, as a two-column card grid. */
export default function Q17Lessons() {
  const cols = [
    ["Developers", npmLessons.developers],
    ["Agencies", npmLessons.agencies],
  ] as const;
  return (
    <section id={npmLessons.id} data-case="c3c" aria-labelledby={`${npmLessons.id}-h`} className="border-t border-rule px-4 py-24 sm:px-8 md:py-32 lg:pr-24">
      <SceneHeader n={npmLessons.n} label={npmLessons.label} headingId={`${npmLessons.id}-h`} question={npmLessons.question} meta={npmLessons.meta} />
      <div className="mx-auto mt-14 grid max-w-7xl gap-px border border-rule bg-rule md:grid-cols-2">
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
      <SceneFooter refs={[]} next={npmLessons.next} opinion />
    </section>
  );
}
