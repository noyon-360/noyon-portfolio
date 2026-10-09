// Layouts and timings shared by the academic-portal study's 3D objects, their HUDs and their SVG fallbacks,
// so all three always agree. Positions are illustrative and not to scale.

// ── 01: the disclosure path. Five stages on a line, then three recipients. ──
export const PATH_X = [-3.4, -2.2, -1, 0.2, 1.4];
export const RECIPIENT_POS: [number, number][] = [
  [3.2, 1.2],
  [3.2, 0],
  [3.2, -1.2],
];
export const stageAt = (i: number) => 0.05 + i * 0.16;
export const RECIPIENTS_AT = 0.86;
/** The "Stopped" stage: drawn as a barrier, not a dot. */
export const STOP_STAGE = 2;

// ── 02 / 08: the filing cabinet. Five drawers, opened (02) or closed and locked (08) one by one. ──
export const DRAWERS = 5;
export const DRAWER_H = 0.56;
export const drawerY = (i: number) => (DRAWERS - 1) / 2 * DRAWER_H - i * DRAWER_H;
/** How far drawer i stands open at progress p in scene 02 (0 shut, 1 fully out). Uneven on purpose. */
export const OPEN_AMOUNT = [0.9, 0.55, 0.75, 0.4, 0.65];
export const openAt = (i: number) => 0.08 + i * 0.12;
export const lockAt = (i: number) => 0.12 + i * 0.15;

// ── 03: sequential record cards, stepped through one by one. Numbers are fictional. ──
export const RECORD_COUNT = 7;
export const RECORD_FIRST = 1040;
export const RECORD_STEP = 0.98;
export const recordX = (i: number) => (i - (RECORD_COUNT - 1) / 2) * RECORD_STEP;
export const visitAt = (i: number) => 0.06 + i * 0.12;

// ── 07: the redacted letter. Eight lines; the marked ones are blacked out, then copies go to three recipients. ──
export const LETTER_LINES = 8;
/** Which lines hold personal data and get redacted; the rest describe the weaknesses and stay. */
export const REDACT = [false, true, true, false, true, false, true, true];
export const redactAt = (i: number) => 0.06 + i * 0.055;
export const SEND_AT = 0.62;
export const LETTER_TARGETS: [number, number][] = [
  [1.9, 1.1],
  [2.2, 0],
  [1.9, -1.1],
];
