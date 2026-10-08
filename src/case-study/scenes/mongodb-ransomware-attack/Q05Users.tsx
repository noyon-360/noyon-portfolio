import { CardGrid } from "../../patterns/Blocks";
import Scene from "../../patterns/Scene";
import { mongoScenes, userActions, userHarms } from "../../studies/mongodb-ransomware-attack";

const scene = mongoScenes[4];

/** 05 — the harms if the data was copied, then the five actions that should not wait for proof. */
export default function Q05Users() {
  return (
    <Scene scene={scene}>
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-dim">(If the data was copied)</p>
      <CardGrid cards={userHarms} />
      <div className="mt-16 border border-rule bg-ivory/[0.025] p-6 sm:p-10">
        <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-acc">Actions that should not wait for proof</h3>
        <ol className="mt-6">
          {userActions.map((a, i) => (
            <li key={a} className="flex gap-5 border-t border-rule py-4">
              <span aria-hidden="true" className="cs-outline w-10 shrink-0 font-serif text-3xl leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-lg leading-snug">{a}</span>
            </li>
          ))}
        </ol>
      </div>
    </Scene>
  );
}
