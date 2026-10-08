"use client";

import dynamic from "next/dynamic";
import { CardGrid } from "../../patterns/Blocks";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { containment, mongoScenes, mongoVisual } from "../../studies/mongodb-ransomware-attack";
import { WallSvg } from "../../three/fallbacks";
import { WallHud } from "./huds";

const FirewallWall = dynamic(() => import("../../three/FirewallWall"), { ssr: false });
const scene = mongoScenes[8];

/** 09 — preserve, contain, rebuild: arcs stopped at a wall, then the six containment actions. */
export default function Q09Response() {
  return (
    <Scene scene={scene} indexed visual={<Stage alt={scene.alt} object={FirewallWall} fallback={<WallSvg label={mongoVisual.wall.wall} />} hud={<WallHud />} camera={{ position: [0, 0.4, 8] }} />}>
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-dim">(Containment)</p>
      <CardGrid cards={containment} />
    </Scene>
  );
}
