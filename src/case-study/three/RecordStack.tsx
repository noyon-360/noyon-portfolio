"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { RECORD_COUNT, RECORD_FIRST, recordX, visitAt } from "./portal";
import { COLOR, damp, FONT_MONO, ramp, useCanvasTexture } from "./util";

function Card({ n, x, mat, lines }: { n: number; x: number; mat: React.Ref<THREE.MeshBasicMaterial>; lines: React.Ref<THREE.Group> }) {
  const tex = useCanvasTexture(
    256,
    340,
    (ctx, w, h) => {
      ctx.fillStyle = "#151515";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(236,232,225,0.35)";
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, w - 8, h - 8);
      ctx.fillStyle = "#9d9890";
      ctx.font = `500 26px ${FONT_MONO}`;
      ctx.textAlign = "center";
      ctx.fillText("RECORD", w / 2, 60);
      ctx.fillStyle = "#ece8e1";
      ctx.font = `600 54px ${FONT_MONO}`;
      ctx.fillText(`#${n}`, w / 2, 124);
    },
    `portal-record-${n}`,
  );
  return (
    <group position={[x, 0, 0]}>
      <mesh>
        <planeGeometry args={[0.86, 1.14]} />
        <meshBasicMaterial map={tex} />
      </mesh>
      {/* Frame that lights when the card is opened */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[0.94, 1.22]} />
        <meshBasicMaterial ref={mat} color="#2a2926" />
      </mesh>
      {/* Contents: grey bars only, no data */}
      <group ref={lines} position={[0, -0.2, 0.01]} scale={[1, 0.001, 1]}>
        {[0.12, 0, -0.12, -0.24].map((y, j) => (
          <mesh key={y} position={[-0.05 * j, y, 0]}>
            <planeGeometry args={[0.6 - j * 0.08, 0.05]} />
            <meshBasicMaterial color={COLOR.dim} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** 03 — a row of sequentially numbered records; a marker steps along and each one opens as it arrives. */
export default function RecordStack({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const marker = useRef<THREE.Mesh>(null);
  const frames = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const contents = useRef<(THREE.Group | null)[]>([]);
  const cards = useRef<(THREE.Group | null)[]>([]);
  const off = useMemo(() => new THREE.Color("#2a2926"), []);
  const on = useMemo(() => new THREE.Color(COLOR.violet), []);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    let last = 0;
    for (let i = 0; i < RECORD_COUNT; i++) {
      const open = ramp(p, visitAt(i), visitAt(i) + 0.06);
      if (p >= visitAt(i)) last = i;
      frames.current[i]?.color.lerp(open > 0.5 ? on : off, 1 - Math.exp(-6 * dt));
      const c = contents.current[i];
      if (c) c.scale.y = damp(c.scale.y, Math.max(0.001, open), 6, dt);
      const g = cards.current[i];
      if (g) g.position.y = damp(g.position.y, open * 0.25, 5, dt);
    }
    if (marker.current) {
      marker.current.position.x = damp(marker.current.position.x, recordX(last), 6, dt);
      marker.current.rotation.y = state.clock.elapsedTime * 1.5;
    }
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, 0.3 - p * 0.4, 3, dt);
  });

  return (
    <group ref={group} rotation={[-0.08, 0.3, 0]}>
      {Array.from({ length: RECORD_COUNT }, (_, i) => (
        <group key={i} ref={(g) => void (cards.current[i] = g)}>
          <Card n={RECORD_FIRST + i} x={recordX(i)} mat={(m) => void (frames.current[i] = m)} lines={(g) => void (contents.current[i] = g)} />
        </group>
      ))}
      <mesh ref={marker} position={[recordX(0), 1.05, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.12, 0.26, 4]} />
        <meshBasicMaterial color={COLOR.violet} />
      </mesh>
    </group>
  );
}
