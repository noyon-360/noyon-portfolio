"use client";

import dynamic from "next/dynamic";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { responseScenes } from "../../studies/npm-supply-chain-attack";
import { KeysSvg } from "../../three/fallbacks";
import { KeysHud } from "./huds";

const KeyRing = dynamic(() => import("../../three/KeyRing"), { ssr: false });
const scene = responseScenes[6];

/** 14 — a key ring; each key greys out, then is reforged. */
export default function Q14WhatTaken() {
  return <Scene scene={scene} visual={<Stage alt={scene.alt} object={KeyRing} fallback={<KeysSvg />} hud={<KeysHud />} camera={{ position: [0, 0, 7.5] }} />} />;
}
