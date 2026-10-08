"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { TOWER_BLOCKS, TOWER_WORST } from "./npm";
import { boxEdges, COLOR, damp, ramp } from "./util";

const TW = 0.9;
const TH = 3.2;
const BLOCK_H = 0.24;

/** 02 — four server towers; app blocks drop into each. Only the worst-hit tower's ten are known. */
export default function ServerTowers({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const blocks = useRef<(THREE.Mesh | null)[][]>(TOWER_BLOCKS.map(() => []));
  const shell = useMemo(() => boxEdges(TW, TH, TW), []);
  useEffect(() => () => shell.dispose(), [shell]);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    blocks.current.forEach((col) =>
      col.forEach((m, j) => {
        if (!m) return;
        const k = ramp(p, 0.05 + j * 0.06, 0.15 + j * 0.06);
        const rest = -TH / 2 + 0.16 + j * (BLOCK_H + 0.04);
        m.position.y = damp(m.position.y, THREE.MathUtils.lerp(rest + 2.5, rest, k), 6, dt);
        m.visible = k > 0.01;
      }),
    );
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, -0.35 + p * 0.4 + Math.sin(state.clock.elapsedTime * 0.3) * 0.04, 3, dt);
  });

  return (
    <group ref={group} position={[0, -0.2, 0]}>
      {TOWER_BLOCKS.map((n, t) => {
        const worst = t === TOWER_WORST;
        return (
          <group key={t} position={[(t - 1.5) * 1.35, 0, 0]}>
            <lineSegments geometry={shell}>
              <lineBasicMaterial color={worst ? COLOR.signal : COLOR.ivory} transparent opacity={worst ? 0.9 : 0.35} />
            </lineSegments>
            {Array.from({ length: n }, (_, j) => (
              <mesh key={j} ref={(m) => void (blocks.current[t][j] = m)} visible={false}>
                <boxGeometry args={[TW - 0.18, BLOCK_H, TW - 0.18]} />
                {worst ? (
                  <meshStandardMaterial color={j === 6 ? COLOR.signal : COLOR.ivory} emissive={j === 6 ? COLOR.signal : "#000"} emissiveIntensity={0.4} />
                ) : (
                  <meshStandardMaterial color={COLOR.dim} transparent opacity={0.18} />
                )}
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}
