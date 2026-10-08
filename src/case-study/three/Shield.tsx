"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { c1Shield } from "../content";
import { COLOR, damp, ramp } from "./util";

export function shieldShape(s: number) {
  const shape = new THREE.Shape();
  shape.moveTo(-1.5 * s, 1.7 * s);
  shape.lineTo(1.5 * s, 1.7 * s);
  shape.lineTo(1.5 * s, 0.2 * s);
  shape.quadraticCurveTo(1.4 * s, -1.3 * s, 0, -2.1 * s);
  shape.quadraticCurveTo(-1.4 * s, -1.3 * s, -1.5 * s, 0.2 * s);
  shape.closePath();
  return shape;
}

/** Nine concentric layers fly in and lock together as the reader scrolls. */
export default function Shield({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const layers = useRef<(THREE.Mesh | null)[]>([]);
  const geoms = useMemo(
    () => c1Shield.map((_, i) => new THREE.ExtrudeGeometry(shieldShape(1 - i * 0.085), { depth: 0.08, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2 })),
    [],
  );
  const colors = useMemo(() => {
    const a = new THREE.Color("#2a2620");
    const b = new THREE.Color(COLOR.amber);
    return c1Shield.map((_, i) => a.clone().lerp(b, 0.25 + (i / (c1Shield.length - 1)) * 0.75));
  }, []);
  useEffect(() => () => geoms.forEach((g) => g.dispose()), [geoms]);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    layers.current.forEach((m, i) => {
      if (!m) return;
      const t = ramp(p, (i / c1Shield.length) * 0.85, (i / c1Shield.length) * 0.85 + 0.12);
      m.position.z = damp(m.position.z, THREE.MathUtils.lerp(2.5, i * 0.1, t), 6, dt);
      m.position.x = damp(m.position.x, THREE.MathUtils.lerp((i % 2 ? 1 : -1) * 1.2, 0, t), 6, dt);
      m.scale.setScalar(THREE.MathUtils.lerp(0.6, 1, t));
      m.visible = t > 0.001;
    });
    if (group.current) {
      group.current.rotation.y = damp(group.current.rotation.y, -0.6 + p * 0.6 + Math.sin(state.clock.elapsedTime * 0.4) * 0.05, 3, dt);
      group.current.rotation.x = -0.08;
    }
  });

  return (
    <group ref={group} position={[-1.1, 0.2, 0]}>
      {geoms.map((g, i) => (
        <mesh key={i} ref={(m) => void (layers.current[i] = m)} geometry={g} visible={false} position={[0, 0, 2.5]}>
          <meshStandardMaterial color={colors[i]} metalness={0.35} roughness={0.45} />
        </mesh>
      ))}
    </group>
  );
}
