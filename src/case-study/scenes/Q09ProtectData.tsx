"use client";

import dynamic from "next/dynamic";
import { c1Scenes } from "../content";
import Scene from "../patterns/Scene";
import Stage from "../patterns/Stage";
import { ShieldSvg } from "../three/fallbacks";
import { ShieldHud } from "./huds";

const Shield = dynamic(() => import("../three/Shield"), { ssr: false });
const scene = c1Scenes[8];

/** 09 — opinion: a shield assembled from nine layers of protection. */
export default function Q09ProtectData() {
  return <Scene scene={scene} visual={<Stage alt={scene.alt} object={Shield} fallback={<ShieldSvg />} hud={<ShieldHud />} camera={{ position: [0, 0, 9] }} />} />;
}
