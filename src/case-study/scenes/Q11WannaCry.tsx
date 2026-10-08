"use client";

import { c2Scenes, definitions, visualText } from "../content";
import { DefinitionCard } from "../patterns/Blocks";
import Scene from "../patterns/Scene";
import Stage from "../patterns/Stage";

const scene = c2Scenes[0];
const t = visualText.ransom;

/** A recreation of the ransom window in HTML/CSS — illustrative, address redacted, nothing functional. */
function RansomWindow() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="cs-ransom w-full max-w-lg border border-black/40 text-left">
        <div className="cs-ransom-bar flex items-center justify-between px-3 py-1 text-xs">
          <span>{t.title}</span>
          <span aria-hidden="true">✕</span>
        </div>
        <div className="grid grid-cols-[9rem_1fr] gap-3 p-3 max-sm:grid-cols-1">
          <div className="space-y-3 max-sm:hidden">
            <div className="grid aspect-square place-items-center border border-white/20 bg-black/20">
              <svg viewBox="0 0 40 48" className="w-14" aria-hidden="true">
                <rect x="4" y="20" width="32" height="26" rx="3" fill="#f5c542" />
                <path d="M11,20 V13 a9,9 0 0 1 18,0 V20" stroke="#f5c542" strokeWidth="4" fill="none" />
              </svg>
            </div>
            {[t.raise, t.lost].map((label) => (
              <div key={label} className="border border-white/20 bg-black/20 p-2 text-[10px] leading-tight">
                <p className="text-yellow-300">{label}</p>
                <p className="mt-1 font-mono text-base">--:--:--</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xl font-bold">{t.headline}</p>
            <div className="mt-2 h-28 bg-white p-2 text-[10px] leading-snug text-black/70">
              <div className="space-y-1.5" aria-hidden="true">
                {[90, 75, 95, 60, 85, 70].map((w, i) => (
                  <div key={i} className="h-1.5 rounded bg-black/15" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
            <p className="mt-2 text-xs text-yellow-300">{t.demand}</p>
            <p className="mt-1 bg-black/25 px-2 py-1 font-mono text-[11px]">{t.address}</p>
            <div className="mt-2 flex gap-2">
              {t.buttons.map((b) => (
                <span key={b} className="cs-ransom-bar flex-1 px-2 py-1 text-center text-[11px]">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 max-w-lg font-mono text-[11px] uppercase tracking-[0.14em] text-dim">{t.note}</p>
    </div>
  );
}

/** 11 — what WannaCry is: a definition card, then the recreated ransom window beside the steps. */
export default function Q11WannaCry() {
  return <Scene scene={scene} lead={<DefinitionCard def={definitions.wannacry} />} visual={<Stage alt={scene.alt} fallback={<RansomWindow />} />} />;
}
