"use client";

import dynamic from "next/dynamic";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { attackScenes } from "../../studies/npm-supply-chain-attack";
import { ServerCalendarSvg } from "../../three/fallbacks";
import { ServerCalendarHud } from "./huds";

const ServerCalendar = dynamic(() => import("../../three/ServerCalendar"), { ssr: false });
const scene = attackScenes[0];

/** 01 — four servers light up across the calendar, one after another. */
export default function Q01WhatHappened() {
  return <Scene scene={scene} indexed visual={<Stage alt={scene.alt} object={ServerCalendar} fallback={<ServerCalendarSvg />} hud={<ServerCalendarHud />} camera={{ position: [0, 0.2, 8] }} />} />;
}
