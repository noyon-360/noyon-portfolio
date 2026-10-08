// Layouts and timings shared by the MongoDB study's 3D objects, their HUDs and their SVG fallbacks,
// so all three always agree. Positions are illustrative and not to scale.
import { rng } from "./util";

// ── 01: the exposure timeline. x runs from -4 (Feb 2025) to 4 (Sep 2026); schematic, not to scale. ──
export const LINE_START = -3.6;
export const LINE_END = 3.9;
export type LineEvent = { x: number; h: number; tone: "ivory" | "dim" | "amber" | "signal"; at: number };
/** In the same order as mongoVisual.timeline.events. */
export const LINE_EVENTS: LineEvent[] = [
  { x: -3.6, h: 0.9, tone: "ivory", at: 0.04 },
  { x: -2.6, h: 0.5, tone: "dim", at: 0.16 },
  { x: 0.3, h: 0.5, tone: "dim", at: 0.34 },
  { x: 1.6, h: 0.7, tone: "amber", at: 0.5 },
  { x: 2.8, h: 1.2, tone: "amber", at: 0.66 },
  { x: 3.35, h: 1.9, tone: "signal", at: 0.8 },
  { x: 3.9, h: 0.9, tone: "ivory", at: 0.92 },
];
/** The five export-like sessions, Jul–Aug 2026, drawn as faint marks around event 3. */
export const SESSION_X = [1.1, 1.35, 1.6, 1.85, 2.1];
/** How far the glowing "open" stretch has run at progress p. */
export const lineFill = (p: number) => LINE_START + (LINE_END - LINE_START) * Math.min(1, p / 0.92);

// ── 02: scanner dots flying into the open port from every direction ──
const rand = rng(27017);
export const SCANNERS: { from: [number, number, number]; phase: number }[] = Array.from({ length: 22 }, () => {
  const a = rand() * Math.PI * 2;
  const b = (rand() - 0.5) * 1.6;
  return { from: [Math.cos(a) * 5.5, Math.sin(b) * 3, Math.sin(a) * 3 + 1.5], phase: rand() };
});

// ── 03: thirteen collections in a 5 / 4 / 4 grid, dropped one by one ──
export const DRUM_ROWS = [5, 4, 4];
export const DRUMS: [number, number][] = DRUM_ROWS.flatMap((n, r) => Array.from({ length: n }, (_, c) => [(c - (n - 1) / 2) * 1.15, (1 - r) * 1.15] as [number, number]));
export const dropAt = (i: number) => 0.1 + i * 0.045;
export const RANSOM_AT = 0.78;

// ── 08: four layers whose holes drift into line ──
export const LAYER_OFFSETS: [number, number][] = [
  [0.7, 0.45],
  [-0.6, -0.5],
  [0.5, -0.6],
  [-0.55, 0.55],
];
export const ALIGN_AT = 0.7;
