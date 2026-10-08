"use client";

import dynamic from "next/dynamic";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { responseScenes } from "../../studies/npm-supply-chain-attack";
import { ChecklistSvg } from "../../three/fallbacks";

const TowerChecklist = dynamic(() => import("../../three/TowerChecklist"), { ssr: false });
const scene = responseScenes[1];

/** 09 — a five-item checklist ticks off beside a server tower. */
export default function Q09Cleanup() {
  return <Scene scene={scene} indexed visual={<Stage alt={scene.alt} object={TowerChecklist} fallback={<ChecklistSvg />} camera={{ position: [0, 0, 7.5] }} />} />;
}
