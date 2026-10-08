"use client";

import { Edges } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { clamp01, COLOR, damp } from "./util";

// The parcel analogy: box A has room for CAP blocks; the parcel brings TOTAL. The rest spills into
// box B and overwrites what was already on that shelf (the ivory blocks).
const CAP = 12;
const TOTAL = 20;
const RESIDENT = 8;
const S = 0.36; // block size
const BOX = { w: 1.6, h: 1.5, d: 1.2 };
const A_X = -1.1;
const B_X = 1.1;
const DROP = new THREE.Vector3(A_X, BOX.h / 2 + 1.6, 0);
const MID = new THREE.Vector3((A_X + B_X) / 2, BOX.h / 2 + 0.9, 0);

function slot(i: number, cx: number): THREE.Vector3 {
  const perLayer = 4;
  const layer = Math.floor(i / perLayer);
  const k = i % perLayer;
  return new THREE.Vector3(cx + ((k % 2) - 0.5) * S * 1.6, -BOX.h / 2 + S / 2 + layer * S * 1.02, (Math.floor(k / 2) - 0.5) * S * 1.4);
}

export default function GlassBoxes({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const blocks = useRef<THREE.InstancedMesh>(null);
  const resident = useRef<THREE.InstancedMesh>(null);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const [va, vb] = useMemo(() => [new THREE.Vector3(), new THREE.Vector3()], []);
  const color = useMemo(() => new THREE.Color(), []);
  const fit = useMemo(() => new THREE.Color(COLOR.ivory), []);
  const red = useMemo(() => new THREE.Color(COLOR.signal), []);
  const ivory = useMemo(() => new THREE.Color("#8d8a84"), []);

  // Each block's resting place: the first CAP in box A, the overflow on top of box B's residents.
  const targets = useMemo(() => Array.from({ length: TOTAL }, (_, i) => (i < CAP ? slot(i, A_X) : slot(i - CAP + RESIDENT, B_X))), []);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const m = blocks.current;
    const r = resident.current;
    if (!m || !r) return;
    const n = p * 1.4 * TOTAL;
    for (let i = 0; i < TOTAL; i++) {
      const t = clamp01(n - i);
      const target = targets[i];
      if (i < CAP) {
        tmp.position.lerpVectors(DROP, target, t * t);
      } else {
        // Overflow arcs over the rim of A into B.
        va.copy(DROP).lerp(MID, t);
        vb.copy(MID).lerp(target, t);
        tmp.position.copy(va.lerp(vb, t));
      }
      tmp.scale.setScalar(t > 0 ? 1 : 0.0001);
      tmp.rotation.set(0, 0, 0);
      tmp.updateMatrix();
      m.setMatrixAt(i, tmp.matrix);
      m.setColorAt(i, color.copy(i < CAP ? fit : red));
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;

    // Box B's residents turn red as they are overwritten.
    const over = clamp01((n - CAP) / (TOTAL - CAP));
    for (let i = 0; i < RESIDENT; i++) {
      tmp.position.copy(slot(i, B_X));
      tmp.scale.setScalar(1);
      tmp.updateMatrix();
      r.setMatrixAt(i, tmp.matrix);
      r.setColorAt(i, color.copy(ivory).lerp(red, clamp01(over * RESIDENT - (RESIDENT - 1 - i))));
    }
    r.instanceMatrix.needsUpdate = true;
    if (r.instanceColor) r.instanceColor.needsUpdate = true;

    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, -0.35 + p * 0.3 + Math.sin(state.clock.elapsedTime * 0.3) * 0.04, 3, dt);
  });

  return (
    <group ref={group} rotation={[0.28, 0, 0]} position={[0, -0.4, 0]}>
      {[A_X, B_X].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[BOX.w, BOX.h, BOX.d]} />
          <meshStandardMaterial color="#9fb7c8" transparent opacity={0.08} depthWrite={false} />
          <Edges color={COLOR.ivory} />
        </mesh>
      ))}
      <instancedMesh ref={blocks} args={[undefined, undefined, TOTAL]}>
        <boxGeometry args={[S, S, S]} />
        <meshStandardMaterial roughness={0.5} />
      </instancedMesh>
      <instancedMesh ref={resident} args={[undefined, undefined, RESIDENT]}>
        <boxGeometry args={[S, S, S]} />
        <meshStandardMaterial roughness={0.5} />
      </instancedMesh>
    </group>
  );
}
