"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircleHeart,
  Search,
  Sparkles,
  Shuffle,
  Bookmark,
  Heart,
  Calendar,
  ChevronRight,
  Filter,
  Check,
} from "lucide-react";
interface ConvoCard {
  id: string;
  topic: string;
  category: "romance" | "dreams" | "playful" | "deep";
  question: string;
  followUp: string;
}

const CARDS_DECK: ConvoCard[] = [
  {
    id: "q1",
    topic: "Culinary Memory",
    category: "romance",
    question: "What is the single happiest meal memory you and I have ever shared together?",
    followUp: "What specific smell or taste brings you back to that moment?",
  },
  {
    id: "q2",
    topic: "Future Dreams",
    category: "dreams",
    question: "If we took a year off to live in a small coastal town, how would we spend our Tuesdays?",
    followUp: "What local dish would we master cooking?",
  },
  {
    id: "q3",
    topic: "Playful Secret",
    category: "playful",
    question: "What is a silly habit or quirk of mine that secretly makes you smile every time?",
    followUp: "When did you first notice it?",
  },
  {
    id: "q4",
    topic: "Deep Connection",
    category: "deep",
    question: "In what way have I grown or changed over the past year that you admire most?",
    followUp: "How can I support your growth next month?",
  },
  {
    id: "q5",
    topic: "Romance & Spark",
    category: "romance",
    question: "What song or melody always reminds you of our early courting days?",
    followUp: "Shall we put it on right now?",
  },
];

const PAST_CONVERSATIONS = [
  {
    id: "hist-1",
    topic: "First Kiss Memory",
    date: "Yesterday",
    summary: "Alex remembered the exact song playing in the car on the night of our first kiss.",
    category: "Romance",
  },
  {
    id: "hist-2",
    topic: "Future House Vision",
    date: "3 days ago",
    summary: "Agreed on a big wooden kitchen island with herb pots on the window sill.",
    category: "Dreams",
  },
  {
    id: "hist-3",
    topic: "Love Languages Check-in",
    date: "Last week",
    summary: "Taylor loved the surprise morning coffee toast note.",
    category: "Deep",
  },
];

export default function ConversationsPage() {
  const [deckIndex, setDeckIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [savedConvos, setSavedConvos] = useState<Record<string, boolean>>({});

  const currentCard = CARDS_DECK[deckIndex % CARDS_DECK.length];

  const nextCard = () => {
    setDeckIndex((prev) => prev + 1);
  };

  const toggleSave = (id: string) => {
    setSavedConvos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredPast = PAST_CONVERSATIONS.filter((item) => {
    if (
      searchQuery &&
      !item.topic.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.summary.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (selectedCategory !== "all" && item.category.toLowerCase() !== selectedCategory) {
      return false;
    }
    return true;
  });

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
              Conversations 💬
            </h1>
            <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-paragraph">
              Spark deep dialogue, romantic reflection & shared dreams
            </p>
          </div>
        </div>


      </div>

      {/* Responsive Grid Layout on Desktop/Tablet (LG screen 2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Card Deck & Search */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Quick Convos Interactive Card Deck */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-heading text-[#3C3C3C] dark:text-white">
                  Quick Convos
                </h2>
              </div>
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                Card {(deckIndex % CARDS_DECK.length) + 1} of {CARDS_DECK.length}
              </span>
            </div>
            <div>
              <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-paragraph">
                Find something fast
              </p>
            </div>

            {/* Card Container */}
            <div className="relative w-full min-h-[260px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCard.id}
                  initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.05, rotate: 3 }}
                  transition={{ duration: 0.25 }}
                  className="w-full bg-neutral-50 dark:bg-[#212121] rounded-3xl p-6 shadow-md border-2 border-[#C95D64]/20 flex flex-col justify-between relative overflow-hidden transition-colors duration-300"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#C95D64]/10 rounded-bl-full pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#C95D64] text-white">
                        {currentCard.topic}
                      </span>

                      <button
                        onClick={() => toggleSave(currentCard.id)}
                        className="p-1.5 rounded-full text-neutral-400 hover:text-[#C95D64] transition-colors"
                      >
                        <Bookmark
                          className={`w-5 h-5 ${savedConvos[currentCard.id] ? "fill-[#C95D64] text-[#C95D64]" : ""}`}
                        />
                      </button>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold font-paragraph text-[#3C3C3C] dark:text-white mb-2 leading-snug">
                      "{currentCard.question}"
                    </h3>

                    <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 italic">
                      Follow-up: {currentCard.followUp}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-neutral-200/80 dark:border-neutral-800 pt-3">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-[#C95D64] fill-[#C95D64]" /> Take turn asking
                    </span>

                    <button
                      onClick={nextCard}
                      className="px-4 py-2 rounded-xl bg-[#C95D64] hover:bg-[#b54f56] text-white text-xs md:text-sm font-bold shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
                    >
                      <Shuffle className="w-4 h-4" />
                      Next Card
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          {/* 2. Browse Topics Search */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold font-heading text-[#3C3C3C] dark:text-white">
              Browse Topics
            </h2>

            {/* Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversation prompts..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 dark:bg-[#212121] border border-[#E7E7E7] dark:border-neutral-800 text-xs md:text-sm text-[#3C3C3C] dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#629390]"
              />
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: "all", label: "All Topics" },
                { id: "romance", label: "Romance" },
                { id: "dreams", label: "Dreams" },
                { id: "deep", label: "Deep Convos" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-[#629390] text-white shadow-sm"
                      : "bg-neutral-50 dark:bg-[#212121] text-neutral-700 dark:text-neutral-300 border border-[#E7E7E7] dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (5 cols): Past Conversations Stack */}
        <section className="lg:col-span-5 space-y-3 bg-neutral-50 dark:bg-[#212121] p-6 rounded-3xl border border-[#E7E7E7] dark:border-neutral-800 shadow-md transition-colors duration-300">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
            <MessageCircleHeart className="w-5 h-5 text-[#629390]" />
            <h2 className="text-xl font-bold font-heading text-[#3C3C3C] dark:text-white">
              Past Conversations
            </h2>
          </div>

          <div className="space-y-3">
            {filteredPast.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/50 shadow-sm flex flex-col gap-1.5 transition-transform hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#629390]/15 text-[#629390]">
                    {item.category}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{item.date}</span>
                </div>

                <h3 className="text-sm font-bold text-[#3C3C3C] dark:text-neutral-100">
                  {item.topic}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 italic">
                  "{item.summary}"
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
