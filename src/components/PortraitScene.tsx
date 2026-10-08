"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ACCENT_HEX } from "@/lib/accents";

// A particle portrait: points sampled from a headshot (x, y, brightness — 3 bytes each),
// never the photo itself. Brighter points sit closer, so the face gets real depth.
const SIZE = 3.4; // portrait width/height in scene units
const DEPTH = 0.55;
const CELL = SIZE / 200; // spacing of the sampling grid
const ASSEMBLE = 2.6; // seconds for the points to fly into place
const BODY_START = 0.66; // image height (0 = top) where the flowing body effect begins — just below the chin
const BODY_FULL = 0.78; // and where it reaches full strength

const vertex = /* glsl */ `
  attribute vec3 aStart;
  attribute float aLum;
  attribute float aDelay;
  attribute float aBody;
  uniform float uTime;
  uniform float uAssemble;
  uniform float uPixel;
  uniform float uWave;
  varying float vLum;
  varying float vX;
  void main() {
    // Reaches exactly 1 when assembly ends, so every point settles and then holds still.
    float t = clamp((uAssemble - aDelay) / (1.0 - aDelay), 0.0, 1.0);
    t = 1.0 - pow(1.0 - t, 3.0);
    vec3 p = mix(aStart, position, t);
    // Slow smoke/water flow, body only: aBody is 0 on the face and head, so they never move.
    float flow = uWave * t * aBody;
    p.x += sin(uTime * 0.22 + position.y * 6.0 + position.x * 1.5) * 0.045 * flow;
    p.y += (sin(uTime * 0.17 + position.x * 4.0) * 0.5 + 0.5) * 0.05 * flow;
    p.z += sin(uTime * 0.3 + position.y * 5.0 + position.x * 2.0) * 0.06 * flow;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uPixel * (1.0 + aLum * 1.6) * (6.0 / -mv.z);
    vLum = aLum;
    vX = position.x;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uLeft;
  uniform vec3 uRight;
  uniform float uHalf;
  varying float vLum;
  varying float vX;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    vec3 ink = mix(uLeft, uRight, clamp(vX / (2.0 * uHalf) + 0.5, 0.0, 1.0));
    vec3 col = mix(ink * 0.75, vec3(1.0), vLum * 0.5);
    float alpha = smoothstep(0.5, 0.1, d) * (0.3 + vLum * 0.62);
    gl_FragColor = vec4(col, alpha);
  }
`;

function decode(bytes: Uint8Array) {
  const n = bytes.length / 3;
  const position = new Float32Array(n * 3);
  const start = new Float32Array(n * 3);
  const lum = new Float32Array(n);
  const delay = new Float32Array(n);
  const body = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    // Jitter within the sampling cell so the points never read as a grid.
    const x = (bytes[i * 3] / 255 - 0.5) * SIZE + (Math.random() - 0.5) * CELL;
    const y = -(bytes[i * 3 + 1] / 255 - 0.5) * SIZE + (Math.random() - 0.5) * CELL;
    const l = bytes[i * 3 + 2] / 255;
    // Depth: brightness pushes forward; a soft dome keeps the head rounder than the shoulders.
    const dome = Math.max(0, 1 - (x * x) / 1.1 - ((y - 0.45) * (y - 0.45)) / 1.6);
    position.set([x, y, l * DEPTH + dome * 0.35], i * 3);
    // Start scattered on a wide shell behind the portrait.
    const a = Math.random() * Math.PI * 2;
    const b = Math.acos(2 * Math.random() - 1);
    const r = 3 + Math.random() * 2.5;
    start.set([r * Math.sin(b) * Math.cos(a), r * Math.cos(b), r * Math.sin(b) * Math.sin(a) - 2], i * 3);
    lum[i] = l;
    // Bright features (face, glasses) land first, then the hair and shoulders fill in.
    delay[i] = (1 - l) * 0.45 + Math.random() * 0.2;
    // 0 above the chin, easing to 1 across the neck into the shoulders.
    body[i] = THREE.MathUtils.smoothstep(bytes[i * 3 + 1] / 255, BODY_START, BODY_FULL);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(position, 3));
  g.setAttribute("aStart", new THREE.BufferAttribute(start, 3));
  g.setAttribute("aLum", new THREE.BufferAttribute(lum, 1));
  g.setAttribute("aDelay", new THREE.BufferAttribute(delay, 1));
  g.setAttribute("aBody", new THREE.BufferAttribute(body, 1));
  return g;
}

function Points({ geometry, reduced }: { geometry: THREE.BufferGeometry; reduced: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const born = useRef<number | null>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uAssemble: { value: 0 },
          uPixel: { value: 1 },
          uWave: { value: 1 },
          uHalf: { value: SIZE / 2 },
          uLeft: { value: new THREE.Color(ACCENT_HEX.client) },
          uRight: { value: new THREE.Color(ACCENT_HEX.server) },
        },
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (born.current === null) born.current = t;
    const shader = pointsRef.current?.material as THREE.ShaderMaterial | undefined;
    if (!shader) return;
    const u = shader.uniforms;
    u.uTime.value = t;
    u.uPixel.value = state.viewport.dpr * Math.min(1.6, state.size.height / 420);
    u.uAssemble.value = reduced ? 1 : Math.min(1, (t - born.current) / ASSEMBLE);
    u.uWave.value = reduced ? 0 : 1;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

export default function PortraitScene({ running, reduced }: { running: boolean; reduced: boolean }) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    let cancelled = false;
    let made: THREE.BufferGeometry | null = null;
    fetch("/portrait/points.bin")
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        if (cancelled) return;
        made = decode(new Uint8Array(buf));
        setGeometry(made);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      made?.dispose();
    };
  }, []);

  return (
    <Canvas frameloop={running ? "always" : "never"} dpr={[1, 2]} camera={{ fov: 35, position: [0, 0, 6.2] }} gl={{ alpha: true, antialias: false }}>
      {geometry && <Points geometry={geometry} reduced={reduced} />}
    </Canvas>
  );
}
