"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircleHeart,
  Search,
  Shuffle,
  Bookmark,
  Heart,
  Trash2,
} from "lucide-react";
import {
  CONVERSATION_TOPICS,
  TOPIC_CATEGORIES,
  type ConversationTopic,
} from "@/lib/conversationTopics";
import { useSavedConversations } from "@/components/useSavedConversations";
import { RevealDiv, RevealSection } from "@/components/Reveal";

/** "Saved 3 days ago" style stamp for the manual-saves list. */
function formatSavedAt(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "Saved";

  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "Saved today";
  if (days === 1) return "Saved yesterday";
  if (days < 7) return `Saved ${days} days ago`;
  return `Saved ${new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

export default function ConversationsPage() {
  const [deckIndex, setDeckIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { saved, toggleSave } = useSavedConversations();

  // Bottom fade over the topic list: shown only while content remains below.
  const topicListRef = useRef<HTMLUListElement | null>(null);
  const [hasMoreBelow, setHasMoreBelow] = useState(false);

  const syncFade = useCallback(() => {
    const el = topicListRef.current;
    if (!el) return;
    // 1px tolerance absorbs sub-pixel rounding at the end of the scroll range.
    const remaining = el.scrollHeight - el.clientHeight - el.scrollTop;
    setHasMoreBelow(remaining > 1);
  }, []);

  const currentCard = CONVERSATION_TOPICS[deckIndex % CONVERSATION_TOPICS.length];

  const nextCard = () => {
    setDeckIndex((prev) => prev + 1);
  };

  // Browse Topics filters the *browseable* pool of potential topics.
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isFiltering = normalizedQuery.length > 0 || selectedCategory !== "all";
  const filteredTopics = CONVERSATION_TOPICS.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) {
      return false;
    }
    if (!normalizedQuery) return true;
    return (
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.question.toLowerCase().includes(normalizedQuery) ||
      item.followUp.toLowerCase().includes(normalizedQuery)
    );
  });

  // Re-measure the fade whenever the list contents change.
  useEffect(() => {
    syncFade();
  }, [syncFade, filteredTopics.length, normalizedQuery, selectedCategory]);

  // Past Conversations is no longer a search result — it is only what the user
  // explicitly bookmarked, newest save first.
  const savedConversations = Object.entries(saved)
    .map(([id, savedAt]) => ({
      topic: CONVERSATION_TOPICS.find((t) => t.id === id),
      savedAt,
    }))
    .filter((entry): entry is { topic: ConversationTopic; savedAt: string } => Boolean(entry.topic))
    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());

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
              Conversations 💬
            </h1>
            <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-paragraph">
              Spark deep dialogue, romantic reflection & shared dreams
            </p>
          </div>
        </div>


      </RevealDiv>

      {/* Responsive Grid Layout on Desktop/Tablet (LG screen 2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Card Deck & Search */}
        <RevealDiv delay={0.07} className="lg:col-span-7 space-y-6">
          {/* 1. Quick Convos Interactive Card Deck */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-heading text-light-text dark:text-white">
                  Quick Convos
                </h2>
              </div>
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                Card {(deckIndex % CONVERSATION_TOPICS.length) + 1} of{" "}
                {CONVERSATION_TOPICS.length}
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
                  className="w-full bg-neutral-50 dark:bg-dark-surface rounded-3xl p-6 shadow-md border-2 border-primary/20 flex flex-col justify-between relative overflow-hidden transition-colors duration-300"
                >
                  {/* Corner accent — blooms out of the top-right corner only when saved */}
                  <div
                    aria-hidden="true"
                    className={`absolute top-0 right-0 w-32 h-32 bg-primary/15 rounded-bl-full origin-top-right pointer-events-none transition-all duration-500 ease-out motion-reduce:transition-none ${
                      saved[currentCard.id]
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-50"
                    }`}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-primary text-white">
                        {currentCard.title}
                      </span>

                      <button
                        onClick={() => toggleSave(currentCard.id)}
                        aria-label={
                          saved[currentCard.id] ? "Remove from saved" : "Save conversation"
                        }
                        aria-pressed={Boolean(saved[currentCard.id])}
                        className="p-1.5 rounded-full text-neutral-400 hover:text-primary transition-colors"
                      >
                        <Bookmark
                          className={`w-5 h-5 ${saved[currentCard.id] ? "fill-primary text-primary" : ""}`}
                        />
                      </button>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold font-paragraph text-light-text dark:text-white mb-2 leading-snug">
                      &ldquo;{currentCard.question}&rdquo;
                    </h3>

                    <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 italic">
                      Follow-up: {currentCard.followUp}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-neutral-200/80 dark:border-neutral-800 pt-3">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> Take turn asking
                    </span>

                    <button
                      onClick={nextCard}
                      className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs md:text-sm font-bold shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
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
            <h2 className="text-xl font-bold font-heading text-light-text dark:text-white">
              Browse Topics
            </h2>

            {/* Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversation topics..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 dark:bg-dark-surface border border-light-gray dark:border-neutral-800 text-xs md:text-sm text-light-text dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-secondary-accent"
              />
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {TOPIC_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-secondary-accent text-white shadow-sm"
                      : "bg-neutral-50 dark:bg-dark-surface text-neutral-700 dark:text-neutral-300 border border-light-gray dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Result count — announces filter changes to screen readers */}
            <p
              role="status"
              aria-live="polite"
              className="text-[11px] md:text-xs text-neutral-500 dark:text-neutral-400 font-paragraph"
            >
              {isFiltering ? (
                <>
                  Showing <span className="font-bold text-secondary-accent">{filteredTopics.length}</span>{" "}
                  of {CONVERSATION_TOPICS.length} topics
                </>
              ) : (
                <>
                  <span className="font-bold text-secondary-accent">
                    {CONVERSATION_TOPICS.length}
                  </span>{" "}
                  topics to explore
                </>
              )}
            </p>

            {/* Filtered topic results */}
            {filteredTopics.length === 0 ? (
              <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-paragraph py-4 text-center">
                {normalizedQuery
                  ? `No topics match “${searchQuery.trim()}”. Try another search or category.`
                  : "No topics in this category yet. Try another category."}
              </p>
            ) : (
              <div className="relative">
                <ul
                  ref={topicListRef}
                  onScroll={syncFade}
                  className="space-y-2.5 max-h-[420px] overflow-y-auto scrollbar-slim pr-1.5"
                >
                {filteredTopics.map((item) => (
                  <li
                    key={item.id}
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-dark-surface border border-light-gray dark:border-neutral-800 flex items-start justify-between gap-3 transition-colors duration-300"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-accent">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-light-text dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5">
                        {item.question}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleSave(item.id)}
                      aria-label={
                        saved[item.id]
                          ? `Remove ${item.title} from saved`
                          : `Save ${item.title}`
                      }
                      aria-pressed={Boolean(saved[item.id])}
                      className="p-1.5 shrink-0 rounded-full text-neutral-400 hover:text-primary transition-colors"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${saved[item.id] ? "fill-primary text-primary" : ""}`}
                      />
                    </button>
                  </li>
                ))}
                </ul>

                {/* Bottom fade — only while there is more list below to scroll to.
                    Fades to the PAGE background (white / black), not the card
                    color: the list sits on the page background, so fading to
                    the card color paints a gray band with hard edges. */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white from-35% via-white/55 to-transparent dark:from-black dark:via-black/55 transition-opacity duration-200 ${
                    hasMoreBelow ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            )}
          </section>
        </RevealDiv>

        {/* Right Column (5 cols): Manually Saved Conversations */}
        <RevealSection
          delay={0.14}
          className="lg:col-span-5 space-y-3 bg-neutral-50 dark:bg-dark-surface p-6 rounded-3xl border border-light-gray dark:border-neutral-800 shadow-md transition-colors duration-300"
        >
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
            <MessageCircleHeart className="w-5 h-5 text-secondary-accent" />
            <h2 className="text-xl font-bold font-heading text-light-text dark:text-white">
              Saved Conversations
            </h2>
          </div>

          {savedConversations.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <Bookmark className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-600" />
              <p className="text-sm font-bold text-light-text dark:text-neutral-100">
                Nothing saved yet
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-paragraph">
                Tap the bookmark on any card or topic to keep it here for later.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedConversations.map(({ topic, savedAt }) => (
                <div
                  key={topic.id}
                  className="p-4 rounded-2xl bg-white dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/50 shadow-sm flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary-accent/15 text-secondary-accent">
                      {topic.category}
                    </span>
                    <button
                      onClick={() => toggleSave(topic.id)}
                      aria-label={`Remove ${topic.title} from saved`}
                      className="p-1 rounded-full text-neutral-400 hover:text-primary transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-light-text dark:text-neutral-100">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 italic">
                    &ldquo;{topic.question}&rdquo;
                  </p>
                  <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                    {formatSavedAt(savedAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </RevealSection>
      </div>
    </div>
  );
}
