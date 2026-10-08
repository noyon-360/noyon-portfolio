import Scene from "../../patterns/Scene";
import { mongoScenes, responsibility, responsibilityNote } from "../../studies/mongodb-ransomware-attack";

const scene = mongoScenes[9];

/** 10 — four questions, four different answers; text only. */
export default function Q10Responsibility() {
  return (
    <Scene scene={scene}>
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">(Four questions)</p>
      <dl className="mt-6 border-t border-rule">
        {responsibility.map(([q, a], i) => (
          <div key={q} className="grid gap-3 border-b border-rule py-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10">
            <dt className="flex gap-5 font-serif text-2xl leading-tight sm:text-3xl">
              <span aria-hidden="true" className="cs-outline w-10 shrink-0 text-3xl leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              {q}
            </dt>
            <dd className="text-lg leading-snug text-dim">{a}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-10 max-w-3xl border-l-2 border-acc pl-6 text-lg">{responsibilityNote}</p>
    </Scene>
  );
}
