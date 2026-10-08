import { DEFAULT_THEME, themeById } from "./themes";

// Accents of the default theme. Components that should follow the live theme use useTheme() instead.
export const ACCENT_HEX = themeById(DEFAULT_THEME).accents;
