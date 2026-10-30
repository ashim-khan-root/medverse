"use client";

import Link from "next/link";
import { Flame, Sparkles } from "lucide-react";
import { useCheckIns, useHabits, useToday } from "@/lib/use-store";
import { completedOn, computeStreak } from "@/lib/habits";

export function HomeProgress() {
  const habits = useHabits().filter((habit) => habit.active);
  const checkIns = useCheckIns();
  const today = useToday();

  if (!today) {
    return (
      <div className="flex h-full flex-col gap-3" aria-hidden>
        <div className="h-6 w-28 animate-pulse rounded-full bg-white/70" />
        <div className="h-8 w-32 animate-pulse rounded-xl bg-white/70" />
        <div className="h-3 w-full animate-pulse rounded-full bg-white/70" />
        <div className="h-4 w-40 animate-pulse rounded-full bg-white/70" />
      </div>
    );
  }

  const done = completedOn(checkIns, today);
  const doneCount = habits.filter((h) => done.has(h.id)).length;
  const streak = computeStreak(
    checkIns,
    habits.map((h) => h.id),
    today,
  );
  const pct = habits.length ? Math.round((doneCount / habits.length) * 100) : 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-mint-soft px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#1c5f49]">
          <Sparkles className="size-3.5" aria-hidden />
          Your today
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#8a4419]">
          <Flame className="size-4" aria-hidden />
          {streak} day{streak === 1 ? "" : "s"}
        </span>
      </div>

      <p className="mt-4 text-2xl font-black">
        {doneCount}
        <span className="text-muted">/{habits.length} habits</span>
      </p>

      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-white/80 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-mint to-sky transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {habits.slice(0, 5).map((habit) => (
          <span
            key={habit.id}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
              done.has(habit.id)
                ? "bg-mint-soft text-[#1c5f49]"
                : "bg-white/70 text-muted"
            }`}
          >
            {habit.label}
          </span>
        ))}
      </div>

      <Link
        href="/habits"
        className="mt-4 inline-flex items-center gap-1 text-sm font-extrabold text-grape hover:underline"
      >
        Check in →
      </Link>
    </div>
  );
}
