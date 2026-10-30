import habitsSeed from "@/content/habits.json";
import type { Habit, HabitCheckIn } from "./types";

const HABITS_KEY = "medverse.habits.v1";
const CHECKINS_KEY = "medverse.checkins.v1";

const DEFAULT_HABITS = habitsSeed as Habit[];
const EMPTY_CHECKINS: HabitCheckIn[] = [];

const cache = new Map<string, { raw: string | null; value: unknown }>();
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function readCached<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    return fallback;
  }

  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;

  let value: unknown = fallback;
  if (raw) {
    try {
      value = JSON.parse(raw);
    } catch {
      value = fallback;
    }
  }

  cache.set(key, { raw, value });
  return value as T;
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be unavailable (private mode) — keep the UI responsive */
  }
  emit();
}

export function subscribeStorage(callback: () => void) {
  listeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
}

export function getHabitsSnapshot(): Habit[] {
  return readCached(HABITS_KEY, DEFAULT_HABITS);
}

export function getCheckInsSnapshot(): HabitCheckIn[] {
  return readCached(CHECKINS_KEY, EMPTY_CHECKINS);
}

export function getDefaultHabits(): Habit[] {
  return DEFAULT_HABITS;
}

export function getDefaultCheckIns(): HabitCheckIn[] {
  return EMPTY_CHECKINS;
}

export function saveHabits(habits: Habit[]) {
  writeJSON(HABITS_KEY, habits);
}

export function saveCheckIns(checkIns: HabitCheckIn[]) {
  writeJSON(CHECKINS_KEY, checkIns);
}
