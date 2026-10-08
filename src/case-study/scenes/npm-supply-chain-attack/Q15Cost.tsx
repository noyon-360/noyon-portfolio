"use client";

import { Stats } from "../../patterns/CountUp";
import Scene from "../../patterns/Scene";
import { costStats, responseScenes } from "../../studies/npm-supply-chain-attack";

const scene = responseScenes[7];

/** 15 — the cost, as count-up stats. Values the brief did not give stay TODO. */
export default function Q15Cost() {
  return (
    <Scene scene={scene}>
      <Stats stats={costStats} />
    </Scene>
  );
}
