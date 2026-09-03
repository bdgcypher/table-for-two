"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sun,
  Moon,
  Home,
  UtensilsCrossed,
  Sparkles,
  MessageCircleHeart,
  Settings,
  Heart,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

// ─── Context ────────────────────────────────────────────────────────────────

interface MenuContextType {
  openMenu: () => void;
  closeMenu: () => void;
  isOpen: boolean;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error("useMenu must be used within a <SlideOutMenu> provider");
  }
  return ctx;
}

// ─── Navigation items (shared) ──────────────────────────────────────────────

export const menuNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/dates", label: "Dates", icon: Sparkles },
  { href: "/conversations", label: "Conversations", icon: MessageCircleHeart },
  { href: "/preferences", label: "Preferences", icon: Settings },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function SlideOutMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);

  // Close on route change
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  const contextValue: MenuContextType = { openMenu: open, closeMenu: close, isOpen };

  return (
    <MenuContext.Provider value={contextValue}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={close}
              className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-out Panel — full-width on mobile, 420px drawer on desktop */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed top-0 right-0 z-[80] h-full w-full md:w-[420px] bg-white dark:bg-[#0B0B0C] shadow-2xl flex flex-col overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#E7E7E7] dark:border-neutral-800">
                <Link
                  href="/"
                  onClick={close}
                  className="flex items-center gap-2.5 group"
                >
                  <Heart className="w-5 h-5 fill-[#C95D64] text-[#C95D64] group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-bold font-heading text-[#3C3C3C] dark:text-white">
                    Table for Two
                  </span>
                </Link>
                <button
                  onClick={close}
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-[#3C3C3C] dark:text-[#E7E7E7]" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="p-4 space-y-1">
                <p className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest px-3 mb-2">
                  Navigation
                </p>
                {menuNavLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={close}
                      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                        isActive
                          ? "bg-[#C95D64]/10 text-[#C95D64] font-bold"
                          : "text-[#3C3C3C] dark:text-[#E7E7E7] hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 transition-colors ${
                          isActive ? "text-[#C95D64]" : "text-neutral-400 dark:text-neutral-500 group-hover:text-[#C95D64]"
                        }`}
                      />
                      <span className="text-sm font-medium">{link.label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="activeMenuIndicator"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C95D64]"
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <hr className="mx-5 border-[#E7E7E7] dark:border-neutral-800" />

              {/* Appearance Section */}
              <div className="p-4 space-y-4">
                <p className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest px-3">
                  Appearance
                </p>

                {/* Theme Toggle Cards */}
                <div className="grid grid-cols-2 gap-3 px-2">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-200 group ${
                      theme === "light"
                        ? "border-[#C95D64] bg-[#C95D64]/5 shadow-sm shadow-[#C95D64]/10"
                        : "border-[#E7E7E7] dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-500 bg-neutral-50/50 dark:bg-neutral-900/30"
                    }`}
                    aria-label="Switch to light mode"
                    aria-pressed={theme === "light"}
                  >
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
                    <span
                      className={`text-xs font-bold transition-colors ${
                        theme === "light" ? "text-[#C95D64]" : "text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      Light
                    </span>
                    <div className="w-full h-1.5 rounded-full bg-[#E7E7E7] dark:bg-neutral-700" />
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-200 group ${
                      theme === "dark"
                        ? "border-[#C95D64] bg-[#C95D64]/5 shadow-sm shadow-[#C95D64]/10"
                        : "border-[#E7E7E7] dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-500 bg-neutral-50/50 dark:bg-neutral-900/30"
                    }`}
                    aria-label="Switch to dark mode"
                    aria-pressed={theme === "dark"}
                  >
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
                    <span
                      className={`text-xs font-bold transition-colors ${
                        theme === "dark" ? "text-[#C95D64]" : "text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      Dark
                    </span>
                    <div className="w-full h-1.5 rounded-full bg-[#212121]" />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto p-5 border-t border-[#E7E7E7] dark:border-neutral-800">
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 text-center font-paragraph">
                  Table for Two 🍽️💖 • Cooking up Connection
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MenuContext.Provider>
  );
}
