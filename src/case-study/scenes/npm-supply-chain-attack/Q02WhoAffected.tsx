"use client";

import dynamic from "next/dynamic";
import { Stats } from "../../patterns/CountUp";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { affectedStats, attackScenes } from "../../studies/npm-supply-chain-attack";
import { TowersSvg } from "../../three/fallbacks";
import { TowersHud } from "./huds";

const ServerTowers = dynamic(() => import("../../three/ServerTowers"), { ssr: false });
const scene = attackScenes[1];

/** 02 — four towers fill with app blocks, then count-up stats. */
export default function Q02WhoAffected() {
  return (
    <Scene scene={scene} visual={<Stage alt={scene.alt} object={ServerTowers} fallback={<TowersSvg />} hud={<TowersHud />} camera={{ position: [0, 0.4, 9] }} />}>
      <Stats stats={affectedStats} />
    </Scene>
  );
}
