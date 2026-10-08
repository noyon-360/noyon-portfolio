"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { COLOR, damp, ramp } from "./util";

const X = [-1.5, 1.5]; // left: patched, right: unpatched

function Monitor({ x, screenRef }: { x: number; screenRef: (m: THREE.MeshBasicMaterial | null) => void }) {
  return (
    <group position={[x, 0, 0]}>
      <RoundedBox args={[2.2, 1.5, 0.12]} radius={0.05} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#1d1d1d" metalness={0.4} roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0.4, 0.065]}>
        <planeGeometry args={[2.0, 1.3]} />
        <meshBasicMaterial ref={screenRef} color="#20303a" toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[0.15, 0.6, 0.1]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      <mesh position={[0, -0.92, 0]}>
        <boxGeometry args={[0.9, 0.05, 0.5]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </group>
  );
}

/** Two identical PCs; a red wave sweeps across. The patched one stays clear, the unpatched one turns red. */
export default function TwoPCs({ progress }: { progress: RefObject<number> }) {
  const wave = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const screens = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const safe = useMemo(() => new THREE.Color("#2f6b4a"), []);
  const idle = useMemo(() => new THREE.Color("#20303a"), []);
  const red = useMemo(() => new THREE.Color(COLOR.signal), []);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const front = -5 + ramp(p, 0.1, 0.85) * 10;
    if (wave.current) {
      wave.current.position.x = front;
      (wave.current.material as THREE.MeshBasicMaterial).opacity = 0.35 * (1 - ramp(p, 0.85, 1));
    }
    const [a, b] = screens.current;
    if (a) a.color.copy(idle).lerp(safe, ramp(front, X[0] - 0.5, X[0] + 0.5));
    if (b) b.color.copy(idle).lerp(red, ramp(front, X[1] - 0.5, X[1] + 0.5));
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, Math.sin(state.clock.elapsedTime * 0.3) * 0.06, 3, dt);
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {X.map((x, i) => (
        <Monitor key={x} x={x} screenRef={(m) => void (screens.current[i] = m)} />
      ))}
      <mesh ref={wave} position={[-5, 0, 0.4]}>
        <planeGeometry args={[0.6, 3.4]} />
        <meshBasicMaterial color={COLOR.signal} transparent opacity={0.35} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}
