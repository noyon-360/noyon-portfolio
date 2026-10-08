"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import * as THREE from "three";
import { LINE_END, LINE_EVENTS, LINE_START, lineFill, SESSION_X } from "./mongodb";
import { COLOR, damp, ramp } from "./util";

const LEN = LINE_END - LINE_START;

/** 01 — nineteen months as one bar: the "open" stretch glows as it runs, and markers rise at each event. */
export default function ExposureLine({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const fill = useRef<THREE.Mesh>(null);
  const markers = useRef<(THREE.Mesh | null)[]>([]);
  const sessions = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const f = fill.current;
    if (f) {
      const w = Math.max(0.001, lineFill(p) - LINE_START);
      f.scale.x = damp(f.scale.x, w, 4, dt);
      f.position.x = LINE_START + f.scale.x / 2;
    }
    LINE_EVENTS.forEach((e, i) => {
      const m = markers.current[i];
      if (!m) return;
      const k = ramp(p, e.at, e.at + 0.06);
      m.scale.y = damp(m.scale.y, Math.max(0.001, k * e.h), 6, dt);
      m.position.y = m.scale.y / 2;
    });
    sessions.current.forEach((m, i) => {
      if (!m) return;
      const k = ramp(p, 0.42 + i * 0.02, 0.48 + i * 0.02);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = k * (0.35 + 0.15 * Math.sin(state.clock.elapsedTime * 3 + i));
    });
    if (group.current) group.current.rotation.x = damp(group.current.rotation.x, 0.5 - p * 0.25, 3, dt);
    if (group.current) group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.06 - 0.12;
  });

  const toneColor = { ivory: COLOR.ivory, dim: COLOR.dim, amber: COLOR.amber, signal: COLOR.signal };

  return (
    <group ref={group} position={[0, -0.2, 0]} scale={0.72}>
      {/* The full nineteen months, as a dim rail */}
      <mesh position={[(LINE_START + LINE_END) / 2, 0, 0]}>
        <boxGeometry args={[LEN, 0.06, 0.4]} />
        <meshStandardMaterial color="#2a2926" />
      </mesh>
      {/* The open stretch */}
      <mesh ref={fill} position={[LINE_START, 0.01, 0]} scale={[0.001, 1, 1]}>
        <boxGeometry args={[1, 0.08, 0.42]} />
        <meshStandardMaterial color={COLOR.ice} emissive={COLOR.ice} emissiveIntensity={0.5} />
      </mesh>
      {/* Month ticks */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i} position={[LINE_START + (LEN * i) / 19, -0.12, 0.22]}>
          <boxGeometry args={[0.02, 0.14, 0.02]} />
          <meshBasicMaterial color={COLOR.dim} />
        </mesh>
      ))}
      {SESSION_X.map((x, i) => (
        <mesh key={x} ref={(m) => void (sessions.current[i] = m)} position={[x, 0.35, 0]}>
          <boxGeometry args={[0.08, 0.6, 0.08]} />
          <meshBasicMaterial color={COLOR.amber} transparent opacity={0} />
        </mesh>
      ))}
      {LINE_EVENTS.map((e, i) => (
        <mesh key={i} ref={(m) => void (markers.current[i] = m)} position={[e.x, 0, -0.05]} scale={[1, 0.001, 1]}>
          <boxGeometry args={[0.16, 1, 0.16]} />
          <meshStandardMaterial color={toneColor[e.tone]} emissive={e.tone === "signal" ? COLOR.signal : "#000"} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}
