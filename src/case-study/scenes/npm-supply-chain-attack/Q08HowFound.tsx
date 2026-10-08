"use client";

import dynamic from "next/dynamic";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { responseScenes } from "../../studies/npm-supply-chain-attack";
import { RowsSvg } from "../../three/fallbacks";

const ProcessRows = dynamic(() => import("../../three/ProcessRows"), { ssr: false });
const scene = responseScenes[0];

/** 08 — calm white process rows; one pulses red. */
export default function Q08HowFound() {
  return <Scene scene={scene} visual={<Stage alt={scene.alt} object={ProcessRows} fallback={<RowsSvg />} camera={{ position: [0, 0, 8] }} />} />;
}
