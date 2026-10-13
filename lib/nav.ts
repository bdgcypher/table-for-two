/**
 * Navigation helpers, deliberately free of React directives so the bottom nav
 * and the slide-out menu can share one definition of "the page you are on"
 * instead of each re-deriving it.
 */

/**
 * Strips a trailing slash so `/menu` and `/menu/` compare equal, while the root
 * path stays `/`.
 */
const stripTrailingSlash = (path: string): string => path.replace(/\/+$/, "") || "/";

/**
 * Whether `href` is the page currently being viewed.
 *
 * A plain `pathname === href` is not enough here: `next.config.ts` sets
 * `trailingSlash: true`, so the router reports `/menu/` while the nav item is
 * declared as `/menu`. The comparison then silently succeeds only for the
 * homepage, whose href and pathname are both `/`.
 *
 * This is an exact (normalised) match rather than a prefix match on purpose. A
 * prefix test (`pathname.startsWith(href)`) would make the `/` home item match
 * every route and highlight Home on every page.
 */
export function isActivePath(pathname: string, href: string): boolean {
  return stripTrailingSlash(pathname) === stripTrailingSlash(href);
}
