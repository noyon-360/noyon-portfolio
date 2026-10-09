import { useEffect, useMemo } from "react";
import * as THREE from "three";

export const COLOR = {
  paper: "#0a0a0a",
  ivory: "#ece8e1",
  dim: "#9d9890",
  amber: "#f2a93b",
  signal: "#ff4a3d",
  green: "#6fd08c",
  ice: "#6cc6e4",
  violet: "#ab9cf2",
};

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** 0 before `a`, 1 after `b`, smoothstepped between. */
export const ramp = (v: number, a: number, b: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const damp = THREE.MathUtils.damp;

export function latLon(lat: number, lon: number, r: number) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

/** Deterministic pseudo-random numbers, so layouts are identical on every load. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

/**
 * A 2D canvas drawn once into a texture. A new `key` repaints into a fresh texture (they are small),
 * and each one is disposed when replaced or when the component unmounts.
 */
export function useCanvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, key: unknown) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (ctx) draw(ctx, w, h);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
    // `draw` is re-created each render; `key` is what decides a repaint.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, w, h]);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/** The page's serif (next/font renames the family, so read it from the CSS variable). */
export function serifFamily() {
  const root = document.querySelector(".cs-root");
  const v = root ? getComputedStyle(root).getPropertyValue("--font-cs-serif").trim() : "";
  return v ? `${v}, Georgia, serif` : "Georgia, serif";
}

export const FONT_MONO = 'ui-monospace, "SF Mono", Menlo, monospace';
export const FONT_SANS = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

/** Outline of a box as line segments (the temporary box geometry is released straight away). */
export function boxEdges(w: number, h: number, d: number) {
  const box = new THREE.BoxGeometry(w, h, d);
  const edges = new THREE.EdgesGeometry(box);
  box.dispose();
  return edges;
}
