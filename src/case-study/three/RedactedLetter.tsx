"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import * as THREE from "three";
import { LETTER_LINES, LETTER_TARGETS, REDACT, redactAt, SEND_AT } from "./portal";
import { COLOR, damp, ramp } from "./util";

const LINE_Y = (i: number) => 0.95 - i * 0.26;
const LINE_W = (i: number) => 1.5 - (i % 3) * 0.22;
/** Left edge shared by every text line and its redaction bar. */
const LEFT = -1.65;
const ORIGIN = new THREE.Vector3(-0.9, 0, 0.1);

/** 07 — a letter whose personal-data lines are blacked out one by one; then three copies leave for three recipients. */
export default function RedactedLetter({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const bars = useRef<(THREE.Mesh | null)[]>([]);
  const copies = useRef<(THREE.Group | null)[]>([]);
  const target = useRef(LETTER_TARGETS.map(([x, y]) => new THREE.Vector3(x, y, 0)));

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    bars.current.forEach((m, i) => {
      if (!m) return;
      const k = ramp(p, redactAt(i), redactAt(i) + 0.05);
      m.scale.x = damp(m.scale.x, Math.max(0.001, k), 8, dt);
      m.position.x = LEFT + (LINE_W(i) * m.scale.x) / 2;
    });
    copies.current.forEach((g, i) => {
      if (!g) return;
      const k = ramp(p, SEND_AT + i * 0.06, SEND_AT + 0.2 + i * 0.06);
      g.visible = k > 0.001;
      g.position.lerpVectors(ORIGIN, target.current[i], k);
      g.rotation.z = (1 - k) * 0.6;
    });
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, 0.25 - p * 0.3 + Math.sin(state.clock.elapsedTime * 0.3) * 0.02, 3, dt);
  });

  return (
    <group ref={group} position={[-0.2, 0, 0]}>
      {/* The page */}
      <mesh position={[-0.9, 0, 0]}>
        <planeGeometry args={[2, 2.6]} />
        <meshStandardMaterial color={COLOR.ivory} transparent opacity={0.9} />
      </mesh>
      {Array.from({ length: LETTER_LINES }, (_, i) => (
        <group key={i} position={[0, LINE_Y(i), 0.01]}>
          <mesh position={[LEFT + LINE_W(i) / 2, 0, 0]}>
            <planeGeometry args={[LINE_W(i), 0.06]} />
            <meshBasicMaterial color="#8a857d" />
          </mesh>
          {REDACT[i] && (
            <mesh ref={(m) => void (bars.current[i] = m)} position={[LEFT, 0, 0.01]} scale={[0.001, 1, 1]}>
              <planeGeometry args={[LINE_W(i), 0.16]} />
              <meshBasicMaterial color="#0a0a0a" />
            </mesh>
          )}
        </group>
      ))}
      {/* Three sealed copies */}
      {LETTER_TARGETS.map((_, i) => (
        <group key={i} ref={(g) => void (copies.current[i] = g)} visible={false}>
          <mesh>
            <planeGeometry args={[0.7, 0.46]} />
            <meshStandardMaterial color={COLOR.ivory} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.06, 0.01]} rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[0.36, 0.36]} />
            <meshBasicMaterial color={COLOR.violet} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
