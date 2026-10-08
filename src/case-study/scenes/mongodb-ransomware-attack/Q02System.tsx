"use client";

import dynamic from "next/dynamic";
import { DefinitionCard } from "../../patterns/Blocks";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { mongoDefinitions, mongoScenes, mongoSystem } from "../../studies/mongodb-ransomware-attack";
import { OpenPortSvg } from "../../three/fallbacks";
import { OpenPortHud } from "./huds";

const OpenPort = dynamic(() => import("../../three/OpenPort"), { ssr: false });
const scene = mongoScenes[1];

/** 02 — definition card, one server with its port open to scanners, then the system's spec sheet. */
export default function Q02System() {
  return (
    <Scene
      scene={scene}
      lead={<DefinitionCard def={mongoDefinitions.auth} />}
      visual={<Stage alt={scene.alt} object={OpenPort} fallback={<OpenPortSvg />} hud={<OpenPortHud />} camera={{ position: [0, 0.4, 8] }} />}
    >
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">(The system)</p>
      <dl className="mt-6 border-t border-rule">
        {mongoSystem.map(([k, v]) => (
          <div key={k} className="grid gap-1 border-b border-rule py-4 sm:grid-cols-[14rem_1fr] sm:gap-8">
            <dt className="font-mono text-xs uppercase tracking-[0.16em] text-dim">{k}</dt>
            <dd className={`text-lg leading-snug ${k === "Authentication" || k === "Backups" || k === "Exposed service" ? "text-acc" : ""}`}>{v}</dd>
          </div>
        ))}
      </dl>
    </Scene>
  );
}
