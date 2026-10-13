#!/usr/bin/env bash
#
# Generates the native launcher icons (Android + iOS) from the brand mark.
#
# Run after the logo changes. Committed output lives in:
#   android/app/src/main/res/mipmap-*/ic_launcher{,_round,_foreground}.png
#   ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png
#
#   npm run icons:native
#
# Design: the brand mark in `primary` rose on a white backdrop, matching the
# existing web icons (public/icon-512.png is the same mark on a white circle).
# Android's adaptive icon gets the mark on a *transparent* foreground so the
# launcher can apply its own mask over the white background colour.
#
# Only the mark's ALPHA channel is used. The source is a flat-coloured raster,
# so rebuilding the shape from its coverage avoids the colour fringing that
# upscaling the full-colour PNG would leave along every edge.
set -euo pipefail

cd "$(dirname "$0")/.."

SRC="${ICON_SOURCE:-public/logo.png}"
# --color-primary from app/globals.css — the mark is already drawn in it.
BRAND="${ICON_BRAND_COLOR:-#C95D64}"

command -v magick >/dev/null 2>&1 || {
  echo "error: ImageMagick 7 (magick) is required." >&2
  exit 1
}
[ -f "$SRC" ] || {
  echo "error: brand mark not found at $SRC" >&2
  exit 1
}

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
OUT="$WORK/out"
mkdir -p "$OUT"

# ── 1. Build one high-quality shape mask ────────────────────────────────────
# Upscaled once with Lanczos and then steepened with -level: the source mark is
# only ~243px tall, so the level pass is what keeps a 1024px icon from looking
# like a straight 4x blur.
magick "$SRC" -alpha extract -trim +repage "$WORK/mask-trim.png"
magick "$WORK/mask-trim.png" -filter Lanczos -resize x1400 -level 28%,72% "$WORK/mask.png"
echo "mask built from $SRC (mark $(identify -quiet -format '%wx%h' "$WORK/mask-trim.png"))"

# ── 2. Helpers ──────────────────────────────────────────────────────────────

# The mark's coverage on a full-canvas black field, so CopyOpacity defines alpha
# across the whole icon rather than only where the scaled mark happens to sit.
alpha_field() { # size fill out
  local size=$1 fill=$2 out=$3
  local dim=$((size * fill / 100))
  magick -size "${size}x${size}" xc:black \
    \( "$WORK/mask.png" -resize "${dim}x${dim}" \) \
    -gravity center -composite "$out"
}

# The mark in the brand rose, transparent everywhere else.
rose_mark() { # size fill out
  local size=$1 fill=$2 out=$3
  alpha_field "$size" "$fill" "$WORK/_a.png"
  magick -size "${size}x${size}" xc:"$BRAND" "$WORK/_a.png" \
    -alpha off -compose CopyOpacity -composite "$out"
}

# The mark on an opaque white square — the icon shape iOS applies its own
# squircle mask to, and what legacy (pre-API-26) Android launchers show raw.
white_tile() { # size fill out
  local size=$1 fill=$2 out=$3
  rose_mark "$size" "$fill" "$WORK/_m.png"
  magick -size "${size}x${size}" xc:white "$WORK/_m.png" \
    -gravity center -composite -alpha off "$out"
}

# The mark on a white disc, transparent outside it — for ic_launcher_round.
white_disc() { # size fill out
  local size=$1 fill=$2 out=$3
  local r=$((size / 2))
  rose_mark "$size" "$fill" "$WORK/_m.png"
  magick -size "${size}x${size}" xc:none \
    -fill white -draw "circle $r,$r $r,0" \
    "$WORK/_m.png" -gravity center -composite "$out"
}

# ── 3. Android ──────────────────────────────────────────────────────────────
# Adaptive icons are 108dp with only the middle 66dp guaranteed visible, so the
# foreground mark has to stay well inside 60% or launchers crop it.
declare -A LEGACY=([mdpi]=48 [hdpi]=72 [xhdpi]=96 [xxhdpi]=144 [xxxhdpi]=192)
declare -A ADAPTIVE=([mdpi]=108 [hdpi]=162 [xhdpi]=216 [xxhdpi]=324 [xxxhdpi]=432)

for d in mdpi hdpi xhdpi xxhdpi xxxhdpi; do
  L="${LEGACY[$d]}"
  A="${ADAPTIVE[$d]}"
  D="android/app/src/main/res/mipmap-$d"
  mkdir -p "$OUT/mipmap-$d"
  white_tile   "$L" 68 "$OUT/mipmap-$d/ic_launcher.png"
  white_disc   "$L" 62 "$OUT/mipmap-$d/ic_launcher_round.png"
  rose_mark    "$A" 60 "$OUT/mipmap-$d/ic_launcher_foreground.png"
done

# The adaptive background is a colour resource, already white to match.
BG_RES="android/app/src/main/res/values/ic_launcher_background.xml"
grep -q '#FFFFFF' "$BG_RES" || {
  echo "error: $BG_RES is not white; the foreground mark assumes a white backdrop." >&2
  exit 1
}

# ── 4. iOS ──────────────────────────────────────────────────────────────────
# One 1024px universal icon. iOS rejects icons containing alpha, so it is
# flattened onto white.
IOS_DIR="ios/App/App/Assets.xcassets/AppIcon.appiconset"
mkdir -p "$OUT/AppIcon.appiconset"
white_tile 1024 72 "$OUT/AppIcon.appiconset/AppIcon-512@2x.png"
[ -f "$IOS_DIR/Contents.json" ] || {
  echo "error: $IOS_DIR/Contents.json is missing; cannot verify the icon set." >&2
  exit 1
}

# ── 5. Install (only once every icon built successfully) ────────────────────
for d in mdpi hdpi xhdpi xxhdpi xxxhdpi; do
  cp "$OUT/mipmap-$d/"*.png "android/app/src/main/res/mipmap-$d/"
done
cp "$OUT/AppIcon.appiconset/AppIcon-512@2x.png" "$IOS_DIR/AppIcon-512@2x.png"

echo "Installed:"
echo "  android/app/src/main/res/mipmap-*/ic_launcher.png            (48-192px)"
echo "  android/app/src/main/res/mipmap-*/ic_launcher_round.png      (48-192px)"
echo "  android/app/src/main/res/mipmap-*/ic_launcher_foreground.png (108-432px)"
echo "  $IOS_DIR/AppIcon-512@2x.png (1024px)"
