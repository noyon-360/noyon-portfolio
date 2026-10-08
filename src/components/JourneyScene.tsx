"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Line, Stars } from "@react-three/drei";
import { createContext, useContext, useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useTheme } from "@/lib/useTheme";

// The live theme's accents, named for the roles they play in the scene.
type ScenePalette = { BLUE: string; RED: string; AMBER: string; VIOLET: string };
const Palette = createContext<ScenePalette>({ BLUE: "", RED: "", AMBER: "", VIOLET: "" });

type Vec3 = [number, number, number];

// Stations are laid out along a winding path into the scene, one every 16 units.
function stationPositions(count: number): Vec3[] {
  const xs = [0, 10, 0, -10];
  const ys = [0, 0.6, -0.2, 0.5];
  return Array.from({ length: count }, (_, i) => [xs[i % 4], ys[i % 4], -16 * i]);
}

const Y_AXIS = new THREE.Vector3(0, 1, 0);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
// 1 when the camera sits on this station, fading to 0 one station away.
const focusOf = (cursorRef: number, index: number) => clamp01(1 - Math.abs(cursorRef - index));

type StationProps = {
  index: number;
  cursorRef: RefObject<number>;
  reduced: boolean;
  active: boolean;
};

// Labels live in one DOM layer over the canvas. Each Label owns a plain <span> there and
// moves it to its projected 3D position every frame — no extra React roots per label.
const LabelLayer = createContext<RefObject<HTMLDivElement | null> | null>(null);

function Label({ children, position, show }: { children: string; position?: [number, number, number]; show: boolean }) {
  const layerRef = useContext(LabelLayer);
  const anchorRef = useRef<THREE.Group>(null);
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const v = useMemo(() => new THREE.Vector3(), []);

  // Remove the span when the label unmounts.
  useEffect(() => () => {
    spanRef.current?.remove();
    spanRef.current = null;
  }, []);

  useFrame(({ camera, size }) => {
    const anchor = anchorRef.current;
    const layer = layerRef?.current;
    if (!anchor || !layer) return;
    // Created lazily, so it works whichever of the canvas and the layer mounts first.
    if (!spanRef.current) {
      spanRef.current = document.createElement("span");
      spanRef.current.className = "scene-label";
      Object.assign(spanRef.current.style, { position: "absolute", left: "0", top: "0" });
      layer.appendChild(spanRef.current);
    }
    const span = spanRef.current;
    if (span.textContent !== children) span.textContent = children;
    if (span.dataset.show !== String(show)) span.dataset.show = String(show);
    v.setFromMatrixPosition(anchor.matrixWorld).project(camera);
    span.style.visibility = v.z > 1 ? "hidden" : "visible";
    span.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px) translate(-50%, -50%)`;
  });

  return <group ref={anchorRef} position={position} />;
}

function Rig({ stations, progressRef, cursorRef, reduced }: { stations: Vec3[]; progressRef: RefObject<number>; cursorRef: RefObject<number>; reduced: boolean }) {
  const { camera, size } = useThree();
  const v = useMemo(
    () => ({
      a: new THREE.Vector3(),
      b: new THREE.Vector3(),
      station: new THREE.Vector3(),
      pos: new THREE.Vector3(),
      look: new THREE.Vector3(),
      lookNow: new THREE.Vector3(),
    }),
    [],
  );
  const readyRef = useRef(false);

  useFrame((state, dt) => {
    const last = Math.max(1, stations.length - 1);
    const t = progressRef.current * last;
    const i = Math.min(last - 1, Math.floor(t));
    // Dwell on each station, then travel: the "steps" of the journey.
    const eased = THREE.MathUtils.smoothstep(t - i, 0.22, 0.78);

    v.a.set(...stations[i]);
    v.b.set(...stations[Math.min(i + 1, stations.length - 1)]);
    v.station.lerpVectors(v.a, v.b, eased);

    // Desktop: object sits right of the text panel. Mobile: above the bottom panel.
    const mobile = size.width < 768;
    // On narrow screens back off until a ~7-unit-wide station fits, and push it into the top half.
    const halfTan = Math.tan(THREE.MathUtils.degToRad(42 / 2));
    const dist = mobile ? Math.max(14, 3.6 / (halfTan * (size.width / size.height))) : 10.5;
    const ox = mobile ? 0 : -3.1;
    const oy = mobile ? -0.4 * dist * halfTan : 0.2;
    if (state.scene.fog instanceof THREE.Fog) {
      state.scene.fog.near = dist + 1.5;
      state.scene.fog.far = dist + 13.5;
    }
    const px = reduced || mobile ? 0 : state.pointer.x * 0.5;
    const py = reduced || mobile ? 0 : state.pointer.y * 0.3;

    v.look.set(v.station.x + ox, v.station.y + oy, v.station.z);
    v.pos.set(v.look.x + px, v.look.y + 0.6 + py, v.look.z + dist);

    const k = reduced || !readyRef.current ? 1 : 1 - Math.exp(-dt * 4);
    readyRef.current = true;
    camera.position.lerp(v.pos, k);
    v.lookNow.lerp(v.look, k);
    camera.lookAt(v.lookNow);
    cursorRef.current += (i + eased - cursorRef.current) * k;
  });

  return null;
}

function Path({ stations, reduced }: { stations: Vec3[]; reduced: boolean }) {
  const { BLUE, RED, AMBER } = useContext(Palette);
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(stations.map(([x, y, z]) => new THREE.Vector3(x, y - 1.8, z))),
    [stations],
  );
  const points = useMemo(() => curve.getPoints(300), [curve]);
  const packets = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.elapsedTime;
    packets.current.forEach((m, k) => {
      if (m) curve.getPointAt((t * 0.015 + k / 18) % 1, m.position);
    });
  });

  return (
    <group>
      <Line points={points} color="#2b3546" lineWidth={1} transparent opacity={0.8} />
      {Array.from({ length: 18 }, (_, k) => (
        <mesh key={k} ref={(m) => { packets.current[k] = m; }}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial color={[BLUE, RED, AMBER][k % 3]} />
        </mesh>
      ))}
    </group>
  );
}

/* 01 — Flutter client: a phone whose widget tree explodes forward, inside a cloud of 35 apps. */
function PhoneStation({ index, cursorRef, reduced, active }: StationProps) {
  const { BLUE } = useContext(Palette);
  const group = useRef<THREE.Group>(null);
  const cards = useRef<(THREE.Mesh | null)[]>([]);
  const cloud = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const apps = useMemo(() => {
    // Fibonacci sphere: 35 evenly spread points, one per shipped app.
    return Array.from({ length: 35 }, (_, k) => {
      const y = 1 - (k / 34) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = k * Math.PI * (3 - Math.sqrt(5));
      return new THREE.Vector3(Math.cos(a) * r, y * 0.8, Math.sin(a) * r).multiplyScalar(2.9);
    });
  }, []);
  const widgets = [
    { w: 1.3, h: 0.42, x: 0, y: 1.1 },
    { w: 1.3, h: 0.95, x: 0, y: 0.3 },
    { w: 0.6, h: 0.6, x: -0.35, y: -0.6 },
    { w: 0.6, h: 0.6, x: 0.35, y: -0.6 },
    { w: 1.3, h: 0.32, x: 0, y: -1.25 },
  ];

  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.elapsedTime;
    const f = focusOf(cursorRef.current, index);
    if (group.current) group.current.rotation.y = -0.4 + Math.sin(t * 0.4) * 0.12;
    cards.current.forEach((m, k) => {
      if (m) m.position.z = 0.11 + f * (0.22 + k * 0.14);
    });
    const mesh = cloud.current;
    if (mesh) {
      apps.forEach((p, k) => {
        dummy.position.copy(p).applyAxisAngle(Y_AXIS, t * 0.08);
        dummy.rotation.set(t * 0.3 + k, t * 0.2 + k, 0);
        dummy.scale.setScalar(0.001 + f * 0.17);
        dummy.updateMatrix();
        mesh.setMatrixAt(k, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      <group ref={group}>
        <mesh>
          <boxGeometry args={[1.75, 3.45, 0.16]} />
          <meshStandardMaterial color="#121620" metalness={0.6} roughness={0.35} />
          <Edges color="#3a4558" />
        </mesh>
        <mesh position={[0, 0, 0.085]}>
          <planeGeometry args={[1.55, 3.2]} />
          <meshBasicMaterial color="#0a1d2b" />
        </mesh>
        {widgets.map((w, k) => (
          <mesh key={k} ref={(m) => { cards.current[k] = m; }} position={[w.x, w.y, 0.11]}>
            <boxGeometry args={[w.w, w.h, 0.03]} />
            <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={0.35} transparent opacity={0.55 + k * 0.07} />
          </mesh>
        ))}
        <Label show={active} position={[0, 2.05, 0]}>widget tree</Label>
      </group>
      <instancedMesh ref={cloud} args={[undefined, undefined, 35]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={0.6} />
      </instancedMesh>
      <Label show={active} position={[2.2, -1.9, 0]}>35+ apps · Play &amp; App Store</Label>
    </group>
  );
}

/* 02 — Clean Architecture: three layers pull apart, with requests passing through each. */
function ArchitectureStation({ index, cursorRef, reduced, active }: StationProps) {
  const { BLUE } = useContext(Palette);
  const group = useRef<THREE.Group>(null);
  const slabs = useRef<(THREE.Mesh | null)[]>([]);
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const layers = ["Presentation", "Domain", "Data"];

  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.elapsedTime;
    const f = focusOf(cursorRef.current, index);
    const gap = 0.35 + f * 0.75;
    if (group.current) group.current.rotation.y = 0.55 + Math.sin(t * 0.3) * 0.1;
    slabs.current.forEach((m, k) => {
      if (m) m.position.y = (1 - k) * gap;
    });
    packets.current.forEach((m, k) => {
      if (!m) return;
      const u = (t * 0.35 + k / 4) % 1;
      m.position.set(-0.9 + k * 0.6, gap * 1.4 - u * gap * 2.8, 0.2 - (k % 2) * 0.4);
    });
  });

  return (
    <group ref={group} rotation={[0.28, 0, 0]}>
      {layers.map((name, k) => (
        <mesh key={name} ref={(m) => { slabs.current[k] = m; }}>
          <boxGeometry args={[3, 0.14, 2]} />
          <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={0.2 + k * 0.08} transparent opacity={0.16 + k * 0.06} depthWrite={false} />
          <Edges color={BLUE} />
          <Label show={active} position={[2.15, 0, 0]}>{name}</Label>
        </mesh>
      ))}
      {Array.from({ length: 4 }, (_, k) => (
        <mesh key={k} ref={(m) => { packets.current[k] = m; }}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

/* 03 — Offline geo: a sightseeing flight passes landmarks it never lands at; each 300 m geofence
   lights up as the plane crosses it, and the phone plays that landmark's story. */
const GEO_R = 0.45; // 300 m geofence, in scene units

function terrainHeight(x: number, z: number) {
  const volcano = Math.exp(-((x - 1.5) ** 2 + (z + 0.8) ** 2) / 0.35) * 0.9;
  return 0.18 * Math.sin(x * 1.3) + 0.14 * Math.cos(z * 1.7 + x * 0.5) + 0.08 * Math.sin(x * 3.1 + z * 2.3) + volcano;
}

const ROUTE: [number, number][] = [
  [-3.2, 1.3],
  [-1.8, 0.4],
  [-0.4, 0.8],
  [0.9, -0.3],
  [2.2, 0.1],
  [3.2, -1.2],
];
const LANDMARKS: [number, number][] = [
  [-1.6, 0.7],
  [0.1, 0.5],
  [1.5, -0.8],
  [2.6, -0.3],
];
const FLIGHT_Y = 1.6;

function GeoStation({ index, cursorRef, reduced, active }: StationProps) {
  const { BLUE } = useContext(Palette);
  const plane = useRef<THREE.Group>(null);
  const fences = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const rings = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const beacons = useRef<(THREE.Mesh | null)[]>([]);
  const screen = useRef<THREE.MeshBasicMaterial>(null);
  const group = useRef<THREE.Group>(null);

  const terrain = useMemo(() => {
    const g = new THREE.PlaneGeometry(7.4, 4.6, 40, 26);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setY(i, terrainHeight(pos.getX(i), pos.getZ(i)));
    g.computeVertexNormals();
    return g;
  }, []);
  const flight = useMemo(
    () => new THREE.CatmullRomCurve3(ROUTE.map(([x, z]) => new THREE.Vector3(x, FLIGHT_Y + Math.sin(x) * 0.08, z))),
    [],
  );
  const flightPoints = useMemo(() => flight.getPoints(120), [flight]);
  const v = useMemo(() => ({ p: new THREE.Vector3(), next: new THREE.Vector3(), base: new THREE.Color("#0a1d2b"), lit: new THREE.Color(BLUE) }), [BLUE]);

  useFrame(({ clock }) => {
    const t = reduced ? 0.35 : clock.elapsedTime;
    const f = focusOf(cursorRef.current, index);
    if (group.current) group.current.rotation.y = -0.15 + Math.sin(t * 0.2) * 0.08;
    const u = (t * 0.06) % 1;
    flight.getPointAt(u, v.p);
    flight.getPointAt(Math.min(u + 0.01, 1), v.next);
    let inside = false;
    if (plane.current) {
      plane.current.position.copy(v.p);
      if (u < 0.99) plane.current.lookAt(v.next);
    }
    LANDMARKS.forEach(([x, z], k) => {
      const hit = Math.hypot(v.p.x - x, v.p.z - z) <= GEO_R;
      inside ||= hit;
      const fence = fences.current[k];
      if (fence) fence.opacity = (hit ? 0.35 : 0.1) * f;
      const ring = rings.current[k];
      if (ring) ring.opacity = hit ? 1 : 0.45 * f;
      const b = beacons.current[k];
      if (b) b.scale.setScalar(hit ? 1.4 + Math.sin(t * 8) * 0.3 : 1);
    });
    if (screen.current) screen.current.color.lerp(inside ? v.lit : v.base, 0.15);
  });

  return (
    <group ref={group} rotation={[0.5, 0, 0]}>
      <mesh geometry={terrain} position={[0, -0.9, 0]}>
        <meshStandardMaterial color="#1b2536" flatShading roughness={0.9} />
      </mesh>
      <group position={[0, -0.9, 0]}>
        <Line points={flightPoints} color={BLUE} lineWidth={1.2} dashed dashSize={0.12} gapSize={0.08} transparent opacity={0.7} />
        {[ROUTE[0], ROUTE[ROUTE.length - 1]].map(([x, z], k) => (
          <group key={k} position={[x, terrainHeight(x, z), z]}>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
              <meshBasicMaterial color="#e9edf3" />
            </mesh>
            <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.1, 0.16, 24]} />
              <meshBasicMaterial color="#e9edf3" side={THREE.DoubleSide} />
            </mesh>
            <Label show={active} position={[0, 0.7, 0]}>{k ? "destination" : "origin"}</Label>
          </group>
        ))}
        {LANDMARKS.map(([x, z], k) => {
          const y = terrainHeight(x, z);
          return (
            <group key={k} position={[x, y, z]}>
              <mesh ref={(m) => { beacons.current[k] = m; }} position={[0, 0.12, 0]}>
                <octahedronGeometry args={[0.07, 0]} />
                <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={0.8} />
              </mesh>
              <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[GEO_R, 0.012, 6, 48]} />
                <meshBasicMaterial ref={(m) => { rings.current[k] = m; }} color={BLUE} transparent opacity={0.45} />
              </mesh>
              {/* The geofence as a column, so you can see the plane fly through it. */}
              <mesh position={[0, (FLIGHT_Y - y + 0.3) / 2, 0]}>
                <cylinderGeometry args={[GEO_R, GEO_R, FLIGHT_Y - y + 0.3, 32, 1, true]} />
                <meshBasicMaterial ref={(m) => { fences.current[k] = m; }} color={BLUE} transparent opacity={0.07} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
              </mesh>
              {k === 1 && <Label show={active} position={[GEO_R + 0.1, 0.05, 0]}>300 m geofence</Label>}
            </group>
          );
        })}
        <group ref={plane}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.055, 0.34, 4, 10]} />
            <meshStandardMaterial color="#e9edf3" metalness={0.3} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.62, 0.015, 0.12]} />
            <meshStandardMaterial color="#e9edf3" />
          </mesh>
          <mesh position={[0, 0, -0.2]}>
            <boxGeometry args={[0.22, 0.012, 0.07]} />
            <meshStandardMaterial color="#e9edf3" />
          </mesh>
          <mesh position={[0, 0.06, -0.21]}>
            <boxGeometry args={[0.012, 0.11, 0.08]} />
            <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={0.5} />
          </mesh>
        </group>
      </group>
      <group position={[-2.6, 1.3, 1.1]} rotation={[-0.5, 0.35, 0]}>
        <mesh>
          <boxGeometry args={[0.46, 0.92, 0.05]} />
          <meshStandardMaterial color="#14171f" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.027]}>
          <planeGeometry args={[0.4, 0.82]} />
          <meshBasicMaterial ref={screen} color="#0a1d2b" />
        </mesh>
        <Label show={active} position={[0.55, 0.62, 0]}>in range → story plays</Label>
      </group>
      <Label show={active} position={[0.3, -1.45, 2.2]}>offline · on-device GPS + audio</Label>
    </group>
  );
}

/* 04 — Couplio: two phones pair over a QR code; their calorie rings stay in sync through Firestore. */
const RING_DOTS = 28;

// A fixed, QR-like pattern: three finder squares plus a deterministic scatter.
const QR_CELLS = (() => {
  const n = 11;
  const cells: [number, number][] = [];
  const finder = (r: number, c: number) =>
    [[0, 3], [n - 4, n - 1]].some(([a, b]) => r >= a && r <= b && c >= 0 && c <= 3) || (r >= 0 && r <= 3 && c >= n - 4);
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (finder(r, c) ? !(r % 3 === 1 && c % 3 === 1) && !(r === 2 && c === 2) : (r * 7 + c * 13 + r * c) % 5 < 2) {
        cells.push([c - (n - 1) / 2, r - (n - 1) / 2]);
      }
    }
  }
  return cells;
})();

function CoupleStation({ index, cursorRef, reduced, active }: StationProps) {
  const { BLUE, VIOLET } = useContext(Palette);
  const phones = useRef<(THREE.Group | null)[]>([]);
  const dots = useRef<(THREE.MeshBasicMaterial | null)[][]>([[], []]);
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const spark = useRef<THREE.Group>(null);
  const v = useMemo(
    () => ({
      on: new THREE.Color(BLUE),
      partner: new THREE.Color("#3ddc97"),
      off: new THREE.Color("#1d2633"),
      cloud: new THREE.Vector3(0, 1.75, -0.4),
      a: new THREE.Vector3(),
      b: new THREE.Vector3(),
    }),
    [BLUE],
  );

  useFrame(({ clock }) => {
    const t = reduced ? 1.2 : clock.elapsedTime;
    const f = focusOf(cursorRef.current, index);
    const spread = 1.55 + (1 - f) * 1.6;
    const progress = [0.35 + ((t * 0.05) % 0.55), 0.25 + (((t + 4) * 0.045) % 0.6)];
    phones.current.forEach((g, k) => {
      if (!g) return;
      const side = k ? 1 : -1;
      g.position.set(side * spread, Math.sin(t * 0.9 + k) * 0.05, 0);
      dots.current[k].forEach((m, d) => {
        if (m) m.color.copy(d / RING_DOTS < progress[k] ? (k ? v.partner : v.on) : v.off);
      });
    });
    packets.current.forEach((m, k) => {
      if (!m) return;
      const fromLeft = k % 2 === 0;
      const u = (t * 0.45 + k * 0.25) % 1;
      // Up from one phone to Firestore, then down to the other.
      v.a.set((fromLeft ? -1 : 1) * spread, 0.6, 0.1);
      v.b.set((fromLeft ? 1 : -1) * spread, 0.6, 0.1);
      if (u < 0.5) m.position.lerpVectors(v.a, v.cloud, u * 2);
      else m.position.lerpVectors(v.cloud, v.b, (u - 0.5) * 2);
      m.visible = f > 0.3;
    });
    if (spark.current) {
      spark.current.rotation.z = t * 0.8;
      spark.current.scale.setScalar(0.9 + Math.sin(t * 3) * 0.12);
    }
  });

  return (
    <group rotation={[0.12, 0, 0]}>
      {[0, 1].map((k) => (
        <group key={k} ref={(g) => { phones.current[k] = g; }} rotation={[0, k ? -0.35 : 0.35, 0]}>
          <mesh>
            <boxGeometry args={[1.05, 2.1, 0.08]} />
            <meshStandardMaterial color="#14171f" metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.042]}>
            <planeGeometry args={[0.95, 1.95]} />
            <meshBasicMaterial color="#0b1220" />
          </mesh>
          {Array.from({ length: RING_DOTS }, (_, d) => {
            const a = Math.PI / 2 - (d / RING_DOTS) * Math.PI * 2;
            return (
              <mesh key={d} position={[Math.cos(a) * 0.32, 0.35 + Math.sin(a) * 0.32, 0.05]}>
                <circleGeometry args={[0.032, 10]} />
                <meshBasicMaterial ref={(m) => { dots.current[k][d] = m; }} color="#1d2633" />
              </mesh>
            );
          })}
          {[-0.25, -0.45, -0.65].map((y, r) => (
            <mesh key={y} position={[-0.05 * r, y, 0.05]}>
              <planeGeometry args={[0.7 - r * 0.12, 0.09]} />
              <meshBasicMaterial color="#e9edf3" transparent opacity={0.16} />
            </mesh>
          ))}
          <Label show={active} position={[0, -1.3, 0]}>{k ? "partner" : "you"}</Label>
        </group>
      ))}

      <group position={[0, -1.15, 0.5]} rotation={[-1.05, 0, 0]}>
        <mesh>
          <boxGeometry args={[1, 1, 0.04]} />
          <meshStandardMaterial color="#e9edf3" />
        </mesh>
        {QR_CELLS.map(([x, y], i) => (
          <mesh key={i} position={[x * 0.08, y * 0.08, 0.03]}>
            <boxGeometry args={[0.075, 0.075, 0.02]} />
            <meshStandardMaterial color="#0b0d12" />
          </mesh>
        ))}
        <Label show={active} position={[0, -0.7, 0]}>QR pairing</Label>
      </group>

      <group position={v.cloud}>
        {[[0, 0, 0, 0.32], [-0.32, -0.08, 0, 0.22], [0.32, -0.06, 0, 0.24]].map(([x, y, z, r], k) => (
          <mesh key={k} position={[x, y, z]}>
            <icosahedronGeometry args={[r, 1]} />
            <meshStandardMaterial color="#ffb547" emissive="#ffb547" emissiveIntensity={0.35} flatShading />
          </mesh>
        ))}
        <Label show={active} position={[0, 0.6, 0]}>Cloud Firestore · live snapshots</Label>
      </group>
      {[0, 1, 2, 3].map((k) => (
        <mesh key={k} ref={(m) => { packets.current[k] = m; }}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshBasicMaterial color={k % 2 ? "#3ddc97" : BLUE} />
        </mesh>
      ))}

      <group ref={spark} position={[-2.1, 1.4, 0.3]}>
        {[0, Math.PI / 2].map((r) => (
          <mesh key={r} rotation={[0, 0, r]} scale={[0.35, 1, 0.35]}>
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.9} />
          </mesh>
        ))}
      </group>
      <Label show={active} position={[-1.7, 1.9, 0.3]}>Gemini goal message</Label>
    </group>
  );
}

/* 05 — Exodus: book → driver scans the QR → bus streams its location live → pay on arrival. */
const BUS_ROUTE: [number, number][] = [
  [-2.6, 0.9],
  [-1.3, -0.3],
  [0.3, 0.5],
  [1.7, -0.5],
  [2.7, 0.3],
];

function TransitStation({ index, cursorRef, reduced, active }: StationProps) {
  const { BLUE, RED } = useContext(Palette);
  const bus = useRef<THREE.Group>(null);
  const pings = useRef<(THREE.Mesh | null)[]>([]);
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const scanner = useRef<THREE.MeshBasicMaterial>(null);
  const card = useRef<THREE.MeshStandardMaterial>(null);
  const route = useMemo(() => new THREE.CatmullRomCurve3(BUS_ROUTE.map(([x, z]) => new THREE.Vector3(x, 0, z))), []);
  const routePoints = useMemo(() => route.getPoints(120).map((p) => p.clone().setY(0.02)), [route]);
  const v = useMemo(
    () => ({
      p: new THREE.Vector3(),
      next: new THREE.Vector3(),
      phone: new THREE.Vector3(-2.2, 1.55, 0.6),
      paid: new THREE.Color("#3ddc97"),
      unpaid: new THREE.Color("#1d2633"),
    }),
    [],
  );

  useFrame(({ clock }) => {
    const t = reduced ? 3 : clock.elapsedTime;
    const f = focusOf(cursorRef.current, index);
    // Each loop: wait at the first stop (boarding), drive, then wait at the last stop (payment).
    const loop = (t * 0.09) % 1;
    const u = THREE.MathUtils.clamp((loop - 0.12) / 0.7, 0, 1);
    route.getPointAt(u, v.p);
    route.getPointAt(Math.min(u + 0.01, 1), v.next);
    if (bus.current) {
      bus.current.position.set(v.p.x, 0.2, v.p.z);
      if (u < 0.99) bus.current.lookAt(v.next.x, 0.2, v.next.z);
    }
    if (scanner.current) scanner.current.opacity = loop < 0.12 ? (0.35 + Math.abs(Math.sin(t * 9)) * 0.5) * f : 0;
    if (card.current) {
      card.current.emissive.copy(loop > 0.82 ? v.paid : v.unpaid);
      card.current.emissiveIntensity = loop > 0.82 ? 0.8 : 0.1;
    }
    const moving = u > 0 && u < 1;
    pings.current.forEach((m, k) => {
      if (!m) return;
      const w = (t * 0.9 + k / 2) % 1;
      m.position.set(v.p.x, 0.04, v.p.z);
      m.scale.setScalar(0.2 + w * 1.4);
      (m.material as THREE.MeshBasicMaterial).opacity = moving ? (1 - w) * 0.8 * f : 0;
    });
    packets.current.forEach((m, k) => {
      if (!m) return;
      const w = (t * 0.6 + k / 3) % 1;
      m.position.lerpVectors(v.p, v.phone, w);
      m.position.y += Math.sin(w * Math.PI) * 0.5 + 0.3 * (1 - w);
      m.visible = moving && f > 0.2;
    });
  });

  const start = BUS_ROUTE[0];
  const end = BUS_ROUTE[BUS_ROUTE.length - 1];
  return (
    <group rotation={[0.42, -0.1, 0]} position={[-0.45, -0.2, 0]} scale={0.85}>
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.3, 56]} />
        <meshStandardMaterial color="#121621" />
      </mesh>
      <Line points={routePoints} color="#e9edf3" lineWidth={2} transparent opacity={0.35} />
      {BUS_ROUTE.map(([x, z], k) => (
        <mesh key={k} position={[x, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.09, 0.15, 24]} />
          <meshBasicMaterial color={k === 0 || k === BUS_ROUTE.length - 1 ? BLUE : "#8d97a8"} side={THREE.DoubleSide} />
        </mesh>
      ))}

      <group ref={bus}>
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[0.32, 0.3, 0.78]} />
          <meshStandardMaterial color={BLUE} metalness={0.2} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.33, 0.09, 0.7]} />
          <meshStandardMaterial color="#0b1220" />
        </mesh>
        {[-0.25, 0.25].flatMap((z) =>
          [-0.17, 0.17].map((x) => (
            <mesh key={`${x}${z}`} position={[x, -0.1, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.07, 0.07, 0.05, 12]} />
              <meshStandardMaterial color="#14161b" />
            </mesh>
          )),
        )}
      </group>
      {[0, 1].map((k) => (
        <mesh key={k} ref={(m) => { pings.current[k] = m; }} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.35, 0.012, 6, 40]} />
          <meshBasicMaterial color={BLUE} transparent opacity={0} />
        </mesh>
      ))}
      {[0, 1, 2].map((k) => (
        <mesh key={k} ref={(m) => { packets.current[k] = m; }}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshBasicMaterial color={BLUE} />
        </mesh>
      ))}

      <mesh position={[start[0], 0.45, start[1]]}>
        <boxGeometry args={[0.6, 0.9, 0.02]} />
        <meshBasicMaterial ref={scanner} color={RED} transparent opacity={0} depthWrite={false} />
      </mesh>
      <Label show={active} position={[start[0] + 0.1, 1.15, start[1]]}>driver scans QR</Label>

      <group position={v.phone} rotation={[-0.42, 0.3, 0]}>
        <mesh>
          <boxGeometry args={[0.55, 1.05, 0.05]} />
          <meshStandardMaterial color="#14171f" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.05, 0.028]}>
          <planeGeometry args={[0.42, 0.42]} />
          <meshBasicMaterial color="#e9edf3" />
        </mesh>
        {QR_CELLS.map(([x, y], i) => (
          <mesh key={i} position={[x * 0.034, 0.05 + y * 0.034, 0.032]}>
            <planeGeometry args={[0.032, 0.032]} />
            <meshBasicMaterial color="#0b0d12" />
          </mesh>
        ))}
        <Label show={active} position={[0.75, 0.55, 0]}>ticket QR · live bus</Label>
      </group>

      <group position={[end[0] - 0.55, 0.9, end[1] - 0.3]} rotation={[0.2, -0.4, 0]}>
        <mesh>
          <boxGeometry args={[0.62, 0.4, 0.03]} />
          <meshStandardMaterial ref={card} color="#1b2230" emissive="#1d2633" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[-0.17, 0.05, 0.02]}>
          <planeGeometry args={[0.12, 0.09]} />
          <meshBasicMaterial color="#ffb547" />
        </mesh>
        <Label show={active} position={[-0.25, 0.5, 0]}>pay on arrival · Stripe</Label>
      </group>
      <Label show={active} position={[0.3, 0.9, 0.5]}>Socket.IO · live location</Label>
    </group>
  );
}

/* 06 — AzloTV: a TV resumes an episode, posters circle in a carousel, reels swipe up on a phone. */
const POSTERS = ["#ff4d6d", "#4cc2ff", "#ffb547", "#b48cff", "#3ddc97", "#ff8a3d", "#e9edf3", "#4cc2ff"];

function TvStation({ index, cursorRef, reduced, active }: StationProps) {
  const { RED } = useContext(Palette);
  const carousel = useRef<THREE.Group>(null);
  const bar = useRef<THREE.Mesh>(null);
  const reels = useRef<(THREE.Mesh | null)[]>([]);
  const reelMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const colors = useMemo(() => POSTERS.map((c) => new THREE.Color(c)), []);
  const TV_W = 2.5;

  useFrame(({ clock }) => {
    const t = reduced ? 2 : clock.elapsedTime;
    const f = focusOf(cursorRef.current, index);
    if (carousel.current) {
      carousel.current.rotation.y = t * 0.22;
      carousel.current.scale.setScalar(0.6 + 0.4 * f);
    }
    if (bar.current) {
      // Playback resumes at 35% (the saved position) and runs to the end.
      const w = 0.35 + ((t * 0.05) % 1) * 0.65;
      bar.current.scale.x = w;
      bar.current.position.x = -TV_W / 2 + (TV_W * w) / 2;
    }
    // Reels: every few seconds the current reel swipes up and the next slides in.
    const cycle = t * 0.3;
    const phase = cycle % 1;
    const s = THREE.MathUtils.smoothstep(phase, 0.7, 1);
    const n = Math.floor(cycle);
    reels.current.forEach((m, k) => {
      if (!m) return;
      m.position.y = k === 0 ? s * 0.95 : -0.95 + s * 0.95;
      const mat = reelMats.current[k];
      if (mat) {
        mat.opacity = k === 0 ? 1 - s : s;
        mat.color.copy(colors[(n + k) % colors.length]);
        mat.emissive.copy(mat.color);
      }
    });
  });

  return (
    <group rotation={[0.12, 0, 0]}>
      <group position={[-0.4, 0.75, -0.6]}>
        <mesh>
          <boxGeometry args={[TV_W + 0.12, 1.5, 0.08]} />
          <meshStandardMaterial color="#14171f" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.03, 0.045]}>
          <planeGeometry args={[TV_W, 1.36]} />
          <meshBasicMaterial color="#0d2236" />
        </mesh>
        <mesh position={[0.05, 0.08, 0.05]}>
          <circleGeometry args={[0.28, 3]} />
          <meshBasicMaterial color="#e9edf3" transparent opacity={0.85} />
        </mesh>
        <mesh position={[0, -0.6, 0.05]}>
          <planeGeometry args={[TV_W, 0.04]} />
          <meshBasicMaterial color="#2b3546" />
        </mesh>
        <mesh ref={bar} position={[0, -0.6, 0.055]}>
          <planeGeometry args={[TV_W, 0.04]} />
          <meshBasicMaterial color={RED} />
        </mesh>
        <mesh position={[-TV_W / 2 + TV_W * 0.35, -0.6, 0.06]}>
          <circleGeometry args={[0.045, 16]} />
          <meshBasicMaterial color="#e9edf3" />
        </mesh>
        <Label show={active} position={[-TV_W / 2 + TV_W * 0.35, -0.85, 0]}>resume where you stopped</Label>
        <Label show={active} position={[0, 1.0, 0]}>series · season & episode</Label>
      </group>

      <group ref={carousel} position={[-0.4, -0.75, 0.2]}>
        {POSTERS.map((c, k) => {
          const a = (k / POSTERS.length) * Math.PI * 2;
          return (
            <mesh key={k} position={[Math.sin(a) * 1.55, 0, Math.cos(a) * 1.55]} rotation={[0, a, 0]}>
              <boxGeometry args={[0.42, 0.62, 0.02]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.25} transparent opacity={0.85} />
            </mesh>
          );
        })}
      </group>

      <group position={[1.85, 0.1, 0.5]} rotation={[0, -0.35, 0]}>
        <mesh>
          <boxGeometry args={[0.62, 1.2, 0.05]} />
          <meshStandardMaterial color="#14171f" metalness={0.5} roughness={0.3} />
        </mesh>
        {[0, 1].map((k) => (
          <mesh key={k} ref={(m) => { reels.current[k] = m; }} position={[0, 0, 0.03 + k * 0.002]}>
            <planeGeometry args={[0.52, 0.9]} />
            <meshStandardMaterial ref={(m) => { reelMats.current[k] = m; }} color="#4cc2ff" emissiveIntensity={0.3} transparent />
          </mesh>
        ))}
        <Label show={active} position={[0, 0.85, 0]}>reels feed</Label>
        <Label show={active} position={[-0.3, -0.85, 0]}>live search · Socket.IO</Label>
      </group>
    </group>
  );
}

/* 07 — CosmoQuest: planets orbit a star; the ones inside the habitable zone glow green. */
const HZ = [1.2, 1.75];
const ORBITS = [
  { r: 0.8, size: 0.08 },
  { r: 1.35, size: 0.12 },
  { r: 1.62, size: 0.1 },
  { r: 2.15, size: 0.16 },
  { r: 2.6, size: 0.13 },
];

function CosmoStation({ index, cursorRef, reduced, active }: StationProps) {
  const { BLUE, AMBER, VIOLET } = useContext(Palette);
  const planets = useRef<(THREE.Mesh | null)[]>([]);
  const band = useRef<THREE.MeshBasicMaterial>(null);
  const halo = useRef<THREE.Mesh>(null);
  const podium = useRef<(THREE.Mesh | null)[]>([]);
  const orbitLines = useMemo(
    () =>
      ORBITS.map(({ r }) =>
        Array.from({ length: 65 }, (_, i) => {
          const a = (i / 64) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r);
        }),
      ),
    [],
  );

  useFrame(({ clock }) => {
    const t = reduced ? 4 : clock.elapsedTime;
    const f = focusOf(cursorRef.current, index);
    planets.current.forEach((m, k) => {
      if (!m) return;
      const { r } = ORBITS[k];
      const a = t * 0.9 * Math.pow(r, -1.5) + k * 1.7; // inner planets orbit faster
      m.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    });
    if (band.current) band.current.opacity = 0.08 + 0.2 * f;
    if (halo.current) halo.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    podium.current.forEach((m, k) => {
      if (!m) return;
      const h = [0.75, 1.05, 0.55][k] * (0.25 + 0.75 * f);
      m.scale.y = h;
      m.position.y = h / 2;
    });
  });

  return (
    <group>
      <group rotation={[0.5, 0, -0.08]}>
        <mesh>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshStandardMaterial color="#ffb547" emissive="#ff8a3d" emissiveIntensity={1.4} />
        </mesh>
        <mesh ref={halo}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshBasicMaterial color="#ffb547" transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[HZ[0], HZ[1], 96]} />
          <meshBasicMaterial ref={band} color={GREEN} transparent opacity={0.2} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        {orbitLines.map((pts, k) => (
          <Line key={k} points={pts} color="#2b3546" lineWidth={1} />
        ))}
        {ORBITS.map(({ r, size }, k) => {
          const habitable = r >= HZ[0] && r <= HZ[1];
          return (
            <mesh key={k} ref={(m) => { planets.current[k] = m; }}>
              <sphereGeometry args={[size, 24, 24]} />
              <meshStandardMaterial
                color={habitable ? GREEN : "#8fa6c9"}
                emissive={habitable ? GREEN : "#1d2633"}
                emissiveIntensity={habitable ? 0.7 : 0.2}
              />
            </mesh>
          );
        })}
        <Label show={active} position={[HZ[1] + 0.1, 0, 0.6]}>habitable zone</Label>
        <Label show={active} position={[0, 0.75, 0]}>Exoplanet Archive · live</Label>
      </group>

      <group position={[-2.7, 1.25, 0.2]} rotation={[0, 0.35, 0.04]}>
        <mesh>
          <boxGeometry args={[1.05, 0.75, 0.04]} />
          <meshStandardMaterial color="#e9edf3" />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[0.95, 0.65]} />
          <meshBasicMaterial color="#1b1640" />
        </mesh>
        <mesh position={[0.15, 0.06, 0.03]}>
          <circleGeometry args={[0.2, 32]} />
          <meshBasicMaterial color="#ff8a4c" />
        </mesh>
        <mesh position={[-0.25, -0.15, 0.03]}>
          <circleGeometry args={[0.07, 24]} />
          <meshBasicMaterial color="#8fa6c9" />
        </mesh>
        <Label show={active} position={[0, 0.6, 0]}>NASA APOD</Label>
      </group>

      <group position={[1.95, -1.35, 1.0]} rotation={[0.1, -0.4, 0]} scale={0.85}>
        {[-0.34, 0, 0.34].map((x, k) => (
          <mesh key={x} ref={(m) => { podium.current[k] = m; }} position={[x, 0, 0]}>
            <boxGeometry args={[0.3, 1, 0.3]} />
            <meshStandardMaterial color={[BLUE, AMBER, VIOLET][k]} emissive={[BLUE, AMBER, VIOLET][k]} emissiveIntensity={0.3} />
          </mesh>
        ))}
        <Label show={active} position={[-0.4, -0.3, 0.3]}>quizzes · leaderboards</Label>
      </group>
    </group>
  );
}

/* 08 — NestJS backend: 25 modules under a rotating auth guard. */
function BackendStation({ index, cursorRef, reduced, active }: StationProps) {
  const { RED } = useContext(Palette);
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const cubes = useRef<(THREE.Mesh | null)[]>([]);
  const drops = useRef<(THREE.Mesh | null)[]>([]);
  const modules = useMemo(
    () =>
      Array.from({ length: 25 }, (_, k) => ({
        x: ((k % 5) - 2) * 0.62,
        z: (Math.floor(k / 5) - 2) * 0.62,
        h: 0.35 + ((k * 37) % 7) / 8,
        hot: [2, 6, 12, 18, 22].includes(k),
      })),
    [],
  );
  const hot = modules.filter((m) => m.hot);

  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.elapsedTime;
    const f = focusOf(cursorRef.current, index);
    if (group.current) group.current.rotation.y = 0.6 + t * 0.06;
    if (ring.current) ring.current.rotation.z = t * 0.5;
    cubes.current.forEach((m, k) => {
      if (!m) return;
      const h = modules[k].h * (0.25 + 0.75 * f) + Math.sin(t * 1.4 + k) * 0.04;
      m.scale.y = h;
      m.position.y = -0.9 + h / 2;
    });
    drops.current.forEach((m, k) => {
      if (!m) return;
      const u = (t * 0.45 + k / hot.length) % 1;
      m.position.set(hot[k].x, 2.3 - u * 2.6, hot[k].z);
      m.visible = f > 0.05;
    });
  });

  return (
    <group ref={group} rotation={[0.18, 0, 0]}>
      {modules.map((m, k) => (
        <mesh key={k} ref={(el) => { cubes.current[k] = el; }} position={[m.x, 0, m.z]}>
          <boxGeometry args={[0.46, 1, 0.46]} />
          <meshStandardMaterial
            color={m.hot ? RED : "#2b3445"}
            emissive={m.hot ? RED : "#4cc2ff"}
            emissiveIntensity={m.hot ? 0.5 : 0.04}
            metalness={0.3}
            roughness={0.5}
          />
        </mesh>
      ))}
      <mesh ref={ring} position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.025, 8, 96]} />
        <meshBasicMaterial color={RED} />
      </mesh>
      <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.75, 0.008, 6, 96]} />
        <meshBasicMaterial color={RED} transparent opacity={0.5} />
      </mesh>
      {hot.map((_, k) => (
        <mesh key={k} ref={(el) => { drops.current[k] = el; }}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      <Label show={active} position={[0, 1.45, 0]}>JWT · role guards</Label>
      <Label show={active} position={[0, -1.35, 1.9]}>25 modules</Label>
    </group>
  );
}

/* 09 — ML security (thesis): packets → flow features → Random Forest → benign or attack alert. */
const SEC_PACKETS = 16;
const GREEN = "#3ddc97";

function SecurityStation({ index, cursorRef, reduced, active }: StationProps) {
  const { RED } = useContext(Palette);
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const columns = useRef<(THREE.Mesh | null)[]>([]);
  const alarm = useRef<THREE.Mesh>(null);
  const alarmMat = useRef<THREE.MeshStandardMaterial>(null);
  const trees = useMemo(
    () =>
      Array.from({ length: 7 }, (_, k) => {
        const a = (k / 7) * Math.PI * 2;
        const r = k ? 0.42 : 0;
        return { x: 0.7 + Math.cos(a) * r, z: Math.sin(a) * r, h: 0.55 + ((k * 5) % 3) * 0.12 };
      }),
    [],
  );
  const v = useMemo(
    () => ({
      white: new THREE.Color("#e9edf3"),
      green: new THREE.Color(GREEN),
      red: new THREE.Color(RED),
      p: new THREE.Vector3(),
      a: new THREE.Vector3(),
      b: new THREE.Vector3(),
      extractor: new THREE.Vector3(-1.2, 0, 0),
      forest: new THREE.Vector3(0.7, 0.2, 0),
      benign: new THREE.Vector3(2.7, 0.75, 0),
      attack: new THREE.Vector3(2.7, -0.75, 0),
    }),
    [RED],
  );

  useFrame(({ clock }) => {
    const t = reduced ? 0.5 : clock.elapsedTime;
    const f = focusOf(cursorRef.current, index);
    let alert = 0;
    packets.current.forEach((m, k) => {
      if (!m) return;
      const isAttack = k % 4 === 1 || k % 7 === 3;
      const u = (t * 0.16 + k / SEC_PACKETS) % 1;
      const lane = ((k % 3) - 1) * 0.35;
      if (u < 0.35) {
        v.a.set(-3.1, lane, 0);
        m.position.lerpVectors(v.a, v.extractor, u / 0.35);
      } else if (u < 0.65) {
        m.position.lerpVectors(v.extractor, v.forest, (u - 0.35) / 0.3);
      } else {
        const w = (u - 0.65) / 0.35;
        m.position.lerpVectors(v.forest, isAttack ? v.attack : v.benign, w);
        if (isAttack && w > 0.85) alert = Math.max(alert, (w - 0.85) / 0.15);
      }
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.color.copy(u < 0.65 ? v.white : isAttack ? v.red : v.green);
      m.visible = f > 0.05;
    });
    columns.current.forEach((m, k) => {
      if (m) m.scale.y = 0.35 + Math.abs(Math.sin(t * 2 + k * 0.9)) * 0.65 * (0.3 + 0.7 * f);
    });
    if (alarm.current) {
      alarm.current.rotation.y = t * 0.8;
      alarm.current.scale.setScalar(1 + alert * 0.45);
    }
    if (alarmMat.current) alarmMat.current.emissiveIntensity = 0.3 + alert * 2.2;
  });

  return (
    <group position={[-0.45, 0, 0]} rotation={[0.1, -0.2, 0]} scale={0.88}>
      {[-0.35, 0, 0.35].map((y) => (
        <Line key={y} points={[[-3.1, y, 0], [-1.6, y, 0]]} color="#2b3546" lineWidth={1} />
      ))}
      <mesh position={v.extractor}>
        <boxGeometry args={[0.8, 1.3, 0.5]} />
        <meshStandardMaterial color="#121722" transparent opacity={0.6} />
        <Edges color={RED} />
      </mesh>
      {Array.from({ length: 6 }, (_, k) => (
        <mesh key={k} ref={(m) => { columns.current[k] = m; }} position={[-1.45 + k * 0.1, 0, 0.26]}>
          <boxGeometry args={[0.05, 1, 0.02]} />
          <meshBasicMaterial color={RED} transparent opacity={0.85} />
        </mesh>
      ))}
      {trees.map((tr, k) => (
        <group key={k} position={[tr.x, -0.45, tr.z]}>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.24, 6]} />
            <meshStandardMaterial color="#6b5a48" />
          </mesh>
          <mesh position={[0, 0.24 + tr.h / 2, 0]}>
            <coneGeometry args={[0.18, tr.h, 7]} />
            <meshStandardMaterial color="#2e8a62" emissive={GREEN} emissiveIntensity={0.15} flatShading />
          </mesh>
        </group>
      ))}
      <mesh position={v.benign} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.32, 0.03, 8, 40]} />
        <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={alarm} position={v.attack}>
        <octahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial ref={alarmMat} color={RED} emissive={RED} emissiveIntensity={0.3} flatShading />
      </mesh>
      {Array.from({ length: SEC_PACKETS }, (_, k) => (
        <mesh key={k} ref={(m) => { packets.current[k] = m; }}>
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshBasicMaterial color="#e9edf3" />
        </mesh>
      ))}
      <Label show={active} position={[-2.6, 0.75, 0]}>live packets · Scapy</Label>
      <Label show={active} position={[-1.2, 0.95, 0]}>78 flow features</Label>
      <Label show={active} position={[0.7, 0.75, 0]}>Random Forest</Label>
      <Label show={active} position={[2.7, 1.25, 0]}>BENIGN</Label>
      <Label show={active} position={[2.7, -1.25, 0]}>attack → alert</Label>
    </group>
  );
}

/* 10 — Media pipeline: upload → queue → ffmpeg → four HLS renditions. */
function StreamingStation({ index, cursorRef, reduced, active }: StationProps) {
  const { RED } = useContext(Palette);
  const jobs = useRef<(THREE.Mesh | null)[]>([]);
  const core = useRef<THREE.Mesh>(null);
  const bars = useRef<(THREE.Mesh | null)[]>([]);
  const heights = [1.9, 1.45, 1.0, 0.6];

  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.elapsedTime;
    const f = focusOf(cursorRef.current, index);
    jobs.current.forEach((m, k) => {
      if (!m) return;
      const u = (t * 0.3 + k / 6) % 1;
      m.position.x = -1.95 + u * 1.9;
      m.scale.setScalar(Math.sin(u * Math.PI) * 0.9 + 0.1);
    });
    if (core.current) {
      core.current.rotation.x = t * 0.7;
      core.current.rotation.y = t * 0.9;
    }
    bars.current.forEach((m, k) => {
      if (!m) return;
      const h = heights[k] * (0.12 + 0.88 * f);
      m.scale.y = h;
      m.position.y = -0.7 + h / 2;
    });
  });

  return (
    <group rotation={[0.12, -0.3, 0]}>
      <mesh position={[-2.65, -0.05, 0]}>
        <boxGeometry args={[0.95, 1.3, 0.95]} />
        <meshStandardMaterial color="#161b26" metalness={0.4} roughness={0.5} />
        <Edges color={RED} />
      </mesh>
      {Array.from({ length: 6 }, (_, k) => (
        <mesh key={k} ref={(m) => { jobs.current[k] = m; }} position={[0, -0.45, 0]}>
          <boxGeometry args={[0.22, 0.22, 0.22]} />
          <meshStandardMaterial color={RED} emissive={RED} emissiveIntensity={0.4} />
        </mesh>
      ))}
      <mesh ref={core} position={[0.45, 0.05, 0]}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color={RED} emissive={RED} emissiveIntensity={0.6} flatShading />
      </mesh>
      {heights.map((_, k) => (
        <mesh key={k} ref={(m) => { bars.current[k] = m; }} position={[1.45 + k * 0.42, 0, 0]}>
          <boxGeometry args={[0.28, 1, 0.28]} />
          <meshStandardMaterial color={RED} emissive={RED} emissiveIntensity={0.35} transparent opacity={1 - k * 0.18} />
        </mesh>
      ))}
      <Label show={active} position={[-2.65, 0.95, 0]}>stream → S3</Label>
      <Label show={active} position={[-1, -0.95, 0]}>BullMQ</Label>
      <Label show={active} position={[0.45, 0.95, 0]}>ffmpeg</Label>
      <Label show={active} position={[2.1, 1.55, 0]}>HLS ×4</Label>
    </group>
  );
}

/* 11 — Release: a build travels through CI gates to the stores. */
function ReleaseStation({ index, cursorRef, reduced, active }: StationProps) {
  const { AMBER } = useContext(Palette);
  const capsule = useRef<THREE.Mesh>(null);
  const gates = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const gateX = [-1.5, 0, 1.5];
  const names = ["GitHub Actions", "Codemagic", "Shorebird OTA"];
  const track = useMemo(() => [new THREE.Vector3(-2.8, 0, 0), new THREE.Vector3(2.8, 0, 0)], []);

  useFrame(({ clock }) => {
    const t = reduced ? 0.45 : clock.elapsedTime;
    const f = focusOf(cursorRef.current, index);
    const x = -2.7 + ((t * 0.35) % 1) * 5.4;
    if (capsule.current) capsule.current.position.x = x;
    gates.current.forEach((mat, k) => {
      if (mat) mat.emissiveIntensity = 0.2 + f * 0.3 + 2.2 * clamp01(1 - Math.abs(x - gateX[k]) * 1.4);
    });
  });

  return (
    <group position={[-0.5, 0, 0]} rotation={[0.15, -0.65, 0]}>
      <Line points={track} color={AMBER} lineWidth={1} dashed dashSize={0.12} gapSize={0.08} transparent opacity={0.6} />
      {gateX.map((x, k) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.75, 0.045, 12, 64]} />
          <meshStandardMaterial ref={(m) => { gates.current[k] = m; }} color={AMBER} emissive={AMBER} emissiveIntensity={0.3} />
          {/* Alternate above/below so neighbouring labels never collide on narrow screens. */}
          <Label show={active} position={[0, k % 2 ? -1.1 : 1.1, 0]}>{names[k]}</Label>
        </mesh>
      ))}
      <mesh ref={capsule} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.15, 0.45, 6, 12]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>
      {[-0.55, 0.55].map((z, k) => (
        <mesh key={z} position={[2.9, -0.55, z]}>
          <cylinderGeometry args={[0.38, 0.38, 0.1, 32]} />
          <meshStandardMaterial color="#1b1f29" emissive={AMBER} emissiveIntensity={0.15} />
          <Label show={active} position={[0, k ? -0.4 : 0.4, 0]}>{k ? "App Store" : "Google Play"}</Label>
        </mesh>
      ))}
    </group>
  );
}

/* 12 — Hardware: the waiter robot, built from the real blueprint (inches), assembling as you arrive. */
const INCH = 0.3;

function chassisShape() {
  // Outline from the hand-drawn "Waiter Robot" blueprint: 7.5" body, 1.7" arcs, 1.15" × 3" wheel notches.
  const s = new THREE.Shape();
  s.moveTo(-3.75, 3.6);
  s.quadraticCurveTo(0, 7, 3.75, 3.6);
  s.lineTo(3.75, 0.5);
  s.lineTo(2.6, 0.5);
  s.lineTo(2.6, -2.5);
  s.lineTo(3.75, -2.5);
  s.lineTo(3.75, -3.5);
  s.quadraticCurveTo(0, -6.9, -3.75, -3.5);
  s.lineTo(-3.75, -2.5);
  s.lineTo(-2.6, -2.5);
  s.lineTo(-2.6, 0.5);
  s.lineTo(-3.75, 0.5);
  s.closePath();
  return s;
}

// Parts in blueprint coordinates: x across, y forward, z up (inches).
const ROBOT_PARTS: { size: [number, number, number]; at: [number, number, number]; color: string; metal?: boolean }[] = [
  { size: [5.4, 1.9, 0.35], at: [0, 1.2, 0.48], color: "#e8e6df" }, // breadboard
  { size: [2.7, 2.1, 0.18], at: [0.9, 1.2, 0.74], color: "#1e6aa8" }, // Arduino UNO
  { size: [1.7, 1.7, 0.15], at: [-1.7, 1.2, 0.73], color: "#c4372f" }, // L298N
  { size: [0.6, 1.2, 0.9], at: [-1.2, 1.2, 1.25], color: "#14161b", metal: true }, // heatsink
  { size: [1.4, 0.6, 0.1], at: [2.3, 2.45, 0.72], color: "#2b5bd0" }, // Bluetooth module
  { size: [1.0, 1.8, 0.65], at: [0.4, -1.4, 0.63], color: "#c8d43a" }, // 9V battery
  { size: [1.0, 1.8, 0.65], at: [1.5, -1.4, 0.63], color: "#c8d43a" }, // 9V battery
  { size: [2.2, 0.12, 1.6], at: [0, 4.15, 1.1], color: "#c79b67" }, // sonar mount
  { size: [0.5, 0.9, 0.12], at: [-2.9, 3.3, 0.36], color: "#24408f" }, // IR sensor
  { size: [0.5, 0.9, 0.12], at: [2.9, 3.3, 0.36], color: "#24408f" }, // IR sensor
];

const WIRES: { from: [number, number, number]; to: [number, number, number]; color: string }[] = [
  { from: [0.2, 1.9, 0.85], to: [-1.7, 1.6, 0.85], color: "#ff8a3d" },
  { from: [0.6, 1.9, 0.85], to: [2.3, 2.45, 0.8], color: "#ffd23d" },
  { from: [1.2, 2.2, 0.85], to: [0, 4.1, 1.7], color: "#3ddc97" },
  { from: [-0.2, 2.2, 0.85], to: [-2.9, 3.3, 0.45], color: "#b48cff" },
  { from: [1.8, 2.2, 0.85], to: [2.9, 3.3, 0.45], color: "#ff4d6d" },
];

function HardwareStation({ index, cursorRef, reduced, active }: StationProps) {
  const { BLUE, VIOLET } = useContext(Palette);
  const body = useRef<THREE.Group>(null);
  const parts = useRef<(THREE.Mesh | null)[]>([]);
  const wires = useRef<THREE.Group>(null);
  const wheels = useRef<(THREE.Group | null)[]>([]);
  const pings = useRef<(THREE.Mesh | null)[]>([]);
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const shape = useMemo(() => chassisShape(), []);
  const wirePoints = useMemo(
    () =>
      WIRES.map(({ from, to }) => {
        const a = new THREE.Vector3(...from);
        const b = new THREE.Vector3(...to);
        const mid = a.clone().lerp(b, 0.5);
        mid.z += 1.4;
        return new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(20);
      }),
    [],
  );
  // Phone and Bluetooth module in the outer (unscaled) frame, for the command packets.
  const phone = useMemo(() => new THREE.Vector3(-1.8, 1.3, 0.8), []);
  const bt = useMemo(() => new THREE.Vector3(2.3 * INCH, 0.72 * INCH, -2.45 * INCH), []);
  const btNow = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.elapsedTime;
    const f = focusOf(cursorRef.current, index);
    // Front (sonar) turned three-quarters toward the camera.
    const heading = 2.55 + Math.sin(t * 0.35) * 0.25;
    if (body.current) body.current.rotation.y = heading;
    btNow.copy(bt).applyAxisAngle(Y_AXIS, heading);
    parts.current.forEach((m, k) => {
      if (m) m.position.z = ROBOT_PARTS[k].at[2] + (1 - f) * (3 + k * 0.6);
    });
    if (wires.current) wires.current.visible = f > 0.8;
    wheels.current.forEach((w) => {
      if (w) w.rotation.x = -t * 2;
    });
    pings.current.forEach((m, k) => {
      if (!m) return;
      const u = (t * 0.6 + k / 2) % 1;
      m.position.y = 4.5 + u * 4;
      m.scale.setScalar(0.4 + u * 1.6);
      (m.material as THREE.MeshBasicMaterial).opacity = (1 - u) * f;
    });
    packets.current.forEach((m, k) => {
      if (!m) return;
      const u = (t * 0.5 + k / 3) % 1;
      m.position.lerpVectors(phone, btNow, u);
      m.position.y += Math.sin(u * Math.PI) * 0.6;
      m.visible = f > 0.05;
    });
  });

  return (
    // Tilted toward the camera so the top of the build reads clearly.
    <group rotation={[0.35, 0, 0]} scale={1.3}>
      <group ref={body}>
        <mesh position={[0, -0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.6, 48]} />
          <meshStandardMaterial color="#121621" />
        </mesh>
        <mesh position={[0, -0.33, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.07, 3.4]} />
          <meshBasicMaterial color={VIOLET} transparent opacity={0.6} />
        </mesh>

        <group rotation={[-Math.PI / 2, 0, 0]} scale={INCH}>
          <mesh>
            <extrudeGeometry args={[shape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 }]} />
            <meshStandardMaterial color="#a87447" roughness={0.85} />
          </mesh>
          {[-1, 1].map((side, k) => (
            <group key={side} ref={(g) => { wheels.current[k] = g; }} position={[side * 3.175, -1, 0.15]}>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[1.25, 1.25, 0.6, 28]} />
                <meshStandardMaterial color="#1a1c22" roughness={0.9} />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.65, 0.65, 0.64, 6]} />
                <meshStandardMaterial color="#2f6fe0" metalness={0.5} roughness={0.3} />
              </mesh>
            </group>
          ))}
          {ROBOT_PARTS.map((p, k) => (
            <mesh key={k} ref={(m) => { parts.current[k] = m; }} position={p.at}>
              <boxGeometry args={p.size} />
              <meshStandardMaterial color={p.color} metalness={p.metal ? 0.6 : 0.1} roughness={p.metal ? 0.35 : 0.6} />
            </mesh>
          ))}
          {[-0.55, 0.55].map((x) => (
            <mesh key={x} position={[x, 4.35, 1.2]}>
              <cylinderGeometry args={[0.32, 0.32, 0.45, 20]} />
              <meshStandardMaterial color="#c9ced6" metalness={0.8} roughness={0.25} />
            </mesh>
          ))}
          {[0, 1].map((k) => (
            <mesh key={k} ref={(m) => { pings.current[k] = m; }} position={[0, 4.5, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.6, 0.04, 6, 40]} />
              <meshBasicMaterial color={VIOLET} transparent opacity={0} />
            </mesh>
          ))}
          <group ref={wires}>
            {wirePoints.map((pts, k) => (
              <Line key={k} points={pts} color={WIRES[k].color} lineWidth={1.5} />
            ))}
          </group>
          <Label show={active} position={[1.6, 0.4, 1.3]}>Arduino UNO</Label>
          <Label show={active} position={[-2.4, 1.6, 2.7]}>L298N driver</Label>
          <Label show={active} position={[0, 4.6, 3.8]}>HC-SR04 sonar</Label>
      </group>
      </group>

      <Label show={active} position={[0, -1.1, 1.4]}>plywood chassis · my blueprint</Label>
      <group position={phone} rotation={[0, 0.35, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 1, 0.06]} />
          <meshStandardMaterial color="#14171f" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[0.42, 0.88]} />
          <meshBasicMaterial color={BLUE} transparent opacity={0.65} />
        </mesh>
        <Label show={active} position={[0.7, 0.8, 0]}>Flutter app · Bluetooth</Label>
      </group>
      {[0, 1, 2].map((k) => (
        <mesh key={k} ref={(m) => { packets.current[k] = m; }}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshBasicMaterial color={BLUE} />
        </mesh>
      ))}
    </group>
  );
}

/* 13 — Design: a poster splits into its layers over the golden-ratio grid it was composed on. */
const PHI = (1 + Math.sqrt(5)) / 2;

function goldenGrid(height: number) {
  let w = height * PHI;
  let h = height;
  let x = -w / 2;
  let y = -h / 2;
  const edges: number[] = [];
  const spiral: THREE.Vector3[] = [];
  const square = (sx: number, sy: number, s: number) => {
    const c = [[sx, sy], [sx + s, sy], [sx + s, sy + s], [sx, sy + s]];
    c.forEach((p, k) => {
      const q = c[(k + 1) % 4];
      edges.push(p[0], p[1], 0, q[0], q[1], 0);
    });
  };
  const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
    for (let k = 0; k <= 16; k++) {
      const a = a0 + ((a1 - a0) * k) / 16;
      spiral.push(new THREE.Vector3(cx + r * Math.cos(a), cy + r * Math.sin(a), 0));
    }
  };
  // Cut a square off the left, top, right, bottom in turn; a quarter arc in each square traces the spiral.
  for (let i = 0; i < 10; i++) {
    const dir = i % 4;
    if (dir === 0) {
      const s = h;
      square(x, y, s);
      arc(x + s, y, s, Math.PI, Math.PI / 2);
      x += s;
      w -= s;
    } else if (dir === 1) {
      const s = w;
      square(x, y + h - s, s);
      arc(x, y + h - s, s, Math.PI / 2, 0);
      h -= s;
    } else if (dir === 2) {
      const s = h;
      square(x + w - s, y, s);
      arc(x + w - s, y + h, s, 0, -Math.PI / 2);
      w -= s;
    } else {
      const s = w;
      square(x, y, s);
      arc(x + s, y + s, s, -Math.PI / 2, -Math.PI);
      y += s;
      h -= s;
    }
  }
  return { edges: new Float32Array(edges), spiral, eye: new THREE.Vector3(x + w / 2, y + h / 2, 0) };
}

function DesignStation({ index, cursorRef, reduced, active }: StationProps) {
  const { VIOLET } = useContext(Palette);
  const H = 2.3;
  const W = H * PHI;
  const group = useRef<THREE.Group>(null);
  const layers = useRef<(THREE.Group | null)[]>([]);
  const pen = useRef<THREE.Group>(null);
  const grid = useMemo(() => goldenGrid(H), []);

  useFrame(({ clock }) => {
    const t = reduced ? 0.6 : clock.elapsedTime;
    const f = focusOf(cursorRef.current, index);
    const gap = 0.06 + f * 0.6;
    if (group.current) group.current.rotation.y = -0.5 + Math.sin(t * 0.3) * 0.12;
    layers.current.forEach((g, k) => {
      if (g) g.position.z = k * gap;
    });
    if (pen.current) {
      const pts = grid.spiral;
      const p = pts[Math.floor(((t * 0.08) % 1) * (pts.length - 1))];
      pen.current.position.set(p.x, p.y, 2 * gap + 0.02);
    }
  });

  return (
    <group ref={group}>
      <group ref={(g) => { layers.current[0] = g; }}>
        <mesh>
          <boxGeometry args={[W + 0.3, H + 0.3, 0.04]} />
          <meshStandardMaterial color="#161a3c" emissive="#1d1757" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, -H / 2 + 0.25, 0.03]}>
          <boxGeometry args={[W + 0.3, 0.5, 0.02]} />
          <meshStandardMaterial color="#c4502e" emissive="#c4502e" emissiveIntensity={0.35} />
        </mesh>
        <Label show={active} position={[-W / 2 - 0.1, -H / 2 - 0.35, 0]}>Ps / Ai layers</Label>
      </group>
      <group ref={(g) => { layers.current[1] = g; }}>
        <mesh position={grid.eye}>
          <circleGeometry args={[H * 0.24, 48]} />
          <meshStandardMaterial color="#ff8a4c" emissive="#ff8a4c" emissiveIntensity={0.55} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group ref={(g) => { layers.current[2] = g; }}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[grid.edges, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={VIOLET} transparent opacity={0.7} />
        </lineSegments>
        <Line points={grid.spiral} color="#ffffff" lineWidth={1.5} />
        <Label show={active} position={[W / 2 + 0.1, H / 2 + 0.3, 0]}>golden-ratio grid · φ</Label>
      </group>
      <group ref={pen}>
        <mesh position={[0, 0, 0.22]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.06, 0.4, 12]} />
          <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
  );
}

/* Firebase: a flame core wired to six services; pulses flow between them and the phone. */
const FIREBASE_SERVICES = ["Auth", "Firestore", "FCM", "Functions", "Crashlytics", "Analytics"];

function FirebaseStation({ index, cursorRef, reduced, active }: StationProps) {
  const { BLUE, AMBER } = useContext(Palette);
  const flame = useRef<THREE.Group>(null);
  const nodes = useRef<(THREE.Group | null)[]>([]);
  const pulses = useRef<(THREE.Mesh | null)[]>([]);
  const phone = useMemo(() => new THREE.Vector3(-2.05, -1.35, 0.9), []);
  const spots = useMemo(
    () =>
      FIREBASE_SERVICES.map((_, k) => {
        const a = (k / FIREBASE_SERVICES.length) * Math.PI * 2 + Math.PI / 2;
        return new THREE.Vector3(Math.cos(a) * 1.9, Math.sin(a) * 1.15, Math.sin(a) * 0.4);
      }),
    [],
  );

  useFrame(({ clock }) => {
    const t = reduced ? 1 : clock.elapsedTime;
    const f = focusOf(cursorRef.current, index);
    if (flame.current) {
      flame.current.scale.set(1, 0.92 + Math.sin(t * 5) * 0.06, 1);
      flame.current.rotation.y = t * 0.6;
    }
    nodes.current.forEach((g, k) => {
      if (!g) return;
      const r = 0.45 + 0.55 * f;
      g.position.copy(spots[k]).multiplyScalar(r);
      g.position.y += Math.sin(t * 1.3 + k) * 0.06;
    });
    pulses.current.forEach((m, k) => {
      if (!m) return;
      // Even pulses: core → a service. Odd pulses (FCM): core → the phone.
      const u = (t * 0.5 + k / pulses.current.length) % 1;
      const to = k % 2 ? phone : nodes.current[(k * 2) % FIREBASE_SERVICES.length]?.position ?? phone;
      m.position.set(0, 0.2, 0).lerp(to, u);
      m.visible = f > 0.2;
    });
  });

  return (
    <group rotation={[0.15, 0, 0]}>
      <group ref={flame}>
        {[
          { r: 0.5, h: 1.2, c: "#ffb547" },
          { r: 0.36, h: 0.95, c: "#ff8a3d" },
          { r: 0.22, h: 0.7, c: "#ff4d6d" },
        ].map(({ r, h, c }, k) => (
          <mesh key={k} position={[0, h / 2 - 0.4, k * 0.05]}>
            <coneGeometry args={[r, h, 6]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.7} flatShading />
          </mesh>
        ))}
      </group>
      {FIREBASE_SERVICES.map((name, k) => (
        <group key={name} ref={(g) => { nodes.current[k] = g; }}>
          <mesh>
            <octahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.45} flatShading />
          </mesh>
          <Label show={active} position={[0, k === 0 ? 0.35 : -0.35, 0]}>{name}</Label>
        </group>
      ))}
      {Array.from({ length: 6 }, (_, k) => (
        <mesh key={k} ref={(m) => { pulses.current[k] = m; }}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshBasicMaterial color={k % 2 ? BLUE : "#ffd23d"} />
        </mesh>
      ))}
      <group position={phone} rotation={[0, 0.4, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 0.95, 0.05]} />
          <meshStandardMaterial color="#14171f" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.3, 0.03]}>
          <planeGeometry args={[0.4, 0.14]} />
          <meshBasicMaterial color={BLUE} transparent opacity={0.8} />
        </mesh>
        <Label show={active} position={[0, -0.7, 0]}>push · live sync</Label>
      </group>
    </group>
  );
}

/* 14 — Leadership: a lead node with 14 engineers in orbit. */
function TeamStation({ index, cursorRef, reduced, active }: StationProps) {
  const { AMBER } = useContext(Palette);
  const lead = useRef<THREE.Mesh>(null);
  const nodes = useRef<(THREE.Mesh | null)[]>([]);
  const lines = useRef<THREE.LineSegments>(null);
  const positions = useMemo(() => new Float32Array(14 * 6), []);

  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.elapsedTime;
    const f = focusOf(cursorRef.current, index);
    if (lead.current) lead.current.rotation.y = t * 0.4;
    nodes.current.forEach((m, k) => {
      if (!m) return;
      const outer = k >= 7;
      const r = (outer ? 2.5 : 1.55) * (0.45 + 0.55 * f);
      const a = ((k % 7) / 7) * Math.PI * 2 + t * (outer ? 0.12 : -0.2);
      const tilt = outer ? -0.3 : 0.35;
      m.position.set(Math.cos(a) * r, Math.sin(a) * r * Math.sin(tilt), Math.sin(a) * r * Math.cos(tilt));
      positions.set([0, 0, 0, m.position.x, m.position.y, m.position.z], k * 6);
    });
    if (lines.current) lines.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group rotation={[0.2, 0, 0]}>
      <mesh ref={lead}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.6} flatShading />
      </mesh>
      {Array.from({ length: 14 }, (_, k) => (
        <mesh key={k} ref={(m) => { nodes.current[k] = m; }}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#e9edf3" emissive={AMBER} emissiveIntensity={0.25} />
        </mesh>
      ))}
      <lineSegments ref={lines}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={AMBER} transparent opacity={0.3} />
      </lineSegments>
      <Label show={active} position={[0, 0.85, 0]}>lead · review · standards</Label>
      <Label show={active} position={[0, -1.6, 1.4]}>14 engineers</Label>
    </group>
  );
}

// 3D scene for each tour entry, keyed by its id in content.ts.
const STATION_REGISTRY: Record<string, (props: StationProps) => React.JSX.Element> = {
  flutter: PhoneStation,
  architecture: ArchitectureStation,
  backend: BackendStation,
  firebase: FirebaseStation,
  release: ReleaseStation,
  design: DesignStation,
  team: TeamStation,
  streaming: StreamingStation,
  exodus: TransitStation,
  azlotv: TvStation,
  "offline-geo": GeoStation,
  couplio: CoupleStation,
  cosmoquest: CosmoStation,
  hardware: HardwareStation,
  "ml-security": SecurityStation,
};

export default function JourneyScene({
  ids,
  progressRef,
  active,
  running,
  reduced,
}: {
  ids: string[];
  progressRef: RefObject<number>;
  active: number;
  running: boolean;
  reduced: boolean;
}) {
  const cursorRef = useRef(0);
  const layerRef = useRef<HTMLDivElement>(null);
  const stations = useMemo(() => stationPositions(ids.length), [ids.length]);
  const theme = useTheme();
  const { client: BLUE, server: RED, ops: AMBER, craft: VIOLET } = theme.accents;
  const palette = useMemo(() => ({ BLUE, RED, AMBER, VIOLET }), [BLUE, RED, AMBER, VIOLET]);

  return (
    <div className="relative h-full w-full">
      <LabelLayer value={layerRef}>
        <Palette value={palette}>
          {/* Keyed by theme: materials build their colours once, so a theme switch remounts the scene. */}
          <Canvas
            key={theme.id}
            frameloop={running ? "always" : "never"}
            dpr={[1, 1.75]}
            camera={{ fov: 42, near: 0.1, far: 120, position: [-3.1, 0.8, 10.5] }}
            gl={{ antialias: true, powerPreference: "high-performance" }}
          >
            <color attach="background" args={[theme.ink]} />
            <fog attach="fog" args={[theme.ink, 12, 24]} />
            <ambientLight intensity={0.35} />
            <hemisphereLight args={["#9fd8ff", "#1a0b10", 0.5]} />
            <directionalLight position={[5, 8, 6]} intensity={1.3} />
            <Stars radius={80} depth={40} count={1400} factor={3} fade speed={reduced ? 0 : 0.4} />
            <Rig stations={stations} progressRef={progressRef} cursorRef={cursorRef} reduced={reduced} />
            <Path stations={stations} reduced={reduced} />
            {ids.map((id, i) => {
              const Station = STATION_REGISTRY[id];
              return Station ? (
                <group key={id} position={stations[i]}>
                  <Station index={i} cursorRef={cursorRef} reduced={reduced} active={active === i} />
                </group>
              ) : null;
            })}
          </Canvas>
        </Palette>
      </LabelLayer>
      <div ref={layerRef} className="pointer-events-none absolute inset-0 overflow-hidden" />
    </div>
  );
}
