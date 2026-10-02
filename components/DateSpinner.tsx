"use client";

import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Filter, Sparkles, DollarSign, MapPin, X, RotateCcw, CheckCircle2, RefreshCw } from "lucide-react";
import { selectRandomDate } from "@/app/dates/actions";
import type { DateOption } from "@/lib/dateOptions";
import { INITIAL_DATE_OPTIONS } from "@/lib/dateOptions";

export type { DateOption } from "@/lib/dateOptions";
export { INITIAL_DATE_OPTIONS } from "@/lib/dateOptions";

// Wheel segment fills. These are SVG `fill` attributes, not Tailwind classes,
// so they cannot use the utility tokens directly — they read the same CSS
// custom properties the @theme block defines.
const SEGMENT_COLORS = [
  "var(--color-primary)",
  "var(--color-dark-surface)",
  "var(--color-light-gray)",
];

/**
 * Number of decorative wheel segments. The segments are purely visual —
 * they do not represent date ideas. The winning date is chosen by the
 * server (see app/dates/actions.ts) while the wheel spins.
 */
const SEGMENT_COUNT = 12;

interface DateSpinnerProps {
  onDateSelected?: (date: DateOption) => void;
}

export default function DateSpinner({ onDateSelected }: DateSpinnerProps) {
  const [options] = useState<DateOption[]>(INITIAL_DATE_OPTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedBudget, setSelectedBudget] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinError, setSpinError] = useState<string | null>(null);
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
    setSpinError(null);

    // Ask the backend to pick the winning date idea. The wheel below is
    // decorative only — the result comes from the server, not from where
    // the pointer lands.
    let chosenOption: DateOption | null = null;
    try {
      chosenOption = await selectRandomDate({
        category: selectedCategory,
        location: selectedLocation,
        budget: selectedBudget,
      });
    } catch {
      // Network or server failure — surface it instead of silently spinning
      // to an empty result.
      setSpinError("We couldn’t reach the kitchen. Please try spinning again.");
      setIsSpinning(false);
      return;
    }

    if (chosenOption === null) {
      setSpinError("No date ideas match those filters. Try loosening them and spin again.");
      setIsSpinning(false);
      return;
    }

    // Angle offset so segment lands in the middle of pointer
    const segmentAngle = 360 / SEGMENT_COUNT;
    const extraSpins = (Math.floor(Math.random() * 3) + 4) * 360;
    const targetSegmentCenter = Math.floor(Math.random() * SEGMENT_COUNT) * segmentAngle + segmentAngle / 2;
    const targetRotation = currentRotation + extraSpins + (360 - (currentRotation % 360)) + (360 - targetSegmentCenter);

    setCurrentRotation(targetRotation);

    await controls.start({
      rotate: targetRotation,
      transition: {
        duration: 4.5,
        ease: [0.15, 0.99, 0.25, 1], // Physics spring curve
      },
    });

    setWinningDate(chosenOption);
    setIsSpinning(false);

    if (chosenOption && onDateSelected) {
      onDateSelected(chosenOption);
    }
  };

  const hasActiveFilters = selectedCategory !== "all" || selectedLocation !== "all" || selectedBudget !== "all";

  return (
    <div className="flex flex-col items-center w-full relative">
      {/* Header controls: Filter Button */}
      <div className="w-full flex items-center justify-between px-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>{activeOptions.length} Date Ideas Ready</span>
          {hasActiveFilters && (
            <span className="text-[10px] text-secondary-accent font-bold">
              ({selectedBudget !== "all" ? `Budget: ${selectedBudget === "$" ? "Frugal" : selectedBudget === "$$" ? "Average" : "Splurge"}` : "Filtered"})
            </span>
          )}
        </div>

        {/* Teal Filter Button */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary-accent text-white text-xs font-medium shadow-sm hover:opacity-90 transition-all active:scale-95"
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
          <div className="w-6 h-6 bg-primary rotate-45 transform rounded-sm shadow-md border-2 border-white dark:border-dark-surface" />
        </div>

        {/* Outer Glowing Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-secondary-accent/30 dark:border-secondary-accent/40 animate-pulse pointer-events-none" />

        {/* Motion SVG Wheel */}
        <motion.div
          animate={controls}
          style={{ transformOrigin: "center center" }}
          className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-dark-surface"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {Array.from({ length: SEGMENT_COUNT }, (_, index) => {
              const angle = 360 / SEGMENT_COUNT;
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

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={bgColor}
                  stroke="var(--color-light-bg)"
                  strokeWidth="0.5"
                />
              );
            })}
          </svg>
        </motion.div>

        {/* Center Spin Button */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="absolute z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary hover:bg-primary-hover active:scale-95 text-white flex flex-col items-center justify-center p-2 shadow-xl border-4 border-white dark:border-dark-surface transition-all disabled:opacity-80 disabled:cursor-not-allowed group"
        >
          <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 text-white ${isSpinning ? "animate-spin" : "group-hover:rotate-12"}`} />
          <span className="text-[10px] sm:text-[11px] font-extrabold leading-tight tracking-wider uppercase text-center font-paragraph">
            {isSpinning ? "PICKING…" : "SPIN"}
          </span>
        </button>
      </div>

      {/* Spin failure — server unreachable, or no ideas match the filters */}
      {spinError && (
        <div
          role="alert"
          className="mt-6 w-full max-w-sm rounded-2xl border-2 border-primary/30 bg-white dark:bg-dark-surface p-4 text-sm text-light-text dark:text-dark-text"
        >
          {spinError}
        </div>
      )}

      {/* Winning Result Modal / Announcement Card */}
      {winningDate && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="mt-6 w-full max-w-sm bg-white dark:bg-dark-surface border-2 border-primary/30 rounded-2xl p-5 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-white">
              Tonight&rsquo;s Pick! 🍷
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
              <span className="font-semibold text-secondary-accent">Cost: {winningDate.cost}</span>
              <span>•</span>
              <span>Time: {winningDate.prepTime}</span>
            </div>

            <button
              onClick={spinWheel}
              className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
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
            className="w-full max-w-sm bg-white dark:bg-dark-surface rounded-3xl p-6 shadow-2xl border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-secondary-accent" />
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
                  <DollarSign className="w-3.5 h-3.5 text-secondary-accent" /> Budget Tier
                </span>
                {selectedBudget !== "all" && (
                  <span className="text-[10px] text-secondary-accent capitalize">Selected: {selectedBudget}</span>
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
                        ? "bg-secondary-accent text-white shadow-sm"
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
                        ? "bg-secondary-accent text-white shadow-sm"
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
                        ? "bg-secondary-accent text-white shadow-sm"
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
                className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2"
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
