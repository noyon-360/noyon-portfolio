import type { Accent } from "@/data/content";

export type ThemeId = "terminal" | "redteam" | "blueteam" | "cyberpunk" | "midnight";

export type Theme = {
  id: ThemeId;
  name: string;
  // Why this palette — shown in the theme picker.
  mood: string;
  // Page/3D background; also the browser chrome colour.
  ink: string;
  accents: Record<Accent, string>;
};

// Hex values mirror the [data-theme] blocks in globals.css — keep the two in sync.
export const THEMES: Theme[] = [
  {
    id: "midnight",
    name: "Midnight",
    mood: "Flutter blue & Nest red — the original client ⇄ server",
    ink: "#07080c",
    accents: { client: "#4cc2ff", server: "#ff4d6d", ops: "#ffb547", craft: "#b48cff" },
  },
  {
    id: "terminal",
    name: "Terminal",
    mood: "Phosphor green — system OK, growth, trust in the shell",
    ink: "#050806",
    accents: { client: "#39ff88", server: "#ff3b5c", ops: "#ffcc00", craft: "#00e5ff" },
  },
  {
    id: "redteam",
    name: "Red Team",
    mood: "Crimson — urgency, power, offensive security",
    ink: "#0a0506",
    accents: { client: "#ff2e4d", server: "#ff8a00", ops: "#ffd166", craft: "#c77dff" },
  },
  {
    id: "blueteam",
    name: "Blue Team",
    mood: "Steel blue — calm, defence, reliability",
    ink: "#050a14",
    accents: { client: "#3da9ff", server: "#00e0b8", ops: "#ffb547", craft: "#8b9cff" },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    mood: "Neon cyan & magenta — energy, creativity, the future",
    ink: "#0b0614",
    accents: { client: "#00f0ff", server: "#ff2bd6", ops: "#f9f871", craft: "#a66bff" },
  },
];

export const DEFAULT_THEME: ThemeId = "midnight";
export const THEME_STORAGE_KEY = "theme";

export const themeById = (id: string | null | undefined): Theme =>
  THEMES.find((t) => t.id === id) ?? THEMES.find((t) => t.id === DEFAULT_THEME)!;

// Runs in <head> before first paint: applies the saved theme so there is no flash.
export const themeBootScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var ok=${JSON.stringify(
  Object.fromEntries(THEMES.map((t) => [t.id, t.ink])),
)};if(t&&ok[t]){document.documentElement.setAttribute("data-theme",t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",ok[t])}}catch(e){}})()`;
