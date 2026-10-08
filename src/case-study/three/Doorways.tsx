"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import * as THREE from "three";
import { COLOR, damp } from "./util";

function Frame({ color, opacity, glow }: { color: string; opacity: number; glow: React.Ref<THREE.MeshBasicMaterial> }) {
  return (
    <group>
      {[-0.85, 0.85].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.16, 3, 0.2]} />
          <meshStandardMaterial color={color} transparent opacity={opacity} />
        </mesh>
      ))}
      <mesh position={[0, 1.58, 0]}>
        <boxGeometry args={[1.86, 0.16, 0.2]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[1.54, 3]} />
        <meshBasicMaterial ref={glow} color={COLOR.amber} transparent opacity={0.2} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** 13 — a lit doorway, and behind it a second, dimmer one that flickers: unconfirmed. */
export default function Doorways({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const front = useRef<THREE.MeshBasicMaterial>(null);
  const back = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const t = state.clock.elapsedTime;
    if (front.current) front.current.opacity = 0.22;
    // Irregular flicker, never bright: it may or may not be a door.
    if (back.current) back.current.opacity = (0.04 + p * 0.08) * (0.6 + 0.4 * Math.sin(t * 7) * Math.sin(t * 2.3));
    const g = group.current;
    if (g) {
      g.position.z = damp(g.position.z, -1 + p * 0.9, 3, dt);
      g.rotation.y = damp(g.rotation.y, -0.2 + p * 0.25, 3, dt);
    }
  });

  return (
    <group ref={group} position={[0.3, 0, -1]}>
      <group position={[-0.6, 0, 0]}>
        <Frame color={COLOR.ivory} opacity={0.9} glow={front} />
      </group>
      <group position={[1.3, 0, -4]}>
        <Frame color={COLOR.dim} opacity={0.35} glow={back} />
      </group>
    </group>
  );
}
