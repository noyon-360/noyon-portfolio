"use client";

import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { intro, profile } from "@/data/content";

const accentPattern = new RegExp(`(${intro.accents.map((a) => a.text.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")).join("|")})`);

// How many letters ahead of the fill line are still fading in.
const SOFT_EDGE = 6;
// Each toolkit tag counts as this many letters of scroll, so the tags light up one by one at the end.
const TAG_SPAN = 14;

type Word = { chars: { c: string; i: number }[]; className: string; space: boolean };

// Splits each statement into words of indexed letters, numbering on from the previous statement;
// spaces aren't counted so the fill never stalls. `space` keeps the original spacing, so punctuation
// after an accent phrase stays attached.
function splitLines(lines: string[]) {
  let i = 0;
  const out = lines.map((line) => {
    const words: Word[] = [];
    let space = false;
    for (const seg of line.split(accentPattern)) {
      const className = intro.accents.find((a) => a.text === seg)?.className ?? "";
      for (const tok of seg.split(/(\s+)/)) {
        if (!tok) continue;
        if (!tok.trim()) {
          space = true;
          continue;
        }
        words.push({ chars: [...tok].map((c) => ({ c, i: i++ })), className, space: space && words.length > 0 });
        space = false;
      }
    }
    return words;
  });
  return { lines: out, letters: i };
}

// Dim until the fill line (--lit, set from scroll on the paragraph) reaches this letter, then fades
// up over SOFT_EDGE letters. Inline because the CSS build drops this clamp() from globals.css.
const fill = (i: number, span = SOFT_EDGE): CSSProperties => ({ opacity: `clamp(0.22, calc((var(--lit) - ${i}) / ${span}), 1)` });

// The summary as three short statements whose letters fill from dim to bright as you scroll, then the
// toolkit tags light up. It pins for a stretch of scroll so everything fills on one screen; when it
// can't fit the screen it scrolls normally and fills as it passes through the viewport.
export default function Intro() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(true);
  const [reduced, setReduced] = useState(false);
  const { lines, letters } = useMemo(() => splitLines(intro.lines), []);
  const total = letters + intro.toolkit.length * TAG_SPAN;

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const text = textRef.current;
    if (!section || !content || !text) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pin = true;
    let width = 0;

    const onScroll = () => {
      const vh = window.innerHeight;
      let p: number;
      if (mq.matches) {
        p = 1;
      } else if (pin) {
        // Finish filling at 80% so the full paragraph rests on screen before it scrolls away.
        const r = section.getBoundingClientRect();
        p = -r.top / ((r.height - vh) * 0.8);
      } else {
        const r = text.getBoundingClientRect();
        p = (vh * 0.8 - r.top) / (r.height + vh * 0.3);
      }
      p = Math.min(1, Math.max(0, p));
      text.style.setProperty("--lit", String(p * (total + SOFT_EDGE)));
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
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", onMotion);
    };
  }, [total]);

  const pinMode = pinned && !reduced;

  return (
    <section
      id="intro"
      ref={sectionRef}
      aria-label="Intro"
      className="relative z-10 border-t border-line bg-ink"
      style={pinMode ? { height: "240svh" } : undefined}
    >
      <div className={`${pinMode ? "sticky top-0 h-svh" : ""} flex items-center overflow-hidden bg-ink`}>
        <div ref={contentRef} className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">[Intro]</p>

          <div ref={textRef} aria-hidden="true" style={{ "--lit": 0 } as CSSProperties}>
            <div className="mt-6 max-w-3xl space-y-5 font-display text-2xl font-medium leading-[1.3] tracking-[-0.02em] text-text sm:text-3xl lg:text-[2.25rem]">
              {lines.map((words, li) => (
                <p key={li}>
                  {words.map((w, wi) => (
                    <Fragment key={wi}>
                      {w.space && " "}
                      <span className={`whitespace-nowrap ${w.className}`}>
                        {w.chars.map(({ c, i }) => (
                          <span key={i} style={fill(i)}>
                            {c}
                          </span>
                        ))}
                      </span>
                    </Fragment>
                  ))}
                </p>
              ))}
            </div>

            <ul className="mt-8 flex flex-wrap gap-2">
              {intro.toolkit.map((t, ti) => (
                <li
                  key={t}
                  className="rounded-full border border-line-strong bg-panel px-4 py-1.5 font-mono text-xs text-text sm:text-sm"
                  style={fill(letters + ti * TAG_SPAN, TAG_SPAN)}
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <p className="sr-only">
            {intro.lines.join(" ")} Toolkit: {intro.toolkit.join(", ")}.
          </p>

          <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            — {profile.name}, {profile.location}
          </p>
        </div>
      </div>
    </section>
  );
}
