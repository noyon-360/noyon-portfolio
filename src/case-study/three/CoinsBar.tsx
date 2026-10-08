"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import * as THREE from "three";
import { COLOR, damp, ramp } from "./util";

const COINS = [5, 3, 2]; // a deliberately tiny pile

/** A tiny coin pile (what the attackers collected) beside a towering bar (the damage). Not to scale. */
export default function CoinsBar({ progress }: { progress: RefObject<number> }) {
  const bar = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const h = 0.05 + ramp(p, 0.05, 0.6) * 3.9;
    if (bar.current) {
      bar.current.scale.y = damp(bar.current.scale.y, h, 4, dt);
      bar.current.position.y = bar.current.scale.y / 2 - 2;
    }
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, -0.5 + p * 0.4 + Math.sin(state.clock.elapsedTime * 0.3) * 0.04, 3, dt);
  });

  return (
    <group ref={group} position={[0, -0.2, 0]}>
      <group position={[-1.3, -2, 0]}>
        {COINS.map((n, s) =>
          Array.from({ length: n }, (_, i) => (
            <mesh key={`${s}-${i}`} position={[s * 0.32 - 0.3, 0.035 + i * 0.07, (s % 2) * 0.2]}>
              <cylinderGeometry args={[0.14, 0.14, 0.06, 28]} />
              <meshStandardMaterial color={COLOR.amber} metalness={0.9} roughness={0.25} />
            </mesh>
          )),
        )}
      </group>
      <mesh ref={bar} position={[1, -2, 0]} scale={[1, 0.05, 1]}>
        <boxGeometry args={[1.1, 1, 1.1]} />
        <meshStandardMaterial color={COLOR.signal} roughness={0.5} />
      </mesh>
    </group>
  );
}
