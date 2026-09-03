You are an expert full-stack web developer specializing in Next.js (App Router), React, Tailwind CSS, Framer Motion, and Supabase. 

We are building a Progressive Web App (PWA) called **"Table for Two"**—a romantic, culinary-themed mobile-first web app for couples.

### Pre-existing App Assets
- **Logo:** Use the existing `public/logo.png` image as the primary branding icon across the home screen header, navigation elements, and PWA `manifest.json` configuration.
- **Visual Mockups:** Refer to `public/light-mockup.png` and `public/dark-mockup.png` for exact visual layouts, card spacing, and typography scale.

### Setup Instructions (Current Directory)

Please execute the following setup commands directly in the current working directory (`/$HOME/Projects/table-for-two`):

1. **Scaffold Next.js App in Place:**
   Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm` (allow overwriting/merging with existing files if prompted).

2. **Install Core Dependencies:**
   Run `npm install framer-motion lucide-react @supabase/supabase-js`

3. **Configure Design Tokens:**
   - Update `tailwind.config.ts` (or `.js`) with the theme extension:
     - `primary`: `#C95D64`
     - `secondary-accent`: `#629390`
     - `light.bg`: `#FFFFFF`, `light.gray`: `#E7E7E7`, `light.text`: `#3C3C3C`
     - `dark.bg`: `#000000`, `dark.surface`: `#212121`, `dark.gray`: `#3C3C3C`, `dark.text`: `#E7E7E7`
   - Configure project fonts:
     - Headings: Berkshire Swash
     - Paragraph: Montserrat Alternates
   - Update `app/globals.css` with the corresponding CSS root variables for light/dark modes.

### Project Architecture Specifications

1. **Framework & Setup:**
   - Next.js 14+ with App Router (`/app` directory structure).
   - Tailwind CSS with dual Light/Dark Mode support (`dark:` class modifier).
   - Lucide React for iconography and Framer Motion for animations.

2. **Application Layout Structure:**
   - Mobile-first container (`max-w-md mx-auto min-h-screen relative pb-20`).
   - Sticky bottom navigation bar with 4 tabs:
     1. **Home** (`/`) - Welcome banner, Connection Status card with teal (`#629390`) badge, "Today's Specials" carousel, quick "Spin the Date Wheel" primary action button (`#C95D64`), and "Spark a Conversation" horizontal scroll.
     2. **Menu** (`/menu`) - "Daily Menu" page with "Entrees" (main tasks) and "Sides & Desserts" (quick check-ins).
     3. **Dates** (`/dates`) - Interactive "Date Spinner Wheel" section with a custom filter button (`bg-[#629390]`, funnel icon) and a "Past Dates" collapsible list.
     4. **Conversations** (`/conversations`) - "Quick Convos" card deck, "Browse Topics" search with floating query button, and "Past Conversations" vertical stack.

3. **Key Component: The Date Spinner (`/components/DateSpinner.tsx`)**
   - Interactive Framer Motion SVG wheel with spring physics on spin.
   - Segments alternating in `#C95D64`, `#212121`, and `#E7E7E7`.
   - Center button ("SPIN THE DATE WHEEL!"), top indicator pin, and a teal (`#629390`) filter button modal.

4. **PWA Configuration:**
   - Create `/public/manifest.json` configured for standalone mode (`"display": "standalone"`).
   - Configure responsive viewport settings in `layout.tsx` for native gesture bar support (`viewport-fit=cover`).

### Execution Strategy

Execute the setup commands above, and then construct the initial UI shell:
1. Initialize the project dependencies and configuration files.
2. Build `app/layout.tsx` with light/dark theme providers and global CSS.
3. Build `components/BottomNav.tsx` with routing across `/`, `/menu`, `/dates`, and `/conversations`.
4. Build `app/dates/page.tsx` and the interactive `components/DateSpinner.tsx`.
