"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { npmVisual } from "../studies/npm-supply-chain-attack";
import { SWITCH_AT, SWITCH_COUNT, SWITCH_SUSPECT } from "./npm";
import { COLOR, damp } from "./util";

const { before, after } = npmVisual.switches;
const BAR_H = 2.4;

/** 11 — ten app switches; one flips off and the processor gauge beside them falls from 48% to 8%. */
export default function Switches({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const lever = useRef<THREE.Group>(null);
  const led = useRef<THREE.MeshStandardMaterial>(null);
  const fill = useRef<THREE.Mesh>(null);
  const level = useRef(before / 100);
  const red = useMemo(() => new THREE.Color(COLOR.signal), []);
  const offC = useMemo(() => new THREE.Color("#333"), []);

  useFrame((state, dt) => {
    const off = (progress.current ?? 0) >= SWITCH_AT;
    if (lever.current) lever.current.rotation.x = damp(lever.current.rotation.x, off ? 0.55 : -0.55, 8, dt);
    if (led.current) {
      led.current.color.lerp(off ? offC : red, 1 - Math.exp(-8 * dt));
      led.current.emissive.copy(led.current.color);
    }
    level.current = damp(level.current, (off ? after : before) / 100, 3, dt);
    if (fill.current) {
      fill.current.scale.y = Math.max(0.001, level.current);
      fill.current.position.y = -BAR_H / 2 + (BAR_H * level.current) / 2;
    }
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, -0.3 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05, 3, dt);
  });

  return (
    <group ref={group} position={[-0.3, 0, 0]}>
      {Array.from({ length: SWITCH_COUNT }, (_, i) => {
        const suspect = i === SWITCH_SUSPECT;
        return (
          <group key={i} position={[(i - (SWITCH_COUNT - 1) / 2) * 0.46, -0.4, 0]}>
            <mesh>
              <boxGeometry args={[0.36, 0.7, 0.2]} />
              <meshStandardMaterial color="#1b1b1b" metalness={0.3} roughness={0.5} />
            </mesh>
            <group ref={suspect ? lever : undefined} position={[0, 0, 0.1]} rotation={[-0.55, 0, 0]}>
              <mesh position={[0, 0, 0.16]}>
                <boxGeometry args={[0.1, 0.1, 0.32]} />
                <meshStandardMaterial color={COLOR.ivory} />
              </mesh>
            </group>
            <mesh position={[0, 0.48, 0]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              {suspect ? (
                <meshStandardMaterial ref={led} color={COLOR.signal} emissive={COLOR.signal} emissiveIntensity={0.8} />
              ) : (
                <meshStandardMaterial color={COLOR.amber} emissive={COLOR.amber} emissiveIntensity={0.5} />
              )}
            </mesh>
          </group>
        );
      })}
      <group position={[2.9, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.36, BAR_H, 0.2]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh ref={fill} position={[0, 0, 0.06]}>
          <boxGeometry args={[0.28, BAR_H, 0.12]} />
          <meshStandardMaterial color={COLOR.amber} emissive={COLOR.amber} emissiveIntensity={0.3} />
        </mesh>
      </group>
    </group>
  );
}
