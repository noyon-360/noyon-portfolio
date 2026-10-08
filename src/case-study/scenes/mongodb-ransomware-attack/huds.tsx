"use client";

// DOM overlays drawn over the MongoDB study's live 3D objects. They read the scene's quantised progress.
import { useScene } from "../../patterns/Scene";
import { mongoCollections, mongoVisual } from "../../studies/mongodb-ransomware-attack";
import { ALIGN_AT, dropAt, LINE_EVENTS, RANSOM_AT } from "../../three/mongodb";

const tag = "font-mono text-[11px] uppercase tracking-[0.16em]";
const tone = { ivory: "text-ivory", dim: "text-dim", amber: "text-amber", signal: "text-signal" };

export function ExposureHud() {
  const { p } = useScene();
  return (
    <>
      <ol className="absolute left-4 top-4 space-y-1">
        {mongoVisual.timeline.events.map((e, i) => (
          <li key={e} className={`${tag} transition-colors ${p >= LINE_EVENTS[i].at ? tone[LINE_EVENTS[i].tone] : "text-dim/40"}`}>
            {e}
          </li>
        ))}
      </ol>
      <p className={`${tag} absolute bottom-4 right-4 text-dim`}>{mongoVisual.timeline.note}</p>
    </>
  );
}

export function OpenPortHud() {
  return (
    <>
      <p className={`${tag} absolute left-4 top-4 text-acc`}>Port {mongoVisual.port.port} · open to any address</p>
      <p className={`${tag} absolute bottom-4 left-4 text-signal`}>{mongoVisual.port.lock}</p>
      <p className={`${tag} absolute bottom-4 right-4 text-dim`}>{mongoVisual.port.note}</p>
    </>
  );
}

export function CollectionsHud() {
  const { p } = useScene();
  return (
    <>
      <ol className="absolute inset-x-4 top-4 flex flex-wrap gap-x-4 gap-y-1">
        {mongoCollections.map((c, i) => (
          <li key={c.name} className={`${tag} transition-colors ${p >= dropAt(i) + 0.05 ? "text-dim/40 line-through" : "text-acc"}`}>
            {c.name}
          </li>
        ))}
      </ol>
      <p className={`${tag} absolute bottom-4 left-4 text-signal transition-opacity ${p >= RANSOM_AT ? "opacity-100" : "opacity-0"}`}>+ {mongoVisual.ransom}</p>
    </>
  );
}

export function CrowdHud() {
  return (
    <>
      <div className="absolute inset-x-0 bottom-10 grid grid-cols-4 px-4 text-center">
        {mongoVisual.crowd.map((c) => (
          <p key={c} className={`${tag} text-dim`}>
            {c}
          </p>
        ))}
      </div>
      <p className={`${tag} absolute bottom-3 right-4 text-dim/70`}>{mongoVisual.crowdNote}</p>
    </>
  );
}

export function GaugeHud() {
  const { p } = useScene();
  const { label, cards, note } = mongoVisual.gauge;
  const shown = Math.min(cards.length, Math.ceil(p * cards.length * 1.15));
  return (
    <>
      <p className={`${tag} absolute bottom-4 left-4 text-dim`}>
        {label} · {note}
      </p>
      <ol className="absolute right-4 top-4 flex w-56 flex-col gap-2">
        {cards.map((c, i) => (
          <li key={c} className={`border border-rule bg-paper/90 px-3 py-2 text-sm transition-all duration-500 ${i < shown ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}`}>
            <span className="mr-2 font-mono text-[11px] text-acc">{String(i + 1).padStart(2, "0")}</span>
            {c}
          </li>
        ))}
      </ol>
    </>
  );
}

export function BeaconsHud() {
  return (
    <>
      <p className={`${tag} absolute left-[8%] top-[14%] text-ivory`}>{mongoVisual.beacons[0]}</p>
      <p className={`${tag} absolute right-[8%] top-[24%] text-ivory`}>{mongoVisual.beacons[1]}</p>
      <p className={`${tag} absolute bottom-4 left-4 text-dim`}>Addresses withheld · distances not to scale</p>
    </>
  );
}

export function LayersHud() {
  const { p } = useScene();
  return (
    <>
      <ol className="absolute left-4 top-4 space-y-1">
        {mongoVisual.layers.map((l, i) => (
          <li key={l} className={`${tag} text-ivory`}>
            {String(i + 1).padStart(2, "0")} {l} <span className="text-signal">· hole</span>
          </li>
        ))}
      </ol>
      <p className={`${tag} absolute bottom-4 left-4 text-signal transition-opacity ${p >= ALIGN_AT ? "opacity-100" : "opacity-0"}`}>All four holes line up</p>
      <p className={`${tag} absolute bottom-4 right-4 text-dim`}>Illustrative</p>
    </>
  );
}

export function WallHud() {
  return (
    <div className="absolute bottom-4 right-4 text-right">
      <p className={`${tag} text-ivory`}>{mongoVisual.wall.wall}</p>
      <p className={`${tag} text-acc`}>{mongoVisual.wall.note}</p>
    </div>
  );
}
