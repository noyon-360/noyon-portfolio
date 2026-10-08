"use client";

import dynamic from "next/dynamic";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { attackScenes } from "../../studies/npm-supply-chain-attack";
import { NodeBoxSvg } from "../../three/fallbacks";

const NodeBox = dynamic(() => import("../../three/NodeBox"), { ssr: false });
const scene = attackScenes[3];

/** 04 — a glass box labelled node with a red box inside; the scrambled command stays blurred. */
export default function Q04WhatItDid() {
  return <Scene scene={scene} indexed visual={<Stage alt={scene.alt} object={NodeBox} fallback={<NodeBoxSvg />} camera={{ position: [0, 0.8, 7.5] }} />} />;
}
