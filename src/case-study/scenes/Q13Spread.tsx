"use client";

import dynamic from "next/dynamic";
import { c2Scenes } from "../content";
import Scene from "../patterns/Scene";
import Stage from "../patterns/Stage";
import { GlobeSvg } from "../three/fallbacks";
import { SpreadHud } from "./huds";

const SpreadGlobe = dynamic(() => import("../three/Globe").then((m) => m.SpreadGlobe), { ssr: false });
const scene = c2Scenes[2];

/** 13 — the worm's loop as sticky steps; arcs jump across the globe as the UTC clock runs. */
export default function Q13Spread() {
  return <Scene scene={scene} indexed visual={<Stage alt={scene.alt} object={SpreadGlobe} fallback={<GlobeSvg arcs />} hud={<SpreadHud />} camera={{ position: [0, 0, 9.5] }} />} />;
}
