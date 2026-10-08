"use client";

import dynamic from "next/dynamic";
import { c2Scenes } from "../content";
import Scene from "../patterns/Scene";
import Stage from "../patterns/Stage";
import { GlobeSvg } from "../three/fallbacks";
import { StopHud } from "./huds";

const StopGlobe = dynamic(() => import("../three/Globe").then((m) => m.StopGlobe), { ssr: false });
const scene = c2Scenes[6];

/** 17 — the kill switch is thrown and the arcs fade (sticky steps). */
export default function Q17Stopped() {
  return <Scene scene={scene} indexed visual={<Stage alt={scene.alt} object={StopGlobe} fallback={<GlobeSvg arcs faded />} hud={<StopHud />} camera={{ position: [0, 0, 9.5] }} />} />;
}
