"use client";

import dynamic from "next/dynamic";
import { c2Scenes, c2Stats } from "../content";
import { Stats } from "../patterns/CountUp";
import Scene from "../patterns/Scene";
import Stage from "../patterns/Stage";
import { CoinsSvg } from "../three/fallbacks";
import { CoinsHud } from "./huds";

const CoinsBar = dynamic(() => import("../three/CoinsBar"), { ssr: false });
const scene = c2Scenes[4];

/** 15 — the bill: a tiny coin pile against a towering bar, then count-up stats. */
export default function Q15Consequences() {
  return (
    <Scene scene={scene} visual={<Stage alt={scene.alt} object={CoinsBar} fallback={<CoinsSvg />} hud={<CoinsHud />} camera={{ position: [0, 0.6, 9] }} />}>
      <Stats stats={c2Stats} />
    </Scene>
  );
}
