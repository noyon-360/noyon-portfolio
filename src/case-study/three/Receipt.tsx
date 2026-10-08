"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import * as THREE from "three";
import { visualText } from "../content";
import { COLOR, damp, FONT_MONO, ramp, useCanvasTexture } from "./util";

const { header, lines, tags, claim } = visualText.receipt;
const PW = 1.8;
const PH = 3.6;

function Tag({ text, index, progress }: { text: string; index: number; progress: RefObject<number> }) {
  const ref = useRef<THREE.Group>(null);
  const tex = useCanvasTexture(
    512,
    128,
    (ctx, w, h) => {
      ctx.fillStyle = COLOR.amber;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#111";
      ctx.font = `600 44px ${FONT_MONO}`;
      ctx.textBaseline = "middle";
      ctx.fillText(text.toUpperCase(), 32, h / 2);
    },
    text,
  );
  // Tags pop out of the receipt one per step: name, then number, then history.
  const y = [1.15, 0.45, -0.25][index];
  useFrame((_, dt) => {
    const t = ramp(progress.current ?? 0, 0.15 + index * 0.22, 0.3 + index * 0.22);
    const g = ref.current;
    if (!g) return;
    g.position.x = damp(g.position.x, THREE.MathUtils.lerp(0, 1.85, t), 6, dt);
    g.position.z = damp(g.position.z, THREE.MathUtils.lerp(0, 0.35, t), 6, dt);
    g.scale.setScalar(damp(g.scale.x, 0.4 + t * 0.6, 6, dt));
    g.visible = t > 0.01;
  });
  return (
    <group ref={ref} position={[0, y, 0]} scale={0.4}>
      <RoundedBox args={[1.6, 0.4, 0.05]} radius={0.04}>
        <meshStandardMaterial color={COLOR.amber} />
      </RoundedBox>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1.6, 0.4]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function Receipt({ progress }: { progress: RefObject<number> }) {
  const paper = useRef<THREE.Group>(null);
  const group = useRef<THREE.Group>(null);
  const tex = useCanvasTexture(
    360,
    720,
    (ctx, w, h) => {
      ctx.fillStyle = "#f3efe8";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#222";
      ctx.textBaseline = "top";
      ctx.font = `600 22px ${FONT_MONO}`;
      ctx.fillText(header, 24, 32);
      ctx.fillRect(24, 70, w - 48, 2);
      ctx.font = `20px ${FONT_MONO}`;
      lines.forEach((l, i) => ctx.fillText(l, 24, 100 + i * 52 + (i > 1 ? 30 : 0)));
      ctx.fillRect(24, 410, w - 48, 2);
      ctx.font = `15px ${FONT_MONO}`;
      ctx.fillStyle = "#555";
      claim.match(/.{1,30}(\s|$)/g)?.forEach((s, i) => ctx.fillText(s.trim(), 24, 440 + i * 24));
      // Barcode-ish stripes.
      for (let x = 24; x < w - 24; x += 6) if ((x * 7) % 5 > 1) ctx.fillRect(x, 640, 3, 46);
    },
    "receipt",
  );

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    // The paper unrolls downward from the roll at the top.
    const u = 0.12 + ramp(p, 0, 0.35) * 0.88;
    if (paper.current) {
      paper.current.scale.y = damp(paper.current.scale.y, u, 5, dt);
    }
    tex.repeat.set(1, paper.current?.scale.y ?? u);
    tex.offset.set(0, 1 - (paper.current?.scale.y ?? u));
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, -0.45 + p * 0.35 + Math.sin(state.clock.elapsedTime * 0.4) * 0.03, 3, dt);
  });

  return (
    <group ref={group} position={[-0.6, 0.2, 0]}>
      <mesh position={[0, PH / 2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, PW + 0.15, 32]} />
        <meshStandardMaterial color="#e6e1d8" roughness={0.9} />
      </mesh>
      <group ref={paper} position={[0, PH / 2, 0]} scale={[1, 0.12, 1]}>
        <mesh position={[0, -PH / 2, 0]}>
          <planeGeometry args={[PW, PH]} />
          <meshStandardMaterial map={tex} side={THREE.DoubleSide} roughness={0.95} />
        </mesh>
      </group>
      {tags.map((t, i) => (
        <Tag key={t} text={t} index={i} progress={progress} />
      ))}
    </group>
  );
}
