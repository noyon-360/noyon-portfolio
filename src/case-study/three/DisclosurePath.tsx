"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { PATH_X, RECIPIENT_POS, RECIPIENTS_AT, STOP_STAGE, stageAt } from "./portal";
import { COLOR, damp, ramp } from "./util";

/** 01 — five stages on a line; a pulse lights each in turn, then splits toward three recipients. */
export default function DisclosurePath({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const stages = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const ends = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const branches = useRef<THREE.LineBasicMaterial>(null);
  const dim = useMemo(() => new THREE.Color("#3a3833"), []);
  const lit = useMemo(() => new THREE.Color(COLOR.violet), []);

  const spine = useMemo(() => new THREE.BufferGeometry().setFromPoints(PATH_X.slice(1).flatMap((x, i) => [new THREE.Vector3(PATH_X[i], 0, 0), new THREE.Vector3(x, 0, 0)])), []);
  const fork = useMemo(() => {
    const last = PATH_X[PATH_X.length - 1];
    return new THREE.BufferGeometry().setFromPoints(RECIPIENT_POS.flatMap(([x, y]) => [new THREE.Vector3(last, 0, 0), new THREE.Vector3(x, y, 0)]));
  }, []);
  useEffect(
    () => () => {
      spine.dispose();
      fork.dispose();
    },
    [spine, fork],
  );

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const k = 1 - Math.exp(-6 * dt);
    stages.current.forEach((m, i) => {
      if (!m) return;
      const on = p >= stageAt(i);
      m.color.lerp(on ? lit : dim, k);
      m.emissiveIntensity = damp(m.emissiveIntensity, on ? 0.5 : 0, 5, dt);
    });
    const e = ramp(p, RECIPIENTS_AT - 0.06, RECIPIENTS_AT + 0.04);
    ends.current.forEach((m) => {
      if (!m) return;
      m.color.lerp(e > 0.5 ? lit : dim, k);
      m.emissiveIntensity = e * 0.5;
    });
    if (branches.current) branches.current.opacity = 0.15 + e * 0.6;

    // The pulse runs from the first stage to the last as the stages light up.
    const u = ramp(p, stageAt(0), stageAt(PATH_X.length - 1));
    const x = THREE.MathUtils.lerp(PATH_X[0], PATH_X[PATH_X.length - 1], u);
    if (pulse.current) {
      pulse.current.position.x = x;
      pulse.current.scale.setScalar(1 + 0.25 * Math.sin(state.clock.elapsedTime * 4));
    }
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, -0.25 + p * 0.3, 3, dt);
  });

  return (
    <group ref={group} position={[-0.1, -0.2, 0]} scale={0.8}>
      <lineSegments geometry={spine}>
        <lineBasicMaterial color={COLOR.ivory} transparent opacity={0.4} />
      </lineSegments>
      <lineSegments geometry={fork}>
        <lineBasicMaterial ref={branches} color={COLOR.violet} transparent opacity={0.15} />
      </lineSegments>
      {PATH_X.map((x, i) =>
        i === STOP_STAGE ? (
          // The stop: a flat barrier across the line.
          <mesh key={x} position={[x, 0, 0]}>
            <boxGeometry args={[0.12, 0.9, 0.5]} />
            <meshStandardMaterial ref={(m) => void (stages.current[i] = m)} color="#3a3833" emissive={COLOR.violet} emissiveIntensity={0} />
          </mesh>
        ) : (
          <mesh key={x} position={[x, 0, 0]}>
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshStandardMaterial ref={(m) => void (stages.current[i] = m)} color="#3a3833" emissive={COLOR.violet} emissiveIntensity={0} />
          </mesh>
        ),
      )}
      {RECIPIENT_POS.map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <boxGeometry args={[0.42, 0.42, 0.42]} />
          <meshStandardMaterial ref={(m) => void (ends.current[i] = m)} color="#3a3833" emissive={COLOR.violet} emissiveIntensity={0} />
        </mesh>
      ))}
      <mesh ref={pulse} position={[PATH_X[0], 0, 0.05]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={COLOR.ivory} />
      </mesh>
    </group>
  );
}
