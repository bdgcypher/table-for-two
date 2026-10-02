/**
 * Shared conversation-topic data. Deliberately free of React directives so it
 * can be imported by both Client Components (the deck + browse list on
 * /conversations) and, later, Server code.
 *
 * This is the browseable "what could we talk about?" pool. The Quick Convos
 * card deck draws from the same array so the two sections never disagree.
 */
export type TopicCategory = "romance" | "dreams" | "playful" | "deep";

export interface ConversationTopic {
  id: string;
  title: string;
  category: TopicCategory;
  question: string;
  followUp: string;
}

export const TOPIC_CATEGORIES: { id: TopicCategory | "all"; label: string }[] = [
  { id: "all", label: "All Topics" },
  { id: "romance", label: "Romance" },
  { id: "dreams", label: "Dreams" },
  { id: "playful", label: "Playful" },
  { id: "deep", label: "Deep Convos" },
];

export const CONVERSATION_TOPICS: ConversationTopic[] = [
  {
    id: "q1",
    title: "Culinary Memory",
    category: "romance",
    question:
      "What is the single happiest meal memory you and I have ever shared together?",
    followUp: "What specific smell or taste brings you back to that moment?",
  },
  {
    id: "q2",
    title: "Future Dreams",
    category: "dreams",
    question:
      "If we took a year off to live in a small coastal town, how would we spend our Tuesdays?",
    followUp: "What local dish would we master cooking?",
  },
  {
    id: "q3",
    title: "Playful Secret",
    category: "playful",
    question:
      "What is a silly habit or quirk of mine that secretly makes you smile every time?",
    followUp: "When did you first notice it?",
  },
  {
    id: "q4",
    title: "Deep Connection",
    category: "deep",
    question:
      "In what way have I grown or changed over the past year that you admire most?",
    followUp: "How can I support your growth next month?",
  },
  {
    id: "q5",
    title: "Romance & Spark",
    category: "romance",
    question:
      "What song or melody always reminds you of our early courting days?",
    followUp: "Shall we put it on right now?",
  },
  {
    id: "q6",
    title: "The Restaurant Table",
    category: "romance",
    question:
      "Describe the most romantic dinner we have ever been to — the light, the noise, the company.",
    followUp: "What would you order there again tomorrow night?",
  },
  {
    id: "q7",
    title: "Kitchen Confessions",
    category: "playful",
    question:
      "What is the most ridiculous thing you have ever burned in a kitchen?",
    followUp: "Did anyone else have to eat it anyway?",
  },
  {
    id: "q8",
    title: "The Host Question",
    category: "dreams",
    question:
      "Whose home would we visit first if we could travel anywhere for a long weekend?",
    followUp: "What would we cook for them when we arrived?",
  },
  {
    id: "q9",
    title: "Comfort Food Map",
    category: "deep",
    question:
      "What food did you eat growing up that always made you feel looked after?",
    followUp: "Have you ever made that dish for someone else?",
  },
  {
    id: "q10",
    title: "Argument Icebreakers",
    category: "playful",
    question:
      "What is a tiny, completely harmless disagreement we could have right now just for fun?",
    followUp: "How would we make peace with dessert?",
  },
  {
    id: "q11",
    title: "Five Years Forward",
    category: "dreams",
    question:
      "Where do you see us on a regular Sunday five years from now?",
    followUp: "What is one small step toward that picture?",
  },
  {
    id: "q12",
    title: "The Slow Morning",
    category: "romance",
    question:
      "What would a perfect slow morning with me look like — no phones, no plans?",
    followUp: "What would we eat first?",
  },
  {
    id: "q13",
    title: "Taste & Tells",
    category: "playful",
    question:
      "Pick a meal we both love. Now defend it against a challenger I invent on the spot.",
    followUp: "Does your defense hold up?",
  },
  {
    id: "q14",
    title: "What I Need From You",
    category: "deep",
    question:
      "When you are tired or low, what do you actually need from me — and what do you pretend you need?",
    followUp: "Can I do more of the first one this month?",
  },
  {
    id: "q15",
    title: "Recipe Interrogation",
    category: "playful",
    question:
      "Pick a recipe I should cook for you this week and talk me through every step as if I have never held a spatula.",
    followUp: "How badly do you trust my knife skills?",
  },
  {
    id: "q16",
    title: "The Table We'd Keep",
    category: "dreams",
    question:
      "If we could own one perfect table and nothing else, where would it sit and who would sit at it?",
    followUp: "What would we always eat there?",
  },
  {
    id: "q17",
    title: "Unsent Note",
    category: "romance",
    question:
      "Write the text you never sent me. I will read mine out loud after.",
    followUp: "Why did you hold it back at the time?",
  },
  {
    id: "q18",
    title: "Hard Things",
    category: "deep",
    question:
      "What is something you are quietly worried about that you have not told me yet?",
    followUp: "What would you like me to do while you think about it?",
  },
];
