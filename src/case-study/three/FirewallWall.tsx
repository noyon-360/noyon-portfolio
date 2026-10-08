"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { COLOR, damp } from "./util";

const FROM = new THREE.Vector3(-2.3, 0.9, 0);
const WALL_X = 1.7;
const PULSES = 5;

/** 10 — red arcs leave a server and stop at a wall, again and again: blocked, but still knocking. */
export default function FirewallWall({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const dots = useRef<(THREE.Mesh | null)[]>([]);
  const flashes = useRef<(THREE.Mesh | null)[]>([]);
  const curves = useMemo(
    () =>
      Array.from({ length: PULSES }, (_, k) => {
        const to = new THREE.Vector3(WALL_X - 0.2, -0.9 + k * 0.45, 0);
        return new THREE.QuadraticBezierCurve3(FROM, new THREE.Vector3(-0.3, 2.2 - k * 0.15, 0), to);
      }),
    [],
  );
  const trails = useMemo(
    () =>
      curves.map((c) => {
        const l = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(c.getPoints(48)),
          new THREE.LineBasicMaterial({ color: COLOR.signal, transparent: true, opacity: 0.18 }),
        );
        return l;
      }),
    [curves],
  );
  useEffect(
    () => () =>
      trails.forEach((l) => {
        l.geometry.dispose();
        (l.material as THREE.Material).dispose();
      }),
    [trails],
  );
  const bricks = useMemo(() => {
    const out: [number, number][] = [];
    for (let r = 0; r < 7; r++) for (let c = 0; c < 3; c++) out.push([(r % 2 ? 0.3 : 0) + c * 0.62 - 0.6, -1.5 + r * 0.46]);
    return out;
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    curves.forEach((c, k) => {
      const u = (t * 0.45 + k / PULSES) % 1;
      const d = dots.current[k];
      if (d) d.position.copy(c.getPoint(Math.min(u / 0.85, 1)));
      const f = flashes.current[k];
      if (f) {
        const hit = u > 0.85 ? 1 - (u - 0.85) / 0.15 : 0;
        f.scale.setScalar(0.4 + hit * 1.2);
        (f.material as THREE.MeshBasicMaterial).opacity = hit * 0.8;
      }
    });
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, -0.35 + (progress.current ?? 0) * 0.5, 3, dt);
  });

  return (
    <group ref={group}>
      <mesh position={[-2.3, -0.2, 0]}>
        <boxGeometry args={[1, 2.3, 1]} />
        <meshStandardMaterial color="#161616" metalness={0.4} roughness={0.5} />
      </mesh>
      <group position={[WALL_X + 0.35, 0, 0]}>
        {bricks.map(([x, y], i) => (
          <mesh key={i} position={[0.2, y, x]}>
            <boxGeometry args={[0.4, 0.42, 0.58]} />
            <meshStandardMaterial color="#2a2722" emissive={COLOR.amber} emissiveIntensity={0.08} roughness={0.8} />
          </mesh>
        ))}
      </group>
      {trails.map((l, i) => (
        <primitive key={i} object={l} />
      ))}
      {curves.map((c, k) => (
        <group key={k}>
          <mesh ref={(m) => void (dots.current[k] = m)}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial color={COLOR.signal} />
          </mesh>
          <mesh ref={(m) => void (flashes.current[k] = m)} position={c.v2} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.18, 24]} />
            <meshBasicMaterial color={COLOR.signal} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
