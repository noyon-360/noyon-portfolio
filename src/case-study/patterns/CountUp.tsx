"use client";

import { useEffect, useRef } from "react";
import type { Stat } from "../content";
import { gsap, ScrollTrigger } from "../lib/scroll";

const fmt = (v: number) => Math.round(v).toLocaleString("en-US");

/** Pattern C — one number that counts up from 0 the first time it scrolls into view. */
export function CountUp({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = { v: 0 };
    let tween: gsap.core.Tween | undefined;
    // The server-rendered text is the final value; only zero it once we know we can animate it.
    el.textContent = "0";
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        tween = gsap.to(box, { v: stat.value, duration: 1.8, ease: "power3.out", onUpdate: () => (el.textContent = fmt(box.v)) });
      },
    });
    return () => {
      st.kill();
      tween?.kill();
    };
  }, [stat.value]);

  return (
    <>
      <span className="sr-only">
        {stat.note ? `${stat.note} ` : ""}
        {stat.prefix}
        {fmt(stat.value)}
        {stat.suffix} {stat.label}
      </span>
      <span aria-hidden="true" className="tabular-nums">
        {stat.prefix}
        <span ref={ref}>{fmt(stat.value)}</span>
        {stat.suffix}
      </span>
    </>
  );
}

/** "By the numbers" rows. */
export function Stats({ stats, title = "By the numbers" }: { stats: Stat[]; title?: string }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">({title})</p>
      <dl className="mt-6 border-t border-rule">
        {stats.map((s) => (
          <div key={s.label} className="grid grid-cols-1 items-baseline gap-2 border-b border-rule py-6 sm:grid-cols-[1fr_auto] sm:gap-8">
            <dt className="order-2 font-mono text-xs uppercase tracking-[0.16em] text-dim sm:order-1">
              {s.label}
              {s.note && <span className="ml-2 normal-case tracking-normal text-dim/80">({s.note})</span>}
            </dt>
            <dd className="order-1 font-serif text-[clamp(3rem,8vw,7rem)] leading-none text-acc sm:order-2">
              <CountUp stat={s} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
