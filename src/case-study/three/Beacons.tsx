"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { COLOR, damp, ramp } from "./util";

const FROM = new THREE.Vector3(0, -1.5, 1.5);
const BEACONS: [number, number, number][] = [
  [-2.4, 1.3, -6],
  [2.8, 0.7, -9],
];
const SEGMENTS = 80;

/** 05 — two distant red beacons; thin dashed lines reach toward them as the reader scrolls. */
export default function Beacons({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const halos = useRef<(THREE.Mesh | null)[]>([]);
  const lines = useMemo(
    () =>
      BEACONS.map((b) => {
        const to = new THREE.Vector3(...b);
        const mid = FROM.clone().lerp(to, 0.5).add(new THREE.Vector3(0, 1.4, 0));
        const g = new THREE.BufferGeometry().setFromPoints(new THREE.QuadraticBezierCurve3(FROM, mid, to).getPoints(SEGMENTS));
        const m = new THREE.LineDashedMaterial({ color: COLOR.signal, dashSize: 0.18, gapSize: 0.14, transparent: true, opacity: 0.85 });
        const line = new THREE.Line(g, m);
        line.computeLineDistances();
        g.setDrawRange(0, 0);
        return line;
      }),
    [],
  );
  useEffect(
    () => () =>
      lines.forEach((l) => {
        l.geometry.dispose();
        (l.material as THREE.Material).dispose();
      }),
    [lines],
  );

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const t = state.clock.elapsedTime;
    lines.forEach((l, i) => l.geometry.setDrawRange(0, Math.round(ramp(p, 0.05 + i * 0.2, 0.45 + i * 0.2) * (SEGMENTS + 1))));
    halos.current.forEach((h, i) => h?.scale.setScalar(1 + ((t * 0.6 + i * 0.5) % 1) * 2.2));
    halos.current.forEach((h, i) => {
      const m = h?.material as THREE.MeshBasicMaterial | undefined;
      if (m) m.opacity = 0.5 * (1 - ((t * 0.6 + i * 0.5) % 1));
    });
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, (p - 0.5) * 0.25, 2, dt);
  });

  return (
    <group ref={group}>
      {lines.map((l, i) => (
        <primitive key={i} object={l} />
      ))}
      {BEACONS.map((b, i) => (
        <group key={i} position={b}>
          <mesh>
            <sphereGeometry args={[0.22, 24, 24]} />
            <meshBasicMaterial color={COLOR.signal} />
          </mesh>
          <mesh ref={(m) => void (halos.current[i] = m)}>
            <sphereGeometry args={[0.22, 24, 24]} />
            <meshBasicMaterial color={COLOR.signal} transparent opacity={0.4} depthWrite={false} />
          </mesh>
          <pointLight color={COLOR.signal} intensity={2} distance={4} />
        </group>
      ))}
      <mesh position={FROM}>
        <boxGeometry args={[0.6, 0.36, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" emissive={COLOR.signal} emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}
