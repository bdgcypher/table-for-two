You are an expert full-stack web developer specializing in Next.js (App Router), React, Tailwind CSS, Framer Motion, and Supabase.

We are building a Progressive Web App (PWA) called **"Table for Two"**—a romantic, culinary-themed mobile-first web app for couples.

### Pre-existing App Assets
- **Logo:** `public/logo.png` is the primary branding mark, used in the home screen header and navigation. The PWA icons (`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`) are generated from it and committed — regenerate with ImageMagick rather than re-exporting by hand.
- **Visual Mockups:** Refer to `public/light-mockup.png` and `public/dark-mockup.png` for exact visual layouts, card spacing, and typography scale.

### Project Setup (Already Complete)

The project is scaffolded and running. Do not re-run `create-next-app` or reinstall dependencies. Current stack:

- Next.js **16.3.4** (App Router, Turbopack), React **19.2.4**
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- framer-motion 12, lucide-react 1.28, TypeScript 5, ESLint 9

**There is no `tailwind.config.ts`.** That file was v3-shaped and was deleted; the v4 config lives entirely in the `@theme` block at the top of `app/globals.css`. Adding one back would be dead config.

### Design Tokens

`app/globals.css` `@theme` is the single source of truth. Never hardcode a hex in a component — use the token.

| Token | Value | Use |
| --- | --- | --- |
| `primary` | `#C95D64` | primary actions, brand accents |
| `primary-hover` | `#b54f56` | hover/pressed state for primary |
| `secondary-accent` | `#629390` | teal — secondary data, progress, highlights |
| `light-bg` / `light-gray` / `light-text` | `#FFFFFF` / `#E7E7E7` / `#3C3C3C` | light mode surfaces |
| `dark-bg` / `dark-canvas` / `dark-surface` | `#000000` / `#0B0B0C` / `#212121` | dark mode: `dark-bg` is app background, `dark-canvas` is the `body`, `dark-surface` is cards |
| `dark-gray` / `dark-text` | `#3C3C3C` / `#E7E7E7` | dark mode text and borders |

Fonts: headings `font-heading` (Berkshire Swash), body `font-paragraph` (Montserrat Alternates). Both are next/font variables wired in `app/layout.tsx`; there are no `--font-lora` references.

### Project Architecture Specifications

1. **Framework & Setup:**
   - Next.js 16 with App Router (`app/` directory structure).
   - Tailwind v4 with dual Light/Dark Mode support via the `@custom-variant dark` selector and a `dark` class on `<html>`.
   - Lucide React for iconography and Framer Motion for animations.

2. **Application Layout Structure:**
   - Each page renders its own `min-h-screen px-4 md:px-8 pt-6 pb-28 md:pb-12 flex flex-col` container. There is no shared `max-w-md` wrapper; the app shell lives in `app/layout.tsx` (`BottomNav` + `main`), with a 1600px max-width cap at `2xl`.
   - Sticky bottom navigation with 4 tabs (`components/BottomNav.tsx` → `navItems`), plus a slide-out menu and a `/preferences` page:
     1. **Home** (`/`) - Welcome banner, "Relationship Harmony & Sync" card, "Today's Specials" carousel, "Spin the Date Wheel" CTA, and "Spark a Conversation" carousel.
     2. **Menu** (`/menu`) - "Daily Menu" with "Entrees" (grand gestures) and "Sides & Desserts" (quick check-ins).
     3. **Dates** (`/dates`) - "Date Spinner Wheel" with a `secondary-accent` filter button, and "Past Dates & Memories".
     4. **Conversations** (`/conversations`) - "Quick Convos" card deck, "Browse Topics" search, and "Saved Conversations".
     5. **Preferences** (`/preferences`) - theme selection, reached from the slide-out menu.

3. **Key Component: The Date Spinner (`components/DateSpinner.tsx`)**
   - Interactive Framer Motion SVG wheel with spring physics on spin, calling the server action in `app/dates/actions.ts`.
   - Segment fills reference tokens via CSS variables (`var(--color-primary)`, `var(--color-dark-surface)`, `var(--color-light-gray)`) rather than literals.
   - Center button ("SPIN THE DATE WHEEL!"), top indicator pin, `secondary-accent` filter modal, and a `role="alert"` error card that distinguishes a network failure from "no matches".

4. **PWA Configuration:**
   - `public/manifest.json` is standalone (`"display": "standalone"`) with separate `any` and `maskable` icons. The `any` icons are circular; the maskable icon stays full-bleed square because Android applies its own mask, and `apple-touch-icon.png` stays square because iOS does not support transparency.
   - `viewport-fit=cover` and the `themeColor` array are set in `app/layout.tsx`. `themeColor` must stay a literal hex — Next does not resolve tokens there.

### Conventions

- **No hardcoded colors in components.** Tokens only, including inside SVG fills.
- **Reveal animations:** use `components/Reveal.tsx` (`RevealDiv` / `RevealSection` / `RevealHeader`) with a `delay` for staggering. It renders the same element it replaces via `motion.create()` — never wrap a grid item, or its `col-span-*` lands on the wrong node. Anything with reduced-motion needs a `prefers-reduced-motion` path; the app shell wraps everything in `<MotionConfig reducedMotion="user">` so framer animations drop their transform automatically, while the CSS keyframes in `globals.css` (`.flame-flicker`, `.flame-letter`) opt out explicitly.
- **localStorage stores** are module-level singletons built on `useSyncExternalStore` with a `storage` listener — see `components/useSavedConversations.ts`. Do not use `useEffect` + `setState`; the repo's ESLint config rejects state updates in effects. Keys are namespaced: `t42-theme`, `t42-saved-convos`.
- **Theme** is applied by a pre-paint inline script in `app/layout.tsx` (`lib/theme.ts`) because the server cannot know the preference. `getServerSnapshot` returns `"dark"`, so first paint is always light-mode classes and the script corrects it before paint.
- **Data lives in React-free modules** under `lib/` (`specials.ts`, `conversationTopics.ts`, `dateOptions.ts`, `theme.ts`) so pages stay presentational.
- **Verify before claiming done:** `npx tsc --noEmit`, `npx eslint app components lib`, `npm run build`. One known warning is expected: `_date` is unused in `handleDateSelected` because the `DateSpinner` prop type requires it.
- Splitting text into per-character spans (the streak label) needs a `sr-only` copy of the real string alongside the `aria-hidden` animated one, or screen readers announce it letter by letter.

### Supabase Setup (Planned — Not Yet Implemented)

> **Status: intentionally deferred.** The app is fully functional on `localStorage` today. Nothing below is wired up yet; this section is the plan to follow when persistence moves server-side.

#### What Already Exists
- `@supabase/supabase-js` is installed and `lib/supabase.ts` holds a `createClient` call with placeholder fallbacks, so importing it never crashes before setup.
- `components/useSavedConversations.ts` is the reference pattern to mirror: a module-level store built on `useSyncExternalStore`, with a `storage` listener for cross-tab updates and a namespaced key (`t42-saved-convos`).
- The theme (`t42-theme`) is applied by a pre-paint inline script in `app/layout.tsx` (see `lib/theme.ts`).

#### Environment Variables
Add to `.env.local` (keys are in the project dashboard under Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

- The `NEXT_PUBLIC_` prefix means the value is inlined into the client bundle. The anon key is designed to be public — **only** safe because Row Level Security is enabled on every table.
- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS entirely and must never be imported into a `"use client"` file. Server Components, Route Handlers, and Server Actions (`app/dates/actions.ts`) are the only places it belongs. Prefer anon + RLS unless a task genuinely needs to bypass it.
- Once real credentials exist, replace the placeholder fallbacks in `lib/supabase.ts` with a hard failure so a missing env var is loud instead of silently pointing at a fake project.

#### Proposed Schema
Every table is scoped to a `couple_id`; two partner accounts share one `couples` row.

- `couples` — `id` (uuid, pk), `created_at`, `invite_code` (text, unique), `partner_a` / `partner_b` (uuid → `auth.users`, nullable until the second partner joins).
- `streaks` — `couple_id` (pk), `current_days` (int), `last_completed_on` (date). Replaces the hardcoded `streakDays` in `app/page.tsx`.
- `harmony_scores` — `couple_id`, `recorded_on` (date), `score` (int). Replaces the hardcoded `harmonyPct = 98`.
- `saved_conversations` — `id`, `couple_id`, `topic_id` (text, from `lib/conversationTopics.ts`), `saved_at`. Mirrors the current localStorage shape so the migration is a straight copy.
- `specials_completed` — `couple_id`, `special_id` (text, from `lib/specials.ts`), `completed_at`.
- `menu_selections` — `couple_id`, `special_id`, `selected_for` (date). Backs the `/menu` order summary, which is currently component state only.
- `date_nights` — `id`, `couple_id`, `spun_option`, `completed_on`, `rating`, `memory_note`. Gives `/dates` the "Past Dates & Memories" history it currently hardcodes.

#### Security — Row Level Security
RLS is mandatory, not optional: the anon key ships to every browser, so without policies the database is world-readable and writable.

1. Enable RLS on every table above.
2. Add a helper such as `is_member(target_couple uuid)` returning true when `auth.uid()` matches `partner_a` or `partner_b` on that couple.
3. Write `USING (is_member(couple_id))` policies for `SELECT`/`INSERT`/`UPDATE`/`DELETE` on each table.

#### Auth & Pairing
- Email magic link or OTP via `supabase.auth` — no passwords to store for a two-person app.
- Pairing flow: the first partner signs up and creates a `couples` row, receiving a short `invite_code`. The second partner enters that code to claim `partner_b`.
- Reuse the pairing moment to insert both auth users into `couples`, which is what every RLS policy keys off.

#### Realtime
The home card already claims "Both partner devices synchronized." Supabase Realtime subscriptions on `harmony_scores`, `streaks`, and `date_nights` would make that literally true — one partner completing a special updates the other's card without a refresh.

#### Migration Order
1. Create the project, add env vars, replace the placeholders in `lib/supabase.ts`.
2. Apply the schema and RLS policies; verify from the dashboard that anon access is denied by default.
3. Build auth and the pairing flow.
4. Migrate data **read-path first, write-path second** — dual-write to localStorage while the server catches up, then cut over. Saved conversations are the best first candidate since the store already has a clean shape.
5. Only then delete the localStorage fallbacks, one key at a time.

#### Explicitly Stays Local
Do **not** migrate the theme preference. `t42-theme` has to be readable synchronously before first paint (see the inline script in `app/layout.tsx`); a network round-trip would reintroduce the light flash that script exists to prevent. Same reasoning for anything else read during first render.

### Known Gaps
- `streakDays` (`app/page.tsx`) and `harmonyPct` are hardcoded constants, as are the partner names and the past-dates list. The Supabase tables above are what will eventually replace them.
- Specials `e2` and `e3` have no `image`, so `SHOWCASE_SPECIALS` filters them out and the home carousel only ever shows 3 of the 9 specials.
- There is no test runner and no test files. `lib/` is the natural first target.
