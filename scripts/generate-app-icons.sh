#!/usr/bin/env bash
#
# Generates the native launcher icons (Android + iOS) from the brand mark.
#
# Run after the logo changes. Committed output lives in:
#   android/app/src/main/res/mipmap-*/ic_launcher{,_round,_foreground}.png
#   android/app/src/main/res/values/ic_launcher_background.xml          (light)
#   android/app/src/main/res/values-night/ic_launcher_background.xml    (dark)
#   ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png       (light)
#   ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x-dark.png  (dark)
#
#   npm run icons:native
#
# Design: the brand mark in `primary` rose on a white backdrop, matching the
# existing web icons (public/icon-512.png is the same mark on a white circle),
# and the same mark on the `dark-canvas` backdrop for dark mode. Android's
# adaptive icon gets the mark on a *transparent* foreground so the launcher can
# apply its own mask over the plate colour, which is why the plate is a colour
# resource and not part of the artwork.
#
# Only the mark's ALPHA channel is used. The source is a flat-coloured raster,
# so rebuilding the shape from its coverage avoids the colour fringing that
# upscaling the full-colour PNG would leave along every edge.
set -euo pipefail

cd "$(dirname "$0")/.."

SRC="${ICON_SOURCE:-public/logo.png}"
# --color-primary from app/globals.css — the mark is already drawn in it.
BRAND="${ICON_BRAND_COLOR:-#C95D64}"
# --color-dark-canvas: the dark-mode plate, so the icon matches the app's own
# dark background rather than reading as a hole punched in the wallpaper.
DARK="${ICON_DARK_COLOR:-#0B0B0C}"
PLATE_LIGHT="${ICON_LIGHT_COLOR:-#FFFFFF}"

# ── How much of each canvas the mark fills ──────────────────────────────────
# A percentage of the canvas that the mark's bounding box spans. The artwork is
# a full-bleed illustration — its ink reaches the corners of its own bounding
# box — so each number is bounded by the tightest mask that surface is put
# under, not by what merely looks tidy:
#
#   adaptive 46  bounded by Android's 66dp safe circle; see the check below
#   legacy   62  pre-API-26 launchers draw the bitmap unmasked, and it shares a
#                home screen with the adaptive icon, so it stays close to it
#   round    56  sits inside the ic_launcher_round disc
#   ios      66  inside the squircle iOS masks it with, clear of the corners
#
# ICON_SCALE multiplies all of them, so the whole set can be nudged in one step:
#   ICON_SCALE=90 npm run icons:native     # 10% smaller on every surface
SCALE="${ICON_SCALE:-100}"
case "$SCALE" in
  '' | *[!0-9]*)
    echo "error: ICON_SCALE must be a whole percentage, got '${SCALE}'." >&2
    exit 1
    ;;
esac
scale() { echo $(( $1 * SCALE / 100 )); }
FILL_ADAPTIVE=$(scale 46)
FILL_IOS=$(scale 66)
FILL_LEGACY=$(scale 62)
FILL_ROUND=$(scale 56)

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
# ImageMagick stamps a creation time into every PNG it writes, so without this
# two runs of this script differ in bytes with nothing actually changed — and a
# "zoom the mark 5%" tweak would land as a diff of all 20 files.
PNG_OPTS=(-define png:exclude-chunks=date,time)

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
    -alpha off -compose CopyOpacity -composite "${PNG_OPTS[@]}" "$out"
}

# The mark on an opaque plate of the given colour — the icon shape iOS masks
# with its squircle, and what legacy (pre-API-26) Android launchers show raw.
plate_tile() { # size fill colour out
  local size=$1 fill=$2 color=$3 out=$4
  rose_mark "$size" "$fill" "$WORK/_m.png"
  magick -size "${size}x${size}" xc:"$color" "$WORK/_m.png" \
    -gravity center -composite -alpha off "${PNG_OPTS[@]}" "$out"
}

# The mark on a plate-coloured disc, transparent outside it — ic_launcher_round.
plate_disc() { # size fill colour out
  local size=$1 fill=$2 color=$3 out=$4
  local r=$((size / 2))
  rose_mark "$size" "$fill" "$WORK/_m.png"
  magick -size "${size}x${size}" xc:none \
    -fill "$color" -draw "circle $r,$r $r,0" \
    "$WORK/_m.png" -gravity center -composite "${PNG_OPTS[@]}" "$out"
}

# ── 3. Android ──────────────────────────────────────────────────────────────
declare -A LEGACY=([mdpi]=48 [hdpi]=72 [xhdpi]=96 [xxhdpi]=144 [xxxhdpi]=192)
declare -A ADAPTIVE=([mdpi]=108 [hdpi]=162 [xhdpi]=216 [xxhdpi]=324 [xxxhdpi]=432)

for d in mdpi hdpi xhdpi xxhdpi xxxhdpi; do
  L="${LEGACY[$d]}"
  A="${ADAPTIVE[$d]}"
  mkdir -p "$OUT/mipmap-$d"
  plate_tile "$L" "$FILL_LEGACY" "$PLATE_LIGHT" "$OUT/mipmap-$d/ic_launcher.png"
  plate_disc "$L" "$FILL_ROUND" "$PLATE_LIGHT" "$OUT/mipmap-$d/ic_launcher_round.png"
  rose_mark  "$A" "$FILL_ADAPTIVE" "$OUT/mipmap-$d/ic_launcher_foreground.png"
done

# The adaptive icon is 108dp with only the middle 72dp guaranteed visible, and a
# 66dp diameter circle inside that is the area no launcher mask is allowed to
# clip. Anything the foreground draws outside the circle is silhouette the user
# never sees — which is the whole reason FILL_ADAPTIVE is capped at 46%.
#
# Checked on the real output rather than trusted from the number above, so that
# ICON_SCALE (or a heavier mark) cannot quietly reintroduce clipped corners.
SAFE_CHECK="$OUT/mipmap-xxxhdpi/ic_launcher_foreground.png"
SAFE_SIZE=432
SAFE_R=$((SAFE_SIZE * 33 / 108))
leaks=$(magick "$SAFE_CHECK" \
  \( -size "${SAFE_SIZE}x${SAFE_SIZE}" xc:none -fill white \
     -draw "circle $((SAFE_SIZE / 2)),$((SAFE_SIZE / 2)) $((SAFE_SIZE / 2 + SAFE_R)),$((SAFE_SIZE / 2))" \) \
  -compose DstOut -composite -alpha extract -format '%[fx:mean>0.0001?1:0]' info:)
if [ "$leaks" != "0" ]; then
  echo "error: the adaptive foreground is drawn outside Android's 66dp safe zone" >&2
  echo "       and would be clipped by launcher masks." >&2
  echo "       Lower ICON_SCALE (currently ${SCALE}%) or FILL_ADAPTIVE." >&2
  exit 1
fi
echo "safe zone ok (mark ${FILL_ADAPTIVE}% of the 108dp canvas, ink inside the 66dp circle)"

# The adaptive background is a colour resource, not artwork: the launcher masks
# the two layers together, and the foreground's transparent surround lets this
# colour show through. values-night is the icon's dark-mode version — the
# adaptive-icon XMLs reference this colour by name, so the launcher swaps the
# plate itself and no second icon definition is needed.
write_plate() { # dirname colour
  local dir="android/app/src/main/res/$1"
  mkdir -p "$dir"
  cat > "$dir/ic_launcher_background.xml" <<EOF
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">$2</color>
</resources>
EOF
}
write_plate values "$PLATE_LIGHT"
write_plate values-night "$DARK"
echo "plates: values=$PLATE_LIGHT  values-night=$DARK"

# No mipmap-night legacy icons on purpose: the adaptive icon supersedes them on
# every device that has a dark mode (API 26+ takes mipmap-anydpi-v26 over the
# density bitmaps), and night mode itself only exists from API 29.

# ── 4. iOS ──────────────────────────────────────────────────────────────────
# One 1024px universal icon per appearance. iOS rejects icons containing alpha,
# so both are flattened onto their plate. The dark one is picked up
# automatically by iOS 18+ in dark mode once the asset catalog lists it.
IOS_DIR="ios/App/App/Assets.xcassets/AppIcon.appiconset"
mkdir -p "$OUT/AppIcon.appiconset"
plate_tile 1024 "$FILL_IOS" "$PLATE_LIGHT" "$OUT/AppIcon.appiconset/AppIcon-512@2x.png"
plate_tile 1024 "$FILL_IOS" "$DARK" "$OUT/AppIcon.appiconset/AppIcon-512@2x-dark.png"

[ -f "$IOS_DIR/Contents.json" ] || {
  echo "error: $IOS_DIR/Contents.json is missing; cannot verify the icon set." >&2
  exit 1
}
# A file in the icon set that Contents.json does not list is ignored at runtime
# (and reported by Xcode as an unassigned child), so assert the wiring here
# rather than shipping an icon that never appears.
for f in AppIcon-512@2x.png AppIcon-512@2x-dark.png; do
  grep -q "\"$f\"" "$IOS_DIR/Contents.json" || {
    echo "error: $IOS_DIR/Contents.json does not reference $f." >&2
    echo "       Add it with an appearance of {\"appearance\":\"luminosity\",\"value\":\"dark\"}." >&2
    exit 1
  }
done
grep -q '"value"[[:space:]]*:[[:space:]]*"dark"' "$IOS_DIR/Contents.json" || {
  echo "error: $IOS_DIR/Contents.json has no dark appearance; the dark icon would be unused." >&2
  exit 1
}

# ── 5. Install (only once every icon built and checked) ─────────────────────
for d in mdpi hdpi xhdpi xxhdpi xxxhdpi; do
  cp "$OUT/mipmap-$d/"*.png "android/app/src/main/res/mipmap-$d/"
done
cp "$OUT/AppIcon.appiconset/AppIcon-512@2x.png" "$IOS_DIR/AppIcon-512@2x.png"
cp "$OUT/AppIcon.appiconset/AppIcon-512@2x-dark.png" "$IOS_DIR/AppIcon-512@2x-dark.png"

echo "Installed:"
echo "  android/app/src/main/res/mipmap-*/ic_launcher.png            (48-192px)"
echo "  android/app/src/main/res/mipmap-*/ic_launcher_round.png      (48-192px)"
echo "  android/app/src/main/res/mipmap-*/ic_launcher_foreground.png (108-432px)"
echo "  android/app/src/main/res/values{,-night}/ic_launcher_background.xml"
echo "  $IOS_DIR/AppIcon-512@2x{,-dark}.png (1024px)"
