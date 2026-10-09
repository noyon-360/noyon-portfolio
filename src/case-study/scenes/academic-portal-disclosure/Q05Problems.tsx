import { CardGrid } from "../../patterns/Blocks";
import Scene from "../../patterns/Scene";
import { portalScenes, problems } from "../../studies/academic-portal-disclosure";

const scene = portalScenes[4];

/** 05 — what the exposure makes possible, as five cards; text only. */
export default function Q05Problems() {
  return (
    <Scene scene={scene}>
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-dim">(Five problems)</p>
      <CardGrid cards={problems} />
    </Scene>
  );
}
