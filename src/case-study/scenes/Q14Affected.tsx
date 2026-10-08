"use client";

import dynamic from "next/dynamic";
import { c2Scenes } from "../content";
import Scene from "../patterns/Scene";
import Stage from "../patterns/Stage";
import { GlobeSvg } from "../three/fallbacks";
import { PinsHud } from "./huds";

const PinsGlobe = dynamic(() => import("../three/Globe").then((m) => m.PinsGlobe), { ssr: false });
const scene = c2Scenes[3];

/** 14 — who was hit: the globe turns to each pin; text-only cards, no logos. */
export default function Q14Affected() {
  return <Scene scene={scene} visual={<Stage alt={scene.alt} object={PinsGlobe} fallback={<GlobeSvg pins />} hud={<PinsHud />} camera={{ position: [0, 0, 9.5] }} />} />;
}
