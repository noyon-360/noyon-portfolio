"use client";

import dynamic from "next/dynamic";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { responseScenes } from "../../studies/npm-supply-chain-attack";
import { SwitchesSvg } from "../../three/fallbacks";
import { SwitchesHud } from "./huds";

const Switches = dynamic(() => import("../../three/Switches"), { ssr: false });
const scene = responseScenes[3];

/** 11 — ten switches; one flips and the gauge falls from 48% to 8%. */
export default function Q11SourceFound() {
  return <Scene scene={scene} visual={<Stage alt={scene.alt} object={Switches} fallback={<SwitchesSvg />} hud={<SwitchesHud />} camera={{ position: [0, 0, 8] }} />} />;
}
