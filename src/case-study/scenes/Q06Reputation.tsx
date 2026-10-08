"use client";

import dynamic from "next/dynamic";
import { c1Scenes } from "../content";
import Scene from "../patterns/Scene";
import Stage from "../patterns/Stage";
import { GaugeSvg } from "../three/fallbacks";
import { GaugeHud } from "./huds";

const Gauge = dynamic(() => import("../three/Gauge"), { ssr: false });
const scene = c1Scenes[5];

/** 06 — a trust gauge drains while the costs stack up. */
export default function Q06Reputation() {
  return <Scene scene={scene} visual={<Stage alt={scene.alt} object={Gauge} fallback={<GaugeSvg />} hud={<GaugeHud />} camera={{ position: [0, 0, 10.5] }} />} />;
}
