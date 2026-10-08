"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import * as THREE from "three";
import { npmVisual } from "../studies/npm-supply-chain-attack";
import { COLOR, damp, FONT_MONO, useCanvasTexture } from "./util";

const { ports } = npmVisual.magnifier;
const STEP = 1.25;
const chipX = (i: number) => (i - (ports.length - 1) / 2) * STEP;

function Chip({ label, x }: { label: string; x: number }) {
  const tex = useCanvasTexture(
    256,
    160,
    (ctx, w, h) => {
      ctx.fillStyle = "#151515";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(236,232,225,0.35)";
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, w - 8, h - 8);
      ctx.fillStyle = "#ece8e1";
      ctx.font = `600 56px ${FONT_MONO}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`:${label}`, w / 2, h / 2);
    },
    `npm-port-${label}`,
  );
  return (
    <mesh position={[x, 0, 0]}>
      <planeGeometry args={[1, 0.62]} />
      <meshBasicMaterial map={tex} />
    </mesh>
  );
}

/** 12 — a magnifying glass slides over a row of ports; inside the lens a dark blind spot hides :443. */
export default function Magnifier({ progress }: { progress: RefObject<number> }) {
  const lens = useRef<THREE.Group>(null);
  const group = useRef<THREE.Group>(null);
  const blind = ports.indexOf("443");

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    // The lens sweeps the row and settles over :443 halfway through the scene.
    const x = THREE.MathUtils.lerp(chipX(0), chipX(blind), Math.min(1, p * 2)) + Math.sin(state.clock.elapsedTime * 0.8) * 0.06;
    if (lens.current) lens.current.position.x = damp(lens.current.position.x, x, 4, dt);
    if (group.current) group.current.rotation.x = damp(group.current.rotation.x, -0.15, 3, dt);
  });

  return (
    <group ref={group}>
      {ports.map((pt, i) => (
        <Chip key={pt} label={pt} x={chipX(i)} />
      ))}
      <group ref={lens} position={[chipX(0), 0, 0.5]}>
        <mesh>
          <torusGeometry args={[0.72, 0.07, 16, 64]} />
          <meshStandardMaterial color={COLOR.ivory} metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.7, 48]} />
          <meshStandardMaterial color="#c8d8e8" transparent opacity={0.1} depthWrite={false} />
        </mesh>
        {/* The blind spot: what the filtered check never looked at. */}
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.44, 48]} />
          <meshBasicMaterial color="#050505" transparent opacity={0.92} />
        </mesh>
        <mesh position={[0.75, -0.75, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.07, 0.09, 0.9, 16]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      </group>
    </group>
  );
}
