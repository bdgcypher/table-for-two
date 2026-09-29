/**
 * Shared date-idea data. Deliberately free of React directives so it can be
 * imported by both Client Components (the wheel UI) and Server code (the
 * random-selection action in app/dates/actions.ts).
 */
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
