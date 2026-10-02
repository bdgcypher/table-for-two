"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, UtensilsCrossed, Sparkles, MessageCircleHeart, Heart, Menu } from "lucide-react";
import { useMenu } from "@/components/SlideOutMenu";

export const navItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Menu",
    href: "/menu",
    icon: UtensilsCrossed,
  },
  {
    name: "Dates",
    href: "/dates",
    icon: Sparkles,
  },
  {
    name: "Conversations",
    href: "/conversations",
    icon: MessageCircleHeart,
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const { openMenu } = useMenu();

  return (
    <>
      {/* Desktop / Tablet Header Bar (Visible on md: and up) */}
      <header className="hidden md:flex sticky top-0 z-50 w-full bg-white/95 dark:bg-dark-surface/95 backdrop-blur-md border-b border-light-gray dark:border-neutral-800 transition-colors duration-300">
        {/* 3-column grid: left (brand) | center (nav) | right (hamburger) */}
        <div className="w-full px-6 py-3.5 grid grid-cols-[1fr_auto_1fr] items-center 2xl:max-w-[1600px] 2xl:mx-auto">
          {/* Left: Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group justify-self-start">
            <div className="relative w-10 h-10 overflow-hidden group-hover:scale-105 transition-transform">
              <Image src="/logo.png" alt="Table for Two Logo" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <span className="text-xl font-bold font-heading text-light-text dark:text-dark-text flex items-center gap-1.5">
                Table for Two <Heart className="w-4 h-4 fill-primary text-primary" />
              </span>
              <span className="text-[11px] font-paragraph text-neutral-500 dark:text-neutral-400 block -mt-0.5 font-medium">
                Cooking up Connection
              </span>
            </div>
          </Link>

          {/* Center: Nav Links — truly centered in the grid column */}
          <nav className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800/80 p-1.5 rounded-full border border-neutral-200 dark:border-neutral-700/60 shadow-inner justify-self-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-colors duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDesktopTab"
                      className="absolute inset-0 bg-primary rounded-full shadow-md shadow-primary/30 z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 relative z-10 ${isActive ? "stroke-[2.5]" : ""}`} />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Hamburger menu button */}
          <div className="flex items-center justify-end gap-3 justify-self-end">
            <button
              onClick={openMenu}
              aria-label="Open menu"
              className="p-2.5 text-neutral-700 dark:text-neutral-200 hover:text-primary transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Bottom Navigation (Visible on screens < md) */}
      <nav className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-3 pb-3 pt-1 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 dark:bg-dark-surface/95 backdrop-blur-md border border-light-gray dark:border-neutral-800 rounded-full shadow-xl shadow-black/10 dark:shadow-black/40 px-3 py-1.5 flex items-center justify-around transition-colors duration-300">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center py-1.5 px-3.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeMobileTab"
                    className="absolute inset-0 bg-primary rounded-full shadow-md shadow-primary/30 z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  className={`w-5 h-5 relative z-10 transition-transform duration-200 ${
                    isActive ? "scale-110 stroke-[2.5]" : ""
                  }`}
                />
                <span
                  className={`text-[10px] tracking-tight mt-0.5 relative z-10 ${
                    isActive ? "font-extrabold text-white" : "font-medium"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* Hamburger menu trigger — sits with the nav buttons */}
          <button
            onClick={openMenu}
            aria-label="Open menu"
            className="relative flex flex-col items-center justify-center py-1.5 px-3.5 rounded-full text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5 font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
