"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Clock, Check, ChefHat, IceCream, ShoppingBag } from "lucide-react";
import { SPECIALS } from "@/lib/specials";
import { RevealDiv, RevealSection } from "@/components/Reveal";

const MENU_ITEMS = SPECIALS;

export default function MenuPage() {
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;

  const entrees = MENU_ITEMS.filter((i) => i.category === "entree");
  const sidesAndDesserts = MENU_ITEMS.filter((i) => i.category === "side_dessert");

  return (
    <div className="min-h-screen px-4 md:px-8 pt-6 pb-28 md:pb-12 flex flex-col space-y-6 bg-white dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors duration-300">
      {/* Top Header Bar */}
      <RevealDiv className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 overflow-hidden md:hidden">
            <Image src="/logo.png" alt="Table for Two Logo" width={40} height={40} className="object-contain" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-light-text dark:text-white leading-tight">
              Daily Menu 📜
            </h1>
            <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-paragraph">
              Curated acts of love & bite-sized moments of appreciation
            </p>
          </div>
        </div>


      </RevealDiv>

      {/* Order Summary Counter */}
      {selectedCount > 0 && (
        <div className="bg-secondary-accent text-white rounded-2xl p-4 shadow-md flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs md:text-sm font-semibold">
              {selectedCount} item{selectedCount > 1 ? "s" : ""} added to your love menu!
            </span>
          </div>
          <button
            onClick={() => setSelectedItems({})}
            className="text-xs md:text-sm underline hover:opacity-80 font-medium"
          >
            Clear Order
          </button>
        </div>
      )}

      {/* Responsive 2-Column Grid on Tablet & Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Section 1: Entrees (Main Tasks) */}
        <RevealSection delay={0.07} className="space-y-4">
          <div className="flex items-center gap-2 border-b border-light-gray dark:border-neutral-800 pb-2">
            <ChefHat className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold font-heading text-light-text dark:text-white">
              Entrees (Grand Gestures)
            </h2>
          </div>

          <div className="space-y-4">
            {entrees.map((item) => {
              const isSelected = !!selectedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`cursor-pointer rounded-3xl p-5 shadow-sm border transition-all duration-300 ${
                    isSelected
                      ? "bg-primary/10 dark:bg-primary/20 border-primary"
                      : "bg-neutral-50 dark:bg-dark-surface border-light-gray dark:border-neutral-800 hover:border-primary/50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-secondary-accent">{item.priceTag}</span>
                      <span className="text-xs text-neutral-400">•</span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.time}
                      </span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "border-neutral-300 dark:border-neutral-600 text-transparent"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold font-paragraph text-light-text dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {item.description}
                  </p>

                  {item.recipePairing && (
                    <span className="mt-3 inline-block text-[11px] font-semibold text-secondary-accent bg-secondary-accent/15 px-2.5 py-0.5 rounded-full">
                      {item.recipePairing}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </RevealSection>

        {/* Section 2: Sides & Desserts (Quick Check-ins) */}
        <RevealSection delay={0.14} className="space-y-4">
          <div className="flex items-center gap-2 border-b border-light-gray dark:border-neutral-800 pb-2">
            <IceCream className="w-5 h-5 text-secondary-accent" />
            <h2 className="text-xl font-bold font-heading text-light-text dark:text-white">
              Sides & Desserts (Sweet Bites)
            </h2>
          </div>

          <div className="space-y-4">
            {sidesAndDesserts.map((item) => {
              const isSelected = !!selectedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`cursor-pointer rounded-3xl p-5 shadow-sm border transition-all duration-300 ${
                    isSelected
                      ? "bg-secondary-accent/10 dark:bg-secondary-accent/20 border-secondary-accent"
                      : "bg-neutral-50 dark:bg-dark-surface border-light-gray dark:border-neutral-800 hover:border-secondary-accent/50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">{item.priceTag}</span>
                      <span className="text-xs text-neutral-400">•</span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.time}
                      </span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? "bg-secondary-accent border-secondary-accent text-white"
                          : "border-neutral-300 dark:border-neutral-600 text-transparent"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold font-paragraph text-light-text dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </RevealSection>
      </div>
    </div>
  );
}
