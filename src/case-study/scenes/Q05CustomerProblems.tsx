"use client";

import dynamic from "next/dynamic";
import { c1Problems, c1Scenes } from "../content";
import { CardGrid } from "../patterns/Blocks";
import Scene from "../patterns/Scene";
import Stage from "../patterns/Stage";
import { PhoneSvg } from "../three/fallbacks";

const Phone = dynamic(() => import("../three/Phone"), { ssr: false });
const scene = c1Scenes[4];

/** 05 — the scam call, then the six problems as a card grid. */
export default function Q05CustomerProblems() {
  return (
    <Scene scene={scene} visual={<Stage alt={scene.alt} object={Phone} fallback={<PhoneSvg />} />}>
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-dim">(Six problems)</p>
      <CardGrid cards={c1Problems} />
    </Scene>
  );
}
