"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { npmVisual } from "../studies/npm-supply-chain-attack";
import { boxEdges, COLOR, damp, FONT_MONO, rng, useCanvasTexture } from "./util";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789+/=_$";

/**
 * 04 — a glass box labelled "node" with a smaller red box inside. A band of scrambled characters wraps it,
 * blurred past reading: random glyphs, not the real command. Only three markers are legible.
 */
export default function NodeBox({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const innerMat = useRef<THREE.MeshStandardMaterial>(null);
  const band = useRef<THREE.Mesh>(null);
  const shell = useMemo(() => boxEdges(2.4, 1.7, 1.7), []);
  useEffect(() => () => shell.dispose(), [shell]);

  const label = useCanvasTexture(
    256,
    96,
    (ctx, w, h) => {
      ctx.fillStyle = "#ece8e1";
      ctx.font = `600 56px ${FONT_MONO}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(npmVisual.nodeBox.label, w / 2, h / 2);
    },
    "npm-node-label",
  );

  const scramble = useCanvasTexture(
    2048,
    128,
    (ctx, w, h) => {
      const r = rng(1337);
      ctx.clearRect(0, 0, w, h);
      ctx.filter = "blur(5px)";
      ctx.fillStyle = "rgba(236,232,225,0.75)";
      ctx.font = `34px ${FONT_MONO}`;
      ctx.textBaseline = "middle";
      let line = "";
      for (let i = 0; i < 120; i++) line += GLYPHS[Math.floor(r() * GLYPHS.length)];
      ctx.fillText(line, 0, h / 2);
      ctx.filter = "none";
      npmVisual.nodeBox.markers.forEach((m, i) => {
        const x = 180 + i * 640;
        ctx.font = `600 30px ${FONT_MONO}`;
        const tw = ctx.measureText(m).width;
        ctx.fillStyle = COLOR.signal;
        ctx.fillRect(x - 16, h / 2 - 26, tw + 32, 52);
        ctx.fillStyle = "#0a0a0a";
        ctx.fillText(m, x, h / 2 + 2);
      });
    },
    "npm-scramble",
  );

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const t = state.clock.elapsedTime;
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, -0.5 + p * 0.9, 3, dt);
    if (inner.current) {
      inner.current.rotation.x = t * 0.4;
      inner.current.rotation.y = t * 0.6;
    }
    if (innerMat.current) innerMat.current.emissiveIntensity = 0.25 + p * 0.6 + Math.sin(t * 2.4) * 0.12;
    if (band.current) band.current.rotation.y = -t * 0.12 - p * 2;
  });

  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[2.4, 1.7, 1.7]} />
        <meshStandardMaterial color="#9fb4c8" transparent opacity={0.08} roughness={0.1} metalness={0.2} depthWrite={false} />
      </mesh>
      <lineSegments geometry={shell}>
        <lineBasicMaterial color={COLOR.ivory} transparent opacity={0.6} />
      </lineSegments>
      <mesh position={[-0.75, 0.62, 0.86]}>
        <planeGeometry args={[0.8, 0.3]} />
        <meshBasicMaterial map={label} transparent />
      </mesh>
      <mesh ref={inner}>
        <boxGeometry args={[0.62, 0.62, 0.62]} />
        <meshStandardMaterial ref={innerMat} color={COLOR.signal} emissive={COLOR.signal} />
      </mesh>
      <mesh ref={band} position={[0, -1.25, 0]}>
        <cylinderGeometry args={[2.1, 2.1, 0.42, 72, 1, true]} />
        <meshBasicMaterial map={scramble} transparent side={THREE.FrontSide} depthWrite={false} />
      </mesh>
    </group>
  );
}
