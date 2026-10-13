# Table for Two 🍽️💖

A custom relationship application designed to nurture connection through interactive, culinary-themed experiences, curated conversation starters, daily connection menus, and an interactive date spinner wheel.

---

## 📸 Overview & Features

- **Welcome Dashboard:** Displays connection status, daily connection prompts ("Today's Specials"), and quick-action triggers.
- **Daily Menu:** Structured culinary-themed activities ("Entrees" for deep activities, "Sides & Desserts" for quick check-ins) to order and share.
- **Date Spinner Wheel:** A dynamic, physics-based wheel featuring category filtering to eliminate date-night indecision.
- **Conversation Starters:** "Quick Convos" and categorized discussion topics with history tracking for memorable moments.
- **Cross-Platform PWA Support:** Designed mobile-first for iOS and Android without store installation requirements.
- **Native Android & iOS Apps:** The same codebase also packages into a Capacitor shell, and every tagged release publishes a sideloadable APK. See [MOBILE.md](./MOBILE.md).
- **Real-time Syncing:** Instant updates between partner devices powered by Supabase.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, `output: "export"`)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations & Physics:** [Framer Motion](https://www.framer.com/motion/)
- **Database & Real-time Sync:** [Supabase](https://supabase.com/) (PostgreSQL + Realtime Subscriptions)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Native Apps:** [Capacitor](https://capacitorjs.com/) 8 (Android + iOS)
- **Deployment:** [Vercel](https://vercel.com/) (PWA / Standalone mode)

---

## 🎨 Official Design Tokens

- **Primary Accent:** `#C95D64`
- **Secondary Accent:** `#629390`

### Light Mode
- **Background:** `#FFFFFF`
- **Accent Gray:** `#E7E7E7`
- **Text:** `#3C3C3C`

### Dark Mode
- **Background:** `#000000`
- **Secondary Background:** `#212121`
- **Accent Gray:** `#3C3C3C`
- **Text:** `#E7E7E7`

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22.x or later (required by the Capacitor CLI)
- npm / pnpm / yarn
- A free [Supabase](https://supabase.com/) project

### 1. Repository Setup

```bash
git clone https://github.com/bdgcypher/table-for-two.git
cd table-for-two
npm install
```

### 2. Run It

```bash
npm run dev          # http://localhost:3000
npm run build        # static export into out/
npm start            # serve the built export
```

---

## 📱 Mobile Apps

The Android and iOS projects live in `android/` and `ios/`, committed alongside
the web app. `npm run build` produces the static export they package up.

```bash
npm run android:debug     # sideloadable debug APK
npm run android:release   # signed release APK + Play Store AAB
```

Pushing a tag such as `v0.0.1` triggers a GitHub Actions release that attaches a
sideloadable APK to the GitHub Release, so every version has a downloadable
build. Signing, store submission and the iOS/Xcode workflow are all documented
in **[MOBILE.md](./MOBILE.md)**.
