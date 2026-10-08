"use client";

import { useEffect, useRef, useState } from "react";
import { THEMES } from "@/lib/themes";
import { setTheme, useTheme } from "@/lib/useTheme";

function Swatch({ colors }: { colors: string[] }) {
  return (
    <span className="flex h-4 w-4 shrink-0 overflow-hidden rounded-sm" aria-hidden="true">
      {colors.map((c) => (
        <span key={c} className="flex-1" style={{ background: c }} />
      ))}
    </span>
  );
}

export default function ThemeSwitcher() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Theme: ${theme.name}. Change theme`}
        className="flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 font-mono text-xs transition-colors hover:bg-panel-2"
      >
        <Swatch colors={[theme.accents.client, theme.accents.server]} />
        <span className="hidden sm:inline">{theme.name}</span>
      </button>
      {open && (
        <ul className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-xl border border-line-strong bg-panel p-1 shadow-2xl">
          {THEMES.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                aria-pressed={t.id === theme.id}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className={`flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-panel-2 ${
                  t.id === theme.id ? "bg-panel-2" : ""
                }`}
              >
                <span className="mt-0.5">
                  <Swatch colors={[t.accents.client, t.accents.server, t.accents.ops, t.accents.craft]} />
                </span>
                <span>
                  <span className="block font-mono text-sm text-text">
                    {t.id === theme.id ? "> " : ""}
                    {t.name}
                  </span>
                  <span className="block text-xs text-muted">{t.mood}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
