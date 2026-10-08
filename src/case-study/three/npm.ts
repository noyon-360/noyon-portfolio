// Layouts and timings shared by the npm study's 3D objects, their HUDs and their SVG fallbacks,
// so all three always agree. Positions are illustrative.
import { rng } from "./util";

// ── Cover: a loose network of boxes, each linked to its two nearest neighbours ──
const rand = rng(443);
export const NET_NODES: [number, number, number][] = Array.from({ length: 16 }, () => [
  (rand() - 0.5) * 8,
  (rand() - 0.5) * 3.8,
  (rand() - 0.5) * 3,
]);
export const NET_EDGES: [number, number][] = (() => {
  const seen = new Set<string>();
  const out: [number, number][] = [];
  NET_NODES.forEach((a, i) => {
    NET_NODES.map((b, j) => ({ j, d: Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) }))
      .filter((x) => x.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 2)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          out.push([Math.min(i, j), Math.max(i, j)]);
        }
      });
  });
  return out;
})();
/** The one box drawn in red. */
export const NET_BAD = 5;

// ── 01: four servers lighting up in sequence ──
export const SERVER_LIT = [0.08, 0.3, 0.52, 0.74];
/** Grid cell (column, row) on the calendar for each server — placeholders until the dates are known. */
export const SERVER_CELLS: [number, number][] = [
  [1, 0],
  [4, 1],
  [2, 2],
  [5, 3],
];

// ── 02: app blocks per tower. Only the worst-hit count (10) is known; the others are drawn faint. ──
export const TOWER_BLOCKS = [4, 4, 4, 10];
export const TOWER_WORST = 3;

// ── 03: dependency tree; the red climbs PATH from the poisoned leaf to the root ──
export const TREE: { x: number; y: number; parent: number }[] = [
  { x: 0, y: 1.9, parent: -1 },
  { x: -2.2, y: 0.8, parent: 0 },
  { x: 0, y: 0.8, parent: 0 },
  { x: 2.2, y: 0.8, parent: 0 },
  { x: -3, y: -0.3, parent: 1 },
  { x: -1.5, y: -0.3, parent: 1 },
  { x: -0.4, y: -0.3, parent: 2 },
  { x: 0.8, y: -0.3, parent: 2 },
  { x: 2.5, y: -0.3, parent: 3 },
  { x: -2.1, y: -1.4, parent: 5 },
  { x: 0.2, y: -1.4, parent: 7 },
  { x: 1.4, y: -1.4, parent: 7 },
  { x: 3, y: -1.4, parent: 8 },
];
export const TREE_PATH = [10, 7, 2, 0];
export const treeLitAt = (k: number) => 0.12 + k * 0.2;

// ── 09: checklist ticks ──
export const tickAt = (i: number) => 0.05 + i * 0.18;

// ── 11: which switch is flipped, and when ──
export const SWITCH_COUNT = 10;
export const SWITCH_SUSPECT = 6;
export const SWITCH_AT = 0.4;

// ── 14: when each key greys out and is reforged ──
export const keyGreyAt = (i: number) => 0.08 + i * 0.08;
export const keyForgeAt = (i: number) => 0.55 + i * 0.1;

// ── 18: when each shield layer locks in ──
export const guardLayerAt = (i: number) => (i / 4) * 0.8;
