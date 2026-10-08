"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { craft, type CraftStep } from "@/data/content";
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

export default function Craft() {
  const [tab, setTab] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [open, setOpen] = useState<CraftStep | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const track = craft[tab];
  const compare = track.compare;

  function view(step: CraftStep) {
    setOpen(step);
    dialogRef.current?.showModal();
  }

  return (
    <Section
      id="craft"
      index="04"
      eyebrow="Beyond code"
      title="Same method, different materials."
      intro="I plan on a grid, then build — whether it's an app, a robot chassis, a poster or a line of calligraphy."
    >
      <div role="tablist" aria-label="Craft" className="flex flex-wrap gap-2">
        {craft.map((c, i) => (
          <button
            key={c.id}
            role="tab"
            id={`craft-tab-${c.id}`}
            aria-selected={i === tab}
            aria-controls="craft-panel"
            onClick={() => setTab(i)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              i === tab ? "border-craft bg-craft/15 text-text" : "border-line text-muted hover:text-text"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div id="craft-panel" role="tabpanel" aria-labelledby={`craft-tab-${track.id}`} className="mt-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h3 className="font-display text-3xl font-semibold">{track.title}</h3>
            <p className="mt-3 text-muted">{track.summary}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">{track.tools.map((t) => <Tag key={t}>{t}</Tag>)}</div>
          </div>

          {compare && (
            <figure className="lg:col-span-2">
              <div className="flex flex-col gap-4 rounded-2xl border border-line bg-panel p-4 sm:flex-row sm:items-center">
                <button
                  onClick={() => view({ ...(showGrid ? compare.overlay : compare.base), caption: compare.caption })}
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
              </div>
            </figure>
          )}
        </div>

        {/* Keyed per track so switching tabs starts the strip from the first step. */}
        <ol key={track.id} className="mt-8 flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]">
          {track.steps.map((s, i) => (
            <li key={s.caption} className="shrink-0 snap-start">
              <figure>
                <button
                  onClick={() => view(s)}
                  className="group block h-64 overflow-hidden rounded-xl border border-line bg-panel sm:h-80"
                  aria-label={`View full size: ${s.caption}`}
                >
                  <StepVisual
                    step={s}
                    sizes="(max-width: 640px) 70vw, 480px"
                    className="h-full w-auto transition-transform duration-500 group-hover:scale-[1.03]"
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
