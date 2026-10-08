"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { COLOR, damp, ramp } from "./util";

const ARC = Math.PI * 1.25;
const START = Math.PI / 2 + ARC / 2;
const R = 0.95;

// Heat shimmer: soft vertical flames of noise, strongest at the bottom, faded at the edges.
const shimmerFrag = /* glsl */ `
  uniform float uTime;
  uniform float uHeat;
  varying vec2 vUv;
  float wave(vec2 p) {
    return sin(p.x * 9.0 + sin(p.y * 6.0 - uTime * 2.3) * 1.6) * 0.5 + 0.5;
  }
  void main() {
    vec2 p = vUv;
    float w = wave(p + vec2(0.0, -uTime * 0.25)) * wave(p * 1.7 + vec2(uTime * 0.1, -uTime * 0.4));
    float fade = smoothstep(0.0, 0.35, p.y) * (1.0 - p.y) * smoothstep(0.0, 0.25, p.x) * smoothstep(1.0, 0.75, p.x);
    vec3 col = mix(vec3(1.0, 0.29, 0.24), vec3(0.95, 0.66, 0.23), p.y);
    gl_FragColor = vec4(col, w * fade * 0.35 * uHeat);
  }
`;
const shimmerVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

function Dial({ x, seed, progress }: { x: number; seed: number; progress: RefObject<number> }) {
  const fill = useRef<THREE.Mesh>(null);
  const needle = useRef<THREE.Group>(null);
  const level = useRef(0.1);
  const target = useRef(0.9);
  const next = useRef(0);

  useEffect(() => {
    const mesh = fill.current;
    return () => mesh?.geometry.dispose();
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    // Every ~0.4s pick a new reading in the 87–100% band, once the scene is under way.
    if (t > next.current) {
      next.current = t + 0.35 + ((seed * 7 + t) % 0.2);
      target.current = 0.87 + Math.abs(Math.sin(t * 3.1 + seed)) * 0.13;
    }
    const want = THREE.MathUtils.lerp(0.15, target.current, ramp(progress.current ?? 0, 0, 0.3));
    const prev = level.current;
    level.current = damp(level.current, want, 4, dt);
    if (fill.current && Math.abs(prev - level.current) > 0.002) {
      const old = fill.current.geometry;
      fill.current.geometry = new THREE.TorusGeometry(R, 0.09, 12, 72, Math.max(0.01, ARC * level.current));
      old.dispose();
    }
    if (needle.current) needle.current.rotation.z = START - ARC * level.current - Math.PI / 2;
  });

  return (
    <group position={[x, -0.4, 0]}>
      <mesh rotation={[0, 0, START - ARC]}>
        <torusGeometry args={[R, 0.09, 12, 72, ARC]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh ref={fill} rotation={[0, 0, START]} scale={[1, -1, 1]} position={[0, 0, 0.02]}>
        <torusGeometry args={[R, 0.09, 12, 72, ARC * 0.1]} />
        <meshStandardMaterial color={COLOR.signal} emissive={COLOR.signal} emissiveIntensity={0.4} />
      </mesh>
      <group ref={needle}>
        <mesh position={[0, 0.42, 0.08]}>
          <boxGeometry args={[0.04, 0.84, 0.04]} />
          <meshStandardMaterial color={COLOR.ivory} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.1, 0.1, 0.08, 24]} />
        <meshStandardMaterial color={COLOR.ivory} />
      </mesh>
    </group>
  );
}

/** 07 — two gauges, one per processor core, pinned near the top, with heat shimmering above them. */
export default function CpuGauges({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  // R3F disposes the JSX material on unmount; the frame loop updates its uniforms through the ref.
  const shimmer = useRef<THREE.ShaderMaterial>(null);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const m = shimmer.current;
    if (m) {
      m.uniforms.uTime.value = state.clock.elapsedTime;
      m.uniforms.uHeat.value = ramp(p, 0, 0.35);
    }
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, Math.sin(state.clock.elapsedTime * 0.4) * 0.12, 3, dt);
  });

  return (
    <group ref={group}>
      <Dial x={-1.25} seed={1} progress={progress} />
      <Dial x={1.25} seed={2} progress={progress} />
      <mesh position={[0, 1.15, -0.2]}>
        <planeGeometry args={[5, 2.2]} />
        <shaderMaterial
          ref={shimmer}
          uniforms={{ uTime: { value: 0 }, uHeat: { value: 0 } }} vertexShader={shimmerVert} fragmentShader={shimmerFrag} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}
