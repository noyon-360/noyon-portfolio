import Scene from "../../patterns/Scene";
import { portalScenes } from "../../studies/academic-portal-disclosure";

const scene = portalScenes[9];

/** 10 — four personal lessons, indexed; text only. */
export default function Q10Personal() {
  return <Scene scene={scene} indexed />;
}
