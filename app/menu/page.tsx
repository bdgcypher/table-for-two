"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Utensils, Heart, Clock, Check, Sparkles, ChefHat, IceCream, Plus, ShoppingBag } from "lucide-react";
interface MenuItem {
  id: string;
  title: string;
  category: "entree" | "side_dessert";
  caloriesOrTime: string;
  priceTag: string;
  description: string;
  recipePairing?: string;
}

const MENU_ITEMS: MenuItem[] = [
  // Entrees (Grand Gestures)
  {
    id: "e1",
    title: "Affirmations & Cinnamon Crepe",
    category: "entree",
    caloriesOrTime: "20 mins",
    priceTag: "♥♥",
    description: "Pen a heartfelt note sharing something you deeply admire about your partner. Top it with a generous helping of spontaneous spoken compliments, finished with a drizzle of surprise flirty texts throughout the day.",
    recipePairing: "Pairs beautifully with a warm hug 🫂",
  },
  {
    id: "e2",
    title: "Quality Thyme Together Tart",
    category: "entree",
    caloriesOrTime: "60 mins",
    priceTag: "♥♥♥",
    description: "Clear the evening entirely — no phones, no screens. Do something your partner genuinely loves, and let the thyme remind you both to slow down and savor each other's company.",
    recipePairing: "Pairs best with undivided attention 💫",
  },
  {
    id: "e3",
    title: "Serviceberry Surprise Pie",
    category: "entree",
    caloriesOrTime: "30-45 mins",
    priceTag: "♥♥♥",
    description: "Secretly tackle one dreaded task from your partner's to-do list. Fill their gas tank, deep-clean the kitchen, or prep their work lunches — no fanfare, just pure love in action.",
    recipePairing: "Pairs with a grateful smile 😊",
  },
  {
    id: "e4",
    title: "Cuddle Crumb Cake",
    category: "entree",
    caloriesOrTime: "15 mins",
    priceTag: "♥♥",
    description: "Cuddle up with your partner completely unplugged from daily life. Share whispers, slow touches, and the warmth of simply being present together — no agenda needed.",
    recipePairing: "Pairs with a cozy blanket 🧸",
  },

  // Sides & Desserts (Sweet Bites)
  {
    id: "s1",
    title: "Compliment Covered Strawberry",
    category: "side_dessert",
    caloriesOrTime: "5 mins",
    priceTag: "♥",
    description: "Dip into a warm moment — share three specific things you genuinely adore about your partner right here, right now. Let each compliment melt over them like rich chocolate.",
  },
  {
    id: "s2",
    title: "Hand-in-Hand Honeycomb",
    category: "side_dessert",
    caloriesOrTime: "3 mins",
    priceTag: "♥",
    description: "Hold hands for three uninterrupted minutes while taking turns sharing what you're most grateful for about each other this week. Sweet, sticky connection guaranteed.",
  },
  {
    id: "s3",
    title: "Love Note Macaron",
    category: "side_dessert",
    caloriesOrTime: "2 mins",
    priceTag: "♥",
    description: "Write a tiny, sweet love note on a sticky pad and hide it where your partner will discover it — bathroom mirror, lunch bag, car dashboard. Delicate, thoughtful, unforgettable.",
  },
  {
    id: "s4",
    title: "Unplugged Parfait",
    category: "side_dessert",
    caloriesOrTime: "20 mins",
    priceTag: "♥♥",
    description: "Layer up a distraction-free conversation. Start with what made you laugh this week, add a favorite shared memory, and top with one dream you want to chase together. No phones at the table.",
  },
  {
    id: "s5",
    title: "Chocolate Love-a Cake",
    category: "side_dessert",
    caloriesOrTime: "30 mins",
    priceTag: "♥♥",
    description: "Surprise your partner with warm, rich, molten-centered chocolate cakes fresh from the oven. As the gooey center spills out, take turns sharing one thing you've always loved about them but never said aloud. Sweet, messy, and unforgettable.",
  },
];

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
    <div className="min-h-screen px-4 md:px-8 pt-6 pb-28 md:pb-12 flex flex-col space-y-6 bg-white dark:bg-[#000000] text-[#3C3C3C] dark:text-[#E7E7E7] transition-colors duration-300">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 overflow-hidden md:hidden">
            <Image src="/logo.png" alt="Table for Two Logo" width={40} height={40} className="object-contain" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#3C3C3C] dark:text-white leading-tight">
              Daily Menu 📜
            </h1>
            <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-paragraph">
              Curated acts of love & bite-sized moments of appreciation
            </p>
          </div>
        </div>


      </div>

      {/* Order Summary Counter */}
      {selectedCount > 0 && (
        <div className="bg-[#629390] text-white rounded-2xl p-4 shadow-md flex items-center justify-between animate-fadeIn">
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
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E7E7E7] dark:border-neutral-800 pb-2">
            <ChefHat className="w-5 h-5 text-[#C95D64]" />
            <h2 className="text-xl font-bold font-heading text-[#3C3C3C] dark:text-white">
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
                      ? "bg-[#C95D64]/10 dark:bg-[#C95D64]/20 border-[#C95D64]"
                      : "bg-neutral-50 dark:bg-[#212121] border-[#E7E7E7] dark:border-neutral-800 hover:border-[#C95D64]/50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#629390]">{item.priceTag}</span>
                      <span className="text-xs text-neutral-400">•</span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.caloriesOrTime}
                      </span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? "bg-[#C95D64] border-[#C95D64] text-white"
                          : "border-neutral-300 dark:border-neutral-600 text-transparent"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold font-paragraph text-[#3C3C3C] dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {item.description}
                  </p>

                  {item.recipePairing && (
                    <span className="mt-3 inline-block text-[11px] font-semibold text-[#629390] bg-[#629390]/15 px-2.5 py-0.5 rounded-full">
                      {item.recipePairing}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Sides & Desserts (Quick Check-ins) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E7E7E7] dark:border-neutral-800 pb-2">
            <IceCream className="w-5 h-5 text-[#629390]" />
            <h2 className="text-xl font-bold font-heading text-[#3C3C3C] dark:text-white">
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
                      ? "bg-[#629390]/10 dark:bg-[#629390]/20 border-[#629390]"
                      : "bg-neutral-50 dark:bg-[#212121] border-[#E7E7E7] dark:border-neutral-800 hover:border-[#629390]/50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#C95D64]">{item.priceTag}</span>
                      <span className="text-xs text-neutral-400">•</span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.caloriesOrTime}
                      </span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? "bg-[#629390] border-[#629390] text-white"
                          : "border-neutral-300 dark:border-neutral-600 text-transparent"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold font-paragraph text-[#3C3C3C] dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
