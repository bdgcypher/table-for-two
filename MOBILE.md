# Mobile Builds & Publishing

`Table for Two` ships three ways from one codebase: the PWA, an Android app and
an iOS app. The native apps are [Capacitor](https://capacitorjs.com/) shells
around the same Next.js static export.

```text
Next.js source ──next build──▶ out/ ──cap sync──▶ android/  ──▶ .apk / .aab
                                        └────────▶ ios/      ──▶ .xcarchive / .ipa
```

| Identity | Value |
| --- | --- |
| App / bundle ID | `com.tablefor2.app` |
| Display name | `Table for Two` |
| Capacitor | 8.5.3 (`android/` + `ios/` are committed) |
| Android | minSdk 24, compileSdk / targetSdk 36, AGP 8.13, Gradle 8.14.3 |
| JDK | **21** (required by the Android build) |
| iOS | Xcode project + Swift Package Manager — no CocoaPods |

> **`appId` is permanent.** It is the Android `applicationId` and the iOS bundle
> identifier, and neither can be changed once the app is live on a store.

---

## 1. Why the app is a static export

`next.config.ts` sets `output: "export"`, so `npm run build` writes plain
HTML/CSS/JS to `out/` and the installed app has **no Node server**. That has two
consequences worth remembering before you add a feature:

1. **Server Actions, Route Handlers that read the Request, cookies, headers,
   rewrites, redirects and ISR are unavailable.** Next lists them as unsupported
   for static exports and the build will fail. The app's only Server Action was
   replaced by `lib/dateSelection.ts` for exactly this reason.
2. **Image Optimization is off** (`images.unoptimized: true`). Images are served
   as the raw files in `public/`.

`trailingSlash: true` makes every route emit `<route>/index.html`, which the
Capacitor WebView resolves on a deep-link reload without any rewrite rules.

---

## 2. Local setup (once per machine)

```bash
npm install
```

You also need, only to build the **Android** side:

- **JDK 21** — `npm run android:release` will not run on JDK 17 or 25.
- **Android SDK** with `platforms;android-36` and `build-tools;36.0.0`.
  Android Studio's bundled SDK works; point `ANDROID_HOME` at it.

For the **iOS** side you need macOS with Xcode. Nothing else in this repo does.

---

## 3. Building and sideloading an APK

```bash
npm run android:debug      # → android/app/build/outputs/apk/debug/app-debug.apk
```

Install it on a connected device:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Or copy the `.apk` to the phone and open it, allowing installs from unknown
sources when prompted.

For a release build locally (needs the keystore from §4):

```bash
npm run android:release    # → .apk + .aab in android/app/build/outputs/
```

`npm run mobile:sync` rebuilds `out/` and copies it into both native projects
without compiling anything — useful before opening a native IDE:

```bash
npm run android:open       # Android Studio
npm run ios:open           # Xcode (macOS only)
```

> The web assets inside `android/` and `ios/` are **generated copies** and are
> git-ignored. Never edit them; change the Next source and re-sync.

---

## 4. Android release signing

Android requires every update to an install to be signed with the **same key**.
Generate it once and keep it safe:

```bash
npm run keystore
```

That creates `android/app/table-for-two-release.jks` and
`android/keystore.properties`, both git-ignored, and prints the password it
generated. **Back both up outside this repository and store the password in a
password manager.** If you lose this key you can never update an existing
install again — Play Store uploads and in-place sideload upgrades both depend on
it.

`android/app/build.gradle` reads that properties file. When it is absent (a
fresh clone, or CI without secrets) the build **falls back to the debug key**:
the APK is still sideloadable, but it is not Play-Store-ready and cannot upgrade
an install signed with the release key.

### Secrets for CI

Add these under **Settings → Secrets and variables → Actions** so the release
workflow can sign properly:

| Secret | Value |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | `base64 -w0 android/app/table-for-two-release.jks` |
| `ANDROID_KEYSTORE_PASSWORD` | the store password |
| `ANDROID_KEY_ALIAS` | `tablefortwo` |
| `ANDROID_KEY_PASSWORD` | the key password |

---

## 5. Cutting a release

A release is a tag push. That is the whole process:

```bash
npm version 0.0.1 --no-git-tag-version     # or edit package.json by hand
git commit -am "Release 0.0.1"
git tag -a v0.0.1 -m "Table for Two 0.0.1"
git push origin main --follow-tags
```

`.github/workflows/release.yml` then:

1. builds the static export and syncs it into the native projects;
2. builds the Android `.apk` **and** `.aab`, verifying the APK is actually signed;
3. attaches both to the GitHub Release for the tag — so every release has a
   download-and-sideload APK, permanently;
4. on macOS, archives the iOS project to prove it compiles, and exports a signed
   `.ipa` when the Apple secrets from §7 are present.

`code`, the Android `versionCode` / iOS `CURRENT_PROJECT_VERSION`, is derived from
the tag as `major*10000 + minor*100 + patch` (`0.0.1` → 1, `0.1.0` → 100). It
therefore increases on its own, which is what the Play Store requires. Preview
with `npm run version:info v0.0.1`.

Tag the version that is in `package.json` — the Android build reads
`package.json`, and a tag that disagrees only produces a warning from the
version script, not a failure.

`.github/workflows/ci.yml` runs the typecheck, the lint and the export on every
push and pull request, and asserts the five routes were actually emitted.

---

## 6. Publishing to Google Play

One-time requirements:

1. A **Google Play Developer account** (one-off $25 registration).
2. The release `.aab` from a tagged release — Play takes an app bundle, not an
   APK. The APK on the release page is for sideloading and direct distribution.

Then, in the Play Console: create the app, complete the Data safety and Content
rating forms, upload the `.aab` to a track (internal testing first), and start
with a closed track before going to production. Opt in to **Play App Signing**
so Google holds the upload key's counterpart — this is why losing the local
keystore is survivable for Play, but still not for sideload upgrades.

---

## 7. Publishing to iOS

Requirements, none of which can be satisfied from Linux:

1. A **Mac with Xcode**.
2. An **Apple Developer Program** membership (currently $99/year).
3. An App Store Connect app record for `com.tablefor2.app`.

Then either open `npm run ios:open` and use Product → Archive, or archive from
the CLI:

```bash
npm run ios:archive
```

To let CI produce a signed `.ipa`, add these secrets. Each is optional — the
workflow detects them and simply skips the signed export when they are absent:

| Secret | Value |
| --- | --- |
| `APPLE_TEAM_ID` | your 10-character Team ID |
| `APPLE_CERTIFICATE_BASE64` | `base64 -w0 distribution.p12` |
| `APPLE_CERTIFICATE_PASSWORD` | the `.p12` password |
| `APPLE_PROVISIONING_PROFILE_BASE64` | `base64 -w0 TableForTwo.mobileprovision` |

> **Not yet verified end to end.** The archive step runs on every release, but
> the signed-export path has never been executed against a real Apple account —
> treat it as a starting point and expect to adjust the `ExportOptions.plist`
> (`app-store-connect` method) to match your distribution setup.

Once an `.ipa` exists, upload it with **Transporter** or `xcrun altool`, and
distribute through TestFlight before App Store review.

---

## 8. Known gaps

- **No service worker.** The PWA is marked installable and the native app bundles
  all its assets, but there is no offline cache layer in the web build.
- **No splash-screen or status-bar plugin.** The native apps launch with
  Capacitor defaults; `@capacitor/splash-screen` and `@capacitor/status-bar` are
  the usual additions for a more finished launch.
- **Push notifications are not implemented.** `android/app/build.gradle` will
  apply the Google Services plugin automatically if you later add
  `google-services.json`.
- **`npm run ios:archive` and the CI iOS job need macOS.** Everything else works
  anywhere.
- **The iOS `.ipa` path is unverified** — see §7.
