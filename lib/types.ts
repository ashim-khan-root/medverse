export type Difficulty = "easy" | "medium";

export type QuizQuestion = {
  id: string;
  topic: string;
  difficulty: Difficulty;
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  source: string;
  reviewedAt: string;
};

export type MythFact = {
  id: string;
  claim: string;
  verdict: "myth" | "fact";
  explanation: string;
  whyItMatters: string;
  source: string;
  reviewedAt: string;
};

export type BodyPart = {
  id: string;
  name: string;
  system: string;
  color: "mint" | "sky" | "peach" | "lavender" | "sun" | "coral" | "grape";
  hotspot: { x: number; y: number };
  whatItIs: string;
  whereItIs: string;
  whatItDoes: string;
  relatedIds: string[];
};

export type Habit = {
  id: string;
  label: string;
  icon: string;
  accent: "mint" | "sky" | "peach" | "lavender" | "sun";
  active: boolean;
};

export type HabitCheckIn = {
  habitId: string;
  date: string;
  completed: boolean;
};

export type MedicineResult = {
  id: string;
  productName: string;
  genericName?: string;
  uses?: string;
  warnings?: string;
  directions?: string;
  activeIngredients?: string;
  effectiveDate?: string;
  sourceUrl: string;
  source: "openFDA" | "fallback";
};

export type NearbyPlace = {
  id: string;
  name: string;
  type: "pharmacy" | "clinic" | "hospital";
  lat: number;
  lng: number;
  address?: string;
  distanceMeters?: number;
  mapsUrl: string;
  source: "OSM" | "fallback";
};

export type GeoPlace = {
  displayName: string;
  lat: number;
  lng: number;
};
