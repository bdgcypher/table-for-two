"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Sparkles,
  Flame,
  Utensils,
  ChevronRight,
  MessageCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
const TODAY_SPECIALS = [
  {
    id: "spec-1",
    title: "Affirmations & Cinnamon Crepe",
    time: "20 mins",
    difficulty: "Medium",
    badge: "Words of Affirmation 💬",
    prompt: "Pen a heartfelt note sharing something you deeply admire about your partner. Top it with spontaneous spoken compliments and a drizzle of surprise flirty texts.",
    category: "Grand Gesture",
  },
  {
    id: "spec-2",
    title: "Compliment Covered Strawberry",
    time: "5 mins",
    difficulty: "Easy",
    badge: "Sweet Bite 🍫",
    prompt: "Dip into a warm moment — share three specific things you genuinely adore about your partner right here, right now.",
    category: "Quick Connection",
  },
  {
    id: "spec-3",
    title: "Cuddle Crumb Cake",
    time: "15 mins",
    difficulty: "Easy",
    badge: "Physical Touch 🤗",
    prompt: "Cuddle up together completely unplugged from daily life. Share whispers, slow touches, and the warmth of simply being present.",
    category: "Grand Gesture",
  },
];

const SPARK_CONVOS = [
  {
    id: "c1",
    topic: "First Impressions",
    question: "What exact detail made you realize you wanted a second date with me?",
    tag: "Nostalgia",
    bgLight: "bg-rose-50 border-rose-200 text-rose-950",
    bgDark: "dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-100",
  },
  {
    id: "c2",
    topic: "Dream Travel",
    question: "If we could board a plane tonight to any food capital in the world, where?",
    tag: "Future Plans",
    bgLight: "bg-teal-50 border-teal-200 text-teal-950",
    bgDark: "dark:bg-teal-950/40 dark:border-teal-800/60 dark:text-teal-100",
  },
  {
    id: "c3",
    topic: "Shared Values",
    question: "What is one small tradition we created that you hope we keep forever?",
    tag: "Deep Connection",
    bgLight: "bg-amber-50 border-amber-200 text-amber-950",
    bgDark: "dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-100",
  },
  {
    id: "c4",
    topic: "Love Languages",
    question: "How can I make you feel most cherished and supported this week?",
    tag: "Check-in",
    bgLight: "bg-purple-50 border-purple-200 text-purple-950",
    bgDark: "dark:bg-purple-950/40 dark:border-purple-800/60 dark:text-purple-100",
  },
];

export default function HomePage() {
  const [completedSpecials, setCompletedSpecials] = useState<Record<string, boolean>>({});
  const [specialsIndex, setSpecialsIndex] = useState(0);
  const [convosIndex, setConvosIndex] = useState(0);

  const specialsRef = useRef<HTMLDivElement>(null);
  const convosRef = useRef<HTMLDivElement>(null);

  const toggleSpecial = (id: string) => {
    setCompletedSpecials((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSpecialsScroll = useCallback(() => {
    const el = specialsRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth : 280;
    const gap = 16; // gap-4
    const idx = Math.round(el.scrollLeft / (cardWidth + gap));
    setSpecialsIndex(Math.min(idx, TODAY_SPECIALS.length - 1));
  }, []);

  const handleConvosScroll = useCallback(() => {
    const el = convosRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth : 260;
    const gap = 16;
    const idx = Math.round(el.scrollLeft / (cardWidth + gap));
    setConvosIndex(Math.min(idx, SPARK_CONVOS.length - 1));
  }, []);

  return (
    <div className="min-h-screen px-4 md:px-8 pt-6 pb-28 md:pb-12 flex flex-col space-y-8 bg-[#FFFFFF] dark:bg-[#000000] text-[#3C3C3C] dark:text-[#E7E7E7] transition-colors duration-300">
      {/* Mobile Top Header (Hidden on Tablet/Desktop since Navbar is at top) */}
      <header className="flex md:hidden items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 overflow-hidden">
            <Image src="/logo.png" alt="Table for Two Logo" width={44} height={44} className="object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-heading text-[#3C3C3C] dark:text-white leading-tight flex items-center gap-1.5">
              Table for Two <Heart className="w-5 h-5 fill-[#C95D64] text-[#C95D64] inline" />
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-paragraph">
              Cooking up Connection
            </p>
          </div>
        </div>


      </header>

      {/* Desktop/Tablet Welcome Banner */}
      <div className="hidden md:flex items-center justify-between pb-3 border-b border-[#E7E7E7] dark:border-neutral-800">
        <div>
          <h1 className="text-3xl font-bold font-heading text-[#3C3C3C] dark:text-white flex items-center gap-2">
            Welcome Back, Ben & Taylor <Heart className="w-6 h-6 fill-[#C95D64] text-[#C95D64]" />
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 font-paragraph mt-1">
            Nurture your relationship through acts of love & meaningful moments
          </p>
        </div>
      </div>

      {/* Hero: Connection Status Card */}
      <section className="bg-neutral-100/90 dark:bg-[#212121] rounded-3xl p-6 shadow-md border border-[#E7E7E7] dark:border-neutral-800 relative overflow-hidden flex flex-col justify-between transition-colors duration-300">
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#629390]/15 rounded-bl-full pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="px-3.5 py-1 rounded-full bg-[#629390] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
              Connected Live
            </span>
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" /> 1 Day Streak
            </span>
          </div>

          <h2 className="text-xl font-bold font-heading text-[#3C3C3C] dark:text-white">
            Relationship Harmony & Sync
          </h2>
          <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 font-paragraph mt-1 leading-relaxed">
            Both partner devices synchronized. High emotional resonance today!
          </p>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-300/60 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#C95D64] text-white text-xs font-bold flex items-center justify-center border-2 border-white dark:border-[#212121]">
                B
              </div>
              <div className="w-8 h-8 rounded-full bg-[#629390] text-white text-xs font-bold flex items-center justify-center border-2 border-white dark:border-[#212121]">
                T
              </div>
            </div>
            <span className="text-xs font-semibold text-[#3C3C3C] dark:text-neutral-300">
              Ben & Taylor
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-12 h-12">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-neutral-300 dark:text-neutral-700 stroke-current"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#629390] stroke-current"
                  strokeDasharray="98, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-bold text-[#629390]">98%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Specials (Responsive Grid on MD/LG) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[#C95D64]" />
            <h2 className="text-xl md:text-2xl font-bold font-heading text-[#3C3C3C] dark:text-white">
              Today's Specials
            </h2>
          </div>
          <Link href="/menu" className="text-xs md:text-sm font-semibold text-[#629390] hover:underline flex items-center gap-0.5">
            Full Menu <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Horizontal carousel for Specials */}
        <div
          ref={specialsRef}
          onScroll={handleSpecialsScroll}
          className="flex overflow-x-auto gap-4 no-scrollbar snap-x snap-mandatory"
        >
          {TODAY_SPECIALS.map((item) => {
            const isDone = completedSpecials[item.id];
            return (
              <div
                key={item.id}
                className={`flex-shrink-0 w-[280px] md:w-[340px] snap-start rounded-3xl p-5 shadow-sm border flex flex-col justify-between transition-all duration-300 ${
                  isDone
                    ? "bg-emerald-100/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100"
                    : "bg-neutral-100/90 dark:bg-[#212121] border-[#E7E7E7] dark:border-neutral-800 hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#C95D64]/15 text-[#C95D64]">
                      {item.badge}
                    </span>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.time}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-paragraph text-[#3C3C3C] dark:text-white mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                    {item.prompt}
                  </p>
                </div>

                <button
                  onClick={() => toggleSpecial(item.id)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isDone
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-white dark:bg-neutral-800 text-[#3C3C3C] dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isDone ? "Ordered & Enjoyed! 💖" : "Order This Special"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Indicator pills */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {TODAY_SPECIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const el = specialsRef.current;
                if (!el) return;
                const card = el.children[i] as HTMLElement;
                card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
              }}
              className={`rounded-full transition-all duration-200 ${
                i === specialsIndex
                  ? "w-5 h-2 bg-[#C95D64]"
                  : "w-2 h-2 bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500"
              }`}
              aria-label={`Go to special ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Spin the Date Wheel CTA */}
      {/* Mobile: compact button */}
      <Link
        href="/dates"
        className="md:hidden flex items-center justify-center gap-3 rounded-3xl bg-[#C95D64] hover:bg-[#b54f56] text-white font-bold text-lg py-5 px-6 shadow-lg shadow-[#C95D64]/20 transition-all active:scale-[0.98]"
      >
        <span className="font-heading text-xl">Spin the Date Wheel!</span>
      </Link>

      {/* Desktop: detailed card */}
      <Link href="/dates" className="hidden md:block group">
        <div className="rounded-3xl bg-[#C95D64] hover:bg-[#b54f56] text-white shadow-xl shadow-[#C95D64]/20 transition-all relative overflow-hidden">
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="p-6 flex flex-col justify-between">
            <h3 className="text-2xl font-extrabold font-paragraph leading-tight mb-2">
              Spin the Date Wheel
            </h3>
            <p className="text-sm font-paragraph text-white/80 leading-relaxed">
              Eliminate date night indecision with an interactive physics-based spinner wheel & mood filters.
            </p>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/20">
              <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                Launch Date Spinner
              </span>
              <ChevronRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>

      {/* Spark a Conversation (Responsive Grid on MD/LG) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#629390]" />
            <h2 className="text-xl md:text-2xl font-bold font-heading text-[#3C3C3C] dark:text-white">
              Spark a Conversation
            </h2>
          </div>
          <Link href="/conversations" className="text-xs md:text-sm font-semibold text-[#629390] hover:underline flex items-center gap-0.5">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Horizontal carousel for Conversation Cards */}
        <div
          ref={convosRef}
          onScroll={handleConvosScroll}
          className="flex overflow-x-auto gap-4 no-scrollbar snap-x snap-mandatory"
        >
          {SPARK_CONVOS.map((card) => (
            <div
              key={card.id}
              className={`flex-shrink-0 w-[260px] md:w-[300px] snap-start rounded-3xl p-5 shadow-sm border ${card.bgLight} ${card.bgDark} flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300`}
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/90 dark:bg-black/60 text-[#3C3C3C] dark:text-neutral-200 shadow-xs">
                  {card.tag}
                </span>
                <h3 className="text-sm font-bold text-[#3C3C3C] dark:text-neutral-100 mt-2.5 mb-1 font-paragraph">
                  {card.topic}
                </h3>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 italic leading-relaxed">
                  "{card.question}"
                </p>
              </div>

              <Link
                href="/conversations"
                className="mt-4 text-xs font-bold text-[#C95D64] hover:underline flex items-center gap-1"
              >
                Discuss Together <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Indicator pills */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {SPARK_CONVOS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const el = convosRef.current;
                if (!el) return;
                const card = el.children[i] as HTMLElement;
                card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
              }}
              className={`rounded-full transition-all duration-200 ${
                i === convosIndex
                  ? "w-5 h-2 bg-[#C95D64]"
                  : "w-2 h-2 bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500"
              }`}
              aria-label={`Go to conversation ${i + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
