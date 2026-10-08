"use client";

import dynamic from "next/dynamic";
import { DefinitionCard } from "../../patterns/Blocks";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { attackScenes, npmDefinitions } from "../../studies/npm-supply-chain-attack";
import { TreeSvg } from "../../three/fallbacks";
import { TreeHud } from "./huds";

const DependencyTree = dynamic(() => import("../../three/DependencyTree"), { ssr: false });
const scene = attackScenes[2];

/** 03 — definition card, then the red climbing a dependency tree. */
export default function Q03SupplyChain() {
  return <Scene scene={scene} lead={<DefinitionCard def={npmDefinitions.supplyChain} />} visual={<Stage alt={scene.alt} object={DependencyTree} fallback={<TreeSvg />} hud={<TreeHud />} camera={{ position: [0, 0, 9] }} />} />;
}
