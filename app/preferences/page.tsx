"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor, Settings, ArrowLeft, Check, Palette, Bell } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function PreferencesPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen px-4 md:px-8 pt-6 pb-28 md:pb-12 flex flex-col space-y-8 bg-white dark:bg-[#000000] text-[#3C3C3C] dark:text-[#E7E7E7] transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-[#3C3C3C] dark:text-[#E7E7E7]" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#3C3C3C] dark:text-white leading-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#629390]" />
            Preferences
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-paragraph">
            Customize your Table for Two experience
          </p>
        </div>
      </div>

      {/* Appearance Section */}
      <section className="space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#E7E7E7] dark:border-neutral-800">
          <div className="p-2 rounded-xl bg-[#C95D64]/10 text-[#C95D64]">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading text-[#3C3C3C] dark:text-white">
              Appearance
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-paragraph">
              Choose how the app looks to you
            </p>
          </div>
        </div>

        {/* Theme Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Light Mode Card */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTheme("light")}
            className={`relative text-left rounded-3xl p-6 border-2 transition-all duration-300 overflow-hidden group ${
              theme === "light"
                ? "border-[#C95D64] bg-[#C95D64]/5 shadow-lg shadow-[#C95D64]/10"
                : "border-[#E7E7E7] dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-300 dark:hover:border-neutral-500"
            }`}
          >
            {/* Selection checkmark */}
            {theme === "light" && (
              <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#C95D64] flex items-center justify-center shadow-md">
                <Check className="w-4 h-4 text-white stroke-[3]" />
              </div>
            )}

            {/* Preview mockup */}
            <div className="w-full h-32 rounded-2xl bg-[#FFFFFF] border border-[#E7E7E7] mb-4 flex flex-col p-3 gap-2 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#E7E7E7]" />
                <div className="w-20 h-2 rounded-full bg-[#E7E7E7]" />
              </div>
              <div className="w-3/4 h-2 rounded-full bg-[#E7E7E7]" />
              <div className="w-1/2 h-2 rounded-full bg-[#E7E7E7]" />
              <div className="mt-auto flex gap-2">
                <div className="w-16 h-6 rounded-lg bg-[#C95D64]" />
                <div className="w-16 h-6 rounded-lg bg-[#E7E7E7]" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  theme === "light" ? "bg-amber-100" : "bg-neutral-100 dark:bg-neutral-800"
                }`}
              >
                <Sun
                  className={`w-5 h-5 transition-colors ${
                    theme === "light" ? "text-amber-500 fill-amber-500/20" : "text-neutral-400"
                  }`}
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#3C3C3C] dark:text-white font-paragraph">
                  Light Mode
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Clean white interface, great for daytime
                </p>
              </div>
            </div>
          </motion.button>

          {/* Dark Mode Card */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTheme("dark")}
            className={`relative text-left rounded-3xl p-6 border-2 transition-all duration-300 overflow-hidden group ${
              theme === "dark"
                ? "border-[#C95D64] bg-[#C95D64]/5 shadow-lg shadow-[#C95D64]/10"
                : "border-[#E7E7E7] dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-300 dark:hover:border-neutral-500"
            }`}
          >
            {/* Selection checkmark */}
            {theme === "dark" && (
              <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#C95D64] flex items-center justify-center shadow-md">
                <Check className="w-4 h-4 text-white stroke-[3]" />
              </div>
            )}

            {/* Preview mockup */}
            <div className="w-full h-32 rounded-2xl bg-[#0B0B0C] border border-neutral-800 mb-4 flex flex-col p-3 gap-2 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-neutral-700" />
                <div className="w-20 h-2 rounded-full bg-neutral-700" />
              </div>
              <div className="w-3/4 h-2 rounded-full bg-neutral-700" />
              <div className="w-1/2 h-2 rounded-full bg-neutral-700" />
              <div className="mt-auto flex gap-2">
                <div className="w-16 h-6 rounded-lg bg-[#C95D64]" />
                <div className="w-16 h-6 rounded-lg bg-neutral-700" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  theme === "dark" ? "bg-indigo-900/50" : "bg-neutral-100 dark:bg-neutral-800"
                }`}
              >
                <Moon
                  className={`w-5 h-5 transition-colors ${
                    theme === "dark" ? "text-indigo-400 fill-indigo-400/20" : "text-neutral-400"
                  }`}
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#3C3C3C] dark:text-white font-paragraph">
                  Dark Mode
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Easy on the eyes, perfect for evening
                </p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* System preference note */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-[#212121] border border-[#E7E7E7] dark:border-neutral-800">
          <Monitor className="w-5 h-5 text-[#629390] flex-shrink-0" />
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Your preference is saved locally and will persist across visits. We also respect your system&apos;s
            default color scheme on first visit.
          </p>
        </div>
      </section>

      {/* Future: More preference sections could go here */}
      <section className="space-y-4 opacity-50 pointer-events-none">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#E7E7E7] dark:border-neutral-800">
          <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading text-neutral-400">Notifications</h2>
            <p className="text-xs text-neutral-400 font-paragraph">Coming soon</p>
          </div>
        </div>
      </section>
    </div>
  );
}
