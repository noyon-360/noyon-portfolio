"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { COLOR, damp, rng } from "./util";

// Four groups, left to right: customers, the company, frontline staff, banks and wallets.
const GROUPS = [7, 3, 4, 3];
const GROUP_X = [-2.7, -0.9, 0.9, 2.7];

type Figure = { x: number; z: number; s: number; group: number };

export default function Crowd({ progress }: { progress: RefObject<number> }) {
  const root = useRef<THREE.Group>(null);
  const mats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const figures = useMemo(() => {
    const r = rng(4);
    const out: Figure[] = [];
    GROUPS.forEach((n, g) => {
      for (let i = 0; i < n; i++) out.push({ x: GROUP_X[g] + (r() - 0.5) * 1.3, z: (r() - 0.5) * 1.4, s: 0.85 + r() * 0.25, group: g });
    });
    return out;
  }, []);
  const base = useMemo(() => new THREE.Color("#2a2926"), []);
  const hit = useMemo(() => new THREE.Color(COLOR.amber), []);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    // The ripple's front travels left to right across the four groups.
    const front = -4 + p * 9;
    figures.forEach((f, i) => {
      const m = mats.current[i];
      if (!m) return;
      const d = front - f.x;
      const wave = d > 0 ? Math.exp(-d * 0.9) : 0;
      const touched = d > 0 ? 0.35 : 0;
      m.color.copy(base).lerp(hit, Math.min(1, wave + touched));
      m.emissive.copy(hit).multiplyScalar(wave * 0.5);
    });
    if (root.current) root.current.rotation.y = damp(root.current.rotation.y, Math.sin(state.clock.elapsedTime * 0.2) * 0.08 - 0.15 + p * 0.3, 2, dt);
  });

  return (
    <group ref={root} position={[0, -0.9, 0]} rotation={[0.18, 0, 0]}>
      {figures.map((f, i) => (
        <group key={i} position={[f.x, 0, f.z]} scale={f.s}>
          <mesh position={[0, 0.55, 0]}>
            <capsuleGeometry args={[0.2, 0.6, 4, 12]} />
            <meshStandardMaterial ref={(m) => void (mats.current[i] = m)} color="#2a2926" roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.22, 0]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#3a3833" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
