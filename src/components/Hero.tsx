"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { profile, stats, summaryParts } from "@/data/content";

// Steps: three headline lines, the name line, one per summary part, then the proof (CTAs + stats).
const summaryLabels = ["Shipped", "Full-stack", "Ownership", "Toolkit"];
const steps = [
  "The app",
  "The server",
  "Behind it",
  "Who I am",
  ...summaryParts.map((_, i) => summaryLabels[i] ?? `Part ${i + 1}`),
  "Proof",
];
const NAME = 3;
const SUMMARY = 4;
const PROOF = SUMMARY + summaryParts.length;
const last = steps.length - 1;

// Each headline line is one scroll step; the accent word gets its colour and a drawn underline.
const lines: { words: string[]; accent?: { word: string; className: string } }[] = [
  { words: ["I", "build", "the", "app"], accent: { word: "app", className: "text-client" } },
  { words: ["and", "the", "server"], accent: { word: "server", className: "text-server" } },
  { words: ["behind", "it."] },
];

// Phrases in the summary that skimmers should catch.
const keyTerms = ["35+ cross-platform apps", "Flutter", "NestJS/Firebase"];
const termPattern = new RegExp(`(${keyTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")).join("|")})`);

// A pinned intro: each scroll step reveals the next part of the pitch, then the next section slides
// over the scaled-back hero. When the hero can't fit one screen (small phones) it unpins and each
// part reveals as it scrolls into view instead.
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [clock, setClock] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pin = true;
    let width = 0;

    const onScroll = () => {
      const stage = stageRef.current;
      const dim = dimRef.current;
      if (pin) {
        // The last 100svh of the section is the hand-off, while the next section slides over.
        const r = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const span = r.height - 2 * vh;
        const p = Math.min(1, Math.max(0, -r.top / span));
        const h = Math.min(1, Math.max(0, (-r.top - span) / vh));
        setActive(Math.round(p * last));
        if (stage) stage.style.transform = h ? `scale(${1 - 0.06 * h})` : "";
        if (dim) dim.style.opacity = String(h * 0.7);
        return;
      }
      if (stage) stage.style.transform = "";
      if (dim) dim.style.opacity = "0";
      let a = 0;
      content.querySelectorAll<HTMLElement>("[data-step]").forEach((m) => {
        if (m.getBoundingClientRect().top < window.innerHeight * 0.85) a = Math.max(a, Number(m.dataset.step));
      });
      setActive(a);
    };

    const measure = (force = false) => {
      // Mobile toolbars resize the viewport while scrolling; only re-decide pinning on width changes.
      if (!force && window.innerWidth === width) return onScroll();
      width = window.innerWidth;
      pin = !mq.matches && content.offsetHeight <= window.innerHeight;
      setPinned(pin);
      setReduced(mq.matches);
      onScroll();
    };
    const onResize = () => measure();
    const onMotion = () => measure(true);

    measure(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    mq.addEventListener("change", onMotion);

    // Hold the first reveal until the intro wipe has cleared (see src/lib/intro.ts).
    const seen = document.documentElement.dataset.intro === "seen";
    const readyTimer = window.setTimeout(() => setReady(true), seen ? 0 : 900);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", onMotion);
      window.clearTimeout(readyTimer);
    };
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

  function goTo(i: number) {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (i / last) * (el.offsetHeight - 2 * window.innerHeight), behavior: "smooth" });
  }

  const pinMode = pinned && !reduced;
  const shown = (i: number) => ready && (reduced || active >= i);
  const block = (i: number, spring = false) =>
    `transition-all duration-700 ${spring ? "ease-[cubic-bezier(0.34,1.4,0.64,1)]" : "ease-out"} ${
      shown(i) ? "translate-y-0 opacity-100" : `pointer-events-none opacity-0 ${spring ? "translate-y-10" : "translate-y-6"}`
    }`;

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative"
      style={pinMode ? { height: `${steps.length * 50 + 200}svh`, marginBottom: "-100svh" } : undefined}
    >
      <div className="intro-wipe" aria-hidden="true">
        <span className="font-mono text-sm font-semibold tracking-[0.3em]">NN</span>
        <span className="intro-bar" />
      </div>

      <div
        ref={stageRef}
        className={`${pinMode ? "sticky top-0 h-svh" : "min-h-svh"} relative flex origin-[50%_30%] items-center overflow-hidden`}
      >
        <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-client/15 blur-3xl" aria-hidden="true" />
        <div
          className={`pointer-events-none absolute -right-40 top-40 h-[28rem] w-[28rem] rounded-full bg-server/15 blur-3xl transition-opacity duration-1000 ${
            shown(1) ? "opacity-100" : "opacity-20"
          }`}
          aria-hidden="true"
        />

        <div ref={contentRef} className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:px-6">
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
              <span key={li} data-step={li} className="flip-line">
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

          <div data-step={NAME} className={block(NAME)}>
            <p className="mt-8 font-mono text-sm text-text">
              <TypeOut text={`${profile.name} — ${profile.title} · ${profile.roles.join(" · ")}`} run={shown(NAME)} instant={reduced} />
            </p>
            {/* One part lights up per step: the current part reads brightest, upcoming parts stay ghosted. */}
            <p className="mt-4 max-w-2xl text-muted md:text-lg">
              {summaryParts.map((part, i) => (
                <Fragment key={i}>
                  {i > 0 && " "}
                  <span data-step={SUMMARY + i}>
                    <SummaryPart
                      text={part}
                      state={!shown(SUMMARY + i) ? "next" : !reduced && active === SUMMARY + i ? "now" : "past"}
                    />
                  </span>
                </Fragment>
              ))}
            </p>
          </div>

          <div data-step={PROOF} inert={!shown(PROOF)}>
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

        {pinMode && (
          <div className="absolute inset-x-0 bottom-4 mx-auto flex max-w-6xl items-center gap-4 px-4 sm:px-6">
            <nav aria-label="Intro steps" className="flex flex-1 gap-1.5">
              {steps.map((label, i) => (
                <button
                  key={label}
                  onClick={() => goTo(i)}
                  aria-current={i === active ? "step" : undefined}
                  aria-label={label}
                  className="flex-1 py-2"
                >
                  <span className={`block h-0.5 rounded-full transition-colors duration-500 ${i <= active ? "bg-text" : "bg-line"}`} />
                </button>
              ))}
            </nav>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted" aria-live="polite">
              {active < last ? "Scroll ↓ " : ""}
              <span className="text-text">{String(active + 1).padStart(2, "0")}</span> / {String(steps.length).padStart(2, "0")}
            </span>
          </div>
        )}

        {/* Darkens the hero as the next section slides over it. */}
        <div ref={dimRef} className="pointer-events-none absolute inset-0 bg-ink opacity-0" aria-hidden="true" />
      </div>
    </section>
  );
}

// A summary part split into words that fade in one after another; key terms stay bold.
function SummaryPart({ text, state }: { text: string; state: "next" | "now" | "past" }) {
  const out = [];
  let n = 0;
  for (const [si, seg] of text.split(termPattern).entries()) {
    const words = [];
    for (const [ti, tok] of seg.split(/(\s+)/).entries()) {
      if (!tok.trim()) {
        words.push(tok);
        continue;
      }
      words.push(
        <span key={ti} data-state={state} className="reveal-word" style={{ transitionDelay: state === "next" ? "0ms" : `${n * 25}ms` }}>
          {tok}
        </span>,
      );
      n++;
    }
    out.push(
      keyTerms.includes(seg) ? (
        <strong key={si} className="font-medium text-text">
          {words}
        </strong>
      ) : (
        <Fragment key={si}>{words}</Fragment>
      ),
    );
  }
  return out;
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
