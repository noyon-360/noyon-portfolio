"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { visualText } from "../content";
import { COLOR, damp, FONT_MONO, FONT_SANS, useCanvasTexture } from "./util";

const { caller, status, script, fills, note } = visualText.phone;

/** How much of the caller's script has filled in at progress p: 0–3 lines, then the blanks get filled. */
const stageAt = (p: number) => Math.min(5, Math.floor(p * 6));

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > max && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  return [...lines, line];
}

export default function Phone({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const [stage, setStage] = useState(0);
  const tex = useCanvasTexture(
    420,
    860,
    (ctx, w, h) => {
      ctx.fillStyle = "#0e0e0e";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = COLOR.dim;
      ctx.font = `20px ${FONT_MONO}`;
      ctx.fillText(status.toUpperCase(), 36, 90);
      ctx.fillStyle = COLOR.ivory;
      ctx.font = `600 38px ${FONT_SANS}`;
      ctx.fillText(caller, 36, 140);
      const filled = stage >= 4;
      // One speech bubble per script line, sized to its wrapped text.
      let y = 200;
      ctx.font = `28px ${FONT_SANS}`;
      ctx.textBaseline = "top";
      script.slice(0, Math.min(3, stage)).forEach((s, i) => {
        const text = s.replace("{name}", filled ? fills.name : "____").replace("{purchase}", filled ? fills.purchase : "____");
        const lines = wrap(ctx, text, w - 100);
        const boxH = lines.length * 36 + 32;
        ctx.fillStyle = "#1d1d1d";
        ctx.fillRect(28, y, w - 56, boxH);
        ctx.fillStyle = filled && i < 2 ? COLOR.amber : COLOR.ivory;
        lines.forEach((l, k) => ctx.fillText(l, 48, y + 16 + k * 36));
        y += boxH + 18;
      });
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = COLOR.dim;
      ctx.font = `16px ${FONT_MONO}`;
      ctx.fillText(note.toUpperCase(), 36, h - 150);
      // Answer / decline buttons.
      ctx.fillStyle = COLOR.signal;
      ctx.beginPath();
      ctx.arc(110, h - 80, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COLOR.green;
      ctx.beginPath();
      ctx.arc(w - 110, h - 80, 40, 0, Math.PI * 2);
      ctx.fill();
    },
    stage,
  );

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const s = stageAt(p);
    if (s !== stage) setStage(s);
    const g = group.current;
    if (!g) return;
    // Rings (buzzes) until the script starts filling in.
    const ringing = p < 0.2 ? Math.sin(state.clock.elapsedTime * 40) * 0.025 * (Math.sin(state.clock.elapsedTime * 3) > 0 ? 1 : 0) : 0;
    g.rotation.z = ringing;
    g.rotation.y = damp(g.rotation.y, -0.35 + p * 0.5, 3, dt);
    g.rotation.x = -0.08;
  });

  return (
    <group ref={group}>
      <RoundedBox args={[2.1, 4.2, 0.18]} radius={0.22} smoothness={6}>
        <meshStandardMaterial color="#1c1c1c" metalness={0.6} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0, 0.095]}>
        <planeGeometry args={[1.9, 3.9]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}
