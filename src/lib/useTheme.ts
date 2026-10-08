"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY, themeById, type ThemeId } from "./themes";

// The <html data-theme> attribute is the source of truth; this just watches it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getSnapshot = () => document.documentElement.dataset.theme ?? DEFAULT_THEME;
const getServerSnapshot = () => DEFAULT_THEME;

export function useTheme() {
  return themeById(useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot));
}

export function setTheme(id: ThemeId) {
  const theme = themeById(id);
  document.documentElement.dataset.theme = theme.id;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme.ink);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme.id);
  } catch {}
}
