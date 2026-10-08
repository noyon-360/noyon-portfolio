"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import type { QuestionScene } from "../content";
import { ScrollTrigger } from "../lib/scroll";
import { MetaLine, NextLine, SourceTags } from "./Editorial";

type SceneState = {
  /** 0–1 scroll progress through the scene body; read every frame by the 3D objects. */
  progress: RefObject<number>;
  /** The same progress, quantised to 1%, for DOM overlays that re-render. */
  p: number;
  /** Index of the step currently in the reading line. */
  active: number;
  steps: number;
};

const SceneContext = createContext<SceneState>({ progress: { current: 0 }, p: 0, active: 0, steps: 1 });

export const useScene = () => useContext(SceneContext);

/** Drives a SceneContext from the scroll position of `body` and its `[data-step]` children. */
export function useSceneProgress(body: RefObject<HTMLElement | null>, steps: number): SceneState {
  const progress = useRef(0);
  const [p, setP] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = body.current;
    if (!el) return;
    const triggers = [
      ScrollTrigger.create({
        trigger: el,
        start: "top 65%",
        end: "bottom 65%",
        onUpdate(self) {
          progress.current = self.progress;
          setP(Math.round(self.progress * 100) / 100);
        },
      }),
      ...Array.from(el.querySelectorAll<HTMLElement>("[data-step]")).map((stepEl, i) =>
        ScrollTrigger.create({
          trigger: stepEl,
          start: "top 62%",
          end: "bottom 62%",
          onToggle: (self) => self.isActive && setActive(i),
        }),
      ),
    ];
    return () => triggers.forEach((t) => t.kill());
  }, [body]);

  return { progress, p, active, steps };
}

/**
 * The anatomy every question scene shares:
 * (label) → numbered question headline → meta line → 2–5 steps beside one visual → source tags → next question.
 * `indexed` adds the pinned 01–0n step index on the left (pattern B).
 */
export default function Scene({
  scene,
  visual,
  indexed = false,
  lead,
  children,
}: {
  scene: QuestionScene;
  visual?: ReactNode;
  indexed?: boolean;
  /** Full-width content between the header and the steps (e.g. a definition card). */
  lead?: ReactNode;
  /** Extra full-width content after the steps (stat rows, card grids…). */
  children?: ReactNode;
}) {
  const body = useRef<HTMLDivElement>(null);
  const state = useSceneProgress(body, scene.steps.length);
  const { active } = state;
  const headingId = `${scene.id}-h`;

  return (
    <SceneContext.Provider value={state}>
      <section id={scene.id} data-case={scene.caseId} aria-labelledby={headingId} className="relative border-t border-rule px-4 py-24 sm:px-8 md:py-32 lg:pr-24">
        <SceneHeader n={scene.n} label={scene.label} headingId={headingId} question={scene.question} meta={scene.meta} />
        {lead && <div className="mx-auto mt-14 max-w-7xl">{lead}</div>}

        <div ref={body} className="mx-auto mt-14 grid max-w-7xl gap-10 md:mt-20 md:grid-cols-12 md:gap-8">
          {indexed && (
            <div className="hidden md:col-span-2 md:block" aria-hidden="true">
              <ol className="sticky top-[32vh] space-y-3 font-mono text-sm">
                {scene.steps.map((s, i) => (
                  <li key={s.kicker} className={`flex items-baseline gap-3 transition-colors duration-300 ${i === active ? "text-acc" : "text-dim/60"}`}>
                    <span className={`font-serif text-4xl leading-none ${i === active ? "" : "cs-outline"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[11px] uppercase tracking-[0.16em]">{s.kicker}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <ol className={`${visual ? (indexed ? "md:col-span-4" : "md:col-span-5") : "md:col-span-8 md:col-start-3"} order-2 md:order-none`}>
            {scene.steps.map((s, i) => (
              <li key={s.kicker} data-step className="cs-step flex flex-col justify-center py-5 md:min-h-[62vh]" data-active={i === active}>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-acc">
                  {String(i + 1).padStart(2, "0")} — {s.kicker}
                </p>
                <p className="mt-3 text-xl leading-snug text-ivory md:text-[1.6rem] md:leading-[1.3]">{s.body}</p>
              </li>
            ))}
          </ol>

          {visual && (
            <div className={`order-1 md:order-none ${indexed ? "md:col-span-6" : "md:col-span-7"}`}>
              <div className="aspect-[4/3] md:sticky md:top-[14vh] md:aspect-auto md:h-[72vh]">{visual}</div>
            </div>
          )}
        </div>

        {children && <div className="mx-auto mt-16 max-w-7xl">{children}</div>}

        <SceneFooter refs={scene.refs} next={scene.next} />
      </section>
    </SceneContext.Provider>
  );
}

export function SceneHeader({
  n,
  label,
  headingId,
  question,
  meta,
}: {
  n: string;
  label: string;
  headingId: string;
  question: string;
  meta: QuestionScene["meta"];
}) {
  return (
    <header className="mx-auto max-w-7xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim">({label})</p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-8">
        <span aria-hidden="true" className="cs-outline font-serif text-[clamp(4.5rem,11vw,10rem)] leading-[0.8]">
          {n}
        </span>
        <h2 id={headingId} className="max-w-4xl text-balance font-serif text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[0.95] tracking-[-0.01em]">
          <span className="sr-only">Question {n}: </span>
          {question}
        </h2>
      </div>
      <MetaLine meta={meta} className="mt-8" />
    </header>
  );
}

export function SceneFooter({ refs, next }: { refs: QuestionScene["refs"]; next: string }) {
  return (
    <footer className="mx-auto mt-16 flex max-w-7xl flex-col gap-6 border-t border-rule pt-6 md:flex-row md:items-baseline md:justify-between">
      <SourceTags refs={refs} />
      <NextLine>{next}</NextLine>
    </footer>
  );
}
