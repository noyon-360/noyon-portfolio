import { npmParts } from "../../studies/npm-supply-chain-attack";

const part = npmParts.fix;

/** Part 03 opener: a plain chapter title. The brief gives this part no hook sentence. */
export default function FixHeader() {
  return (
    <section id={part.id} data-case={part.caseId} aria-labelledby={`${part.id}-h`} className="flex min-h-[70svh] items-center border-t border-rule px-4 py-24 sm:px-8 lg:pr-24">
      <div className="mx-auto w-full max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-acc">{part.eyebrow}</p>
        <h2 id={`${part.id}-h`} className="mt-6 font-serif text-[clamp(4rem,14vw,13rem)] leading-[0.85] tracking-[-0.02em]">
          {part.title}
        </h2>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-dim">({part.label})</p>
      </div>
    </section>
  );
}
