/**
 * Shared "specials" data. Deliberately free of React directives so it can be
 * imported by both Client Components and, later, Server code.
 *
 * This is the single source of truth for the daily specials. The home page
 * "Today's Specials" carousel renders a short `prompt`; the /menu page renders
 * the longer `description`. Both come from the same record, so a wording
 * change can never silently diverge between the two screens.
 */

export type SpecialCategory = "entree" | "side_dessert";

export interface Special {
  id: string;
  title: string;
  category: SpecialCategory;
  /** Prep time, shown on both screens. */
  time: string;
  /** Filled heart rating used by the menu. */
  priceTag: string;
  /** Short teaser for the home carousel card. */
  prompt: string;
  /** Full copy for the /menu list. */
  description: string;
  recipePairing?: string;
  /** Image used by the home carousel. Only some specials have artwork. */
  image?: string;
  imageAlt?: string;
  difficulty?: string;
  badge?: string;
  /** Display label for the carousel chip. */
  showcaseLabel?: string;
}

export const SPECIALS: Special[] = [
  {
    id: "e1",
    title: "Affirmations & Cinnamon Crepe",
    category: "entree",
    time: "20 mins",
    priceTag: "♥♥",
    prompt:
      "Pen a heartfelt note sharing something you deeply admire about your partner. Top it with spontaneous spoken compliments and a drizzle of surprise flirty texts.",
    description:
      "Pen a heartfelt note sharing something you deeply admire about your partner. Top it with a generous helping of spontaneous spoken compliments, finished with a drizzle of surprise flirty texts throughout the day.",
    recipePairing: "Pairs beautifully with a warm hug 🫂",
    image: "/specials-crepe.jpg",
    imageAlt: "A golden crepe folded on a plate with ice cream and syrup",
    difficulty: "Medium",
    badge: "Words of Affirmation 💬",
    showcaseLabel: "Grand Gesture",
  },
  {
    id: "e2",
    title: "Quality Thyme Together Tart",
    category: "entree",
    time: "35 mins",
    priceTag: "♥♥♥",
    prompt:
      "Clear the evening entirely — no phones, no screens — and do something your partner genuinely loves.",
    description:
      "Clear the evening entirely — no phones, no screens. Do something your partner genuinely loves, and let the thyme remind you both to slow down and savor each other's company.",
    recipePairing: "Season with patience and one long hug",
    difficulty: "Medium",
    badge: "Quality Time 🕰️",
    showcaseLabel: "Grand Gesture",
  },
  {
    id: "e3",
    title: "Serviceberry Surprise Pie",
    category: "entree",
    time: "15 mins",
    priceTag: "♥♥♥",
    prompt:
      "Secretly tackle one dreaded task from your partner's to-do list — just pure love in action.",
    description:
      "Secretly tackle one dreaded task from your partner's to-do list. Fill their gas tank, deep-clean the kitchen, or prep their work lunches — no fanfare, just pure love in action.",
    recipePairing: "Serve with a knowing smile",
    difficulty: "Easy",
    badge: "Act of Service 🫶",
    showcaseLabel: "Grand Gesture",
  },
  {
    id: "e4",
    title: "Cuddle Crumb Cake",
    category: "entree",
    time: "30 mins",
    priceTag: "♥♥",
    prompt:
      "Trade a long, screen-free cuddle for the first slice — the crumb cake is only the excuse.",
    description:
      "Trade a long, screen-free cuddle for the first slice. The crumb cake is only an excuse to lie together, and the crumbs are worth it.",
    recipePairing: "Best served horizontal",
    image: "/specials-crumb-cake.jpg",
    imageAlt: "A slice of crumb cake on a plate, dusted with crumbs",
    difficulty: "Easy",
    badge: "Sweet Connection 🍰",
    showcaseLabel: "Sweet Finish",
  },
  {
    id: "s1",
    title: "Compliment Covered Strawberry",
    category: "side_dessert",
    time: "5 mins",
    priceTag: "♥",
    prompt:
      "Dip strawberries in chocolate, then say one genuine compliment per berry before handing them over.",
    description:
      "Dip strawberries in chocolate, then say one genuine, specific compliment for every single berry before handing them over.",
    image: "/specials-strawberry.jpg",
    imageAlt: "Chocolate covered strawberries arranged on a plate",
    difficulty: "Easy",
    badge: "Words of Affirmation 💬",
    showcaseLabel: "Sweet Finish",
  },
  {
    id: "s2",
    title: "Hand-in-Hand Honeycomb",
    category: "side_dessert",
    time: "10 mins",
    priceTag: "♥",
    prompt:
      "Pull a piece of honeycomb apart between you both — whoever gets the bigger piece owes the first smile.",
    description:
      "Pull a piece of honeycomb apart between you both. Whoever ends up with the bigger piece owes the first genuine smile of the evening.",
    difficulty: "Easy",
    badge: "Playful Challenge 😄",
  },
  {
    id: "s3",
    title: "Love Note Macaron",
    category: "side_dessert",
    time: "25 mins",
    priceTag: "♥♥",
    prompt:
      "Hide a handwritten note inside a macaron box, one note per color, and watch them find them all.",
    description:
      "Hide a handwritten note inside a macaron box — one secret note per color — and watch them find every single one.",
    difficulty: "Medium",
    badge: "Written Words ✍️",
  },
  {
    id: "s4",
    title: "Unplugged Parfait",
    category: "side_dessert",
    time: "10 mins",
    priceTag: "♥",
    prompt:
      "Build parfaits together with the phones in another room. The mess is the point.",
    description:
      "Build parfaits together with every phone in another room. The messy, unhurried process is the entire point of the recipe.",
    difficulty: "Easy",
    badge: "Device-Free Treat 📵",
  },
  {
    id: "s5",
    title: "Chocolate Love-a Cake",
    category: "side_dessert",
    time: "45 mins",
    priceTag: "♥♥♥",
    prompt:
      "Bake one oversized love-a cake together and split it without a knife or plate.",
    description:
      "Bake one oversized love-a cake together, then split it without a knife or a plate, using your hands and considerable affection.",
    recipePairing: "Messy cleanup included",
    difficulty: "Medium",
    badge: "Bake Together 🧑‍🍳",
  },
];

/**
 * The subset featured in the home "Today's Specials" carousel — those that
 * have artwork. Both are also real menu items; see SPECIALS above.
 *
 * Typed so `image`/`imageAlt` are guaranteed present, which lets the carousel
 * pass them straight to next/image without a runtime check.
 */
export type ShowcaseSpecial = Special & {
  image: string;
  imageAlt: string;
};

export const SHOWCASE_SPECIALS: ShowcaseSpecial[] = SPECIALS.filter(
  (special): special is ShowcaseSpecial => special.image !== undefined
);

export const ENTREES = SPECIALS.filter((s) => s.category === "entree");
export const SIDE_DESSERTS = SPECIALS.filter((s) => s.category === "side_dessert");
