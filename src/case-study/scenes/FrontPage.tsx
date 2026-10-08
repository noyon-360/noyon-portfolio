"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import type { Front } from "../content";
import { ScrollTrigger } from "../lib/scroll";
import Stage from "../patterns/Stage";
import { GlobeSvg } from "../three/fallbacks";

const CoverGlobe = dynamic(() => import("../three/Globe").then((m) => m.CoverGlobe), { ssr: false });

/** 00 — a study's front page: masthead over a slow wireframe globe and the lead story. */
export default function FrontPage({ front }: { front: Front }) {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => (progress.current = self.progress),
    });
    return () => st.kill();
  }, []);

  return (
    <section id="front" ref={root} data-case={front.caseId} aria-labelledby="front-h" className="relative flex min-h-svh flex-col px-4 pb-10 pt-20 sm:px-8 lg:pr-24">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
          <span>{front.edition}</span>
          <span>{front.dateline}</span>
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center py-10 md:py-16">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <Stage alt={front.globeAlt} object={CoverGlobe} fallback={<GlobeSvg />} progress={progress} camera={{ position: [0, 0, 7.5] }} />
          </div>
          <p className="relative font-mono text-xs uppercase tracking-[0.24em] text-acc">{front.kicker}</p>
          <h1 id="front-h" className="relative mt-4 text-balance text-center font-serif text-[clamp(3.2rem,11vw,10.5rem)] leading-[0.88] tracking-[-0.02em]">
            {front.masthead}
          </h1>
        </div>

        <article className="grid gap-6 border-y-[3px] border-double border-rule py-8 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-12">
          <h2 className="font-serif text-4xl leading-[1] sm:text-5xl">{front.headline}</h2>
          <div>
            <p className="text-dim md:text-lg">{front.deck}</p>
            <a href={front.read} className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ivory hover:text-acc">
              Read <span aria-hidden="true">→</span>
            </a>
          </div>
        </article>

        <div className="mt-10 flex flex-col items-center gap-3" aria-hidden="true">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim">Scroll</span>
          <span className="h-10 w-px overflow-hidden bg-rule">
            <span className="cs-scroll-cue block h-full w-full bg-ivory" />
          </span>
        </div>
      </div>
    </section>
  );
}
