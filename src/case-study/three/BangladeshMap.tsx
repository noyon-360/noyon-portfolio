"use client";

import { Edges } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { BD_CENTER, BD_OUTLINE, illustrativeDots } from "./bangladesh";
import { clamp01, COLOR, damp, rng } from "./util";

const K = 0.85; // degrees → scene units
const DOTS = 63;
const toXY = ([lon, lat]: [number, number]) => [(lon - BD_CENTER[0]) * K * 0.92, (lat - BD_CENTER[1]) * K] as const;

export default function BangladeshMap({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const dots = useRef<THREE.InstancedMesh>(null);

  const geometry = useMemo(() => {
    const shape = new THREE.Shape(BD_OUTLINE.map((p) => new THREE.Vector2(...toXY(p))));
    return new THREE.ExtrudeGeometry(shape, { depth: 0.22, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 });
  }, []);
  const points = useMemo(() => illustrativeDots(DOTS, rng(812)).map(toXY), []);
  const amber = useMemo(() => new THREE.Color(COLOR.amber), []);
  const off = useMemo(() => new THREE.Color("#3a3833"), []);
  // Cylinders stand along +y; the map's top face points along +z.
  const tmp = useMemo(() => {
    const o = new THREE.Object3D();
    o.rotation.x = Math.PI / 2;
    return o;
  }, []);
  const c = useMemo(() => new THREE.Color(), []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useEffect(() => {
    const m = dots.current;
    if (!m) return;
    points.forEach(([x, y], i) => {
      tmp.position.set(x, y, 0.27);
      tmp.updateMatrix();
      m.setMatrixAt(i, tmp.matrix);
      m.setColorAt(i, off);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [points, tmp, off]);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const g = group.current;
    if (g) {
      g.rotation.x = damp(g.rotation.x, -0.95 + p * 0.25, 3, dt);
      g.rotation.z = damp(g.rotation.z, -0.25 + p * 0.5, 3, dt);
    }
    const m = dots.current;
    if (!m) return;
    const lit = p * 1.3 * DOTS;
    for (let i = 0; i < DOTS; i++) {
      const on = clamp01(lit - i);
      c.copy(off).lerp(amber, on);
      m.setColorAt(i, c);
      const pulse = on > 0 && on < 1 ? 1.8 : 1;
      tmp.position.set(points[i][0], points[i][1], 0.27);
      tmp.scale.setScalar(pulse + Math.sin(state.clock.elapsedTime * 2 + i) * 0.08 * on);
      tmp.updateMatrix();
      m.setMatrixAt(i, tmp.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <group ref={group} position={[0, 0.1, 0]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#151515" roughness={0.7} metalness={0.1} />
        <Edges threshold={20} color={COLOR.amber} />
      </mesh>
      <instancedMesh ref={dots} args={[undefined, undefined, DOTS]}>
        <cylinderGeometry args={[0.045, 0.045, 0.08, 12]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
