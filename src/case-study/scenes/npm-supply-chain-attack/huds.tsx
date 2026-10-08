"use client";

// DOM overlays drawn over the npm study's live 3D objects. They read the scene's quantised progress.
import { useScene } from "../../patterns/Scene";
import { npmShieldLayers, npmVisual } from "../../studies/npm-supply-chain-attack";
import { guardLayerAt, keyForgeAt, keyGreyAt, SERVER_LIT, SWITCH_AT } from "../../three/npm";

const tag = "font-mono text-[11px] uppercase tracking-[0.16em]";

export function ServerCalendarHud() {
  const { p } = useScene();
  return (
    <ol className="absolute bottom-4 right-4 space-y-1 text-right">
      {npmVisual.servers.map((s, i) => (
        <li key={s} className={`${tag} transition-colors ${p >= SERVER_LIT[i] ? "text-acc" : "text-dim/50"}`}>
          {s} · <span className="text-amber">TODO: date</span>
        </li>
      ))}
    </ol>
  );
}

export function TowersHud() {
  return (
    <div className="absolute inset-x-0 bottom-4 grid grid-cols-4 px-6 text-center">
      {npmVisual.servers.map((s, i) => (
        <p key={s} className={`${tag} ${i === 3 ? "text-acc" : "text-dim"}`}>
          {i === 3 ? npmVisual.towers.worst : npmVisual.towers.other}
        </p>
      ))}
    </div>
  );
}

export function TreeHud() {
  return (
    <div className="absolute inset-x-4 bottom-4 flex justify-between">
      <p className={`${tag} text-acc`}>{npmVisual.tree.bad} → {npmVisual.tree.root}</p>
      <p className={`${tag} text-dim`}>Illustrative</p>
    </div>
  );
}

export function BeaconsHud() {
  return (
    <>
      <p className={`${tag} absolute left-[14%] top-[14%] text-ivory`}>{npmVisual.beacons[0]}</p>
      <p className={`${tag} absolute right-[16%] top-[24%] text-ivory`}>{npmVisual.beacons[1]}</p>
      <p className={`${tag} absolute bottom-4 left-4 text-dim`}>Distances not to scale</p>
    </>
  );
}

export function CursorHud() {
  const { p } = useScene();
  return (
    <div className="absolute bottom-4 left-4 space-y-1">
      <p className={`${tag} text-dim`}>● {npmVisual.cursor.owner}</p>
      <p className={`${tag} text-acc transition-opacity ${p > 0.15 ? "opacity-100" : "opacity-0"}`}>● {npmVisual.cursor.stranger}</p>
    </div>
  );
}

export function GaugesHud() {
  return (
    <div className="absolute inset-x-0 bottom-6 grid grid-cols-2 text-center">
      {npmVisual.gauges.map((g) => (
        <p key={g} className={`${tag} text-dim`}>
          {g} · <span className="text-acc">87–100%</span>
        </p>
      ))}
    </div>
  );
}

export function WallHud() {
  return (
    <div className="absolute bottom-4 right-4 text-right">
      <p className={`${tag} text-ivory`}>{npmVisual.wall.wall}</p>
      <p className={`${tag} text-dim`}>{npmVisual.wall.note}</p>
    </div>
  );
}

export function SwitchesHud() {
  const { p } = useScene();
  const { before, after, label } = npmVisual.switches;
  return (
    <div className="absolute right-4 top-4 text-right">
      <p className="font-serif text-7xl leading-none text-acc tabular-nums">{p >= SWITCH_AT ? after : before}%</p>
      <p className={`${tag} text-dim`}>{label}</p>
    </div>
  );
}

export function MagnifierHud() {
  return (
    <div className="absolute bottom-4 left-4">
      <p className={`${tag} text-acc`}>:443 · {npmVisual.magnifier.blind}</p>
      <p className={`${tag} text-dim`}>Other ports illustrative</p>
    </div>
  );
}

export function DoorsHud() {
  return (
    <div className="absolute left-4 top-4 space-y-1">
      <p className={`${tag} text-ivory`}>Front: {npmVisual.doors.front}</p>
      <p className={`${tag} border border-dashed border-amber px-2 py-0.5 text-amber`}>Behind: {npmVisual.doors.back}</p>
    </div>
  );
}

export function KeysHud() {
  const { p } = useScene();
  return (
    <ol className="absolute bottom-4 right-4 space-y-1 text-right">
      {npmVisual.keys.map((k, i) => {
        const state = p >= keyForgeAt(i) ? "replace" : p >= keyGreyAt(i) ? "exposed" : "";
        return (
          <li key={k} className={`${tag} ${state === "replace" ? "text-acc" : state ? "text-dim" : "text-ivory"}`}>
            {k}
            {state && ` · ${state === "replace" ? "to replace" : "treat as exposed"}`}
          </li>
        );
      })}
    </ol>
  );
}

export function GuardShieldHud() {
  const { p } = useScene();
  return (
    <ol className="absolute right-4 top-1/2 -translate-y-1/2 space-y-3">
      {npmShieldLayers.map((l, i) => (
        <li key={l} className={`${tag} transition-colors ${p >= guardLayerAt(i) + 0.06 ? "text-acc" : "text-dim/40"}`}>
          {String(i + 1).padStart(2, "0")} {l}
        </li>
      ))}
    </ol>
  );
}
