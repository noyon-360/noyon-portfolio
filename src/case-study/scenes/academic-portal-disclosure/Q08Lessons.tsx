"use client";

import dynamic from "next/dynamic";
import { CardGrid } from "../../patterns/Blocks";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { portalLessonCards, portalScenes } from "../../studies/academic-portal-disclosure";
import { CabinetSvg } from "../../three/fallbacks";
import { CabinetHud } from "./huds";

const LockedCabinet = dynamic(() => import("../../three/FileCabinet").then((m) => m.LockedCabinet), { ssr: false });
const scene = portalScenes[7];

/** 08 — the cabinet from 02 again, its drawers shut and locked one by one; then six lessons as cards. */
export default function Q08Lessons() {
  return (
    <Scene scene={scene} indexed visual={<Stage alt={scene.alt} object={LockedCabinet} fallback={<CabinetSvg locked />} hud={<CabinetHud locked />} camera={{ position: [0, 0.6, 8.5] }} />}>
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-dim">(Six lessons)</p>
      <CardGrid cards={portalLessonCards} />
    </Scene>
  );
}
