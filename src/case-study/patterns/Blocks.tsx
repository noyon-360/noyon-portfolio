// Static editorial blocks: definition card (D), pull quote (H), marquee ticker, card grid.
import type { Card } from "../content";
import { Pill } from "./Editorial";

type Definition = { term: string; say: string; pos: string; meaning: string; synonyms: string[] };

/** Pattern D — a dictionary-style entry. */
export function DefinitionCard({ def }: { def: Definition }) {
  return (
    <article className="border border-rule bg-ivory/[0.025] p-6 sm:p-8" aria-label={`Definition: ${def.term}`}>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">Definition</p>
      <h3 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">{def.term}</h3>
      <p className="mt-3 font-mono text-sm text-dim">{def.say}</p>
      <p className="mt-1 font-serif text-lg italic text-acc">{def.pos}</p>
      <p className="mt-6 border-t border-rule pt-6 text-lg leading-relaxed">{def.meaning}</p>
      <p className="mt-6 flex flex-wrap items-center gap-2 text-sm text-dim">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em]">Synonyms</span>
        {def.synonyms.map((s) => (
          <span key={s} className="italic text-ivory/85">
            {s}
          </span>
        ))}
      </p>
    </article>
  );
}

/** Pattern H — one sentence, full screen, nothing else. The heading is for screen readers and the rail. */
export function PullQuote({ id, n, caseId, quote, label }: { id: string; n?: string; caseId?: "c1" | "c2"; quote: string; label: string }) {
  return (
    <section id={id} data-case={caseId} aria-labelledby={`${id}-h`} className="flex min-h-svh items-center justify-center border-t border-rule px-4 py-24 sm:px-8 lg:pr-24">
      <h2 id={`${id}-h`} className="sr-only">
        {n ? `${n}: ` : ""}
        {label}
      </h2>
      <blockquote className="max-w-6xl text-balance text-center font-serif text-[clamp(2.6rem,7vw,7.5rem)] leading-[1] tracking-[-0.01em]">
        <span aria-hidden="true" className="text-acc">&ldquo;</span>
        {quote}
        <span aria-hidden="true" className="text-acc">&rdquo;</span>
      </blockquote>
    </section>
  );
}

/** Ticker strip between chapters. Decorative copy is aria-hidden; the list is read once. */
export function Marquee({ items, caseId }: { items: string[]; caseId?: "c1" | "c2" }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <li key={i} className="flex items-center whitespace-nowrap px-6 font-serif text-4xl italic sm:text-6xl">
          {t}
          <span aria-hidden="true" className="ml-12 text-2xl not-italic text-acc">
            ✳
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div data-case={caseId} className="overflow-hidden border-y border-rule py-6" role="region" aria-label="Ticker">
      <div className="cs-marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

export function CardGrid({ cards, cols = 3 }: { cards: Card[]; cols?: 2 | 3 }) {
  return (
    <ul className={`grid gap-px border border-rule bg-rule sm:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : ""}`}>
      {cards.map((c, i) => (
        <li key={c.title} className="flex flex-col bg-paper p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="cs-outline font-serif text-5xl leading-none" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            {c.pill && <Pill>{c.pill}</Pill>}
          </div>
          <h3 className="mt-8 font-serif text-3xl leading-tight">{c.title}</h3>
          <p className="mt-3 text-dim">{c.body}</p>
        </li>
      ))}
    </ul>
  );
}
