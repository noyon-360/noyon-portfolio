"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { expertise } from "@/data/content";

const JourneyScene = dynamic(() => import("./JourneyScene"), { ssr: false });

const accentText = { client: "text-client", server: "text-server", ops: "text-ops", craft: "text-craft" } as const;
const accentBg = { client: "bg-client", server: "bg-server", ops: "bg-ops", craft: "bg-craft" } as const;
const sideLabel = { client: "Client side", server: "Server side", ops: "Delivery", craft: "Hands-on" } as const;

export default function ExpertiseJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [bar, setBar] = useState(0);
  const last = expertise.length - 1;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      progress.current = p;
      setActive(Math.round(p * last));
      setBar(Math.round(p * 100));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Only render frames while the stage is on screen.
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(el);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setReduced(mq.matches);
    onMotion();
    mq.addEventListener("change", onMotion);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
      mq.removeEventListener("change", onMotion);
    };
  }, [last]);

  function goTo(i: number) {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (i / last) * (el.offsetHeight - window.innerHeight), behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <section
      id="expertise"
      ref={sectionRef}
      aria-label="Expertise, explored in 3D"
      className="relative"
      style={{ height: `${expertise.length * 100 + 40}svh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-ink">
        <div className="absolute inset-0" aria-hidden="true">
          <JourneyScene progressRef={progress} active={active} running={inView} reduced={reduced} />
        </div>

        {/* Scrims keep the text readable over the scene. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent md:bg-gradient-to-r md:from-ink md:via-ink/60 md:to-transparent md:to-60%" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink to-transparent" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col px-4 pb-6 pt-20 sm:px-6 md:pb-10 md:pt-24">
          <div className="flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span>
              <span className="text-text">02</span> / Expertise in 3D
            </span>
            <span aria-live="polite">
              Step <span className="text-text">{String(active + 1).padStart(2, "0")}</span> / {String(expertise.length).padStart(2, "0")}
            </span>
          </div>

          <div className="relative mt-auto grid flex-1 md:mt-0 md:items-center">
            {expertise.map((e, i) => (
              <article
                key={e.id}
                aria-hidden={i !== active}
                inert={i !== active}
                className={`col-start-1 row-start-1 self-end transition-all duration-500 md:max-w-md md:self-center ${
                  i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
                }`}
              >
                <p className={`font-mono text-xs uppercase tracking-[0.2em] ${accentText[e.accent]}`}>
                  {String(i + 1).padStart(2, "0")} · {sideLabel[e.accent]} · {e.label}
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">
                  {e.title}
                </h2>
                <p className="mt-3 text-muted md:text-lg">{e.summary}</p>
                <ul className="mt-5 hidden space-y-2 sm:block">
                  {e.proof.map((p) => (
                    <li key={p} className="flex gap-3 text-sm text-text/90">
                      <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${accentBg[e.accent]}`} />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-3">
                  <p>
                    <span className={`font-display text-4xl font-semibold ${accentText[e.accent]}`}>{e.metric.value}</span>
                    <span className="ml-2 font-mono text-xs uppercase tracking-widest text-muted">{e.metric.label}</span>
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {e.tools.map((t) => (
                    <span key={t} className="rounded border border-line bg-panel/70 px-2 py-0.5 font-mono text-[11px] text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <nav aria-label="Expertise steps" className="flex flex-1 gap-1.5">
              {expertise.map((e, i) => (
                <button
                  key={e.id}
                  onClick={() => goTo(i)}
                  aria-current={i === active ? "step" : undefined}
                  className="group flex-1 py-2 text-left"
                >
                  <span className={`block h-0.5 rounded-full transition-colors ${i <= active ? accentBg[e.accent] : "bg-line"}`} />
                  <span
                    className={`mt-2 hidden font-mono text-[11px] uppercase tracking-widest transition-colors md:block ${
                      i === active ? "text-text" : "text-muted group-hover:text-text"
                    }`}
                  >
                    {e.label}
                  </span>
                  <span className="sr-only md:hidden">{e.label}</span>
                </button>
              ))}
            </nav>
            <span className="hidden w-12 text-right font-mono text-xs text-muted sm:block">{bar}%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
