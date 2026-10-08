"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { ALIGN_AT, LAYER_OFFSETS } from "./mongodb";
import { COLOR, damp, ramp } from "./util";

const GAP = 1.3;

/** 08 — four safeguard layers, each with a hole; the holes drift into line and a red thread passes through. */
export default function HoleLayers({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const layers = useRef<(THREE.Mesh | null)[]>([]);
  const thread = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.5, -1.1);
    s.lineTo(1.5, -1.1);
    s.lineTo(1.5, 1.1);
    s.lineTo(-1.5, 1.1);
    s.closePath();
    const hole = new THREE.Path();
    hole.absarc(0, 0, 0.32, 0, Math.PI * 2, true);
    s.holes.push(hole);
    return new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: false, curveSegments: 32 });
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const k = ramp(p, 0.05, ALIGN_AT);
    LAYER_OFFSETS.forEach(([ox, oy], i) => {
      const m = layers.current[i];
      if (!m) return;
      m.position.x = damp(m.position.x, ox * (1 - k), 4, dt);
      m.position.y = damp(m.position.y, oy * (1 - k), 4, dt);
    });
    const t = thread.current;
    if (t) {
      const s = ramp(p, ALIGN_AT, ALIGN_AT + 0.15);
      t.scale.y = damp(t.scale.y, Math.max(0.001, s), 5, dt);
      t.position.z = (GAP * 3 + 2.4) / 2 - (t.scale.y * (GAP * 3 + 2.4)) / 2;
    }
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, 0.75 - p * 0.25 + Math.sin(state.clock.elapsedTime * 0.3) * 0.03, 3, dt);
  });

  return (
    <group ref={group} rotation={[0.12, 0.75, 0]}>
      {LAYER_OFFSETS.map((_, i) => (
        <group key={i} position={[0, 0, -i * GAP + GAP * 1.5]}>
          <mesh ref={(m) => void (layers.current[i] = m)} geometry={geometry}>
            <meshStandardMaterial color={i === 3 ? "#3a3833" : COLOR.ivory} transparent opacity={0.4 - i * 0.05} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </group>
      ))}
      <mesh ref={thread} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.001, 1]}>
        <cylinderGeometry args={[0.05, 0.05, GAP * 3 + 2.4, 12]} />
        <meshBasicMaterial color={COLOR.signal} />
      </mesh>
    </group>
  );
}
