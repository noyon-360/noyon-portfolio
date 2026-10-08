// A stylised take on Noyon's signature. Like the real one, everything is a single unbroken stroke —
// the pen only lifts twice at the end, for the two underlines. The gestures are kept (crossbar zigzag,
// opening letter, two looping runs with Z-shaped tails, the long top stroke, the big slash, the
// descender) but deliberately re-proportioned, so it is a mark rather than a reproduction of the
// legal signature. Coordinates are in a 1600×1280 sketch space, y down, in writing order.

type Pt = [number, number];

// A run of "m" humps along a slanted baseline, written left to right.
function humps(x0: number, y0: number, width: number, count: number, height: number, slant: number, rise: number): Pt[] {
  const pts: Pt[] = [];
  const w = width / count;
  for (let i = 0; i < count; i++) {
    for (let s = i === 0 ? 0 : 1; s <= 10; s++) {
      const t = s / 10;
      const lift = height * Math.pow(Math.sin(Math.PI * t), 0.75);
      pts.push([x0 + (i + t) * w + lift * slant, y0 - lift - ((i + t) / count) * rise]);
    }
  }
  return pts;
}

// A gently bowed line between two points (bow > 0 bends it upward).
function swoosh(from: Pt, to: Pt, bow: number, steps = 12): Pt[] {
  const pts: Pt[] = [];
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    pts.push([from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t - Math.sin(Math.PI * t) * bow]);
  }
  return pts;
}

// A smooth curve through a few control points (uniform Catmull-Rom), sampled densely.
function smooth(ctrl: Pt[], perSegment = 8): Pt[] {
  const pts: Pt[] = [];
  const at = (i: number) => ctrl[Math.min(Math.max(i, 0), ctrl.length - 1)];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    for (let s = i === 0 ? 0 : 1; s <= perSegment; s++) {
      const t = s / perSegment;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      pts.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  return pts;
}

const mainStroke: Pt[] = [
  // Crossbar zigzag, back and forth through the opening letter.
  ...swoosh([130, 545], [585, 515], 6, 6),
  [250, 640],
  [540, 590],
  // Opening letter, written right to left.
  [560, 520],
  [470, 715],
  [455, 495],
  [360, 760],
  // The big slash: up to its tip and straight back down over itself (a retrace, not a pen-lift).
  [440, 905],
  [1005, 95],
  [740, 470],
  // Into the first looping run, then up into the Z tail.
  [560, 660],
  ...humps(600, 650, 520, 5, 105, 0.35, 30).slice(1),
  [1180, 600],
  [1370, 360],
  // Back along the long top stroke.
  ...swoosh([1380, 345], [300, 495], -14).slice(1),
  // Down into the lower looping run and its Z tail.
  [470, 700],
  [640, 760],
  ...humps(640, 755, 450, 4, 90, 0.35, 20).slice(1),
  [1110, 720],
  [1310, 470],
  // Descender: drops from the run, curls under and kicks back left — where the pen leaves the paper.
  ...smooth([
    [1150, 710],
    [960, 800],
    [1000, 880],
    [955, 955],
    [800, 1005],
    [600, 1018],
  ]),
];

export const SIGNATURE_STROKES: Pt[][] = [
  mainStroke,
  // Pen lifts twice for the underlines.
  swoosh([115, 895], [1320, 760], 18),
  swoosh([185, 1005], [1545, 865], 22),
];
