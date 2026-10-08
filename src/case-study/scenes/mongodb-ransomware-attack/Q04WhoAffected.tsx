"use client";

import dynamic from "next/dynamic";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { mongoScenes, mongoVisual } from "../../studies/mongodb-ransomware-attack";
import { CrowdSvg } from "../../three/fallbacks";
import { CrowdHud } from "./huds";

const Crowd = dynamic(() => import("../../three/Crowd"), { ssr: false });
const scene = mongoScenes[3];

/** 04 — four groups of figures; a ripple passes through them all. */
export default function Q04WhoAffected() {
  return <Scene scene={scene} indexed visual={<Stage alt={scene.alt} object={Crowd} fallback={<CrowdSvg labels={mongoVisual.crowd} />} hud={<CrowdHud />} camera={{ position: [0, 1.4, 11] }} />} />;
}
