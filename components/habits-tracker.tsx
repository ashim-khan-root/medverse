"use client";

import { useState } from "react";
import {
  Activity,
  BookOpen,
  Check,
  Droplets,
  Flame,
  Moon,
  Settings2,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type { Habit } from "@/lib/types";
import { completedOn, computeStreak, lastNDates } from "@/lib/habits";
import { saveCheckIns, saveHabits } from "@/lib/storage";
import { useCheckIns, useHabits, useToday } from "@/lib/use-store";

const iconMap: Record<string, typeof Droplets> = {
  droplet: Droplets,
  activity: Activity,
  moon: Moon,
  smartphone: Smartphone,
  book: BookOpen,
};

const accentMap: Record<Habit["accent"], string> = {
  mint: "bg-mint-soft text-[#1c5f49]",
  sky: "bg-sky-soft text-[#1d5878]",
  peach: "bg-peach-soft text-[#8a4419]",
  lavender: "bg-lavender-soft text-[#4b3a86]",
  sun: "bg-sun-soft text-[#7a5a00]",
};

export function HabitsTracker() {
  const habits = useHabits();
  const checkIns = useCheckIns();
  const [showSettings, setShowSettings] = useState(false);
  const today = useToday();

  if (!today) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl bg-white/50">
        <span className="text-sm font-bold text-muted">Loading your habits…</span>
      </div>
    );
  }

  const activeHabits = habits.filter((h) => h.active);
  const doneToday = completedOn(checkIns, today);
  const doneCount = activeHabits.filter((h) => doneToday.has(h.id)).length;
  const pct = activeHabits.length
    ? Math.round((doneCount / activeHabits.length) * 100)
    : 0;
  const streak = computeStreak(checkIns, activeHabits.map((h) => h.id), today);
  const days = lastNDates(14, today);
  const week = lastNDates(7, today);

  function toggle(habitId: string) {
    const existing = checkIns.find(
      (c) => c.habitId === habitId && c.date === today,
    );
    const next = existing
      ? checkIns.map((c) =>
          c === existing ? { ...c, completed: !c.completed } : c,
        )
      : [...checkIns, { habitId, date: today, completed: true }];
    saveCheckIns(next);
  }

  function toggleActive(habitId: string) {
    const next = habits.map((habit) =>
      habit.id === habitId ? { ...habit, active: !habit.active } : habit,
    );
    saveHabits(next);
  }

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div
          className="relative grid size-28 shrink-0 place-items-center rounded-full shadow-lg shadow-mint/30"
          style={{
            background: `conic-gradient(#6fd3ac ${pct}%, rgba(255,255,255,0.85) ${pct}%)`,
          }}
          role="img"
          aria-label={`${pct} percent of today's habits complete`}
        >
          <div className="grid size-[86px] place-items-center rounded-full bg-white">
            <div className="text-center">
              <p className="text-2xl font-black leading-none">{pct}%</p>
              <p className="mt-1 text-[10px] font-extrabold uppercase tracking-wider text-muted">
                today
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-peach-soft px-3 py-1.5 text-xs font-extrabold text-[#8a4419]">
              <Flame className="size-3.5" aria-hidden />
              {streak} day{streak === 1 ? "" : "s"} streak
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-soft px-3 py-1.5 text-xs font-extrabold text-[#1c5f49]">
              <Sparkles className="size-3.5" aria-hidden />
              {doneCount}/{activeHabits.length} done
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-muted">
            Check in with yourself — small habits count. Missed days are neutral,
            not failures.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-2.5">
        {activeHabits.length === 0 ? (
          <p className="rounded-2xl bg-white/60 px-4 py-6 text-center text-sm font-bold text-muted">
            All habits are hidden. Open “Customise” to add some back.
          </p>
        ) : null}

        {activeHabits.map((habit) => {
          const Icon = iconMap[habit.icon] ?? Sparkles;
          const done = doneToday.has(habit.id);
          return (
            <button
              key={habit.id}
              type="button"
              onClick={() => toggle(habit.id)}
              aria-pressed={done}
              className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                done
                  ? "border-transparent bg-mint-soft"
                  : "border-white/70 bg-white/70 hover:-translate-y-0.5 hover:bg-white"
              }`}
            >
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-2xl ${
                  done ? "bg-white/80 text-[#1c5f49]" : accentMap[habit.accent]
                }`}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="flex-1 text-sm font-extrabold">{habit.label}</span>
              <span
                className={`grid size-6 place-items-center rounded-full border-2 ${
                  done
                    ? "border-[#4bb58e] bg-[#4bb58e] text-white"
                    : "border-line text-transparent"
                }`}
                aria-hidden
              >
                <Check className="size-4" />
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted">
            Last 14 days
          </h2>
          <span className="text-[11px] font-bold text-muted">more green = more done</span>
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {days.map((date) => {
            const done = completedOn(checkIns, date);
            const count = activeHabits.filter((h) => done.has(h.id)).length;
            const ratio = activeHabits.length ? count / activeHabits.length : 0;
            const label = new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
              weekday: "short",
            });
            return (
              <div key={date} className="text-center">
                <div
                  className="grid aspect-square place-items-center rounded-xl text-[10px] font-black"
                  style={{
                    background:
                      ratio === 0
                        ? "rgba(255,255,255,0.6)"
                        : `rgba(111, 211, 172, ${0.25 + ratio * 0.7})`,
                    color: ratio > 0.55 ? "#123a2c" : "#6b6478",
                  }}
                  title={`${date}: ${count}/${activeHabits.length} habits`}
                >
                  {count > 0 ? count : ""}
                </div>
                <span className="mt-1 block text-[9px] font-bold uppercase text-muted">
                  {label.slice(0, 1)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-bold text-muted">
          <span>{week[0]}</span>
          <span>today</span>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowSettings((s) => !s)}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted transition hover:text-ink"
          aria-expanded={showSettings}
        >
          <Settings2 className="size-3.5" aria-hidden />
          Customise habits
        </button>

        {showSettings ? (
          <div className="mt-2 grid gap-1.5 rounded-2xl bg-white/60 p-3">
            {habits.map((habit) => (
              <label
                key={habit.id}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-sm font-bold"
              >
                <span>{habit.label}</span>
                <input
                  type="checkbox"
                  checked={habit.active}
                  onChange={() => toggleActive(habit.id)}
                  className="size-4 accent-[#4bb58e]"
                />
              </label>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
