"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import * as THREE from "three";
import { visualText } from "../content";
import { clamp01, COLOR, damp, FONT_MONO, serifFamily, useCanvasTexture } from "./util";

const { months } = visualText.calendar;
const W = 2.6;
const H = 3;

function Page({ label, index, progress }: { label: string; index: number; progress: RefObject<number> }) {
  const pivot = useRef<THREE.Group>(null);
  const last = index === months.length - 1;
  const tex = useCanvasTexture(
    512,
    600,
    (ctx, w, h) => {
      ctx.fillStyle = "#efebe4";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = last || index === 0 ? COLOR.amber : "#1b1b1b";
      ctx.fillRect(0, 0, w, 120);
      ctx.fillStyle = last || index === 0 ? "#111" : "#efebe4";
      ctx.font = `64px ${serifFamily()}`;
      ctx.textBaseline = "middle";
      ctx.fillText(label, 36, 64);
      // A plain grid stands in for the days; no dates are claimed.
      ctx.strokeStyle = "rgba(0,0,0,0.18)";
      for (let r = 0; r < 5; r++)
        for (let c = 0; c < 7; c++) ctx.strokeRect(36 + c * 63, 160 + r * 76, 56, 68);
      if (index === 0 || last) {
        ctx.fillStyle = "#111";
        ctx.font = `600 26px ${FONT_MONO}`;
        ctx.fillText((index === 0 ? visualText.calendar.first : visualText.calendar.last).toUpperCase(), 36, 570);
      }
    },
    label,
  );

  useFrame((_, dt) => {
    const p = progress.current ?? 0;
    // Page i swings up, over the binding and down behind the board once progress passes its slot.
    const flipped = !last && clamp01(p * (months.length - 1) - index) > 0.5;
    const g = pivot.current;
    if (!g) return;
    g.rotation.x = damp(g.rotation.x, flipped ? -Math.PI * 2 : 0, 4, dt);
    g.position.z = g.rotation.x < -Math.PI ? -0.3 - index * 0.012 : -index * 0.012;
  });

  return (
    <group ref={pivot} position={[0, H / 2, -index * 0.012]}>
      <mesh position={[0, -H / 2, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={tex} roughness={0.85} />
      </mesh>
      {/* Plain paper on the back, so a page mid-flip never shows mirrored text. */}
      <mesh position={[0, -H / 2, -0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#d6d1c8" roughness={0.9} />
      </mesh>
    </group>
  );
}

export default function Calendar({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = damp(g.rotation.y, -0.35 + (progress.current ?? 0) * 0.5, 3, dt);
    g.rotation.x = -0.12 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
  });
  return (
    <group ref={group} position={[0, -0.2, 0]}>
      {months.map((m, i) => (
        <Page key={m} label={m} index={i} progress={progress} />
      ))}
      {/* Binding rings along the top edge. */}
      {[-0.9, -0.3, 0.3, 0.9].map((x) => (
        <mesh key={x} position={[x, H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.11, 0.022, 10, 24]} />
          <meshStandardMaterial color={COLOR.dim} metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 0, -0.14]}>
        <boxGeometry args={[W + 0.1, H + 0.1, 0.06]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}
