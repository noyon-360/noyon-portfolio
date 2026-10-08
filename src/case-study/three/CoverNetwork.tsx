"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { NET_BAD, NET_EDGES, NET_NODES } from "./npm";
import { COLOR, damp } from "./util";

/** Front page of the npm study: a slow wireframe network of connected boxes, one of them red. */
export default function CoverNetwork({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const bad = useRef<THREE.MeshBasicMaterial>(null);
  const edges = useMemo(() => {
    const pts: number[] = [];
    NET_EDGES.forEach(([a, b]) => pts.push(...NET_NODES[a], ...NET_NODES[b]));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  useEffect(() => () => edges.dispose(), [edges]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (g) {
      g.rotation.y = damp(g.rotation.y, t * 0.04 + (progress.current ?? 0) * 0.8, 2, dt);
      g.rotation.x = Math.sin(t * 0.2) * 0.06;
    }
    if (bad.current) bad.current.opacity = 0.55 + Math.sin(t * 2) * 0.35;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={COLOR.ivory} transparent opacity={0.22} />
      </lineSegments>
      {NET_NODES.map((p, i) => (
        <mesh key={i} position={p} rotation={[0.4, i * 0.7, 0]}>
          <boxGeometry args={[0.38, 0.38, 0.38]} />
          {i === NET_BAD ? (
            <meshBasicMaterial ref={bad} color={COLOR.signal} wireframe transparent />
          ) : (
            <meshBasicMaterial color={COLOR.ivory} wireframe transparent opacity={0.45} />
          )}
        </mesh>
      ))}
    </group>
  );
}
