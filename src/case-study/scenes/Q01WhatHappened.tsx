"use client";

import dynamic from "next/dynamic";
import { c1Scenes } from "../content";
import Scene from "../patterns/Scene";
import Stage from "../patterns/Stage";
import { CalendarSvg } from "../three/fallbacks";
import { CalendarHud } from "./huds";

const Calendar = dynamic(() => import("../three/Calendar"), { ssr: false });
const scene = c1Scenes[0];

/** 01 — the timeline, as sticky steps beside a calendar flipping Aug → Mar. */
export default function Q01WhatHappened() {
  return <Scene scene={scene} indexed visual={<Stage alt={scene.alt} object={Calendar} fallback={<CalendarSvg />} hud={<CalendarHud />} />} />;
}
