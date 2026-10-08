"use client";

import dynamic from "next/dynamic";
import { c2Scenes } from "../content";
import Scene from "../patterns/Scene";
import Stage from "../patterns/Stage";
import { CorridorSvg } from "../three/fallbacks";
import { CorridorHud } from "./huds";

const Corridor = dynamic(() => import("../three/Corridor"), { ssr: false });
const scene = c2Scenes[5];

/** 16 — hospitals and industry: walking a corridor as its screens turn red. */
export default function Q16Services() {
  return <Scene scene={scene} visual={<Stage alt={scene.alt} object={Corridor} fallback={<CorridorSvg />} hud={<CorridorHud />} camera={{ position: [0, 0.1, 4], fov: 60 }} />} />;
}
