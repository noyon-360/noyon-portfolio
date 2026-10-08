"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { c2Pins } from "../content";
import { clamp01, COLOR, damp, latLon, ramp, rng } from "./util";

type Mode = "cover" | "spread" | "pins" | "stop";
const R = 2.2;

// Illustrative network nodes for the spread animation: the named victims plus extra waypoints.
// These are not infection data; the arcs show the worm's pattern, not its real route.
const NODES: [number, number][] = [
  ...c2Pins.map((p) => [p.lat, p.lon] as [number, number]),
  [-23.5, -46.6],
  [19.4, -99.1],
  [6.5, 3.4],
  [-33.9, 18.4],
  [1.35, 103.8],
  [-33.8, 151.2],
  [37.5, 127],
  [25.2, 55.3],
  [41, 29],
  [59.3, 18.1],
  [43.7, -79.4],
  [30, 31.2],
];

// Each node after the first is reached from an earlier one, so arcs read as a chain of infections.
const pick = rng(17);
const ARCS: [number, number][] = NODES.slice(1).map((_, k) => [Math.floor(pick() * (k + 1)), k + 1]);

function arcPoints(a: THREE.Vector3, b: THREE.Vector3) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const lift = R + a.distanceTo(b) * 0.35;
  mid.setLength(lift);
  return new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(48);
}

function useWireframe() {
  return useMemo(() => {
    const pts: number[] = [];
    const push = (v: THREE.Vector3) => pts.push(v.x, v.y, v.z);
    for (let lat = -75; lat <= 75; lat += 15)
      for (let lon = 0; lon < 360; lon += 4) {
        push(latLon(lat, lon, R));
        push(latLon(lat, lon + 4, R));
      }
    for (let lon = 0; lon < 360; lon += 15)
      for (let lat = -88; lat < 88; lat += 4) {
        push(latLon(lat, lon, R));
        push(latLon(lat + 4, lon, R));
      }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
}

function Globe({ progress, mode }: { progress: RefObject<number>; mode: Mode }) {
  const group = useRef<THREE.Group>(null);
  const wire = useWireframe();
  const nodes = useMemo(() => NODES.map(([la, lo]) => latLon(la, lo, R)), []);
  const arcs = useMemo(
    () =>
      ARCS.map(([a, b]) => {
        const g = new THREE.BufferGeometry().setFromPoints(arcPoints(nodes[a], nodes[b]));
        const m = new THREE.LineBasicMaterial({ color: COLOR.signal, transparent: true, opacity: 0.9 });
        return new THREE.Line(g, m);
      }),
    [nodes],
  );
  const nodeMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const pinRefs = useRef<(THREE.Mesh | null)[]>([]);
  const red = useMemo(() => new THREE.Color(COLOR.signal), []);
  const ivory = useMemo(() => new THREE.Color(COLOR.ivory), []);

  useEffect(
    () => () => {
      wire.dispose();
      arcs.forEach((l) => {
        l.geometry.dispose();
        (l.material as THREE.Material).dispose();
      });
    },
    [wire, arcs],
  );

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    if (mode === "pins") {
      // Turn the active pin to face the reader.
      const i = Math.min(c2Pins.length - 1, Math.floor(p * c2Pins.length));
      const v = latLon(c2Pins[i].lat, c2Pins[i].lon, R);
      const targetY = -Math.atan2(v.x, v.z);
      let dy = targetY - g.rotation.y;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      g.rotation.y += dy * (1 - Math.exp(-3 * dt));
      g.rotation.x = damp(g.rotation.x, THREE.MathUtils.degToRad(c2Pins[i].lat) * 0.8, 3, dt);
      pinRefs.current.forEach((m, k) => {
        if (!m) return;
        const on = k === i;
        m.scale.setScalar(damp(m.scale.x, on ? 1.6 : 1, 6, dt));
        (m.material as THREE.MeshBasicMaterial).color.copy(on ? red : ivory);
      });
    } else if (mode === "cover") {
      g.rotation.y = t * 0.06 + p * 1.2;
      g.rotation.x = 0.35;
    } else {
      g.rotation.y = -1.2 + p * 2.4 + t * 0.02;
      g.rotation.x = 0.4;
    }

    if (mode === "spread" || mode === "stop") {
      const n = arcs.length;
      arcs.forEach((line, k) => {
        const mat = line.material as THREE.LineBasicMaterial;
        if (mode === "spread") {
          const draw = clamp01(p * (n + 2) - k);
          line.geometry.setDrawRange(0, Math.floor(draw * 49));
          mat.opacity = 0.9;
        } else {
          // The switch flips at ~15%; arcs then fade one by one.
          line.geometry.setDrawRange(0, 49);
          mat.opacity = 0.9 * (1 - ramp(p, 0.15 + (k / n) * 0.7, 0.25 + (k / n) * 0.7));
        }
      });
      nodeMats.current.forEach((m, k) => {
        if (!m) return;
        const reached = mode === "spread" ? k === 0 || clamp01(p * (n + 2) - (k - 1)) >= 1 : true;
        const fade = mode === "stop" ? ramp(p, 0.2, 0.95) : 0;
        m.color.copy(reached ? red : ivory).lerp(ivory, fade);
      });
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[R * 0.985, 48, 48]} />
        <meshBasicMaterial color={COLOR.paper} />
      </mesh>
      <lineSegments geometry={wire}>
        <lineBasicMaterial color={COLOR.ivory} transparent opacity={mode === "cover" ? 0.22 : 0.14} />
      </lineSegments>

      {mode !== "cover" &&
        mode !== "pins" &&
        nodes.map((v, k) => (
          <mesh key={k} position={v}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshBasicMaterial ref={(m) => void (nodeMats.current[k] = m)} color={COLOR.ivory} />
          </mesh>
        ))}

      {(mode === "spread" || mode === "stop") && arcs.map((l, k) => <primitive key={k} object={l} />)}

      {mode === "pins" &&
        c2Pins.map((pin, k) => {
          const v = latLon(pin.lat, pin.lon, R);
          const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize());
          return (
            <mesh key={pin.place} ref={(m) => void (pinRefs.current[k] = m)} position={v.clone().multiplyScalar(1.03)} quaternion={q}>
              <coneGeometry args={[0.05, 0.16, 12]} />
              <meshBasicMaterial color={COLOR.ivory} />
            </mesh>
          );
        })}
    </group>
  );
}

export const CoverGlobe = ({ progress }: { progress: RefObject<number> }) => <Globe progress={progress} mode="cover" />;
export const SpreadGlobe = ({ progress }: { progress: RefObject<number> }) => <Globe progress={progress} mode="spread" />;
export const PinsGlobe = ({ progress }: { progress: RefObject<number> }) => <Globe progress={progress} mode="pins" />;
export const StopGlobe = ({ progress }: { progress: RefObject<number> }) => <Globe progress={progress} mode="stop" />;
