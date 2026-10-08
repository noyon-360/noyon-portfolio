"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../../lib/scroll";
import { npmTimeline } from "../../studies/npm-supply-chain-attack";

/**
 * The timeline as a horizontal strip of dated cards. On wide screens with motion allowed the section pins
 * and vertical scroll drives the strip sideways; phones and reduced motion get a plain grid of the same cards.
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
    <section ref={root} id={npmTimeline.id} data-case="c3c" aria-labelledby={`${npmTimeline.id}-h`} className="overflow-hidden border-t border-rule bg-paper py-24 md:flex md:min-h-svh md:flex-col md:justify-center">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:pr-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim">({npmTimeline.label})</p>
        <h2 id={`${npmTimeline.id}-h`} className="mt-6 font-serif text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[0.95]">
          {npmTimeline.title}
        </h2>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-amber">{npmTimeline.note}</p>
      </div>
      <ol
        ref={track}
        className="mt-12 grid border-t border-rule sm:grid-cols-2 lg:grid-cols-4 md:motion-safe:flex md:motion-safe:w-full md:motion-safe:border-b md:motion-safe:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {npmTimeline.items.map((item, i) => (
          <li key={item.title} className="flex min-h-56 shrink-0 flex-col border-b border-rule bg-paper p-6 sm:border-r md:motion-safe:w-[22rem] md:motion-safe:border-b-0 md:motion-safe:first:border-l">
            <div className="flex items-baseline justify-between">
              <span aria-hidden="true" className="cs-outline font-serif text-5xl leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`font-mono text-xs uppercase tracking-[0.16em] ${item.date.startsWith("TODO") ? "text-amber" : "text-dim"}`}>{item.date}</span>
            </div>
            <h3 className="mt-8 font-serif text-3xl leading-tight">{item.title}</h3>
            <p className={`mt-3 ${item.body.startsWith("TODO") ? "font-mono text-sm text-amber" : "text-dim"}`}>{item.body}</p>
            <span aria-hidden="true" className="mt-auto block h-px w-full bg-acc/60 pt-0" />
          </li>
        ))}
      </ol>
    </section>
  );
}
