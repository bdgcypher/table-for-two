/**
 * Theme storage shared between the client-side store (components/ThemeProvider)
 * and the bootstrap script the server injects before first paint.
 *
 * Deliberately React-free and outside the "use client" boundary, so the root
 * layout — a server component — can read the storage key and the script body
 * without pulling the provider across. One key, one script, no drift.
 */
export const THEME_STORAGE_KEY = "t42-theme";

/**
 * Applies the saved theme to <html> before the browser paints.
 *
 * Without this the server has no way to know the visitor's preference, so the
 * first paint always uses the light classes and a dark-theme user sees a light
 * flash before React hydrates and corrects it. This runs synchronously during
 * parse, ahead of any paint.
 *
 * MUST stay in step with `getSnapshot` and `systemTheme` in ThemeProvider:
 * a saved "light"/"dark" wins, otherwise fall back to the OS preference.
 * Only the storage read is guarded, so a browser that throws on localStorage
 * (some private modes) still gets a theme applied rather than no class at all.
 */
export const THEME_INIT_SCRIPT = `(function(){var k=${JSON.stringify(
  THEME_STORAGE_KEY
)},s=null;try{s=localStorage.getItem(k)}catch(e){}var d="light";try{d=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch(e){}var t=(s==="light"||s==="dark")?s:d;document.documentElement.classList.toggle("dark",t==="dark");})();`;
