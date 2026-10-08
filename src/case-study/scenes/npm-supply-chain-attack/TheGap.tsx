import { CardGrid } from "../../patterns/Blocks";
import { MetaLine } from "../../patterns/Editorial";
import { npmGap } from "../../studies/npm-supply-chain-attack";

/** The gap in the market, as magazine cards with category pills. Text only, no vendor names or logos. */
export default function TheGap() {
  return (
    <section id={npmGap.id} data-case="c3c" aria-labelledby={`${npmGap.id}-h`} className="border-t border-rule px-4 py-24 sm:px-8 md:py-32 lg:pr-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim">({npmGap.label})</p>
        <h2 id={`${npmGap.id}-h`} className="mt-6 max-w-4xl text-balance font-serif text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[0.95]">
          {npmGap.title}
        </h2>
        <MetaLine meta={npmGap.meta} className="mt-8" />
        <div className="mt-14">
          <CardGrid cards={npmGap.cards} />
        </div>
      </div>
    </section>
  );
}
