"use client";

import dynamic from "next/dynamic";
import { Stats } from "../../patterns/CountUp";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { costStats, mongoScenes, mongoVisual } from "../../studies/mongodb-ransomware-attack";
import { GaugeSvg } from "../../three/fallbacks";
import { GaugeHud } from "./huds";

const Gauge = dynamic(() => import("../../three/Gauge"), { ssr: false });
const scene = mongoScenes[5];

/** 06 — a trust dial drains as the blame sequence stacks up, then the numbers. */
export default function Q06Business() {
  return (
    <Scene scene={scene} visual={<Stage alt={scene.alt} object={Gauge} fallback={<GaugeSvg gauge={mongoVisual.gauge} />} hud={<GaugeHud />} camera={{ position: [0, 0, 10.5] }} />}>
      <Stats stats={costStats} />
    </Scene>
  );
}
