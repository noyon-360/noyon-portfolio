"use client";

import dynamic from "next/dynamic";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { portalScenes, portalSystem } from "../../studies/academic-portal-disclosure";
import { CabinetSvg } from "../../three/fallbacks";
import { CabinetHud } from "./huds";

const FileCabinet = dynamic(() => import("../../three/FileCabinet"), { ssr: false });
const scene = portalScenes[1];

/** 02 — a records cabinet whose drawers slide open on their own, then the system's spec sheet. */
export default function Q02System() {
  return (
    <Scene scene={scene} visual={<Stage alt={scene.alt} object={FileCabinet} fallback={<CabinetSvg />} hud={<CabinetHud />} camera={{ position: [0, 0.6, 8.5] }} />}>
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">(The system)</p>
      <dl className="mt-6 border-t border-rule">
        {portalSystem.map(([k, v]) => (
          <div key={k} className="grid gap-1 border-b border-rule py-4 sm:grid-cols-[14rem_1fr] sm:gap-8">
            <dt className="font-mono text-xs uppercase tracking-[0.16em] text-dim">{k}</dt>
            <dd className={`text-lg leading-snug ${k === "Owner" ? "text-acc" : ""}`}>{v}</dd>
          </div>
        ))}
      </dl>
    </Scene>
  );
}
