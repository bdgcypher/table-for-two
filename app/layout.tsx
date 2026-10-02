import type { Metadata, Viewport } from "next";
import { MotionConfig } from "framer-motion";
import { Berkshire_Swash, Montserrat_Alternates } from "next/font/google";
import "./globals.css";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { ThemeProvider } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";
import SlideOutMenu from "@/components/SlideOutMenu";

const berkshireSwash = Berkshire_Swash({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-berkshire",
  display: "swap",
});

const montserratAlternates = Montserrat_Alternates({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-montserrat-alternates",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Table for Two 🍽️💖 | Cooking up Connection",
  description: "A romantic, culinary-themed mobile-first web app for couples to spark connection.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    // The manifest does not cover iOS home-screen icons, and the app renders
    // no transparency well there, so it gets its own flattened 180px plate.
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Table for Two",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${berkshireSwash.variable} ${montserratAlternates.variable}`}
    >
      <body className="antialiased min-h-screen bg-light-gray dark:bg-dark-canvas text-light-text dark:text-dark-text selection:bg-primary selection:text-white transition-colors duration-300">
        {/* Applies the saved theme to <html> before the first paint, so a dark
            theme never flashes light. This is a raw inline script rather than
            next/script: with strategy="beforeInteractive" the source is only
            pushed onto Next's bootstrap queue, so it does not run until the
            framework loads — far too late to stop the flash. As the first
            child of <body> it executes during parse, before anything paints. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <ThemeProvider>
          {/* reducedMotion="user" makes every framer animation in the app drop
              its transform and animate opacity only when the visitor asks for
              reduced motion — so the reveals below still fade, but never slide. */}
          <MotionConfig reducedMotion="user">
            {/* App Shell Container with explicit Light Mode and Dark Mode backgrounds */}
            <SlideOutMenu>
              <div className="min-h-screen relative flex flex-col bg-light-bg dark:bg-dark-bg transition-colors duration-300">
                <BottomNav />
                <main className="flex-1 pb-24 md:pb-12 overflow-x-hidden 2xl:max-w-[1600px] 2xl:mx-auto 2xl:w-full">{children}</main>
              </div>
            </SlideOutMenu>
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
