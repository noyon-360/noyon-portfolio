"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { TREE, TREE_PATH, treeLitAt } from "./npm";
import { COLOR, damp } from "./util";

const pathEdge = (k: number) => [TREE_PATH[k], TREE_PATH[k + 1]] as const;

/** 03 — a tree of dependency boxes; one deep box turns red and the colour climbs to the root. */
export default function DependencyTree({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const mats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const edgeMats = useRef<(THREE.LineBasicMaterial | null)[]>([]);
  const red = useMemo(() => new THREE.Color(COLOR.signal), []);
  const ivory = useMemo(() => new THREE.Color("#3a3835"), []);
  const dimLine = useMemo(() => new THREE.Color(COLOR.dim), []);

  const { all, path } = useMemo(() => {
    const seg = (a: number, b: number) => [TREE[a].x, TREE[a].y, 0, TREE[b].x, TREE[b].y, 0];
    const allG = new THREE.BufferGeometry();
    allG.setAttribute("position", new THREE.Float32BufferAttribute(TREE.flatMap((n, i) => (n.parent < 0 ? [] : seg(i, n.parent))), 3));
    const pathG = TREE_PATH.slice(0, -1).map((_, k) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(seg(...pathEdge(k)), 3));
      return g;
    });
    return { all: allG, path: pathG };
  }, []);
  useEffect(
    () => () => {
      all.dispose();
      path.forEach((g) => g.dispose());
    },
    [all, path],
  );

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const k = 1 - Math.exp(-6 * dt);
    TREE.forEach((_, i) => {
      const m = mats.current[i];
      if (!m) return;
      const step = TREE_PATH.indexOf(i);
      const on = step >= 0 && p >= treeLitAt(step);
      m.color.lerp(on ? red : ivory, k);
      m.emissive.copy(m.color);
      m.emissiveIntensity = on ? 0.45 : 0.05;
    });
    edgeMats.current.forEach((m, e) => m?.color.lerp(p >= treeLitAt(e + 1) ? red : dimLine, k));
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, -0.25 + p * 0.5 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05, 3, dt);
  });

  return (
    <group ref={group} position={[0, -0.1, 0]}>
      <lineSegments geometry={all}>
        <lineBasicMaterial color={COLOR.dim} transparent opacity={0.45} />
      </lineSegments>
      {path.map((g, e) => (
        <lineSegments key={e} geometry={g} position={[0, 0, 0.01]}>
          <lineBasicMaterial ref={(m) => void (edgeMats.current[e] = m)} color={COLOR.dim} />
        </lineSegments>
      ))}
      {TREE.map((n, i) => (
        <mesh key={i} position={[n.x, n.y, 0]}>
          <boxGeometry args={i === 0 ? [1.1, 0.5, 0.4] : [0.62, 0.34, 0.3]} />
          <meshStandardMaterial ref={(m) => void (mats.current[i] = m)} color="#3a3835" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}
