"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { npmVisual } from "../studies/npm-supply-chain-attack";
import { keyForgeAt, keyGreyAt } from "./npm";
import { COLOR, damp } from "./util";

const keys = npmVisual.keys;

/** 14 — a ring of keys: each turns grey (treat as exposed), then is reforged bright (replaced). */
export default function KeyRing({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const mats = useRef<(THREE.MeshStandardMaterial | null)[][]>(keys.map(() => []));
  const pivots = useRef<(THREE.Group | null)[]>([]);
  const ivory = useMemo(() => new THREE.Color(COLOR.ivory), []);
  const grey = useMemo(() => new THREE.Color("#4a4744"), []);
  const amber = useMemo(() => new THREE.Color(COLOR.amber), []);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const t = state.clock.elapsedTime;
    keys.forEach((_, i) => {
      const forged = p >= keyForgeAt(i);
      const target = forged ? amber : p >= keyGreyAt(i) ? grey : ivory;
      // A short glow right after reforging.
      const glow = forged ? Math.max(0, 1 - (p - keyForgeAt(i)) * 8) : 0;
      mats.current[i].forEach((m) => {
        if (!m) return;
        m.color.lerp(target, 1 - Math.exp(-6 * dt));
        m.emissive.copy(amber);
        m.emissiveIntensity = glow * 0.9 + (forged ? 0.12 : 0);
      });
      const pv = pivots.current[i];
      if (pv) pv.rotation.z = (i - (keys.length - 1) / 2) * 0.32 + Math.sin(t * 1.1 + i) * 0.04;
    });
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, -0.3 + p * 0.6, 3, dt);
  });

  const mat = (i: number, j: number) => (
    <meshStandardMaterial ref={(m) => void (mats.current[i][j] = m)} color={COLOR.ivory} metalness={0.7} roughness={0.3} />
  );

  return (
    <group ref={group} position={[0, 1, 0]}>
      <mesh>
        <torusGeometry args={[0.7, 0.05, 16, 64]} />
        <meshStandardMaterial color={COLOR.dim} metalness={0.8} roughness={0.25} />
      </mesh>
      {keys.map((k, i) => (
        <group key={k} ref={(g) => void (pivots.current[i] = g)} position={[0, -0.7, 0]}>
          <group position={[0, -0.3, (i - 1.5) * 0.08]}>
            <mesh>
              <torusGeometry args={[0.22, 0.06, 12, 32]} />
              {mat(i, 0)}
            </mesh>
            <mesh position={[0, -0.82, 0]}>
              <boxGeometry args={[0.1, 1.2, 0.06]} />
              {mat(i, 1)}
            </mesh>
            {[-1.15, -1.32].map((y, j) => (
              <mesh key={y} position={[0.1, y, 0]}>
                <boxGeometry args={[0.16 - j * 0.04, 0.09, 0.06]} />
                {mat(i, 2 + j)}
              </mesh>
            ))}
          </group>
        </group>
      ))}
    </group>
  );
}
