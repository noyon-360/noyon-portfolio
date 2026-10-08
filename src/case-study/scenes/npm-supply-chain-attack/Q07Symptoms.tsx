"use client";

import dynamic from "next/dynamic";
import { Stats } from "../../patterns/CountUp";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { attackScenes, symptomStats } from "../../studies/npm-supply-chain-attack";
import { GaugesSvg } from "../../three/fallbacks";
import { GaugesHud } from "./huds";

const CpuGauges = dynamic(() => import("../../three/CpuGauges"), { ssr: false });
const scene = attackScenes[6];

/** 07 — two pinned gauges under a heat shimmer, then count-up stats. */
export default function Q07Symptoms() {
  return (
    <Scene scene={scene} visual={<Stage alt={scene.alt} object={CpuGauges} fallback={<GaugesSvg />} hud={<GaugesHud />} camera={{ position: [0, 0.3, 7] }} />}>
      <Stats stats={symptomStats} />
    </Scene>
  );
}
