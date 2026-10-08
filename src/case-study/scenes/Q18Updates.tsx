"use client";

import dynamic from "next/dynamic";
import { q18 } from "../content";
import Scene from "../patterns/Scene";
import Stage from "../patterns/Stage";
import { PcsSvg } from "../three/fallbacks";
import { PcsHud } from "./huds";

const TwoPCs = dynamic(() => import("../three/TwoPCs"), { ssr: false });

/** 18 — why updates matter: the same wave, one patched machine, one not. */
export default function Q18Updates() {
  return <Scene scene={q18} visual={<Stage alt={q18.alt} object={TwoPCs} fallback={<PcsSvg />} hud={<PcsHud />} />} />;
}
