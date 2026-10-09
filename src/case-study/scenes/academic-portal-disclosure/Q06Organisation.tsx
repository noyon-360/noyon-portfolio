"use client";

import dynamic from "next/dynamic";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { portalScenes, portalVisual } from "../../studies/academic-portal-disclosure";
import { GaugeSvg } from "../../three/fallbacks";
import { GaugeHud } from "./huds";

const Gauge = dynamic(() => import("../../three/Gauge"), { ssr: false });
const scene = portalScenes[5];

/** 06 — a trust dial drains as the consequences stack up. */
export default function Q06Organisation() {
  return <Scene scene={scene} visual={<Stage alt={scene.alt} object={Gauge} fallback={<GaugeSvg gauge={portalVisual.gauge} />} hud={<GaugeHud />} camera={{ position: [0, 0, 10.5] }} />} />;
}
