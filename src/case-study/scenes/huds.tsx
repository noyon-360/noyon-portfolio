"use client";

// DOM overlays drawn over the live 3D objects. They read the scene's quantised progress.
import { c1Shield, c2Pins, visualText } from "../content";
import { useScene } from "../patterns/Scene";

const tag = "font-mono text-[11px] uppercase tracking-[0.16em]";

export function CalendarHud() {
  const { p } = useScene();
  const { months, counter } = visualText.calendar;
  const flipped = Math.min(months.length - 1, Math.max(0, Math.floor(p * (months.length - 1) + 0.5)));
  return (
    <div className="absolute bottom-4 right-4 text-right">
      <p className={`${tag} text-dim`}>{months[flipped]}</p>
      <p className="font-serif text-7xl leading-none text-acc tabular-nums">{flipped}</p>
      <p className={`${tag} text-dim`}>{counter}</p>
    </div>
  );
}

export function CrowdHud() {
  return (
    <div className="absolute inset-x-0 bottom-6 grid grid-cols-4 px-4 text-center">
      {visualText.crowd.map((c) => (
        <p key={c} className={`${tag} text-dim`}>
          {c}
        </p>
      ))}
    </div>
  );
}

export function GaugeHud() {
  const { p } = useScene();
  const { label, cards, note } = visualText.gauge;
  const shown = Math.min(cards.length, Math.ceil(p * cards.length * 1.15));
  return (
    <>
      <p className={`${tag} absolute bottom-4 left-4 text-dim`}>
        {label} · {note}
      </p>
      <ol className="absolute right-4 top-4 flex w-56 flex-col gap-2">
        {cards.map((c, i) => (
          <li
            key={c}
            className={`border border-rule bg-paper/90 px-3 py-2 text-sm transition-all duration-500 ${i < shown ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}`}
          >
            {c}
          </li>
        ))}
      </ol>
    </>
  );
}

export function ShieldHud() {
  const { p } = useScene();
  const lit = c1Shield.filter((_, i) => p >= (i / c1Shield.length) * 0.85 + 0.06).length;
  return (
    <ol className="absolute right-4 top-1/2 -translate-y-1/2 space-y-1.5">
      {c1Shield.map((l, i) => (
        <li key={l} className={`${tag} transition-colors duration-300 ${i < lit ? "text-acc" : "text-dim/40"}`}>
          {String(i + 1).padStart(2, "0")} {l}
        </li>
      ))}
    </ol>
  );
}

export function SpreadHud() {
  const { p } = useScene();
  // 07:44 UTC on 12 May, scrubbed across one day.
  const mins = 7 * 60 + 44 + Math.round(p * 24 * 60);
  const day = mins >= 24 * 60 ? "13 May" : "12 May";
  const hh = String(Math.floor(mins / 60) % 24).padStart(2, "0");
  const mm = String(mins % 60).padStart(2, "0");
  return (
    <>
      <div className="absolute left-4 top-4">
        <p className="font-mono text-4xl tabular-nums text-ivory">
          {hh}:{mm}
        </p>
        <p className={`${tag} text-dim`}>
          {visualText.spread.clock} · {day} 2017
        </p>
      </div>
      <div className="absolute bottom-4 right-4 text-right">
        <p className="font-serif text-7xl leading-none tabular-nums text-acc">{Math.round(p * 150)}</p>
        <p className={`${tag} text-dim`}>{visualText.spread.counter}</p>
      </div>
      <p className={`${tag} absolute bottom-4 left-4 max-w-[14rem] normal-case tracking-normal text-dim`}>{visualText.spread.note}</p>
    </>
  );
}

export function PinsHud() {
  const { p } = useScene();
  const pin = c2Pins[Math.min(c2Pins.length - 1, Math.floor(p * c2Pins.length))];
  return (
    <>
      <div className="absolute bottom-4 right-4 w-56 border border-rule bg-paper/90 p-4">
        <p className={`${tag} text-acc`}>{pin.place}</p>
        <p className="mt-1 font-serif text-2xl leading-tight">{pin.name}</p>
      </div>
      <p className={`${tag} absolute bottom-4 left-4 text-dim`}>{visualText.pins.note}</p>
    </>
  );
}

export function CoinsHud() {
  const { coins, bar, note } = visualText.coins;
  return (
    <>
      <p className={`${tag} absolute bottom-[22%] left-[18%] text-ivory`}>{coins}</p>
      <p className={`${tag} absolute right-4 top-4 text-ivory`}>{bar}</p>
      <p className={`${tag} absolute bottom-4 left-4 text-dim`}>{note}</p>
    </>
  );
}

export function StopHud() {
  const { p } = useScene();
  const on = p > 0.15;
  return (
    <div className="absolute left-4 top-4 flex items-center gap-3">
      <span className={`relative h-6 w-11 rounded-full border transition-colors duration-300 ${on ? "border-ivory bg-ivory" : "border-acc bg-transparent"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full transition-all duration-300 ${on ? "left-6 bg-paper" : "left-0.5 bg-acc"}`} />
      </span>
      <span className={`${tag} ${on ? "text-ivory" : "text-acc"}`}>{on ? visualText.stop.on : visualText.stop.off}</span>
    </div>
  );
}

export function PcsHud() {
  const { a, b } = visualText.pcs;
  return (
    <div className="absolute inset-x-0 bottom-[18%] grid grid-cols-2 text-center">
      <p className={`${tag} text-ivory`}>{a}</p>
      <p className={`${tag} text-acc`}>{b}</p>
    </div>
  );
}

export function CorridorHud() {
  return <p className={`${tag} absolute bottom-4 left-4 text-dim`}>{visualText.corridor.note}</p>;
}
