"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/content";

const SignatureScene = dynamic(() => import("./SignatureScene"), { ssr: false });

// A closing sign-off: the signature writes itself in 3D the first time it scrolls into view.
export default function Signature() {
  const ref = useRef<HTMLElement>(null);
  const [playKey, setPlayKey] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.intersectionRatio >= 0.5) setPlayKey((k) => (k === 0 ? 1 : k));
      },
      { threshold: [0, 0.5] },
    );
    io.observe(el);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setReduced(mq.matches);
    onMotion();
    mq.addEventListener("change", onMotion);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", onMotion);
    };
  }, []);

  return (
    <section ref={ref} aria-label="Sign-off" className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-panel">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative h-60 sm:h-[26rem]" aria-hidden="true">
          <SignatureScene playKey={playKey} running={inView} reduced={reduced} />
        </div>
        <div className="relative flex flex-col items-center gap-3 border-t border-line px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p>
            <span className="sr-only">Signed, </span>
            <span className="font-display text-lg">{profile.name}</span>
            <span className="block text-sm text-muted">Thanks for scrolling all the way down.</span>
          </p>
          <button
            onClick={() => setPlayKey((k) => k + 1)}
            className="rounded-full border border-line-strong px-4 py-1.5 font-mono text-xs uppercase tracking-widest hover:bg-panel-2"
          >
            Sign again ↻
          </button>
        </div>
      </div>
    </section>
  );
}
