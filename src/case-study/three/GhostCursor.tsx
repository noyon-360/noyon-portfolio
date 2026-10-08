"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { COLOR, damp, ramp, rng, useCanvasTexture } from "./util";

function arrowShape() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(0, -0.42);
  s.lineTo(0.1, -0.32);
  s.lineTo(0.18, -0.5);
  s.lineTo(0.24, -0.47);
  s.lineTo(0.16, -0.3);
  s.lineTo(0.3, -0.3);
  s.closePath();
  return s;
}

/** 06 — a screen with its owner's cursor resting still; a second, red cursor appears and moves on its own. */
export default function GhostCursor({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const ghost = useRef<THREE.Mesh>(null);
  const arrow = useMemo(() => new THREE.ExtrudeGeometry(arrowShape(), { depth: 0.03, bevelEnabled: false }), []);
  useEffect(() => () => arrow.dispose(), [arrow]);

  // A calm desktop: a few windows and lines of placeholder text (grey bars, not words).
  const screen = useCanvasTexture(
    1024,
    640,
    (ctx, w, h) => {
      ctx.fillStyle = "#101214";
      ctx.fillRect(0, 0, w, h);
      const r = rng(6);
      [
        [60, 60, 520, 330],
        [440, 250, 520, 330],
      ].forEach(([x, y, ww, hh]) => {
        ctx.fillStyle = "#1b1e21";
        ctx.fillRect(x, y, ww, hh);
        ctx.fillStyle = "#2a2e33";
        ctx.fillRect(x, y, ww, 34);
        ctx.fillStyle = "rgba(236,232,225,0.18)";
        for (let i = 0; i < 7; i++) ctx.fillRect(x + 24, y + 64 + i * 34, 120 + r() * (ww - 180), 12);
      });
    },
    "npm-screen",
  );

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const t = state.clock.elapsedTime;
    const g = ghost.current;
    if (g) {
      const s = ramp(p, 0.1, 0.25);
      g.scale.setScalar(Math.max(0.001, s));
      const amp = 0.4 + p * 1.1;
      g.position.x = damp(g.position.x, 0.4 + Math.sin(t * 0.9) * amp, 4, dt);
      g.position.y = damp(g.position.y, 0.2 + Math.sin(t * 1.3 + 1) * amp * 0.5, 4, dt);
    }
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, 0.3 - p * 0.5, 3, dt);
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[4.3, 2.8, 0.14]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, -0.025]}>
        <planeGeometry args={[4.0, 2.5]} />
        <meshBasicMaterial map={screen} />
      </mesh>
      <mesh position={[0, -1.75, -0.2]}>
        <boxGeometry args={[0.5, 0.6, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh geometry={arrow} position={[-0.9, -0.2, 0]}>
        <meshBasicMaterial color={COLOR.ivory} />
      </mesh>
      <mesh ref={ghost} geometry={arrow} position={[0.4, 0.2, 0.01]} scale={0.001}>
        <meshBasicMaterial color={COLOR.signal} />
      </mesh>
    </group>
  );
}
