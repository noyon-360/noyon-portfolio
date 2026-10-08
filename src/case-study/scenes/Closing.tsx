import Link from "next/link";
import type { Closing as ClosingContent } from "../content";
import { PullQuote } from "../patterns/Blocks";
import CaseStudyCard from "../patterns/CaseStudyCard";
import { caseStudies } from "../registry";

/** Closing: where it went wrong, a checklist for today, a final pull quote, then a pointer to another study. */
export default function Closing({ closing, related }: { closing: ClosingContent; related?: string }) {
  const relatedIndex = caseStudies.findIndex((s) => s.slug === related);
  return (
    <>
      <section id="closing" data-case={closing.caseId} aria-labelledby="closing-h" className="border-t border-rule px-4 py-24 sm:px-8 md:py-32 lg:pr-24">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim">({closing.label})</p>
          <h2 id="closing-h" className="mt-6 font-serif text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[0.95]">
            {closing.title}
          </h2>
          <div className="mt-14 border-l-2 border-acc pl-6 sm:pl-10">
            <h3 className="font-serif text-4xl leading-tight">{closing.head}</h3>
            <p className="mt-4 max-w-2xl text-lg text-dim">{closing.body}</p>
          </div>

          <h3 className="mt-24 font-mono text-xs uppercase tracking-[0.22em] text-dim">({closing.todayTitle})</h3>
          <ul className="mt-6 border-t border-rule">
            {closing.today.map((t, i) => (
              <li key={t} className="flex items-baseline gap-6 border-b border-rule py-5">
                <span aria-hidden="true" className="grid h-6 w-6 shrink-0 translate-y-1 place-items-center border border-ivory/60 font-mono text-[10px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xl leading-snug sm:text-2xl">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PullQuote id="final-quote" caseId={closing.caseId} label="Final word" quote={closing.quote} />

      {relatedIndex >= 0 && (
        <section aria-labelledby="related-h" className="border-t border-rule px-4 py-24 sm:px-8 lg:pr-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 id="related-h" className="font-mono text-xs uppercase tracking-[0.22em] text-dim">
                (Read next)
              </h2>
              <Link href="/case-study" className="font-mono text-xs uppercase tracking-[0.18em] text-ivory hover:text-amber">
                All case studies →
              </Link>
            </div>
            <ul className="mt-8 grid border border-rule md:grid-cols-2">
              <CaseStudyCard study={caseStudies[relatedIndex]} index={relatedIndex} />
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
