"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import * as THREE from "three";
import { DRUMS, dropAt, RANSOM_AT } from "./mongodb";
import { COLOR, damp, ramp } from "./util";

/** 03 — thirteen collection drums drain one by one; a small red ransom block is left in their place. */
export default function Collections({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const drums = useRef<(THREE.Mesh | null)[]>([]);
  const ransom = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    DRUMS.forEach((_, i) => {
      const m = drums.current[i];
      if (!m) return;
      const gone = ramp(p, dropAt(i), dropAt(i) + 0.05);
      m.scale.y = damp(m.scale.y, Math.max(0.001, 1 - gone), 8, dt);
      m.position.y = -0.4 + m.scale.y * 0.4;
      m.visible = m.scale.y > 0.01;
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = gone > 0 && gone < 1 ? 0.8 : 0.15;
    });
    const r = ransom.current;
    if (r) {
      const k = ramp(p, RANSOM_AT, RANSOM_AT + 0.08);
      r.scale.setScalar(Math.max(0.001, damp(r.scale.x, k, 6, dt)));
      r.rotation.y = state.clock.elapsedTime * 0.6;
    }
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, -0.3 + p * 0.35, 3, dt);
  });

  return (
    <group ref={group} rotation={[0.55, 0, 0]} position={[0, 0.2, 0]}>
      {/* Floor plate, so empty slots still read as a database */}
      <mesh position={[0, -0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.4, 4.2]} />
        <meshStandardMaterial color="#141414" />
      </mesh>
      {DRUMS.map(([x, z], i) => (
        <group key={i} position={[x, 0, -z]}>
          <mesh position={[0, -0.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.36, 0.4, 32]} />
            <meshBasicMaterial color={COLOR.dim} transparent opacity={0.35} />
          </mesh>
          <mesh ref={(m) => void (drums.current[i] = m)}>
            <cylinderGeometry args={[0.36, 0.36, 0.8, 32]} />
            <meshStandardMaterial color={COLOR.ice} emissive={COLOR.ice} emissiveIntensity={0.15} roughness={0.5} />
          </mesh>
        </group>
      ))}
      <mesh ref={ransom} position={[0, 0.05, 0]} scale={0.001}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color={COLOR.signal} emissive={COLOR.signal} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}
