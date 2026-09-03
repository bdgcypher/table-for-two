"use client";

import React, { useState } from "react";
import Image from "next/image";
import DateSpinner, { DateOption } from "@/components/DateSpinner";
import { Sparkles, Calendar, ChevronDown, ChevronUp, Heart, Star, PlusCircle } from "lucide-react";
interface PastDateItem {
  id: string;
  title: string;
  dateCompleted: string;
  rating: number;
  memoryNote: string;
  category: string;
}

const INITIAL_PAST_DATES: PastDateItem[] = [
  {
    id: "p1",
    title: "Homemade Pasta & Candlelight Night",
    dateCompleted: "Last Saturday",
    rating: 5,
    memoryNote: "We made gnocchi from scratch! Flour everywhere, but delicious.",
    category: "Cozy Culinary",
  },
  {
    id: "p2",
    title: "Sunset Rooftop Wine Tasting",
    dateCompleted: "2 weeks ago",
    rating: 5,
    memoryNote: "Watched the golden hour sunset with Pinot Noir.",
    category: "Romantic Night",
  },
  {
    id: "p3",
    title: "Midnight Stargazing & Hot Cocoa",
    dateCompleted: "3 weeks ago",
    rating: 4,
    memoryNote: "Saw two shooting stars near Lookout Hill.",
    category: "Outdoor Adventure",
  },
];

export default function DatesPage() {
  const [pastDates, setPastDates] = useState<PastDateItem[]>(INITIAL_PAST_DATES);

  const handleDateSelected = (date: DateOption) => {
    // Action hook if date is picked
  };

  return (
    <div className="min-h-screen px-4 md:px-8 pt-6 pb-28 md:pb-12 flex flex-col space-y-6 bg-white dark:bg-[#000000] text-[#3C3C3C] dark:text-[#E7E7E7] transition-colors duration-300">
      {/* Top Header Bar (Mobile only toggle theme, Desktop header in Nav) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 overflow-hidden md:hidden">
            <Image src="/logo.png" alt="Table for Two Logo" width={40} height={40} className="object-contain" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#3C3C3C] dark:text-white leading-tight">
              Date Spinner Wheel ✨
            </h1>
            <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-paragraph">
              Spin the interactive wheel & filter by vibe or location setting
            </p>
          </div>
        </div>


      </div>

      {/* Main Responsive Grid Layout (2-columns on LG screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Interactive Date Spinner Wheel */}
        <section className="lg:col-span-7 bg-neutral-50 dark:bg-[#212121] rounded-3xl p-6 shadow-md border border-[#E7E7E7] dark:border-neutral-800 flex flex-col items-center transition-colors duration-300">
          <DateSpinner onDateSelected={handleDateSelected} />
        </section>

        {/* Right Column (5 cols): Past Dates & Memories */}
        <section className="lg:col-span-5 bg-neutral-50 dark:bg-[#212121] rounded-3xl p-6 shadow-md border border-[#E7E7E7] dark:border-neutral-800 transition-colors duration-300">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
            <div className="p-2 rounded-xl bg-[#C95D64]/10 text-[#C95D64]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-[#3C3C3C] dark:text-white">
                Past Dates & Memories
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-paragraph">
                {pastDates.length} memorable date nights logged
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {pastDates.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/50 flex flex-col gap-1.5 transition-transform hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#629390]/15 text-[#629390]">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                    ))}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#3C3C3C] dark:text-neutral-100">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 italic">
                  "{item.memoryNote}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 pt-1 border-t border-neutral-100 dark:border-neutral-700/40">
                  <span>Completed {item.dateCompleted}</span>
                  <span className="flex items-center gap-1 text-[#C95D64] font-medium">
                    <Heart className="w-3.5 h-3.5 fill-[#C95D64]" /> Saved Memory
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
