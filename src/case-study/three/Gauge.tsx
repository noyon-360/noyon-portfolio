"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { COLOR, damp } from "./util";

const ARC = Math.PI * 1.25; // sweep of the dial
const START = Math.PI / 2 + ARC / 2; // left end of the dial, in radians from +x

/** Trust fill for a scroll progress: full at the top of the scene, draining to 15%. */
export const trustAt = (p: number) => 1 - Math.min(1, p * 1.1) * 0.85;

export default function Gauge({ progress }: { progress: RefObject<number> }) {
  const fill = useRef<THREE.Mesh>(null);
  const needle = useRef<THREE.Group>(null);
  const group = useRef<THREE.Group>(null);
  const level = useRef(1);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const amber = useMemo(() => new THREE.Color(COLOR.amber), []);
  const red = useMemo(() => new THREE.Color(COLOR.signal), []);

  // The fill's geometry is swapped as it drains; release whichever one is attached at unmount.
  useEffect(() => {
    const mesh = fill.current;
    return () => mesh?.geometry.dispose();
  }, []);

  useFrame((state, dt) => {
    const target = trustAt(progress.current ?? 0);
    const prev = level.current;
    level.current = damp(level.current, target, 3, dt);
    // Rebuilding the arc when it moves is cheap at this size and keeps its end exact.
    if (fill.current && Math.abs(prev - level.current) > 0.0005) {
      const old = fill.current.geometry;
      fill.current.geometry = new THREE.TorusGeometry(1.9, 0.16, 16, 96, Math.max(0.01, ARC * level.current));
      old.dispose();
    }
    if (needle.current) needle.current.rotation.z = START - ARC * level.current - Math.PI / 2;
    if (mat.current) mat.current.color.copy(red).lerp(amber, level.current);
    if (group.current) group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
  });

  return (
    <group ref={group} position={[-1, -0.5, 0]}>
      {/* Track */}
      <mesh rotation={[0, 0, START - ARC]}>
        <torusGeometry args={[1.9, 0.16, 16, 96, ARC]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Fill is anchored at the left end and mirrored to run clockwise, so it drains right → left. */}
      <mesh ref={fill} rotation={[0, 0, START]} scale={[1, -1, 1]} position={[0, 0, 0.02]}>
        <torusGeometry args={[1.9, 0.16, 16, 96, ARC]} />
        <meshStandardMaterial ref={mat} color={COLOR.amber} emissive={COLOR.amber} emissiveIntensity={0.25} />
      </mesh>
      <group ref={needle}>
        <mesh position={[0, 0.85, 0.1]}>
          <boxGeometry args={[0.06, 1.7, 0.06]} />
          <meshStandardMaterial color={COLOR.ivory} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.18, 0.18, 0.12, 32]} />
        <meshStandardMaterial color={COLOR.ivory} />
      </mesh>
    </group>
  );
}
