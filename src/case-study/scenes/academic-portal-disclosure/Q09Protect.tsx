import Scene from "../../patterns/Scene";
import { portalScenes } from "../../studies/academic-portal-disclosure";

const scene = portalScenes[8];

/** 09 — the author's opinion; text only. */
export default function Q09Protect() {
  return <Scene scene={scene} />;
}
