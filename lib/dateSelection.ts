/**
 * Local date selection.
 *
 * This used to be a Server Action (`app/dates/actions.ts`). It moved here
 * because the app now ships as a native bundle built with `output: "export"`,
 * and a static export cannot contain Server Actions — see
 * `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`
 * ("Unsupported Features" → Server Actions).
 *
 * Behaviour is unchanged from the server version: the filter is applied, and
 * when it leaves fewer than two candidates the whole pool is used instead, so
 * over-narrow filters still return something rather than dead-ending.
 *
 * Free of React directives so it can be imported from Client Components and,
 * later, Server code alike.
 */
import type { DateOption } from "./dateOptions";
import { INITIAL_DATE_OPTIONS } from "./dateOptions";

export interface DateFilters {
  category?: string;
  location?: string;
  budget?: string;
}

/** The subset of `pool` matching the active filters. */
export function filterDateOptions(
  filters: DateFilters,
  pool: DateOption[] = INITIAL_DATE_OPTIONS
): DateOption[] {
  return pool.filter((item) => {
    if (filters.category && filters.category !== "all" && item.category !== filters.category) return false;
    if (filters.location && filters.location !== "all" && item.location !== filters.location) return false;
    if (filters.budget && filters.budget !== "all" && item.cost !== filters.budget) return false;
    return true;
  });
}

/**
 * The pool a spin draws from. Kept separate from {@link selectRandomDate} so
 * the "N Date Ideas Ready" counter in `components/DateSpinner.tsx` and the spin
 * itself can never disagree about which ideas are in play.
 */
export function candidateDateOptions(
  filters: DateFilters,
  pool: DateOption[] = INITIAL_DATE_OPTIONS
): DateOption[] {
  const matches = filterDateOptions(filters, pool);
  return matches.length >= 2 ? matches : pool;
}

/** Picks the winning date idea. `null` only when the pool is empty. */
export function selectRandomDate(
  filters: DateFilters,
  pool: DateOption[] = INITIAL_DATE_OPTIONS
): DateOption | null {
  const candidates = candidateDateOptions(filters, pool);
  if (candidates.length === 0) return null;

  return candidates[Math.floor(Math.random() * candidates.length)];
}
