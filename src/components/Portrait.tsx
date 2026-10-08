"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const PortraitScene = dynamic(() => import("./PortraitScene"), { ssr: false });

export default function Portrait({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
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
    <div ref={ref} className={className} aria-hidden="true">
      <PortraitScene running={inView} reduced={reduced} />
    </div>
  );
}
