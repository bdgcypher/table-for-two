import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Native shell configuration.
 *
 * The web app is a Next.js static export (`next.config.ts` → `output: "export"`),
 * so `webDir` points at `out/`. `npx cap sync` copies that directory into the
 * committed `android/` and `ios/` projects; those copies are generated output
 * and must never be hand-edited — change the Next source and re-sync.
 *
 * `appId` is permanent: it is the Android `applicationId` and the iOS bundle
 * identifier, and neither can be changed once an app is live on a store.
 */
const config: CapacitorConfig = {
  appId: "com.tablefor2.app",
  appName: "Table for Two",
  webDir: "out",
};

export default config;
