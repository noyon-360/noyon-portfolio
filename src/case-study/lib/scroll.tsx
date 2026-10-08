"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useSyncExternalStore } from "react";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

let lenis: Lenis | null = null;

const NAV_OFFSET = -64; // keep targets clear of the fixed top bar

/** Scroll to an element id, smoothly when Lenis is running. Used by the rail, the index and anchors. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: NAV_OFFSET });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET });
  history.replaceState(null, "", `#${id}`);
}

const subscribers = new Map<string, (cb: () => void) => () => void>();

// One stable subscribe function per query, so useSyncExternalStore doesn't resubscribe every render.
function subscribeMedia(query: string) {
  let sub = subscribers.get(query);
  if (!sub) {
    sub = (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    };
    subscribers.set(query, sub);
  }
  return sub;
}

function useMedia(query: string, serverValue: boolean) {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)", true);

let webglCache: boolean | undefined;
function hasWebGL() {
  if (webglCache === undefined) {
    try {
      const c = document.createElement("canvas");
      webglCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglCache = false;
    }
  }
  return webglCache;
}
const noSubscribe = () => () => {};

/** True only on wide screens with motion allowed and WebGL available — everyone else gets the SVGs. */
export function useCan3D() {
  const wide = useMedia("(min-width: 768px)", false);
  const reduced = useReducedMotion();
  const webgl = useSyncExternalStore(noSubscribe, hasWebGL, () => false);
  return wide && !reduced && webgl;
}

/** Mounts Lenis for the page and keeps ScrollTrigger in step with it. Off under reduced motion. */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({ lerp: 0.1, anchors: { offset: NAV_OFFSET } });
    lenis = instance;
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, [reduced]);

  // Fonts and lazy content shift layout; re-measure once everything has settled.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return null;
}
