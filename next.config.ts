import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * The app is packaged as a native Android/iOS bundle by Capacitor, so the
   * whole site is exported to static HTML/JS/CSS in `out/` and loaded from the
   * device — there is no Node server at runtime in the installed app.
   *
   * Consequence to keep in mind: features that need a server are unavailable
   * here. Per the Next docs (01-app/02-guides/static-exports.md → "Unsupported
   * Features") that includes Server Actions, Route Handlers that read the
   * Request, cookies, headers, rewrites, redirects and ISR. The one Server
   * Action this app had was replaced by `lib/dateSelection.ts`.
   */
  output: "export",

  /*
   * Emit every route as `<route>/index.html` instead of `<route>.html`. A plain
   * static file server (and the Capacitor WebView reloading a deep link such as
   * `/dates/`) resolves the directory form without any rewrite rules.
   */
  trailingSlash: true,

  images: {
    /*
     * Image Optimization requires a server, so the default loader cannot be
     * used with a static export. Every image in this app is already a local
     * file in `public/`, so there is nothing to optimize on demand.
     */
    unoptimized: true,
  },
};

export default nextConfig;
