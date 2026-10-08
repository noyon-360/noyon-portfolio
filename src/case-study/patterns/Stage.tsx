"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentType, type ReactNode, type RefObject } from "react";
import { useCan3D } from "../lib/scroll";
import { useScene } from "./Scene";

export type ObjectProps = { progress: RefObject<number> };

// three.js and R3F only download once a Stage actually decides to draw in 3D.
const CanvasHost = dynamic(() => import("../three/CanvasHost"), { ssr: false });

/**
 * Pattern I — the scene's one focal object.
 * Wide screens with motion allowed get the lazy 3D object, mounted only while near the viewport and
 * unmounted (renderer and GPU memory released) once it scrolls away. Everyone else, and the server
 * render, gets the static SVG. Both carry the same alt text.
 */
export default function Stage({
  alt,
  object,
  fallback,
  hud,
  progress,
  camera,
}: {
  alt: string;
  /** A next/dynamic import of a component from ../three. */
  object?: ComponentType<ObjectProps>;
  fallback: ReactNode;
  /** DOM overlay (clock, counters, labels) drawn over the live 3D; each SVG fallback already shows its end state. */
  hud?: ReactNode;
  /** Overrides the scene's progress, e.g. for the front-page globe. */
  progress?: RefObject<number>;
  camera?: { position: [number, number, number]; fov?: number };
}) {
  const box = useRef<HTMLDivElement>(null);
  const can3D = useCan3D() && !!object;
  const [near, setNear] = useState(false);
  const scene = useScene();
  const p = progress ?? scene.progress;

  useEffect(() => {
    const el = box.current;
    if (!el || !can3D) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "60% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [can3D]);

  const live = can3D && near && object;
  const Obj = object;

  return (
    <figure ref={box} role="img" aria-label={alt} className="relative m-0 h-full w-full">
      <div aria-hidden="true" className={`absolute inset-0 transition-opacity duration-700 ${live ? "opacity-0" : "opacity-100"}`}>
        {fallback}
      </div>
      {live && Obj && (
        <div aria-hidden="true" className="absolute inset-0">
          <CanvasHost camera={camera}>
            <Obj progress={p} />
          </CanvasHost>
        </div>
      )}
      {hud && live && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {hud}
        </div>
      )}
    </figure>
  );
}
