"use client";

import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";

// One calm, lit stage shared by every 3D object. Unmounting it disposes the renderer and its GPU resources.
export default function CanvasHost({ children, camera }: { children: ReactNode; camera?: { position: [number, number, number]; fov?: number } }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: camera?.fov ?? 35, position: camera?.position ?? [0, 0, 8] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 6]} intensity={1.4} />
      <directionalLight position={[-4, -2, 3]} intensity={0.35} />
      {children}
    </Canvas>
  );
}
