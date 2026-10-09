"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { DRAWER_H, DRAWERS, drawerY, lockAt, OPEN_AMOUNT, openAt } from "./portal";
import { boxEdges, COLOR, damp, ramp } from "./util";

const W = 1.9;
const D = 1.4;
const OUT = 1.1;

function Cabinet({ progress, locking }: { progress: RefObject<number>; locking: boolean }) {
  const group = useRef<THREE.Group>(null);
  const drawers = useRef<(THREE.Group | null)[]>([]);
  const locks = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const shell = useMemo(() => boxEdges(W + 0.12, DRAWERS * DRAWER_H + 0.12, D), []);
  useEffect(() => () => shell.dispose(), [shell]);
  const off = useMemo(() => new THREE.Color("#3a3833"), []);
  const on = useMemo(() => new THREE.Color(COLOR.violet), []);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    for (let i = 0; i < DRAWERS; i++) {
      // 02: drawers slide out on their own. 08: they start out and close, then lock.
      const k = locking ? (1 - ramp(p, lockAt(i) - 0.08, lockAt(i))) * OPEN_AMOUNT[i] : ramp(p, openAt(i), openAt(i) + 0.12) * OPEN_AMOUNT[i];
      const g = drawers.current[i];
      if (g) g.position.z = damp(g.position.z, D / 2 + k * OUT, 5, dt);
      const m = locks.current[i];
      if (m) m.color.lerp(locking && p >= lockAt(i) ? on : off, 1 - Math.exp(-6 * dt));
    }
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, -0.55 + p * 0.2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.02, 3, dt);
  });

  return (
    <group ref={group} rotation={[0.18, -0.55, 0]}>
      <mesh>
        <boxGeometry args={[W + 0.1, DRAWERS * DRAWER_H + 0.1, D - 0.02]} />
        <meshStandardMaterial color="#141414" />
      </mesh>
      <lineSegments geometry={shell}>
        <lineBasicMaterial color={COLOR.ivory} transparent opacity={0.4} />
      </lineSegments>
      {Array.from({ length: DRAWERS }, (_, i) => (
        <group key={i} ref={(g) => void (drawers.current[i] = g)} position={[0, drawerY(i), D / 2]}>
          {/* The drawer body trails behind its front, so an open drawer shows its sides. */}
          <mesh position={[0, 0, -D / 2]}>
            <boxGeometry args={[W - 0.12, DRAWER_H - 0.1, D - 0.1]} />
            <meshStandardMaterial color="#1f1e1c" />
          </mesh>
          {/* Paper inside */}
          <mesh position={[0, 0.1, -D / 2]}>
            <boxGeometry args={[W - 0.3, 0.1, D - 0.3]} />
            <meshStandardMaterial color={COLOR.ivory} transparent opacity={0.55} />
          </mesh>
          <mesh>
            <boxGeometry args={[W - 0.06, DRAWER_H - 0.06, 0.06]} />
            <meshStandardMaterial color="#2a2926" />
          </mesh>
          <mesh position={[0, -0.06, 0.05]}>
            <boxGeometry args={[0.5, 0.06, 0.06]} />
            <meshStandardMaterial color={COLOR.ivory} metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0.62, 0.08, 0.04]}>
            <circleGeometry args={[0.07, 20]} />
            <meshBasicMaterial ref={(m) => void (locks.current[i] = m)} color="#3a3833" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** 02 — a five-drawer records cabinet; the drawers slide partly open on their own: nothing is locked. */
export default function FileCabinet({ progress }: { progress: RefObject<number> }) {
  return <Cabinet progress={progress} locking={false} />;
}

/** 08 — the same cabinet: each drawer slides shut and a lock lights on its face, one by one. */
export function LockedCabinet({ progress }: { progress: RefObject<number> }) {
  return <Cabinet progress={progress} locking />;
}
