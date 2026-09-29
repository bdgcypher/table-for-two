"use server";

import type { DateOption } from "@/lib/dateOptions";
import { INITIAL_DATE_OPTIONS } from "@/lib/dateOptions";

/**
 * Backend date selection.
 *
 * The wheel UI is purely visual — segments carry no meaning. The server picks
 * the winning date idea (respecting the active vibe/budget/location filters)
 * and the client animates a decorative spin while it waits for the result.
 * Swap the pool + Math.random here for a Supabase query when the database is
 * wired up.
 */
export async function selectRandomDate(filters: {
  category?: string;
  location?: string;
  budget?: string;
}): Promise<DateOption | null> {
  const pool = INITIAL_DATE_OPTIONS.filter((item) => {
    if (filters.category && filters.category !== "all" && item.category !== filters.category) return false;
    if (filters.location && filters.location !== "all" && item.location !== filters.location) return false;
    if (filters.budget && filters.budget !== "all" && item.cost !== filters.budget) return false;
    return true;
  });

  const candidates = pool.length >= 2 ? pool : INITIAL_DATE_OPTIONS;

  if (candidates.length === 0) return null;

  // Server-side random selection — the source of truth for the result.
  return candidates[Math.floor(Math.random() * candidates.length)];
}
