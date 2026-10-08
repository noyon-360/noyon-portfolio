"use client";

import dynamic from "next/dynamic";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { mongoCollections, mongoScenes } from "../../studies/mongodb-ransomware-attack";
import { CollectionsSvg } from "../../three/fallbacks";
import { CollectionsHud } from "./huds";

const Collections = dynamic(() => import("../../three/Collections"), { ssr: false });
const scene = mongoScenes[2];

const level = { Critical: "text-signal", High: "text-amber", Medium: "text-ivory", Low: "text-dim" };

/** 03 — thirteen drums drain away, then the table of what each collection held. */
export default function Q03Loss() {
  return (
    <Scene scene={scene} visual={<Stage alt={scene.alt} object={Collections} fallback={<CollectionsSvg />} hud={<CollectionsHud />} camera={{ position: [0, 0.6, 10] }} />}>
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">(Thirteen collections)</p>
      <div className="mt-6 overflow-x-auto border border-rule">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm sm:text-base">
          <caption className="sr-only">The thirteen deleted collections, what each held, and how sensitive it would be if copied.</caption>
          <thead>
            <tr className="border-b border-rule bg-ivory/[0.04] font-mono text-[11px] uppercase tracking-[0.14em] text-dim">
              <th scope="col" className="px-4 py-3 font-normal">Collection</th>
              <th scope="col" className="px-4 py-3 font-normal">Contents</th>
              <th scope="col" className="px-4 py-3 font-normal">Deletion</th>
              <th scope="col" className="px-4 py-3 font-normal">If copied</th>
            </tr>
          </thead>
          <tbody>
            {mongoCollections.map((c) => (
              <tr key={c.name} className="border-b border-rule last:border-0">
                <th scope="row" className="px-4 py-3 font-mono text-sm font-normal text-acc">{c.name}</th>
                <td className="px-4 py-3">{c.contents}</td>
                <td className="px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-dim">Confirmed</td>
                <td className={`px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] ${level[c.sensitivity]}`}>{c.sensitivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Scene>
  );
}
