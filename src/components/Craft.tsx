"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { craft, type CraftStep, type CraftTrack } from "@/data/content";
import { CRAFT_ART } from "./CraftArt";
import { Section, Tag } from "./Section";

function StepVisual({ step, sizes, className }: { step: CraftStep; sizes: string; className: string }) {
  if ("art" in step) {
    const Art = CRAFT_ART[step.art];
    return (
      <div className={`aspect-[4/3] ${className}`}>
        <Art />
      </div>
    );
  }
  return <Image src={step.src} alt={step.caption} width={step.w} height={step.h} sizes={sizes} className={className} />;
}

// One chapter of the build log: its story and step index stay pinned on the left while its steps
// scroll by on the right, then hand off to the next chapter. The step crossing the middle of the
// screen lights up in the index.
function Chapter({
  track,
  number,
  total,
  onView,
}: {
  track: CraftTrack;
  number: number;
  total: number;
  onView: (step: CraftStep) => void;
}) {
  const [active, setActive] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const compare = track.compare;

  useEffect(() => {
    const steps = stepRefs.current.filter((el) => el !== null);
    const focus = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    // Steps rise in once, the first time they enter the screen.
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.seen = "";
          reveal.unobserve(e.target);
        }
      },
      { threshold: 0.15 },
    );
    steps.forEach((el) => {
      focus.observe(el);
      reveal.observe(el);
    });
    return () => {
      focus.disconnect();
      reveal.disconnect();
    };
  }, []);

  function jump(i: number) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stepRefs.current[i]?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  }

  return (
    <article aria-labelledby={`craft-${track.id}`} className="grid gap-10 lg:grid-cols-3 lg:gap-12">
      <div className="lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:self-start lg:overflow-y-auto">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-craft">
          {String(number).padStart(2, "0")} / {String(total).padStart(2, "0")} · {track.label}
        </p>
        <h3 id={`craft-${track.id}`} className="mt-3 font-display text-3xl font-semibold">
          {track.title}
        </h3>
        <p className="mt-3 text-muted">{track.summary}</p>
        <div className="mt-5 flex flex-wrap gap-1.5">{track.tools.map((t) => <Tag key={t}>{t}</Tag>)}</div>

        <ol aria-label={`${track.label} steps`} className="mt-8 hidden border-l border-line lg:block">
          {track.steps.map((s, i) => (
            <li key={s.caption}>
              <button
                onClick={() => jump(i)}
                aria-current={i === active ? "step" : undefined}
                className={`-ml-px flex w-full gap-3 border-l-2 py-1.5 pl-4 text-left text-sm transition-colors ${
                  i === active ? "border-craft text-text" : "border-transparent text-muted hover:text-text"
                }`}
              >
                <span className={`font-mono ${i === active ? "text-craft" : ""}`}>{String(i + 1).padStart(2, "0")}</span>
                {s.caption}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="lg:col-span-2">
        {compare && (
          <figure className="mb-10 flex flex-col gap-4 rounded-2xl border border-line bg-panel p-4 sm:flex-row sm:items-center">
            <button
              onClick={() => onView({ ...(showGrid ? compare.overlay : compare.base), caption: compare.caption })}
              className="relative mx-auto block w-48 shrink-0 overflow-hidden rounded-lg sm:mx-0"
              aria-label="View poster full size"
            >
              <Image src={compare.base.src} alt="“Innovation” space poster" width={compare.base.w} height={compare.base.h} sizes="192px" className="h-auto w-full" />
              <Image
                src={compare.overlay.src}
                alt=""
                width={compare.overlay.w}
                height={compare.overlay.h}
                sizes="192px"
                className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${showGrid ? "opacity-100" : "opacity-0"}`}
              />
            </button>
            <figcaption>
              <p className="text-sm text-muted">{compare.caption}</p>
              <button
                onClick={() => setShowGrid(!showGrid)}
                aria-pressed={showGrid}
                className="mt-4 rounded-full border border-line-strong px-4 py-1.5 font-mono text-xs uppercase tracking-widest hover:bg-panel-2"
              >
                {showGrid ? "Hide grid" : "Show grid"} · φ
              </button>
            </figcaption>
          </figure>
        )}

        <ol className={`grid items-start gap-x-6 gap-y-10 ${track.columns === 2 ? "sm:grid-cols-2" : ""}`}>
          {track.steps.map((s, i) => (
            <li
              key={s.caption}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              data-index={i}
              className="translate-y-6 opacity-0 transition duration-700 ease-out data-seen:translate-y-0 data-seen:opacity-100"
            >
              <figure>
                <button
                  onClick={() => onView(s)}
                  className="group flex w-full justify-center overflow-hidden rounded-xl border border-line bg-panel"
                  aria-label={`View full size: ${s.caption}`}
                >
                  <StepVisual
                    step={s}
                    sizes={track.columns === 2 ? "(max-width: 640px) 92vw, 380px" : "(max-width: 1024px) 92vw, 760px"}
                    className={`transition-transform duration-500 group-hover:scale-[1.03] ${
                      "art" in s ? "w-full" : "h-auto max-h-[75svh] w-full object-contain"
                    }`}
                  />
                </button>
                <figcaption className="mt-3 flex gap-3 text-sm">
                  <span className="font-mono text-craft">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-muted">{s.caption}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

export default function Craft() {
  const [open, setOpen] = useState<CraftStep | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function view(step: CraftStep) {
    setOpen(step);
    dialogRef.current?.showModal();
  }

  return (
    <Section
      id="craft"
      index="07"
      eyebrow="Beyond code"
      title="Same method, different materials."
      intro="I plan on a grid, then build — whether it's an app, a robot chassis, a poster or a line of calligraphy."
    >
      <div className="flex flex-col gap-24 lg:gap-32">
        {craft.map((t, i) => (
          <Chapter key={t.id} track={t} number={i + 1} total={craft.length} onView={view} />
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
        className="m-auto max-h-[92svh] max-w-[94vw] rounded-2xl border border-line bg-panel p-0 text-text backdrop:bg-ink/85 backdrop:backdrop-blur-sm"
      >
        {open && (
          <figure className="flex flex-col">
            <StepVisual step={open} sizes="94vw" className={"art" in open ? "w-[min(94vw,1000px)]" : "max-h-[80svh] w-auto object-contain"} />
            <figcaption className="flex items-center justify-between gap-4 p-4 text-sm text-muted">
              {open.caption}
              <button onClick={() => dialogRef.current?.close()} className="rounded-full border border-line-strong px-3 py-1 text-text hover:bg-panel-2">
                Close
              </button>
            </figcaption>
          </figure>
        )}
      </dialog>
    </Section>
  );
}
