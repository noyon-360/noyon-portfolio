"use client";

// DOM overlays drawn over the academic-portal study's live 3D objects. They read the scene's quantised progress.
import { useScene } from "../../patterns/Scene";
import { portalVisual } from "../../studies/academic-portal-disclosure";
import { lockAt, RECIPIENTS_AT, RECORD_COUNT, RECORD_FIRST, SEND_AT, stageAt, visitAt } from "../../three/portal";

const tag = "font-mono text-[11px] uppercase tracking-[0.16em]";

export function PathHud() {
  const { p } = useScene();
  const { stages, recipients } = portalVisual.path;
  return (
    <>
      <ol className="absolute left-4 top-4 space-y-1">
        {stages.map((s, i) => (
          <li key={s} className={`${tag} transition-colors ${p >= stageAt(i) ? "text-acc" : "text-dim/40"}`}>
            {String(i + 1).padStart(2, "0")} {s}
          </li>
        ))}
      </ol>
      <ul className={`absolute bottom-4 right-4 space-y-1 text-right transition-opacity ${p >= RECIPIENTS_AT ? "opacity-100" : "opacity-0"}`}>
        {recipients.map((r) => (
          <li key={r} className={`${tag} text-ivory`}>
            → {r}
          </li>
        ))}
      </ul>
    </>
  );
}

export function CabinetHud({ locked = false }: { locked?: boolean }) {
  const { p } = useScene();
  const { drawers, open, note } = portalVisual.cabinet;
  return (
    <>
      <ol className="absolute left-4 top-4 space-y-1">
        {drawers.map((d, i) => {
          const isLocked = locked && p >= lockAt(i);
          return (
            <li key={d} className={`${tag} transition-colors ${isLocked ? "text-acc" : "text-ivory"}`}>
              {d} <span className={isLocked ? "text-acc" : "text-signal"}>· {isLocked ? portalVisual.cabinet.locked : open}</span>
            </li>
          );
        })}
      </ol>
      <p className={`${tag} absolute bottom-4 right-4 text-dim`}>{note}</p>
    </>
  );
}

export function RecordsHud() {
  const { p } = useScene();
  const seen = Array.from({ length: RECORD_COUNT }, (_, i) => i).filter((i) => p >= visitAt(i)).length;
  return (
    <>
      <p className={`${tag} absolute left-4 top-4 text-ivory`}>
        {portalVisual.records.label} #{RECORD_FIRST + Math.max(0, seen - 1)} <span className="text-acc">· {seen} opened</span>
      </p>
      <p className={`${tag} absolute bottom-4 left-4 text-signal`}>{portalVisual.records.check}</p>
      <p className={`${tag} absolute bottom-4 right-4 text-dim`}>{portalVisual.records.note}</p>
    </>
  );
}

export function CrowdHud() {
  return (
    <>
      <div className="absolute inset-x-0 bottom-10 grid grid-cols-4 px-4 text-center">
        {portalVisual.crowd.map((c) => (
          <p key={c} className={`${tag} text-dim`}>
            {c}
          </p>
        ))}
      </div>
      <p className={`${tag} absolute bottom-3 right-4 text-dim/70`}>{portalVisual.crowdNote}</p>
    </>
  );
}

export function GaugeHud() {
  const { p } = useScene();
  const { label, cards, note } = portalVisual.gauge;
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

export function LetterHud() {
  const { p } = useScene();
  const { recipients, redacted } = portalVisual.letter;
  return (
    <>
      <p className={`${tag} absolute left-4 top-4 text-ivory`}>{redacted}</p>
      <ul className={`absolute bottom-4 right-4 space-y-1 text-right transition-opacity ${p >= SEND_AT + 0.2 ? "opacity-100" : "opacity-0"}`}>
        {recipients.map((r) => (
          <li key={r} className={`${tag} text-acc`}>
            → {r}
          </li>
        ))}
      </ul>
    </>
  );
}
