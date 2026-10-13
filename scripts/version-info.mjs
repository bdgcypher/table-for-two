#!/usr/bin/env node
/**
 * Derives the release version for a build from a git tag (or package.json).
 *
 * Writes `name=<semver>` and `code=<integer>` lines, which is the format GitHub
 * Actions expects appended to `$GITHUB_OUTPUT`:
 *
 *   node scripts/version-info.mjs v0.0.1 >> "$GITHUB_OUTPUT"
 *
 * `code` is the Android `versionCode` / iOS `CURRENT_PROJECT_VERSION`. Android
 * requires it to increase with every upload, so it is derived arithmetically
 * from the semver rather than kept as a hand-maintained counter:
 * major*10000 + minor*100 + patch (0.0.1 → 1, 0.1.0 → 100, 1.0.0 → 10000).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function fail(message) {
  console.error(`version-info: ${message}`);
  process.exit(1);
}

const input = process.argv[2] ?? "";
const version = input.replace(/^v/, "").trim();

if (!version) {
  fail(
    "no version supplied. Pass a git tag or semver, e.g. `node scripts/version-info.mjs v0.0.1`."
  );
}

const match = /^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(version);
if (!match) {
  fail(`"${input}" is not a semver tag. Expected something like v0.0.1.`);
}

const [, major, minor, patch] = match.map(Number);
const code = major * 10000 + minor * 100 + patch;

if (code < 1) fail(`${version} produces versionCode 0; Android requires >= 1.`);

// The tag is authoritative during a release; package.json is the fallback a
// developer sees when running this by hand. Warn (don't fail) when they drift,
// since a tag necessarily leads package.json until the release commit lands.
try {
  const pkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));
  if (pkg.version && !version.startsWith(pkg.version) && pkg.version !== version) {
    console.error(
      `version-info: note — tag ${version} differs from package.json ${pkg.version}.`
    );
  }
} catch {
  // A missing or unreadable package.json must not block a release build.
}

console.log(`name=${version}`);
console.log(`code=${code}`);
