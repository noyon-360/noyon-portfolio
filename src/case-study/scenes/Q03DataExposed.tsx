"use client";

import dynamic from "next/dynamic";
import { c1Scenes } from "../content";
import Scene from "../patterns/Scene";
import Stage from "../patterns/Stage";
import { ReceiptSvg } from "../three/fallbacks";

const Receipt = dynamic(() => import("../three/Receipt"), { ssr: false });
const scene = c1Scenes[2];

/** 03 — what leaked: a receipt unrolls and its lines become data tags. */
export default function Q03DataExposed() {
  return <Scene scene={scene} visual={<Stage alt={scene.alt} object={Receipt} fallback={<ReceiptSvg />} />} />;
}
