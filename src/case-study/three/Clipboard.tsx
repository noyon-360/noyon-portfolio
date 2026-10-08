"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { c1Checklist, visualText } from "../content";
import { COLOR, damp, FONT_MONO, FONT_SANS, ramp, serifFamily, useCanvasTexture } from "./util";

const ROWS = c1Checklist.length;

function tick(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.strokeStyle = COLOR.green;
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 12, y + 13);
  ctx.lineTo(x + 34, y - 14);
  ctx.stroke();
}

export default function Clipboard({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const stamp = useRef<THREE.Group>(null);
  const [ticked, setTicked] = useState(0);

  const sheet = useCanvasTexture(
    600,
    800,
    (ctx, w) => {
      ctx.fillStyle = "#f3efe8";
      ctx.fillRect(0, 0, w, 800);
      ctx.fillStyle = "#111";
      ctx.font = `48px ${serifFamily()}`;
      ctx.fillText(visualText.checklist.title, 40, 90);
      c1Checklist.forEach((item, i) => {
        const y = 170 + i * 88;
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 2;
        ctx.strokeRect(40, y - 22, 44, 44);
        ctx.fillStyle = item.done ? "#222" : "#8a1b14";
        ctx.font = `${item.done ? "" : "600 "}24px ${FONT_SANS}`;
        ctx.fillText(item.text, 108, y + 9);
        if (item.done && i < ticked) tick(ctx, 45, y + 2);
      });
      ctx.fillStyle = "#777";
      ctx.font = `16px ${FONT_MONO}`;
      ctx.fillText("ACI · SHWAPNO", 40, 770);
    },
    ticked,
  );

  const stampTex = useCanvasTexture(
    512,
    180,
    (ctx, w, h) => {
      ctx.strokeStyle = COLOR.signal;
      ctx.lineWidth = 10;
      ctx.strokeRect(8, 8, w - 16, h - 16);
      ctx.fillStyle = COLOR.signal;
      ctx.font = `700 92px ${FONT_SANS}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(visualText.checklist.stamp, w / 2, h / 2 + 4);
    },
    "stamp",
  );

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const t = Math.min(ROWS - 1, Math.floor(p * 1.25 * (ROWS - 1)));
    if (t !== ticked) setTicked(t);
    const s = ramp(p, 0.78, 0.86);
    const st = stamp.current;
    if (st) {
      st.visible = s > 0;
      st.scale.setScalar(THREE.MathUtils.lerp(2.2, 1, s));
      st.position.z = THREE.MathUtils.lerp(1.5, 0.08, s);
    }
    if (group.current) {
      group.current.rotation.y = damp(group.current.rotation.y, -0.3 + p * 0.4, 3, dt);
      group.current.rotation.x = -0.1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group ref={group}>
      <RoundedBox args={[3.3, 4.3, 0.1]} radius={0.08} position={[0, 0, -0.06]}>
        <meshStandardMaterial color="#5a4632" roughness={0.8} />
      </RoundedBox>
      <mesh position={[0, -0.12, 0.01]}>
        <planeGeometry args={[3, 4]} />
        <meshStandardMaterial map={sheet} roughness={0.95} />
      </mesh>
      <RoundedBox args={[1.2, 0.3, 0.14]} radius={0.04} position={[0, 2.05, 0.04]}>
        <meshStandardMaterial color="#9a9a9a" metalness={0.8} roughness={0.25} />
      </RoundedBox>
      {/* Stamp lands across the last row: "Notify customers early". */}
      <group ref={stamp} position={[0.55, -1.6, 0.08]} rotation={[0, 0, 0.1]} visible={false}>
        <mesh>
          <planeGeometry args={[1.6, 0.56]} />
          <meshBasicMaterial map={stampTex} transparent toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
