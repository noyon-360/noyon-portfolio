"use client";

import dynamic from "next/dynamic";
import { CardGrid } from "../../patterns/Blocks";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { responseGaps, responseScenes } from "../../studies/npm-supply-chain-attack";
import { MagnifierSvg } from "../../three/fallbacks";
import { MagnifierHud } from "./huds";

const Magnifier = dynamic(() => import("../../three/Magnifier"), { ssr: false });
const scene = responseScenes[4];

/** 12 — a magnifying glass with a blind spot over :443, then the four gaps as cards. */
export default function Q12WentWrong() {
  return (
    <Scene scene={scene} visual={<Stage alt={scene.alt} object={Magnifier} fallback={<MagnifierSvg />} hud={<MagnifierHud />} camera={{ position: [0, 0, 7] }} />}>
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-dim">(Four gaps)</p>
      <CardGrid cards={responseGaps} cols={2} />
    </Scene>
  );
}
