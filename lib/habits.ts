import { localDateISO } from "./utils";
import type { HabitCheckIn } from "./types";

export function lastNDates(n: number, endISO: string): string[] {
  const end = new Date(`${endISO}T12:00:00`);
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    out.push(localDateISO(d));
  }
  return out;
}

export function completedOn(checkIns: HabitCheckIn[], date: string): Set<string> {
  return new Set(
    checkIns.filter((c) => c.date === date && c.completed).map((c) => c.habitId),
  );
}

export function computeStreak(
  checkIns: HabitCheckIn[],
  habitIds: string[],
  todayISO: string,
): number {
  if (habitIds.length === 0) return 0;
  const active = new Set(
    checkIns.filter((c) => c.completed && habitIds.includes(c.habitId)).map((c) => c.date),
  );
  if (active.size === 0) return 0;

  const cursor = new Date(`${todayISO}T12:00:00`);
  if (!active.has(localDateISO(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!active.has(localDateISO(cursor))) return 0;
  }

  let streak = 0;
  while (active.has(localDateISO(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
