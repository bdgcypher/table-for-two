"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Manually saved conversations, persisted to localStorage.
 *
 * Saved items are stored as one object keyed by topic id, so a save is a
 * single-key round trip. This is intentionally client-only for now — the
 * eventual Supabase migration should replace the storage helpers below and
 * leave the rest of the page untouched.
 */
const STORAGE_KEY = "t42-saved-convos";

export type SavedConversations = Record<string, string>; // topicId -> ISO save timestamp

const EMPTY: SavedConversations = {};

// Cached snapshot + listeners. useSyncExternalStore requires getSnapshot to
// return a referentially stable value, so we re-parse only when the raw
// localStorage string actually changes.
let cache: SavedConversations = EMPTY;
let cacheRaw: string | null = null;
const listeners = new Set<() => void>();

function parse(raw: string | null): SavedConversations {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as SavedConversations;
    }
    return EMPTY;
  } catch {
    // Corrupt or unreadable storage should never break the page.
    return EMPTY;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Keep other tabs of the app in sync with the same storage key.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    cacheRaw = null;
    emit();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): SavedConversations {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    cache = parse(raw);
  }
  return cache;
}

function getServerSnapshot(): SavedConversations {
  return EMPTY;
}

function write(next: SavedConversations) {
  cache = next;
  cacheRaw = null;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota or private-mode failure: keep the in-memory state anyway.
  }
  emit();
}

export function useSavedConversations() {
  const saved = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleSave = useCallback((id: string) => {
    const next = { ...getSnapshot() };
    if (next[id]) {
      delete next[id];
    } else {
      next[id] = new Date().toISOString();
    }
    write(next);
  }, []);

  return useMemo(
    () => ({ saved, toggleSave, hydrated: true }),
    [saved, toggleSave]
  );
}
