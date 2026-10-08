"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { COLOR, ramp } from "./util";

const SCREENS = 10; // five per wall
const LEN = 14;

/** A low-poly hospital corridor; the screens along the walls flip to red as you move down it. */
export default function Corridor({ progress }: { progress: RefObject<number> }) {
  const mats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const { camera } = useThree();
  const calm = useMemo(() => new THREE.Color("#2c4a5a"), []);
  const red = useMemo(() => new THREE.Color(COLOR.signal), []);
  const screens = useMemo(
    () =>
      Array.from({ length: SCREENS }, (_, i) => {
        const side = i % 2 ? 1 : -1;
        return { side, z: -1.5 - Math.floor(i / 2) * 2.6 };
      }),
    [],
  );

  useFrame((state) => {
    const p = progress.current ?? 0;
    // Walk slowly down the corridor.
    camera.position.set(Math.sin(state.clock.elapsedTime * 0.3) * 0.05, 0.1, 4 - p * 5);
    camera.lookAt(0, 0, -LEN);
    mats.current.forEach((m, i) => {
      if (!m) return;
      const flip = ramp(p, (i / SCREENS) * 0.8, (i / SCREENS) * 0.8 + 0.06);
      m.color.copy(calm).lerp(red, flip);
    });
  });

  return (
    <group>
      <fog attach="fog" args={[COLOR.paper, 4, 16]} />
      {/* Floor, ceiling, walls */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, -LEN / 2 + 2]}>
        <planeGeometry args={[3.2, LEN + 4]} />
        <meshStandardMaterial color="#2a2a28" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 1.4, -LEN / 2 + 2]}>
        <planeGeometry args={[3.2, LEN + 4]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} rotation={[0, -s * (Math.PI / 2), 0]} position={[s * 1.6, 0.1, -LEN / 2 + 2]}>
          <planeGeometry args={[LEN + 4, 2.6]} />
          <meshStandardMaterial color="#3a3936" />
        </mesh>
      ))}
      {/* Ceiling light strips */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[0, 1.38, 1 - i * 2.6]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.5, 1.2]} />
          <meshBasicMaterial color="#d8dde0" />
        </mesh>
      ))}
      {/* Wall screens */}
      {screens.map((s, i) => (
        <group key={i} position={[s.side * 1.57, 0.25, s.z]} rotation={[0, -s.side * (Math.PI / 2), 0]}>
          <mesh>
            <boxGeometry args={[0.9, 0.6, 0.06]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[0.8, 0.5]} />
            <meshBasicMaterial ref={(m) => void (mats.current[i] = m)} color="#2c4a5a" toneMapped={false} />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 1, 0]} intensity={4} distance={8} />
      <pointLight position={[0, 1, -6]} intensity={4} distance={8} />
    </group>
  );
}
