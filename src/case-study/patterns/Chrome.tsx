"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { StudyNav } from "../content";
import { ScrollTrigger, scrollToId } from "../lib/scroll";

/** Fixed top bar, thin progress line, the numbered case rail and the index overlay for one study. */
export default function Chrome({ title, nav }: { title: string; nav: StudyNav }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TopBar title={title} onIndex={() => setOpen(true)} />
      <CaseRail items={nav.rail} />
      <IndexOverlay groups={nav.index} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function TopBar({ title, onIndex }: { title: string; onIndex: () => void }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-rule bg-paper/80 backdrop-blur-md">
      <div ref={bar} aria-hidden="true" className="absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-ivory" />
      <nav aria-label="Case study" className="flex h-14 items-center justify-between gap-4 px-4 sm:px-8">
        <Link href="/case-study" className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim transition-colors hover:text-ivory">
          ← All case studies
        </Link>
        <a href="#front" className="hidden font-serif text-xl sm:block">
          {title}
        </a>
        <button
          type="button"
          onClick={onIndex}
          className="rounded-full border border-rule px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:bg-ivory hover:text-paper"
          aria-haspopup="dialog"
        >
          Index
        </button>
      </nav>
    </header>
  );
}

/** Pattern F — fixed right-side rail of question numbers. The current one is highlighted; click to jump. */
function CaseRail({ items }: { items: StudyNav["rail"] }) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const triggers = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => !!el)
      .map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) setCurrent(el.id);
            else setCurrent((c) => (c === el.id ? null : c));
          },
        }),
      );
    return () => triggers.forEach((t) => t.kill());
  }, [items]);

  return (
    <nav aria-label="Questions" className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
      <ol className="flex flex-col items-end gap-1">
        {items.map((item) => {
          const on = current === item.id;
          return (
            <li key={item.id} data-case={item.caseId}>
              <button
                type="button"
                onClick={() => scrollToId(item.id)}
                aria-current={on ? "location" : undefined}
                aria-label={`${item.n}: ${item.title}`}
                title={item.title}
                className={`group flex items-center gap-2 py-0.5 font-mono text-[11px] tabular-nums transition-colors ${on ? "text-acc" : "text-dim/70 hover:text-ivory"}`}
              >
                <span className={`h-px transition-all ${on ? "w-6 bg-acc" : "w-2 bg-dim/50 group-hover:w-4"}`} />
                {item.n}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Pattern G — full-screen table of contents. A native <dialog> gives focus trapping and Escape. */
function IndexOverlay({ groups, open, onClose }: { groups: StudyNav["index"]; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const go = (id: string) => {
    onClose();
    // Let the dialog close (and release scroll) before moving.
    requestAnimationFrame(() => scrollToId(id));
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label="Index"
      data-lenis-prevent
      className="m-0 h-full max-h-none w-full max-w-none overflow-y-auto bg-paper p-0 text-ivory backdrop:bg-paper/80"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <div className="flex items-center justify-between border-b border-rule pb-6">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">(Index)</p>
          <button type="button" onClick={onClose} className="rounded-full border border-rule px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] hover:bg-ivory hover:text-paper">
            Close
          </button>
        </div>
        <div className="grid gap-12 py-10 md:grid-cols-2">
          {groups.map((g) => (
            <section key={g.head}>
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-dim">{g.head}</h2>
              <ol className="mt-4 border-t border-rule">
                {g.items.map((item) => (
                  <li key={item.id} data-case={item.caseId} className="border-b border-rule">
                    <button type="button" onClick={() => go(item.id)} className="group flex w-full items-baseline gap-4 py-3 text-left">
                      <span className="w-8 shrink-0 font-mono text-xs text-acc">{item.n}</span>
                      <span className="font-serif text-2xl leading-tight transition-colors group-hover:text-acc">{item.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </dialog>
  );
}
