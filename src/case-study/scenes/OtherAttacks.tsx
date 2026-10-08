"use client";

import { useEffect, useRef, useState } from "react";
import { otherAttacks } from "../content";
import { ScrollTrigger, useReducedMotion } from "../lib/scroll";
import { Pill } from "../patterns/Editorial";

/**
 * Other attacks — a horizontal timeline driven by vertical scroll on wide screens.
 * Phones and reduced motion get the same cards stacked vertically, so nothing needs a sideways swipe.
 */
export default function OtherAttacks() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const horizontal = wide && !reduced;

  useEffect(() => {
    const el = root.current;
    const t = track.current;
    if (!horizontal || !el || !t) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const max = t.scrollWidth - t.clientWidth;
        t.style.transform = `translateX(${-self.progress * max}px)`;
      },
    });
    ScrollTrigger.refresh();
    return () => {
      st.kill();
      t.style.transform = "";
    };
  }, [horizontal]);

  return (
    <section
      id="other-attacks"
      ref={root}
      aria-labelledby="other-h"
      className="relative border-t border-rule"
      style={horizontal ? { height: `${otherAttacks.items.length * 55 + 60}svh` } : undefined}
    >
      <div className={horizontal ? "sticky top-0 flex h-svh flex-col justify-center overflow-hidden lg:mr-20" : "py-24"}>
        <div className="px-4 sm:px-8 lg:pr-24">
          <div className="mx-auto max-w-7xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim">({otherAttacks.label})</p>
            <h2 id="other-h" className="mt-6 font-serif text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[0.95]">
              {otherAttacks.title}
            </h2>
          </div>
        </div>
        <ol ref={track} className={`mt-12 flex gap-6 px-4 sm:px-8 ${horizontal ? "w-full will-change-transform" : "flex-col"}`}>
          {otherAttacks.items.map((a) => (
            <li
              key={a.title}
              data-case={a.title === "NotPetya" ? undefined : "c2"}
              className={`flex shrink-0 flex-col border p-6 sm:p-8 ${horizontal ? "w-[min(26rem,70vw)]" : ""} ${
                a.featured ? "border-amber bg-amber/[0.06]" : "border-rule"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm text-dim">{a.date}</span>
                <Pill>{a.pill}</Pill>
              </div>
              <h3 className="mt-10 font-serif text-4xl leading-none">{a.title}</h3>
              <p className="mt-4 text-dim">{a.body}</p>
              {a.featured && <p className="mt-auto pt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-amber">Closest to home</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
