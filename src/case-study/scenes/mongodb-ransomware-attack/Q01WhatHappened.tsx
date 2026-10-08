"use client";

import dynamic from "next/dynamic";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { mongoScenes } from "../../studies/mongodb-ransomware-attack";
import { ExposureSvg } from "../../three/fallbacks";
import { ExposureHud } from "./huds";

const ExposureLine = dynamic(() => import("../../three/ExposureLine"), { ssr: false });
const scene = mongoScenes[0];

/** 01 — nineteen months on one bar: the open stretch glows, then the backdoor and the wipe rise at the end. */
export default function Q01WhatHappened() {
  return <Scene scene={scene} indexed visual={<Stage alt={scene.alt} object={ExposureLine} fallback={<ExposureSvg />} hud={<ExposureHud />} camera={{ position: [0, 0, 9] }} />} />;
}
