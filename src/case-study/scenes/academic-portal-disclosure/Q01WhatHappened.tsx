"use client";

import dynamic from "next/dynamic";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { portalScenes } from "../../studies/academic-portal-disclosure";
import { PathSvg } from "../../three/fallbacks";
import { PathHud } from "./huds";

const DisclosurePath = dynamic(() => import("../../three/DisclosurePath"), { ssr: false });
const scene = portalScenes[0];

/** 01 — noticed, confirmed, stopped, reported, escalated: a pulse along five stages, then three recipients. */
export default function Q01WhatHappened() {
  return <Scene scene={scene} indexed visual={<Stage alt={scene.alt} object={DisclosurePath} fallback={<PathSvg />} hud={<PathHud />} camera={{ position: [0, 0, 11] }} />} />;
}
