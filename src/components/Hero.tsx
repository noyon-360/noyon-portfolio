"use client";

import { Fragment, useEffect, useState, type CSSProperties } from "react";
import { profile, stats } from "@/data/content";

// The intro plays on its own once the page loads: each headline line flips up, the name line types
// out, then the CTAs and stats land. Delays (ms) are measured from when the intro wipe clears.
const NAME = 3;
const PROOF = 4;
const timeline = [0, 380, 760, 1250, 2350];

// Each headline line is one beat; the accent word gets its colour and a drawn underline.
const lines: { words: string[]; accent?: { word: string; className: string } }[] = [
  { words: ["I", "break", "systems"], accent: { word: "break", className: "text-server" } },
  { words: ["to", "secure", "them,"] },
  { words: ["and", "build", "the", "apps."], accent: { word: "apps.", className: "text-client" } },
];

export default function Hero() {
  const [active, setActive] = useState(-1);
  const [reduced, setReduced] = useState(false);
  const [clock, setClock] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Wait for the intro wipe to clear (see src/lib/intro.ts); reduced motion shows everything at once.
    const seen = document.documentElement.dataset.intro === "seen";
    const start = seen ? 100 : 900;
    const timers = isReduced
      ? [window.setTimeout(() => (setReduced(true), setActive(PROOF)), 0)]
      : timeline.map((t, i) => window.setTimeout(() => setActive(i), start + t));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  // Live local time in Gazipur, plus the current month for the availability pill.
  useEffect(() => {
    const time = new Intl.DateTimeFormat("en-GB", { timeZone: profile.timeZone, hour: "2-digit", minute: "2-digit" });
    const monthName = new Intl.DateTimeFormat("en-GB", { timeZone: profile.timeZone, month: "short" });
    const tick = () => {
      const now = new Date();
      setClock(time.format(now));
      setMonth(monthName.format(now));
    };
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 15_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, []);

  const shown = (i: number) => active >= i;
  const block = (i: number, spring = false) =>
    `transition-all duration-700 ${spring ? "ease-[cubic-bezier(0.34,1.4,0.64,1)]" : "ease-out"} ${
      shown(i) ? "translate-y-0 opacity-100" : `pointer-events-none opacity-0 ${spring ? "translate-y-10" : "translate-y-6"}`
    }`;

  return (
    <section id="top" className="relative">
      <div className="intro-wipe" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative splash shown for under a second */}
        <img
          src={profile.photo}
          alt=""
          width={72}
          height={72}
          className="h-18 w-18 rounded-full border-2 border-current object-cover"
        />
        <span className="font-mono text-sm font-semibold tracking-[0.3em]">NN</span>
        <span className="intro-bar" />
      </div>

      <div className="relative flex min-h-svh items-center overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-client/15 blur-3xl" aria-hidden="true" />
        <div
          className={`pointer-events-none absolute -right-40 top-40 h-[28rem] w-[28rem] rounded-full bg-server/15 blur-3xl transition-opacity duration-1000 ${
            shown(1) ? "opacity-100" : "opacity-20"
          }`}
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span className="slide-in text-text">01</span>
            <span className="slide-in" style={{ "--i": 1 } as CSSProperties}>
              {profile.location}
            </span>
            <span className="slide-in tabular-nums" style={{ "--i": 2 } as CSSProperties}>
              <span className="text-text">{clock ?? "--:--"}</span> local · {profile.timezone}
            </span>
            <span
              className="slide-in inline-flex items-center gap-2.5 rounded-full border border-line px-3 py-1 normal-case tracking-normal text-text"
              style={{ "--i": 3 } as CSSProperties}
            >
              {/* Availability bar: past months, this month (open), the months ahead. */}
              <span className="flex items-center gap-0.5" aria-hidden="true">
                {Array.from({ length: 7 }, (_, i) => (
                  <span
                    key={i}
                    className={`h-2.5 w-1 rounded-full ${
                      i < 3 ? "bg-muted/40" : i === 3 ? "animate-pulse bg-emerald-400" : "border border-line-strong"
                    }`}
                  />
                ))}
              </span>
              Open now{month ? ` · ${month}` : ""} — freelance &amp; remote
            </span>
          </div>

          <h1 className="mt-8 font-display text-5xl font-medium leading-[0.95] tracking-[-0.03em] sm:text-7xl lg:text-[6rem]">
            {lines.map((l, li) => (
              <span key={li} className="flip-line">
                {l.words.map((w, wi) => (
                  <Fragment key={wi}>
                    {wi > 0 && " "}
                    <span
                      data-on={shown(li)}
                      className={`flip-word ${w === l.accent?.word ? `accent-mark ${l.accent.className}` : ""}`}
                      style={{ animationDelay: `${wi * 70}ms` }}
                    >
                      {w}
                    </span>
                  </Fragment>
                ))}
              </span>
            ))}
          </h1>

          <div className={block(NAME)}>
            <p className="mt-8 font-mono text-sm text-text">
              <TypeOut text={`${profile.name} — ${profile.title} · ${profile.roles.join(" · ")}`} run={shown(NAME)} instant={reduced} />
            </p>
          </div>

          <div inert={!shown(PROOF)}>
            <div className={`mt-10 flex flex-wrap gap-3 ${block(PROOF, true)}`}>
              <a href="#skills" className="rounded-full bg-text px-6 py-3 font-medium text-ink transition-opacity hover:opacity-85">
                Explore my skills in 3D ↓
              </a>
              <a href={`mailto:${profile.email}`} className="rounded-full border border-line-strong px-6 py-3 font-medium transition-colors hover:bg-panel-2">
                Email me
              </a>
            </div>

            <dl className={`mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4 ${block(PROOF)}`}>
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`bg-ink p-5 transition-all duration-700 ease-out ${shown(PROOF) ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                  style={{ transitionDelay: shown(PROOF) ? `${150 + i * 90}ms` : "0ms" }}
                >
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="font-display text-3xl font-semibold tabular-nums sm:text-4xl">
                      <CountUp value={s.value} run={shown(PROOF)} instant={reduced} />
                    </span>
                    <span className="mt-1 block text-sm text-muted">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

      </div>
    </section>
  );
}

// Types the line out character by character; the full text reserves its space so nothing reflows.
function TypeOut({ text, run, instant }: { text: string; run: boolean; instant: boolean }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const next = !run ? 0 : instant ? text.length : Math.min(text.length, Math.floor((t - start) / 14));
      setN(next);
      if (run && next < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, run, instant]);

  return (
    <span className="relative block">
      <span className="invisible">{text}</span>
      <span className="absolute inset-0" aria-hidden="true">
        {text.slice(0, n)}
        {run && !instant && <span className="type-caret" />}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

// Counts "35+" up from 0 when shown; values without a leading number render as-is.
function CountUp({ value, run, instant }: { value: string; run: boolean; instant: boolean }) {
  const match = /^(\d+)(.*)$/.exec(value);
  const target = match ? Number(match[1]) : 0;
  const [n, setN] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 1200);
      const next = !run ? 0 : instant ? target : Math.round(target * (1 - (1 - k) ** 3));
      setN(next);
      if (run && next < target) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, instant]);

  return <>{match ? `${n}${match[2]}` : value}</>;
}
