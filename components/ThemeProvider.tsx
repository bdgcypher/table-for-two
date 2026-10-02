"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = THEME_STORAGE_KEY;

/**
 * Theme is stored in localStorage and applied as a class on <html>. Reading it
 * through useSyncExternalStore (rather than useEffect + setState) keeps the
 * SSR markup and the first client render in agreement, which is what the
 * previous `mounted` opacity-fade hack was working around.
 *
 * The class is first put on <html> by the pre-paint script in the root layout
 * (see THEME_INIT_SCRIPT); this module owns every change after hydration.
 */
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Preferred color scheme, used until the user picks a theme explicitly. */
function systemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

let cache: Theme | null = null;

function getSnapshot(): Theme {
  if (typeof window === "undefined") return "dark";
  if (cache) return cache;
  // Guarded for the same reason as the pre-paint script: some private modes
  // throw on localStorage access, and this runs during render, where an
  // exception would take the whole page down.
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {
    // fall through to the system preference
  }
  cache = saved === "light" || saved === "dark" ? (saved as Theme) : systemTheme();
  return cache;
}

/** Server render assumes dark, matching the previous default state. */
function getServerSnapshot(): Theme {
  return "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
}

function write(theme: Theme) {
  cache = theme;
  applyTheme(theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Quota or private-mode failure: keep the in-memory value anyway.
  }
  emit();
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // The store only reports the value; something still has to put it on <html>.
  // Without this the class is written by `write` alone, so it is only ever
  // applied when the user changes the theme by hand — a reload would read the
  // saved preference correctly and then never act on it. Running it on every
  // theme change also covers the cross-tab `storage` events, since those push
  // a new value through the store.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    write(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    write(theme === "dark" ? "light" : "dark");
  }, [theme]);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div className="contents">{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
