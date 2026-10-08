import type { Accent } from "@/data/content";

// Hex values mirror --color-client / --color-server / --color-ops / --color-craft in globals.css.
export const ACCENT_HEX: Record<Accent, string> = {
  client: "#4cc2ff",
  server: "#ff4d6d",
  ops: "#ffb547",
  craft: "#b48cff",
};
