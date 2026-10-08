"use client";

import dynamic from "next/dynamic";
import Scene from "../../patterns/Scene";
import Stage from "../../patterns/Stage";
import { q18 } from "../../studies/npm-supply-chain-attack";
import { GuardShieldSvg } from "../../three/fallbacks";
import { GuardShieldHud } from "./huds";

const GuardShield = dynamic(() => import("../../three/GuardShield"), { ssr: false });

/** 18 — the concept: a shield assembling from four labelled layers. */
export default function Q18EarlyWarning() {
  return <Scene scene={q18} indexed visual={<Stage alt={q18.alt} object={GuardShield} fallback={<GuardShieldSvg />} hud={<GuardShieldHud />} camera={{ position: [0, 0, 8] }} />} />;
}
