"use client";

import { useSyncExternalStore } from "react";
import type { Habit, HabitCheckIn } from "./types";
import { localDateISO } from "./utils";
import {
  getCheckInsSnapshot,
  getDefaultCheckIns,
  getDefaultHabits,
  getHabitsSnapshot,
  subscribeStorage,
} from "./storage";

export function useHabits(): Habit[] {
  return useSyncExternalStore(
    subscribeStorage,
    getHabitsSnapshot,
    getDefaultHabits,
  );
}

export function useCheckIns(): HabitCheckIn[] {
  return useSyncExternalStore(
    subscribeStorage,
    getCheckInsSnapshot,
    getDefaultCheckIns,
  );
}

const noopSubscribe = () => () => {};
const getToday = () => localDateISO(new Date());
const getNoDate = () => "";

export function useToday(): string {
  return useSyncExternalStore(noopSubscribe, getToday, getNoDate);
}
