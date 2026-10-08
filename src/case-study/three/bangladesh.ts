// A hand-simplified outline of Bangladesh as [lon, lat] pairs — stylised, not survey-accurate.
// Shared by the 3D map and its SVG fallback.
export const BD_OUTLINE: [number, number][] = [
  [88.45, 26.6], [88.95, 26.3], [89.55, 26.15], [89.85, 25.95], [89.85, 25.3], [90.5, 25.2],
  [91.3, 25.2], [91.85, 25.2], [92.4, 25.05], [92.45, 24.85], [92.25, 24.4], [91.95, 24.2],
  [91.65, 24.15], [91.35, 24.05], [91.2, 23.75], [91.25, 23.25], [91.6, 22.95], [91.85, 23.35],
  [92.2, 23.65], [92.35, 23.3], [92.6, 22.5], [92.6, 21.6], [92.3, 20.75], [92.05, 21.2],
  [91.85, 22.2], [91.55, 22.6], [91.15, 22.45], [90.65, 22.05], [90.25, 21.85], [89.6, 21.8],
  [89.05, 21.65], [88.95, 22.4], [88.85, 23.2], [88.6, 23.6], [88.75, 24.2], [88.15, 24.5],
  [88.05, 24.95], [88.5, 25.25], [88.15, 25.75], [88.1, 26.2],
];

export const BD_CENTER: [number, number] = [90.3, 23.7];

export function insideOutline([x, y]: [number, number]) {
  let inside = false;
  for (let i = 0, j = BD_OUTLINE.length - 1; i < BD_OUTLINE.length; j = i++) {
    const [xi, yi] = BD_OUTLINE[i];
    const [xj, yj] = BD_OUTLINE[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** `count` illustrative points spread inside the outline, ordered outward from the centre. */
export function illustrativeDots(count: number, random: () => number): [number, number][] {
  const out: [number, number][] = [];
  let guard = 0;
  while (out.length < count && guard++ < 20000) {
    const p: [number, number] = [88 + random() * 4.6, 20.7 + random() * 5.9];
    if (insideOutline(p)) out.push(p);
  }
  return out.sort((a, b) => Math.hypot(a[0] - BD_CENTER[0], a[1] - BD_CENTER[1]) - Math.hypot(b[0] - BD_CENTER[0], b[1] - BD_CENTER[1]));
}
