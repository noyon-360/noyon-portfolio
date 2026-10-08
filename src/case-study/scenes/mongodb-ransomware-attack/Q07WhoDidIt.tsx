"use client";

import dynamic from "next/dynamic";
import { Stats } from "../../patterns/CountUp";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { addressesNote, mongoScenes, mongoVisual, ransomStats } from "../../studies/mongodb-ransomware-attack";
import { BeaconsSvg } from "../../three/fallbacks";
import { BeaconsHud } from "./huds";

const Beacons = dynamic(() => import("../../three/Beacons"), { ssr: false });
const scene = mongoScenes[6];

/** 07 — two unnamed addresses, two roles; then the ransom in numbers and a note on what an IP address is. */
export default function Q07WhoDidIt() {
  return (
    <Scene scene={scene} indexed visual={<Stage alt={scene.alt} object={Beacons} fallback={<BeaconsSvg labels={mongoVisual.beacons} />} hud={<BeaconsHud />} camera={{ position: [0, 0, 8] }} />}>
      <Stats stats={ransomStats} title="The ransom" />
      <aside className="mt-16 border-l-2 border-acc pl-6 sm:pl-10">
        <h3 className="font-serif text-3xl leading-tight sm:text-4xl">{addressesNote.title}</h3>
        <p className="mt-4 max-w-3xl text-lg text-dim">{addressesNote.body}</p>
      </aside>
    </Scene>
  );
}
