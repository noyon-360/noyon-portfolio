"use client";

import dynamic from "next/dynamic";
import { c2Scenes, definitions } from "../content";
import { DefinitionCard } from "../patterns/Blocks";
import Scene from "../patterns/Scene";
import Stage from "../patterns/Stage";
import { GlassSvg } from "../three/fallbacks";

const GlassBoxes = dynamic(() => import("../three/GlassBoxes"), { ssr: false });
const scene = c2Scenes[1];

/** 12 — EternalBlue by analogy only: a parcel overflowing its shelf. */
export default function Q12EternalBlue() {
  return (
    <Scene
      scene={scene}
      lead={<DefinitionCard def={definitions.eternalblue} />}
      visual={<Stage alt={scene.alt} object={GlassBoxes} fallback={<GlassSvg />} camera={{ position: [0, 0.6, 8] }} />}
    />
  );
}
