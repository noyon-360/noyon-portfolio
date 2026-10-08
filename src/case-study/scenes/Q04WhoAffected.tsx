"use client";

import dynamic from "next/dynamic";
import { c1Scenes } from "../content";
import Scene from "../patterns/Scene";
import Stage from "../patterns/Stage";
import { CrowdSvg } from "../three/fallbacks";
import { CrowdHud } from "./huds";

const Crowd = dynamic(() => import("../three/Crowd"), { ssr: false });
const scene = c1Scenes[3];

/** 04 — four groups of people, a ripple passing through them. */
export default function Q04WhoAffected() {
  return <Scene scene={scene} visual={<Stage alt={scene.alt} object={Crowd} fallback={<CrowdSvg />} hud={<CrowdHud />} camera={{ position: [0, 1.4, 11] }} />} />;
}
