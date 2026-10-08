"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { npmVisual } from "../studies/npm-supply-chain-attack";
import { SERVER_CELLS, SERVER_LIT } from "./npm";
import { COLOR, damp, FONT_MONO, serifFamily, useCanvasTexture } from "./util";

const W = 5;
const H = 3.4;
const COLS = 7;
const ROWS = 4;
// Calendar cell centre in board units (grid starts under the header band).
const cell = ([c, r]: [number, number]) => [-W / 2 + 0.35 + (c + 0.5) * ((W - 0.7) / COLS), H / 2 - 0.85 - (r + 0.5) * ((H - 1.1) / ROWS)] as const;

function Server({ index, progress }: { index: number; progress: RefObject<number> }) {
  const light = useRef<THREE.MeshStandardMaterial>(null);
  const body = useRef<THREE.Group>(null);
  const red = useMemo(() => new THREE.Color(COLOR.signal), []);
  const off = useMemo(() => new THREE.Color("#2a2a2a"), []);
  const [x, y] = cell(SERVER_CELLS[index]);

  useFrame((state, dt) => {
    const on = (progress.current ?? 0) >= SERVER_LIT[index];
    const m = light.current;
    if (m) {
      m.color.lerp(on ? red : off, 1 - Math.exp(-6 * dt));
      m.emissive.copy(m.color);
      m.emissiveIntensity = on ? 0.6 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.25 : 0;
    }
    if (body.current) body.current.position.z = damp(body.current.position.z, on ? 0.55 : 0.3, 5, dt);
  });

  return (
    <group ref={body} position={[x, y, 0.3]}>
      <mesh>
        <boxGeometry args={[0.36, 0.5, 0.36]} />
        <meshStandardMaterial color="#161616" metalness={0.4} roughness={0.5} />
      </mesh>
      {[0.12, 0, -0.12].map((dy) => (
        <mesh key={dy} position={[0, dy, 0.181]}>
          <planeGeometry args={[0.26, 0.05]} />
          <meshStandardMaterial ref={dy === 0.12 ? light : undefined} color="#2a2a2a" />
        </mesh>
      ))}
    </group>
  );
}

/** 01 — a wall calendar of weeks; four servers stand on it and light up red one after another. */
export default function ServerCalendar({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const tex = useCanvasTexture(
    1000,
    680,
    (ctx, w, h) => {
      ctx.fillStyle = "#121212";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#ece8e1";
      ctx.font = `64px ${serifFamily()}`;
      ctx.textBaseline = "middle";
      ctx.fillText(npmVisual.calendar.title, 60, 80);
      ctx.fillStyle = "#f2a93b";
      ctx.font = `600 24px ${FONT_MONO}`;
      ctx.textAlign = "right";
      ctx.fillText(npmVisual.calendar.note.toUpperCase(), w - 60, 82);
      ctx.strokeStyle = "rgba(236,232,225,0.16)";
      const gx = 70;
      const gy = 170;
      const cw = (w - 140) / COLS;
      const ch = (h - 220) / ROWS;
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) ctx.strokeRect(gx + c * cw, gy + r * ch, cw - 8, ch - 8);
    },
    "npm-calendar",
  );

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = damp(g.rotation.y, -0.3 + (progress.current ?? 0) * 0.45, 3, dt);
    g.rotation.x = -0.18 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
  });

  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={tex} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[W + 0.08, H + 0.08, 0.06]} />
        <meshStandardMaterial color="#0d0d0d" />
      </mesh>
      {SERVER_CELLS.map((_, i) => (
        <Server key={i} index={i} progress={progress} />
      ))}
    </group>
  );
}
