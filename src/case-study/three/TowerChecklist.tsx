"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import * as THREE from "three";
import { npmVisual } from "../studies/npm-supply-chain-attack";
import { tickAt } from "./npm";
import { COLOR, damp, FONT_SANS, ramp, useCanvasTexture } from "./util";

const items = npmVisual.checklist;
const ROW = 0.52;

/** 09 — a server tower with a five-item checklist beside it; a tick lands on each item in turn. */
export default function TowerChecklist({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const ticks = useRef<(THREE.Group | null)[]>([]);
  const panel = useCanvasTexture(
    900,
    600,
    (ctx, w) => {
      ctx.fillStyle = "#141414";
      ctx.fillRect(0, 0, w, 600);
      ctx.font = `40px ${FONT_SANS}`;
      ctx.textBaseline = "middle";
      items.forEach((label, i) => {
        const y = 80 + i * 110;
        ctx.strokeStyle = "rgba(236,232,225,0.5)";
        ctx.lineWidth = 3;
        ctx.strokeRect(50, y - 30, 60, 60);
        ctx.fillStyle = "#ece8e1";
        ctx.fillText(label, 150, y + 2);
      });
    },
    "npm-checklist",
  );

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    ticks.current.forEach((g, i) => {
      if (!g) return;
      const k = ramp(p, tickAt(i), tickAt(i) + 0.08);
      g.scale.setScalar(Math.max(0.001, k));
    });
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, 0.35 - p * 0.3 + Math.sin(state.clock.elapsedTime * 0.3) * 0.03, 3, dt);
  });

  // Panel is 3 × 2 units; canvas rows sit at y = 80 + i·110 px of 600.
  const rowY = (i: number) => 1 - ((80 + i * 110) / 600) * 2;

  return (
    <group ref={group}>
      <group position={[-1.9, 0, 0]}>
        <mesh>
          <boxGeometry args={[1.1, 2.9, 1.1]} />
          <meshStandardMaterial color="#161616" metalness={0.4} roughness={0.5} />
        </mesh>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[0, 1.1 - i * ROW * 0.8, 0.56]}>
            <planeGeometry args={[0.8, 0.08]} />
            <meshStandardMaterial color={COLOR.amber} emissive={COLOR.amber} emissiveIntensity={0.3} transparent opacity={0.5} />
          </mesh>
        ))}
      </group>
      <group position={[0.9, 0, 0]}>
        <mesh>
          <planeGeometry args={[3, 2]} />
          <meshStandardMaterial map={panel} />
        </mesh>
        {items.map((_, i) => (
          <group key={i} ref={(g) => void (ticks.current[i] = g)} position={[-1.5 + (80 / 900) * 3, rowY(i), 0.03]} scale={0.001}>
            <mesh position={[-0.04, -0.02, 0]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.04, 0.12, 0.02]} />
              <meshBasicMaterial color={COLOR.amber} />
            </mesh>
            <mesh position={[0.05, 0.03, 0]} rotation={[0, 0, -Math.PI / 5]}>
              <boxGeometry args={[0.04, 0.24, 0.02]} />
              <meshBasicMaterial color={COLOR.amber} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
