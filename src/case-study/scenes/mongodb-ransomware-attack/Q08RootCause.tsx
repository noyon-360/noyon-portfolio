"use client";

import dynamic from "next/dynamic";
import { CardGrid, DefinitionCard } from "../../patterns/Blocks";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { mongoDefinitions, mongoScenes, persistence, rootCauses } from "../../studies/mongodb-ransomware-attack";
import { HoleLayersSvg } from "../../three/fallbacks";
import { LayersHud } from "./huds";

const HoleLayers = dynamic(() => import("../../three/HoleLayers"), { ssr: false });
const scene = mongoScenes[7];

/** 08 — four layers whose holes line up; the four failures as cards, then the persistence account. */
export default function Q08RootCause() {
  return (
    <Scene
      scene={scene}
      indexed
      lead={<DefinitionCard def={mongoDefinitions.depth} />}
      visual={<Stage alt={scene.alt} object={HoleLayers} fallback={<HoleLayersSvg />} hud={<LayersHud />} camera={{ position: [0, 0.6, 9] }} />}
    >
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-dim">(Four failures that had to coincide)</p>
      <CardGrid cards={rootCauses} cols={2} />
      <aside className="mt-16 border-l-2 border-signal pl-6 sm:pl-10">
        <h3 className="font-serif text-3xl leading-tight sm:text-4xl">{persistence.title}</h3>
        <p className="mt-4 max-w-3xl text-lg text-dim">{persistence.body}</p>
      </aside>
    </Scene>
  );
}
