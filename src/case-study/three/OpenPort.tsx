"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { SCANNERS } from "./mongodb";
import { boxEdges, COLOR, damp } from "./util";

const PORT = new THREE.Vector3(0, 0.2, 0.62);

/** 02 — one server with its port standing open; scanner dots arrive from every direction and pass straight in. */
export default function OpenPort({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const dots = useRef<(THREE.Mesh | null)[]>([]);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const shell = useMemo(() => boxEdges(2.2, 2.8, 1.2), []);
  useEffect(() => () => shell.dispose(), [shell]);
  const from = useMemo(() => SCANNERS.map((s) => new THREE.Vector3(...s.from)), []);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const t = state.clock.elapsedTime;
    // More scanners find the door as the reader scrolls.
    const active = Math.ceil(4 + p * (SCANNERS.length - 4));
    SCANNERS.forEach((s, i) => {
      const m = dots.current[i];
      if (!m) return;
      m.visible = i < active;
      const k = (t * 0.35 + s.phase) % 1;
      m.position.lerpVectors(from[i], PORT, k * k);
      m.scale.setScalar(1 - k * 0.6);
    });
    if (glow.current) glow.current.opacity = 0.35 + 0.25 * Math.sin(t * 2) + p * 0.2;
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, -0.45 + p * 0.5, 3, dt);
  });

  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[2.18, 2.78, 1.18]} />
        <meshStandardMaterial color="#141414" />
      </mesh>
      <lineSegments geometry={shell}>
        <lineBasicMaterial color={COLOR.ivory} transparent opacity={0.5} />
      </lineSegments>
      {/* Drive bays */}
      {[-0.9, -0.6, 0.9].map((y) => (
        <mesh key={y} position={[0, y, 0.6]}>
          <boxGeometry args={[1.7, 0.12, 0.02]} />
          <meshStandardMaterial color="#2a2926" />
        </mesh>
      ))}
      {/* The open port: a lit socket, no lock */}
      <mesh position={[PORT.x, PORT.y, 0.6]}>
        <planeGeometry args={[0.7, 0.42]} />
        <meshBasicMaterial ref={glow} color={COLOR.ice} transparent opacity={0.5} />
      </mesh>
      {SCANNERS.map((_, i) => (
        <mesh key={i} ref={(m) => void (dots.current[i] = m)} visible={false}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color={COLOR.signal} />
        </mesh>
      ))}
    </group>
  );
}
