# Table for Two — Feature & Monetization Roadmap

This document maps the proposed premium feature set (Freemium / Subscription /
Expansion Packs) against **what is actually in the repository today**, so every
tier decision can be made against shipped code instead of a plan.

Verified against the codebase on **2026-10-12**. Sources of truth are the `lib/`
data modules, the four tab pages, `components/DateSpinner.tsx`,
`components/useSavedConversations.ts`, and the deferred **Supabase Setup** and
**Known Gaps** sections of `PROMPT.md`.

---

## 1. Status Legend

| Status | Meaning |
| --- | --- |
| **Built** | Shipped and working in the app today. |
| **Partial** | Some of the data model or UI exists; the feature is not usable end-to-end. |
| **Missing** | Nothing in the repo implements this. |
| **Blocked** | Cannot be built until a prerequisite lands (almost always: Supabase auth + server-side entitlements). |

> **The single most important fact for this roadmap:** the app is 100%
> client-side on `localStorage` today, and the Supabase layer is *intentionally
> deferred* (`PROMPT.md` → "Supabase Setup (Planned — Not Yet Implemented)").
> Content can be tiered immediately, but **a real paywall requires server truth**
> — see §6.

---

## 2. Pillar 1 — Love Language Menu

**Lives in:** `app/menu/page.tsx` (UI) + `lib/specials.ts` (data, React-free).

### What already exists

- 9 pre-written specials from one shared `SPECIALS` array: 4 **Entrees (Grand
  Gestures)** + 5 **Sides & Desserts**, split by `category`.
- Per item: `time`, `priceTag` (♥ / ♥♥ / ♥♥♥), short `prompt`, long
  `description`, optional `recipePairing`, optional `image`, plus `difficulty`
  and `badge`.
- A tap-to-select flow with an "N items added to your love menu!" summary and a
  Clear Order button.
- Love languages are present as human-readable `badge` strings: *Words of
  Affirmation 💬*, *Quality Time 🕰️*, *Act of Service 🫶*, plus playful/utility
  badges (*Sweet Connection 🍰*, *Written Words ✍️*, *Device-Free Treat 📵*,
  *Bake Together 🧑🍳*, *Playful Challenge 😄*).

### Gap analysis

| Proposed feature | Status | Notes |
| --- | --- | --- |
| Menu (Basic) — pre-written items, no editing | **Built** | The whole `/menu` page is exactly this. |
| Menu (Basic) — "3 interactions *per love language*" | **Partial** | There is **no structured love-language field**. `badge` is free text, so "how many items does Acts of Service have?" is not answerable in code. Needs `loveLanguage: "words" \| "time" \| "service" \| "gifts" \| "touch"` on `Special`. |
| Menu (Pro) — unlimited custom items | **Missing** | `SPECIALS` is a `const`. There is no user-generated content, no persistence, and no authoring UI anywhere. The planned `menu_selections` table (see `PROMPT.md`) covers *selection*, not *creation* — a `custom_specials` table would be new scope. |
| Menu (Pro) — premium menus updated monthly | **Missing** | No tier, pack, or content-rotation concept exists. |
| Menu (Pro) — weekly token budget | **Partial** | `priceTag` is already a per-item 1–3 ♥ cost, and it is **decorative today**. Summing it against a weekly cap is a genuinely small change once selections persist. Best-value upsell on this pillar: reuse a field that already exists. |
| Selections persist at all | **Missing** | The order summary is component state only (`useState` in `app/menu/page.tsx`); it resets on reload. `menu_selections` is planned, not built. |

---

## 3. Pillar 2 — Date Spinner

**Lives in:** `components/DateSpinner.tsx` (wheel + filter modal),
`app/dates/page.tsx` (page + Past Dates), `lib/dateSelection.ts` (picks the
winner), `lib/dateOptions.ts` (data, React-free).

### What already exists

- Framer Motion SVG wheel with spring spin physics, center SPIN button, top
  indicator pin, and a **filtered-pool** result: the segments are decorative and
  `selectRandomDate()` in `lib/dateSelection.ts` is the source of truth. Selection
  moved client-side when the app became a static export for native packaging.
- A `role="alert"` error card for *no ideas match those filters*.
- A filter modal with **three** dimensions already wired end-to-end (client
  filter + server filter):
  - Category / vibe: `cozy`, `romantic`, `outdoor`, `quick`
  - Location setting: `home`, `out`
  - Budget tier: `$`, `$$`, `$$$`
- 6 date options in `INITIAL_DATE_OPTIONS`, each with `cost`, `location`,
  `prepTime`, and `description`.
- A read-only "Past Dates & Memories" panel seeded from `INITIAL_PAST_DATES`
  (rating + `memoryNote`).

### Gap analysis

| Proposed feature | Status | Notes |
| --- | --- | --- |
| Spinner (Basic) — "At-Home" and "Low Budget" ideas | **Built** | `location: "home"` and `cost: "$"` both exist and filter correctly. |
| Spinner (Basic) — **no** advanced filtering | ⚠️ **Conflict** | Advanced filtering already ships *and is free*. See §5. |
| Spinner (Pro) — filter by budget | **Built (free today)** | `selectedBudget` in `DateSpinner.tsx`. |
| Spinner (Pro) — filter by prep time | **Partial** | `prepTime` exists on every `DateOption` but is **never filtered** — it is display-only in the result card. Cheapest Pro filter to ship. |
| Spinner (Pro) — filter by energy level | **Missing** | No `energy` field on `DateOption`. |
| Spinner (Pro) — filter by weather dependency | **Missing** | No `weather` field on `DateOption`. Also needs a location/forecast decision (uses the user's location, so it has a privacy implication). |
| Spinner (Pro) — premium blueprints / itineraries | **Missing** | `DateOption` is flat (title/description/prepTime) with no concept of multi-stop steps or conversation checkpoints. This needs a new `DateBlueprint` type, not a field on the existing one. |

---

## 4. Pillar 3 — Conversation Picker

**Lives in:** `app/conversations/page.tsx` + `lib/conversationTopics.ts` (data)
+ `components/useSavedConversations.ts` (the reference localStorage store).

### What already exists

- **18 topics** across 4 categories: `romance`, `dreams`, `playful`, `deep`,
  each with a `question` and a `followUp`.
- A Quick Convos card deck (Next Card shuffle) drawing from the same
  `CONVERSATION_TOPICS` array as the browse list, so the two cannot diverge.
- Browse Topics: live search across title/question/follow-up, category pills,
  an `aria-live` result count, no-results copy, and a scroll fade.
- Saved Conversations: bookmark toggle on both the deck and every list row,
  persisted to `t42-saved-convos`, newest-first, with relative timestamps
  ("Saved 3 days ago"), cross-tab sync via a `storage` listener, and an empty
  state. **Saves are unlimited today.**
- A second home-page carousel, `SPARK_CONVOS` (`app/page.tsx`), with 4 more
  hardcoded prompts.

### Gap analysis

| Proposed feature | Status | Notes |
| --- | --- | --- |
| Picker (Basic) — 3 starter decks | **Built (4 decks)** | `ROMANCE`, `DREAMS`, `PLAYFUL`, `DEEP`. Arguably over-delivered already. |
| Picker (Basic) — max 5 saved favorites | ⚠️ **Conflict** | Saves are unlimited and cross-tab synced. See §5. |
| Picker (Pro) — unlimited favorites | **Built (free today)** | Nothing to sell here; the upsell is the *decks*, not the save limit. |
| Picker (Pro) — "Finances & Future" | **Partial** | Closest existing: the `dreams` category (`Five Years Forward`, `The Table We'd Keep`). No dedicated deck. |
| Picker (Pro) — "Conflict Resolution" | **Partial** | Closest existing: `deep` (`Hard Things`, `What I Need From You`). No dedicated deck. |
| Picker (Pro) — "Intimacy & Romance" | **Partial** | Closest existing: `romance` (6 topics). Not scoped as a distinct deck. |
| Decks can be tiered at all | **Missing** | No `tier`/`packId` on `ConversationTopic`; `TOPIC_CATEGORIES` has no grouping for premium vs free. |
| `SPARK_CONVOS` is a second source of truth | ⚠️ **Debt** | `PROMPT.md` states data lives in `lib/` so wording "can never silently diverge" — `SPARK_CONVOS` violates that, lives only in `app/page.tsx`, and is invisible to search, saving, and category filters. Worth folding into `CONVERSATION_TOPICS` before tiering it. |

---

## 5. ⚠️ Tier Conflicts to Resolve First

Three of the proposed **free-tier constraints already contradict shipped code**.
Deciding these first prevents a roadmap that plans to *remove* working features.

| # | Proposed constraint | Reality in the repo | Options |
| --- | --- | --- | --- |
| C1 | Date Spinner (Basic): **no advanced filtering** | Vibe + location + **budget** filters are built and free (`components/DateSpinner.tsx`). | **(a) Keep as free** and sell prep time / energy / weather / blueprints instead. *(recommended — never take away a shipped feature; the new filters are the honest upgrade.)* (b) Gate budget behind Pro and downgrade free users — visible regression, bad reviews. |
| C2 | Conversation Picker (Basic): **max 5 saved favorites** | Unlimited, cross-tab-synced saves via `t42-saved-convos`. | **(a) Keep unlimited** and sell Pro decks + the Shared Journal. *(recommended.)* (b) Enforce a 5-save cap — requires intercepting an existing store and is a hostile first impression. |
| C3 | Menu (Basic): **3 interactions per love language**, no customization | 9 items exist, but love language is a free-text `badge`, so per-language counts are not computable. | **(a)** Add a structured `loveLanguage` field and top each language up to 3+ items in the free set *(recommended — it is content work plus one type change)*. (b) Leave badges as-is and drop the per-language promise from marketing copy. |

**Net effect:** the free tier is *stronger* than Gemini assumed, which is good
news for a Freemium model and bad news for the Hard Paywall model (see §7).

---

## 6. Pillar 4 — Notifications & Quality of Life

| Proposed feature | Status | Notes |
| --- | --- | --- |
| Basic nudges ("Your partner ordered an item!") | **Blocked** | `app/preferences/page.tsx` has a deliberately disabled `Notifications — Coming soon` section (`opacity-50 pointer-events-none`). There is no push registration, service worker messaging, or notification table anywhere. |
| The home "Relationship Harmony & Sync" card implies live sync | **Partial** | "Both partner devices synchronized" is copy over **hardcoded constants**: `streakDays = 1`, `harmonyPct = 98`, and the names "Ben & Taylor" in `app/page.tsx`. Nothing is actually synced. |
| Shared Journal | **Partial** | The shape exists in two places — `INITIAL_PAST_DATES[].memoryNote` / `rating` on `/dates` and the planned `date_nights.rating` / `memory_note` columns — but both are read-only seed data. |
| Widgets ("Orders Pending", "Date Night Countdown") | **Missing** | The app is a web PWA (`public/manifest.json`, standalone). Home-screen widgets need native APIs (WidgetKit / Glance) via a wrapper, or a narrow iOS PWA workaround. **Defer.** |
| Streaks & harmony score as real data | **Blocked** | Requires the planned `streaks` and `harmony_scores` tables. |

---

## 7. Monetization Strategy Comparison

| Strategy | Fit | Why | Main risk |
| --- | --- | --- | --- |
| **Freemium** | ✅ **Best fit** | The entire core loop (menu, spinner, conversations) is already built and pleasant. Premium upsells (custom items, Pro decks, journal, widgets) are *additive* — nothing shipped has to be taken away. | Free tier may be "enough" for many couples; needs a genuinely compelling hook (Shared Journal + custom menus). |
| **Hard Paywall (14–21 day trial)** | ⚠️ Weak fit | The app is currently a single-screen-per-pillar experience with **no accounts and no persistence**. There is very little for a trial to prove before it expires, and no auth through which to run one. | Churn at trial end; also the deferred Supabase work becomes a hard blocker on day one. |
| **Expansion Packs (one-time)** | ✅ Good fit | Packs are **pure content** — each one is a themed slice of `Special[]`, `ConversationTopic[]`, or `DateOption[]`, and those modules are already React-free and single-source. Lowest engineering cost per dollar. | Discoverability: needs an in-app storefront, or packs never get seen. |
| **Lifetime unlock** | ✅ Strong fit | Matches the stated earlier preference to avoid subscriptions (no recurring churn management, no dunning, no revenue-share friction on a web PWA). | Cash-flow: one-off revenue only; needs enough content volume to justify $50–$90. |

### Recommendation

**Freemium core + à la carte Expansion Packs + a Lifetime unlock as the primary
paid product, with monthly/annual subscriptions as an optional layer once
Retention data justifies it.** Concretely:

1. Free keeps everything that is built today (resolves C1/C2/C3 by *adding*, not removing).
2. Sell **Pro mechanics** — custom menu items, the weekly token budget, advanced date filters, date blueprints, Shared Journal.
3. Sell **packs** one-time (Pre-Marital, New Parent Survival, Faith/Christian Marriage).
4. Offer **Buy-It-For-Life** as the headline "no subscription ever" option.
5. Only add a subscription if the lifetime tier alone does not cover costs.

> This inverts the usual hierarchy (subscription-first) *because* the app's
> existing free tier is already generous. A subscription would be the hardest
> thing to justify here; a lifetime unlock is the easiest.

### Entitlement scope — a design decision, not a detail

This is a **two-person app where one account pays**. Entitlements must therefore
be **couple-scoped, not user-scoped**: keyed to `couple_id`, so when partner A
buys, partner B's device unlocks too. The planned schema already scopes every
table to `couple_id`, so an `entitlements` table fits that pattern directly:

| Column | Type | Notes |
| --- | --- | --- |
| `couple_id` | uuid, pk | One row per couple — matches the RLS `is_member()` helper in `PROMPT.md`. |
| `premium_expires_at` | timestamptz, nullable | `null` = no subscription. |
| `lifetime_unlocked_at` | timestamptz, nullable | Non-null = permanent unlock. |
| `pack_ids` | text[] | Purchased expansion packs (`pre_marital`, `new_parent`, `faith`). |
| `provider_customer_id` | text | For restores and the billing portal. |

---

## 8. Required Technical Prerequisites

Everything payment- or sync-related is **blocked** until these land, in order.
This is the deferred Supabase plan from `PROMPT.md`, now promoted to a
monetization prerequisite.

1. **Server truth for entitlements.** `localStorage` is editable in devtools in
   about five seconds. A paywall that reads `localStorage` is not a paywall. All
   gating must be decided server-side, with the client cache as a *render hint*
   only.
2. **Auth + pairing.** Email magic link / OTP, the `couples` table, and the
   `invite_code` flow. Note this work is required by *any* strategy — the "Your
   partner ordered an item!" nudge and the Shared Journal both need a partner
   link, which only exists once two accounts share a `couples` row.
3. **RLS on every table.** Mandatory: the anon key is public. See the
   `is_member(target_couple uuid)` helper in `PROMPT.md`.
4. **Payment provider.** ⚠️ A Gravity Index catalog search on 2026-10-12
   returned **no payment/billing service** — the catalog has notifications,
   databases, and news search, but no gateway. So this is an out-of-catalog
   decision to make deliberately:
   - **Web PWA path (recommended while there is no native wrapper):** a hosted
     web-billing provider gives you subscriptions, one-time Checkout, and a
     customer portal with no app-store revenue share. Choose between a
     **merchant-of-record** provider (it handles global VAT/sales tax for you,
     higher per-transaction fee) and a **payment-processor-only** provider
     (lowest fees, but you own tax registration and compliance). For a solo
     operator selling worldwide, merchant-of-record is usually worth the fee.
   - **Native path (only if a wrapper ships later):** Apple and Google require
     digital unlocks sold inside a native app to use their in-app purchase
     (roughly 15–30% depending on program and revenue). Expansion packs map
     cleanly onto **non-consumable** products, and the Lifetime unlock onto a
     second one. Plan pack IDs so the same SKU can exist on both rails.
5. **Webhook → entitlement sync.** The provider webhook is the *only* thing
   allowed to grant entitlement; the client-side success redirect is cosmetic.

---

## 9. Phased Plan

### M0 — Tier the existing content (no billing, no server)
**Goal:** make every feature's tier a config value, so later flips are one-line changes.
- Add `packId` + `tier: "free" | "premium"` to `Special`, `ConversationTopic`, `DateOption`.
- Add the structured `loveLanguage` field to `Special` (resolves C3).
- Add `lib/entitlements.ts` mirroring the module-level singleton +
  `useSyncExternalStore` pattern of `components/useSavedConversations.ts`, with
  **everything defaulting to free**.
- Build the reusable locked-state UI (`LockedCard` / upgrade prompt) and a
  `/premium` page listing tiers, packs, and the lifetime unlock.
- Fold the 4 `SPARK_CONVOS` prompts into `CONVERSATION_TOPICS` (paydown of the §4 debt) and gate prep-time/energy/weather filters behind the flag.
- **Acceptance:** `npx tsc --noEmit`, `npx eslint app components lib`, `npm run build` clean; every page renders identically to today with entitlements forced to free.

### M1 — Content build with zero new engineering
- Premium menus (monthly rotation: "Ultimate Pampering", "Apology & Reconnection").
- Pro decks: "Finances & Future", "Conflict Resolution", "Intimacy & Romance".
- The three expansion packs, authored in the existing data shape.
- **Acceptance:** each pack/deck renders via the existing components when its ID is added to a test entitlements list.

### M2 — Server truth (Supabase)
- Project + env vars; replace the placeholder fallbacks in `lib/supabase.ts` with a loud failure.
- Schema, RLS policies, auth, and the `couples` pairing flow.
- Migrate **read-path first, write-path second**; saved conversations first (cleanest existing store).
- **Acceptance:** anon access denied by default; a second device sees partner A's save without a refresh.

### M3 — Billing
- Checkout for subscription / pack / lifetime; webhook writes `entitlements`; restore-purchase path.
- **Acceptance:** a test-mode purchase unlocks on **both** partners' devices; a devtools edit of `localStorage` unlocks nothing.

### M4 — Pro mechanics
- Custom menu items (authoring UI + persistence + report path), weekly token budget (sums the existing `priceTag` ♥ values), prep-time/energy/weather date filters, date blueprints.
- **Acceptance:** a free user hitting a Pro action sees the upgrade prompt, not an error.

### M5 — Quality of life
- Shared Journal (private per-couple, reads/writes `date_nights.memory_note`-style rows), real streaks/harmony replacing the hardcoded constants in `app/page.tsx`, then notifications.
- **Notifications, when we get here:** the core nudge ("Your partner ordered an item!") is an event already implied by `menu_selections`. A Gravity Index search recommended **Knock** for orchestration (free Developer tier, 10k messages/month, in-app + push from one trigger) — but note Knock *orchestrates* delivery and still requires a push gateway for iOS/Android web push. A zero-vendor alternative is the Web Push API with VAPID keys, which works on Android and on iOS 16.4+ **only when the PWA is installed to the home screen**. Either way it is blocked on M2 auth, since a nudge must target a partner's device.
- **Acceptance:** journal entries are visible to the partner and invisible to anyone else; notifications arrive on a real second device.

### M6 — Distribution polish (only if a native wrapper is chosen)
- Native IAP products, store compliance review, and the widgets. **Defer widgets** until there is a wrapper — the current PWA cannot render home-screen widgets.

---

## 10. Feature → Tier Matrix (consolidated)

| Feature | Today | Proposed tier | Effort |
| --- | --- | --- | --- |
| Pre-written menu items | **Built** | Free | — |
| Menu item selection (persisted) | Missing | Free | S (after `menu_selections`) |
| Structured love-language field, 3+ items each | Partial | Free | S |
| Custom menu items | Missing | Premium | L |
| Premium monthly menus | Missing | Premium | M (content) |
| Weekly token budget | Partial (`priceTag` exists) | Premium | S |
| Spinner + vibe/location/budget filters | **Built** | **Free** (C1) | — |
| Server-side date selection | **Built** | Free | — |
| Prep-time filter | Partial (data exists) | Premium | S |
| Energy + weather filters | Missing | Premium | M |
| Date blueprints (itineraries) | Missing | Premium | L |
| 18 topics / 4 decks | **Built** | **Free** (C2) | — |
| Unlimited saved favorites | **Built** | **Free** (C2) | — |
| Pro decks (Finances, Conflict, Intimacy) | Missing | Premium | M (content) |
| Shared Journal | Partial (planned `memory_note`) | Premium | M |
| Streaks / harmony as real data | Partial (hardcoded) | Free | S (after M2) |
| Partner nudges | Blocked | Free (habit loop) | M (after M2) |
| Home-screen widgets | Missing | Premium | XL (native) |
| Pre-Marital Pack | Missing | One-time | S (content) |
| New Parent Survival Pack | Missing | One-time | S (content) |
| Faith/Christian Marriage Pack | Missing | One-time | S (content) |
| Buy-It-For-Life unlock | Missing | One-time | S (after M3) |

**Effort:** S ≤ ~1 day · M ~2–4 days · L ~1 week · XL multi-week.

---

## 11. Open Decisions

1. **Primary monetization model** — recommendation is lifetime-unlock-first
   (§7). Subscription-first is viable but must be justified against an already
   generous free tier.
2. **C1/C2/C3** — confirm "add, never remove" for all three (recommended).
3. **Payment provider** — merchant-of-record vs processor-only; and whether a
   native wrapper is ever planned, since that changes the whole billing design.
4. **Custom menu items & moderation** — user-authored content between partners
   raises a content-safety and storage-cost question (and possibly an age-rating
   one on native stores).
5. **Weather-aware date filtering** — requires location permission, which is a
   privacy-policy and consent-flow commitment, not just a code change.
6. **Auth is now on the critical path.** The deferred Supabase work is no longer
   optional scope: entitlements, partner nudges, and the Shared Journal all
   depend on it.
