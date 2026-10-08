"use client";

import dynamic from "next/dynamic";
import { c1Scenes } from "../content";
import Scene from "../patterns/Scene";
import Stage from "../patterns/Stage";
import { ClipboardSvg } from "../three/fallbacks";

const Clipboard = dynamic(() => import("../three/Clipboard"), { ssr: false });
const scene = c1Scenes[6];

/** 07 — what Shwapno did (sticky steps) and the one thing it didn't. */
export default function Q07CompanyActions() {
  return <Scene scene={scene} indexed visual={<Stage alt={scene.alt} object={Clipboard} fallback={<ClipboardSvg />} />} />;
}
