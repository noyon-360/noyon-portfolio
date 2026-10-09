"use client";

import dynamic from "next/dynamic";
import { CardGrid, DefinitionCard } from "../../patterns/Blocks";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { portalDefinitions, portalScenes, weaknesses } from "../../studies/academic-portal-disclosure";
import { RecordsSvg } from "../../three/fallbacks";
import { RecordsHud } from "./huds";

const RecordStack = dynamic(() => import("../../three/RecordStack"), { ssr: false });
const scene = portalScenes[2];

/** 03 — IDOR by analogy: numbered records opened one after another; then all six weaknesses as cards. */
export default function Q03Weaknesses() {
  return (
    <Scene
      scene={scene}
      indexed
      lead={<DefinitionCard def={portalDefinitions.idor} />}
      visual={<Stage alt={scene.alt} object={RecordStack} fallback={<RecordsSvg />} hud={<RecordsHud />} camera={{ position: [0, 0.2, 12.5] }} />}
    >
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-dim">(Six weaknesses)</p>
      <CardGrid cards={weaknesses} />
    </Scene>
  );
}
