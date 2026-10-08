"use client";

import { useEffect } from "react";

/**
 * Makes a reference (or evidence) row blink when the reader arrives at it from a source tag (or opens the page
 * with a #ref-… link), so they can see which source they jumped to. Styling lives in case-study.css.
 */
export default function RefFlash() {
  useEffect(() => {
    const flash = (id: string) => {
      const el = document.getElementById(id);
      if (!el || !(id.startsWith("ref-") || id.startsWith("ev-"))) return;
      document.querySelectorAll(".cs-flash").forEach((n) => n.classList.remove("cs-flash"));
      void el.offsetWidth; // restart the animation when the same row is clicked twice
      el.classList.add("cs-flash");
    };

    // Lenis handles the scroll and may not update the hash, so listen to the clicks themselves.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#ref-"], a[href^="#ev-"]');
      if (a) flash(a.getAttribute("href")!.slice(1));
    };
    const onHash = () => flash(location.hash.slice(1));

    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  return null;
}
