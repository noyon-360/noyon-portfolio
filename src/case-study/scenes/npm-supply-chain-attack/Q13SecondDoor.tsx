"use client";

import dynamic from "next/dynamic";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { responseScenes } from "../../studies/npm-supply-chain-attack";
import { DoorsSvg } from "../../three/fallbacks";
import { DoorsHud } from "./huds";

const Doorways = dynamic(() => import("../../three/Doorways"), { ssr: false });
const scene = responseScenes[5];

/** 13 — a second, dimmer doorway behind the first. Unconfirmed. */
export default function Q13SecondDoor() {
  return <Scene scene={scene} visual={<Stage alt={scene.alt} object={Doorways} fallback={<DoorsSvg />} hud={<DoorsHud />} camera={{ position: [0, 0.3, 8] }} />} />;
}
