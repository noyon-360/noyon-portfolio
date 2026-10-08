"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { COLOR, damp, ramp, rng } from "./util";

const ROWS = 11;
const SUSPECT = 6;
const GAP = 0.34;

/** 08 — a process list of calm white rows; one row turns red and pulses. Bars stand in for text. */
export default function ProcessRows({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const bad = useRef<THREE.MeshStandardMaterial>(null);
  const scan = useRef<THREE.Mesh>(null);
  const red = useMemo(() => new THREE.Color(COLOR.signal), []);
  const calm = useMemo(() => new THREE.Color("#cfcac2"), []);
  const widths = useMemo(() => {
    const r = rng(8);
    return Array.from({ length: ROWS }, (_, i) => (i === SUSPECT ? 3.6 : 1.2 + r() * 1.8));
  }, []);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const t = state.clock.elapsedTime;
    const on = ramp(p, 0.3, 0.45);
    if (bad.current) {
      bad.current.color.copy(calm).lerp(red, on);
      bad.current.emissive.copy(red);
      bad.current.emissiveIntensity = on * (0.35 + Math.sin(t * 4) * 0.3);
    }
    if (scan.current) scan.current.position.y = ((ROWS - 1) / 2) * GAP - Math.min(p / 0.45, 1) * SUSPECT * GAP;
    if (group.current) {
      group.current.rotation.x = damp(group.current.rotation.x, -0.35 + p * 0.2, 3, dt);
      group.current.rotation.y = damp(group.current.rotation.y, -0.25 + p * 0.35, 3, dt);
    }
  });

  return (
    <group ref={group}>
      {widths.map((w, i) => {
        const y = ((ROWS - 1) / 2 - i) * GAP;
        const suspect = i === SUSPECT;
        return (
          <group key={i} position={[0, y, 0]}>
            <mesh position={[-1.9, 0, 0]}>
              <boxGeometry args={[0.36, 0.12, 0.04]} />
              <meshStandardMaterial color={COLOR.dim} />
            </mesh>
            <mesh position={[-1.55 + w / 2, 0, 0]}>
              <boxGeometry args={[w, 0.12, 0.04]} />
              {suspect ? <meshStandardMaterial ref={bad} color="#cfcac2" /> : <meshStandardMaterial color="#cfcac2" transparent opacity={0.55} />}
            </mesh>
            <mesh position={[2.3, 0, 0]}>
              <boxGeometry args={[0.3, 0.12, 0.04]} />
              <meshStandardMaterial color={COLOR.dim} transparent opacity={0.6} />
            </mesh>
          </group>
        );
      })}
      <mesh ref={scan} position={[0, 0, 0.05]}>
        <planeGeometry args={[5.2, 0.26]} />
        <meshBasicMaterial color={COLOR.amber} transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}
