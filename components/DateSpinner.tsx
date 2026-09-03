"use client";

import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Filter, Sparkles, Heart, DollarSign, MapPin, X, RotateCcw, CheckCircle2, RefreshCw } from "lucide-react";

export interface DateOption {
  id: string;
  title: string;
  category: "cozy" | "outdoor" | "romantic" | "quick";
  cost: "$" | "$$" | "$$$";
  location: "home" | "out";
  description: string;
  prepTime: string;
}

export const INITIAL_DATE_OPTIONS: DateOption[] = [
  {
    id: "1",
    title: "Homemade Pasta Night",
    category: "cozy",
    cost: "$$",
    location: "home",
    description: "Make fresh pasta dough together from scratch with wine & candles.",
    prepTime: "60 mins",
  },
  {
    id: "2",
    title: "Sunset Stargazing Picnic",
    category: "outdoor",
    cost: "$",
    location: "out",
    description: "Pack blankets, cozy hot cacao, and watch the stars at a quiet viewpoint.",
    prepTime: "30 mins",
  },
  {
    id: "3",
    title: "Speakeasy Cocktail Crawl",
    category: "romantic",
    cost: "$$$",
    location: "out",
    description: "Dress up and discover two hidden local speakeasies with signature drinks.",
    prepTime: "120 mins",
  },
  {
    id: "4",
    title: "15-Minute Dessert Challenge",
    category: "quick",
    cost: "$",
    location: "home",
    description: "Race to create the wildest ice cream sundae or crepe topping creation.",
    prepTime: "15 mins",
  },
  {
    id: "5",
    title: "Vinyl & Candlelight Fondue",
    category: "cozy",
    cost: "$$",
    location: "home",
    description: "Melt chocolate or cheese fondue while playing favorite old vinyl records.",
    prepTime: "40 mins",
  },
  {
    id: "6",
    title: "Midnight Drive & Boba",
    category: "quick",
    cost: "$",
    location: "out",
    description: "Late night playlist jam session in the car with your favorite boba tea.",
    prepTime: "45 mins",
  },
];

const SEGMENT_COLORS = ["#C95D64", "#212121", "#E7E7E7"];
const TEXT_COLORS = ["#FFFFFF", "#FFFFFF", "#3C3C3C"];

interface DateSpinnerProps {
  onDateSelected?: (date: DateOption) => void;
}

export default function DateSpinner({ onDateSelected }: DateSpinnerProps) {
  const [options, setOptions] = useState<DateOption[]>(INITIAL_DATE_OPTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedBudget, setSelectedBudget] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [winningDate, setWinningDate] = useState<DateOption | null>(null);

  const controls = useAnimation();

  // Filter items based on category, location, and budget
  const filteredOptions = options.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    if (selectedLocation !== "all" && item.location !== selectedLocation) return false;
    if (selectedBudget !== "all" && item.cost !== selectedBudget) return false;
    return true;
  });

  const activeOptions = filteredOptions.length >= 2 ? filteredOptions : options;

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedLocation("all");
    setSelectedBudget("all");
  };

  const spinWheel = async () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinningDate(null);

    const segmentCount = activeOptions.length;
    const segmentAngle = 360 / segmentCount;

    // Pick a random index
    const randomIndex = Math.floor(Math.random() * segmentCount);
    
    // Angle offset so segment lands in the middle of pointer
    const extraSpins = (Math.floor(Math.random() * 3) + 4) * 360;
    const targetSegmentCenter = randomIndex * segmentAngle + segmentAngle / 2;
    const targetRotation = currentRotation + extraSpins + (360 - (currentRotation % 360)) + (360 - targetSegmentCenter);

    setCurrentRotation(targetRotation);

    await controls.start({
      rotate: targetRotation,
      transition: {
        duration: 4.5,
        ease: [0.15, 0.99, 0.25, 1], // Physics spring curve
      },
    });

    const chosenOption = activeOptions[randomIndex];
    setWinningDate(chosenOption);
    setIsSpinning(false);

    if (onDateSelected) {
      onDateSelected(chosenOption);
    }
  };

  const hasActiveFilters = selectedCategory !== "all" || selectedLocation !== "all" || selectedBudget !== "all";

  return (
    <div className="flex flex-col items-center w-full relative">
      {/* Header controls: Filter Button */}
      <div className="w-full flex items-center justify-between px-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          <Sparkles className="w-4 h-4 text-[#C95D64]" />
          <span>{activeOptions.length} Date Ideas Ready</span>
          {hasActiveFilters && (
            <span className="text-[10px] text-[#629390] font-bold">
              ({selectedBudget !== "all" ? `Budget: ${selectedBudget === "$" ? "Frugal" : selectedBudget === "$$" ? "Average" : "Splurge"}` : "Filtered"})
            </span>
          )}
        </div>

        {/* Teal Filter Button */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#629390] text-white text-xs font-medium shadow-sm hover:opacity-90 transition-all active:scale-95"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Vibe & Budget</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          )}
        </button>
      </div>

      {/* Responsive Wheel Wrapper Container */}
      <div className="relative w-[280px] h-[280px] sm:w-[330px] sm:h-[330px] md:w-[360px] md:h-[360px] flex items-center justify-center my-2">
        {/* Top Pointer Pin */}
        <div className="absolute -top-3 z-30 flex flex-col items-center">
          <div className="w-6 h-6 bg-[#C95D64] rotate-45 transform rounded-sm shadow-md border-2 border-white dark:border-[#212121]" />
        </div>

        {/* Outer Glowing Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-[#629390]/30 dark:border-[#629390]/40 animate-pulse pointer-events-none" />

        {/* Motion SVG Wheel */}
        <motion.div
          animate={controls}
          style={{ transformOrigin: "center center" }}
          className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-[#212121]"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {activeOptions.map((option, index) => {
              const count = activeOptions.length;
              const angle = 360 / count;
              const startAngle = index * angle;
              const endAngle = (index + 1) * angle;

              // Convert polar to cartesian
              const startRad = (Math.PI * startAngle) / 180;
              const endRad = (Math.PI * endAngle) / 180;
              const x1 = 50 + 50 * Math.cos(startRad);
              const y1 = 50 + 50 * Math.sin(startRad);
              const x2 = 50 + 50 * Math.cos(endRad);
              const y2 = 50 + 50 * Math.sin(endRad);

              const largeArcFlag = angle > 180 ? 1 : 0;
              const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

              const bgColor = SEGMENT_COLORS[index % SEGMENT_COLORS.length];
              const textColor = TEXT_COLORS[index % TEXT_COLORS.length];

              // Label angle position
              const midAngle = startAngle + angle / 2;
              const midRad = (Math.PI * midAngle) / 180;
              const textX = 50 + 32 * Math.cos(midRad);
              const textY = 50 + 32 * Math.sin(midRad);

              return (
                <g key={option.id}>
                  <path d={pathData} fill={bgColor} stroke="#ffffff" strokeWidth="0.5" />
                  <text
                    x={textX}
                    y={textY}
                    fill={textColor}
                    fontSize="3.8"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                    className="select-none font-paragraph"
                  >
                    {option.title.length > 14
                      ? option.title.substring(0, 12) + "..."
                      : option.title}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* Center Spin Button */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="absolute z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#C95D64] hover:bg-[#b54f56] active:scale-95 text-white flex flex-col items-center justify-center p-2 shadow-xl border-4 border-white dark:border-[#212121] transition-all disabled:opacity-80 disabled:cursor-not-allowed group"
        >
          <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 text-white ${isSpinning ? "animate-spin" : "group-hover:rotate-12"}`} />
          <span className="text-[10px] sm:text-[11px] font-extrabold leading-tight tracking-wider uppercase text-center font-paragraph">
            {isSpinning ? "" : "SPIN"}
          </span>
        </button>
      </div>

      {/* Winning Result Modal / Announcement Card */}
      {winningDate && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="mt-6 w-full max-w-sm bg-white dark:bg-[#212121] border-2 border-[#C95D64]/30 rounded-2xl p-5 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#C95D64]/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C95D64] text-white">
              Tonight's Pick! 🍷
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {winningDate.location === "home" ? "Stay at Home" : "Out & About"}
            </span>
          </div>

          <h3 className="text-xl font-bold font-paragraph text-neutral-800 dark:text-white mb-1.5">
            {winningDate.title}
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
            {winningDate.description}
          </p>

          <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-3">
            <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="font-semibold text-[#629390]">Cost: {winningDate.cost}</span>
              <span>•</span>
              <span>Time: {winningDate.prepTime}</span>
            </div>

            <button
              onClick={spinWheel}
              className="flex items-center gap-1 text-xs text-[#C95D64] font-semibold hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Spin Again
            </button>
          </div>
        </motion.div>
      )}

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white dark:bg-[#212121] rounded-3xl p-6 shadow-2xl border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#629390]" />
                <h3 className="text-lg font-bold font-paragraph text-neutral-900 dark:text-white">
                  Filter Date Vibe & Budget
                </h3>
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Budget Level Filter */}
            <div className="mb-4">
              <label className="text-xs font-semibold uppercase text-neutral-400 mb-2 flex items-center justify-between tracking-wider">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-[#629390]" /> Budget Tier
                </span>
                {selectedBudget !== "all" && (
                  <span className="text-[10px] text-[#629390] capitalize">Selected: {selectedBudget}</span>
                )}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: "all", label: "Any Budget" },
                  { id: "$", label: "Frugal ($)" },
                  { id: "$$", label: "Average ($$)" },
                  { id: "$$$", label: "Splurge ($$$)" },
                ].map((bgt) => (
                  <button
                    key={bgt.id}
                    onClick={() => setSelectedBudget(bgt.id)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      selectedBudget === bgt.id
                        ? "bg-[#629390] text-white shadow-sm"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {bgt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Category selection */}
            <div className="mb-4">
              <label className="text-xs font-semibold uppercase text-neutral-400 mb-2 block tracking-wider">
                Category / Mood
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "all", label: "All Vibes" },
                  { id: "cozy", label: "Cozy & Warm" },
                  { id: "romantic", label: "Romantic" },
                  { id: "outdoor", label: "Outdoor" },
                  { id: "quick", label: "Quick Fun" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      selectedCategory === cat.id
                        ? "bg-[#629390] text-white shadow-sm"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Location selection */}
            <div className="mb-5">
              <label className="text-xs font-semibold uppercase text-neutral-400 mb-2 block tracking-wider">
                Location Setting
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "all", label: "Anywhere" },
                  { id: "home", label: "At Home" },
                  { id: "out", label: "Out & About" },
                ].map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      selectedLocation === loc.id
                        ? "bg-[#629390] text-white shadow-sm"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold transition-all flex items-center justify-center gap-1"
                  title="Reset all filters"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 py-3 rounded-xl bg-[#C95D64] hover:bg-[#b54f56] text-white text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Apply Filters ({activeOptions.length} ideas)
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
