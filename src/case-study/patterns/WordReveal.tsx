"use client";

import { useEffect, useRef } from "react";
import type { CaseId } from "../content";
import { ScrollTrigger } from "../lib/scroll";

/**
 * Pattern A — a hook sentence that lights up word by word as you scroll.
 * Sits in a tall section with the sentence pinned (CSS sticky); scroll through the section scrubs the words.
 * Screen readers get the sentence whole; reduced motion shows it lit (case-study.css).
 */
export default function WordReveal({
  id,
  caseId,
  eyebrow,
  title,
  text,
  note,
}: {
  id: string;
  caseId: CaseId;
  eyebrow: string;
  title: string;
  text: string;
  note?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>(".cs-word"));
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 40%",
      end: "bottom bottom",
      onUpdate(self) {
        const lit = Math.round(self.progress * spans.length * 1.15);
        spans.forEach((s, i) => (s.dataset.on = String(i < lit)));
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section id={id} ref={root} data-case={caseId} aria-labelledby={`${id}-h`} className="relative h-[190svh] border-t border-rule">
      <div className="sticky top-0 flex h-svh flex-col justify-center px-4 sm:px-8 lg:pr-24">
        <div className="mx-auto w-full max-w-7xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-acc">{eyebrow}</p>
          <h2 id={`${id}-h`} className="mt-4 font-mono text-sm uppercase tracking-[0.16em] text-dim">
            {title}
          </h2>
          <p className="mt-10 max-w-6xl text-balance font-serif text-[clamp(2.2rem,5.4vw,5.6rem)] leading-[1.02]">
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
              {words.map((w, i) => (
                <span key={i} className="cs-word" data-on="false">
                  {w}{" "}
                </span>
              ))}
            </span>
          </p>
          {note && <p className="mt-10 max-w-xl border-l border-acc pl-4 text-sm text-dim">{note}</p>}
        </div>
      </div>
    </section>
  );
}
