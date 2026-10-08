"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { SIGNATURE_STROKES } from "@/lib/signature";
import { ACCENT_HEX } from "@/lib/accents";

const UNIT = 1 / 260; // sketch px → scene units
const CENTER: [number, number] = [830, 560];
const WIDTH = 6.2; // scene width the camera keeps in frame
const HEIGHT = 4; // scene height the camera keeps in frame
const DURATION = 5.5; // seconds to write the whole signature
const X_LEFT = (130 - CENTER[0]) * UNIT; // colour gradient spans the signature's width
const X_RIGHT = (1545 - CENTER[0]) * UNIT;
const PAUSE = 0.25; // pen-lift between strokes, in scene units of travel

// Subdivide long straight segments so the spline hugs the pen path: corners stay sharp
// instead of overshooting, and the slash's retrace lies on top of itself.
function densify(pts: [number, number][], step = 28): [number, number][] {
  const out: [number, number][] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / step));
    for (let k = 1; k <= n; k++) out.push([ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n]);
  }
  return out;
}

function buildStrokes() {
  const blue = new THREE.Color(ACCENT_HEX.client);
  const red = new THREE.Color(ACCENT_HEX.server);
  const tmp = new THREE.Color();
  let offset = 0;
  return SIGNATURE_STROKES.map((raw, k) => {
    const pts = densify(raw);
    const curve = new THREE.CatmullRomCurve3(
      pts.map(([x, y]) => new THREE.Vector3((x - CENTER[0]) * UNIT, -(y - CENTER[1]) * UNIT, k * 0.012)),
      false,
      "centripetal",
    );
    const length = curve.getLength();
    const geometry = new THREE.TubeGeometry(curve, Math.max(32, pts.length * 3), 0.042, 12, false);
    // Ink shades from client-blue (left) to server-red (right) along the stroke, like the rest of the site.
    const pos = geometry.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      tmp.copy(blue).lerp(red, THREE.MathUtils.clamp((pos.getX(i) - X_LEFT) / (X_RIGHT - X_LEFT), 0, 1));
      tmp.toArray(colors, i * 3);
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const stroke = { curve, geometry, length, start: offset, indexCount: geometry.index?.count ?? 0 };
    offset += length + PAUSE;
    return stroke;
  });
}

function Writer({ playKey, reduced }: { playKey: number; reduced: boolean }) {
  const strokes = useMemo(() => buildStrokes(), []);
  const group = useRef<THREE.Group>(null);
  const tip = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const { camera, size } = useThree();
  // Start time on the canvas clock for the current play; a new playKey restarts the writing.
  const startRef = useRef<{ key: number; t: number } | null>(null);
  const total = strokes[strokes.length - 1].start + strokes[strokes.length - 1].length;

  useFrame((state) => {
    // Keep the whole signature in frame at any aspect ratio.
    const aspect = size.width / size.height;
    const tan = Math.tan(THREE.MathUtils.degToRad(35 / 2));
    const z = Math.max(HEIGHT / 2 / tan, WIDTH / 2 / (tan * aspect));
    camera.position.set(0, 0, z);
    camera.lookAt(0, 0, 0);

    if (playKey > 0 && startRef.current?.key !== playKey) startRef.current = { key: playKey, t: state.clock.elapsedTime };
    const start = startRef.current;
    const ink = !start ? 0 : reduced ? total : ((state.clock.elapsedTime - start.t) / DURATION) * total;
    let tipAt: THREE.Vector3 | null = null;
    strokes.forEach((s, k) => {
      const local = THREE.MathUtils.clamp((ink - s.start) / s.length, 0, 1);
      const count = Math.floor((local * s.indexCount) / 6) * 6;
      meshes.current[k]?.geometry.setDrawRange(0, count);
      if (local > 0 && local < 1) tipAt = s.curve.getPointAt(local);
    });
    if (tip.current) {
      tip.current.visible = tipAt !== null;
      if (tipAt) tip.current.position.copy(tipAt);
    }
    if (group.current && !reduced) {
      const t = state.clock.elapsedTime;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.3, 0.06);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.18 + Math.sin(t * 0.6) * 0.03, 0.06);
    }
  });

  return (
    <group ref={group}>
      {strokes.map((s, k) => (
        <mesh key={k} ref={(m) => { meshes.current[k] = m; }} geometry={s.geometry}>
          <meshStandardMaterial vertexColors emissive="#2a1d44" metalness={0.5} roughness={0.3} />
        </mesh>
      ))}
      <group ref={tip} visible={false}>
        <mesh>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <pointLight color={ACCENT_HEX.craft} intensity={4} distance={2.5} />
      </group>
    </group>
  );
}

export default function SignatureScene({ playKey, running, reduced }: { playKey: number; running: boolean; reduced: boolean }) {
  return (
    <Canvas frameloop={running ? "always" : "never"} dpr={[1, 2]} camera={{ fov: 35, position: [0, 0, 6] }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 5]} intensity={1.6} />
      <directionalLight position={[-3, -2, 2]} intensity={0.4} color={ACCENT_HEX.craft} />
      <Writer playKey={playKey} reduced={reduced} />
    </Canvas>
  );
}
