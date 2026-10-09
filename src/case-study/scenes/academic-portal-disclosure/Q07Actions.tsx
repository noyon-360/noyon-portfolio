"use client";

import dynamic from "next/dynamic";
import { DefinitionCard } from "../../patterns/Blocks";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { portalDefinitions, portalScenes } from "../../studies/academic-portal-disclosure";
import { LetterSvg } from "../../three/fallbacks";
import { LetterHud } from "./huds";

const RedactedLetter = dynamic(() => import("../../three/RedactedLetter"), { ssr: false });
const scene = portalScenes[6];

/** 07 — definition card, then a letter redacted line by line and sent to three recipients. */
export default function Q07Actions() {
  return (
    <Scene
      scene={scene}
      indexed
      lead={<DefinitionCard def={portalDefinitions.disclosure} />}
      visual={<Stage alt={scene.alt} object={RedactedLetter} fallback={<LetterSvg />} hud={<LetterHud />} camera={{ position: [0, 0, 9.5] }} />}
    />
  );
}
