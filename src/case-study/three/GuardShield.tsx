"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { npmShieldLayers } from "../studies/npm-supply-chain-attack";
import { guardLayerAt } from "./npm";
import { shieldShape } from "./Shield";
import { COLOR, damp, ramp } from "./util";

const N = npmShieldLayers.length;

/** 18 — a shield assembles from four labelled layers (install gate, watchdog, alert, one view). */
export default function GuardShield({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const layers = useRef<(THREE.Mesh | null)[]>([]);
  const geoms = useMemo(
    () => npmShieldLayers.map((_, i) => new THREE.ExtrudeGeometry(shieldShape(1 - i * 0.17), { depth: 0.1, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 })),
    [],
  );
  const colors = useMemo(() => {
    const a = new THREE.Color("#1f2a22");
    const b = new THREE.Color(COLOR.green);
    return npmShieldLayers.map((_, i) => a.clone().lerp(b, 0.3 + (i / (N - 1)) * 0.7));
  }, []);
  useEffect(() => () => geoms.forEach((g) => g.dispose()), [geoms]);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    layers.current.forEach((m, i) => {
      if (!m) return;
      const t = ramp(p, guardLayerAt(i), guardLayerAt(i) + 0.14);
      m.position.z = damp(m.position.z, THREE.MathUtils.lerp(2.5, i * 0.14, t), 6, dt);
      m.position.y = damp(m.position.y, THREE.MathUtils.lerp(i % 2 ? 1.4 : -1.4, 0, t), 6, dt);
      m.visible = t > 0.001;
    });
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, -0.6 + p * 0.6 + Math.sin(state.clock.elapsedTime * 0.4) * 0.05, 3, dt);
  });

  return (
    <group ref={group} position={[-0.9, 0.2, 0]}>
      {geoms.map((g, i) => (
        <mesh key={i} ref={(m) => void (layers.current[i] = m)} geometry={g} visible={false} position={[0, 0, 2.5]}>
          <meshStandardMaterial color={colors[i]} metalness={0.35} roughness={0.45} />
        </mesh>
      ))}
    </group>
  );
}
