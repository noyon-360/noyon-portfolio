"use client";

import dynamic from "next/dynamic";
import { c1Scenes, c1Stats } from "../content";
import { Stats } from "../patterns/CountUp";
import Scene from "../patterns/Scene";
import Stage from "../patterns/Stage";
import { MapSvg } from "../three/fallbacks";

const BangladeshMap = dynamic(() => import("../three/BangladeshMap"), { ssr: false });
const scene = c1Scenes[1];

/** 02 — Shwapno and its reach: a raised map of Bangladesh, then count-up stats. */
export default function Q02Organization() {
  return (
    <Scene scene={scene} visual={<Stage alt={scene.alt} object={BangladeshMap} fallback={<MapSvg />} camera={{ position: [0, 0, 9] }} />}>
      <Stats stats={c1Stats} />
    </Scene>
  );
}
