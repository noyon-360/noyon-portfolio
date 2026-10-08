"use client";

import dynamic from "next/dynamic";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { responseScenes } from "../../studies/npm-supply-chain-attack";
import { WallSvg } from "../../three/fallbacks";
import { WallHud } from "./huds";

const FirewallWall = dynamic(() => import("../../three/FirewallWall"), { ssr: false });
const scene = responseScenes[2];

/** 10 — red arcs leave a server and stop at a wall, again and again. */
export default function Q10Blocking() {
  return <Scene scene={scene} visual={<Stage alt={scene.alt} object={FirewallWall} fallback={<WallSvg />} hud={<WallHud />} camera={{ position: [0, 0.4, 8] }} />} />;
}
