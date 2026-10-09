"use client";

import dynamic from "next/dynamic";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { portalScenes, portalVisual } from "../../studies/academic-portal-disclosure";
import { CrowdSvg } from "../../three/fallbacks";
import { CrowdHud } from "./huds";

const Crowd = dynamic(() => import("../../three/Crowd"), { ssr: false });
const scene = portalScenes[3];

/** 04 — four groups of figures; a ripple spreads from the students outward. */
export default function Q04WhoAffected() {
  return <Scene scene={scene} indexed visual={<Stage alt={scene.alt} object={Crowd} fallback={<CrowdSvg labels={portalVisual.crowd} />} hud={<CrowdHud />} camera={{ position: [0, 1.4, 11] }} />} />;
}
