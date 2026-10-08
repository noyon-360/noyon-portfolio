"use client";

import dynamic from "next/dynamic";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { attackScenes } from "../../studies/npm-supply-chain-attack";
import { BeaconsSvg } from "../../three/fallbacks";
import { BeaconsHud } from "./huds";

const Beacons = dynamic(() => import("../../three/Beacons"), { ssr: false });
const scene = attackScenes[4];

/** 05 — two distant red beacons, dashed lines reaching toward them. */
export default function Q05WhereCalling() {
  return <Scene scene={scene} visual={<Stage alt={scene.alt} object={Beacons} fallback={<BeaconsSvg />} hud={<BeaconsHud />} camera={{ position: [0, 0, 8] }} />} />;
}
