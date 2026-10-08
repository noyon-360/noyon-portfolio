"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../../lib/scroll";
import { Stamp } from "../../patterns/Editorial";
import { mongoTimeline } from "../../studies/mongodb-ransomware-attack";

/**
 * The full log-backed timeline as a horizontal strip of dated cards, each with its confidence rating. On wide
 * screens with motion allowed the section pins and vertical scroll drives the strip sideways; phones and reduced
 * motion get a plain grid of the same cards.
 */
export default function Timeline() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const section = root.current;
    const strip = track.current;
    if (!section || !strip) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => Math.max(0, strip.scrollWidth - strip.clientWidth);
      gsap.to(strip, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id={mongoTimeline.id} data-case="c4" aria-labelledby={`${mongoTimeline.id}-h`} className="overflow-hidden border-t border-rule bg-paper py-24 md:flex md:min-h-svh md:flex-col md:justify-center">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:pr-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim">({mongoTimeline.label})</p>
        <h2 id={`${mongoTimeline.id}-h`} className="mt-6 font-serif text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[0.95]">
          {mongoTimeline.title}
        </h2>
        <p className="mt-4 max-w-2xl text-dim">{mongoTimeline.note}</p>
      </div>
      <ol
        ref={track}
        className="mt-12 grid border-t border-rule sm:grid-cols-2 lg:grid-cols-4 md:motion-safe:flex md:motion-safe:w-full md:motion-safe:border-b md:motion-safe:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {mongoTimeline.items.map((item, i) => {
          const confirmed = item.confidence === "Confirmed";
          return (
            <li key={item.date} className="flex min-h-60 shrink-0 flex-col border-b border-rule bg-paper p-6 sm:border-r md:motion-safe:w-[22rem] md:motion-safe:border-b-0 md:motion-safe:first:border-l">
              <div className="flex items-baseline justify-between gap-4">
                <span aria-hidden="true" className="cs-outline font-serif text-5xl leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`font-mono text-[11px] uppercase tracking-[0.16em] ${item.source === "External" ? "text-signal" : "text-dim"}`}>{item.source}</span>
              </div>
              <h3 className="mt-8 font-mono text-sm uppercase tracking-[0.12em] text-acc">{item.date}</h3>
              <p className="mt-3 text-lg leading-snug">{item.body}</p>
              <div className="mt-auto pt-6">
                {confirmed ? <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">✓ {item.confidence}</span> : <Stamp>{item.confidence}</Stamp>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
