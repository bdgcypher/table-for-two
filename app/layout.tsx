import type { Metadata, Viewport } from "next";
import { Berkshire_Swash, Lora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";
import SlideOutMenu from "@/components/SlideOutMenu";

const berkshireSwash = Berkshire_Swash({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-berkshire",
  display: "swap",
});

const lora = Lora({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Table for Two 🍽️💖 | Cooking up Connection",
  description: "A romantic, culinary-themed mobile-first web app for couples to spark connection.",
  manifest: "/manifest.json",
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
      className={`${berkshireSwash.variable} ${lora.variable}`}
    >
      <body className="antialiased min-h-screen bg-[#E7E7E7] dark:bg-[#0B0B0C] text-[#3C3C3C] dark:text-[#E7E7E7] selection:bg-[#C95D64] selection:text-white transition-colors duration-300">
        <ThemeProvider>
          {/* App Shell Container with explicit Light Mode (#FFFFFF) and Dark Mode (#000000) backgrounds */}
          <SlideOutMenu>
            <div className="min-h-screen relative flex flex-col bg-[#FFFFFF] dark:bg-[#000000] transition-colors duration-300">
              <BottomNav />
              <main className="flex-1 pb-24 md:pb-12 overflow-x-hidden 2xl:max-w-[1600px] 2xl:mx-auto 2xl:w-full">{children}</main>
            </div>
          </SlideOutMenu>
        </ThemeProvider>
      </body>
    </html>
  );
}
